import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { sectors } from "@/data/sectors";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd } from "@/components/seo";

export const metadata: Metadata = {
  title: { absolute: `Sectoren | ${businessConfig.displayName}` },
  description: "VisualVibe helpt bedrijven in uiteenlopende sectoren met webdesign, fotografie, video en SEO.",
};

export default function SectorenHubPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Sectoren", path: "/sectoren" }]} />

      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Voor elke sector een aanpak op maat</h1>
        <p className="text-lg text-white/70 mb-12">
          Elke sector heeft eigen uitdagingen. Ontdek hoe we bedrijven in jouw sector helpen.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {sectors.map((sector) => (
            <Link
              key={sector.slug}
              href={`/sectoren/${sector.slug}`}
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors"
            >
              <span className="font-medium group-hover:text-amber-400 transition-colors">{sector.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
