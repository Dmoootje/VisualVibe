import type { SupportedLocale } from "./locales";

export type Localized<T> = Partial<Record<SupportedLocale, T>>;

export function getLocalizedRequired<T>(
  value: Localized<T>,
  locale: SupportedLocale,
  label: string,
): T {
  const localizedValue = value[locale];

  if (localizedValue === undefined) {
    throw new Error(`Missing ${locale} translation for ${label}`);
  }

  return localizedValue;
}
