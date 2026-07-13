import { Link } from "@/i18n/navigation";
import { regions } from "@/data/regions";
import { RegionMiniMap } from "@/features/home/RegionIntro/components/RegionMiniMap";

/**
 * Regio-kolom in de footer: de vier regio's als mini-kaartjes (2x2) met de
 * echte provincie-silhouetten en marker, in plaats van kale tekstlinks.
 * Pure SVG (RegionMiniMap), dus server-safe.
 */
export function FooterRegioMaps() {
  return (
    <div className="col-span-2 sm:col-span-1">
      <h3 className="mb-5 text-[15px] font-semibold text-white">Regio</h3>
      <div className="grid max-w-[360px] grid-cols-2 gap-3 sm:max-w-[300px]">
        {regions.map((region) => (
          <Link
            key={region.slug}
            href={`/regio/${region.slug}`}
            aria-label={`Regio ${region.title}`}
            className="group flex flex-col items-center gap-1.5 rounded-[14px] border border-white/[0.08] bg-white/[0.02] p-2.5 transition-colors hover:border-[rgba(255,122,0,0.4)] hover:bg-[rgba(255,122,0,0.05)]"
          >
            <span className="block h-[76px] w-full">
              <RegionMiniMap slug={region.slug} />
            </span>
            <span className="text-center text-[12px] font-semibold leading-tight text-white/70 transition-colors group-hover:text-white">
              {region.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
