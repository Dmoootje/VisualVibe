import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd } from "@/components/seo";

export const metadata: Metadata = {
  title: { absolute: `Over ons | ${businessConfig.displayName}` },
  description: `Maak kennis met ${businessConfig.displayName}, het creatief mediabureau uit Limburg.`,
};

export default function OverOnsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Over ons", path: "/over-ons" }]} />

      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Over VisualVibe</h1>
        <p className="text-lg text-white/70 mb-6">
          VisualVibe is het creatief mediabureau van {businessConfig.address.addressLocality}, Limburg.
          We combineren webdesign, SEO, fotografie, videografie, drone/FPV, 3D/VR/AR en podcasting onder één
          dak — zodat KMO's in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg niet met verschillende
          bureaus hoeven te schakelen voor hun online uitstraling.
        </p>
        <p className="text-lg text-white/70 mb-12">
          Of het nu gaat om een nieuwe website, professionele bedrijfsfotografie, een pakkende bedrijfsvideo of
          een sterke lokale SEO-strategie: we denken mee vanaf de eerste kennismaking tot de oplevering.
        </p>

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-2xl font-bold">Laten we kennismaken</h2>
          <Link
            href="/offerte-aanvragen"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-3 font-medium text-white hover:from-red-600 hover:to-amber-600 transition-colors"
          >
            Offerte aanvragen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
