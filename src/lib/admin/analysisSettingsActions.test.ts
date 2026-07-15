import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentAdmin: vi.fn(),
  updateAnalysisQuotaConfig: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/auth/session", () => ({ getCurrentAdmin: mocks.getCurrentAdmin }));
vi.mock("@/lib/analyse/config", () => ({
  updateAnalysisQuotaConfig: mocks.updateAnalysisQuotaConfig,
}));
vi.mock("@/lib/analyse/integration", () => ({ updateAnalysisIntegration: vi.fn() }));

import { saveAnalysisSettingsAction } from "./analysisSettingsActions";
import { DEFAULT_ANALYSIS_QUOTA_CONFIG } from "@/types/analysis";

describe("saveAnalysisSettingsAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentAdmin.mockResolvedValue({ email: "admin@example.com" });
    mocks.updateAnalysisQuotaConfig.mockResolvedValue({
      ...DEFAULT_ANALYSIS_QUOTA_CONFIG,
      maintenanceMode: true,
    });
  });

  it("persists the maintenance checkbox", async () => {
    const formData = new FormData();
    formData.set("enabled", "on");
    formData.set("maintenanceMode", "on");
    for (const [key, value] of Object.entries(DEFAULT_ANALYSIS_QUOTA_CONFIG)) {
      if (typeof value === "number") formData.set(key, String(value));
    }

    await expect(
      saveAnalysisSettingsAction({ status: "idle" }, formData),
    ).resolves.toEqual({ status: "success", message: "Analyse-instellingen opgeslagen." });
    expect(mocks.updateAnalysisQuotaConfig).toHaveBeenCalledWith(
      expect.objectContaining({ maintenanceMode: true }),
      "admin@example.com",
    );
  });
});
