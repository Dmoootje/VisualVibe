import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import type { Region } from "@/types";
import { regionCards } from "../config/regionIntro.config";
import { RegionMiniMap } from "./RegionMiniMap";

/**
 * Premium, fully clickable region card with a mini-map visual, orange highlight
 * glow and a subtle hover lift. Dark glassmorphism styling to match VisualVibe.
 */
export function RegionMapCard({ region, locale = "nl" }: { region: Region; locale?: string }) {
  const stableId = "id" in region && typeof region.id === "string" ? region.id : region.slug;
  const card = locale !== "en"
    ? regionCards[stableId] ?? {
        label: region.type === "province" ? "Thuisregio" : "Regio",
        description: region.intro,
      }
    : {
        label: region.type === "province" ? "Home region" : "Region",
        description: region.intro,
      };
  const isHome = region.type === "province";

  return (
    <Link
      href={`/regio/${region.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-[0_18px_50px_-18px_rgba(255,117,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
    >
      {/* Map visual */}
      <div className="relative h-36 w-full overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950">
        {/* Ambient glow behind the map */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_45%,rgba(255,117,0,0.16),transparent_60%)] transition-opacity duration-300 group-hover:opacity-100 opacity-80" />
        <RegionMiniMap slug={stableId} />
        {/* Bottom fade into the content */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-neutral-950 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <span
          className={
            isHome
              ? "inline-flex w-fit items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-amber-300"
              : "inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-white/60"
          }
        >
          {card.label}
        </span>
        <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-amber-400">
          {region.title}
        </h3>
        <p className="text-sm leading-relaxed text-white/60">{card.description}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-amber-400/90 transition-all duration-300 group-hover:gap-2.5">
          {locale === "en" ? "Explore region" : "Ontdek regio"}
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
