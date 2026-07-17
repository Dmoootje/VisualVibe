import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/admin/analysisSettingsActions", () => ({
  saveAnalysisSettingsAction: vi.fn(),
}));

import { AnalysisSettingsForm } from "./AnalysisSettingsForm";
import { DEFAULT_ANALYSIS_QUOTA_CONFIG } from "@/types/analysis";

describe("AnalysisSettingsForm", () => {
  it("shows the maintenance switch and preserves report availability copy", () => {
    const html = renderToStaticMarkup(
      <AnalysisSettingsForm config={{ ...DEFAULT_ANALYSIS_QUOTA_CONFIG }} />,
    );

    expect(html).toContain('name="maintenanceMode"');
    expect(html).toContain("Onderhoudsmodus");
    expect(html).toContain(
      "Nieuwe analysestarts worden tijdelijk geweigerd. Bestaande rapporten blijven bereikbaar.",
    );
  });

  it("documents zero as unlimited for every enforced rolling quota", () => {
    const html = renderToStaticMarkup(
      <AnalysisSettingsForm config={{ ...DEFAULT_ANALYSIS_QUOTA_CONFIG }} />,
    );

    expect(html.match(/0 = onbeperkt/g)).toHaveLength(4);
  });
});
