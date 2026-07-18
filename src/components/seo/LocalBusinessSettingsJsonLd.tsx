import { businessConfig } from "@/config/business.config";
import type { SiteSettings } from "@/types";
import { JsonLd } from "./JsonLd";
import type { SupportedLocale } from "@/i18n/locales";

const DAY_SCHEMA: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const SERVICE_CATALOG = [
  "Webdesign",
  "SEO en GEO",
  "Fotografie",
  "Videografie",
  "Drone en FPV",
  "3D, VR en AR",
  "Podcastproductie",
  "Applicaties en software op maat",
];

const ENGLISH_SERVICE_CATALOG = [
  "Web design",
  "SEO and GEO",
  "Photography",
  "Video production",
  "Drone and FPV",
  "3D, VR and AR",
  "Podcast production",
  "Custom applications and software",
];

function normalizeAddressCountry(value?: string): string {
  const country = value?.trim();

  return country && /^[a-z]{2}$/i.test(country)
    ? country.toUpperCase()
    : businessConfig.address.addressCountry;
}

/**
 * LocalBusiness schema built from the live site_settings.
 * Every critical NAP field falls back to business.config, so a temporarily empty
 * Firestore setting can never publish incomplete or contradictory local schema.
 */
export function LocalBusinessSettingsJsonLd({ settings, locale = "nl" }: { settings: SiteSettings; locale?: SupportedLocale }) {
  const en = locale === "en";
  const liveOpeningHours = (settings.openingHours ?? [])
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

  const fallbackOpeningHours = businessConfig.openingHours.flatMap((opening) =>
    opening.dayOfWeek.map((dayOfWeek) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek,
      opens: opening.opens,
      closes: opening.closes,
    })),
  );

  const liveSameAs = [
    settings.facebookUrl,
    settings.instagramUrl,
    settings.linkedinUrl,
    settings.youtubeUrl,
    settings.tiktokUrl,
  ].filter((url): url is string => Boolean(url));

  const streetAddress =
    [settings.street, settings.houseNumber].filter(Boolean).join(" ") ||
    settings.fullAddress ||
    businessConfig.address.streetAddress;

  const address = {
    "@type": "PostalAddress",
    streetAddress,
    postalCode: settings.postalCode || businessConfig.address.postalCode,
    addressLocality: settings.city || businessConfig.address.addressLocality,
    addressRegion: settings.province || businessConfig.address.addressRegion,
    addressCountry: normalizeAddressCountry(settings.country),
  };

  const geo =
    settings.latitude != null && settings.longitude != null
      ? {
          "@type": "GeoCoordinates",
          latitude: settings.latitude,
          longitude: settings.longitude,
        }
      : undefined;

  const serviceAreas = en ? ["Limburg", "Flanders", "Antwerp Province", "Dutch Limburg"] : businessConfig.serviceArea;
  const areaServed = serviceAreas.map((name) => ({
    "@type": "AdministrativeArea",
    name,
  }));

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${businessConfig.url}/#localbusiness`,
        name: settings.companyName || businessConfig.displayName,
        legalName: businessConfig.legalName,
        description: en ? "Creative media agency in Limburg, Belgium, for web design, SEO, visual content and custom digital applications." : businessConfig.description,
        url: en ? `${businessConfig.url}/en/` : businessConfig.url,
        image: `${businessConfig.url}/api/og`,
        logo: {
          "@type": "ImageObject",
          url: businessConfig.logo,
        },
        telephone: settings.phone || businessConfig.telephone,
        email: settings.mainEmail || businessConfig.email,
        vatID: settings.vatNumber || businessConfig.vatID,
        priceRange: businessConfig.priceRange,
        address,
        geo,
        openingHoursSpecification:
          liveOpeningHours.length > 0 ? liveOpeningHours : fallbackOpeningHours,
        areaServed,
        parentOrganization: { "@id": `${businessConfig.url}/#organization` },
        founder: { "@id": `${businessConfig.url}/#founder` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: en ? "Creative and digital services" : "Creatieve en digitale diensten",
          itemListElement: (en ? ENGLISH_SERVICE_CATALOG : SERVICE_CATALOG).map((name) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name,
              provider: { "@id": `${businessConfig.url}/#localbusiness` },
            },
          })),
        },
        sameAs: liveSameAs.length > 0 ? liveSameAs : businessConfig.sameAs,
      }}
    />
  );
}
