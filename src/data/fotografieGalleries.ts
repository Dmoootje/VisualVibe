// Admin-managed photo galleries for the Realisaties > Fotografie page. Each
// gallery owns its own uploaded (WebP) images. Stored in Firestore
// (site_content/fotografie_galleries); these are the seeded defaults.

export type FotoGalleryImage = {
  /** Firebase Storage WebP URL. */
  src: string;
  /** Optional per-photo caption; falls back to "<gallery title> - <n>". */
  caption?: string;
};

export type FotoGallery = {
  /** Stable slug-ish id, used for image keys + the storage path. */
  id: string;
  title: string;
  description: string;
  /** FiIcon id for the badge (see FOTO_GALLERY_ICONS). */
  icon: string;
  /** Short tag chips shown on the featured (uitgelichte) gallery. */
  tags?: string[];
  /** images[0] is the cover. */
  images: FotoGalleryImage[];
};

// Gallery categories offered in the admin. The picker doubles as both the
// category and its badge icon: `label` is the category shown on the public page
// (via the badge), `id` is the FiIcon glyph. Add a category here to expose it.
export const FOTO_GALLERY_ICONS: { id: string; label: string }[] = [
  { id: "biz", label: "Bedrijfsfotografie" },
  { id: "user", label: "Zakelijke portretten" },
  { id: "box", label: "Productfotografie" },
  { id: "party", label: "Eventfotografie" },
  { id: "home", label: "Vastgoedfotografie" },
  { id: "layers", label: "Realisatiefotografie" },
  { id: "spark", label: "Brandingfotografie" },
  { id: "sport", label: "Sportfotografie" },
  { id: "heart", label: "Huwelijksfotografie" },
  { id: "foto", label: "Algemeen" },
  { id: "aperture", label: "Overig" },
];

// Demo galleries (design_handoff_realisaties_drone_fotografie), so the public
// page ships populated. These are real VisualVibe portfolio assets referenced by
// URL; replace/extend them in the admin (a saved list overrides these defaults).
const PORTFOLIO: Record<string, string> = {
  night: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FDrone%20Nacht%20fotografie.webp?alt=media&token=a607907f-b11e-42d8-b576-d64cbde39c8f",
  alpen: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FAlpen-drone-fotos-scaled.webp?alt=media&token=fe09068a-ff73-4ec8-8a70-382681272bd5",
  bedrijf1: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FBedrijfssfotos-drone.webp?alt=media&token=105ae204-ca42-48e3-9d5f-ec9ed86c8c43",
  bedrijf2: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FBedrijfssfotos-met-drone.webp?alt=media&token=c0d95d8b-b352-41b3-8f9d-330a77549cb1",
  woon: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FDrone%20woonplaats%20luchtfoto.webp?alt=media&token=6c6e1b31-b0a0-48e2-bac0-42bfaab5c35b",
  zon: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FDrone-zonnepanelen.webp?alt=media&token=419485d3-1c72-49b0-8ef0-020b58afce51",
  portrait: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FFotografie%20-%20Jens%20Hardy%20fotograaf%20Limburg.webp?alt=media&token=1ecd395c-f1aa-4458-a4db-bb3ad7e62fa3",
};
const SLIDE: Record<string, string> = {
  bedrijf: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F01-bedrijfsfotografie.webp?alt=media&token=464345b0-7db4-4e24-bac9-c96fce9a263d",
  portret: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F02-zakelijke-portretten.webp?alt=media&token=d2dcf975-9655-4481-a54d-34d8c7fd1dd1",
  product: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F03-productfotografie.webp?alt=media&token=8cf89e53-5318-47ef-8502-afd01941fa0a",
  event: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F04-eventfotografie.webp?alt=media&token=4083399d-781e-43bf-bd0e-acf5a85a6816",
  vastgoed: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F05-vastgoedfotografie.webp?alt=media&token=15bb4033-07c4-48c0-88a4-fe965768242e",
  realisatie: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F06-realisatiefotografie.webp?alt=media&token=5dfed050-7cc3-40c3-a75d-f90852b120b1",
  branding: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F07-brandingfotografie.webp?alt=media&token=fa6ac811-bc45-41df-809e-07fd41017c58",
  huwelijk: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F08-huwelijksfotografie.webp?alt=media&token=b2319bd5-a1b5-4653-9176-83f2936f3a37",
};
const srcOf = (key: string): string => PORTFOLIO[key] ?? SLIDE[key] ?? "";
const imgs = (keys: string[]): FotoGalleryImage[] => keys.map((k) => ({ src: srcOf(k) }));

export const DEFAULT_FOTO_GALLERIES: FotoGallery[] = [
  { id: "bedrijf", icon: "biz", title: "Bedrijfsfotografie", description: "Professionele beelden van je bedrijf, team en werkplek.", tags: ["Bedrijf", "Team", "Werkplek"], images: imgs(["bedrijf", "bedrijf1", "bedrijf2", "woon", "zon"]) },
  { id: "portret", icon: "user", title: "Zakelijke portretten", description: "Professionele portretfoto's voor je website, LinkedIn en visitekaartje.", tags: ["LinkedIn", "Team", "Studio"], images: imgs(["portret", "portrait", "bedrijf1", "bedrijf2"]) },
  { id: "product", icon: "box", title: "Productfotografie", description: "Scherpe productfoto's die je webshop of catalogus versterken.", tags: ["Webshop", "Catalogus", "Studio"], images: imgs(["product", "zon", "bedrijf2"]) },
  { id: "event", icon: "party", title: "Eventfotografie", description: "Beeldverslag van je bedrijfsevent, opening of netwerkmoment.", tags: ["Event", "Opening", "Netwerk"], images: imgs(["event", "night", "alpen", "woon"]) },
  { id: "vastgoed", icon: "home", title: "Vastgoedfotografie", description: "Panden die er op foto net zo aantrekkelijk uitzien als in het echt.", tags: ["Interieur", "Exterieur", "Drone"], images: imgs(["vastgoed", "woon", "alpen", "night", "bedrijf1"]) },
  { id: "realisatie", icon: "layers", title: "Realisatiefotografie", description: "Afgewerkte projecten in beeld, van bouw tot interieur.", tags: ["Bouw", "Interieur", "Project"], images: imgs(["realisatie", "zon", "bedrijf1", "bedrijf2", "woon"]) },
  { id: "branding", icon: "spark", title: "Brandingfotografie", description: "Een consistente beeldtaal die je merk herkenbaar maakt.", tags: ["Merk", "Sfeer", "Content"], images: imgs(["branding", "portrait", "night", "alpen"]) },
  { id: "huwelijk", icon: "heart", title: "Huwelijksfotografie", description: "Jullie mooiste dag, tijdloos vastgelegd - samen met WeddingVibe.", tags: ["Bruiloft", "Reportage", "WeddingVibe"], images: imgs(["huwelijk", "portrait", "alpen"]) },
];
