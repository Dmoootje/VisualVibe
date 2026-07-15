import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { businessConfig } from "@/config/business.config";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { getAnalysisLeadByReportToken } from "@/lib/firestore/analysisLeads";
import { getAnalysisReport } from "@/lib/firestore/analysisReports";
import { RequestNewAnalysisButton } from "@/components/analyse/RequestNewAnalysisButton";
import {
  createReportViewModel,
  ReportAioGeo,
  ReportCategoryAccordion,
  ReportIssues,
  ReportKeywordDensity,
  ReportPageDetails,
  ReportQuickWins,
  ReportScoreHero,
  ReportStrengths,
} from "@/components/analyse/report";
import type { AnalysisLead } from "@/types/analysis";

// Rapport leeft achter een niet-voorspelbaar token en toont live Firestore-data:
// altijd dynamisch renderen, nooit cachen. revalidate 0 als vangnet omdat
// next-intl het [locale]-subtree richting statische rendering duwt.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  return pageMetadata({
    title: `Rapport websiteanalyse | ${businessConfig.displayName}`,
    description:
      "Persoonlijk rapport van je gratis websiteanalyse met score, checks, tips en concrete verbeterpunten.",
    path: `/website-analyse/rapport/${token}/`,
    noindex: true,
  });
}

function scoreColorClass(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function AnalyseRapportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const lead = await getAnalysisLeadByReportToken(token);

  if (!lead || lead.status !== "completed") {
    notFound();
  }

  const reportDate = lead.completedAt ?? lead.updatedAt;
  const reportDocument = lead.reportId
    ? await getAnalysisReport(lead.reportId).catch(() => null)
    : null;
  const report = reportDocument?.report;
  const model = report ? createReportViewModel(report) : null;

  return (
    <div className="min-h-screen pb-16 pt-24 text-white">
      <div className="container mx-auto px-2.5 sm:px-4">
        <header className="mb-8 max-w-4xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-orange-400">
            Rapport websiteanalyse
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">{lead.normalizedDomain}</h1>
          <p className="mt-3 text-sm text-white/50">Geanalyseerd op {formatDate(reportDate)}</p>
        </header>

        {report && model ? (
          <main className="space-y-10">
            <ReportScoreHero report={report} quickWins={model.quickWins} />
            <ReportQuickWins model={model} />
            <ReportAioGeo category={model.aioGeo} />
            <ReportKeywordDensity density={model.keywordDensity} />
            <ReportIssues issues={report.topIssues} />
            <ReportStrengths strengths={report.strengths} />
            <ReportCategoryAccordion categories={model.categories} />
            <ReportPageDetails report={report} />
          </main>
        ) : (
          <LegacyReportSummary lead={lead} />
        )}

        <div className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/contact"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border-0 bg-gradient-to-r from-red-500 to-amber-500 px-6 text-sm font-medium text-white shadow-lg shadow-amber-500/20 transition-colors hover:from-red-600 hover:to-amber-600 sm:w-auto"
          >
            Resultaten bespreken
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/offerte-aanvragen"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.14] px-[22px] py-3 text-sm font-bold text-white/85 transition-colors hover:border-orange-400/50 hover:bg-orange-400/[0.06] hover:text-white sm:w-auto"
          >
            Offerte aanvragen
          </Link>
        </div>

        <div className="mt-4 max-w-2xl">
          <RequestNewAnalysisButton />
        </div>
      </div>
    </div>
  );
}

function LegacyReportSummary({ lead }: { lead: AnalysisLead }) {
  return (
    <div className="max-w-2xl rounded-[18px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8">
      {typeof lead.analysisScore === "number" && (
        <div className="mb-6 flex items-baseline gap-2">
          <span className={`text-7xl font-bold ${scoreColorClass(lead.analysisScore)}`}>
            {lead.analysisScore}
          </span>
          <span className="text-xl text-white/40">/ 100</span>
        </div>
      )}

      {lead.analysisSummary && (
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-white/70">
            Samenvatting
          </h2>
          <p className="text-[15px] leading-relaxed text-white/75">{lead.analysisSummary}</p>
        </div>
      )}

      {lead.criticalIssues && lead.criticalIssues.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/70">
            Belangrijkste verbeterpunten
          </h2>
          <ul className="flex flex-col gap-2.5">
            {lead.criticalIssues.map((issue, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-white/70">
                <AlertTriangle
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                  aria-hidden="true"
                />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
