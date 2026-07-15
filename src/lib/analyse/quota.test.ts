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

import { checkAndReserveQuota } from "./quota";
import { DEFAULT_ANALYSIS_QUOTA_CONFIG } from "@/types/analysis";

const NOW = Date.parse("2026-07-15T18:30:00.000Z");

function documentReference(collection: string, id: string): FakeDocumentReference {
  return { kind: "document", collection, id };
}

describe("checkAndReserveQuota", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    vi.clearAllMocks();

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

      const entries = target.id === "domain-quota:voorbeeld.be"
        ? [{ t: "2026-07-15T18:00:00.000Z", kind: "success" }]
        : [];
      return {
        exists: true,
        data: () => ({ entries, extraCredits: 0 }),
      };
    });

    firestore.runTransaction.mockImplementation(async (callback) => callback({
      get: firestore.get,
      create: firestore.create,
      set: firestore.set,
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("reserves a fresh scan when the domain has a recent legacy report", async () => {
    const result = await checkAndReserveQuota({
      emailNormalized: "klant@example.com",
      normalizedDomain: "voorbeeld.be",
      config: { ...DEFAULT_ANALYSIS_QUOTA_CONFIG },
    });

    expect(result).toEqual({ decision: "allowed", reservationId: "reservation-1" });
    expect(firestore.create).toHaveBeenCalledOnce();
  });
});

describe("fresh analysis quota defaults", () => {
  it("uses a two minute duplicate window without a domain cooldown", () => {
    expect(DEFAULT_ANALYSIS_QUOTA_CONFIG.duplicateWindowMinutes).toBe(2);
    expect(DEFAULT_ANALYSIS_QUOTA_CONFIG).not.toHaveProperty("domainCooldownDays");
  });
});
