# Websiteanalysequota per 24 uur Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vervang de 90-dagenquota door voortschrijdende 24-uursquota, tel IP-aanvragen exact eenmaal, toon het correcte resetuur met SEO Supercharged-CTA's en voer na deploy een volledige quotareset uit.

**Architecture:** De pure tijdvensterlogica komt in een kleine, onafhankelijk testbare module. Firestore blijft de atomische bron voor IP-, e-mail- en toestelquota; API-responses dragen `quotaDecision` en `resetsAt` naar een afzonderlijke limietcomponent. Een expliciet beveiligd onderhoudsscript migreert alleen `analysis_settings/default` en wist alleen de twee quotacollecties.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Firebase Admin/Firestore, Vitest, Node test runner, Tailwind CSS, Firebase App Hosting.

## Global Constraints

- Gebruik voortschrijdende vensters, geen reset om middernacht.
- Limieten: 3 per e-mailadres per 24 uur, 3 per toestel per 24 uur, 12 per IP per 24 uur en 180 per IP per 30 dagen.
- Iedere toegestane aanvraag start een nieuwe analyse; hergebruik geen oud rapport.
- Tel een IP-startaanvraag exact eenmaal.
- Bewaar alleen HMAC-hashes voor e-mail-, toestel- en IP-quota.
- Bestaande leads, verificaties, rapporten en rapportlinks blijven behouden.
- CTA-links zijn exact `https://seowebsites.be/nl/seo-website-analyse` en `https://seowebsites.be/AIGEOprofiler/`.
- Externe CTA-links openen met `target="_blank"` en `rel="noopener noreferrer"`.
- Mobiele CTA-knoppen gebruiken de volledige breedte.
- Voeg geen afbeeldingen toe en introduceer geen gradient icon tile.
- Wijzig geen rapportcomponenten of bestaande groene scorekleuren.
- Gebruik nergens U+2014 of U+2015.
- Ontwerpbron: `docs/superpowers/specs/2026-07-15-analysis-quota-24h-design.md`.

---

## File Structure

- `src/types/analysis.ts`: actief quotacontract, leadvelden en API-unions.
- `src/lib/analyse/config.ts`: Firestore-instellingen samenvoegen en oude velden negeren.
- `src/lib/analyse/quotaWindow.ts`: pure selectie- en resetberekeningen voor voortschrijdende vensters.
- `src/lib/analyse/quotaWindow.test.ts`: grensgevallen voor 24 uur, 30 dagen en meerdere blokkeringen.
- `src/lib/analyse/quota.ts`: atomische IP-startteller en e-mail-/toestelreserveringen.
- `src/lib/analyse/quota.test.ts`: Firestore-transactieregressies voor alle vier limieten.
- `src/lib/analyse/limitResponse.ts`: een quotablokkering naar het gedeelde API-contract omzetten.
- `src/lib/analyse/limitResponse.test.ts`: API-payloadregressie.
- `src/app/api/analyse/start/route.ts`: IP-controle voor lead en verificatiemail.
- `src/app/api/analyse/verify/route.ts`: resetmetadata bewaren en teruggeven.
- `src/components/analyse/analysisLimitContent.ts`: Nederlandse tekst en Belgische tijdnotatie.
- `src/components/analyse/analysisLimitContent.test.ts`: copy-, tijdzone- en URL-regressies.
- `src/components/analyse/AnalysisLimitState.tsx`: zichtbaar VisualVibe-limietblok met twee CTA's.
- `src/components/analyse/AnalyseFlow.tsx`: limietpayload uit start en verify doorgeven.
- `src/components/admin/AnalysisSettingsForm.tsx`: nieuwe 24-uurslabels en standaardwaarden.
- `src/lib/admin/analysisSettingsActions.ts`: servervalidatie voor de nieuwe veldnamen.
- `scripts/lib/analysis-quota-rollout.mjs`: pure argumentvalidatie en productieconstanten.
- `scripts/lib/analysis-quota-rollout.test.mjs`: veiligheidstest voor rolloutargumenten.
- `scripts/apply-analysis-quota-rollout.mjs`: expliciete productieconfiguratie en quotareset.

---

### Task 1: Vervang het actieve configuratiecontract

**Files:**
- Create: `src/lib/analyse/config.test.ts`
- Modify: `src/types/analysis.ts:124-199`
- Modify: `src/lib/analyse/config.ts:11-37`
- Modify: `src/lib/analyse/quota.ts:198-209`
- Modify: `src/components/admin/AnalysisSettingsForm.tsx:15-63`
- Modify: `src/lib/admin/analysisSettingsActions.ts:19-30`

**Interfaces:**
- Produces: `AnalysisQuotaConfig.maxPerEmail24h`, `maxPerDevice24h`, `maxPerIp24h`, `maxPerIp30d`.
- Produces: `mergeWithDefaults(data): AnalysisQuotaConfig` as named export for deterministic tests.
- Consumers: Tasks 2, 3, 4 and 6.

- [ ] **Step 1: Write the failing configuration test**

```ts
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/firebase/admin", () => ({
  adminDb: { collection: vi.fn() },
}));

import { mergeWithDefaults } from "./config";
import { DEFAULT_ANALYSIS_QUOTA_CONFIG } from "@/types/analysis";

describe("analysis quota configuration", () => {
  it("uses the new rolling-window defaults", () => {
    expect(DEFAULT_ANALYSIS_QUOTA_CONFIG).toMatchObject({
      maxPerEmail24h: 3,
      maxPerDevice24h: 3,
      maxPerIp24h: 12,
      maxPerIp30d: 180,
    });
  });

  it("ignores legacy 90-day fields", () => {
    const config = mergeWithDefaults({
      maxPerEmail90d: 99,
      maxPerDevice90d: 99,
      maxPerIp24h: 12,
      maxPerIp30d: 180,
    });

    expect(config.maxPerEmail24h).toBe(3);
    expect(config.maxPerDevice24h).toBe(3);
    expect(config).not.toHaveProperty("maxPerEmail90d");
    expect(config).not.toHaveProperty("maxPerDevice90d");
  });
});
```

