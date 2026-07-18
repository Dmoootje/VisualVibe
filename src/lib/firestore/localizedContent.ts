import { getLocalizedRequired, type Localized } from "@/i18n/content";
import type { SupportedLocale } from "@/i18n/locales";

export type FirestoreLocalized<T> = T | Localized<T>;

function isLocalizedMap<T>(value: FirestoreLocalized<T>): value is Localized<T> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  return ["nl", "en", "fr", "de"].some((locale) => locale in value);
}

export function readLocalizedRequired<T>(
  value: FirestoreLocalized<T>,
  locale: SupportedLocale,
  label: string,
): T {
  if (isLocalizedMap(value)) {
    const result = getLocalizedRequired(value, locale, label);
    if (result === null) throw new Error(`Missing ${locale} translation for ${label}`);
    return result;
  }
  if (locale === "nl") return value;
  throw new Error(`Missing ${locale} translation for ${label}`);
}

export function readLocalizedOptional<T>(
  value: FirestoreLocalized<T> | null | undefined,
  locale: SupportedLocale,
  label: string,
): T | undefined {
  if (value === undefined || value === null) return undefined;
  if (isLocalizedMap(value) && value[locale] === null) return undefined;
  return readLocalizedRequired(value, locale, label);
}

export function mergeDutchVisitorFields<T extends Record<string, unknown>>(
  stored: T | undefined,
  dutch: T,
  visitorFields: readonly (keyof T)[],
): T {
  const merged = { ...stored, ...dutch } as T;
  for (const field of visitorFields) {
    const nextValue = dutch[field];
    const current = stored?.[field];
    if (
      typeof current === "object" &&
      current !== null &&
      !Array.isArray(current) &&
      ["nl", "en", "fr", "de"].some((locale) => locale in current)
    ) {
      merged[field] = { ...(current as object), nl: nextValue ?? null } as T[keyof T];
    }
  }
  return merged;
}

export function mergeDutchRecords<T extends Record<string, unknown>>(
  stored: T[] | undefined,
  dutch: T[],
  visitorFields: readonly (keyof T)[],
  identity: keyof T = "id",
): T[] {
  return dutch.map((record) => {
    const previous = stored?.find((item) => item[identity] === record[identity]);
    return mergeDutchVisitorFields(previous, record, visitorFields);
  });
}
