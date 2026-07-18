import {
  getLocalizedServiceById,
  serviceHref,
  services,
} from "@/data/services";
import { getSubservicesByParent } from "@/data/subservices";
import {
  getSoftwareServices,
  softwareServiceHref,
  softwareServiceHubHref,
} from "@/data/softwareServices";
import { getLocalizedRegionById, regions } from "@/data/regions";
import { getLocalizedSectorById, sectors } from "@/data/sectors";
import {
  getLocalizedKennisbankCategoryById,
  kennisbankCategories,
} from "@/data/kennisbankCategories";
import {
  getLocalizedRealisatieCategoryById,
  realisatieCategories,
} from "@/data/realisatieCategories";
import { toolCards } from "@/data/tools";
import { englishToolCards } from "@/data/toolsEnglish";
import type { PublicChromeLocale } from "./chromeRoutes";

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
export type NavRegion = {
  /** Stable registry ID used by the province map artwork. */
  id: string;
  /** Locale-specific public route slug. */
  slug: string;
  title: string;
  type: string;
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

// Apps & software staat bewust direct na Webdesign. Dezelfde bron voedt het
// desktop-megamenu en de mobiele pushnavigatie, zodat beide altijd gelijk lopen.
export function getNavPillars(locale: PublicChromeLocale): NavPillar[] {
  const servicePillars = services.map((sourceService) => {
    const localizedService = getLocalizedServiceById(sourceService.slug, locale).service;
    const pillarIcon = PILLAR_ICON[sourceService.slug] ?? "website";
    const catalogSubs = getSubservicesByParent(sourceService.slug).map((sourceSub) => {
      const localizedSub = getLocalizedServiceById(sourceSub.slug, locale).service;
      return {
        name: localizedSub.title,
        href: serviceHref(localizedSub),
        icon:
          sourceService.slug === "webdesign"
            ? WEBDESIGN_SUB_ICON[sourceSub.slug] ?? "website"
            : pillarIcon,
      };
    });

    return {
      id: sourceService.slug,
      name: localizedService.title,
      tag:
        locale === "en"
          ? localizedService.excerpt
          : PILLAR_TAG[sourceService.slug] ?? "",
      icon: pillarIcon,
      href: serviceHref(localizedService),
      subs:
        sourceService.slug === "webdesign" && locale === "nl"
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
    name: locale === "en" ? "Custom software" : "Apps & software",
    tag:
      locale === "en"
        ? "Web applications, AI and automation"
        : "Webapps, AI & automatisering",
    icon: "software",
    href: softwareServiceHubHref(locale),
    subs: getSoftwareServices(locale).map((service) => ({
      name: service.title,
      href: softwareServiceHref(service, locale),
      icon: SOFTWARE_SUB_ICON[service.id] ?? "software",
    })),
  };

  return servicePillars.flatMap((pillar) =>
    pillar.id === "webdesign" ? [pillar, softwarePillar] : [pillar],
  );
}

export const pillars: NavPillar[] = getNavPillars("nl");

export function getNavRegions(locale: PublicChromeLocale): NavRegion[] {
  return regions.map((sourceRegion) => {
    const localizedRegion = getLocalizedRegionById(sourceRegion.slug, locale);
    return {
      id: sourceRegion.slug,
      slug: localizedRegion.slug,
      title: localizedRegion.title,
      type: localizedRegion.type,
    };
  });
}

// Regio dropdown (hub + the 4 regiohubs).
export const regioItems: NavLink[] = [
  { name: "Alle regio's", href: "/regio" },
  ...getNavRegions("nl").map((region) => ({
    name: region.title,
    href: `/regio/${region.slug}`,
  })),
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
export function getSectorCards(locale: PublicChromeLocale): NavCard[] {
  return sectors.map((sourceSector) => {
    const sector = getLocalizedSectorById(sourceSector.slug, locale);
    return {
      name: sector.title,
      href: `/sectoren/${sector.slug}`,
      icon: sector.icon ?? "kmo",
      iconKind: "sector",
      desc: sector.tag ?? sector.cardDescription ?? "",
    };
  });
}

export const sectorCards: NavCard[] = getSectorCards("nl");

// De categorievolgorde komt uit realisatieCategories. Applicaties staat daar
// direct na Webdesign, en verschijnt dus op exact die plek in desktop én mobiel.
export function getRealisatieCards(locale: PublicChromeLocale): NavCard[] {
  return realisatieCategories.map((sourceCategory) => {
    const category = getLocalizedRealisatieCategoryById(sourceCategory.slug, locale);
    const menuCopy = locale === "nl" ? REALISATIE_MENU_COPY[sourceCategory.slug] : undefined;
    return {
      name: menuCopy?.name ?? category.name,
      href: `/realisaties/${category.slug}`,
      icon: REALISATIE_ICON[sourceCategory.slug] ?? "layers",
      desc: menuCopy?.desc ?? category.description,
    };
  });
}

export const realisatieCards: NavCard[] = getRealisatieCards("nl");

export function getToolsCards(locale: PublicChromeLocale): NavCard[] {
  const tools = locale === "en" ? englishToolCards : toolCards;
  return tools.map((tool) => ({
    name: tool.name,
    href: tool.href.replace(/^\/en(?=\/)/, ""),
    icon: tool.icon,
    desc: tool.desc,
  }));
}

export const toolsCards: NavCard[] = getToolsCards("nl");

/** Build a kennisbank card for a category (the Header filters to non-empty ones). */
export function kennisbankCard(
  category: { slug: string; name: string; description: string },
  locale: PublicChromeLocale = "nl",
): NavCard {
  const localized = getLocalizedKennisbankCategoryById(category.slug, locale);
  return {
    name: localized.name,
    href: `/kennisbank/${localized.slug}`,
    icon: KENNISBANK_ICON[localized.slug] ?? "book",
    desc: localized.description,
  };
}

export function getKennisbankCards(locale: PublicChromeLocale): NavCard[] {
  return kennisbankCategories.map((category) => kennisbankCard(category, locale));
}

// Default kennisbank cards (all registered categories); the Header narrows this
// to only categories that actually have posts.
export const kennisbankCards: NavCard[] = getKennisbankCards("nl");
