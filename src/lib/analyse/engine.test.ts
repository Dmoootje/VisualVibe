import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/analyse/integration", () => ({
  getAnalysisIntegrationRuntime: vi.fn(),
}));
vi.mock("@/lib/analyse/partnerApi", () => ({
  runPartnerAnalysis: vi.fn(),
}));

import { getAnalysisIntegrationRuntime } from "@/lib/analyse/integration";
import { runPartnerAnalysis } from "@/lib/analyse/partnerApi";
import { runWebsiteAnalysis } from "./engine";

const runtimeMock = vi.mocked(getAnalysisIntegrationRuntime);
const partnerRunMock = vi.mocked(runPartnerAnalysis);

describe("runWebsiteAnalysis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates API mode to the signed partner client", async () => {
    runtimeMock.mockResolvedValue({
      mode: "api",
      publicKey: "public",
      privateKey: "sk_live_key_secret",
      partnerSiteId: 42,
      widgetScriptUrl: "https://seo.example/widget.js",
      apiBaseUrl: "https://seo.example/api/partner/v1",
    });
    partnerRunMock.mockResolvedValue({ status: "failed", errorCode: "engine_failed" });

    const result = await runWebsiteAnalysis({
      safeUrl: "https://voorbeeld.be/",
      normalizedDomain: "voorbeeld.be",
      idempotencyKey: "lead-id",
    });

    expect(result).toEqual({ status: "failed", errorCode: "engine_failed" });
    expect(partnerRunMock).toHaveBeenCalledWith({
      apiBaseUrl: "https://seo.example/api/partner/v1",
      privateKey: "sk_live_key_secret",
      partnerSiteId: 42,
      safeUrl: "https://voorbeeld.be/",
      externalReference: "lead-id",
      idempotencyKey: "lead-id",
    });
  });

  it("fails safely when API configuration is incomplete", async () => {
    runtimeMock.mockResolvedValue({
      mode: "api",
      publicKey: "public",
      privateKey: "",
      partnerSiteId: null,
      widgetScriptUrl: "https://seo.example/widget.js",
      apiBaseUrl: "https://seo.example/api/partner/v1",
    });

    await expect(
      runWebsiteAnalysis({ safeUrl: "https://voorbeeld.be/", normalizedDomain: "voorbeeld.be" }),
    ).resolves.toEqual({ status: "unavailable", errorCode: "partner_api_not_configured" });
    expect(partnerRunMock).not.toHaveBeenCalled();
  });
});
