import "server-only";

import type { DocumentReference, Transaction } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { hmacIdentifier } from "@/lib/security/encryption";
import type { AnalysisQuotaConfig } from "@/types/analysis";

const QUOTA_COLLECTION = "analysis_quota";
const RESERVATIONS_COLLECTION = "analysis_reservations";

/** Entries ouder dan 91 dagen (net boven het 90d-venster) worden gepruned. */
const RETENTION_MS = 91 * 24 * 60 * 60_000;
const DAY_MS = 24 * 60 * 60_000;
/**
 * Leasetijd voor een reservering. Een "reserved"-entry telt hoogstens zo lang
 * mee voor de e-mail-/device-limieten; blijft een reservering langer open
 * (proces gecrasht of platform-timeout tussen reserve en consume/release),
 * dan valt ze vanzelf weg en komt het tegoed vrij, zonder cron. Ruim boven de
 * echte runtijd (~45s) en de function-budget (maxDuration 60s).
 */
const RESERVATION_LEASE_MS = 5 * 60_000;

type QuotaEntryKind = "attempt" | "reserved" | "success";

type QuotaEntry = {
  t: string;
  kind: QuotaEntryKind;
  reservationId?: string;
};

type ScopeState = {
  ref: DocumentReference;
  entries: QuotaEntry[];
  extraCredits: number;
};

export type QuotaCheckInput = {
  emailNormalized: string;
  deviceHash?: string;
  ipHash?: string;
  normalizedDomain: string;
  config: AnalysisQuotaConfig;
};

export type QuotaOutcome =
  | { decision: "allowed" | "allowed_extra_credit"; reservationId: string }
  | {
      decision:
        | "limit_email"
        | "limit_device"
        | "limit_domain_recent"
        | "limit_ip_daily"
        | "limit_ip_monthly"
        | "duplicate_request";
      reason: string;
    };

function scopeRef(docId: string): DocumentReference {
  return adminDb.collection(QUOTA_COLLECTION).doc(docId);
}

function emailScopeId(emailNormalized: string): string {
  return hmacIdentifier(emailNormalized, "email-quota");
}

function domainScopeId(normalizedDomain: string): string {
  return hmacIdentifier(normalizedDomain, "domain-quota");
}

function comboScopeId(input: Pick<QuotaCheckInput, "emailNormalized" | "deviceHash" | "normalizedDomain">): string {
  return hmacIdentifier(
    `${input.emailNormalized}|${input.deviceHash ?? ""}|${input.normalizedDomain}`,
    "combo-quota",
  );
}

function parseEntries(raw: unknown, now: number): QuotaEntry[] {
  if (!Array.isArray(raw)) return [];
  const entries: QuotaEntry[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as Partial<QuotaEntry>;
    if (typeof candidate.t !== "string") continue;
    if (candidate.kind !== "attempt" && candidate.kind !== "reserved" && candidate.kind !== "success") continue;
    const time = Date.parse(candidate.t);
    if (!Number.isFinite(time) || now - time > RETENTION_MS) continue;
    entries.push({
      t: candidate.t,
      kind: candidate.kind,
      ...(typeof candidate.reservationId === "string" ? { reservationId: candidate.reservationId } : {}),
    });
  }
  return entries;
}

async function readScope(transaction: Transaction, ref: DocumentReference, now: number): Promise<ScopeState> {
  const doc = await transaction.get(ref);
  const data = doc.data();
  const rawCredits = data?.extraCredits;
  return {
    ref,
    entries: parseEntries(data?.entries, now),
    extraCredits:
      typeof rawCredits === "number" && Number.isInteger(rawCredits) && rawCredits > 0 ? rawCredits : 0,
  };
}

function writeScope(transaction: Transaction, scope: ScopeState, nowIso: string): void {
  transaction.set(scope.ref, {
    entries: scope.entries,
    extraCredits: scope.extraCredits,
    updatedAt: nowIso,
  });
}

function countSince(entries: QuotaEntry[], kinds: readonly QuotaEntryKind[], sinceMs: number): number {
  return entries.filter((entry) => kinds.includes(entry.kind) && Date.parse(entry.t) >= sinceMs).length;
}

/**
 * Telling voor de succes-limieten (e-mail/device): definitieve successen binnen
 * het 90d-venster plus nog-lopende reserveringen die binnen hun lease vallen.
 * Een gestrande reservering valt na de lease weg zodat het tegoed vrijkomt.
 */
function countForLimit(entries: QuotaEntry[], sinceMs: number, now: number): number {
  const leaseFloor = now - RESERVATION_LEASE_MS;
  return entries.filter((entry) => {
    const time = Date.parse(entry.t);
    if (entry.kind === "success") return time >= sinceMs;
    if (entry.kind === "reserved") return time >= leaseFloor;
    return false;
  }).length;
}

