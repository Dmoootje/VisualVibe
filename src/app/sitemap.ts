import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business.config";
import { routing } from "@/i18n/routing";

// Static routes today. Blog post slugs are added here once the Firestore-backed
// blog (getPosts) ships — this file is the single place that needs updating.
const staticPaths = [""];

export default function sitemap(): MetadataRoute.Sitemap {
  const { url } = businessConfig;

  return staticPaths.map((path) => ({
    url: `${url}/${path}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          locale === routing.defaultLocale
            ? `${url}/${path}`
            : `${url}/${locale}/${path}`,
        ])
      ),
    },
  }));
}
