// Single source of truth for NAP (Name/Address/Phone) and business facts.
// LocalBusinessJsonLd, the contact page, and the footer all read from here
// so the same details can never drift out of sync across the site.
export const businessConfig = {
  legalName: "VisualVibe",
  displayName: "VisualVibe",
  description:
    "Creatief mediabureau in Limburg voor webdesign, SEO, fotografie, videografie, drone, 3D/VR/AR en podcasting.",
  url: "https://visualvibe.media",
  /** Brand logo (Firebase-hosted SVG), used in Organization/LocalBusiness schema. */
  logo: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Flogo-visualvibe.svg?alt=media&token=b5e6b375-443b-40dd-b720-89b3f78ab34d",
  telephone: "+32472964599",
  email: "info@visualvibe.media",
  /** Zaakvoerder / founder, used in Organization structured data. */
  founder: "Jens Hardy",
  /** Ondernemings-/btw-nummer (KBO). */
  vatID: "BE1014.755.897",
  /** Indicative price level for LocalBusiness structured data. */
  priceRange: "$$",
  address: {
    streetAddress: "Ziegelsmeer 14",
    postalCode: "3700",
    addressLocality: "Tongeren-Borgloon",
    addressRegion: "Limburg",
    addressCountry: "BE",
  },
  // Town-level coordinates for Tongeren; refine to the exact address if needed.
  geo: {
    latitude: 50.7803,
    longitude: 5.4637,
  },
  openingHours: [
    { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:30" },
  ],
  serviceArea: ["Limburg", "Vlaanderen", "Antwerpen", "Nederlands-Limburg"],
  sameAs: [
    "https://www.facebook.com/visualvibee",
    "https://www.instagram.com/visualvibe.be/",
    "https://www.youtube.com/@visualvibe.",
    "https://www.tiktok.com/@visualvibe_",
    // LinkedIn is intentionally omitted until that profile uses the current
    // visualvibe.media domain and Tongeren-Borgloon location. Publishing it as
    // sameAs while it still states the old data would create entity/NAP drift.
  ],
} as const;

export type BusinessConfig = typeof businessConfig;
