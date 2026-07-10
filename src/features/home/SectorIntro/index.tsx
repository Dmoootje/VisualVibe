import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { SectorMarquee } from "@/components/sectors";
import { sectorIntroConfig } from "./config/sectorIntro.config";

export default function SectorIntro() {
  return (
    <section className="py-12 sm:py-16 md:py-24">
      {/* Header row stays in the container; the marquee below runs full-bleed. */}
      <div className="container mx-auto px-4">
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
      </div>

      {/* Two-row marquee scrolling in opposite directions, full page width. */}
      <SectorMarquee />
    </section>
  );
}
