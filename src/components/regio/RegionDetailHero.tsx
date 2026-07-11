import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import type { Region } from "@/types";
import { regionMunicipalities } from "@/data/regionMunicipalities";
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
  const municipalities = regionMunicipalities[region.slug] ?? [];
  // Dupliceren zodat de -50% marquee-keyframe naadloos doorloopt.
  const runner = [...municipalities, ...municipalities];
  const eyebrow =
    region.type === "province"
      ? "Thuisregio"
      : region.country === "NL"
        ? "Werkgebied · Nederland"
        : "Werkgebied · Belgie";

  return (
    <section className="relative overflow-x-clip px-4 pb-8 pt-28 sm:pb-10">
      {/* Faint background grid, fading in toward the map (top-right). The big amber
          glow lives in the page-wide RegionAmbient so it never gets cut off here. */}
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

            <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
              <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
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

        {/* Gemeente-runner: "Actief in o.a." - een gemaskeerde marquee van
            gemeentes, goed voor lokale SEO en herkenbaarheid. Op desktop iets
            omhoog getrokken zodat hij dicht bij de hero-inhoud blijft. */}
        {municipalities.length > 0 && (
          <div className="relative z-[1] mt-4 md:-mt-8">
            <span className="mb-3.5 block text-[11.5px] font-bold uppercase tracking-[0.15em] text-white/40">
              Actief in o.a.
            </span>
            <div className="vv-mq-contain" aria-label={`Gemeentes in ${region.title}`}>
              <div className="vv-mq-track vv-mq-l">
                {runner.map((name, i) => (
                  <span
                    key={`${name}-${i}`}
                    className="inline-flex flex-none items-center gap-2.5 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.02] px-[18px] py-[9px] text-sm font-semibold text-white/[0.78]"
                  >
                    <span className="h-[5px] w-[5px] flex-none rounded-full bg-[#ff7500]" />
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
