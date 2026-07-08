import { businessConfig } from "@/config/business.config";
import { JsonLd } from "./JsonLd";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${businessConfig.url}${item.path}`,
        })),
      }}
    />
  );
}
