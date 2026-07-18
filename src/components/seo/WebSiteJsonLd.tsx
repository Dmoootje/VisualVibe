import { businessConfig } from "@/config/business.config";
import { JsonLd } from "./JsonLd";
import type { SupportedLocale } from "@/i18n/locales";

/**
 * Site-wide WebSite entity (rendered once in the locale layout, naast
 * Organization/LocalBusiness). Het stabiele @id ({url}/#website) laat
 * pagina-schema's zoals CollectionPage er via isPartOf naar verwijzen
 * zonder de entiteit te dupliceren.
 */
export function WebSiteJsonLd({ locale = "nl" }: { locale?: SupportedLocale }) {
  const en = locale === "en";
  const homeUrl = en ? `${businessConfig.url}/en/` : `${businessConfig.url}/`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        url: homeUrl,
        name: businessConfig.displayName,
        inLanguage: en ? "en-BE" : "nl-BE",
        publisher: { "@id": `${businessConfig.url}/#organization` },
      }}
    />
  );
}
