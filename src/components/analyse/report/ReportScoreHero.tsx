import type { NormalizedPartnerAuditReport } from "@/types/analysis";
import type { ReportViewModel } from "@/components/analyse/report/reportViewModel";
import { reportCopy } from "@/components/analyse/report/reportCopy";

export function ReportScoreHero({
  report,
  quickWins,
}: {
  report: NormalizedPartnerAuditReport;
  quickWins: ReportViewModel["quickWins"];
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (report.overallScore / 100) * circumference;

  return (
    <section className="rounded-[22px] border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm sm:p-8">
      <div className="grid items-center gap-8 lg:grid-cols-[220px_1fr]">
        <div className="mx-auto flex flex-col items-center">
          <div className="relative h-44 w-44" role="img" aria-label={`${reportCopy.score}: ${report.overallScore} op 100`}>
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="text-emerald-400 drop-shadow-lg"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-emerald-300">{report.overallScore}</span>
              <span className="text-sm font-medium text-white/45">/ 100</span>
            </div>
          </div>
          <div className="mt-3 h-1 w-24 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/30" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400">{reportCopy.summary}</p>
          <p className="mt-3 max-w-3xl text-base leading-7 text-white/75 sm:text-lg">{report.summary}</p>
          <div className="mt-6 grid grid-cols-3 gap-2.5 sm:max-w-xl sm:gap-4">
            <StatusCount label={reportCopy.passed} value={quickWins.passed} tone="success" />
            <StatusCount label={reportCopy.warnings} value={quickWins.warnings} tone="warning" />
            <StatusCount label={reportCopy.errors} value={quickWins.errors} tone="error" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusCount({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "warning" | "error";
}) {
  const color = tone === "success" ? "text-emerald-300" : tone === "warning" ? "text-amber-300" : "text-red-300";
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-center sm:px-4">
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-white/45 sm:text-xs">{label}</p>
    </div>
  );
}
