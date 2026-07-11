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

// Icon choices offered in the admin select (FiIcon ids + a readable label).
export const FOTO_GALLERY_ICONS: { id: string; label: string }[] = [
  { id: "foto", label: "Algemeen" },
  { id: "user", label: "Portret" },
  { id: "box", label: "Product" },
  { id: "cal", label: "Event" },
  { id: "home", label: "Vastgoed" },
  { id: "layers", label: "Realisatie" },
  { id: "spark", label: "Branding" },
  { id: "heart", label: "Huwelijk" },
  { id: "aperture", label: "Overig" },
];

// Empty by default: the admin fills the galleries. The public page shows the
// "binnenkort" state until at least one gallery exists.
export const DEFAULT_FOTO_GALLERIES: FotoGallery[] = [];
