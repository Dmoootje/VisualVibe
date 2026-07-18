import { getPublishedLocales } from "@/i18n/locales";

export type LocalePathPair = Readonly<Record<"nl" | "en", string>>;

function normalizedPublicPath(path: string): string {
  const suffix = path.split("/").filter(Boolean).join("/");
  return suffix ? `/${suffix}/` : "/";
}

export function localizedPublicUrl(
  baseUrl: string,
  locale: "nl" | "en",
  path: string,
): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const prefix = locale === "nl" ? "/be" : "/en";
  return `${normalizedBaseUrl}${prefix}${normalizedPublicPath(path)}`;
}

export function publishedLanguageAlternates(
  baseUrl: string,
  pair: LocalePathPair,
): Record<string, string> {
  const publishedLocales = new Set(getPublishedLocales());
  const languages: Record<string, string> = {};

  if (publishedLocales.has("nl")) {
    languages["nl-BE"] = localizedPublicUrl(baseUrl, "nl", pair.nl);
  }
  if (publishedLocales.has("en")) {
    languages["en-BE"] = localizedPublicUrl(baseUrl, "en", pair.en);
  }
  if (publishedLocales.has("nl")) {
    languages["x-default"] = localizedPublicUrl(baseUrl, "nl", pair.nl);
  }

  return languages;
}
