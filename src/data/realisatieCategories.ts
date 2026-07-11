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
    seoDescription: "Webdesign-realisaties van VisualVibe: websites en webshops voor KMO's in Limburg en Vlaanderen.",
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
    seoDescription: "Fotografie-realisaties van VisualVibe: bedrijfsreportages, producten, events en vastgoed in Limburg.",
  },
  {
    slug: "videografie",
    name: "Videografie",
    description: "Bedrijfsvideo's, promo's, aftermovies en social video's die we maakten.",
    seoTitle: "Videografie realisaties | VisualVibe",
    seoDescription: "Videografie-realisaties van VisualVibe: bedrijfsvideo's, promo's en aftermovies voor bedrijven in Limburg.",
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
    seoDescription: "Drone- en FPV-realisaties van VisualVibe: luchtbeelden voor vastgoed, bouwprojecten en events in Limburg.",
  },
  {
    slug: "3d-vr",
    name: "3D & VR",
    description: "3D-tours en virtuele rondleidingen voor showrooms, vastgoed en horeca.",
    seoTitle: "3D & VR realisaties | VisualVibe",
    seoDescription: "3D- en VR-realisaties van VisualVibe: virtuele tours voor showrooms, vastgoed en horeca in Limburg.",
  },
  {
    slug: "podcasting",
    name: "Podcasting",
    description: "Bedrijfspodcasts en videopodcasts die we opnamen en produceerden.",
    seoTitle: "Podcasting realisaties | VisualVibe",
    seoDescription: "Podcast-realisaties van VisualVibe: bedrijfspodcasts en videopodcasts voor experts en bedrijven in Limburg.",
  },
  {
    slug: "bedrijven",
    name: "Bedrijven",
    description: "Volledige trajecten voor bedrijven: van website tot beeld en video.",
    seoTitle: "Realisaties voor bedrijven | VisualVibe",
    seoDescription: "Realisaties voor bedrijven: gecombineerde webdesign-, foto- en videoprojecten voor KMO's in Limburg.",
  },
  {
    slug: "projecten",
    name: "Projecten",
    description: "Bouw-, renovatie- en interieurprojecten in beeld gebracht.",
    seoTitle: "Project-realisaties | VisualVibe",
    seoDescription: "Project-realisaties van VisualVibe: bouw, renovatie en interieur in beeld voor aannemers in Limburg.",
  },
  {
    slug: "events",
    name: "Events",
    description: "Beeldverslagen en aftermovies van bedrijfsevents en openingen.",
    seoTitle: "Event-realisaties | VisualVibe",
    seoDescription: "Event-realisaties van VisualVibe: fotografie en aftermovies van bedrijfsevents en openingen in Limburg.",
  },
  {
    slug: "sport",
    name: "Sport",
    description: "Realisaties voor sportclubs en sportevenementen.",
    seoTitle: "Sport-realisaties | VisualVibe",
    seoDescription: "Sport-realisaties van VisualVibe: webdesign, fotografie en video voor sportclubs en sportevents in Limburg.",
  },
  {
    slug: "buitenland",
    name: "Buitenland",
    description: "Projecten die we buiten de landsgrenzen realiseerden.",
    seoTitle: "Realisaties in het buitenland | VisualVibe",
    seoDescription: "Buitenlandse realisaties van VisualVibe: webdesign, fotografie en video voor projecten over de grens.",
  },
];

export function getRealisatieCategoryBySlug(slug: string): RealisatieCategory | undefined {
  return realisatieCategories.find((category) => category.slug === slug);
}