/**
 * Controleert alle quota EN reserveert atomisch in EEN transactie, zodat twee
 * gelijktijdige aanvragen samen nooit boven een limiet uit kunnen komen. Bij
 * "allowed" hoort altijd een reservering die later met consumeReservation
 * (succes) of releaseReservation (mislukt, telt niet mee) wordt afgesloten.
 */
export async function checkAndReserveQuota(input: QuotaCheckInput): Promise<QuotaOutcome> {
  const { config } = input;
  const emailRef = scopeRef(emailScopeId(input.emailNormalized));
  const deviceRef = input.deviceHash ? scopeRef(input.deviceHash) : undefined;
  const ipRef = input.ipHash ? scopeRef(input.ipHash) : undefined;
  const domainRef = scopeRef(domainScopeId(input.normalizedDomain));
  const comboRef = scopeRef(comboScopeId(input));

  return adminDb.runTransaction(async (transaction): Promise<QuotaOutcome> => {
    const now = Date.now();
    const nowIso = new Date(now).toISOString();

    const [emailScope, domainScope, comboScope, deviceScope, ipScope] = await Promise.all([
      readScope(transaction, emailRef, now),
      readScope(transaction, domainRef, now),
      readScope(transaction, comboRef, now),
      deviceRef ? readScope(transaction, deviceRef, now) : Promise.resolve(undefined),
      ipRef ? readScope(transaction, ipRef, now) : Promise.resolve(undefined),
    ]);

    // 1. IP-quota (attempt+reserved+success) per 24 uur en 30 dagen. Staat
    // bewust VOOR het hergebruik-pad, zodat ook hergebruik-aanvragen tegen de
    // netwerklimieten aanlopen (anti-misbruik mag niet omzeild worden).
    if (ipScope) {
      const allKinds = ["attempt", "reserved", "success"] as const;
      if (countSince(ipScope.entries, allKinds, now - DAY_MS) >= config.maxPerIp24h) {
        return {
          decision: "limit_ip_daily",
          reason: "Te veel aanvragen vanaf dit netwerk in de afgelopen 24 uur.",
        };
      }
      if (countSince(ipScope.entries, allKinds, now - 30 * DAY_MS) >= config.maxPerIp30d) {
        return {
          decision: "limit_ip_monthly",
          reason: "Het maandelijkse maximum aan aanvragen vanaf dit netwerk is bereikt.",
        };
      }
    }

    // 2. Duplicaat: dezelfde e-mail+device+domein-combinatie die binnen het
    // venster al een reservering of succes had. "attempt"-entries tellen hier
    // bewust NIET mee: /start registreert een attempt en zou anders zijn eigen
    // /verify-stap blokkeren.
    const duplicateSince = now - config.duplicateWindowMinutes * 60_000;
    if (countSince(comboScope.entries, ["reserved", "success"], duplicateSince) > 0) {
      return {
        decision: "duplicate_request",
        reason: "Deze aanvraag is zonet al ingediend. Probeer het later opnieuw.",
      };
    }

    // 3. E-mailquotum (90 dagen), met eventueel door de admin toegekende
    // extra credits bovenop het standaardmaximum. Gestrande reserveringen
    // (ouder dan de lease) tellen niet mee, zodat een gecrashte run het
    // tegoed niet 90 dagen vasthoudt.
    const ninetyDaysAgo = now - 90 * DAY_MS;
    const emailCount = countForLimit(emailScope.entries, ninetyDaysAgo, now);
    if (emailCount >= config.maxPerEmail24h + emailScope.extraCredits) {
      return {
        decision: "limit_email",
        reason: "Het maximum aantal gratis analyses voor dit e-mailadres is bereikt.",
      };
    }
    const usesExtraCredit = emailCount >= config.maxPerEmail24h && emailScope.extraCredits > 0;

    // 4. Devicequotum (90 dagen), zelfde lease-behandeling.
    if (deviceScope) {
      const deviceCount = countForLimit(deviceScope.entries, ninetyDaysAgo, now);
      if (deviceCount >= config.maxPerDevice24h) {
        return {
          decision: "limit_device",
          reason: "Het maximum aantal gratis analyses voor dit apparaat is bereikt.",
        };
      }
    }

    // 5. Toegestaan: reservering aanmaken en in alle aanwezige scopes een
    // "reserved"-entry wegschrijven (telt mee tot consume/release).
    const reservationRef = adminDb.collection(RESERVATIONS_COLLECTION).doc();
    const scopes = [emailScope, domainScope, comboScope, deviceScope, ipScope].filter(
      (scope): scope is ScopeState => scope !== undefined,
    );

    transaction.create(reservationRef, {
      status: "reserved",
      scopes: scopes.map((scope) => scope.ref.id),
      // Onthouden zodat een release (mislukte analyse) een verbruikt extra
      // credit exact terugzet op de juiste scope.
      usedExtraCredit: usesExtraCredit,
      emailScopeId: emailScope.ref.id,
      createdAt: nowIso,
      updatedAt: nowIso,
    });

    if (usesExtraCredit) {
      emailScope.extraCredits -= 1;
    }
    for (const scope of scopes) {
      scope.entries.push({ t: nowIso, kind: "reserved", reservationId: reservationRef.id });
      writeScope(transaction, scope, nowIso);
    }

    return {
      decision: usesExtraCredit ? "allowed_extra_credit" : "allowed",
      reservationId: reservationRef.id,
    };
  });
}

