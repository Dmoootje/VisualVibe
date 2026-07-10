import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { realisatieCategories } from "@/data/realisatieCategories";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd } from "@/components/seo";
import { RealisatieCategoryGrid } from "@/components/realisaties/RealisatieCategoryGrid";

export const metadata: Metadata = {
  title: { absolute: `Realisaties | ${businessConfig.displayName}` },
  description: "Bekijk projecten van VisualVibe: webdesign, fotografie, video, drone en 3D/VR/AR.",
};

export default function RealisatiesHubPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Realisaties", path: "/realisaties" }]} />

      <div className="container mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Realisaties</h1>
        <p className="text-lg text-white/70 mb-12 max-w-2xl">
          We werken aan een overzicht van onze projecten. Benieuwd naar voorbeelden van ons werk in de
          tussentijd? Neem gerust contact op.
        </p>

        <h2 className="mb-6 text-2xl font-bold">Categorieën</h2>
        <RealisatieCategoryGrid items={realisatieCategories} />

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-2xl font-bold">Vraag je project op maat aan</h2>
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
