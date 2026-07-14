export const regionIntroConfig = {
  title: "Vanuit Limburg, actief in meerdere regio's",
  subtitle:
    "VisualVibe is gevestigd in Limburg. Kies je regio voor lokale informatie, diensten en realisaties uit jouw omgeving.",
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
    description: "Lokale informatie, diensten en realisaties voor jouw omgeving.",
  },
  antwerpen: {
    label: "Regio",
    description: "Ontdek onze aanpak en projecten in de provincie Antwerpen.",
  },
  "nederlands-limburg": {
    label: "Regio",
    description: "Ook net over de grens helpen we bedrijven vooruit.",
  },
};
