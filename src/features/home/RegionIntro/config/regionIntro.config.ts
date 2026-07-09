export const regionIntroConfig = {
  title: "Actief in heel Limburg en daarbuiten",
  subtitle:
    "Limburg is onze thuisregio - we werken ook in Vlaanderen, Antwerpen en Nederlands-Limburg.",
  ctaLabel: "Bekijk alle regio's",
  ctaHref: "/regio",
};

/** Per-region card copy (label + short description), keyed by region slug. */
export const regionCards: Record<string, { label: string; description: string }> = {
  limburg: {
    label: "Thuisregio",
    description: "Onze thuisbasis waar we het vaakst actief zijn.",
  },
  vlaanderen: {
    label: "Regio",
    description: "Voor bedrijven die hun online uitstraling willen versterken.",
  },
  antwerpen: {
    label: "Regio",
    description: "Actief voor websites, branding en visuele content.",
  },
  "nederlands-limburg": {
    label: "Regio",
    description: "Ook net over de grens helpen we bedrijven groeien.",
  },
};
