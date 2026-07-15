import { describe, expect, it } from "vitest";
import type { NormalizedPartnerAuditReport } from "@/types/analysis";
import { createReportViewModel, defaultOpenCheckValues } from "./reportViewModel";

function fixture(score = 100): NormalizedPartnerAuditReport {
  return {
    schemaVersion: 1,
    url: "https://voorbeeld.be/",
    overallScore: score,
    summary: "Volledig rapport",
    categories: [
      {
        id: "aio_geo",
        title: "AIO en GEO",
        score: 75,
        checks: [
          { id: "entity", title: "Entiteit", status: "pass", description: "Goed" },
          { id: "faq", title: "FAQ", status: "warning", description: "Aandacht" },
        ],
      },
      {
        id: "meta",
        title: "Meta",
        score: 80,
        checks: [
          { id: "title", title: "Titel", status: "pass", description: "Goed" },
          { id: "description", title: "Beschrijving", status: "error", description: "Fout" },
        ],
      },
    ],
    page: { wordCount: 500 },
    topIssues: [],
    strengths: [],
    technical: { csrDetected: false, renderedAvailable: true },
    stats: { totalChecks: 4, passed: 2, warnings: 1, errors: 1 },
    keywordDensity: {
      totalWords: 500,
      stopWordCount: 100,
      single: [{ phrase: "voorbeeld", count: 10, density: 2, locations: ["T"] }],
      double: [],
      triple: [],
    },
  };
}

describe("createReportViewModel", () => {
  it("keeps every category visible at a perfect score and orders stable sections", () => {
    const model = createReportViewModel(fixture(100));

    expect(model.categories.map((category) => category.id)).toEqual(["meta", "aio_geo"]);
    expect(model.categories).toHaveLength(2);
    expect(model.aioGeo?.id).toBe("aio_geo");
    expect(model.quickWins).toMatchObject({
      totalWords: 500,
      stopWordCount: 100,
      passed: 2,
      warnings: 1,
      errors: 1,
    });
    expect(model.topKeyword).toEqual({ phrase: "voorbeeld", count: 10, density: 2, locations: ["T"] });
  });

  it("opens warnings and errors but leaves passed checks collapsed", () => {
    const meta = fixture().categories.find((category) => category.id === "meta")!;

    expect(defaultOpenCheckValues(meta)).toEqual(["meta-description-1"]);
  });

  it("handles missing keyword density without dropping report details", () => {
    const report = fixture();
    delete report.keywordDensity;

    const model = createReportViewModel(report);

    expect(model.keywordDensity).toBeUndefined();
    expect(model.topKeyword).toBeUndefined();
    expect(model.categories).toHaveLength(2);
  });
});
