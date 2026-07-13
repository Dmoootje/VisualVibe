import {
  weddingVibeConfig,
  type WvImage,
  type WvGalleryItem,
  type WvFeaturedWedding,
} from "./weddingvibe.config";

// Benoemde beeld-slots van de WeddingVibe one-pager. De admin beheert per slot
// een URL-override in Firestore (site_content/weddingvibe); een lege override
// valt terug op het standaardbeeld uit weddingvibe.config.ts. Pure data +
// helpers, veilig voor client (admin-manager) en server (page-resolver).

export type WeddingVibeImageSlotDef = {
  slot: string;
  label: string;
  /** CSS aspect-ratio zoals het beeld op de pagina staat (preview-hint). */
  ratio: string;
};

const cfg = weddingVibeConfig;

export const WEDDINGVIBE_IMAGE_SLOTS: WeddingVibeImageSlotDef[] = [
  { slot: "hero", label: "Hero-achtergrond (achter de video)", ratio: "16/9" },
  { slot: "intro-groot", label: "Hoofdfoto intro", ratio: "3/4" },
  { slot: "intro-detail", label: "Detailfoto intro (klein kader)", ratio: "4/5" },
  ...cfg.portfolio.gallery.map((item, i) => ({
    slot: `galerij-${i + 1}`,
    label: `Galerij: ${item.label}`,
    ratio: item.ratio,
  })),
  ...cfg.portfolio.featured.map((wedding, i) => ({
    slot: `koppel-${i + 1}`,
    label: `Koppel: ${wedding.nameA} & ${wedding.nameB}`,
    ratio: "4/5",
  })),
  { slot: "video-poster", label: "Poster huwelijksfilm", ratio: "21/10" },
  ...cfg.services.map((service, i) => ({
    slot: `dienst-${i + 1}`,
    label: `Dienst: ${service.category}`,
    ratio: "4/3",
  })),
  { slot: "waarom", label: "Waarom-sectie (donker blok)", ratio: "3/4" },
  { slot: "jens", label: "Over Jens", ratio: "3/4" },
  { slot: "album-1", label: "Videoboek (productfoto)", ratio: "4/3" },
  { slot: "album-2", label: "Fotoalbum (productfoto)", ratio: "3/4" },
  { slot: "contact", label: "Contact-achtergrond", ratio: "16/9" },
];

/** Standaardbeeld (uit de config) per slot; "" = nog geen beeld -> placeholder. */
export const DEFAULT_WEDDINGVIBE_IMAGES: Record<string, string> = {
  hero: cfg.hero.fallbackImage.src,
  "intro-groot": cfg.intro.imageLarge.src,
  "intro-detail": cfg.intro.imageDetail.src,
  ...Object.fromEntries(cfg.portfolio.gallery.map((item, i) => [`galerij-${i + 1}`, item.src])),
  ...Object.fromEntries(cfg.portfolio.featured.map((wedding, i) => [`koppel-${i + 1}`, wedding.image.src])),
  "video-poster": cfg.video.poster.src,
  ...Object.fromEntries(cfg.services.map((service, i) => [`dienst-${i + 1}`, service.image.src])),
  waarom: cfg.why.image.src,
  jens: cfg.jens.image.src,
  "album-1": cfg.album.image1.src,
  "album-2": cfg.album.image2.src,
  contact: cfg.contact.background.src,
};

export type WeddingVibePricing = { fotografie: string; film: string; combo: string };

export const DEFAULT_WEDDINGVIBE_PRICING: WeddingVibePricing = {
  fotografie: cfg.investering.cards[0].price,
  film: cfg.investering.cards[1].price,
  combo: cfg.investering.cards[2].price,
};

/** Volledig opgeloste beelden voor de pagina: override > config-default. */
export type WeddingVibeImages = {
  hero: WvImage;
  introLarge: WvImage;
  introDetail: WvImage;
  gallery: WvGalleryItem[];
  featured: WvFeaturedWedding[];
  videoPoster: WvImage;
  /** Index-gelijk aan weddingVibeConfig.services. */
  services: WvImage[];
  why: WvImage;
  jens: WvImage;
  album1: WvImage;
  album2: WvImage;
  contact: WvImage;
};

export function resolveWeddingVibeImages(overrides: Record<string, string>): WeddingVibeImages {
  const src = (slot: string) => overrides[slot]?.trim() || DEFAULT_WEDDINGVIBE_IMAGES[slot] || "";
  const img = (slot: string, alt: string): WvImage => ({ src: src(slot), alt });

  return {
    hero: img("hero", cfg.hero.fallbackImage.alt),
    introLarge: img("intro-groot", cfg.intro.imageLarge.alt),
    introDetail: img("intro-detail", cfg.intro.imageDetail.alt),
    gallery: cfg.portfolio.gallery.map((item, i) => ({
      ...item,
      src: src(`galerij-${i + 1}`),
    })),
    featured: cfg.portfolio.featured.map((wedding, i) => ({
      ...wedding,
      image: img(`koppel-${i + 1}`, wedding.image.alt),
    })),
    videoPoster: img("video-poster", cfg.video.poster.alt),
    services: cfg.services.map((service, i) => img(`dienst-${i + 1}`, service.image.alt)),
    why: img("waarom", cfg.why.image.alt),
    jens: img("jens", cfg.jens.image.alt),
    album1: img("album-1", cfg.album.image1.alt),
    album2: img("album-2", cfg.album.image2.alt),
    contact: img("contact", cfg.contact.background.alt),
  };
}