- [ ] **Step 2: Run the focused test and verify red**

Run: `npm test -- src/lib/analyse/config.test.ts`

Expected: FAIL because `mergeWithDefaults`, `maxPerEmail24h` and `maxPerDevice24h` do not exist yet.

- [ ] **Step 3: Rename the contract and defaults**

In `src/types/analysis.ts`, use:

```ts
export type AnalysisQuotaConfig = {
  enabled: boolean;
  maxPerEmail24h: number;
  maxPerDevice24h: number;
  maxPerIp24h: number;
  maxPerIp30d: number;
  maxCodesPerEmailPerHour: number;
  duplicateWindowMinutes: number;
  codeTtlMinutes: number;
  maxCodeAttempts: number;
};

export const DEFAULT_ANALYSIS_QUOTA_CONFIG: AnalysisQuotaConfig = {
  enabled: true,
  maxPerEmail24h: 3,
  maxPerDevice24h: 3,
  maxPerIp24h: 12,
  maxPerIp30d: 180,
  maxCodesPerEmailPerHour: 5,
  duplicateWindowMinutes: 2,
  codeTtlMinutes: 15,
  maxCodeAttempts: 5,
};
```

In `src/lib/analyse/config.ts`, rename the numeric keys and export the merger:

```ts
const NUMERIC_KEYS = [
  "maxPerEmail24h",
  "maxPerDevice24h",
  "maxPerIp24h",
  "maxPerIp30d",
  "maxCodesPerEmailPerHour",
  "duplicateWindowMinutes",
  "codeTtlMinutes",
  "maxCodeAttempts",
] as const satisfies readonly (keyof AnalysisQuotaConfig)[];

export function mergeWithDefaults(
  data: Record<string, unknown> | undefined,
): AnalysisQuotaConfig {
  const merged: AnalysisQuotaConfig = { ...DEFAULT_ANALYSIS_QUOTA_CONFIG };
  if (!data) return merged;

  if (typeof data.enabled === "boolean") merged.enabled = data.enabled;
  for (const key of NUMERIC_KEYS) {
    const value = data[key];
    if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
      merged[key] = value;
    }
  }
  return merged;
}
```

Mechanically rename the three existing quota references in `quota.ts` from `maxPerEmail90d` and `maxPerDevice90d` to the new 24-hour field names. Task 3 replaces the old window calculation itself.

- [ ] **Step 4: Update both admin field lists**

Use `maxPerEmail24h` and `maxPerDevice24h` in both admin files. The visible labels and hints must say `24 uur`; the IP defaults shown by the existing form must resolve to 12 and 180.

```ts
{
  key: "maxPerEmail24h",
  label: "Analyses per e-mailadres (24 uur)",
  hint: "Aantal succesvol afgeronde analyses dat een geverifieerd e-mailadres in 24 uur mag aanvragen.",
},
{
  key: "maxPerDevice24h",
  label: "Analyses per toestel (24 uur)",
  hint: "Aantal succesvol afgeronde analyses per toestel (gehashte first-party cookie) in 24 uur.",
},
```

- [ ] **Step 5: Run focused tests and TypeScript**

Run: `npm test -- src/lib/analyse/config.test.ts && npm run typecheck`

Expected: configuration tests PASS and TypeScript PASS.

- [ ] **Step 6: Commit the contract change**

```powershell
git add src/types/analysis.ts src/lib/analyse/config.ts src/lib/analyse/config.test.ts src/lib/analyse/quota.ts src/components/admin/AnalysisSettingsForm.tsx src/lib/admin/analysisSettingsActions.ts
git commit -m "refactor: vervang 90-dagenquota door 24 uur"
```

---

### Task 2: Voeg pure tijdvenster- en resetberekeningen toe

**Files:**
- Create: `src/lib/analyse/quotaWindow.ts`
- Create: `src/lib/analyse/quotaWindow.test.ts`

**Interfaces:**
- Produces: `entriesInWindow(entries, kinds, sinceMs): WindowQuotaEntry[]`.
- Produces: `activeAnalysisEntries(entries, sinceMs, now, reservationLeaseMs): WindowQuotaEntry[]`.
- Produces: `resetAtForWindow(entries, windowMs, limit): string`.
- Produces: `latestBlockingLimit(limits): T`.
- Consumers: Task 3.

- [ ] **Step 1: Write failing pure unit tests**

```ts
import { describe, expect, it } from "vitest";
import {
  activeAnalysisEntries,
  entriesInWindow,
  latestBlockingLimit,
  resetAtForWindow,
} from "./quotaWindow";

const NOW = Date.parse("2026-07-15T18:30:00.000Z");
const DAY_MS = 24 * 60 * 60_000;

describe("rolling quota windows", () => {
  it("drops a success at the exact 24-hour boundary", () => {
    const entries = [
      { t: "2026-07-14T18:30:00.000Z", kind: "success" as const },
      { t: "2026-07-14T18:30:00.001Z", kind: "success" as const },
    ];

    expect(entriesInWindow(entries, ["success"], NOW - DAY_MS)).toHaveLength(1);
  });

  it("counts only live reservations with successes", () => {
    const entries = [
      { t: "2026-07-15T18:29:00.000Z", kind: "reserved" as const },
      { t: "2026-07-15T18:20:00.000Z", kind: "reserved" as const },
      { t: "2026-07-15T17:00:00.000Z", kind: "success" as const },
    ];

    expect(activeAnalysisEntries(entries, NOW - DAY_MS, NOW, 5 * 60_000)).toHaveLength(2);
  });

  it("returns the expiry that actually creates one free slot", () => {
    const entries = [
      { t: "2026-07-15T10:00:00.000Z", kind: "attempt" as const },
      { t: "2026-07-15T11:00:00.000Z", kind: "attempt" as const },
      { t: "2026-07-15T12:00:00.000Z", kind: "attempt" as const },
      { t: "2026-07-15T13:00:00.000Z", kind: "attempt" as const },
    ];

    expect(resetAtForWindow(entries, DAY_MS, 3)).toBe("2026-07-16T11:00:00.000Z");
  });

  it("selects the latest reset when multiple limits block", () => {
    const selected = latestBlockingLimit([
      { decision: "limit_ip_daily" as const, resetsAt: "2026-07-16T10:00:00.000Z" },
      { decision: "limit_ip_monthly" as const, resetsAt: "2026-07-20T10:00:00.000Z" },
    ]);

    expect(selected.decision).toBe("limit_ip_monthly");
  });
});
```

