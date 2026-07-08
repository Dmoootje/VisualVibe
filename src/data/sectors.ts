import type { Sector } from "@/types";

// Sector list per docs/content-blueprint.md. Full painPoints/recommendedServices
// content is filled in during Fase 3 when the sector detail pages are built.
export const sectors: Sector[] = [
  { title: "KMO", slug: "kmo" },
  { title: "Bouw & Renovatie", slug: "bouw-renovatie" },
  { title: "Horeca", slug: "horeca" },
  { title: "Vastgoed & Immo", slug: "vastgoed-immo" },
  { title: "Retail & Webshops", slug: "retail-webshops" },
  { title: "Events", slug: "events" },
  { title: "Sportclubs", slug: "sportclubs" },
  { title: "Opleidingen & Masterclasses", slug: "opleidingen-masterclasses" },
  { title: "Wellness & Beauty", slug: "wellness-beauty" },
  { title: "Industrie", slug: "industrie" },
].map((sector) => ({
  ...sector,
  intro: `Webdesign, fotografie, video en SEO voor de sector ${sector.title.toLowerCase()}.`,
  painPoints: [],
  recommendedServices: [],
  relatedCases: [],
  relatedPosts: [],
  seo: {
    title: `${sector.title} | VisualVibe`,
    description: `VisualVibe helpt bedrijven in de sector ${sector.title.toLowerCase()} met webdesign, fotografie, video en SEO.`,
    keywords: [sector.title.toLowerCase()],
  },
})) satisfies Sector[];

export function getSectorBySlug(slug: string): Sector | undefined {
  return sectors.find((sector) => sector.slug === slug);
}
