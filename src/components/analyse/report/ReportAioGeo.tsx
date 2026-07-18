import { CheckCircle2, CircleX, TriangleAlert } from "lucide-react";
import type { NormalizedPartnerAuditCategory } from "@/types/analysis";
import { getReportCopy, type ReportLocale } from "@/components/analyse/report/reportCopy";
import { SectionTitle } from "@/components/analyse/report/SectionTitle";

export function ReportAioGeo({ category, locale = "nl" }: { category?: NormalizedPartnerAuditCategory; locale?: ReportLocale }) {
  const reportCopy = getReportCopy(locale);
  if (!category) return null;
  return (
    <section>
      <SectionTitle>{reportCopy.aioGeo}</SectionTitle>
      <div className="rounded-[20px] border border-orange-500/20 bg-orange-500/[0.035] p-5 sm:p-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-white/50">{locale === "en" ? "Health score" : "Gezondheidsscore"}</p>
            <p className="mt-1 text-4xl font-black text-emerald-300">{category.score}<span className="text-base text-white/35"> / 100</span></p>
          </div>
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10 sm:w-48">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${category.score}%` }} />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {category.checks.map((check) => {
            const Icon = check.status === "pass" ? CheckCircle2 : check.status === "warning" ? TriangleAlert : CircleX;
            const color = check.status === "pass" ? "text-emerald-300" : check.status === "warning" ? "text-amber-300" : "text-red-300";
            return (
              <div key={check.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3.5">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-white/90">{check.title}</p>
                  <p className="mt-1 text-xs leading-5 text-white/50">{check.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