- [ ] **Step 2: Run the test and verify red**

Run: `npm test -- src/lib/analyse/quotaWindow.test.ts`

Expected: FAIL because `quotaWindow.ts` does not exist.

- [ ] **Step 3: Implement the pure module**

```ts
export type WindowQuotaEntryKind = "attempt" | "reserved" | "success";

export type WindowQuotaEntry = {
  t: string;
  kind: WindowQuotaEntryKind;
  reservationId?: string;
};

export function entriesInWindow(
  entries: WindowQuotaEntry[],
  kinds: readonly WindowQuotaEntryKind[],
  sinceMs: number,
): WindowQuotaEntry[] {
  return entries.filter((entry) => {
    const time = Date.parse(entry.t);
    return Number.isFinite(time) && time > sinceMs && kinds.includes(entry.kind);
  });
}

export function activeAnalysisEntries(
  entries: WindowQuotaEntry[],
  sinceMs: number,
  now: number,
  reservationLeaseMs: number,
): WindowQuotaEntry[] {
  const leaseFloor = now - reservationLeaseMs;
  return entries.filter((entry) => {
    const time = Date.parse(entry.t);
    if (!Number.isFinite(time)) return false;
    if (entry.kind === "success") return time > sinceMs;
    if (entry.kind === "reserved") return time > leaseFloor;
    return false;
  });
}

export function resetAtForWindow(
  entries: WindowQuotaEntry[],
  windowMs: number,
  limit: number,
): string {
  if (!Number.isInteger(limit) || limit < 1 || entries.length < limit) {
    throw new Error("Resetmoment vereist een bereikt positief quotum.");
  }
  const sorted = [...entries].sort((a, b) => Date.parse(a.t) - Date.parse(b.t));
  const firstEntryThatMustExpire = sorted[sorted.length - limit];
  return new Date(Date.parse(firstEntryThatMustExpire.t) + windowMs).toISOString();
}

export function latestBlockingLimit<T extends { resetsAt: string }>(limits: T[]): T {
  if (limits.length === 0) {
    throw new Error("Minstens een blokkering is vereist.");
  }
  return [...limits].sort((a, b) => Date.parse(b.resetsAt) - Date.parse(a.resetsAt))[0];
}
```

- [ ] **Step 4: Run the pure tests**

Run: `npm test -- src/lib/analyse/quotaWindow.test.ts`

Expected: 4 tests PASS.

- [ ] **Step 5: Commit the time-window module**

```powershell
git add src/lib/analyse/quotaWindow.ts src/lib/analyse/quotaWindow.test.ts
git commit -m "feat: bereken voortschrijdende quotaresets"
```

---

### Task 3: Maak Firestorequota atomisch en tel IP eenmaal

**Files:**
- Modify: `src/lib/analyse/quota.ts:11-351`
- Modify: `src/lib/analyse/quota.test.ts:1-112`

**Interfaces:**
- Consumes: Task 1 quota field names.
- Consumes: Task 2 reset helpers.
- Produces: `QuotaLimitOutcome` with `decision`, `reason`, `resetsAt`.
- Produces: `checkAndRegisterIpAttempt(input): Promise<IpAttemptOutcome>`.
- Preserves: `checkAndReserveQuota`, `consumeReservation`, `releaseReservation`, `resetQuotaForEmail`, `grantExtraCredits`.
- Consumers: Task 4 API routes.

- [ ] **Step 1: Extend the Firestore fake to keep scope state**

Add a `Map<string, { entries: QuotaEntry[]; extraCredits: number }>` to the test and make transaction `get` and `set` read and write it. Add helpers with these exact signatures:

```ts
type TestEntry = {
  t: string;
  kind: "attempt" | "reserved" | "success";
  reservationId?: string;
};

const scopeData = new Map<string, { entries: TestEntry[]; extraCredits: number }>();

function seedScope(id: string, entries: TestEntry[]): void {
  scopeData.set(id, { entries, extraCredits: 0 });
}

function readScopeEntries(id: string): TestEntry[] {
  return scopeData.get(id)?.entries ?? [];
}
```

The transaction fake must persist every `set(ref, data)` into `scopeData` and return existing entries from `get(ref)`.

- [ ] **Step 2: Write failing quota behavior tests**

Add tests that use the production defaults and the fixed time `2026-07-15T18:30:00.000Z`:

