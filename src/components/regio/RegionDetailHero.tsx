import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import type { Region } from "@/types";
import { RegionMiniMap } from "@/features/home/RegionIntro/components/RegionMiniMap";
import { regionMaps } from "@/features/home/RegionIntro/config/regionMaps";

/**
 * Region detail hero: breadcrumb, eyebrow, big title, intro and CTAs on the
 * left, with the region's real (highlighted) map plus a pulsing marker on the
 * right - the same map used on the homepage, shown large. Mirrors the sector
 * detail hero's composition, minus the rotating-ring emblem.
 */
export function RegionDetailHero({ region }: { region: Region }) {
  const hasMap = Boolean(regionMaps[region.slug]);
  const eyebrow =
    region.type === "province"
      ? "Thuisregio"
      : region.country === "NL"
        ? "Werkgebied · Nederland"
        : "Werkgebied · Belgie";

  return (
    <section className="relative overflow-x-clip px-4 pb-12 pt-28 sm:pb-16">
      {/* Faint background grid, fading in toward the map (top-right). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          WebkitMaskImage: "radial-gradient(ellipse at 70% 52%, #000, transparent 74%)",
          maskImage: "radial-gradient(ellipse at 70% 52%, #000, transparent 74%)",
        }}
      />

      {/* Amber radial glow, sitting a touch lower to sit behind the dropped map. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-[14%] h-[720px] w-[720px] max-w-full translate-x-1/4 bg-[radial-gradient(circle_at_center,rgba(255,117,0,0.16),transparent_62%)]" />
      </div>

      <div className="container relative z-10 mx-auto md:-mt-[80px]">
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          {/* Left: copy */}
          <div>
            <nav className="mb-4 text-[13px] text-white/50">
              <Link href="/regio" className="transition-colors hover:text-white">
                Regio
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-white/70">{region.title}</span>
            </nav>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#ff7500]">
              {eyebrow}
            </p>

            <h1 className="text-4xl font-bold leading-[0.98] tracking-tight sm:text-5xl md:text-6xl">
              {region.title}
            </h1>

            <p className="mt-5 max-w-[480px] text-lg text-white/65">{region.intro}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/offerte-aanvragen"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff7500] px-6 py-3 font-semibold text-black shadow-[0_10px_30px_-8px_rgba(255,117,0,0.6)] transition-transform hover:-translate-y-0.5"
              >
                Start je project
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/realisaties"
                className="inline-flex items-center rounded-full border border-white/[0.16] px-6 py-3 font-medium text-white transition-colors hover:border-[rgba(255,117,0,0.5)]"
              >
                Bekijk realisaties
              </Link>
            </div>
          </div>

          {/* Right: the region's real map, large, dropped a bit, with the pulsing marker. */}
          <div className="flex justify-center md:mt-16 md:justify-end">
            {hasMap && (
              <div className="group relative aspect-[6/5] w-full max-w-[600px]">
                {/* Soft glow directly behind the map so it lifts off the page. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,117,0,0.18),transparent_65%)] blur-xl"
                />
                <RegionMiniMap slug={region.slug} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
