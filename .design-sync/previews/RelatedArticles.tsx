import { RelatedArticles } from "nova";

const HERO_MAP =
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fblog%2Fwebsite-laten-maken-limburg-hero.webp?alt=media&token=2434bbf7-60c1-48c6-bca4-7b55e29a8f31";
const HERO_LAPTOP =
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fblog%2Flokale-seo-limburg-kmo-hero.webp?alt=media&token=6787c961-f80d-4fb6-8464-dea9c43037fc";

export const WithImages = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 960 }}>
    <RelatedArticles
      items={[
        {
          title: "Lokale SEO voor KMO's in Limburg",
          href: "/kennisbank/seo-geo/lokale-seo-voor-kmos-in-limburg/",
          category: "SEO & GEO",
          readingTime: "14 min",
          image: HERO_LAPTOP,
        },
        {
          title: "Website laten maken in Limburg: de complete gids",
          href: "/kennisbank/webdesign/website-laten-maken-limburg-complete-gids/",
          category: "Webdesign",
          readingTime: "22 min",
          image: HERO_MAP,
        },
        {
          title: "Gevonden worden in AI-zoekresultaten (GEO/AEO)",
          href: "/kennisbank/seo-geo/gevonden-worden-in-ai-zoekresultaten-geo-aeo/",
          category: "SEO & GEO",
          readingTime: "15 min",
          image: HERO_LAPTOP,
        },
      ]}
    />
  </div>
);

export const TextOnly = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 960 }}>
    <RelatedArticles
      title="Meer lezen"
      items={[
        {
          title: "Waarom videografie je conversie verhoogt",
          href: "/kennisbank/videografie/waarom-videografie-je-conversie-verhoogt/",
          category: "Videografie",
          readingTime: "9 min",
        },
        {
          title: "Drone-opnames voor vastgoed in Limburg",
          href: "/kennisbank/drone-fpv/drone-opnames-vastgoed-limburg/",
          category: "Drone & FPV",
          readingTime: "7 min",
        },
      ]}
    />
  </div>
);