```ts
it("allows three email successes in 24 hours and blocks the next", async () => {
  seedScope("email-quota:klant@example.com", [
    { t: "2026-07-15T10:00:00.000Z", kind: "success" },
    { t: "2026-07-15T11:00:00.000Z", kind: "success" },
    { t: "2026-07-15T12:00:00.000Z", kind: "success" },
  ]);

  const result = await checkAndReserveQuota({
    emailNormalized: "klant@example.com",
    deviceHash: "device-1",
    normalizedDomain: "voorbeeld.be",
    config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
  });

  expect(result).toEqual({
    decision: "limit_email",
    reason: "Het maximum aantal gratis analyses voor dit e-mailadres is bereikt.",
    resetsAt: "2026-07-16T10:00:00.000Z",
  });
});

it("shares the three-analysis device quota across email addresses", async () => {
  seedScope("device-1", [
    { t: "2026-07-15T10:00:00.000Z", kind: "success" },
    { t: "2026-07-15T11:00:00.000Z", kind: "success" },
    { t: "2026-07-15T12:00:00.000Z", kind: "success" },
  ]);

  const result = await checkAndReserveQuota({
    emailNormalized: "ander@example.com",
    deviceHash: "device-1",
    normalizedDomain: "voorbeeld.be",
    config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
  });

  expect(result).toMatchObject({
    decision: "limit_device",
    resetsAt: "2026-07-16T10:00:00.000Z",
  });
});

it("allows IP attempt 12 and blocks attempt 13", async () => {
  seedScope(
    "ip-1",
    Array.from({ length: 11 }, (_, index) => ({
      t: new Date(Date.parse("2026-07-15T10:00:00.000Z") + index * 60_000).toISOString(),
      kind: "attempt" as const,
    })),
  );

  await expect(checkAndRegisterIpAttempt({
    emailNormalized: "klant@example.com",
    ipHash: "ip-1",
    normalizedDomain: "voorbeeld.be",
    config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
  })).resolves.toEqual({ decision: "allowed" });

  await expect(checkAndRegisterIpAttempt({
    emailNormalized: "klant2@example.com",
    ipHash: "ip-1",
    normalizedDomain: "voorbeeld.be",
    config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
  })).resolves.toMatchObject({ decision: "limit_ip_daily" });

  expect(readScopeEntries("ip-1").filter((entry) => entry.kind === "attempt")).toHaveLength(12);
});

it("allows a new analysis when the oldest success is exactly 24 hours old", async () => {
  seedScope("email-quota:klant@example.com", [
    { t: "2026-07-14T18:30:00.000Z", kind: "success" },
    { t: "2026-07-15T10:00:00.000Z", kind: "success" },
    { t: "2026-07-15T11:00:00.000Z", kind: "success" },
  ]);

  await expect(checkAndReserveQuota({
    emailNormalized: "klant@example.com",
    normalizedDomain: "voorbeeld.be",
    config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
  })).resolves.toMatchObject({ decision: "allowed" });
});

it("does not count a released reservation", async () => {
  seedScope("email-quota:klant@example.com", [
    { t: "2026-07-15T10:00:00.000Z", kind: "success" },
    { t: "2026-07-15T11:00:00.000Z", kind: "success" },
    { t: "2026-07-15T18:29:00.000Z", kind: "reserved", reservationId: "failed-run" },
  ]);
  seedReservation("failed-run", {
    status: "reserved",
    scopes: ["email-quota:klant@example.com"],
    usedExtraCredit: false,
    emailScopeId: "email-quota:klant@example.com",
  });

  await releaseReservation("failed-run");

  await expect(checkAndReserveQuota({
    emailNormalized: "klant@example.com",
    normalizedDomain: "voorbeeld.be",
    config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
  })).resolves.toMatchObject({ decision: "allowed" });
});

it("allows IP attempt 180 and blocks attempt 181 in 30 days", async () => {
  seedScope(
    "ip-monthly",
    Array.from({ length: 179 }, (_, index) => ({
      t: new Date(Date.parse("2026-06-20T10:00:00.000Z") + index * 60 * 60_000).toISOString(),
      kind: "attempt" as const,
    })),
  );
  const input = {
    emailNormalized: "klant@example.com",
    ipHash: "ip-monthly",
    normalizedDomain: "voorbeeld.be",
    config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
  };

  await expect(checkAndRegisterIpAttempt(input)).resolves.toEqual({ decision: "allowed" });
  await expect(checkAndRegisterIpAttempt(input)).resolves.toMatchObject({
    decision: "limit_ip_monthly",
  });
});

it("returns the later monthly reset when both IP limits block", async () => {
  const older = Array.from({ length: 168 }, (_, index) => ({
    t: new Date(Date.parse("2026-06-20T10:00:00.000Z") + index * 60 * 60_000).toISOString(),
    kind: "attempt" as const,
  }));
  const recent = Array.from({ length: 12 }, (_, index) => ({
    t: new Date(Date.parse("2026-07-15T10:00:00.000Z") + index * 60_000).toISOString(),
    kind: "attempt" as const,
  }));
  seedScope("ip-both", [...older, ...recent]);

  const result = await checkAndRegisterIpAttempt({
    emailNormalized: "klant@example.com",
    ipHash: "ip-both",
    normalizedDomain: "voorbeeld.be",
    config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
  });

  expect(result.decision).toBe("limit_ip_monthly");
  expect("resetsAt" in result ? result.resetsAt : "").toBe("2026-07-20T10:00:00.000Z");
});
```

Add this reservation state beside `scopeData` and pass `update: firestore.update` in the transaction fake so `releaseReservation` exercises the real finalization path:

```ts
type TestReservation = {
  status: "reserved" | "consumed" | "released";
  scopes: string[];
  usedExtraCredit: boolean;
  emailScopeId: string;
};

const reservationData = new Map<string, TestReservation>();

function seedReservation(id: string, reservation: TestReservation): void {
  reservationData.set(id, reservation);
}

firestore.update.mockImplementation((ref: FakeDocumentReference, patch: Partial<TestReservation>) => {
  const current = reservationData.get(ref.id);
  if (current) reservationData.set(ref.id, { ...current, ...patch });
});
```

Use this branch at the top of the fake document `get`, and clear both maps in `beforeEach`:

```ts
if (target.collection === "analysis_reservations") {
  const reservation = reservationData.get(target.id);
  return {
    exists: Boolean(reservation),
    data: () => reservation,
  };
}
```

- [ ] **Step 3: Run quota tests and verify red**

Run: `npm test -- src/lib/analyse/quota.test.ts`

Expected: FAIL on old 90-day fields, missing `resetsAt` and missing `checkAndRegisterIpAttempt`.

- [ ] **Step 4: Define the new outcome types and import the helpers**

```ts
import {
  activeAnalysisEntries,
  entriesInWindow,
  latestBlockingLimit,
  resetAtForWindow,
  type WindowQuotaEntry,
} from "@/lib/analyse/quotaWindow";

type QuotaEntry = WindowQuotaEntry;

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
```

- [ ] **Step 5: Implement atomic IP check and registration**

`checkAndRegisterIpAttempt` reads only the IP scope. It calculates daily and monthly `attempt` lists before appending. Zero disables that individual IP limiter; positive values enforce it.

```ts
export async function checkAndRegisterIpAttempt(
  input: QuotaCheckInput,
): Promise<IpAttemptOutcome> {
  if (!input.ipHash) return { decision: "allowed" };
  const ipRef = scopeRef(input.ipHash);

  return adminDb.runTransaction(async (transaction): Promise<IpAttemptOutcome> => {
    const now = Date.now();
    const nowIso = new Date(now).toISOString();
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
```

