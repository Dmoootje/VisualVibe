import "server-only";

import type { DocumentReference, Transaction } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import {
  activeAnalysisEntries,
  entriesInWindow,
  latestBlockingLimit,
  resetAtForWindow,
  type WindowQuotaEntry,
} from "@/lib/analyse/quotaWindow";
import { hmacIdentifier } from "@/lib/security/encryption";
import type { AnalysisQuotaConfig } from "@/types/analysis";

const QUOTA_COLLECTION = "analysis_quota";
const RESERVATIONS_COLLECTION = "analysis_reservations";
const SETTINGS_COLLECTION = "analysis_settings";
const SETTINGS_ID = "default";

/** 91 dagen technische retentie, ruim boven het maximale quotavenster van 30 dagen. */
const RETENTION_MS = 91 * 24 * 60 * 60_000;
const DAY_MS = 24 * 60 * 60_000;
/**
 * Leasetijd voor een reservering. Een "reserved"-entry telt hoogstens zo lang
 * mee voor de e-mail-/device-limieten; blijft een reservering langer open
 * (proces gecrasht of platform-timeout tussen reserve en consume/release),
 * dan valt ze vanzelf weg en komt het tegoed vrij, zonder cron. Ruim boven de
 * gebruikelijke runtijd en boven het verify-routebudget (maxDuration 300s).
 */
const RESERVATION_LEASE_MS = 8 * 60_000;

type QuotaEntry = WindowQuotaEntry;

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

export type QuotaLimitOutcome = {
  decision:
    | "limit_email"
    | "limit_device"
    | "limit_domain_recent"
    | "limit_ip_daily"
    | "limit_ip_monthly"
    | "duplicate_request";
  reason: string;
  resetsAt: string;
};

export type QuotaOutcome =
  | { decision: "allowed" | "allowed_extra_credit"; reservationId: string }
  | QuotaLimitOutcome;

export type IpLimitOutcome = {
  decision: "limit_ip_daily" | "limit_ip_monthly";
  reason: string;
  resetsAt: string;
};

export type IpAttemptOutcome = { decision: "allowed" } | IpLimitOutcome;

export class AnalysisMaintenanceError extends Error {
  constructor() {
    super("Nieuwe analyses zijn tijdelijk geblokkeerd door de onderhoudsmodus.");
    this.name = "AnalysisMaintenanceError";
  }
}

function scopeRef(docId: string): DocumentReference {
  return adminDb.collection(QUOTA_COLLECTION).doc(docId);
}

function settingsRef(): DocumentReference {
  return adminDb.collection(SETTINGS_COLLECTION).doc(SETTINGS_ID);
}

