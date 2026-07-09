import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { MapPin } from "lucide-react";
import { regions } from "@/data/regions";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd } from "@/components/seo";

export const metadata: Metadata = {
  title: { absolute: `Regio's | ${businessConfig.displayName}` },
  description:
    "VisualVibe is actief in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg. Bekijk onze regio's.",
};

export default function RegioHubPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Regio", path: "/regio" }]} />

      <div className="container mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">In welke regio's zijn we actief?</h1>
        <p className="text-lg text-white/70 mb-12 max-w-2xl">
          Limburg is onze thuisregio. Van daaruit werken we ook voor bedrijven in Vlaanderen, Antwerpen en
          Nederlands-Limburg.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {regions.map((region) => (
            <Link
              key={region.slug}
              href={`/regio/${region.slug}`}
              className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
            >
              <span className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wide">
                <MapPin className="h-4 w-4" />
                {region.type === "province" ? "Thuisregio" : "Regio"}
              </span>
              <span className="text-xl font-semibold group-hover:text-amber-400 transition-colors">
                {region.title}
              </span>
              <p className="text-sm text-white/70">{region.intro}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
