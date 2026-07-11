import { Link } from "@/i18n/navigation";
import type { Service } from "@/types";
import { serviceHrefBySlug } from "@/data/services";
import { PageAmbient } from "@/components/ui";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CTASection, ProcessSteps } from "@/components/sections";
import { FotografieHero } from "./FotografieHero";
import { FotografieGalerijen } from "./FotografieGalerijen";
import { FiIcon } from "./FiIcon";

// service slug -> fi-icon for the related-diensten chips.
const REL_ICON: Record<string, string> = {
  videografie: "video",
  "drone-fpv": "drone",
  webdesign: "web",
  seo: "aperture",
  podcasting: "aperture",
};

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

        {/* FAQ */}
        {service.faqs.length > 0 && (
          <section className="relative py-12">
            <div className="mx-auto max-w-[900px]">
              <h2 className="font-sora mb-7 text-[28px] font-extrabold tracking-[-0.025em] text-white sm:text-[34px]">
                Veelgestelde vragen
              </h2>
              <Accordion type="single" collapsible>
                {service.faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-white/70">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}

        {/* Gerelateerde diensten */}
        {relatedServices.length > 0 && (
          <section className="relative py-10">
            <div className="container mx-auto px-4">
              <h2 className="font-sora mb-5 text-[26px] font-extrabold tracking-[-0.02em] text-white">
                Gerelateerde diensten
              </h2>
              <div className="flex flex-wrap gap-3">
                {relatedServices.map((related) => (
                  <Link
                    key={related.slug}
                    href={serviceHrefBySlug(related.slug)}
                    className="relChip inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.1)]"
                  >
                    <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-[rgba(255,122,0,0.22)] bg-[rgba(255,122,0,0.1)] text-[#FF9A45]">
                      <FiIcon id={REL_ICON[related.slug] ?? "aperture"} size={16} strokeWidth={1.7} />
                    </span>
                    {related.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CTASection
          className="bg-transparent"
          title="Interesse in fotografie?"
          description="Vraag een vrijblijvende offerte aan en ontvang binnen de 2 werkdagen een reactie."
        />
      </div>
    </div>
  );
}
