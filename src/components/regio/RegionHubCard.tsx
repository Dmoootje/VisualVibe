import { Link } from "@/i18n/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import type { Region } from "@/types";
import { regionMunicipalities } from "@/data/regionMunicipalities";
import { RegionMiniMap } from "@/features/home/RegionIntro/components/RegionMiniMap";

/**
 * Wide, fully clickable region card for the /regio hub: label, titel, intro en
 * gemeente-chips links, de echte (gehighlighte) regiokaart rechts, met op
 * mobiel de kaart bovenaan. Zelfde visuele taal als de homepage RegionMapCard,
 * opgeschaald voor het 2-koloms hubgrid.
 */
export function RegionHubCard({ region }: { region: Region }) {
  const municipalities = regionMunicipalities[region.slug] ?? [];
  const shown = municipalities.slice(0, 5);
  const remaining = municipalities.length - shown.length;
  const isHome = region.type === "province";
  const label = isHome ? "Thuisregio" : region.country === "NL" ? "Regio · Nederland" : "Regio";

  return (
    <Link
      href={`/regio/${region.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[22px] border border-white/10 bg-neutral-950/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,117,0,0.4)] hover:shadow-[0_20px_55px_-22px_rgba(255,117,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 sm:grid sm:grid-cols-[1.12fr_0.88fr]"
    >
      {/* Kaart: bovenaan op mobiel, rechts vanaf sm. */}
      <div className="relative h-44 w-full overflow-hidden sm:order-2 sm:h-full sm:min-h-[260px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,rgba(255,117,0,0.15),transparent_62%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="absolute inset-0 p-3 sm:p-5">
          <RegionMiniMap slug={region.slug} />
        </div>
        {/* Zachte overgang van kaart naar kaartinhoud (onder op mobiel, links op desktop). */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-neutral-950/85 to-transparent sm:hidden" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-14 bg-gradient-to-r from-neutral-950/70 to-transparent sm:block" />
      </div>

      {/* Inhoud */}
      <div className="flex flex-1 flex-col gap-3 p-6 sm:order-1 sm:p-7">
        <span
          className={
            isHome
              ? "inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-300"
              : "inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60"
          }
        >
          <MapPin aria-hidden="true" className="h-3 w-3" />
          {label}
        </span>

        <h3 className="text-[22px] font-bold leading-tight text-white transition-colors group-hover:text-amber-400">
          {region.title}
        </h3>

        <p className="text-[14.5px] leading-relaxed text-white/65">{region.intro}</p>

        {shown.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {shown.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[12px] font-medium text-white/70"
              >
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#ff7500]" />
                {name}
              </span>
            ))}
            {remaining > 0 && (
              <span className="inline-flex items-center rounded-full border border-dashed border-white/10 px-2.5 py-1 text-[12px] font-medium text-white/45">
                +{remaining} gemeentes
              </span>
            )}
          </div>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-[#ff7500] transition-all duration-300 group-hover:gap-2.5">
          Ontdek {region.title}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
