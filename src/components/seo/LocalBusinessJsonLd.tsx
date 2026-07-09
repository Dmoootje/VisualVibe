import { getSiteSettings } from "@/lib/firestore/siteSettings";
import { LocalBusinessSettingsJsonLd } from "./LocalBusinessSettingsJsonLd";

/**
 * Site-wide LocalBusiness (ProfessionalService) schema, built from the live
 * site_settings (managed in /admin/settings/contact). getSiteSettings is
 * resilient, so this safely falls back to defaults if Firestore is unavailable.
 */
export async function LocalBusinessJsonLd() {
  const settings = await getSiteSettings();
  return <LocalBusinessSettingsJsonLd settings={settings} />;
}
