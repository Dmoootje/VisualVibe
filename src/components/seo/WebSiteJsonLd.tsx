import { businessConfig } from "@/config/business.config";
import { JsonLd } from "./JsonLd";

/**
 * Site-wide WebSite entity (rendered once in the locale layout, naast
 * Organization/LocalBusiness). Het stabiele @id ({url}/#website) laat
 * pagina-schema's zoals CollectionPage er via isPartOf naar verwijzen
 * zonder de entiteit te dupliceren.
 */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${businessConfig.url}/#website`,
        url: `${businessConfig.url}/`,
        name: businessConfig.displayName,
        inLanguage: "nl-BE",
        publisher: { "@id": `${businessConfig.url}/#organization` },
      }}
    />
  );
}
