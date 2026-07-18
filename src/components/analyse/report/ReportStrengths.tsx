import { CheckCircle2 } from "lucide-react";
import type { NormalizedPartnerAuditStrength } from "@/types/analysis";
import { getReportCopy, type ReportLocale } from "@/components/analyse/report/reportCopy";
import { SectionTitle } from "@/components/analyse/report/SectionTitle";

export function ReportStrengths({ strengths, locale = "nl" }: { strengths: NormalizedPartnerAuditStrength[]; locale?: ReportLocale }) {
  const reportCopy = getReportCopy(locale);
  if (strengths.length === 0) return null;
  return (
    <section>
      <SectionTitle>{reportCopy.strengths}</SectionTitle>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {strengths.map((strength) => (
          <article key={strength.id} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.035] p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-emerald-200">{strength.title}</h3>
                <p className="mt-1 text-sm leading-6 text-white/55">{strength.explanation}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
