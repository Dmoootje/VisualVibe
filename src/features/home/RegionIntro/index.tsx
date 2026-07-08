import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { regions } from "@/data/regions";
import { regionIntroConfig } from "./config/regionIntro.config";
import { RegionCard } from "@/components/cards/RegionCard";

export default function RegionIntro() {
  return (
    <section className="py-12 px-4 sm:py-16 md:py-24 bg-black">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              {regionIntroConfig.title}
            </h2>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl">
              {regionIntroConfig.subtitle}
            </p>
          </div>
          <Link
            href={regionIntroConfig.ctaHref}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors whitespace-nowrap"
          >
            {regionIntroConfig.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((region) => (
            <RegionCard key={region.slug} region={region} />
          ))}
        </div>
      </div>
    </section>
  );
}
