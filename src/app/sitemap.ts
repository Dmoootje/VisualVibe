import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business.config";
import { routing } from "@/i18n/routing";
import { allServices } from "@/data/services";
import { regions } from "@/data/regions";
import { sectors } from "@/data/sectors";
import { blogPosts } from "@/data/blog";
import { kennisbankCategories } from "@/data/kennisbankCategories";

// Static + data-driven routes today. Case (realisaties) slugs are added
// once that dataset is populated in Fase 4.
const staticPaths = [
  "",
  "diensten",
  "regio",
  "sectoren",
  "realisaties",
  "kennisbank",
  "over-ons",
  "contact",
  "offerte-aanvragen",
];

// Indexable posts only (noindex drafts stay out of the sitemap).
const indexablePosts = blogPosts.filter((post) => !post.robots?.includes("noindex"));
// A category only enters the sitemap once it has an indexable post, so
// registered-but-empty pillars (fotografie, videografie, ...) emit no URL.
const activeCategorySlugs = new Set(indexablePosts.map((post) => post.categorySlug));

const dataPaths = [
  ...allServices.map((service) => `diensten/${service.slug}`),
  ...regions.map((region) => `regio/${region.slug}`),
  ...sectors.map((sector) => `sectoren/${sector.slug}`),
  ...kennisbankCategories
    .filter((category) => activeCategorySlugs.has(category.slug))
    .map((category) => `kennisbank/${category.slug}`),
  ...indexablePosts.map((post) => `kennisbank/${post.categorySlug}/${post.slug}`),
];

/** Normalises to a leading-and-trailing-slashed path ("" -> "/"). */
function withSlash(path: string): string {
  return path === "" ? "/" : `/${path}/`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const { url } = businessConfig;

  return [...staticPaths, ...dataPaths].map((path) => {
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
}
