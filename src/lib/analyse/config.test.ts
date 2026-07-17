import { beforeEach, describe, expect, it, vi } from "vitest";

const firestore = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  collection: vi.fn(),
  runTransaction: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/firebase/admin", () => ({
  adminDb: {
    collection: firestore.collection,
    runTransaction: firestore.runTransaction,
  },
}));

import { mergeWithDefaults, updateAnalysisQuotaConfig } from "./config";
import { DEFAULT_ANALYSIS_QUOTA_CONFIG } from "@/types/analysis";

describe("analysis quota configuration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestore.collection.mockReturnValue({
      doc: () => ({ id: "default" }),
    });
    firestore.get.mockResolvedValue({
      exists: true,
      data: () => ({ ...DEFAULT_ANALYSIS_QUOTA_CONFIG, maintenanceMode: false }),
    });
    firestore.runTransaction.mockImplementation(async (callback) => callback({
      get: firestore.get,
      set: firestore.set,
    }));
  });

  it("uses the new rolling-window defaults", () => {
    expect(DEFAULT_ANALYSIS_QUOTA_CONFIG).toMatchObject({
      maintenanceMode: false,
      maxPerEmail24h: 3,
      maxPerDevice24h: 3,
      maxPerIp24h: 12,
      maxPerIp30d: 180,
    });
  });

  it("reads a persisted maintenance mode", () => {
    expect(mergeWithDefaults({ maintenanceMode: true }).maintenanceMode).toBe(true);
  });

  it("persists an updated maintenance mode", async () => {
    await expect(
      updateAnalysisQuotaConfig({ maintenanceMode: true }, "admin@example.com"),
    ).resolves.toMatchObject({ maintenanceMode: true });
    expect(firestore.set).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        maintenanceMode: true,
        updatedBy: "admin@example.com",
      }),
      { merge: true },
    );
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
