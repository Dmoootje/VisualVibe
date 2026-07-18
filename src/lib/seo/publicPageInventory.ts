import { type ApplicationCase, getLocalizedApplicationCaseById } from "@/data/applicationCases";
import { cases } from "@/data/cases";
import { droneMedia } from "@/config/drone.config";
import { matterportTours } from "@/data/matterportTours";
import {
  getLocalizedRealisatieCategoryById,
  realisatieCategories,
  shouldIndexRealisatieCategoryWithoutCases,
} from "@/data/realisatieCategories";
import { getLocalizedRegionById, regions } from "@/data/regions";
import { getLocalizedSectorById, sectors } from "@/data/sectors";
import {
  allServices,
  getLocalizedServiceById,
  serviceHref,
} from "@/data/services";
import {
  getSoftwareServices,
  softwareServiceHref,
  softwareServiceHubHref,
} from "@/data/softwareServices";
import type { LocalePathPair } from "./publicationRoutes";

export type PublicRoutePair =
  | LocalePathPair
  | Readonly<{ nl: string; en?: never }>;

export type DataPublicRouteInput = Readonly<{
  photographyGalleryCount: number;
  publishedApplicationCases: readonly Pick<ApplicationCase, "id" | "slug">[];
}>;

const coreRoutePairs: readonly LocalePathPair[] = [
  { nl: "/", en: "/" },
  { nl: "/diensten/", en: "/diensten/" },
  { nl: "/regio/", en: "/regio/" },
  { nl: "/sectoren/", en: "/sectoren/" },
  { nl: "/realisaties/", en: "/realisaties/" },
  { nl: "/over-ons/", en: "/about/" },
  { nl: "/contact/", en: "/contact/" },
  { nl: "/offerte-aanvragen/", en: "/request-a-quotation/" },
  { nl: "/privacy/", en: "/privacy/" },
  { nl: "/cookies/", en: "/cookies/" },
  { nl: "/sitemap/", en: "/sitemap/" },
  { nl: "/tools/", en: "/tools/" },
  { nl: "/tools/seo-geo-checklist/", en: "/tools/seo-geo-checklist/" },
  { nl: "/website-analyse/", en: "/website-analysis/" },
];

function withTrailingSlash(path: string): string {
  return path === "/" ? path : `${path.replace(/\/+$/u, "")}/`;
}

function realisationCategoryPair(id: string): LocalePathPair {
  const dutch = getLocalizedRealisatieCategoryById(id, "nl");
  const english = getLocalizedRealisatieCategoryById(id, "en");
  return {
    nl: `/realisaties/${dutch.slug}/`,
    en: `/realisaties/${english.slug}/`,
  };
}

function applicationCasePair(id: string): LocalePathPair | undefined {
  try {
    const dutchCategory = getLocalizedRealisatieCategoryById("applicaties", "nl");
    const englishCategory = getLocalizedRealisatieCategoryById("applicaties", "en");
    const dutch = getLocalizedApplicationCaseById(id, "nl");
    const english = getLocalizedApplicationCaseById(id, "en");
    return {
      nl: `/realisaties/${dutchCategory.slug}/${dutch.slug}/`,
      en: `/realisaties/${englishCategory.slug}/${english.slug}/`,
    };
  } catch {
    return undefined;
  }
}

function getStaticRealisationRoutes(): PublicRoutePair[] {
  return realisatieCategories.flatMap((category): PublicRoutePair[] => {
    if (category.slug === "applicaties") return [];

    const indexableInDutch =
      category.slug === "webdesign" ||
      category.slug === "videografie" ||
      (category.slug === "3d-vr" && matterportTours.length > 0) ||
      (category.slug === "drone" && droneMedia.length > 0) ||
      cases.some((item) => item.category === category.slug) ||
      shouldIndexRealisatieCategoryWithoutCases(category);
    if (!indexableInDutch) return [];

    const indexableInEnglish =
      category.slug === "webdesign" ||
      (category.slug === "3d-vr" && matterportTours.length > 0) ||
      (category.slug === "drone" && droneMedia.length > 0) ||
      shouldIndexRealisatieCategoryWithoutCases(category);

    return indexableInEnglish
      ? [realisationCategoryPair(category.slug)]
      : [{
          nl: `/realisaties/${getLocalizedRealisatieCategoryById(category.slug, "nl").slug}/`,
        }];
  });
}

export function getStaticPublicRoutePairs(): PublicRoutePair[] {
  const serviceRoutes = allServices.map((source): LocalePathPair => ({
    nl: withTrailingSlash(serviceHref(getLocalizedServiceById(source.slug, "nl").service)),
    en: withTrailingSlash(serviceHref(getLocalizedServiceById(source.slug, "en").service)),
  }));

  const dutchSoftware = getSoftwareServices("nl");
  const englishSoftware = getSoftwareServices("en");
  const softwareRoutes: LocalePathPair[] = [
    {
      nl: withTrailingSlash(softwareServiceHubHref("nl")),
      en: withTrailingSlash(softwareServiceHubHref("en")),
    },
    ...dutchSoftware.map((source): LocalePathPair => {
      const translated = englishSoftware.find((service) => service.id === source.id);
      if (!translated) throw new Error(`Missing en software service translation: ${source.id}`);
      return {
        nl: withTrailingSlash(softwareServiceHref(source, "nl")),
        en: withTrailingSlash(softwareServiceHref(translated, "en")),
      };
    }),
  ];

  const regionRoutes = regions.map((source): LocalePathPair => ({
    nl: `/regio/${getLocalizedRegionById(source.slug, "nl").slug}/`,
    en: `/regio/${getLocalizedRegionById(source.slug, "en").slug}/`,
  }));

  const sectorRoutes = sectors.map((source): LocalePathPair => ({
    nl: `/sectoren/${getLocalizedSectorById(source.slug, "nl").slug}/`,
    en: `/sectoren/${getLocalizedSectorById(source.slug, "en").slug}/`,
  }));

  return [
    ...coreRoutePairs,
    ...serviceRoutes,
    ...softwareRoutes,
    ...regionRoutes,
    ...sectorRoutes,
    ...getStaticRealisationRoutes(),
  ];
}

export function getDataPublicRoutePairs(input: DataPublicRouteInput): PublicRoutePair[] {
  const routes: PublicRoutePair[] = [];

  if (
    input.photographyGalleryCount > 0 &&
    !cases.some((item) => item.category === "fotografie")
  ) {
    routes.push({ nl: "/realisaties/fotografie/" });
  }

  if (input.publishedApplicationCases.length > 0) {
    routes.push(realisationCategoryPair("applicaties"));
    routes.push(
      ...input.publishedApplicationCases.flatMap((project) => {
        const pair = applicationCasePair(project.id);
        return pair ? [pair] : [];
      }),
    );
  }

  return routes;
}
