export const reportCopyNl = {
  score: "Totaalscore",
  summary: "Samenvatting",
  passed: "Geslaagd",
  warnings: "Aandacht",
  errors: "Problemen",
  quickWins: "Quick Wins Scorecard",
  totalWords: "Totaal woorden",
  stopWords: "Stopwoorden",
  topKeyword: "Topkeyword",
  totalChecks: "Controles",
  aioGeo: "AIO/GEO Health Check",
  keywordDensity: "Keyword density",
  singleWords: "Eén woord",
  doubleWords: "Twee woorden",
  tripleWords: "Drie woorden",
  phrase: "Keyword",
  count: "Aantal",
  locations: "Locaties",
  density: "Density",
  details: "Gedetailleerd rapport",
  strengths: "Sterke punten",
  issues: "Belangrijkste verbeterpunten",
  pageDetails: "Pagina- en technische gegevens",
  noDensity: "Voor deze analyse zijn geen keywordgegevens beschikbaar.",
  advice: "Aanbevolen actie",
} as const;

export type ReportLocale = "nl" | "en";
export const reportCopyEn: { [K in keyof typeof reportCopyNl]: string } = {
  score: "Overall score", summary: "Summary", passed: "Passed", warnings: "Warnings", errors: "Issues",
  quickWins: "Quick wins scorecard", totalWords: "Total words", stopWords: "Stop words", topKeyword: "Top keyword",
  totalChecks: "Total checks", aioGeo: "AIO/GEO health check", keywordDensity: "Keyword density",
  singleWords: "Single words", doubleWords: "Two-word phrases", tripleWords: "Three-word phrases",
  phrase: "Keyword", count: "Count", locations: "Locations", density: "Density", details: "Detailed report",
  strengths: "Strengths", issues: "Main areas for improvement", pageDetails: "Page and technical details",
  noDensity: "No keyword data is available for this analysis.", advice: "Recommended action",
};
export function getReportCopy(locale: ReportLocale = "nl") { return locale === "en" ? reportCopyEn : reportCopyNl; }
export function canDisplayReportInLocale(locale: ReportLocale, outputLanguage?: string) {
  return outputLanguage === locale || (locale === "nl" && outputLanguage === undefined);
}
export const reportCopy = reportCopyNl;
