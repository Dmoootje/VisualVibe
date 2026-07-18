import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type RelatedRegion = {
  name: string;
  href: string;
};

/**
 * Compact pill links to region hub pages - supports the local-SEO internal
 * linking the blueprint requires, without heavy thin-content cards.
 */
export function RelatedRegions({
  items,
  title = "Actief in deze regio's",
  className,
  locale = "nl",
}: {
  items: RelatedRegion[];
  title?: string;
  className?: string;
  locale?: string;
}) {
  if (locale === "en" && title === "Actief in deze regio's") title = "Active in these regions";
  return (
    <section className={cn("my-8", className)}>
      <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>
      <ul className="flex flex-wrap gap-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-white/80 transition-colors hover:border-[#ff7500]/40 hover:text-white"
            >
              <MapPin className="h-3.5 w-3.5 text-[#ff7500]" aria-hidden="true" />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
