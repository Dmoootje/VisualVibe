import { businessConfig } from "@/config/business.config";
import { JsonLd } from "./JsonLd";
import type { SupportedLocale } from "@/i18n/locales";

export type ServiceJsonLdData = {
  name: string;
  description: string;
  url: string;
  areaServed?: string[];
};

export function ServiceJsonLd({ service, locale = "nl" }: { service: ServiceJsonLdData; locale?: SupportedLocale }) {
  const defaultArea = locale === "en" ? ["Limburg", "Flanders", "Antwerp Province", "Dutch Limburg"] : businessConfig.serviceArea;
  const areaServed = (service.areaServed ?? defaultArea).map((name) => ({
    "@type": "AdministrativeArea",
    name,
  }));

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${service.url}#service`,
        name: service.name,
        serviceType: service.name,
        description: service.description,
        url: service.url,
        areaServed,
        audience: {
          "@type": "BusinessAudience",
          audienceType: locale === "en" ? "Businesses, SMEs and independent professionals" : "Bedrijven, kmo's en zelfstandigen",
        },
        provider: { "@id": `${businessConfig.url}/#localbusiness` },
      }}
    />
  );
}
