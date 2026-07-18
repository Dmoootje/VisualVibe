import type { MetadataRoute } from "next";
import { applicationCases, getLocalizedApplicationCaseById } from "@/data/applicationCases";
import { blogPosts } from "@/data/blog";
import {
  getLocalizedKennisbankCategoryById,
  kennisbankCategories,
} from "@/data/kennisbankCategories";
import {
  getLocalizedRealisatieCategoryById,
  realisatieCategories,
} from "@/data/realisatieCategories";
import { getLocalizedRegionById, regions } from "@/data/regions";
import { getLocalizedSectorById, sectors } from "@/data/sectors";
import { allServices, getLocalizedServiceById, serviceHref } from "@/data/services";
import {
  getSoftwareServices,
  softwareServiceHref,
  softwareServiceHubHref,
} from "@/data/softwareServices";
import { postHref } from "@/lib/kennisbank/posts";

export type VisibleSitemapNode = Readonly<{
  title: string;
  href: string;
}>;

export type EnglishVisibleSitemapSection = Readonly<{
  id: "general" | "services" | "regions" | "industries" | "realisations" | "knowledge" | "tools";
  title: string;
  href: string;
  intro: string;
  nodes: readonly VisibleSitemapNode[];
}>;

export type EnglishVisibleSitemap = Readonly<{
  homeHref: "/en/";
  sections: readonly EnglishVisibleSitemapSection[];
  paths: readonly string[];
  total: number;
}>;

type SectionDefinition = Omit<EnglishVisibleSitemapSection, "href" | "nodes"> & {
  hubHref: string;
};

const sectionDefinitions: readonly SectionDefinition[] = [
  { id: "general", title: "General pages", hubHref: "/en/about/", intro: "Company information and ways to get in touch." },
  { id: "services", title: "Services", hubHref: "/en/diensten/", intro: "Digital services, production and custom software." },
  { id: "regions", title: "Regions", hubHref: "/en/regio/", intro: "The regions where VisualVibe works." },
  { id: "industries", title: "Industries", hubHref: "/en/sectoren/", intro: "Industry-specific expertise and solutions." },
  { id: "realisations", title: "Case studies", hubHref: "/en/realisaties/", intro: "Selected work across every discipline." },
  { id: "knowledge", title: "Knowledge base", hubHref: "/en/kennisbank/", intro: "English articles and practical guides." },
  { id: "tools", title: "Tools", hubHref: "/en/tools/", intro: "Free tools to improve your website and online visibility." },
];

const fixedTitles: Readonly<Record<string, string>> = {
  "/en/about/": "About VisualVibe",
  "/en/contact/": "Contact",
  "/en/request-a-quotation/": "Request a quotation",
  "/en/privacy/": "Privacy policy",
  "/en/cookies/": "Cookie policy",
  "/en/sitemap/": "Sitemap",
  "/en/website-analysis/": "Website analysis",
  "/en/tools/seo-geo-checklist/": "SEO and GEO checklist",
};

function withTrailingSlash(pathname: string): string {
  return pathname === "/" ? pathname : `${pathname.replace(/\/+$/u, "")}/`;
}

function englishPath(pathname: string): string {
  return `/en${withTrailingSlash(pathname)}`;
}

