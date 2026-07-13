// GEGENEREERD door scripts/upload-kennisbank-images.mjs - niet met de hand
// bewerken. Draai dat script (met Firebase-credentials) om de afbeeldingen naar
// de bucket te uploaden en dit bestand met de echte download-URL's te vullen.
//
// Twee soorten beelden per kennisbankartikel/-categorie:
//  - OG: vierkante deelafbeelding met tekst erop -> alleen social (og:image).
//  - Featured: uitgelichte afbeelding zonder tekst -> hero + alle cards.

import type { OgImage } from "./ogImages";

/** Canonieke path (met leidende + sluitende slash) -> OG-deelafbeelding. */
export const KENNISBANK_OG: Record<string, OgImage> = {};

/** "categorySlug/slug" -> uitgelichte afbeelding (zonder tekst). */
export const KENNISBANK_FEATURED: Record<string, string> = {};

/** Uitgelichte afbeelding voor een artikel, op categorySlug + slug. */
export function kennisbankFeatured(categorySlug: string, slug: string): string | undefined {
  return KENNISBANK_FEATURED[`${categorySlug}/${slug}`];
}
