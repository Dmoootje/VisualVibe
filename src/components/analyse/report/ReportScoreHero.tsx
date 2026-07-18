import Image from "next/image";
import { Search } from "lucide-react";
import type { NormalizedPartnerAuditReport } from "@/types/analysis";
import type { ReportViewModel } from "@/components/analyse/report/reportViewModel";
import { getReportCopy, type ReportLocale } from "@/components/analyse/report/reportCopy";

const SEO_SUPERCHARGED_LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fseo%20supercharged%20logo%20seowebsites.png?alt=media&token=1deb25f5-c1ef-4648-a705-04ae804352f0";

export function ReportScoreHero({
  report,
  quickWins,
  topKeyword,
  locale = "nl",
}: {
  report: NormalizedPartnerAuditReport;
  quickWins: ReportViewModel["quickWins"];
  topKeyword?: ReportViewModel["topKeyword"];
  locale?: ReportLocale;
}) {
  const reportCopy = getReportCopy(locale);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (report.overallScore / 100) * circumference;

  return (
    <section className="rounded-[22px] border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm sm:p-8">
      <div className="grid items-center gap-8 lg:grid-cols-[220px_1fr]">
        <div className="mx-auto flex flex-col items-center">
          <div className="relative h-44 w-44" role="img" aria-label={`${reportCopy.score}: ${report.overallScore} ${locale === "en" ? "out of" : "op"} 100`}>
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
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
            <StatusCount label={reportCopy.passed} value={quickWins.passed} tone="success" />
            <StatusCount label={reportCopy.warnings} value={quickWins.warnings} tone="warning" />
            <StatusCount label={reportCopy.errors} value={quickWins.errors} tone="error" />
            <TopKeywordCard topKeyword={topKeyword} locale={locale} />
            <SeoSuperchargedCard locale={locale} />
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

function TopKeywordCard({ topKeyword, locale }: { topKeyword?: ReportViewModel["topKeyword"]; locale: ReportLocale }) {
  const reportCopy = getReportCopy(locale);
  const value = topKeyword ? `${topKeyword.phrase} · ${topKeyword.density.toFixed(2)}%` : locale === "en" ? "Not available" : "Niet beschikbaar";

  return (
    <article className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-3 sm:px-4">
      <Search className="h-5 w-5 text-emerald-300" aria-hidden="true" />
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-white/45 sm:text-xs">{reportCopy.topKeyword}</p>
      <p className="mt-1 break-words text-xl font-black leading-tight text-emerald-300">{value}</p>
    </article>
  );
}

function SeoSuperchargedCard({ locale }: { locale: ReportLocale }) {
  return (
    <a
      href="https://seowebsites.be/"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-[116px] flex-col justify-between rounded-xl border border-emerald-400/20 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.16),transparent_48%),rgba(0,0,0,0.22)] px-3 py-3 transition hover:border-emerald-300/45 hover:bg-emerald-400/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 sm:px-4"
      aria-label={locale === "en" ? "Want this widget on your website? View SEO Supercharged" : "Deze widget ook op je website? Bekijk SEO Supercharged"}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">{locale === "en" ? "Provided by" : "Aangeboden door"}</span>
      <Image
        src={SEO_SUPERCHARGED_LOGO_URL}
        alt="SEO Supercharged"
        width={220}
        height={72}
        className="mt-3 h-auto w-full max-w-[180px] object-contain"
        unoptimized
      />
      <span className="mt-3 text-sm font-medium text-white/75 transition group-hover:text-emerald-100">
        {locale === "en" ? "Want this widget on your website? →" : "Deze widget ook op je website? →"}
      </span>
    </a>
  );
}