/** Zet een reservering om in een definitief succes (analyse afgerond). */
export async function consumeReservation(reservationId: string): Promise<void> {
  await finalizeReservation(reservationId, "consumed");
}

/** Geeft een reservering vrij (analyse mislukt/afgebroken); telt niet meer mee. */
export async function releaseReservation(reservationId: string): Promise<void> {
  await finalizeReservation(reservationId, "released");
}

async function finalizeReservation(
  reservationId: string,
  outcome: "consumed" | "released",
): Promise<void> {
  const reservationRef = adminDb.collection(RESERVATIONS_COLLECTION).doc(reservationId);

  await adminDb.runTransaction(async (transaction) => {
    const now = Date.now();
    const nowIso = new Date(now).toISOString();

    const reservation = await transaction.get(reservationRef);
    const data = reservation.data();
    // Idempotent: alleen een openstaande reservering kan worden afgesloten.
    if (!reservation.exists || data?.status !== "reserved") return;

    const scopeIds: string[] = Array.isArray(data.scopes)
      ? data.scopes.filter((id): id is string => typeof id === "string")
      : [];
    const scopes = await Promise.all(scopeIds.map((id) => readScope(transaction, scopeRef(id), now)));

    // Bij een release (mislukte analyse) een verbruikt extra credit teruggeven
    // op de e-mailscope; op consume (succes) blijft het verbruikt.
    const restoreCredit = outcome === "released" && data.usedExtraCredit === true;
    const emailScopeId = typeof data.emailScopeId === "string" ? data.emailScopeId : undefined;

    transaction.update(reservationRef, { status: outcome, updatedAt: nowIso });

    for (const scope of scopes) {
      if (outcome === "consumed") {
        scope.entries = scope.entries.map((entry) =>
          entry.reservationId === reservationId && entry.kind === "reserved"
            ? { ...entry, kind: "success" as const, t: nowIso }
            : entry,
        );
      } else {
        scope.entries = scope.entries.filter(
          (entry) => !(entry.reservationId === reservationId && entry.kind === "reserved"),
        );
      }
      if (restoreCredit && scope.ref.id === emailScopeId) {
        scope.extraCredits += 1;
      }
      writeScope(transaction, scope, nowIso);
    }
  });
}

/**
 * Registreert een aanvraagpoging (aangeroepen bij /start): alleen de ip- en
 * comboscope krijgen een "attempt"-entry, zodat code-spam per netwerk zichtbaar
 * meetelt zonder e-mail- of devicequota te verbruiken.
 */
export async function registerAttempt(input: QuotaCheckInput): Promise<void> {
  const ipRef = input.ipHash ? scopeRef(input.ipHash) : undefined;
  const comboRef = scopeRef(comboScopeId(input));
  const refs = [ipRef, comboRef].filter((ref): ref is DocumentReference => ref !== undefined);

  await adminDb.runTransaction(async (transaction) => {
    const now = Date.now();
    const nowIso = new Date(now).toISOString();
    const scopes = await Promise.all(refs.map((ref) => readScope(transaction, ref, now)));
    for (const scope of scopes) {
      scope.entries.push({ t: nowIso, kind: "attempt" });
      writeScope(transaction, scope, nowIso);
    }
  });
}

/** Admin: maakt het e-mailquotum leeg (entries weg, extra credits blijven). */
export async function resetQuotaForEmail(emailNormalized: string): Promise<void> {
  const ref = scopeRef(emailScopeId(emailNormalized));
  await adminDb.runTransaction(async (transaction) => {
    const now = Date.now();
    const scope = await readScope(transaction, ref, now);
    scope.entries = [];
    writeScope(transaction, scope, new Date(now).toISOString());
  });
}

/** Admin: kent extra analysecredits toe bovenop het e-mailquotum. */
export async function grantExtraCredits(emailNormalized: string, count: number): Promise<void> {
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error("Het aantal extra credits moet een geheel getal boven 0 zijn.");
  }
  const ref = scopeRef(emailScopeId(emailNormalized));
  await adminDb.runTransaction(async (transaction) => {
    const now = Date.now();
    const scope = await readScope(transaction, ref, now);
    scope.extraCredits += count;
    writeScope(transaction, scope, new Date(now).toISOString());
  });
}
