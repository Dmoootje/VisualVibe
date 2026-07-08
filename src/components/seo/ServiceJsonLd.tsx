import { businessConfig } from "@/config/business.config";
import { JsonLd } from "./JsonLd";

export type ServiceJsonLdData = {
  name: string;
  description: string;
  url: string;
  areaServed?: string[];
};

export function ServiceJsonLd({ service }: { service: ServiceJsonLdData }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.name,
        description: service.description,
        url: service.url,
        areaServed: service.areaServed ?? businessConfig.serviceArea,
        provider: {
          "@type": "Organization",
          name: businessConfig.displayName,
          url: businessConfig.url,
        },
      }}
    />
  );
}
