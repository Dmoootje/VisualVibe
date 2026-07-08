import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { serviceCategories } from "@/data/serviceCategories";
import { services } from "@/data/services";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { BreadcrumbJsonLd } from "@/components/seo";

export const metadata: Metadata = {
  title: {
    absolute: "Diensten van VisualVibe: webdesign, fotografie, video, drone, SEO en podcasting",
  },
  description:
    "Ontdek alle diensten van VisualVibe: webdesign, SEO, fotografie, videografie, drone/FPV, 3D/VR/AR en podcasting voor bedrijven in Limburg.",
};

export default function DienstenPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Diensten", path: "/diensten" }]} />

      <div className="container mx-auto">
        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Creatieve diensten voor bedrijven die beter zichtbaar willen zijn
          </h1>
          <p className="text-lg text-white/70">
            Van website tot beeldmateriaal: VisualVibe biedt alle diensten die je nodig hebt om online én lokaal
            zichtbaar te worden — onder één dak, afgestemd op elkaar.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((category) => {
            const service = services.find((s) => s.slug === category.slug);
            return (
              <ServiceCard
                key={category.slug}
                category={category}
                excerpt={service?.excerpt ?? ""}
              />
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-2xl font-bold">Niet zeker welke dienst je nodig hebt?</h2>
          <p className="max-w-xl text-white/70">
            Vraag een vrijblijvende offerte aan — we denken mee over de beste aanpak voor jouw project.
          </p>
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
