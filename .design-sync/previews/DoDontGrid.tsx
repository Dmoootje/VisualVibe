import { DoDontGrid } from "nova";

export const Default = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 720 }}>
    <DoDontGrid
      dos={[
        "Beantwoord de vraag in de eerste alinea",
        "Gebruik FAQ-schema en heldere, vraaggerichte koppen",
        "Herhaal je kernfeiten consistent over pagina's heen",
      ]}
      donts={[
        "Vaag inleiden zonder direct antwoord",
        "Keyword stuffing in elke zin",
        "Tegenstrijdige cijfers per pagina gebruiken",
      ]}
    />
  </div>
);

export const CustomTitles = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 720 }}>
    <DoDontGrid
      doTitle="Slim aanpakken"
      dontTitle="Vermijd dit"
      dos={[
        "Kies één duidelijke fotostijl per merk",
        "Lever beelden aan in het juiste formaat per kanaal",
        "Plan een drone-shoot bij helder weer boven Genk",
      ]}
      donts={[
        "Stockfoto's die niet bij je bedrijf passen",
        "Alles in één dag proppen zonder draaiboek",
        "Te zware beelden die je website vertragen",
      ]}
    />
  </div>
);

export const RichContent = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 720 }}>
    <DoDontGrid
      doTitle="Wel doen voor lokale SEO"
      dontTitle="Niet doen"
      dos={[
        <>
          Houd je <strong>NAP-gegevens</strong> overal identiek
        </>,
        <>
          Maak echte regiopagina's voor <strong>Tongeren</strong> en Bilzen
        </>,
        "Verzamel eerlijke reviews op Google Business",
      ]}
      donts={[
        "Dunne, bijna-identieke stadspagina's kopiëren",
        <>
          Reviews <strong>kopen</strong> of verzinnen
        </>,
        "Je adres op elke pagina anders schrijven",
      ]}
    />
  </div>
);
