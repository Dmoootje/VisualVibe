import { businessConfig } from "@/config/business.config";
import { JsonLd } from "./JsonLd";

export type ServiceJsonLdData = {
  name: string;
  description: string;
  url: string;
  areaServed?: string[];
};

export function ServiceJsonLd({ service }: { service: ServiceJsonLdData }) {
  const areaServed = (service.areaServed ?? businessConfig.serviceArea).map((name) => ({
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
          audienceType: "Bedrijven, kmo's en zelfstandigen",
        },
        provider: { "@id": `${businessConfig.url}/#localbusiness` },
      }}
    />
  );
}
