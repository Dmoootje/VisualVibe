import { getSiteSettings } from "@/lib/firestore/siteSettings";
import { LocalBusinessSettingsJsonLd } from "./LocalBusinessSettingsJsonLd";
import type { SupportedLocale } from "@/i18n/locales";

/**
 * Site-wide LocalBusiness (ProfessionalService) schema, built from the live
 * site_settings (managed in /admin/settings/contact). getSiteSettings is
 * resilient, so this safely falls back to defaults if Firestore is unavailable.
 */
export async function LocalBusinessJsonLd({ locale = "nl" }: { locale?: SupportedLocale }) {
  const settings = await getSiteSettings(locale);
  return <LocalBusinessSettingsJsonLd settings={settings} locale={locale} />;
}
