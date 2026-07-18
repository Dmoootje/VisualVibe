import type { NormalizedPartnerAuditReport } from "@/types/analysis";
import { getReportCopy, type ReportLocale } from "@/components/analyse/report/reportCopy";
import { SectionTitle } from "@/components/analyse/report/SectionTitle";

export function ReportPageDetails({ report, locale = "nl" }: { report: NormalizedPartnerAuditReport; locale?: ReportLocale }) {
  const reportCopy = getReportCopy(locale);
  const en = locale === "en";
  const values = [
    [en ? "Analysed URL" : "Geanalyseerde URL", report.url],
    ["Meta title", report.page.metaTitle],
    ["Meta description", report.page.metaDescription],
    ["H1", report.page.h1],
    ["Canonical", report.page.canonical],
    [en ? "Language" : "Taal", report.page.language],
    [en ? "Indexable" : "Indexeerbaar", report.page.indexable === undefined ? undefined : report.page.indexable ? (en ? "Yes" : "Ja") : (en ? "No" : "Nee")],
    ["Client-side rendering", report.technical.csrDetected === undefined ? undefined : report.technical.csrDetected ? (en ? "Detected" : "Gedetecteerd") : (en ? "Not detected" : "Niet gedetecteerd")],
    [en ? "Rendered content" : "Gerenderde inhoud", report.technical.renderedAvailable === undefined ? undefined : report.technical.renderedAvailable ? (en ? "Available" : "Beschikbaar") : (en ? "Not available" : "Niet beschikbaar")],
  ].filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].length > 0);

  if (values.length === 0) return null;
  return (
    <section>
      <SectionTitle>{reportCopy.pageDetails}</SectionTitle>
      <dl className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
        {values.map(([label, value]) => (
          <div key={label} className="bg-black/70 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-white/40">{label}</dt>
            <dd className="mt-1 break-words text-sm leading-6 text-white/70">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
