import type { NormalizedPartnerKeywordDensity, NormalizedPartnerKeywordStat } from "@/types/analysis";
import { getReportCopy, type ReportLocale } from "@/components/analyse/report/reportCopy";
import { SectionTitle } from "@/components/analyse/report/SectionTitle";

export function ReportKeywordDensity({ density, locale = "nl" }: { density?: NormalizedPartnerKeywordDensity; locale?: ReportLocale }) {
  const reportCopy = getReportCopy(locale);
  return (
    <section>
      <SectionTitle>{reportCopy.keywordDensity}</SectionTitle>
      {!density ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-sm text-white/55">{reportCopy.noDensity}</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <DensityTable title={reportCopy.singleWords} rows={density.single} locale={locale} />
          <DensityTable title={reportCopy.doubleWords} rows={density.double} locale={locale} />
          <div className="lg:col-span-2">
            <DensityTable title={reportCopy.tripleWords} rows={density.triple} locale={locale} />
          </div>
        </div>
      )}
    </section>
  );
}

function DensityTable({ title, rows, locale }: { title: string; rows: NormalizedPartnerKeywordStat[]; locale: ReportLocale }) {
  const reportCopy = getReportCopy(locale);
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
      <h3 className="border-b border-white/10 px-4 py-3 text-sm font-bold text-white">{title}</h3>
      {rows.length === 0 ? (
        <p className="p-4 text-sm text-white/45">{locale === "en" ? "No data available." : "Geen gegevens beschikbaar."}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-black/20 text-[11px] uppercase tracking-wide text-white/40">
              <tr>
                <th className="px-4 py-3 font-semibold">{reportCopy.phrase}</th>
                <th className="px-3 py-3 font-semibold">{reportCopy.count}</th>
                <th className="px-3 py-3 font-semibold">{reportCopy.locations}</th>
                <th className="px-4 py-3 text-right font-semibold">{reportCopy.density}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.phrase} className="border-t border-white/[0.07] text-white/70">
                  <td className="px-4 py-3 font-semibold text-orange-300">{row.phrase}</td>
                  <td className="px-3 py-3 font-mono text-white/85">{row.count}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.locations.map((location) => <span key={location} className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/60">{location}</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-300">{row.density.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
