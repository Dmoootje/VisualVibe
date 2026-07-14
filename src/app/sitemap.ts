import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business.config";
import { allServices, serviceHref } from "@/data/services";
import { softwareServices } from "@/data/softwareServices";
import { regions } from "@/data/regions";
import { sectors } from "@/data/sectors";
import { blogPosts } from "@/data/blog";
import { cases } from "@/data/cases";
import { realisatieCategories } from "@/data/realisatieCategories";
import { matterportTours } from "@/data/matterportTours";
import { droneMedia } from "@/config/drone.config";
import { getFotografieGalleries } from "@/lib/firestore/fotografieGalleries";
import { getApplicationCases } from "@/lib/firestore/applicationCases";
import { kennisbankCategories } from "@/data/kennisbankCategories";
import {
  assertValidKennisbankContent,
  categoryHref,
  getPostTranslations,
  localizedPath,
  postHref,
} from "@/lib/kennisbank/posts";
import type { BlogLocale } from "@/types/blog";

const staticPaths = [
  "",
  "diensten",
  "regio",
  "sectoren",
  "realisaties",
  "over-ons",
  "contact",
  "offerte-aanvragen",
  "privacy",
  "cookies",
  "sitemap",
  "trouwfotograaf-limburg",
  "diensten/webdesign/website-met-ai-functionaliteiten",
];

const indexablePosts = blogPosts.filter((post) => !post.robots?.includes("noindex"));
const activeCategorySlugs = new Set(
  indexablePosts.filter((post) => post.locale === "nl").map((post) => post.categorySlug)
);
activeCategorySlugs.add("software-op-maat");

const softwarePaths = [
  "diensten/software-op-maat",
  ...softwareServices.map((service) => `diensten/software-op-maat/${service.slug}`),
];

const dataPaths = [
  ...allServices.map((service) => serviceHref(service).slice(1)),
  ...softwarePaths,
  ...regions.map((region) => `regio/${region.slug}`),
  ...sectors.map((sector) => `sectoren/${sector.slug}`),
];

const hrefLang: Record<BlogLocale, string> = {
  nl: "nl-BE",
  fr: "fr-BE",
  en: "en-BE",
};

/** Normalises to a leading-and-trailing-slashed path ("" -> "/"). */
function withSlash(path: string): string {
  return path === "" ? "/" : `/${path}/`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  assertValidKennisbankContent();

  const { url } = businessConfig;
  const [fotoGalleries, applicationProjects] = await Promise.all([
    getFotografieGalleries(),
    getApplicationCases(),
  ]);
  const fotoGalleryCount = fotoGalleries.filter((gallery) => gallery.images.length > 0).length;
  const publishedApplicationProjects = applicationProjects.filter((project) => project.published);

  const realisatiePaths = realisatieCategories
    .filter(
      (category) =>
        category.slug === "webdesign" ||
        category.slug === "videografie" ||
        (category.slug === "applicaties" && publishedApplicationProjects.length > 0) ||
        (category.slug === "3d-vr" && matterportTours.length > 0) ||
        (category.slug === "drone" && droneMedia.length > 0) ||
        (category.slug === "fotografie" && fotoGalleryCount > 0) ||
        cases.some((item) => item.category === category.slug)
    )
    .map((category) => `realisaties/${category.slug}`);

  const applicationCasePaths = publishedApplicationProjects.map(
    (project) => `realisaties/applicaties/${project.slug}`,
  );

  // Marketing routes bestaan alleen inhoudelijk in het Nederlands en worden
  // daarom uitsluitend onder /be gepubliceerd.
  const nonKennisbankEntries: MetadataRoute.Sitemap = [
    ...staticPaths,
    ...dataPaths,
    ...realisatiePaths,
    ...applicationCasePaths,
  ].map((path) => ({
    url: `${url}${localizedPath("nl", withSlash(path))}`,
    lastModified: new Date(),
  }));

  const kennisbankEntries: MetadataRoute.Sitemap = [
    {
      url: `${url}${localizedPath("nl", "/kennisbank/")}`,
      lastModified: new Date(),
    },
    ...kennisbankCategories
      .filter((category) => activeCategorySlugs.has(category.slug))
      .map((category) => ({
        url: `${url}${localizedPath("nl", categoryHref(category.slug))}`,
        lastModified: new Date(),
      })),
    ...indexablePosts.map((post) => {
      const translations = getPostTranslations(post).filter(
        (translation) => !translation.robots?.includes("noindex")
      );
      const nlTranslation = translations.find((translation) => translation.locale === "nl");
      const languageAlternates =
        translations.length > 1
          ? Object.fromEntries([
              ...translations.map((translation) => [
                hrefLang[translation.locale],
                `${url}${localizedPath(translation.locale, postHref(translation))}`,
              ]),
              ...(nlTranslation
                ? [["x-default", `${url}${localizedPath("nl", postHref(nlTranslation))}`]]
                : []),
            ])
          : undefined;

      return {
        url: `${url}${localizedPath(post.locale, postHref(post))}`,
        lastModified: new Date(post.updatedAt ?? post.publishedAt),
        alternates: languageAlternates ? { languages: languageAlternates } : undefined,
      };
    }),
  ];

  return [...nonKennisbankEntries, ...kennisbankEntries];
}
