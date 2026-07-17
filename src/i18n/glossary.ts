export type EnglishGlossaryEntry = Readonly<{
  source: string;
  target: string;
  notes: string;
  preserve: boolean;
}>;

export const ENGLISH_GLOSSARY = [
  {
    source: "KMO",
    target: "SME",
    notes:
      "Use small or medium-sized business in running copy when the abbreviation would feel formal or unclear. Never use SMB by default.",
    preserve: false,
  },
  {
    source: "offerte",
    target: "quotation",
    notes:
      "Use quotation for a priced proposal and request a quotation for the main CTA. Use proposal only when the source describes a broader strategic proposal.",
    preserve: false,
  },
  {
    source: "realisaties",
    target: "case studies",
    notes:
      "Use case studies for the portfolio route and evidence-led project pages. Use selected work only when referring to a visual gallery without a documented case narrative.",
    preserve: false,
  },
  {
    source: "websiteanalyse",
    target: "website analysis",
    notes:
      "Use website analysis for the named VisualVibe tool. Website audit is acceptable only when the page specifically describes a formal audit deliverable.",
    preserve: false,
  },
  {
    source: "vindbaarheid",
    target: "online visibility",
    notes:
      "Translate by context. Prefer online visibility for the broad concept, search visibility for search performance, and easier to find in natural explanatory copy.",
    preserve: false,
  },
  {
    source: "SEO",
    target: "SEO",
    notes: "Preserve the established industry abbreviation and its capitalisation.",
    preserve: true,
  },
  {
    source: "AEO",
    target: "AEO",
    notes:
      "Preserve the abbreviation. On first use where needed, explain it as answer engine optimisation.",
    preserve: true,
  },
  {
    source: "GEO",
    target: "GEO",
    notes:
      "Preserve the abbreviation. On first use where needed, explain it as generative engine optimisation.",
    preserve: true,
  },
  {
    source: "FPV",
    target: "FPV",
    notes:
      "Preserve the abbreviation. Explain first-person view on first use when the audience may not know drone terminology.",
    preserve: true,
  },
  {
    source: "VisualVibe",
    target: "VisualVibe",
    notes: "Preserve the brand name and internal capitalisation exactly.",
    preserve: true,
  },
  {
    source: "Limburg",
    target: "Limburg",
    notes:
      "Preserve the geographic name. Clarify Limburg, Belgium when an international reader could confuse it with Dutch Limburg.",
    preserve: true,
  },
] as const satisfies readonly EnglishGlossaryEntry[];
