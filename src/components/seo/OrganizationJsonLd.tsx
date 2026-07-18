import { businessConfig } from "@/config/business.config";
import { JsonLd } from "./JsonLd";
import type { SupportedLocale } from "@/i18n/locales";

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

const ENGLISH_KNOWS_ABOUT = [
  "Web design",
  "Search engine optimisation (SEO)",
  "Generative Engine Optimisation (GEO)",
  "Corporate photography",
  "Video production",
  "Drone and FPV filming",
  "3D, VR and AR experiences",
  "Podcast production",
  "Custom web applications",
];

export function OrganizationJsonLd({ locale = "nl" }: { locale?: SupportedLocale }) {
  const en = locale === "en";
  const homeUrl = en ? `${businessConfig.url}/en/` : businessConfig.url;
  const areaServed = en ? ["Limburg", "Flanders", "Antwerp Province", "Dutch Limburg"] : businessConfig.serviceArea;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${businessConfig.url}/#organization`,
        name: businessConfig.displayName,
        legalName: businessConfig.legalName,
        url: homeUrl,
        logo: {
          "@type": "ImageObject",
          url: businessConfig.logo,
        },
        image: `${businessConfig.url}/api/og`,
        description: en ? "Creative media agency in Limburg, Belgium, for web design, SEO, photography, video, drone, immersive media, podcasts and custom software." : businessConfig.description,
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
          jobTitle: en ? "Managing director" : "Zaakvoerder",
          worksFor: { "@id": `${businessConfig.url}/#organization` },
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: businessConfig.telephone,
          email: businessConfig.email,
          contactType: "customer service",
          areaServed,
          availableLanguage: [en ? "English" : "Dutch"],
        },
        department: { "@id": `${businessConfig.url}/#localbusiness` },
        knowsAbout: en ? ENGLISH_KNOWS_ABOUT : KNOWS_ABOUT,
        sameAs: businessConfig.sameAs.length > 0 ? businessConfig.sameAs : undefined,
      }}
    />
  );
}
