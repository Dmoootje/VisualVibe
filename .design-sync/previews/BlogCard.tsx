import { BlogCard } from "nova";

const HERO_1 =
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fblog%2Flokale-seo-limburg-kmo-hero.webp?alt=media&token=6787c961-f80d-4fb6-8464-dea9c43037fc";
const HERO_2 =
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fblog%2Fwebsite-laten-maken-limburg-hero.webp?alt=media&token=2434bbf7-60c1-48c6-bca4-7b55e29a8f31";

const POSTS = [
  {
    title: "GEO en AEO voor KMO's: Gevonden worden in Google, ChatGPT en AI-zoekresultaten",
    slug: "gevonden-worden-in-ai-zoekresultaten-geo-aeo",
    category: "SEO & GEO",
    categorySlug: "seo-geo",
    pillar: true,
    author: "VisualVibe",
    publishedAt: "2026-07-08",
    readingTime: "15 min",
    excerpt:
      "AI verandert hoe mensen zoeken. Ontdek hoe KMO's met GEO, AEO, SEO, structured data en duidelijke antwoorden beter zichtbaar worden in Google en AI-engines.",
    content: "",
    seoTitle: "GEO en AEO voor KMO's",
    seoDescription: "Gevonden worden in AI-zoekresultaten.",
    ogImage: HERO_1,
    heroImageAlt: "AI-zoekresultaten voorbeeld",
  },
  {
    title: "Lokale SEO voor KMO's in Limburg: Zo word je gevonden door klanten in je regio",
    slug: "lokale-seo-voor-kmos-in-limburg",
    category: "SEO & GEO",
    categorySlug: "seo-geo",
    pillar: false,
    author: "VisualVibe",
    publishedAt: "2026-07-08",
    readingTime: "14 min",
    excerpt:
      "Lokale SEO helpt KMO's in Limburg beter gevonden worden door klanten in hun regio. Ontdek hoe je website, Google Business Profiel, dienstenpagina's, cases en lokale content samenwerken.",
    content: "",
    seoTitle: "Lokale SEO voor KMO's in Limburg",
    seoDescription: "Zo word je gevonden door klanten in je regio.",
    ogImage: HERO_1,
    heroImageAlt: "Lokale vindbaarheid in Limburg",
  },
  {
    title: "Website laten maken in Limburg: Complete gids voor KMO's die online willen groeien",
    slug: "website-laten-maken-limburg-complete-gids",
    category: "Webdesign",
    categorySlug: "webdesign",
    pillar: true,
    author: "VisualVibe",
    publishedAt: "2026-07-08",
    readingTime: "22 min",
    excerpt:
      "Een complete gids voor KMO's die een professionele website willen laten maken in Limburg. Ontdek hoe webdesign, SEO, fotografie, video en lokale vindbaarheid samenkomen.",
    content: "",
    seoTitle: "Website laten maken in Limburg",
    seoDescription: "Complete gids voor KMO's die online willen groeien.",
    ogImage: HERO_2,
    heroImageAlt: "Website laten maken in Limburg",
  },
];

// The homepage "Uit de kennisbank" section: rich cards in a responsive grid
// (2-up here so the overlaid titles have room; the live section runs 3-up at
// full width).
export const KennisbankGrid = () => (
  <div
    style={{
      display: "grid",
      gap: 24,
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      padding: 24,
    }}
  >
    {POSTS.map((post, i) => (
      <BlogCard key={post.slug} post={post} index={i} />
    ))}
  </div>
);

// A single card in detail.
export const SingleCard = () => (
  <div style={{ maxWidth: 380, padding: 24 }}>
    <BlogCard post={POSTS[0]} index={0} />
  </div>
);
