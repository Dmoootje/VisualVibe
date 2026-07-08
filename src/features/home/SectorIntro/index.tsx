import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { sectors } from "@/data/sectors";
import { sectorIntroConfig } from "./config/sectorIntro.config";
import { SectorChip } from "./components";

export default function SectorIntro() {
  return (
    <section className="py-12 px-4 sm:py-16 md:py-24 bg-black">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              {sectorIntroConfig.title}
            </h2>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl">
              {sectorIntroConfig.subtitle}
            </p>
          </div>
          <Link
            href={sectorIntroConfig.ctaHref}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors whitespace-nowrap"
          >
            {sectorIntroConfig.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          {sectors.map((sector) => (
            <SectorChip key={sector.slug} sector={sector} />
          ))}
        </div>
      </div>
    </section>
  );
}
