import { businessConfig } from "@/config/business.config";
import type { SiteSettings } from "@/types";
import { JsonLd } from "./JsonLd";

const DAY_SCHEMA: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/**
 * LocalBusiness (ProfessionalService) schema built from the live site_settings,
 * falling back to business.config for fields that aren't managed in the CRM
 * (description, legal name, service area).
 */
export function LocalBusinessSettingsJsonLd({ settings }: { settings: SiteSettings }) {
  const openingHoursSpecification = settings.openingHours
    .filter((day) => day.isOpen && day.openTime && day.closeTime && DAY_SCHEMA[day.day])
    .flatMap((day) => {
      const dayOfWeek = DAY_SCHEMA[day.day];
      if (day.pauseStart && day.pauseEnd) {
        return [
          { "@type": "OpeningHoursSpecification", dayOfWeek, opens: day.openTime, closes: day.pauseStart },
          { "@type": "OpeningHoursSpecification", dayOfWeek, opens: day.pauseEnd, closes: day.closeTime },
        ];
      }
      return [{ "@type": "OpeningHoursSpecification", dayOfWeek, opens: day.openTime, closes: day.closeTime }];
    });

  const sameAs = [
    settings.facebookUrl,
    settings.instagramUrl,
    settings.linkedinUrl,
    settings.youtubeUrl,
    settings.tiktokUrl,
  ].filter((url): url is string => Boolean(url));

  const streetAddress =
    [settings.street, settings.houseNumber].filter(Boolean).join(" ") || settings.fullAddress || "";

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${businessConfig.url}/#localbusiness`,
        name: settings.companyName,
        legalName: businessConfig.legalName,
        description: businessConfig.description,
        url: businessConfig.url,
        // Raster brand image for LocalBusiness rich results; the SVG logo rides
        // along via `logo` so both asset types are represented.
        image: `${businessConfig.url}/image.jpg`,
        logo: businessConfig.logo,
        telephone: settings.phone,
        email: settings.mainEmail,
        vatID: settings.vatNumber || undefined,
        address: {
          "@type": "PostalAddress",
          streetAddress,
          postalCode: settings.postalCode,
          addressLocality: settings.city,
          addressRegion: settings.province,
          addressCountry: settings.country,
        },
        geo:
          settings.latitude != null && settings.longitude != null
            ? { "@type": "GeoCoordinates", latitude: settings.latitude, longitude: settings.longitude }
            : undefined,
        openingHoursSpecification,
        areaServed: businessConfig.serviceArea,
        sameAs: sameAs.length > 0 ? sameAs : undefined,
      }}
    />
  );
}