function assertMaintenanceDisabled(settingsData: Record<string, unknown> | undefined): void {
  if (settingsData?.maintenanceMode === true) {
    throw new AnalysisMaintenanceError();
  }
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

/**
 * Controleert en registreert een IP-poging in dezelfde transactie. Daardoor
 * kunnen gelijktijdige aanvragen samen nooit over de limiet heen schrijven.
 */
export async function checkAndRegisterIpAttempt(
  input: QuotaCheckInput,
): Promise<IpAttemptOutcome> {
  const ipRef = input.ipHash ? scopeRef(input.ipHash) : undefined;

  return adminDb.runTransaction(async (transaction): Promise<IpAttemptOutcome> => {
    const now = Date.now();
    const nowIso = new Date(now).toISOString();
    const settingsDocument = await transaction.get(settingsRef());
    assertMaintenanceDisabled(settingsDocument.data());
    if (!input.config.enabled || !ipRef) return { decision: "allowed" };

    const ipScope = await readScope(transaction, ipRef, now);
    const dailyEntries = entriesInWindow(ipScope.entries, ["attempt"], now - DAY_MS);
    const monthlyEntries = entriesInWindow(ipScope.entries, ["attempt"], now - 30 * DAY_MS);
    const blocks: IpLimitOutcome[] = [];

    if (input.config.maxPerIp24h > 0 && dailyEntries.length >= input.config.maxPerIp24h) {
      blocks.push({
        decision: "limit_ip_daily",
        reason: "Te veel aanvragen vanaf dit netwerk in de afgelopen 24 uur.",
        resetsAt: resetAtForWindow(dailyEntries, DAY_MS, input.config.maxPerIp24h),
      });
    }
    if (input.config.maxPerIp30d > 0 && monthlyEntries.length >= input.config.maxPerIp30d) {
      blocks.push({
        decision: "limit_ip_monthly",
        reason: "Het maandelijkse maximum aan aanvragen vanaf dit netwerk is bereikt.",
        resetsAt: resetAtForWindow(monthlyEntries, 30 * DAY_MS, input.config.maxPerIp30d),
      });
    }
    if (blocks.length > 0) return latestBlockingLimit(blocks);

    ipScope.entries.push({ t: nowIso, kind: "attempt" });
    writeScope(transaction, ipScope, nowIso);
    return { decision: "allowed" };
  });
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
  const domainRef = scopeRef(domainScopeId(input.normalizedDomain));
  const comboRef = scopeRef(comboScopeId(input));

  return adminDb.runTransaction(async (transaction): Promise<QuotaOutcome> => {
    const now = Date.now();
    const nowIso = new Date(now).toISOString();
    const blocks: QuotaLimitOutcome[] = [];

    const settingsDocument = await transaction.get(settingsRef());
    assertMaintenanceDisabled(settingsDocument.data());
    if (!config.enabled) return { decision: "allowed", reservationId: "" };

    const [emailScope, domainScope, comboScope, deviceScope] = await Promise.all([
      readScope(transaction, emailRef, now),
      readScope(transaction, domainRef, now),
      readScope(transaction, comboRef, now),
      deviceRef ? readScope(transaction, deviceRef, now) : Promise.resolve(undefined),
    ]);

    // 1. Duplicaat: dezelfde e-mail+device+domein-combinatie die binnen het
    // venster al een reservering of succes had. "attempt"-entries tellen hier
    // bewust niet mee. De IP-poging is bij /start al apart geaccepteerd.
    const duplicateWindowMs = config.duplicateWindowMinutes * 60_000;
    const duplicateEntries = entriesInWindow(
      comboScope.entries,
      ["reserved", "success"],
      now - duplicateWindowMs,
    );
    if (duplicateEntries.length > 0) {
      blocks.push({
        decision: "duplicate_request",
        reason: "Deze aanvraag is zonet al ingediend. Probeer het later opnieuw.",
        resetsAt: resetAtForWindow(duplicateEntries, duplicateWindowMs, 1),
      });
    }

    // 2. E-mail- en devicequota over de afgelopen 24 uur. Bereken alle
    // blokkeringen voordat er een wordt teruggegeven, zodat resetsAt echt het
    // moment is waarop de aanvraag weer bruikbaar wordt.
    const dayAgo = now - DAY_MS;
    const emailEntries = activeAnalysisEntries(
      emailScope.entries,
      dayAgo,
      now,
      RESERVATION_LEASE_MS,
    );
    const emailLimitReached =
      config.maxPerEmail24h > 0 && emailEntries.length >= config.maxPerEmail24h;
    const usesExtraCredit = emailLimitReached && emailScope.extraCredits > 0;

    if (emailLimitReached && !usesExtraCredit) {
      blocks.push({
        decision: "limit_email",
        reason: "Het maximum aantal gratis analyses voor dit e-mailadres is bereikt.",
        resetsAt: resetAtForWindow(
          emailEntries,
          DAY_MS,
          config.maxPerEmail24h,
          RESERVATION_LEASE_MS,
        ),
      });
    }

    if (deviceScope && config.maxPerDevice24h > 0) {
      const deviceEntries = activeAnalysisEntries(
        deviceScope.entries,
        dayAgo,
        now,
        RESERVATION_LEASE_MS,
      );
      if (deviceEntries.length >= config.maxPerDevice24h) {
        blocks.push({
          decision: "limit_device",
          reason: "Het maximum aantal gratis analyses voor dit apparaat is bereikt.",
          resetsAt: resetAtForWindow(
            deviceEntries,
            DAY_MS,
            config.maxPerDevice24h,
            RESERVATION_LEASE_MS,
          ),
        });
      }
    }

    if (blocks.length > 0 && input.ipHash) {
      const ipScope = await readScope(transaction, scopeRef(input.ipHash), now);
      const dailyEntries = entriesInWindow(ipScope.entries, ["attempt"], now - DAY_MS);
      const monthlyEntries = entriesInWindow(ipScope.entries, ["attempt"], now - 30 * DAY_MS);

      if (config.maxPerIp24h > 0 && dailyEntries.length >= config.maxPerIp24h) {
        blocks.push({
          decision: "limit_ip_daily",
          reason: "Te veel aanvragen vanaf dit netwerk in de afgelopen 24 uur.",
          resetsAt: resetAtForWindow(dailyEntries, DAY_MS, config.maxPerIp24h),
        });
      }
      if (config.maxPerIp30d > 0 && monthlyEntries.length >= config.maxPerIp30d) {
        blocks.push({
          decision: "limit_ip_monthly",
          reason: "Het maandelijkse maximum aan aanvragen vanaf dit netwerk is bereikt.",
          resetsAt: resetAtForWindow(monthlyEntries, 30 * DAY_MS, config.maxPerIp30d),
        });
      }
    }

    if (blocks.length > 0) return latestBlockingLimit(blocks);

    // 3. Toegestaan: reservering aanmaken en in alle aanwezige scopes een
    // "reserved"-entry wegschrijven (telt mee tot consume/release).
    const reservationRef = adminDb.collection(RESERVATIONS_COLLECTION).doc();
    const scopes = [emailScope, domainScope, comboScope, deviceScope].filter(
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
