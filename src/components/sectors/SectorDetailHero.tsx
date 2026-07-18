import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import type { Sector } from "@/types";
import { SectorHeroEmblem } from "./SectorIcon";

/**
 * Sector detail hero: breadcrumb, tag eyebrow, big title, intro, CTAs and the
 * large decorative emblem (radial glow + counter-rotating dashed rings + glyph).
 */
export function SectorDetailHero({ sector, locale = "nl" }: { sector: Sector; locale?: "nl" | "en" }) {
  const en = locale === "en";
  return (
    <section className="relative overflow-x-clip px-4 pb-12 pt-28 sm:pb-16">
      {/* Faint background grid, fading in toward the emblem (top-right). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          WebkitMaskImage: "radial-gradient(ellipse at 72% 32%, #000, transparent 72%)",
          maskImage: "radial-gradient(ellipse at 72% 32%, #000, transparent 72%)",
        }}
      />

      {/* Amber radial glow, top-right (clipped to the section). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[720px] w-[720px] max-w-full -translate-y-1/4 translate-x-1/4 bg-[radial-gradient(circle_at_center,rgba(255,117,0,0.16),transparent_62%)]" />
      </div>

      <div className="container relative z-10 mx-auto md:-mt-[120px]">
        <div className="grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
          {/* Left: copy */}
          <div>
            <nav className="mb-4 text-[13px] text-white/50">
              <Link href="/sectoren" className="transition-colors hover:text-white">
                {en ? "Industries" : "Sectoren"}
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-white/70">{sector.title}</span>
            </nav>

            {sector.tag && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#ff7500]">
                {sector.tag}
              </p>
            )}

            {/* Longer SEO heroTitle steps the type scale down one notch so it
                wraps within the same hero composition (no layout changes). */}
            <h1
              className={`font-bold leading-[0.98] tracking-tight ${
                sector.heroTitle
                  ? "text-3xl sm:text-4xl md:text-5xl"
                  : "text-4xl sm:text-5xl md:text-6xl"
              }`}
            >
              {sector.heroTitle ?? sector.title}
            </h1>

            <p className="mt-5 max-w-[480px] text-lg text-white/65">{sector.intro}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/offerte-aanvragen"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff7500] px-6 py-3 font-semibold text-black shadow-[0_10px_30px_-8px_rgba(255,117,0,0.6)] transition-transform hover:-translate-y-0.5"
              >
                {sector.heroCtaLabel ?? (en ? "Start your project" : "Start je project")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/realisaties"
                className="inline-flex items-center rounded-full border border-white/[0.16] px-6 py-3 font-medium text-white transition-colors hover:border-[rgba(255,117,0,0.5)]"
              >
                {en ? "View case studies" : "Bekijk cases"}
              </Link>
            </div>
          </div>

          {/* Right: large emblem. Big enough to dominate the hero; any bleed
              past the viewport is clipped by the section's overflow-x-clip.
              Desktop offsets pull it up/right to the intended composition. */}
          <div className="flex justify-center md:-mr-[100px] md:justify-end">
            {sector.icon && <SectorHeroEmblem id={sector.icon} size={700} />}
          </div>
        </div>
      </div>
    </section>
  );
}
