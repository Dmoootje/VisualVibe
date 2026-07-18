import type { Sector } from "@/types";
import type { SupportedLocale } from "@/i18n/locales";
import { englishSectorEditorial } from "../locales/en/sectors";
import { kmo } from "./kmo";
import { bouwRenovatie } from "./bouw-renovatie";
import { horeca } from "./horeca";
import { vastgoedImmo } from "./vastgoed-immo";
import { retailWebshops } from "./retail-webshops";
import { events } from "./events";
import { sportclubs } from "./sportclubs";
import { opleidingenMasterclasses } from "./opleidingen-masterclasses";
import { wellnessBeauty } from "./wellness-beauty";
import { industrie } from "./industrie";

// One file per sector; array order is meaningful (hub grid + marquee order).
export const sectors: Sector[] = [
  kmo,
  bouwRenovatie,
  horeca,
  vastgoedImmo,
  retailWebshops,
  events,
  sportclubs,
  opleidingenMasterclasses,
  wellnessBeauty,
  industrie,
];

export function getSectorBySlug(slug: string): Sector | undefined {
  return sectors.find((sector) => sector.slug === slug);
}

export type LocalizedSectorRecord = Sector & { id: string };

export function getLocalizedSectorById(
  id: string,
  locale: SupportedLocale,
): LocalizedSectorRecord {
  const source = getSectorBySlug(id);
  if (!source) throw new Error(`Unknown sector ID: ${id}`);
  if (locale === "nl") return { ...source, id };
  if (locale !== "en") throw new Error(`Missing ${locale} translation for sector.${id}`);
  const translated = englishSectorEditorial[id];
  if (!translated) throw new Error(`Missing en translation for sector.${id}`);
  return { ...translated, id, slug: translated.displaySlug };
}

export function getSectorByLocalizedSlug(
  slug: string,
  locale: SupportedLocale,
): LocalizedSectorRecord {
  if (locale === "nl") return getLocalizedSectorById(slug, locale);
  const entry = Object.entries(englishSectorEditorial).find(([, value]) => value.displaySlug === slug);
  if (!entry) throw new Error(`Unknown ${locale} sector slug: ${slug}`);
  return getLocalizedSectorById(entry[0], locale);
}
