import "server-only";

import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business.config";
import { blogPosts } from "@/data/blog";
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
import { getPublishedLocales } from "@/i18n/locales";
import type { SupportedLocale } from "@/i18n/locales";
import {
  getDataPublicRoutePairs,
  getStaticPublicRoutePairs,
  type PublicRoutePair,
} from "./publicPageInventory";
import {
  localizedPublicUrl,
  publishedLanguageAlternates,
  type LocalePathPair,
} from "./publicationRoutes";

const publishedLocales = getPublishedLocales();
const publishedPublicLocales = publishedLocales.filter(
  (locale): locale is "nl" | "en" => locale === "nl" || locale === "en",
);
const publishedLocaleSet = new Set<SupportedLocale>(publishedLocales);
const indexablePosts = blogPosts.filter(
  (post) => publishedLocaleSet.has(post.locale) && !post.robots?.includes("noindex"),
);
const activeCategorySlugs = new Set(
  indexablePosts.filter((post) => post.locale === "nl").map((post) => post.categorySlug)
);
activeCategorySlugs.add("software-op-maat");

function isBilingualRoute(pair: PublicRoutePair): pair is LocalePathPair {
  return typeof pair.en === "string";
}

function publicRouteEntries(
  pair: PublicRoutePair,
  lastModified: Date = new Date(),
): MetadataRoute.Sitemap {
  const languages = isBilingualRoute(pair)
    ? publishedLanguageAlternates(businessConfig.url, pair)
    : undefined;

  return publishedPublicLocales.flatMap((locale) => {
    const routePath = locale === "nl" ? pair.nl : pair.en;
    if (!routePath) return [];
    return [{
      url: localizedPublicUrl(businessConfig.url, locale, routePath),
      lastModified,
      alternates: languages ? { languages } : undefined,
    }];
  });
}

/**
 * The single source of truth for every canonical, indexable public URL.
 * Both the XML sitemap and the IndexNow submitter read from this so the two can
 * never drift: whatever Google can crawl via the sitemap is exactly what Bing,
 * Yandex and the other IndexNow engines get pinged about.
 */
export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  assertValidKennisbankContent(publishedLocales);

  const { url } = businessConfig;
  const [fotoGalleries, applicationProjects] = await Promise.all([
    getFotografieGalleries(),
    getApplicationCases(),
  ]);
  const fotoGalleryCount = fotoGalleries.filter((gallery) => gallery.images.length > 0).length;
  const publishedApplicationProjects = applicationProjects.filter((project) => project.published);

  const publicRoutes = [
    ...getStaticPublicRoutePairs(),
    ...getDataPublicRoutePairs({
      photographyGalleryCount: fotoGalleryCount,
      publishedApplicationCases: publishedApplicationProjects,
    }),
  ];
  const nonKennisbankEntries = publicRoutes.flatMap((pair) => publicRouteEntries(pair));

  const kennisbankHubEntries = publicRouteEntries({
    nl: "/kennisbank/",
    en: "/kennisbank/",
  });
  const kennisbankCategoryEntries = kennisbankCategories
    .filter((category) => activeCategorySlugs.has(category.slug))
    .flatMap((category) => publicRouteEntries({
      nl: categoryHref(category.slug),
      en: categoryHref(category.slug),
    }));

  const translationKeys = [
    ...new Set(indexablePosts.map((post) => post.translationKey)),
  ];
  const kennisbankArticleEntries: MetadataRoute.Sitemap = translationKeys.flatMap(
    (translationKey) => {
      const translations = Object.values(getPostTranslations(translationKey)).filter(
        (translation): translation is NonNullable<typeof translation> =>
          Boolean(
            translation &&
              publishedLocaleSet.has(translation.locale) &&
              !translation.robots?.includes("noindex"),
          ),
      );
      const nlTranslation = translations.find((translation) => translation.locale === "nl");
      const enTranslation = translations.find((translation) => translation.locale === "en");
      const languageAlternates =
        nlTranslation && enTranslation
          ? publishedLanguageAlternates(url, {
              nl: postHref(nlTranslation),
              en: postHref(enTranslation),
            })
          : undefined;

      return translations.map((post) => ({
        url: `${url}${localizedPath(post.locale, postHref(post))}`,
        lastModified: new Date(post.updatedAt ?? post.publishedAt),
        alternates: languageAlternates ? { languages: languageAlternates } : undefined,
      }));
    },
  );

  const kennisbankEntries: MetadataRoute.Sitemap = [
    ...kennisbankHubEntries,
    ...kennisbankCategoryEntries,
    ...kennisbankArticleEntries,
  ];

  return [...nonKennisbankEntries, ...kennisbankEntries];
}

/** Flat list of every canonical indexable URL, for IndexNow submission. */
export async function getIndexableUrls(): Promise<string[]> {
  const entries = await getSitemapEntries();
  return entries.map((entry) => entry.url);
}
