import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { NormalizedPartnerAuditReport, NormalizedPartnerKeywordStat } from "@/types/analysis";
import { ReportScoreHero } from "./ReportScoreHero";
import { ReportQuickWins } from "./ReportQuickWins";
import type { ReportViewModel } from "./reportViewModel";

const report: NormalizedPartnerAuditReport = {
  schemaVersion: 1,
  url: "https://visualvibe.media/",
  overallScore: 99,
  summary: "De pagina scoort sterk.",
  categories: [],
  page: { wordCount: 892 },
  topIssues: [],
  strengths: [],
  technical: { csrDetected: false, renderedAvailable: true },
};

const quickWins: ReportViewModel["quickWins"] = {
  totalWords: 892,
  stopWordCount: 298,
  totalChecks: 29,
  passed: 28,
  warnings: 1,
  errors: 0,
};

const topKeyword: NormalizedPartnerKeywordStat = {
  phrase: "webdesign",
  count: 12,
  density: 1.35,
  locations: ["title"],
};

describe("ReportScoreHero", () => {
  it("shows the top keyword and SEO Supercharged provider card in the hero summary", () => {
    const html = renderToStaticMarkup(
      <ReportScoreHero report={report} quickWins={quickWins} topKeyword={topKeyword} />,
    );

    expect(html).toContain("Topkeyword");
    expect(html).toContain("webdesign · 1.35%");
    expect(html).toContain("SEO Supercharged");
    expect(html).toContain("Deze widget ook op je website?");
  });

  it("keeps the moved top keyword card out of the Quick Wins scorecard", () => {
    const html = renderToStaticMarkup(
      <ReportQuickWins
        model={{
          categories: [],
          keywordDensity: undefined,
          topKeyword,
          quickWins,
        }}
      />,
    );

    expect(html).not.toContain("Topkeyword");
    expect(html).not.toContain("webdesign · 1.35%");
  });
});
