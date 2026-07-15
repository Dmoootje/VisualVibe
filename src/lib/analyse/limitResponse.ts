import type { QuotaLimitOutcome } from "@/lib/analyse/quota";
import type { AnalysisLimitResponse } from "@/types/analysis";

export function toAnalysisLimitResponse(
  outcome: QuotaLimitOutcome,
): AnalysisLimitResponse {
  return {
    status: "limit_reached",
    message: outcome.reason,
    quotaDecision: outcome.decision,
    resetsAt: outcome.resetsAt,
  };
}
