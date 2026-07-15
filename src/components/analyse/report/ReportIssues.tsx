import { ArrowRight, TriangleAlert } from "lucide-react";
import type { NormalizedPartnerAuditIssue } from "@/types/analysis";
import { reportCopy } from "@/components/analyse/report/reportCopy";
import { SectionTitle } from "@/components/analyse/report/SectionTitle";

const severityLabels = {
  high: "Hoog",
  medium: "Gemiddeld",
  low: "Laag",
} as const;

export function ReportIssues({ issues }: { issues: NormalizedPartnerAuditIssue[] }) {
  if (issues.length === 0) return null;
  return (
    <section>
      <SectionTitle>{reportCopy.issues}</SectionTitle>
      <div className="grid gap-3 lg:grid-cols-2">
        {issues.map((issue) => (
          <article key={issue.id} className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.035] p-5">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-300">{severityLabels[issue.severity]}</p>
                <h3 className="mt-1 font-bold text-white">{issue.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{issue.explanation}</p>
                {issue.recommendation && <p className="mt-3 flex gap-2 text-sm leading-6 text-white/70"><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-orange-300" aria-hidden="true" />{issue.recommendation}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
