import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { regions } from "@/data/regions";
import { regionIntroConfig } from "./config/regionIntro.config";
import { RegionMapCard } from "./components";

export default function RegionIntro() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-24">
      <div className="container relative z-10 mx-auto">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-12 md:flex-row md:items-end">
          <div>
            <h2 className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl">
              {regionIntroConfig.title}
            </h2>
            <p className="max-w-2xl text-base text-white/70 sm:text-lg">
              {regionIntroConfig.subtitle}
            </p>
          </div>
          <Link
            href={regionIntroConfig.ctaHref}
            className="inline-flex items-center gap-2 whitespace-nowrap text-white/80 transition-colors hover:text-amber-400"
          >
            {regionIntroConfig.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((region) => (
            <RegionMapCard key={region.slug} region={region} />
          ))}
        </div>
      </div>
    </section>
  );
}