- [ ] **Step 6: Convert verification quota to 24 hours**

Remove the IP scope from `checkAndReserveQuota`; IP is already accepted at start. For duplicate, e-mail and device limits, build reset-bearing outcomes. Calculate both e-mail and device blocks first and return `latestBlockingLimit(blocks)` so the visible reset is truly usable.

```ts
const dayAgo = now - DAY_MS;
const emailEntries = activeAnalysisEntries(
  emailScope.entries,
  dayAgo,
  now,
  RESERVATION_LEASE_MS,
);
const emailLimit = config.maxPerEmail24h + emailScope.extraCredits;
const blocks: QuotaLimitOutcome[] = [];

if (emailLimit > 0 && emailEntries.length >= emailLimit) {
  blocks.push({
    decision: "limit_email",
    reason: "Het maximum aantal gratis analyses voor dit e-mailadres is bereikt.",
    resetsAt: resetAtForWindow(emailEntries, DAY_MS, emailLimit),
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
      resetsAt: resetAtForWindow(deviceEntries, DAY_MS, config.maxPerDevice24h),
    });
  }
}

if (blocks.length > 0) return latestBlockingLimit(blocks);
```

Use the duplicate entries with `resetAtForWindow(duplicateEntries, duplicateWindowMs, 1)`. Keep domain and combo scopes in the reservation for duplicate protection, but do not add the IP scope to a reservation. Remove the old `registerAttempt` export.

- [ ] **Step 7: Run quota and full tests**

Run: `npm test -- src/lib/analyse/quotaWindow.test.ts src/lib/analyse/quota.test.ts && npm test`

Expected: focused and full suites PASS.

- [ ] **Step 8: Commit the Firestore quota engine**

```powershell
git add src/lib/analyse/quota.ts src/lib/analyse/quota.test.ts
git commit -m "feat: dwing dagelijkse analysequota atomisch af"
```

---

### Task 4: Draag quotareden en resetmoment door de API

**Files:**
- Create: `src/lib/analyse/limitResponse.ts`
- Create: `src/lib/analyse/limitResponse.test.ts`
- Modify: `src/types/analysis.ts:99-335`
- Modify: `src/app/api/analyse/start/route.ts:13-163`
- Modify: `src/app/api/analyse/verify/route.ts:44-270`

**Interfaces:**
- Consumes: `QuotaLimitOutcome` and `checkAndRegisterIpAttempt` from Task 3.
- Produces: `AnalysisLimitResponse` with optional legacy metadata and required metadata for every new block.
- Produces: `toAnalysisLimitResponse(outcome): AnalysisLimitResponse`.
- Consumers: Task 5.

- [ ] **Step 1: Write the failing response-mapper test**

```ts
import { describe, expect, it } from "vitest";
import { toAnalysisLimitResponse } from "./limitResponse";

describe("toAnalysisLimitResponse", () => {
  it("keeps the quota decision and reset time", () => {
    expect(toAnalysisLimitResponse({
      decision: "limit_device",
      reason: "Het maximum aantal gratis analyses voor dit apparaat is bereikt.",
      resetsAt: "2026-07-16T18:30:00.000Z",
    })).toEqual({
      status: "limit_reached",
      message: "Het maximum aantal gratis analyses voor dit apparaat is bereikt.",
      quotaDecision: "limit_device",
      resetsAt: "2026-07-16T18:30:00.000Z",
    });
  });
});
```

- [ ] **Step 2: Run the mapper test and verify red**

Run: `npm test -- src/lib/analyse/limitResponse.test.ts`

Expected: FAIL because the mapper and response type do not exist.

- [ ] **Step 3: Extend lead and API types**

Add `quotaResetAt?: string` beside `quotaReason` on `AnalysisLead`.

```ts
export type AnalysisLimitResponse = {
  status: "limit_reached";
  message: string;
  quotaDecision?: AnalysisQuotaDecision;
  resetsAt?: string;
};

export type AnalysisStartResponse =
  | { status: "code_sent"; analysisLeadId: string }
  | AnalysisLimitResponse
  | { status: "error"; error: string };

export type AnalysisVerifyResponse =
  | { status: "completed"; reportUrl: string; score: number; criticalIssues: string[] }
  | { status: "reused"; reportUrl: string; score: number; criticalIssues: string[] }
  | AnalysisLimitResponse
  | { status: "failed"; message: string }
  | { status: "invalid_code"; attemptsLeft: number }
  | { status: "code_expired" }
  | { status: "error"; error: string };
```

- [ ] **Step 4: Implement the mapper**

```ts
import type { QuotaLimitOutcome } from "@/lib/analyse/quota";
import type { AnalysisLimitResponse } from "@/types/analysis";

export function toAnalysisLimitResponse(
  outcome: QuotaLimitOutcome,
): AnalysisLimitResponse {
  return {
    status: "limit_reached",
    message: outcome.reason,
    quotaDecision: outcome.decision,
    resetsAt: outcome.resetsAt,
  };
}
```

- [ ] **Step 5: Enforce IP quota in the start route**

Replace `registerAttempt` with `checkAndRegisterIpAttempt`. A Firestore failure returns 503 and does not continue unmetered. A limit returns HTTP 429 before lead creation and preserves a new device cookie.

```ts
if (config.enabled) {
  let attemptOutcome;
  try {
    attemptOutcome = await checkAndRegisterIpAttempt({
      emailNormalized: normalizedEmail.emailNormalized,
      deviceHash: hashedDevice,
      ipHash: hashedIp,
      normalizedDomain: normalizedUrl.normalizedDomain,
      config,
    });
  } catch {
    return withDeviceCookie(
      jsonError("De aanvraaglimiet kon niet veilig worden gecontroleerd. Probeer het zo opnieuw.", 503),
      newCookieValue,
    );
  }
  if (attemptOutcome.decision !== "allowed") {
    return withDeviceCookie(
      NextResponse.json(toAnalysisLimitResponse(attemptOutcome), { status: 429 }),
      newCookieValue,
    );
  }
}
```

