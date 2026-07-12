import { sectors } from "@/data/sectors";
import { businessConfig } from "@/config/business.config";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SectorCard } from "@/components/sectors";

export const metadata = pageMetadata({
  title: `Sectoren | ${businessConfig.displayName}`,
  description: "VisualVibe helpt bedrijven in uiteenlopende sectoren met webdesign, fotografie, video en SEO.",
  path: "/sectoren/",
});

export default function SectorenHubPage() {
  return (
    <div className="min-h-screen px-4 pb-20 pt-28 text-white">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Sectoren", path: "/sectoren" }]} />

      <div className="container mx-auto">
        {/* Centered header */}
        <div className="mx-auto mb-[52px] max-w-[640px] text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-5 bg-[#ff7500]" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ff7500]">Overzicht</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Sectoren waarin wij uitblinken
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
            Tien werelden, één doel: jouw merk laten opvallen met werk dat past bij jouw publiek.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
          {sectors.map((sector) => (
            <SectorCard key={sector.slug} sector={sector} />
          ))}
        </div>
      </div>
    </div>
  );
}
