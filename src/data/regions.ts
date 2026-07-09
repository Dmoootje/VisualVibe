import type { Region } from "@/types";

// Hoofdregio's only for Fase 1. Stad-pagina's (Bilzen-Hoeselt, Tongeren-Borgloon,
// Hasselt, ...) are added in Fase 3 once each has genuinely unique content -
// see docs/content-blueprint.md's "Belangrijke SEO-waarschuwing".
export const regions: Region[] = [
  {
    title: "Limburg",
    slug: "limburg",
    type: "province",
    country: "BE",
    intro:
      "Limburg is de thuisregio van VisualVibe. Van Hasselt tot Genk, van Bilzen tot Sint-Truiden: we kennen de lokale markt en bouwen websites, beelden en video's die er echt toe doen voor Limburgse KMO's.",
    localServices: ["webdesign", "seo", "fotografie", "videografie", "drone-fpv", "3d-vr-ar"],
    relatedCases: [],
    relatedSectors: [],
    seo: {
      title: "Webdesign, Fotografie & Video in Limburg | VisualVibe",
      description:
        "VisualVibe is het creatief mediabureau voor Limburg: webdesign, SEO, fotografie, videografie, drone en 3D-tours voor lokale KMO's.",
      keywords: ["mediabureau Limburg", "webdesign Limburg", "fotograaf Limburg", "videograaf Limburg"],
    },
  },
  {
    title: "Vlaanderen",
    slug: "vlaanderen",
    type: "market",
    country: "BE",
    intro:
      "Vanuit Limburg werkt VisualVibe voor bedrijven in heel Vlaanderen - webdesign, fotografie, videografie en SEO op maat van je regio en sector.",
    localServices: ["webdesign", "seo", "fotografie", "videografie"],
    relatedCases: [],
    relatedSectors: [],
    seo: {
      title: "Creatief Mediabureau Vlaanderen | VisualVibe",
      description: "VisualVibe helpt bedrijven in heel Vlaanderen met webdesign, fotografie, videografie en SEO.",
      keywords: ["mediabureau Vlaanderen", "webdesign Vlaanderen"],
    },
  },
  {
    title: "Antwerpen",
    slug: "antwerpen",
    type: "market",
    country: "BE",
    intro:
      "VisualVibe ondersteunt ook bedrijven in de provincie Antwerpen met webdesign, fotografie, videografie en dronebeelden.",
    localServices: ["webdesign", "fotografie", "videografie", "drone-fpv"],
    relatedCases: [],
    relatedSectors: [],
    seo: {
      title: "Webdesign & Fotografie Antwerpen | VisualVibe",
      description: "VisualVibe biedt webdesign, fotografie, videografie en dronebeelden voor bedrijven in Antwerpen.",
      keywords: ["webdesign Antwerpen", "fotograaf Antwerpen", "videograaf Antwerpen"],
    },
  },
  {
    title: "Nederlands-Limburg",
    slug: "nederlands-limburg",
    type: "market",
    country: "NL",
    intro:
      "Ook net over de grens, in Nederlands-Limburg, helpt VisualVibe bedrijven aan sterke websites, beelden en video's.",
    localServices: ["webdesign", "fotografie", "videografie", "drone-fpv"],
    relatedCases: [],
    relatedSectors: [],
    seo: {
      title: "Webdesign & Fotografie Nederlands-Limburg | VisualVibe",
      description: "VisualVibe biedt webdesign, fotografie, videografie en dronebeelden voor bedrijven in Nederlands-Limburg.",
      keywords: ["webdesign Nederlands-Limburg", "fotograaf Nederlands-Limburg"],
    },
  },
];

export function getRegionBySlug(slug: string): Region | undefined {
  return regions.find((region) => region.slug === slug);
}
