import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business.config";
import { routing } from "@/i18n/routing";
import { allServices } from "@/data/services";
import { regions } from "@/data/regions";
import { sectors } from "@/data/sectors";
import { blogPosts } from "@/data/blog";
import { kennisbankCategories } from "@/data/kennisbankCategories";
import {
  assertValidKennisbankContent,
  categoryHref,
  getPostTranslations,
  localizedPath,
  postHref,
} from "@/lib/kennisbank/posts";
import type { BlogLocale } from "@/types/blog";

// Static + data-driven routes today. Case (realisaties) slugs are added
// once that dataset is populated in Fase 4.
const staticPaths = [
  "",
  "diensten",
  "regio",
  "sectoren",
  "realisaties",
  "over-ons",
  "contact",
  "offerte-aanvragen",
];

// getAllPosts() already excludes draft, scheduled, archived and future-dated
// content; noindex posts are excluded here as a separate indexing decision.
const indexablePosts = blogPosts.filter((post) => !post.robots?.includes("noindex"));
// A category only enters the sitemap once it has an indexable post, so
// registered-but-empty pillars (fotografie, videografie, ...) emit no URL.
const activeCategorySlugs = new Set(
  indexablePosts.filter((post) => post.locale === "nl").map((post) => post.categorySlug)
);

const dataPaths = [
  ...allServices.map((service) => `diensten/${service.slug}`),
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

export default function sitemap(): MetadataRoute.Sitemap {
  // Publishing must stop when a live article points to a missing or
  // non-canonical pillar, post, service, region, sector, case or source.
  assertValidKennisbankContent();

  const { url } = businessConfig;

  // Preserve the existing behavior for every non-kennisbank route. Kennisbank
  // entries below use their real `/be`, `/fr` or `/en` URL and only advertise
  // language alternates backed by an explicit translationKey relationship.
  const nonKennisbankEntries: MetadataRoute.Sitemap = [...staticPaths, ...dataPaths].map((path) => {
    const rel = withSlash(path);
    return {
      url: `${url}${rel}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((locale) => [
            locale,
            locale === routing.defaultLocale ? `${url}${rel}` : `${url}/${locale}${rel}`,
          ])
        ),
      },
    };
  });

  const kennisbankEntries: MetadataRoute.Sitemap = [
    // Category copy currently exists only in Dutch, so hub/category URLs are
    // deliberately published only under /be and carry no invented alternates.
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
      const languageAlternates =
        translations.length > 1
          ? Object.fromEntries(
              translations.map((translation) => [
                hrefLang[translation.locale],
                `${url}${localizedPath(translation.locale, postHref(translation))}`,
              ])
            )
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
