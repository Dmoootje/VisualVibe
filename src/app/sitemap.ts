import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business.config";
import { routing } from "@/i18n/routing";
import { services } from "@/data/services";
import { regions } from "@/data/regions";
import { sectors } from "@/data/sectors";

// Static + data-driven routes today. Case (realisaties) and kennisbank post
// slugs are added here once those datasets are populated in Fase 4/5.
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
  ...services.map((service) => `diensten/${service.slug}`),
  ...regions.map((region) => `regio/${region.slug}`),
  ...sectors.map((sector) => `sectoren/${sector.slug}`),
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
