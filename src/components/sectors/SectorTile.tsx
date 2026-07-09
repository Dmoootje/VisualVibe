import { Link } from "@/i18n/navigation";
import type { Sector } from "@/types";
import { SectorIcon } from "./SectorIcon";

/** Compact homepage tile: icon chip, title and tag. Links to the detail page. */
export function SectorTile({ sector }: { sector: Sector }) {
  return (
    <Link
      href={`/sectoren/${sector.slug}`}
      className="group flex flex-col items-start gap-4 rounded-[18px] border border-white/[0.08] bg-white/[0.02] p-[22px] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,117,0,0.38)] hover:bg-[rgba(255,117,0,0.05)]"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-[14px] border border-[rgba(255,117,0,0.16)] bg-[rgba(255,117,0,0.08)]">
        {sector.icon && <SectorIcon id={sector.icon} size={34} />}
      </span>
      <div>
        <h3 className="font-semibold text-white">{sector.title}</h3>
        {sector.tag && <p className="mt-1 text-[12.5px] text-white/45">{sector.tag}</p>}
      </div>
    </Link>
  );
}
