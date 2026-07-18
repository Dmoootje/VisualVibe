import { businessConfig } from "@/config/business.config";
import type { SupportedLocale } from "@/i18n/locales";

export function localizedApplicationWebsiteUrl(
  websiteUrl: string,
  locale: SupportedLocale,
): string {
  const normalizedUrl = websiteUrl.replace(/\/+$/, "");
  if (locale === "en" && normalizedUrl === `${businessConfig.url}/be`) {
    return `${businessConfig.url}/en/`;
  }
  return websiteUrl;
}
