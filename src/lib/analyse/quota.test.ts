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
});

describe("fresh analysis quota defaults", () => {
  it("uses a two minute duplicate window without a domain cooldown", () => {
    expect(DEFAULT_ANALYSIS_QUOTA_CONFIG.duplicateWindowMinutes).toBe(2);
    expect(DEFAULT_ANALYSIS_QUOTA_CONFIG).not.toHaveProperty("domainCooldownDays");
  });
});
