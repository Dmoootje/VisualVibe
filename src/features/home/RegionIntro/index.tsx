import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getLocalizedRegionById, regions } from "@/data/regions";
import { regionIntroConfig } from "./config/regionIntro.config";
import { RegionMapCard } from "./components";

export default function RegionIntro({ locale = "nl" }: { locale?: string }) {
  const en = locale === "en";
  const localizedRegions = regions.map((region) =>
    getLocalizedRegionById(region.slug, en ? "en" : "nl")
  );
  const copy = en
    ? {
        title: "Based in Limburg, active across several regions",
        subtitle: "VisualVibe is based in Limburg, Belgium. Choose your region for local information, services and case studies.",
        ctaLabel: "View all regions",
      }
    : regionIntroConfig;
  return (
    <section className="home-deferred-section relative overflow-hidden py-12 sm:py-16 md:py-24">
      <div className="container relative z-10 mx-auto">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-12 md:flex-row md:items-end">
          <div>
            <h2 className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl">
              {copy.title}
            </h2>
            <p className="max-w-2xl text-base text-white/70 sm:text-lg">
              {copy.subtitle}
            </p>
          </div>
          <Link
            href={regionIntroConfig.ctaHref}
            className="inline-flex items-center gap-2 whitespace-nowrap text-white/80 transition-colors hover:text-amber-400"
          >
            {copy.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {localizedRegions.map((region) => (
            <RegionMapCard key={region.slug} region={region} locale={en ? "en" : "nl"} />
          ))}
        </div>
      </div>
    </section>
  );
}
