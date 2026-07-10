import { services } from "@/data/services";
import { getSubservicesByParent } from "@/data/subservices";
import { regions } from "@/data/regions";
import { sectors } from "@/data/sectors";

export type NavLink = { name: string; href: string };
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
      href: `/diensten/${sub.slug}`,
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

// Sectoren dropdown (hub + all 10 sectors).
export const sectorItems: NavLink[] = [
  { name: "Alle sectoren", href: "/sectoren" },
  ...sectors.map((sector) => ({ name: sector.title, href: `/sectoren/${sector.slug}` })),
];
