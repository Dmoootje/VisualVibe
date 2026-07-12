// Realisatie (case) categories - the taxonomy behind /realisaties/[category]/.
// `slug` is the URL segment; `name` is the display name. Pages exist per
// category and render a "binnenkort" state until cases are added (Fase 4).
export type RealisatieStat = {
  /** Big number/label, e.g. "40+" or "98". */
  value: string;
  /** Two-line supporting copy (use \n or a lone \n via the array). */
  label: string;
  /** Render the value in accent orange instead of white. */
  accent?: boolean;
};

export type RealisatieCategory = {
  slug: string;
  name: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  /** Optional stat rail in the realisatie-header (design_handoff_realisaties). */
  stats?: RealisatieStat[];
};

export const realisatieCategories: RealisatieCategory[] = [
  {
    slug: "webdesign",
    name: "Webdesign",
    description:
      "Websites en webshops die we voor KMO's in Limburg bouwden, van huisstijl tot vindbaarheid in Google en AI.",
    seoTitle: "Webdesign realisaties | VisualVibe",
    seoDescription:
      "Webdesign-realisaties van VisualVibe: snelle websites en webshops voor KMO's in Limburg en Vlaanderen, gebouwd voor vindbaarheid in Google en AI-zoekmachines.",
    stats: [
      { value: "40+", label: "websites & webshops\nlive gezet" },
      { value: "98", label: "gem. PageSpeed\nop mobiel", accent: true },
    ],
  },
  {
    slug: "fotografie",
    name: "Fotografie",
    description: "Bedrijfs-, product-, event- en vastgoedfotografie uit onze praktijk.",
    seoTitle: "Fotografie realisaties | VisualVibe",
    seoDescription:
      "Fotografie-realisaties van VisualVibe: bedrijfsreportages, productfoto's, events en vastgoed in Limburg. Bekijk hoe we merken professioneel in beeld brengen.",
  },
  {
    slug: "videografie",
    name: "Videografie",
    description: "Bedrijfsvideo's, promo's, aftermovies en social video's die we maakten.",
    seoTitle: "Videografie realisaties | VisualVibe",
    seoDescription:
      "Videografie-realisaties van VisualVibe: bedrijfsvideo's, promovideo's en aftermovies voor bedrijven in Limburg, opgenomen en gemonteerd in 4K-kwaliteit.",
    stats: [
      { value: "50+", label: "producties\ngemaakt" },
      { value: "4K", label: "opname &\nmontage", accent: true },
    ],
  },
  {
    slug: "drone",
    name: "Drone & FPV",
    description: "Luchtbeelden en FPV-video voor bedrijven, vastgoed, bouw en events.",
    seoTitle: "Drone & FPV realisaties | VisualVibe",
    seoDescription:
      "Drone- en FPV-realisaties van VisualVibe: luchtbeelden en dynamische FPV-video voor vastgoed, bouwprojecten en events in Limburg en de rest van Vlaanderen.",
  },
  {
    slug: "3d-vr",
    name: "3D, VR & AR",
    description:
      "Wandel zelf door onze projecten. Elke tour is een live, navigeerbare 3D-scan, klik en verken de ruimte in 360°.",
    seoTitle: "3D, VR & AR realisaties | VisualVibe",
    seoDescription:
      "3D-, VR- en AR-realisaties van VisualVibe: navigeerbare Matterport-tours voor vastgoed, showrooms en horeca in Limburg. Wandel zelf door elke ruimte in 360°.",
  },
  {
    slug: "podcasting",
    name: "Podcasting",
    description: "Bedrijfspodcasts en videopodcasts die we opnamen en produceerden.",
    seoTitle: "Podcasting realisaties | VisualVibe",
    seoDescription:
      "Podcast-realisaties van VisualVibe: bedrijfspodcasts en videopodcasts voor experts en bedrijven in Limburg, van opname en montage tot afgewerkte publicatie.",
  },
  {
    slug: "bedrijven",
    name: "Bedrijven",
    description: "Volledige trajecten voor bedrijven: van website tot beeld en video.",
    seoTitle: "Realisaties voor bedrijven | VisualVibe",
    seoDescription:
      "Realisaties voor bedrijven: volledige trajecten waarin webdesign, fotografie en video samenkomen. Bekijk wat VisualVibe voor KMO's in Limburg realiseerde.",
  },
  {
    slug: "projecten",
    name: "Projecten",
    description: "Bouw-, renovatie- en interieurprojecten in beeld gebracht.",
    seoTitle: "Project-realisaties | VisualVibe",
    seoDescription:
      "Project-realisaties van VisualVibe: bouw-, renovatie- en interieurprojecten in beeld gebracht met fotografie en dronebeelden voor aannemers in Limburg.",
  },
  {
    slug: "events",
    name: "Events",
    description: "Beeldverslagen en aftermovies van bedrijfsevents en openingen.",
    seoTitle: "Event-realisaties | VisualVibe",
    seoDescription:
      "Event-realisaties van VisualVibe: eventfotografie en aftermovies van bedrijfsevents en openingen in Limburg. Sfeerbeelden die je volgende editie promoten.",
  },
  {
    slug: "sport",
    name: "Sport",
    description: "Realisaties voor sportclubs en sportevenementen.",
    seoTitle: "Sport-realisaties | VisualVibe",
    seoDescription:
      "Sport-realisaties van VisualVibe: webdesign, fotografie en video voor sportclubs en sportevenementen in Limburg. Beeld dat leden, supporters en sponsors raakt.",
  },
  {
    slug: "buitenland",
    name: "Buitenland",
    description: "Projecten die we buiten de landsgrenzen realiseerden.",
    seoTitle: "Realisaties in het buitenland | VisualVibe",
    seoDescription:
      "Buitenlandse realisaties van VisualVibe: webdesign-, foto- en videoprojecten buiten de landsgrenzen, van drone-opnames in de Alpen tot werk in Nederland.",
  },
];

export function getRealisatieCategoryBySlug(slug: string): RealisatieCategory | undefined {
  return realisatieCategories.find((category) => category.slug === slug);
}

/**
 * Interne-link-brug tussen realisatie-categorieën en diensten. Categorieën
 * zonder eigen dienst (bedrijven, projecten, events, sport, buitenland) staan
 * er bewust niet in; die pagina's slaan de dienst-cross-links gewoon over.
 */
export const categoryToServiceSlug: Record<string, string> = {
  webdesign: "webdesign",
  fotografie: "fotografie",
  videografie: "videografie",
  drone: "drone-fpv",
  "3d-vr": "3d-vr-ar",
  podcasting: "podcasting",
};

/** Omgekeerde map: dienst-slug naar realisatie-categorie-slug. */
export const serviceToCategorySlug: Record<string, string> = Object.fromEntries(
  Object.entries(categoryToServiceSlug).map(([category, service]) => [service, category]),
);
