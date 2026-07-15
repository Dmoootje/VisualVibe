import type {
  NormalizedPartnerAuditCategory,
  NormalizedPartnerAuditReport,
  NormalizedPartnerKeywordStat,
} from "@/types/analysis";

const CATEGORY_ORDER = [
  "meta",
  "structure",
  "content",
  "links",
  "media",
  "business",
  "technical",
  "aio_geo",
] as const;

export type ReportViewModel = {
  categories: NormalizedPartnerAuditCategory[];
  aioGeo?: NormalizedPartnerAuditCategory;
  keywordDensity: NormalizedPartnerAuditReport["keywordDensity"];
  topKeyword?: NormalizedPartnerKeywordStat;
  quickWins: {
    totalWords: number;
    stopWordCount: number;
    totalChecks: number;
    passed: number;
    warnings: number;
    errors: number;
  };
};

export function defaultOpenCheckValues(category: NormalizedPartnerAuditCategory): string[] {
  return category.checks.flatMap((check, index) =>
    check.status === "pass" ? [] : [`${category.id}-${check.id}-${index}`],
  );
}

export function createReportViewModel(report: NormalizedPartnerAuditReport): ReportViewModel {
  const order = new Map<string, number>(CATEGORY_ORDER.map((id, index) => [id, index]));
  const categories = [...report.categories].sort((left, right) => {
    const leftOrder = order.get(left.id) ?? CATEGORY_ORDER.length;
    const rightOrder = order.get(right.id) ?? CATEGORY_ORDER.length;
    return leftOrder - rightOrder;
  });
  const checks = categories.flatMap((category) => category.checks);
  const stats = report.stats ?? {
    totalChecks: checks.length,
    passed: checks.filter((check) => check.status === "pass").length,
    warnings: checks.filter((check) => check.status === "warning").length,
    errors: checks.filter((check) => check.status === "error").length,
  };

  return {
    categories,
    aioGeo: categories.find((category) => category.id === "aio_geo"),
    keywordDensity: report.keywordDensity,
    topKeyword: report.keywordDensity?.single[0],
    quickWins: {
      totalWords: report.keywordDensity?.totalWords ?? report.page.wordCount ?? 0,
      stopWordCount: report.keywordDensity?.stopWordCount ?? 0,
      totalChecks: stats.totalChecks,
      passed: stats.passed,
      warnings: stats.warnings,
      errors: stats.errors,
    },
  };
}
