import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type FakeDocumentReference = {
  kind: "document";
  collection: string;
  id: string;
};

type FakeQuery = {
  kind: "query";
  collection: string;
  value: string;
};

const firestore = vi.hoisted(() => ({
  create: vi.fn(),
  set: vi.fn(),
  update: vi.fn(),
  get: vi.fn(),
  collection: vi.fn(),
  runTransaction: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/security/encryption", () => ({
  hmacIdentifier: (value: string, purpose: string) => `${purpose}:${value}`,
}));
vi.mock("@/lib/firebase/admin", () => ({
  adminDb: {
    collection: firestore.collection,
    runTransaction: firestore.runTransaction,
  },
}));

import {
  checkAndRegisterIpAttempt,
  checkAndReserveQuota,
  consumeReservation,
  grantExtraCredits,
  releaseReservation,
} from "./quota";
import { DEFAULT_ANALYSIS_QUOTA_CONFIG } from "@/types/analysis";

const NOW = Date.parse("2026-07-15T18:30:00.000Z");

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

function readExtraCredits(id: string): number {
  return scopeData.get(id)?.extraCredits ?? 0;
}

type TestReservation = {
  status: "reserved" | "consumed" | "released";
  scopes: string[];
  usedExtraCredit: boolean;
  emailScopeId: string;
};

const reservationData = new Map<string, TestReservation>();
let maintenanceMode = false;

function seedReservation(id: string, reservation: TestReservation): void {
  reservationData.set(id, reservation);
}

function documentReference(collection: string, id: string): FakeDocumentReference {
  return { kind: "document", collection, id };
}

