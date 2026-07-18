import { AlertTriangle, ArrowRight, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  COMPLETE_AUDIT_URL,
  PAGE_ANALYZER_URL,
  getAnalysisLimitContent,
} from "@/components/analyse/analysisLimitContent";
import type { AnalysisQuotaDecision } from "@/types/analysis";

type AnalysisLimitStateProps = {
  message: string;
  decision?: AnalysisQuotaDecision;
  resetsAt?: string;
  locale?: "nl" | "en";
};

export function AnalysisLimitState({
  message,
  decision,
  resetsAt,
  locale = "nl",
}: AnalysisLimitStateProps) {
  const content = getAnalysisLimitContent({ decision, message, resetsAt, locale });
  const en = locale === "en";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-white">{content.heading}</h2>
          <p className="mt-1 text-sm leading-relaxed text-white/70" role="alert">
            {content.description}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.08)] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Gauge className="mt-0.5 h-5 w-5 shrink-0 text-[#FF9A45]" aria-hidden="true" />
          <div>
            <h3 className="font-bold text-white">{en ? "Need a more detailed test?" : "Meer testpower nodig?"}</h3>
            <p className="mt-1 text-sm leading-relaxed text-white/70">
              {en ? "Examine one page in more detail or start a complete website audit." : "Analyseer een losse pagina uitgebreider of start meteen een volledige audit van je website."}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="h-11 w-full gap-2 border-0 bg-gradient-to-r from-red-500 to-amber-500 px-5 text-white shadow-lg shadow-amber-500/20 hover:from-red-600 hover:to-amber-600"
          >
            <a href={PAGE_ANALYZER_URL} target="_blank" rel="noopener noreferrer">
              {en ? "Open the Page Analyzer" : "Open de Page Analyzer"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
          <a
            href={COMPLETE_AUDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-bold text-white transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.08)]"
          >
            {en ? "Start a complete site audit" : "Start een complete site-audit"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
