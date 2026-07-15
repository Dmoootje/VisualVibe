import { describe, expect, it } from "vitest";
import { buildReusedReportPatch } from "./reportLinking";

describe("buildReusedReportPatch", () => {
  it("reuses the report reference while keeping the new token", () => {
    const patch = buildReusedReportPatch(
      {
        reportId: "existing-report",
        reportSchemaVersion: 1,
        analysisSummary: "Bestaande samenvatting",
      },
      "new-random-token",
    );

    expect(patch).toMatchObject({
      reportToken: "new-random-token",
      reportId: "existing-report",
      reportSchemaVersion: 1,
      analysisSummary: "Bestaande samenvatting",
    });
  });

  it("keeps legacy reuse valid without a report reference", () => {
    const patch = buildReusedReportPatch({}, "new-random-token");

    expect(patch.reportToken).toBe("new-random-token");
    expect(patch).not.toHaveProperty("reportId");
  });
});
