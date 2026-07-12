import { businessConfig } from "@/config/business.config";
import { LeadForm } from "@/components/forms/LeadForm";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";

export const metadata = pageMetadata({
  title: `Offerte aanvragen | ${businessConfig.displayName}`,
  description:
    "Vraag een vrijblijvende offerte aan bij VisualVibe voor webdesign, SEO, fotografie, videografie, drone of 3D/VR/AR.",
  path: "/offerte-aanvragen/",
});

export default function OfferteAanvragenPage() {
  return (
    <div className="min-h-screen text-white pt-24 pb-16">
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Offerte aanvragen", path: "/offerte-aanvragen" }]}
      />

      <div className="container mx-auto px-2.5 sm:px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Offerte aanvragen</h1>
        <p className="text-lg text-white/70 mb-10 max-w-2xl">
          Vertel ons kort over je project en we bezorgen je een vrijblijvend voorstel op maat - binnen de 2
          werkdagen.
        </p>

        <div className="max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <LeadForm variant="offerte" />
        </div>
      </div>
    </div>
  );
}
