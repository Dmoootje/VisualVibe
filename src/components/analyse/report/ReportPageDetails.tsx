import type { NormalizedPartnerAuditReport } from "@/types/analysis";
import { reportCopy } from "@/components/analyse/report/reportCopy";
import { SectionTitle } from "@/components/analyse/report/SectionTitle";

export function ReportPageDetails({ report }: { report: NormalizedPartnerAuditReport }) {
  const values = [
    ["Geanalyseerde URL", report.url],
    ["Meta title", report.page.metaTitle],
    ["Meta description", report.page.metaDescription],
    ["H1", report.page.h1],
    ["Canonical", report.page.canonical],
    ["Taal", report.page.language],
    ["Indexeerbaar", report.page.indexable === undefined ? undefined : report.page.indexable ? "Ja" : "Nee"],
    ["Client-side rendering", report.technical.csrDetected === undefined ? undefined : report.technical.csrDetected ? "Gedetecteerd" : "Niet gedetecteerd"],
    ["Gerenderde inhoud", report.technical.renderedAvailable === undefined ? undefined : report.technical.renderedAvailable ? "Beschikbaar" : "Niet beschikbaar"],
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
