import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${businessConfig.url}/sitemap.xml`,
  };
}
