// Matterport virtual tours behind the 3D/VR/AR dienst- en realisatiepagina's.
// Shared source of truth: the diensten page embeds the LAST TWO live in-page,
// the realisaties page shows all of them in a grid + lightbox.
//
// The Matterport IDs are final. Titles and locations are placeholders from the
// design handoff (design_handoff_3d_vr_ar) - replace with the real project
// names/locations as tours are delivered.
export type MatterportTour = {
  /** Matterport model id (the `m=` query param). Final. */
  id: string;
  title: string;
  /** "Stad · Regio" style location line. */
  location: string;
};

export const matterportTours: MatterportTour[] = [
  { id: "1QM1FPCWyXz", title: "Woningtour - interieur", location: "Hasselt · Limburg" },
  { id: "s8BLfFaL56w", title: "Kantoorruimte 3D-tour", location: "Genk · Limburg" },
  { id: "Xpj4W69LRoj", title: "Handelspand virtual tour", location: "Sint-Truiden · Limburg" },
  { id: "V9Y5e8g3oAW", title: "Vastgoed showcase", location: "Tongeren · Limburg" },
  { id: "mN2REF7dqjv", title: "Bedrijfspand rondleiding", location: "Bilzen · Limburg" },
];

const englishMatterportTitles: Record<string, string> = {
  "1QM1FPCWyXz": "Residential interior tour",
  s8BLfFaL56w: "3D office tour",
  Xpj4W69LRoj: "Commercial property virtual tour",
  V9Y5e8g3oAW: "Real-estate showcase",
  mN2REF7dqjv: "Business premises tour",
};

export function getLocalizedMatterportTours(locale: SupportedLocale): MatterportTour[] {
  if (locale === "nl") return matterportTours;
  if (locale !== "en") throw new Error(`Missing ${locale} Matterport translations`);
  return matterportTours.map((tour) => ({ ...tour, title: englishMatterportTitles[tour.id] }));
}

/** Live-embed URL for a Matterport model (autoplay, no branding). */
export function matterportEmbedSrc(id: string): string {
  return `https://my.matterport.com/show/?m=${id}&play=1&brand=0&qs=1`;
}

/** iframe allow-list required for Matterport's XR/gyro navigation. */
export const MATTERPORT_IFRAME_ALLOW =
  "xr-spatial-tracking; gyroscope; accelerometer; fullscreen; autoplay";
import type { SupportedLocale } from "@/i18n/locales";
