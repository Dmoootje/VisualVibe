import { ComparisonTable } from "nova";

export const Default = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 760 }}>
    <ComparisonTable
      highlightFirstColumn
      headers={["Aspect", "Klassieke SEO", "GEO / AEO"]}
      rows={[
        ["Doel", "Ranking in de tien blauwe links", "Het antwoord zelf zijn"],
        ["Format", "Keywords en backlinks", "Direct-answer en schema"],
        ["Meeteenheid", "Positie in Google", "Citaties en zichtbaarheid in AI"],
      ]}
    />
  </div>
);

export const WithCaption = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 760 }}>
    <ComparisonTable
      highlightFirstColumn
      caption="Prijsindicatie per pakket, exclusief btw. Vraag een offerte op maat aan."
      headers={["Pakket", "Starter", "Groei", "Op maat"]}
      rows={[
        ["Ideaal voor", "Zelfstandigen", "KMO's in Limburg", "Grotere teams"],
        ["Pagina's", "Tot 5", "Tot 12", "Onbeperkt"],
        ["Lokale SEO", "Basis", "Uitgebreid", "Volledig"],
        ["Onderhoud", "Optioneel", "Maandelijks", "Op maat"],
      ]}
    />
  </div>
);

export const Plain = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 760 }}>
    <ComparisonTable
      headers={["Dienst", "Levertijd", "Startprijs"]}
      rows={[
        ["Bedrijfsvideo", "3 tot 4 weken", "vanaf 1.850 euro"],
        ["Drone- en FPV-opnames", "1 tot 2 weken", "vanaf 650 euro"],
        ["Fotoreportage", "1 week", "vanaf 450 euro"],
        ["Podcast-productie", "Per aflevering", "vanaf 390 euro"],
      ]}
    />
  </div>
);
