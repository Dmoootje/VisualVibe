// Single source of truth for NAP (Name/Address/Phone) and business facts.
// LocalBusinessJsonLd, the contact page, and the footer all read from here
// so the same details can never drift out of sync across the site.
// TODO: replace every placeholder value below with the agency's real details
// (street address in particular — Hasselt is a placeholder for "somewhere in Limburg").
export const businessConfig = {
  legalName: "VisualVibe BV",
  displayName: "VisualVibe",
  description:
    "Creatief mediabureau in Limburg voor webdesign, SEO, fotografie, videografie, drone, 3D/VR/AR en podcasting.",
  url: "https://visualvibe.be",
  telephone: "+32-11-000-00-00",
  email: "hello@visualvibe.be",
  address: {
    streetAddress: "Straatnaam 1",
    postalCode: "3500",
    addressLocality: "Hasselt",
    addressRegion: "Limburg",
    addressCountry: "BE",
  },
  geo: {
    latitude: 50.9307,
    longitude: 5.3325,
  },
  openingHours: [
    { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:30" },
  ],
  serviceArea: ["Limburg", "Vlaanderen", "Antwerpen", "Nederlands-Limburg"],
  sameAs: [
    // Social/profile URLs (LinkedIn, Instagram, Google Business Profile, ...)
  ],
} as const;

export type BusinessConfig = typeof businessConfig;
