import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business.config";
import { routing } from "@/i18n/routing";
import { allServices } from "@/data/services";
import { regions } from "@/data/regions";
import { sectors } from "@/data/sectors";
import { blogPosts } from "@/data/blog";

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

const dataPaths = [
  ...allServices.map((service) => `diensten/${service.slug}`),
  ...regions.map((region) => `regio/${region.slug}`),
  ...sectors.map((sector) => `sectoren/${sector.slug}`),
  ...blogPosts.map((post) => `kennisbank/${post.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const { url } = businessConfig;

  return [...staticPaths, ...dataPaths].map((path) => ({
    url: `${url}/${path}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          locale === routing.defaultLocale ? `${url}/${path}` : `${url}/${locale}/${path}`,
        ])
      ),
    },
  }));
}