- [ ] **Step 6: Persist and replay reset metadata in verify**

For a historical limited lead, return available stored details without inventing a reset time:

```ts
if (analysisLead.status === "limit_reached") {
  return json({
    status: "limit_reached",
    message: analysisLead.quotaReason ?? LIMIT_MESSAGE,
    ...(analysisLead.quotaDecision ? { quotaDecision: analysisLead.quotaDecision } : {}),
    ...(analysisLead.quotaResetAt ? { resetsAt: analysisLead.quotaResetAt } : {}),
  });
}
```

For every new quota or duplicate outcome, persist `quotaResetAt: outcome.resetsAt`, add it to `limitedLead`, and return `toAnalysisLimitResponse(outcome)`.

- [ ] **Step 7: Run mapper tests, quota tests and TypeScript**

Run: `npm test -- src/lib/analyse/limitResponse.test.ts src/lib/analyse/quota.test.ts && npm run typecheck`

Expected: tests and TypeScript PASS.

- [ ] **Step 8: Commit API propagation**

```powershell
git add src/types/analysis.ts src/lib/analyse/limitResponse.ts src/lib/analyse/limitResponse.test.ts src/app/api/analyse/start/route.ts src/app/api/analyse/verify/route.ts
git commit -m "feat: geef quotareset door aan analyseflow"
```

---

### Task 5: Bouw de VisualVibe-limietmelding en SEO Supercharged-CTA

**Files:**
- Create: `src/components/analyse/analysisLimitContent.ts`
- Create: `src/components/analyse/analysisLimitContent.test.ts`
- Create: `src/components/analyse/AnalysisLimitState.tsx`
- Modify: `src/components/analyse/AnalyseFlow.tsx:1-734`

**Interfaces:**
- Consumes: `AnalysisLimitResponse` from Task 4.
- Produces: `getAnalysisLimitContent(input)` and the two exact CTA URL constants.
- Produces: `AnalysisLimitState` component.

- [ ] **Step 1: Write failing content tests**

```ts
import { describe, expect, it } from "vitest";
import {
  COMPLETE_AUDIT_URL,
  PAGE_ANALYZER_URL,
  getAnalysisLimitContent,
} from "./analysisLimitContent";

describe("analysis limit content", () => {
  it("promises three renewed tests for email and device limits", () => {
    const content = getAnalysisLimitContent({
      decision: "limit_device",
      message: "Het maximum aantal gratis analyses voor dit apparaat is bereikt.",
      resetsAt: "2026-07-16T18:30:00.000Z",
    });

    expect(content.heading).toBe("Je gratis analyses zijn gebruikt");
    expect(content.description).toContain("donderdag 16 juli");
    expect(content.description).toContain("20:30");
    expect(content.description).toContain("opnieuw 3 gratis analyses");
  });

  it("does not promise three tests for an IP monthly limit", () => {
    const content = getAnalysisLimitContent({
      decision: "limit_ip_monthly",
      message: "Het maandelijkse maximum aan aanvragen vanaf dit netwerk is bereikt.",
      resetsAt: "2026-07-20T18:30:00.000Z",
    });

    expect(content.description).not.toContain("opnieuw 3 gratis analyses");
    expect(content.description).toContain("maandag 20 juli");
  });

  it("uses the approved destinations", () => {
    expect(PAGE_ANALYZER_URL).toBe("https://seowebsites.be/nl/seo-website-analyse");
    expect(COMPLETE_AUDIT_URL).toBe("https://seowebsites.be/AIGEOprofiler/");
  });
});
```

- [ ] **Step 2: Run the content test and verify red**

Run: `npm test -- src/components/analyse/analysisLimitContent.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement deterministic Dutch content**

```ts
import type { AnalysisQuotaDecision } from "@/types/analysis";

export const PAGE_ANALYZER_URL = "https://seowebsites.be/nl/seo-website-analyse";
export const COMPLETE_AUDIT_URL = "https://seowebsites.be/AIGEOprofiler/";

type LimitContentInput = {
  decision?: AnalysisQuotaDecision;
  message: string;
  resetsAt?: string;
};

function formatResetMoment(value: string): string | null {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const day = new Intl.DateTimeFormat("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Brussels",
  }).format(date);
  const time = new Intl.DateTimeFormat("nl-BE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Brussels",
  }).format(date);
  return `${day} om ${time}`;
}

export function getAnalysisLimitContent(input: LimitContentInput): {
  heading: string;
  description: string;
} {
  const resetMoment = input.resetsAt ? formatResetMoment(input.resetsAt) : null;
  if (input.decision === "limit_email" || input.decision === "limit_device") {
    return {
      heading: "Je gratis analyses zijn gebruikt",
      description: resetMoment
        ? `Je hebt je 3 gratis analyses gebruikt. Je tegoed wordt automatisch vernieuwd op ${resetMoment}. Daarna krijg je opnieuw 3 gratis analyses.`
        : "Je hebt je 3 gratis analyses gebruikt. Zodra je tegoed vernieuwd is, kun je opnieuw testen.",
    };
  }
  return {
    heading: "De aanvraaglimiet is bereikt",
    description: resetMoment
      ? `${input.message} Je kunt opnieuw aanvragen op ${resetMoment}.`
      : input.message,
  };
}
```

- [ ] **Step 4: Build the focused limit component**

Create `AnalysisLimitState.tsx` with this component:

```tsx
import { AlertTriangle, ArrowRight, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  COMPLETE_AUDIT_URL,
  PAGE_ANALYZER_URL,
  getAnalysisLimitContent,
} from "@/components/analyse/analysisLimitContent";
import type { AnalysisQuotaDecision } from "@/types/analysis";

type AnalysisLimitStateProps = {
  message: string;
  decision?: AnalysisQuotaDecision;
  resetsAt?: string;
};

