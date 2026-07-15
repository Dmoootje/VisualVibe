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
