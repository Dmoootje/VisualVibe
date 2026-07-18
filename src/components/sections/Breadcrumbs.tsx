import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type Crumb = {
  name: string;
  /** In-site path; omit on the last (current) crumb to render it as plain text. */
  href?: string;
};

/**
 * Visible breadcrumb trail, e.g. Home › Kennisbank › SEO & GEO › Artikel.
 * Pair with <BreadcrumbJsonLd> for the structured-data equivalent.
 */
export function Breadcrumbs({
  items,
  className,
  locale = "nl",
}: {
  items: Crumb[];
  className?: string;
  locale?: string;
}) {
  return (
    <nav aria-label={locale === "en" ? "Breadcrumbs" : "Kruimelpad"} className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-white/50">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-amber-400">
                  {item.name}
                </Link>
              ) : (
                <span className={isLast ? "text-white/80" : undefined} aria-current={isLast ? "page" : undefined}>
                  {item.name}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="h-3.5 w-3.5 text-white/30" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
