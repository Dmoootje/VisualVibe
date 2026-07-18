import type { CaseItem } from "@/types";
import type { SupportedLocale } from "@/i18n/locales";
import { englishCaseEditorial } from "./locales/en/cases";

// Populated in Fase 4 (realisaties). Kept typed + empty so hub components
// can render a graceful "binnenkort" state rather than assuming data exists.
export const cases: CaseItem[] = [];

export function getCaseBySlug(slug: string): CaseItem | undefined {
  return cases.find((item) => item.slug === slug);
}

export type LocalizedCaseRecord = CaseItem & { id: string };

export function getLocalizedCaseById(
  id: string,
  locale: SupportedLocale,
): LocalizedCaseRecord {
  const source = getCaseBySlug(id);
  if (!source) throw new Error(`Unknown case ID: ${id}`);
  if (locale === "nl") return { ...source, id };
  if (locale !== "en") throw new Error(`Missing ${locale} translation for case.${id}`);
  const translated = englishCaseEditorial[id];
  if (!translated) throw new Error(`Missing en translation for case.${id}`);
  return { ...translated, id, slug: translated.displaySlug };
}

export function getCaseByLocalizedSlug(
  slug: string,
  locale: SupportedLocale,
): LocalizedCaseRecord {
  if (locale === "nl") return getLocalizedCaseById(slug, locale);
  if (locale !== "en") throw new Error(`Unknown ${locale} case slug: ${slug}`);
  const entry = Object.entries(englishCaseEditorial).find(
    ([, value]) => value.displaySlug === slug,
  );
  if (!entry) throw new Error(`Unknown ${locale} case slug: ${slug}`);
  return getLocalizedCaseById(entry[0], locale);
}
