// Single source of truth for NAP (Name/Address/Phone) and business facts.
// LocalBusinessJsonLd, the contact page, and the footer all read from here
// so the same details can never drift out of sync across the site.
// TODO: replace every placeholder value below with the agency's real details.
export const businessConfig = {
  legalName: "VisualVibe BV",
  displayName: "VisualVibe",
  description:
    "Webdesignbureau in Antwerpen, gespecialiseerd in snelle, vindbare websites voor lokale en Belgische bedrijven.",
  url: "https://visualvibe.be",
  telephone: "+32-3-000-00-00",
  email: "hello@visualvibe.be",
  address: {
    streetAddress: "Straatnaam 1",
    postalCode: "2000",
    addressLocality: "Antwerpen",
    addressRegion: "Antwerpen",
    addressCountry: "BE",
  },
  geo: {
    latitude: 51.2194,
    longitude: 4.4025,
  },
  openingHours: [
    { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:30" },
  ],
  serviceArea: ["Antwerpen", "Vlaanderen", "Brussel", "België"],
  sameAs: [
    // Social/profile URLs (LinkedIn, Instagram, Google Business Profile, ...)
  ],
} as const;

export type BusinessConfig = typeof businessConfig;
