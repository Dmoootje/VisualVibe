import type { Service } from "@/types";
import { PageAmbient } from "@/components/ui";
import { CTASection, ProcessSteps, ServiceFaqCombine } from "@/components/sections";
import { FotografieHero } from "./FotografieHero";
import { FotografieGalerijen } from "./FotografieGalerijen";

/**
 * Bespoke Fotografie service page (design_handoff_fotografie_service): one
 * continuous background with the interactive viewfinder hero, the galerijen
 * bento + lightbox, then the werkproces, FAQ, gerelateerde diensten en CTA.
 */
export function FotografieService({
  service,
  relatedServices,
}: {
  service: Service;
  relatedServices: Service[];
}) {
  return (
    <div className="relative overflow-hidden">
      <PageAmbient />

      <div className="relative z-10">
        <FotografieHero />
        <FotografieGalerijen />

        {/* Hoe we werken */}
        {service.process.length > 0 && (
          <section className="relative py-12">
            <div className="container mx-auto px-4">
              <h2 className="font-sora mb-8 text-[28px] font-extrabold tracking-[-0.025em] text-white sm:text-[34px]">
                Hoe we werken
              </h2>
              <ProcessSteps steps={service.process} />
            </div>
          </section>
        )}

        {/* Veelgestelde vragen (links) + Combineer fotografie met (rechts). */}
        <ServiceFaqCombine faqs={service.faqs} combineWith="fotografie" relatedServices={relatedServices} />

        <CTASection
          className="bg-transparent"
          title="Interesse in fotografie?"
          description="Vraag een vrijblijvende offerte aan en ontvang binnen de 2 werkdagen een reactie."
        />
      </div>
    </div>
  );
}
