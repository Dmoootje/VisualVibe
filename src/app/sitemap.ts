import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/seo/siteUrls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries();
}
