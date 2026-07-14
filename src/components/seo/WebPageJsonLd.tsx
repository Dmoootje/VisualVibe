import { businessConfig } from "@/config/business.config";
import { JsonLd } from "./JsonLd";

export type WebPageJsonLdProps = {
  url: string;
  name: string;
  description: string;
  inLanguage?: string;
  primaryImage?: string;
  aboutId?: string;
};

/**
 * Reusable WebPage entity that connects a page to the global WebSite,
 * Organization and (where relevant) LocalBusiness entities.
 */
export function WebPageJsonLd({
  url,
  name,
  description,
  inLanguage = "nl-BE",
  primaryImage = `${businessConfig.url}/opengraph-image`,
  aboutId = `${businessConfig.url}/#localbusiness`,
}: WebPageJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage,
        isPartOf: { "@id": `${businessConfig.url}/#website` },
        about: { "@id": aboutId },
        publisher: { "@id": `${businessConfig.url}/#organization` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: primaryImage,
        },
      }}
    />
  );
}
