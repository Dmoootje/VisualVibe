import type { AnalysisLead } from "@/types/analysis";

type ReusableReportSource = Pick<
  AnalysisLead,
  "reportId" | "reportSchemaVersion" | "analysisSummary"
>;

export function buildReusedReportPatch(
  source: ReusableReportSource,
  reportToken: string,
): Partial<AnalysisLead> & { reportToken: string } {
  return {
    reportToken,
    ...(source.analysisSummary ? { analysisSummary: source.analysisSummary } : {}),
    ...(source.reportId ? { reportId: source.reportId } : {}),
    ...(source.reportSchemaVersion
      ? { reportSchemaVersion: source.reportSchemaVersion }
      : {}),
  };
}
