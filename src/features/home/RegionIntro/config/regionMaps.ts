// Stylised (not geographically exact) mini-map geometry for the homepage
// region cards. All paths share the viewBox below. Each region highlights a
// sub-area of its country silhouette in orange, with a marker at its centre.
//
// Coordinates are hand-tuned to *read* as "a country with one region lit up",
// per the blueprint's "abstracte maar duidelijke regiocards" fallback - accuracy
// is deliberately traded for a clean, premium look at card size.

export const MAP_VIEWBOX = "0 0 120 100";

export type MapCountry = "BE" | "NL";

/** Simplified country silhouettes, keyed by country code. */
export const countryOutlines: Record<MapCountry, string> = {
  BE: "M16,40 L26,30 L40,25 L54,22 L66,24 L78,27 L90,33 L96,42 L92,52 L86,60 L78,70 L68,74 L58,71 L48,73 L38,69 L28,60 L20,52 L15,46 Z",
  NL: "M34,30 L42,18 L54,13 L66,16 L74,24 L74,34 L68,40 L64,45 L63,56 L60,68 L56,80 L52,68 L54,55 L54,46 L46,44 L38,42 L32,36 Z",
};

export interface RegionMapGeometry {
  country: MapCountry;
  /** Orange-highlighted active region path (same viewBox as the outline). */
  highlight: string;
  /** Marker position within the viewBox. */
  marker: { x: number; y: number };
}

export const regionMaps: Record<string, RegionMapGeometry> = {
  limburg: {
    country: "BE",
    highlight: "M76,27 L90,33 L96,42 L92,52 L84,54 L78,46 L74,36 Z",
    marker: { x: 85, y: 42 },
  },
  vlaanderen: {
    country: "BE",
    highlight:
      "M16,40 L26,30 L40,25 L54,22 L66,24 L78,27 L90,33 L94,41 L80,44 L66,42 L52,44 L38,43 L24,45 L15,46 Z",
    marker: { x: 52, y: 35 },
  },
  antwerpen: {
    country: "BE",
    highlight: "M52,24 L66,24 L78,27 L84,33 L80,43 L66,42 L54,40 L50,32 Z",
    marker: { x: 67, y: 34 },
  },
  "nederlands-limburg": {
    country: "NL",
    highlight: "M54,45 L63,45 L63,56 L60,68 L56,80 L52,68 L54,55 Z",
    marker: { x: 58, y: 60 },
  },
};
