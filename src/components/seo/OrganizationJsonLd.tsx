import { businessConfig } from "@/config/business.config";
import { JsonLd } from "./JsonLd";

const KNOWS_ABOUT = [
  "Webdesign",
  "Zoekmachineoptimalisatie (SEO)",
  "Generative Engine Optimization (GEO)",
  "Bedrijfsfotografie",
  "Videografie",
  "Drone- en FPV-opnames",
  "3D-, VR- en AR-belevingen",
  "Podcastproductie",
  "Webapplicaties op maat",
];

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${businessConfig.url}/#organization`,
        name: businessConfig.displayName,
        legalName: businessConfig.legalName,
        url: businessConfig.url,
        logo: {
          "@type": "ImageObject",
          url: businessConfig.logo,
        },
        image: `${businessConfig.url}/api/og`,
        description: businessConfig.description,
        telephone: businessConfig.telephone,
        email: businessConfig.email,
        vatID: businessConfig.vatID,
        address: {
          "@type": "PostalAddress",
          ...businessConfig.address,
        },
        location: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            ...businessConfig.address,
          },
        },
        founder: {
          "@type": "Person",
          "@id": `${businessConfig.url}/#founder`,
          name: businessConfig.founder,
          jobTitle: "Zaakvoerder",
          worksFor: { "@id": `${businessConfig.url}/#organization` },
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: businessConfig.telephone,
          email: businessConfig.email,
          contactType: "customer service",
          areaServed: businessConfig.serviceArea,
          availableLanguage: ["Dutch"],
        },
        department: { "@id": `${businessConfig.url}/#localbusiness` },
        knowsAbout: KNOWS_ABOUT,
        sameAs: businessConfig.sameAs.length > 0 ? businessConfig.sameAs : undefined,
      }}
    />
  );
}
