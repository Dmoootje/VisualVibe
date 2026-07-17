import { services } from "@/data/services";
import { getSubservicesByParent } from "@/data/subservices";
import { softwareServices } from "@/data/softwareServices";
import { regions } from "@/data/regions";
import { sectors } from "@/data/sectors";
import { kennisbankCategories } from "@/data/kennisbankCategories";
import { realisatieCategories } from "@/data/realisatieCategories";
import { toolCards } from "@/data/tools";

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

const SOFTWARE_SUB_ICON: Record<string, string> = {
  "app-laten-maken": "app",
  "webapplicatie-laten-maken": "webapp",
  "ai-applicatie-laten-maken": "ai",
  "api-koppelingen-en-automatisering": "workflow",
  "app-design-ux-ui": "ux",
};

const servicePillars: NavPillar[] = services.map((service) => {
  const pillarIcon = PILLAR_ICON[service.slug] ?? "website";
  const catalogSubs = getSubservicesByParent(service.slug).map((sub) => ({
    name: sub.title,
    href: `/diensten/${service.slug}/${sub.slug}`,
    icon:
      service.slug === "webdesign"
        ? WEBDESIGN_SUB_ICON[sub.slug] ?? "website"
        : pillarIcon,
  }));

  return {
    id: service.slug,
    name: service.title,
    tag: PILLAR_TAG[service.slug] ?? "",
    icon: pillarIcon,
    href: `/diensten/${service.slug}`,
    subs:
      service.slug === "webdesign"
        ? [
            ...catalogSubs,
            {
              name: "Website met AI-functionaliteiten",
              href: "/diensten/webdesign/website-met-ai-functionaliteiten",
              icon: "ai-website",
            },
          ]
        : catalogSubs,
  };
});

const softwarePillar: NavPillar = {
  id: "software-op-maat",
  name: "Apps & software",
  tag: "Webapps, AI & automatisering",
  icon: "software",
  href: "/diensten/software-op-maat",
  subs: softwareServices.map((service) => ({
    name: service.title,
    href: `/diensten/software-op-maat/${service.slug}`,
    icon: SOFTWARE_SUB_ICON[service.slug] ?? "software",
  })),
};

// Apps & software staat bewust direct na Webdesign. Dezelfde bron voedt het
// desktop-megamenu en de mobiele pushnavigatie, zodat beide altijd gelijk lopen.
export const pillars: NavPillar[] = servicePillars.flatMap((pillar) =>
  pillar.id === "webdesign" ? [pillar, softwarePillar] : [pillar]
);

// Regio dropdown (hub + the 4 regiohubs).
export const regioItems: NavLink[] = [
  { name: "Alle regio's", href: "/regio" },
  ...regions.map((region) => ({ name: region.title, href: `/regio/${region.slug}` })),
];

// Realisatie-categorie glyph per slug (reuse service glyphs; extra ones for the
// cross-service categories bedrijven/projecten/events/sport/buitenland).
const REALISATIE_ICON: Record<string, string> = {
  webdesign: "website",
  applicaties: "software",
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

// Menu-copy mag iets directer zijn dan de paginatitel. De categoriepagina blijft
// "Applicaties" heten, maar in desktop en mobiel staat ze herkenbaar als softwaretak.
const REALISATIE_MENU_COPY: Record<string, { name: string; desc: string }> = {
  applicaties: {
    name: "Applicaties & software",
    desc: "SaaS-platformen, webapps, krachtige backends en automatisering. Bekijk onze technische cases.",
  },
};

// Kennisbank-categorie glyph per slug (maps onto the matching service glyph).
export const KENNISBANK_ICON: Record<string, string> = {
  "seo-geo": "seo",
  webdesign: "website",
  "software-op-maat": "software",
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

// De categorievolgorde komt uit realisatieCategories. Applicaties staat daar
// direct na Webdesign, en verschijnt dus op exact die plek in desktop én mobiel.
export const realisatieCards: NavCard[] = realisatieCategories.map((category) => ({
  name: REALISATIE_MENU_COPY[category.slug]?.name ?? category.name,
  href: `/realisaties/${category.slug}`,
  icon: REALISATIE_ICON[category.slug] ?? "layers",
  desc: REALISATIE_MENU_COPY[category.slug]?.desc ?? category.description,
}));

export const toolsCards: NavCard[] = toolCards.map((tool) => ({
  name: tool.name,
  href: tool.href,
  icon: tool.icon,
  desc: tool.desc,
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
