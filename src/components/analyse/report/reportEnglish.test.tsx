import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { NormalizedPartnerAuditReport } from "@/types/analysis";
import { ReportKeywordDensity, ReportPageDetails, ReportQuickWins, ReportScoreHero } from ".";
import { createReportViewModel } from "./reportViewModel";
import { canDisplayReportInLocale } from "./reportCopy";

const report: NormalizedPartnerAuditReport = {
  schemaVersion: 1,
  outputLanguage: "en",
  url: "https://example.com/",
  overallScore: 100,
  summary: "The page has a sound technical foundation.",
  categories: [],
  page: { wordCount: 1000, language: "en-GB", indexable: true },
  topIssues: [],
  strengths: [],
  technical: { csrDetected: false, renderedAvailable: true },
  stats: { totalChecks: 10, passed: 10, warnings: 0, errors: 0 },
};

describe("English website-analysis report chrome", () => {
  it("localises a perfect-score report without changing partner findings", () => {
    const model = createReportViewModel(report);
    const html = renderToStaticMarkup(<><ReportScoreHero locale="en" report={report} quickWins={model.quickWins} /><ReportQuickWins locale="en" model={model} /><ReportPageDetails locale="en" report={report} /></>);
    expect(html).toContain("Overall score: 100 out of 100");
    expect(html).toContain("The page has a sound technical foundation.");
    expect(html).toContain("Total checks");
    expect(html).toContain("Analysed URL");
    expect(html).toContain("Yes");
    expect(html).not.toContain("Totaalscore");
  });

  it("uses clear English empty states when keyword density is missing", () => {
    const html = renderToStaticMarkup(<ReportKeywordDensity locale="en" />);
    expect(html).toContain("No keyword data is available for this analysis.");
    expect(html).not.toContain("Geen gegevens");
  });

  it("does not expose partner findings in a different or unknown output language", () => {
    expect(canDisplayReportInLocale("en", "en")).toBe(true);
    expect(canDisplayReportInLocale("en", "nl")).toBe(false);
    expect(canDisplayReportInLocale("en", undefined)).toBe(false);
    expect(canDisplayReportInLocale("nl", undefined)).toBe(true);
  });
});