describe("checkAndReserveQuota", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    vi.clearAllMocks();
    scopeData.clear();
    reservationData.clear();
    maintenanceMode = false;

    firestore.collection.mockImplementation((collection: string) => ({
      doc: (id?: string) => documentReference(collection, id ?? "reservation-1"),
      where: (_field: string, _operator: string, value: string): FakeQuery => ({
        kind: "query",
        collection,
        value,
      }),
    }));

    firestore.get.mockImplementation(async (target: FakeDocumentReference | FakeQuery) => {
      if (target.kind === "query") {
        return {
          docs: [
            {
              id: "legacy-analysis",
              data: () => ({
                status: "completed",
                completedAt: "2026-07-15T18:00:00.000Z",
                analysisScore: 100,
                reportToken: "legacy-token",
              }),
            },
          ],
        };
      }

      if (target.collection === "analysis_reservations") {
        const reservation = reservationData.get(target.id);
        return {
          exists: Boolean(reservation),
          data: () => reservation,
        };
      }

      if (target.collection === "analysis_settings") {
        return {
          exists: true,
          data: () => ({ maintenanceMode }),
        };
      }

      const scope = scopeData.get(target.id);
      return {
        exists: Boolean(scope),
        data: () => scope,
      };
    });

    firestore.set.mockImplementation((ref: FakeDocumentReference, data: {
      entries: TestEntry[];
      extraCredits: number;
    }) => {
      scopeData.set(ref.id, {
        entries: data.entries,
        extraCredits: data.extraCredits,
      });
    });

    firestore.update.mockImplementation((ref: FakeDocumentReference, patch: Partial<TestReservation>) => {
      const current = reservationData.get(ref.id);
      if (current) reservationData.set(ref.id, { ...current, ...patch });
    });

    firestore.runTransaction.mockImplementation(async (callback) => callback({
      get: firestore.get,
      create: firestore.create,
      set: firestore.set,
      update: firestore.update,
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("reserves a fresh scan when the domain has a recent legacy report", async () => {
    seedScope("domain-quota:voorbeeld.be", [
      { t: "2026-07-15T18:00:00.000Z", kind: "success" },
    ]);

    const result = await checkAndReserveQuota({
      emailNormalized: "klant@example.com",
      normalizedDomain: "voorbeeld.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
    });

    expect(result).toEqual({ decision: "allowed", reservationId: "reservation-1" });
    expect(firestore.create).toHaveBeenCalledOnce();
  });

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

  it("returns the later reset when both email and device limits block", async () => {
    seedScope("email-quota:klant@example.com", [
      { t: "2026-07-15T08:00:00.000Z", kind: "success" },
      { t: "2026-07-15T09:00:00.000Z", kind: "success" },
      { t: "2026-07-15T10:00:00.000Z", kind: "success" },
    ]);
    seedScope("device-1", [
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

    expect(result).toMatchObject({
      decision: "limit_device",
      resetsAt: "2026-07-16T10:00:00.000Z",
    });
  });

  it("returns the email reset when duplicate and email limits both block", async () => {
    seedScope("combo-quota:klant@example.com|device-1|voorbeeld.be", [
      { t: "2026-07-15T18:29:00.000Z", kind: "success" },
    ]);
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

    expect(result).toMatchObject({
      decision: "limit_email",
      resetsAt: "2026-07-16T10:00:00.000Z",
    });
  });

  it("adds the reached IP daily reset when the device limit already blocks", async () => {
    seedScope("device-1", [
      { t: "2026-07-15T10:00:00.000Z", kind: "success" },
      { t: "2026-07-15T11:00:00.000Z", kind: "success" },
      { t: "2026-07-15T12:00:00.000Z", kind: "success" },
    ]);
    seedScope(
      "ip-daily",
      Array.from({ length: 12 }, (_, index) => ({
        t: new Date(Date.parse("2026-07-15T18:00:00.000Z") + index * 60_000).toISOString(),
        kind: "attempt" as const,
      })),
    );

    const result = await checkAndReserveQuota({
      emailNormalized: "klant@example.com",
      deviceHash: "device-1",
      ipHash: "ip-daily",
      normalizedDomain: "voorbeeld.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
    });

    expect(result).toMatchObject({
      decision: "limit_ip_daily",
      resetsAt: "2026-07-16T18:00:00.000Z",
    });
    expect(readScopeEntries("ip-daily")).toHaveLength(12);
  });

  it("adds the reached IP monthly reset when the email limit already blocks", async () => {
    seedScope("email-quota:klant@example.com", [
      { t: "2026-07-15T10:00:00.000Z", kind: "success" },
      { t: "2026-07-15T11:00:00.000Z", kind: "success" },
      { t: "2026-07-15T12:00:00.000Z", kind: "success" },
    ]);
    const older = Array.from({ length: 168 }, (_, index) => ({
      t: new Date(Date.parse("2026-06-20T10:00:00.000Z") + index * 60 * 60_000).toISOString(),
      kind: "attempt" as const,
    }));
    const recent = Array.from({ length: 12 }, (_, index) => ({
      t: new Date(Date.parse("2026-07-15T10:00:00.000Z") + index * 60_000).toISOString(),
      kind: "attempt" as const,
    }));
    seedScope("ip-monthly-blocked", [...older, ...recent]);

    const result = await checkAndReserveQuota({
      emailNormalized: "klant@example.com",
      ipHash: "ip-monthly-blocked",
      normalizedDomain: "voorbeeld.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
    });

    expect(result).toMatchObject({
      decision: "limit_ip_monthly",
      resetsAt: "2026-07-20T10:00:00.000Z",
    });
    expect(readScopeEntries("ip-monthly-blocked")).toHaveLength(180);
  });

  it("returns the duplicate window reset", async () => {
    seedScope("combo-quota:klant@example.com||voorbeeld.be", [
      { t: "2026-07-15T18:29:00.000Z", kind: "success" },
    ]);

    const result = await checkAndReserveQuota({
      emailNormalized: "klant@example.com",
      normalizedDomain: "voorbeeld.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
    });

    expect(result).toEqual({
      decision: "duplicate_request",
      reason: "Deze aanvraag is zonet al ingediend. Probeer het later opnieuw.",
      resetsAt: "2026-07-15T18:31:00.000Z",
    });
  });

  it("does not add the IP scope to an analysis reservation", async () => {
    await checkAndReserveQuota({
      emailNormalized: "klant@example.com",
      deviceHash: "device-1",
      ipHash: "ip-1",
      normalizedDomain: "voorbeeld.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
    });

    expect(firestore.create).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        scopes: [
          "email-quota:klant@example.com",
          "domain-quota:voorbeeld.be",
          "combo-quota:klant@example.com|device-1|voorbeeld.be",
          "device-1",
        ],
      }),
    );
    expect(scopeData.has("ip-1")).toBe(false);
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

  it("rejects an IP write when live maintenance started after config was cached", async () => {
    maintenanceMode = true;

    await expect(checkAndRegisterIpAttempt({
      emailNormalized: "klant@example.com",
      ipHash: "ip-maintenance",
      normalizedDomain: "voorbeeld.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG, maintenanceMode: false },
    })).rejects.toThrow("onderhoudsmodus");

    expect(readScopeEntries("ip-maintenance")).toEqual([]);
    expect(firestore.set).not.toHaveBeenCalled();
  });

  it("rejects a reservation when live maintenance started after config was cached", async () => {
    maintenanceMode = true;

    await expect(checkAndReserveQuota({
      emailNormalized: "klant@example.com",
      normalizedDomain: "voorbeeld.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG, maintenanceMode: false },
    })).rejects.toThrow("onderhoudsmodus");

    expect(firestore.create).not.toHaveBeenCalled();
    expect(firestore.set).not.toHaveBeenCalled();
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

  it("keeps a reservation active for the full eight-minute route allowance", async () => {
    vi.setSystemTime(Date.parse("2026-07-15T18:35:00.000Z"));
    seedScope("email-quota:klant@example.com", [
      {
        t: "2026-07-15T18:29:00.000Z",
        kind: "reserved",
        reservationId: "long-run",
      },
    ]);

    const result = await checkAndReserveQuota({
      emailNormalized: "klant@example.com",
      normalizedDomain: "voorbeeld.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG, maxPerEmail24h: 1 },
    });

    expect(result).toMatchObject({
      decision: "limit_email",
      resetsAt: "2026-07-16T18:37:00.000Z",
    });
  });

  it("never consumes a supported reservation later than its displayed reset", async () => {
    vi.setSystemTime(Date.parse("2026-07-15T18:35:00.000Z"));
    seedScope("email-quota:klant@example.com", [
      {
        t: "2026-07-15T18:29:00.000Z",
        kind: "reserved",
        reservationId: "long-run",
      },
    ]);
    seedReservation("long-run", {
      status: "reserved",
      scopes: ["email-quota:klant@example.com"],
      usedExtraCredit: false,
      emailScopeId: "email-quota:klant@example.com",
    });
    const input = {
      emailNormalized: "klant@example.com",
      normalizedDomain: "voorbeeld.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG, maxPerEmail24h: 1 },
    };

    const beforeConsume = await checkAndReserveQuota(input);
    expect(beforeConsume).toMatchObject({
      decision: "limit_email",
      resetsAt: "2026-07-16T18:37:00.000Z",
    });

    vi.setSystemTime(Date.parse("2026-07-15T18:36:00.000Z"));
    await consumeReservation("long-run");
    const afterConsume = await checkAndReserveQuota(input);

    expect(afterConsume).toMatchObject({
      decision: "limit_email",
      resetsAt: "2026-07-16T18:36:00.000Z",
    });
    expect(Date.parse("resetsAt" in afterConsume ? afterConsume.resetsAt : "")).toBeLessThanOrEqual(
      Date.parse("resetsAt" in beforeConsume ? beforeConsume.resetsAt : ""),
    );
  });

  it("uses two granted credits for two additional successful analyses", async () => {
    const emailScopeId = "email-quota:klant@example.com";
    seedScope(emailScopeId, [
      { t: "2026-07-15T10:00:00.000Z", kind: "success" },
      { t: "2026-07-15T11:00:00.000Z", kind: "success" },
      { t: "2026-07-15T12:00:00.000Z", kind: "success" },
    ]);
    await grantExtraCredits("klant@example.com", 2);

    const first = await checkAndReserveQuota({
      emailNormalized: "klant@example.com",
      normalizedDomain: "eerste.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
    });
    expect(first).toMatchObject({ decision: "allowed_extra_credit" });
    expect(readExtraCredits(emailScopeId)).toBe(1);
    if (!("reservationId" in first)) throw new Error("Eerste reservering ontbreekt.");
    seedReservation(first.reservationId, {
      status: "reserved",
      scopes: [emailScopeId],
      usedExtraCredit: true,
      emailScopeId,
    });
    await consumeReservation(first.reservationId);

    const second = await checkAndReserveQuota({
      emailNormalized: "klant@example.com",
      normalizedDomain: "tweede.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
    });
    expect(second).toMatchObject({ decision: "allowed_extra_credit" });
    expect(readExtraCredits(emailScopeId)).toBe(0);
    if (!("reservationId" in second)) throw new Error("Tweede reservering ontbreekt.");
    seedReservation(second.reservationId, {
      status: "reserved",
      scopes: [emailScopeId],
      usedExtraCredit: true,
      emailScopeId,
    });
    await consumeReservation(second.reservationId);

    const blocked = await checkAndReserveQuota({
      emailNormalized: "klant@example.com",
      normalizedDomain: "derde.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
    });
    expect(blocked).toMatchObject({
      decision: "limit_email",
      resetsAt: "2026-07-16T12:00:00.000Z",
    });
  });

  it("does not use an extra credit below the base email limit", async () => {
    const emailScopeId = "email-quota:klant@example.com";
    seedScope(emailScopeId, [
      { t: "2026-07-15T10:00:00.000Z", kind: "success" },
      { t: "2026-07-15T11:00:00.000Z", kind: "success" },
    ]);
    await grantExtraCredits("klant@example.com", 1);

    const result = await checkAndReserveQuota({
      emailNormalized: "klant@example.com",
      normalizedDomain: "voorbeeld.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
    });

    expect(result).toMatchObject({ decision: "allowed" });
    expect(readExtraCredits(emailScopeId)).toBe(1);
    expect(firestore.create).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ usedExtraCredit: false }),
    );
  });

  it("restores exactly one credit when an extra-credit reservation is released", async () => {
    const emailScopeId = "email-quota:klant@example.com";
    seedScope(emailScopeId, [
      { t: "2026-07-15T10:00:00.000Z", kind: "success" },
      { t: "2026-07-15T11:00:00.000Z", kind: "success" },
      { t: "2026-07-15T12:00:00.000Z", kind: "success" },
    ]);
    await grantExtraCredits("klant@example.com", 1);
    const result = await checkAndReserveQuota({
      emailNormalized: "klant@example.com",
      normalizedDomain: "voorbeeld.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
    });
    if (!("reservationId" in result)) throw new Error("Reservering ontbreekt.");
    seedReservation(result.reservationId, {
      status: "reserved",
      scopes: [emailScopeId],
      usedExtraCredit: true,
      emailScopeId,
    });

    await releaseReservation(result.reservationId);
    await releaseReservation(result.reservationId);

    expect(readExtraCredits(emailScopeId)).toBe(1);
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
});

describe("fresh analysis quota defaults", () => {
  it("uses a two minute duplicate window without a domain cooldown", () => {
    expect(DEFAULT_ANALYSIS_QUOTA_CONFIG.duplicateWindowMinutes).toBe(2);
    expect(DEFAULT_ANALYSIS_QUOTA_CONFIG).not.toHaveProperty("domainCooldownDays");
  });
});
