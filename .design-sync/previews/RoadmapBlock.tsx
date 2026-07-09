import { RoadmapBlock } from "nova";

export const Default = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 640 }}>
    <RoadmapBlock
      steps={[
        { title: "Analyse", description: "We brengen zoekintenties en AI-antwoorden in kaart." },
        { title: "Structuur", description: "Direct-answer paragrafen, FAQ-schema en interne links." },
        { title: "Content", description: "Herbruikbare blokken, consistente claims, sterke koppen." },
        { title: "Meten", description: "Zichtbaarheid in Google én AI-engines opvolgen." },
      ]}
    />
  </div>
);

export const WithLabels = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 640 }}>
    <RoadmapBlock
      steps={[
        { label: "I", title: "Kennismaking", description: "Een gesprek over je doelen en doelgroep in Limburg." },
        { label: "II", title: "Concept", description: "Moodboard, structuur en een duidelijk voorstel." },
        { label: "III", title: "Productie", description: "Design, fotografie en videografie op locatie." },
        { label: "IV", title: "Lancering", description: "Live gaan met sterke Core Web Vitals." },
      ]}
    />
  </div>
);

export const RichDescriptions = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 640 }}>
    <RoadmapBlock
      steps={[
        {
          title: "Intake",
          description: (
            <>
              We starten met een <strong>gratis GEO-scan</strong> van je website.
            </>
          ),
        },
        {
          title: "Optimalisatie",
          description: (
            <>
              Meer weten? Lees onze <a href="/kennisbank/seo-geo">gids over AEO en GEO</a>.
            </>
          ),
        },
        { title: "Opvolging", description: "Maandelijkse rapportage en bijsturing." },
      ]}
    />
  </div>
);
