import { ChecklistBlock } from "nova";

export const Default = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 680 }}>
    <ChecklistBlock
      items={[
        "Zichtbaar in Google AI Overviews én de klassieke resultaten",
        "Meer autoriteit door consistente feiten over al je pagina's",
        "Lokale vindbaarheid in Hasselt en Genk versterkt",
        "Snellere website dankzij sterke Core Web Vitals",
      ]}
    />
  </div>
);

export const WithTitle = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 680 }}>
    <ChecklistBlock
      title="Wat je krijgt bij een GEO-scan"
      items={[
        "Analyse van je huidige AI-zichtbaarheid in ChatGPT en Perplexity",
        "Concrete verbeterpunten voor direct-answer paragrafen",
        "Advies rond FAQ-schema en interne links",
        "Een prioriteitenlijst op maat van je KMO in Limburg",
      ]}
    />
  </div>
);

export const RichContent = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 680 }}>
    <ChecklistBlock
      title="Checklist voor een converterende website"
      items={[
        <>
          Een <strong>heldere call-to-action</strong> boven de vouw
        </>,
        <>
          Snelle laadtijd, ook op mobiel in <strong>Sint-Truiden</strong>
        </>,
        <>
          Meer weten? Bekijk onze <a href="/diensten/webdesign">webdesign-dienst</a>
        </>,
      ]}
    />
  </div>
);
