import { BlogImage } from "nova";

const HERO_MAP =
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fblog%2Fwebsite-laten-maken-limburg-hero.webp?alt=media&token=2434bbf7-60c1-48c6-bca4-7b55e29a8f31";
const HERO_LAPTOP =
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fblog%2Flokale-seo-limburg-kmo-hero.webp?alt=media&token=6787c961-f80d-4fb6-8464-dea9c43037fc";

export const WithCaption = () => (
  <div style={{ padding: 24, maxWidth: 768 }}>
    <BlogImage
      src={HERO_MAP}
      alt="Lokale vindbaarheid voor KMO's in Limburg"
      caption="Een website die snel laadt en lokaal scoort, betaalt zich terug in aanvragen."
    />
  </div>
);

export const NoCaption = () => (
  <div style={{ padding: 24, maxWidth: 768 }}>
    <BlogImage
      src={HERO_LAPTOP}
      alt="Voorbeeld van AI-zoekresultaten op een laptop"
    />
  </div>
);

export const SquareAspect = () => (
  <div style={{ padding: 24, maxWidth: 520 }}>
    <BlogImage
      src={HERO_LAPTOP}
      alt="Detailopname van een SEO-dashboard voor een Hasseltse KMO"
      aspect="1/1"
      caption="Vierkant formaat, ideaal voor een portretfoto of productbeeld in het artikel."
    />
  </div>
);
