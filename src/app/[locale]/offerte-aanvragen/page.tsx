import type { Metadata } from "next";
import { businessConfig } from "@/config/business.config";
import { LeadForm } from "@/components/forms/LeadForm";
import { BreadcrumbJsonLd } from "@/components/seo";

export const metadata: Metadata = {
  title: { absolute: `Offerte aanvragen | ${businessConfig.displayName}` },
  description:
    "Vraag een vrijblijvende offerte aan bij VisualVibe voor webdesign, SEO, fotografie, videografie, drone of 3D/VR/AR.",
};

export default function OfferteAanvragenPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Offerte aanvragen", path: "/offerte-aanvragen" }]}
      />

      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Offerte aanvragen</h1>
        <p className="text-lg text-white/70 mb-10">
          Vertel ons kort over je project en we bezorgen je een vrijblijvend voorstel op maat - binnen de 2
          werkdagen.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <LeadForm variant="offerte" />
        </div>
      </div>
    </div>
  );
}
