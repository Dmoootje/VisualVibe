import { businessConfig } from "@/config/business.config";
import { JsonLd } from "./JsonLd";

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: businessConfig.displayName,
        legalName: businessConfig.legalName,
        url: businessConfig.url,
        logo: `${businessConfig.url}/logo.png`,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: businessConfig.telephone,
          email: businessConfig.email,
          contactType: "customer service",
          areaServed: businessConfig.serviceArea,
          availableLanguage: ["nl", "fr", "en"],
        },
        sameAs: businessConfig.sameAs,
      }}
    />
  );
}
