import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { cases } from "@/data/cases";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd } from "@/components/seo";

export const metadata: Metadata = {
  title: { absolute: `Realisaties | ${businessConfig.displayName}` },
  description: "Bekijk projecten van VisualVibe: webdesign, fotografie, video, drone en 3D/VR/AR.",
};

export default function RealisatiesHubPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Realisaties", path: "/realisaties" }]} />

      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Realisaties</h1>
        <p className="text-lg text-white/70 mb-12">
          We werken aan een overzicht van onze projecten. Benieuwd naar voorbeelden van ons werk in de
          tussentijd? Neem gerust contact op.
        </p>

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-2xl font-bold">Vraag je project op maat aan</h2>
          <Link
            href="/offerte-aanvragen"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-3 font-medium text-white hover:from-red-600 hover:to-amber-600 transition-colors"
          >
            Offerte aanvragen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {cases.length > 0 ? null : (
          <p className="mt-8 text-center text-sm text-white/40">Realisaties volgen binnenkort.</p>
        )}
      </div>
    </div>
  );
}
