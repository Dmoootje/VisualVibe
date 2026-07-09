import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { sectors } from "@/data/sectors";
import { SectorTile } from "@/components/sectors";
import { sectorIntroConfig } from "./config/sectorIntro.config";

export default function SectorIntro() {
  return (
    <section className="bg-black px-4 py-12 sm:py-16 md:py-24">
      <div className="container mx-auto">
        {/* Header row */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-11 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-5 bg-[#ff7500]" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ff7500]">
                {sectorIntroConfig.eyebrow}
              </span>
            </div>
            <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
              {sectorIntroConfig.title}
            </h2>
            <p className="mt-3 max-w-[520px] text-base leading-relaxed text-white/60 sm:text-[17px]">
              {sectorIntroConfig.subtitle}
            </p>
          </div>
          <Link
            href={sectorIntroConfig.ctaHref}
            className="group inline-flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold text-[#ff7500] transition-all hover:gap-3.5"
          >
            {sectorIntroConfig.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Tile grid */}
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
          {sectors.map((sector) => (
            <SectorTile key={sector.slug} sector={sector} />
          ))}
        </div>
      </div>
    </section>
  );
}
