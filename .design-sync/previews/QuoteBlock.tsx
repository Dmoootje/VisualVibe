import { QuoteBlock } from "nova";

export const WithAttribution = () => (
  <div style={{ padding: 24, maxWidth: 720 }}>
    <QuoteBlock author="Team VisualVibe" role="Creatief mediabureau">
      Wie vandaag begrijpelijk is voor AI, wint morgen de klik, of het antwoord.
    </QuoteBlock>
  </div>
);

export const ClientQuote = () => (
  <div style={{ padding: 24, maxWidth: 720 }}>
    <QuoteBlock author="Sofie Vanderheyden" role="Zaakvoerder bakkerij De Korenaar, Tongeren">
      Sinds onze nieuwe website en lokale SEO krijgen we elke week aanvragen uit de
      buurt. Eindelijk worden we gevonden door wie ons zoekt.
    </QuoteBlock>
  </div>
);

export const NoAttribution = () => (
  <div style={{ padding: 24, maxWidth: 720 }}>
    <QuoteBlock>
      Een sterk merk begint bij consistent beeld: één fotograaf, één stijl, één verhaal
      over al je kanalen heen.
    </QuoteBlock>
  </div>
);

export const AuthorOnly = () => (
  <div style={{ padding: 24, maxWidth: 720 }}>
    <QuoteBlock author="Jan Reynders, Genk">
      De drone-beelden van onze werf gaven onze offertes meteen meer overtuigingskracht.
    </QuoteBlock>
  </div>
);
