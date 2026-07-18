export type SupportedLocale = "nl" | "en" | "fr" | "de";

export type LocaleStatus = "published" | "ready" | "disabled";

export type LocaleConfig = {
  status: LocaleStatus;
};

export const LOCALE_CONFIG: Record<SupportedLocale, LocaleConfig> = {
  nl: { status: "published" },
  en: { status: "disabled" },
  fr: { status: "disabled" },
  de: { status: "disabled" },
};

export function getPublishedLocales(): SupportedLocale[] {
  return (Object.keys(LOCALE_CONFIG) as SupportedLocale[]).filter(
    (locale) => LOCALE_CONFIG[locale].status === "published",
  );
}
