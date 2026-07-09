import { FaqAccordion } from "nova";

export const Default = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 720 }}>
    <FaqAccordion
      items={[
        {
          question: "Wat is het verschil tussen SEO en GEO?",
          answer:
            "SEO optimaliseert voor klassieke zoekresultaten; GEO optimaliseert je content zodat AI-zoekmachines zoals ChatGPT en Google AI Overviews ze correct samenvatten en citeren.",
        },
        {
          question: "Heeft mijn KMO in Limburg GEO nodig?",
          answer:
            "Ja. Steeds meer zoekopdrachten worden door AI beantwoord. Wie vroeg zichtbaar is in AI-antwoorden, bouwt een blijvende voorsprong op in de regio Hasselt en Genk.",
        },
        {
          question: "Werkt GEO samen met lokale SEO?",
          answer:
            "Absoluut. Consistente NAP-gegevens en lokale content versterken zowel je Google-vindbaarheid als je AI-zichtbaarheid in heel Limburg.",
        },
      ]}
    />
  </div>
);

export const RichAnswers = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 720 }}>
    <FaqAccordion
      items={[
        {
          question: "Wat kost een website laten maken in Limburg?",
          answer: (
            <>
              Een <strong>maatwerk website</strong> bij VisualVibe start doorgaans
              vanaf een vast projectbudget. De prijs hangt af van het aantal
              pagina&apos;s, fotografie en videografie. Vraag een{" "}
              <a href="/offerte-aanvragen">vrijblijvende offerte</a> aan.
            </>
          ),
          plainAnswer:
            "Een maatwerk website bij VisualVibe start vanaf een vast projectbudget en hangt af van het aantal pagina's, fotografie en videografie.",
        },
        {
          question: "Doen jullie ook drone- en FPV-opnames?",
          answer:
            "Ja. Ons team vliegt met vergunning in de regio Tongeren, Sint-Truiden en Maasmechelen voor vastgoed, events en bedrijfsvideo's.",
        },
      ]}
    />
  </div>
);
