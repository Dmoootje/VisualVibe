import { cn } from "@/lib/utils";

export type TocItem = {
  /** Must match the `id` of the ContentSection / heading it links to. */
  id: string;
  label: string;
  /** 2 = h2 (top level), 3 = h3 (indented). Defaults to 2. */
  level?: 2 | 3;
};

/**
 * Presentational table of contents. Highlights `activeId` — pass it from
 * StickyBlogSidebar (which runs the scrollspy) or leave undefined for a static
 * list. Renders in-page hash links so it works without JS.
 */
export function BlogToc({
  items,
  activeId,
  title = "Inhoud",
  className,
}: {
  items: TocItem[];
  activeId?: string;
  title?: string;
  className?: string;
}) {
  return (
    <nav aria-label={title} className={className}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
        {title}
      </p>
      <ul className="space-y-1 border-l border-white/10">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 text-sm transition-colors",
                  item.level === 3 ? "pl-6" : "pl-4",
                  isActive
                    ? "border-amber-400 font-medium text-amber-300"
                    : "border-transparent text-white/55 hover:border-white/30 hover:text-white/90"
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
