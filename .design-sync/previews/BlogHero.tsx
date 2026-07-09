import { BlogHero } from "nova";

export const Default = () => (
  <div style={{ padding: 24 }}>
    <BlogHero
      category="SEO & GEO"
      title="GEO en AEO voor KMO's:"
      titleAccent="gevonden worden in AI-zoekresultaten"
      excerpt="Een voorbeeldartikel dat elk blok in context toont - van lead-intro tot FAQ met schema."
      author="VisualVibe"
      publishedAt="2026-07-08"
      readingTime="12 min"
      image="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fblog%2Flokale-seo-limburg-kmo-hero.webp?alt=media&token=6787c961-f80d-4fb6-8464-dea9c43037fc"
      imageAlt="AI-zoekresultaten voorbeeld"
    />
  </div>
);

export const WithoutImage = () => (
  <div style={{ padding: 24 }}>
    <BlogHero
      category="Webdesign"
      title="Website laten maken in Limburg:"
      titleAccent="de complete gids voor KMO's"
      excerpt="Van strategie tot livegang - hoe je een snelle, converterende website bouwt die gevonden wordt."
      author="VisualVibe"
      publishedAt="2026-06-30"
      readingTime="22 min"
    />
  </div>
);
