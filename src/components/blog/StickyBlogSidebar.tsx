"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { BlogToc, type TocItem } from "./BlogToc";
import { GlowFrame } from "./GlowFrame";

/** Highlights the heading currently in the upper part of the viewport. */
function useActiveHeading(ids: string[]): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0]);
  const key = ids.join("|");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return activeId;
}

export type SidebarCta = { title?: string; description?: string; label: string; href: string };
export type SidebarService = {
  title: string;
  description?: string;
  href: string;
  /** An already-rendered icon element, e.g. <Search className="h-5 w-5" /> -
   * a node, not a component, so it can cross the server→client boundary. */
  icon?: React.ReactNode;
  linkLabel?: string;
};

/**
 * Sticky companion column for a real article: scrollspy TOC + a compact CTA and
 * an optional mini service-card. Drop it in the aside of a two-column layout.
 */
export function StickyBlogSidebar({
  toc,
  cta,
  service,
  className,
}: {
  toc: TocItem[];
  cta?: SidebarCta;
  service?: SidebarService;
  className?: string;
}) {
  const activeId = useActiveHeading(toc.map((item) => item.id));

  return (
    <div className={cn("sticky top-24 flex flex-col gap-6", className)}>
      {toc.length > 0 && <BlogToc items={toc} activeId={activeId} />}

      {cta && (
        <GlowFrame>
          <div className="relative overflow-hidden rounded-2xl p-5">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-500/20 blur-2xl" />
            <div className="relative">
              {cta.title && <p className="font-semibold text-white">{cta.title}</p>}
              {cta.description && (
                <p className="mt-1 text-sm text-white/70">{cta.description}</p>
              )}
              <Link
                href={cta.href}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                {cta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </GlowFrame>
      )}

      {service && (
        <Link
          href={service.href}
          className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-amber-500/40 hover:shadow-[0_0_30px_-12px_rgba(255,117,0,0.45)]"
        >
          {service.icon && (
            <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-red-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20">
              {service.icon}
            </span>
          )}
          <p className="font-semibold text-white">{service.title}</p>
          {service.description && (
            <p className="mt-1 text-sm leading-relaxed text-white/65">{service.description}</p>
          )}
          <span className="mt-3 inline-flex items-center gap-1 text-sm text-amber-400">
            {service.linkLabel ?? "Ontdek deze dienst"}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </Link>
      )}
    </div>
  );
}
