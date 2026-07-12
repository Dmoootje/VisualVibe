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

// Empty by default: the admin fills the galleries. The public page shows the
// "binnenkort" state until at least one gallery exists.
export const DEFAULT_FOTO_GALLERIES: FotoGallery[] = [];
