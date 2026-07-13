// Curated selecties voor de realisatieshub (/realisaties/). Ids verwijzen
// naar ECHTE content: webdesign-project-ids en fotogalerij-ids uit Firestore
// (site_content), video-ids uit de videografie-bron. Onbekende ids worden
// stil geskipt, dus de pagina blijft werken als content wijzigt.

export type HubFeaturedRef = {
  source: "webdesign" | "fotografie" | "videografie";
  id: string;
};

/**
 * Uitgelichte realisaties (sectie "Uitgelichte realisaties"): de eerste is de
 * grote hoofdcase. Gekozen op multi-discipline karakter en beeldkwaliteit.
 */
export const featuredHubRefs: HubFeaturedRef[] = [
  // Gordijnen Myriam: huisstijl + webdesign + eigen fotografie + SEO/GEO,
  // en er bestaat ook een live bedrijfsfotografie-galerij van dezelfde klant.
  { source: "webdesign", id: "gordijnenmyriam" },
  // Realisatiefotografie vastgoed Medapro (live galerij).
  { source: "fotografie", id: "g-218fcbe1" },
  // Bedrijfsvideo "Bouw Realisaties".
  { source: "videografie", id: "8zGBwfcbX9A" },
];

/**
 * Complete-traject sectie: een echt project waar meerdere disciplines
 * samenkwamen. Gordijnen Myriam = website (screenshots in meerdere formaten)
 * + eigen bedrijfsfotografie (galerij-id hieronder).
 */
export const trajectProjectId = "gordijnenmyriam";
export const trajectGalleryId = "g-554fd891";
