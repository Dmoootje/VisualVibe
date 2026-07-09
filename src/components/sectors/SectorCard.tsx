import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import type { Sector } from "@/types";
import { SectorIcon } from "./SectorIcon";

/** Editorial overview card: icon chip + tag, title, description and a CTA link. */
export function SectorCard({ sector }: { sector: Sector }) {
  return (
    <Link
      href={`/sectoren/${sector.slug}`}
      className="group flex flex-col rounded-[20px] border border-white/[0.09] bg-white/[0.02] p-[26px] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,117,0,0.4)] hover:shadow-[0_20px_55px_-22px_rgba(255,117,0,0.5)]"
    >
      <div className="mb-[22px] flex items-start justify-between gap-3">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(255,117,0,0.18)] bg-[radial-gradient(circle_at_35%_30%,rgba(255,117,0,0.14),rgba(255,117,0,0.04))]">
          {sector.icon && <SectorIcon id={sector.icon} size={40} />}
        </span>
        {sector.tag && (
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/35">
            {sector.tag}
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-white">{sector.title}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-white/60">
        {sector.cardDescription ?? sector.intro}
      </p>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[#ff7500] transition-all duration-300 group-hover:gap-2.5">
        Ontdek sector
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
