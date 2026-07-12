import { businessConfig } from "@/config/business.config";
import { localizedPath } from "@/lib/kennisbank/urls";
import type { BlogLocale } from "@/types/blog";
import { JsonLd } from "./JsonLd";

export type BreadcrumbItem = {
  name: string;
  /** In-site path WITHOUT locale prefix (e.g. "/diensten/webdesign"); localized here. */
  path: string;
};

export function BreadcrumbJsonLd({
  items,
  locale = "nl",
}: {
  items: BreadcrumbItem[];
  locale?: BlogLocale;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${businessConfig.url}${localizedPath(
            locale,
            item.path.endsWith("/") ? item.path : `${item.path}/`
          )}`,
        })),
      }}
    />
  );
}
