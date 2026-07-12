import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { realisatieCategories } from "@/data/realisatieCategories";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd } from "@/components/seo";
import { RealisatieCategoryGrid } from "@/components/realisaties/RealisatieCategoryGrid";

export const metadata: Metadata = {
  title: { absolute: `Realisaties | ${businessConfig.displayName}` },
  description:
    "Ontdek realisaties van VisualVibe in webdesign, SEO, fotografie, video, drone en FPV, 3D/VR/AR, podcasting en masterclasses.",
};

export default function RealisatiesHubPage() {
  return (
    <div className="min-h-screen text-white pt-24 pb-16 px-4">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Realisaties", path: "/realisaties" }]} />

      <div className="container mx-auto px-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#ff9a45]">
          Ons werk
        </p>
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
          Realisaties van VisualVibe
        </h1>
        <p className="mb-12 max-w-3xl text-lg leading-relaxed text-white/70">
          Hier bundelen we het werk dat we effectief voor klanten uitvoeren: van webdesign en SEO
          tot fotografie, video, drone en FPV, 3D/VR/AR, podcasts en masterclasses. Je ziet per
          project welke disciplines samenkomen.
        </p>

        <h2 className="mb-6 text-2xl font-bold">Ontdek ons werk per categorie</h2>
        <RealisatieCategoryGrid items={realisatieCategories} />

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-2xl font-bold">Een project in gedachten?</h2>
          <p className="max-w-xl text-white/65">
            Vertel ons wat je wilt maken. We bekijken welke diensten bij je project passen en werken
            een voorstel op maat uit.
          </p>
          <Link
            href="/offerte-aanvragen"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-3 font-medium text-white hover:from-red-600 hover:to-amber-600 transition-colors"
          >
            Bespreek je project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