function buildAuthoredEnglishTitles(): ReadonlyMap<string, string> {
  const serviceTitles = allServices.map((source) => {
    const translated = getLocalizedServiceById(source.slug, "en").service;
    return [englishPath(serviceHref(translated)), translated.title] as const;
  });
  const softwareTitles = getSoftwareServices("en").map((service) => [
    englishPath(softwareServiceHref(service, "en")),
    service.title,
  ] as const);
  const regionTitles = regions.map((source) => {
    const translated = getLocalizedRegionById(source.slug, "en");
    return [englishPath(`/regio/${translated.slug}`), translated.title] as const;
  });
  const sectorTitles = sectors.map((source) => {
    const translated = getLocalizedSectorById(source.slug, "en");
    return [englishPath(`/sectoren/${translated.slug}`), translated.title] as const;
  });
  const realisationTitles = realisatieCategories.map((source) => {
    const translated = getLocalizedRealisatieCategoryById(source.slug, "en");
    return [englishPath(`/realisaties/${translated.slug}`), translated.name] as const;
  });
  const applicationCategory = getLocalizedRealisatieCategoryById("applicaties", "en");
  const applicationTitles = applicationCases.map((source) => {
    const translated = getLocalizedApplicationCaseById(source.id, "en");
    return [
      englishPath(`/realisaties/${applicationCategory.slug}/${translated.slug}`),
      translated.title,
    ] as const;
  });
  const knowledgeCategoryTitles = kennisbankCategories.map((source) => {
    const translated = getLocalizedKennisbankCategoryById(source.slug, "en");
    return [englishPath(`/kennisbank/${translated.slug}`), translated.name] as const;
  });
  const knowledgeArticleTitles = blogPosts
    .filter((post) => post.locale === "en" && !post.robots?.includes("noindex"))
    .map((post) => [englishPath(postHref(post)), post.title] as const);

  return new Map<string, string>([
    ...Object.entries(fixedTitles),
    [englishPath(softwareServiceHubHref("en")), "Custom software"],
    ...serviceTitles,
    ...softwareTitles,
    ...regionTitles,
    ...sectorTitles,
    ...realisationTitles,
    ...applicationTitles,
    ...knowledgeCategoryTitles,
    ...knowledgeArticleTitles,
  ]);
}

const authoredEnglishTitles = buildAuthoredEnglishTitles();

function sectionIdFor(pathname: string): EnglishVisibleSitemapSection["id"] {
  if (pathname.startsWith("/en/diensten/")) return "services";
  if (pathname.startsWith("/en/regio/")) return "regions";
  if (pathname.startsWith("/en/sectoren/")) return "industries";
  if (pathname.startsWith("/en/realisaties/")) return "realisations";
  if (pathname.startsWith("/en/kennisbank/")) return "knowledge";
  if (pathname.startsWith("/en/tools/")) return "tools";
  return "general";
}

function authoredTitleFor(pathname: string): string {
  const title = authoredEnglishTitles.get(pathname);
  if (!title) {
    throw new Error(`Missing authored English visible-sitemap title for ${pathname}`);
  }
  return title;
}

export function getEnglishVisibleSitemap(
  entries: MetadataRoute.Sitemap,
): EnglishVisibleSitemap {
  const paths = [...new Set(entries
    .map(({ url }) => new URL(url).pathname)
    .filter((pathname) => pathname.startsWith("/en/")))]
    .sort();
  const nonHomePaths = paths.filter((pathname) => pathname !== "/en/");

  const sections = sectionDefinitions.flatMap((definition) => {
    const matchingPaths = nonHomePaths.filter(
      (pathname) => sectionIdFor(pathname) === definition.id,
    );
    if (matchingPaths.length === 0) return [];
    const href = matchingPaths.includes(definition.hubHref)
      ? definition.hubHref
      : matchingPaths[0];
    return [{
      id: definition.id,
      title: definition.title,
      href,
      intro: definition.intro,
      nodes: matchingPaths
        .filter((pathname) => pathname !== href)
        .map((pathname) => ({ title: authoredTitleFor(pathname), href: pathname })),
    }];
  });

  return {
    homeHref: "/en/",
    sections,
    paths,
    total: paths.length,
  };
}

export function flattenVisibleSitemapHrefs(
  sitemap: EnglishVisibleSitemap,
): string[] {
  return [...new Set([
    sitemap.homeHref,
    ...sitemap.sections.flatMap((section) => [
      section.href,
      ...section.nodes.map(({ href }) => href),
    ]),
  ])];
}
