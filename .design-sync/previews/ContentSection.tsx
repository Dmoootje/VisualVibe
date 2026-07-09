import { ContentSection, BlogProse } from "nova";

export const WithTitle = () => (
  <div style={{ padding: 24, maxWidth: 720 }}>
    <ContentSection id="wat-is-geo" title="Wat is GEO?">
      <BlogProse>
        <p>
          GEO is de praktijk van content optimaliseren zodat generatieve AI-modellen
          ze correct kunnen samenvatten en citeren. Waar klassieke SEO mikt op de tien
          blauwe links, mikt GEO op het antwoord zelf.
        </p>
      </BlogProse>
    </ContentSection>
  </div>
);

export const WithEyebrow = () => (
  <div style={{ padding: 24, maxWidth: 720 }}>
    <ContentSection
      id="aanpak"
      eyebrow="Onze werkwijze"
      title="Zo pakken we lokale SEO aan in Limburg"
    >
      <BlogProse>
        <p>
          Van een grondige analyse van zoekintenties tot meetbare resultaten: elke stap
          is gericht op meer aanvragen voor jouw KMO in Hasselt, Genk of Sint-Truiden.
        </p>
      </BlogProse>
    </ContentSection>
  </div>
);

export const TitleOnly = () => (
  <div style={{ padding: 24, maxWidth: 720 }}>
    <ContentSection title="Veelgestelde vragen over videografie">
      <BlogProse>
        <p>
          Een goede bedrijfsvideo begint bij een helder verhaal. Wij verzorgen script,
          opname met camera en drone, en montage tot een afgewerkte film.
        </p>
      </BlogProse>
    </ContentSection>
  </div>
);
