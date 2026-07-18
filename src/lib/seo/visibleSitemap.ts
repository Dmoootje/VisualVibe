import type { MetadataRoute } from "next";

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
};

function sectionIdFor(pathname: string): EnglishVisibleSitemapSection["id"] {
  if (pathname.startsWith("/en/diensten/")) return "services";
  if (pathname.startsWith("/en/regio/")) return "regions";
  if (pathname.startsWith("/en/sectoren/")) return "industries";
  if (pathname.startsWith("/en/realisaties/")) return "realisations";
  if (pathname.startsWith("/en/kennisbank/")) return "knowledge";
  if (pathname.startsWith("/en/tools/")) return "tools";
  return "general";
}

function humanizePath(pathname: string): string {
  const fixed = fixedTitles[pathname];
  if (fixed) return fixed;
  const slug = pathname.split("/").filter(Boolean).at(-1) ?? "Page";
  const title = slug
    .split("-")
    .map((word) => {
      const acronym = word.toUpperCase();
      if (["3D", "AI", "API", "AR", "FPV", "GEO", "SEO", "SMES", "UI", "UX", "VR"].includes(acronym)) {
        return acronym === "SMES" ? "SMEs" : acronym;
      }
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");
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
        .map((pathname) => ({ title: humanizePath(pathname), href: pathname })),
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