export function AnalysisLimitState({
  message,
  decision,
  resetsAt,
}: AnalysisLimitStateProps) {
  const content = getAnalysisLimitContent({ decision, message, resetsAt });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-white">{content.heading}</h2>
          <p className="mt-1 text-sm leading-relaxed text-white/70" role="alert">
            {content.description}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.08)] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Gauge className="mt-0.5 h-5 w-5 shrink-0 text-[#FF9A45]" aria-hidden="true" />
          <div>
            <h3 className="font-bold text-white">Meer testpower nodig?</h3>
            <p className="mt-1 text-sm leading-relaxed text-white/70">
              Analyseer een losse pagina uitgebreider of start meteen een volledige audit van je website.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-11 w-full gap-2 border-0 bg-gradient-to-r from-red-500 to-amber-500 px-5 text-white shadow-lg shadow-amber-500/20 hover:from-red-600 hover:to-amber-600">
            <a href={PAGE_ANALYZER_URL} target="_blank" rel="noopener noreferrer">
              Open de Page Analyzer
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
          <a
            href={COMPLETE_AUDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-bold text-white transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.08)]"
          >
            Start een complete site-audit
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Wire both API paths into AnalyseFlow**

Change `FlowState` to:

```ts
| {
    step: "limit";
    message: string;
    quotaDecision?: AnalysisQuotaDecision;
    resetsAt?: string;
  }
```

For both start and verify responses:

```ts
if (data.status === "limit_reached") {
  setFlow({
    step: "limit",
    message: data.message,
    quotaDecision: data.quotaDecision,
    resetsAt: data.resetsAt,
  });
  setIsPending(false);
  return;
}
```

Replace the old inline limit JSX with:

```tsx
{flow.step === "limit" && (
  <AnalysisLimitState
    message={flow.message}
    decision={flow.quotaDecision}
    resetsAt={flow.resetsAt}
  />
)}
```

Remove `LIMIT_REACHED_TEXT`, the old contact/offerte buttons and `secondaryButtonClasses` if it has no remaining consumer.

- [ ] **Step 6: Run UI content tests, lint and TypeScript**

Run: `npm test -- src/components/analyse/analysisLimitContent.test.ts && npm run lint && npm run typecheck`

Expected: tests, lint and TypeScript PASS.

- [ ] **Step 7: Commit the public limit experience**

```powershell
git add src/components/analyse/analysisLimitContent.ts src/components/analyse/analysisLimitContent.test.ts src/components/analyse/AnalysisLimitState.tsx src/components/analyse/AnalyseFlow.tsx
git commit -m "feat: toon quotareset en seo testpower"
```

---

### Task 6: Voeg een begrensd productie-rolloutscript toe

**Files:**
- Create: `scripts/lib/analysis-quota-rollout.mjs`
- Create: `scripts/lib/analysis-quota-rollout.test.mjs`
- Create: `scripts/apply-analysis-quota-rollout.mjs`

**Interfaces:**
- Produces: `parseRolloutArgs(argv)` and `QUOTA_SETTINGS`.
- Mutates only: `analysis_settings/default`, `analysis_reservations`, `analysis_quota`.
- Must reject every project except `gen-lang-client-0235296023`.

- [ ] **Step 1: Write failing safety tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { parseRolloutArgs, QUOTA_SETTINGS } from "./analysis-quota-rollout.mjs";

test("rollout defaults are exact", () => {
  assert.deepEqual(QUOTA_SETTINGS, {
    maxPerEmail24h: 3,
    maxPerDevice24h: 3,
    maxPerIp24h: 12,
    maxPerIp30d: 180,
  });
});

test("production apply needs the exact project and flag", () => {
  assert.deepEqual(
    parseRolloutArgs(["--project", "gen-lang-client-0235296023", "--apply"]),
    { projectId: "gen-lang-client-0235296023", apply: true },
  );
  assert.throws(() => parseRolloutArgs(["--project", "wrong-project", "--apply"]));
  assert.deepEqual(
    parseRolloutArgs(["--project", "gen-lang-client-0235296023"]),
    { projectId: "gen-lang-client-0235296023", apply: false },
  );
});
```

- [ ] **Step 2: Run the Node test and verify red**

Run: `node --test scripts/lib/analysis-quota-rollout.test.mjs`

Expected: FAIL because the helper does not exist.

- [ ] **Step 3: Implement pure argument safety**

```js
export const QUOTA_SETTINGS = Object.freeze({
  maxPerEmail24h: 3,
  maxPerDevice24h: 3,
  maxPerIp24h: 12,
  maxPerIp30d: 180,
});

const ALLOWED_PROJECT = "gen-lang-client-0235296023";

