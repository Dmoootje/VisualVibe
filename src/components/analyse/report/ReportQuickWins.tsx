import { CircleCheckBig, FileText, Search, TriangleAlert, XCircle } from "lucide-react";
import type { ReportViewModel } from "@/components/analyse/report/reportViewModel";
import { reportCopy } from "@/components/analyse/report/reportCopy";
import { SectionTitle } from "@/components/analyse/report/SectionTitle";

export function ReportQuickWins({ model }: { model: ReportViewModel }) {
  const cards = [
    { label: reportCopy.totalWords, value: model.quickWins.totalWords.toLocaleString("nl-BE"), icon: FileText, color: "text-white" },
    { label: reportCopy.stopWords, value: model.quickWins.stopWordCount.toLocaleString("nl-BE"), icon: FileText, color: "text-white/80" },
    { label: reportCopy.totalChecks, value: model.quickWins.totalChecks, icon: Search, color: "text-white" },
    { label: reportCopy.passed, value: model.quickWins.passed, icon: CircleCheckBig, color: "text-emerald-300" },
    { label: reportCopy.warnings, value: model.quickWins.warnings, icon: TriangleAlert, color: "text-amber-300" },
    { label: reportCopy.errors, value: model.quickWins.errors, icon: XCircle, color: "text-red-300" },
  ];

  return (
    <section>
      <SectionTitle>{reportCopy.quickWins}</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <Icon className={`h-5 w-5 ${card.color}`} aria-hidden="true" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-white/45">{card.label}</p>
              <p className={`mt-1 break-words text-xl font-black ${card.color}`}>{card.value}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
