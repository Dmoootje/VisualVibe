import { businessConfig } from "@/config/business.config";
import { JsonLd } from "./JsonLd";

export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: businessConfig.displayName,
        legalName: businessConfig.legalName,
        description: businessConfig.description,
        url: businessConfig.url,
        telephone: businessConfig.telephone,
        email: businessConfig.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: businessConfig.address.streetAddress,
          postalCode: businessConfig.address.postalCode,
          addressLocality: businessConfig.address.addressLocality,
          addressRegion: businessConfig.address.addressRegion,
          addressCountry: businessConfig.address.addressCountry,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: businessConfig.geo.latitude,
          longitude: businessConfig.geo.longitude,
        },
        openingHoursSpecification: businessConfig.openingHours.map((hours) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: hours.dayOfWeek,
          opens: hours.opens,
          closes: hours.closes,
        })),
        areaServed: businessConfig.serviceArea,
        sameAs: businessConfig.sameAs,
      }}
    />
  );
}
