import { services } from "@/data/services";
import { getSubservicesByParent } from "@/data/subservices";
import { regions } from "@/data/regions";
import { sectors } from "@/data/sectors";
import { kennisbankCategories } from "@/data/kennisbankCategories";
import { realisatieCategories } from "@/data/realisatieCategories";

export type NavLink = { name: string; href: string };
/** A richer nav row: icon + name + a one-line subtitle (used in the dropdowns/submenus). */
export type NavCard = {
  name: string;
  href: string;
  /** Glyph id: a nav-icon id, or a sector sprite id when iconKind is "sector". */
  icon: string;
  desc: string;
  iconKind?: "nav" | "sector";
};
export type NavSub = { name: string; href: string; icon: string };
export type NavPillar = {
  id: string;
  name: string;
  tag: string;
  icon: string;
  href: string;
  subs: NavSub[];
};

// Pillar icon (nav-icons id) + short tagline per hoofddienst (tags from handoff).
const PILLAR_ICON: Record<string, string> = {
  webdesign: "website",
  seo: "seo",
  fotografie: "camera",
  videografie: "film",
  "drone-fpv": "drone",
  "3d-vr-ar": "cube",
  podcasting: "mic",
  masterclasses: "cap",
};

const PILLAR_TAG: Record<string, string> = {
  webdesign: "Websites & webshops",
  seo: "Vindbaar in Google & AI",
  fotografie: "Beeld dat verkoopt",
  videografie: "Bewegend beeld",
  "drone-fpv": "Vanuit de lucht",
  "3d-vr-ar": "Immersieve ervaringen",
  podcasting: "Jouw stem, overal",
  masterclasses: "Kennis die groeit",
};

// Webdesign sub-services carry their own bespoke glyph; other pillars' subs
// reuse the pillar icon.
const WEBDESIGN_SUB_ICON: Record<string, string> = {
  "website-laten-maken": "website",
  "webshop-laten-maken": "webshop",
  "onepager-laten-maken": "onepager",
  "website-vernieuwen": "vernieuwen",
  "website-onderhoud": "onderhoud",
  "wordpress-website-laten-maken": "wordpress",
  "seo-website-laten-maken": "seo",
};

export const pillars: NavPillar[] = services.map((service) => {
  const pillarIcon = PILLAR_ICON[service.slug] ?? "website";
  return {
    id: service.slug,
    name: service.title,
    tag: PILLAR_TAG[service.slug] ?? "",
    icon: pillarIcon,
    href: `/diensten/${service.slug}`,
    subs: getSubservicesByParent(service.slug).map((sub) => ({
      name: sub.title,
      href: `/diensten/${service.slug}/${sub.slug}`,
      icon:
        service.slug === "webdesign"
          ? WEBDESIGN_SUB_ICON[sub.slug] ?? "website"
          : pillarIcon,
    })),
  };
});

// Regio dropdown (hub + the 4 regiohubs).
export const regioItems: NavLink[] = [
  { name: "Alle regio's", href: "/regio" },
  ...regions.map((region) => ({ name: region.title, href: `/regio/${region.slug}` })),
];

// Realisatie-categorie glyph per slug (reuse service glyphs; extra ones for the
// cross-service categories bedrijven/projecten/events/sport/buitenland).
const REALISATIE_ICON: Record<string, string> = {
  webdesign: "website",
  fotografie: "camera",
  videografie: "film",
  drone: "drone",
  "3d-vr": "cube",
  podcasting: "mic",
  bedrijven: "building",
  projecten: "hardhat",
  events: "calendar",
  sport: "trophy",
  buitenland: "globe",
};

// Kennisbank-categorie glyph per slug (maps onto the matching service glyph).
export const KENNISBANK_ICON: Record<string, string> = {
  "seo-geo": "seo",
  webdesign: "website",
  fotografie: "camera",
  videografie: "film",
  drone: "drone",
  "3d-vr": "cube",
  podcasting: "mic",
  masterclasses: "cap",
};

// Sectoren cards (all 10 sectors, sector-sprite icons + their eyebrow tag).
export const sectorCards: NavCard[] = sectors.map((sector) => ({
  name: sector.title,
  href: `/sectoren/${sector.slug}`,
  icon: sector.icon ?? "kmo",
  iconKind: "sector",
  desc: sector.tag ?? sector.cardDescription ?? "",
}));

// Realisaties cards (all realisatie categories, iconed + short description).
export const realisatieCards: NavCard[] = realisatieCategories.map((category) => ({
  name: category.name,
  href: `/realisaties/${category.slug}`,
  icon: REALISATIE_ICON[category.slug] ?? "layers",
  desc: category.description,
}));

/** Build a kennisbank card for a category (the Header filters to non-empty ones). */
export function kennisbankCard(category: { slug: string; name: string; description: string }): NavCard {
  return {
    name: category.name,
    href: `/kennisbank/${category.slug}`,
    icon: KENNISBANK_ICON[category.slug] ?? "book",
    desc: category.description,
  };
}

// Default kennisbank cards (all registered categories); the Header narrows this
// to only categories that actually have posts.
export const kennisbankCards: NavCard[] = kennisbankCategories.map(kennisbankCard);