export function parseRolloutArgs(argv) {
  const projectIndex = argv.indexOf("--project");
  const projectId = projectIndex >= 0 ? argv[projectIndex + 1] : undefined;
  if (projectId !== ALLOWED_PROJECT) {
    throw new Error(`Gebruik exact --project ${ALLOWED_PROJECT}.`);
  }
  return { projectId, apply: argv.includes("--apply") };
}
```

- [ ] **Step 4: Implement the dry-run-first maintenance script**

Create `scripts/apply-analysis-quota-rollout.mjs` with this complete implementation:

```js
import { deleteApp, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import {
  QUOTA_SETTINGS,
  parseRolloutArgs,
} from "./lib/analysis-quota-rollout.mjs";

async function collectionCount(db, collectionName) {
  const snapshot = await db.collection(collectionName).count().get();
  return snapshot.data().count;
}

async function deleteCollection(db, collectionName) {
  let deleted = 0;
  for (;;) {
    const snapshot = await db.collection(collectionName).limit(400).get();
    if (snapshot.empty) return deleted;
    const batch = db.batch();
    for (const document of snapshot.docs) batch.delete(document.ref);
    await batch.commit();
    deleted += snapshot.size;
  }
}

async function readSafeState(db) {
  const [quotaCount, reservationCount, settingsDocument] = await Promise.all([
    collectionCount(db, "analysis_quota"),
    collectionCount(db, "analysis_reservations"),
    db.collection("analysis_settings").doc("default").get(),
  ]);
  const settings = settingsDocument.data() ?? {};
  return {
    quotaCount,
    reservationCount,
    settings: {
      maxPerEmail24h: settings.maxPerEmail24h,
      maxPerDevice24h: settings.maxPerDevice24h,
      maxPerIp24h: settings.maxPerIp24h,
      maxPerIp30d: settings.maxPerIp30d,
      hasLegacyEmailField: Object.hasOwn(settings, "maxPerEmail90d"),
      hasLegacyDeviceField: Object.hasOwn(settings, "maxPerDevice90d"),
    },
  };
}

async function main() {
  const args = parseRolloutArgs(process.argv.slice(2));
  const app = initializeApp({ projectId: args.projectId }, "analysis-quota-rollout");
  const db = getFirestore(app);

  try {
    const before = await readSafeState(db);
    console.log(JSON.stringify({ mode: args.apply ? "apply" : "dry-run", before }, null, 2));
    if (!args.apply) return;

    await db.collection("analysis_settings").doc("default").set({
      ...QUOTA_SETTINGS,
      maxPerEmail90d: FieldValue.delete(),
      maxPerDevice90d: FieldValue.delete(),
      updatedAt: new Date().toISOString(),
      updatedBy: "analysis-quota-24h-rollout",
    }, { merge: true });

    const deletedReservations = await deleteCollection(db, "analysis_reservations");
    const deletedQuotaDocuments = await deleteCollection(db, "analysis_quota");
    const after = await readSafeState(db);
    console.log(JSON.stringify({
      deletedReservations,
      deletedQuotaDocuments,
      after,
    }, null, 2));
  } finally {
    await deleteApp(app);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Quota-uitrol mislukt.");
  process.exitCode = 1;
});
```

- [ ] **Step 5: Verify the script without production mutation**

Run:

```powershell
node --test scripts/lib/analysis-quota-rollout.test.mjs
node --check scripts/apply-analysis-quota-rollout.mjs
node scripts/apply-analysis-quota-rollout.mjs --project gen-lang-client-0235296023
```

Expected: Node tests PASS; syntax check exits 0; dry-run prints current counts and `apply: false` without changing Firestore.

- [ ] **Step 6: Commit the rollout guard**

```powershell
git add scripts/lib/analysis-quota-rollout.mjs scripts/lib/analysis-quota-rollout.test.mjs scripts/apply-analysis-quota-rollout.mjs
git commit -m "chore: beveilig productiequotareset"
```

---

### Task 7: Volledige verificatie, main, deploy en quotareset

**Files:**
- Verify all modified files.
- No additional source files unless verification exposes a defect.

**Interfaces:**
- Consumes: all previous tasks.
- Produces: deployed VisualVibe behavior and empty live quota collections.

- [ ] **Step 1: Run the full local gate**

```powershell
npm test
npm run typecheck
npm run lint
npm run build
rg --hidden -g '!.git/**' -g '!node_modules/**' -e '\x{2014}' -e '\x{2015}'
git diff --check
```

Expected: all tests PASS, TypeScript PASS, lint PASS, production build PASS, forbidden-character scan has no output, diff check has no output.

- [ ] **Step 2: Review the complete branch diff**

```powershell
git status --short --branch
git diff origin/main...HEAD --stat
git diff origin/main...HEAD -- src/types/analysis.ts src/lib/analyse src/app/api/analyse src/components/analyse src/components/admin src/lib/admin scripts
```

Expected: only the approved quota, API, UI, admin, tests, spec, plan and rollout-script scope appears.

- [ ] **Step 3: Synchronize and publish the feature branch**

```powershell
git fetch origin
git rebase origin/main
git push -u origin feature/analysis-quota-24h
```

Expected: rebase succeeds without unrelated conflicts and the feature branch is present on GitHub.

- [ ] **Step 4: Fast-forward main and push**

```powershell
git -C C:\AppWorkspace\VisualVibe pull --ff-only origin main
git -C C:\AppWorkspace\VisualVibe merge --ff-only feature/analysis-quota-24h
git -C C:\AppWorkspace\VisualVibe push origin main
```

Expected: local and remote `main` point at the verified feature commit.

- [ ] **Step 5: Deploy that exact main commit**

```powershell
$commit = git -C C:\AppWorkspace\VisualVibe rev-parse HEAD
npx firebase-tools apphosting:rollouts:create visualvibe --git-commit $commit --force --project gen-lang-client-0235296023
npx firebase-tools apphosting:backends:get visualvibe --project gen-lang-client-0235296023
```

Expected: the rollout is accepted for backend `visualvibe`; the backend remains on Node.js 24 and its updated timestamp advances.

- [ ] **Step 6: Confirm the new code is live before data mutation**

Run:

```powershell
curl.exe -I -L --max-time 30 https://visualvibe.media/be/website-analyse/
npx firebase-tools apphosting:backends:get visualvibe --project gen-lang-client-0235296023
```

Expected: the page returns HTTP 200, the rollout command from Step 5 completed successfully and the backend updated timestamp matches the new rollout. Do not submit a real analysis yet.

- [ ] **Step 7: Apply the exact production settings and global reset**

```powershell
node scripts/apply-analysis-quota-rollout.mjs --project gen-lang-client-0235296023
node scripts/apply-analysis-quota-rollout.mjs --project gen-lang-client-0235296023 --apply
node scripts/apply-analysis-quota-rollout.mjs --project gen-lang-client-0235296023
```

Expected: first command is dry-run; apply reports deleted quota and reservation counts; final dry-run reports both collection counts as 0 and settings 3, 3, 12, 180. It must not read or delete `analysis_leads`, `analysis_verifications` or `analysis_reports`.

- [ ] **Step 8: Smoke-test public presentation**

Use the in-app browser to open `https://visualvibe.media/be/website-analyse/`. Verify at desktop width that the analysis card aligns with the page container. Switch to a mobile viewport and verify the visible form button spans the card width without horizontal scrolling. Do not submit the form, so all three freshly reset tests remain available to the user.

- [ ] **Step 9: Final evidence report**

Report:

- final main commit;
- test, typecheck, lint and build outcomes;
- App Hosting rollout result;
- production settings 3, 3, 12 and 180;
- number of deleted quota and reservation documents;
- confirmation that lead/report collections were untouched;
- the live analysis URL for the user's three fresh tests.
