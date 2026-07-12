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
        "VisualVibe is het creatief mediabureau voor Limburg: webdesign, SEO, fotografie, videografie, drone en 3D-tours voor KMO's van Hasselt tot Sint-Truiden.",
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
      description:
        "Vanuit Limburg werkt VisualVibe voor bedrijven in heel Vlaanderen: webdesign, SEO, fotografie en videografie, afgestemd op jouw regio, sector en doelgroep.",
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
      description:
        "VisualVibe ondersteunt bedrijven in de provincie Antwerpen met webdesign, fotografie, videografie en dronebeelden. Eén creatief team voor je online uitstraling.",
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
      description:
        "Ook over de grens in Nederlands-Limburg helpt VisualVibe bedrijven met webdesign, fotografie, videografie en dronebeelden, van Maastricht tot Venlo en Weert.",
      keywords: ["webdesign Nederlands-Limburg", "fotograaf Nederlands-Limburg"],
    },
  },
];

export function getRegionBySlug(slug: string): Region | undefined {
  return regions.find((region) => region.slug === slug);
}
