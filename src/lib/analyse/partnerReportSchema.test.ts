import { describe, expect, it } from "vitest";
import { parsePartnerAuditReport } from "./partnerReportSchema";

function validReport() {
  return {
    schemaVersion: 1,
    url: "https://voorbeeld.be/",
    overallScore: 100,
    summary: "Goed rapport",
    categories: [
      {
        id: "meta",
        title: "Meta",
        score: 100,
        checks: [
          {
            id: "title",
            title: "Titel",
            status: "pass",
            description: "Titel aanwezig",
          },
        ],
      },
    ],
    page: { wordCount: 500 },
    topIssues: [],
    strengths: [],
    technical: {},
    stats: { totalChecks: 1, passed: 1, warnings: 0, errors: 0 },
    keywordDensity: {
      totalWords: 500,
      stopWordCount: 100,
      single: [{ phrase: "voorbeeld", count: 10, density: 1.88, locations: ["T", "H"] }],
      double: [],
      triple: [],
    },
  };
}

describe("parsePartnerAuditReport", () => {
  it("strips unknown partner fields", () => {
    const report = parsePartnerAuditReport({
      ...validReport(),
      secret: "never-store",
      rawHtml: "<p>never-store</p>",
    });

    expect(report).not.toHaveProperty("secret");
    expect(report).not.toHaveProperty("rawHtml");
    expect(report.keywordDensity?.single[0].density).toBe(1.88);
  });

  it("bounds scores, arrays and keyword locations", () => {
    const report = parsePartnerAuditReport({
      ...validReport(),
      overallScore: 145,
      keywordDensity: {
        ...validReport().keywordDensity,
        single: Array.from({ length: 40 }, (_, index) => ({
          phrase: `term-${index}`,
          count: 3,
          density: 0.6,
          locations: Array.from({ length: 15 }, (_, location) => `L${location}`),
        })),
      },
    });

    expect(report.overallScore).toBe(100);
    expect(report.keywordDensity?.single).toHaveLength(30);
    expect(report.keywordDensity?.single[0].locations).toHaveLength(10);
  });

  it("rejects structurally incomplete completed reports", () => {
    expect(() => parsePartnerAuditReport({ schemaVersion: 1, overallScore: 80 })).toThrow();
  });
});
