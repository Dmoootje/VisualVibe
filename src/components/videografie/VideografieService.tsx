import { Link } from "@/i18n/navigation";
import type { Service } from "@/types";
import { serviceHref, serviceHrefBySlug } from "@/data/services";
import { youtubeChannelUrl } from "@/config/videografie.config";
import type { VideoItem } from "@/lib/youtube";
import { PageAmbient } from "@/components/ui";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CTASection } from "@/components/sections";
import { VideografieGallery } from "./VideografieGallery";
import { ArrowRight, ArrowDown, RelIcon } from "./icons";

/**
 * Bespoke Videografie service page (design_handoff_videografie_service): a
 * cinematic video-player hero, a YouTube-fed gallery with a popup lightbox, then
 * the diensten-overzicht, werkproces, FAQ, gerelateerde diensten en CTA - all in
 * the VisualVibe card system with staggered entrance + hover motion.
 */
export function VideografieService({
  service,
  subServices,
  relatedServices,
  videos,
  filters,
}: {
  service: Service;
  subServices: Service[];
  relatedServices: Service[];
  videos: VideoItem[];
  filters: string[];
}) {
  return (
    <div className="relative overflow-hidden">
      <PageAmbient />

      <div className="relative z-10">
        {/* HERO copy (server) + player + gallery + lightbox (client island) */}
        <VideografieGallery videos={videos} filters={filters} channelUrl={youtubeChannelUrl}>
          <nav className="mb-[22px] flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.04em] text-white/45">
            <Link href="/diensten" className="transition-colors hover:text-white">
              Diensten
            </Link>
            <span className="text-white/25">/</span>
            <span className="text-[#FF9A45]">Videografie</span>
          </nav>
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.1)] px-[15px] py-2 font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#FF9A45]">
            <span className="vvw-liveDot h-[7px] w-[7px] rounded-full bg-[#FF7A00]" />
            Bewegend beeld
          </div>
          <h1 className="font-sora mb-[22px] text-[clamp(46px,14vw,64px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white lg:text-[64px]">
            Videografie
          </h1>
          <p className="mb-[34px] max-w-[500px] text-[19px] leading-[1.6] text-white/65">{service.intro}</p>
          <div className="flex flex-wrap gap-3.5">
            <Link
              href="/offerte-aanvragen"
              className="heroBtn inline-flex items-center gap-2.5 rounded-xl px-7 py-[15px] text-base font-bold text-white shadow-[0_16px_40px_-14px_rgba(255,90,0,0.85)] transition-transform hover:-translate-y-0.5"
              style={{ background: "linear-gradient(90deg,#FF3B2E,#FF7A00)" }}
            >
              Offerte aanvragen <ArrowRight size={17} />
            </Link>
            <a
              href="#video-gallery"
              className="heroBtn inline-flex items-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.05] px-7 py-[15px] text-base font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Bekijk video&apos;s <ArrowDown size={16} />
            </a>
          </div>
        </VideografieGallery>

        {/* DIENSTEN OVERZICHT */}
        {subServices.length > 0 && (
          <section className="container relative z-[2] mx-auto px-4 pb-5 pt-8">
            <h2 className="font-sora mb-7 text-[28px] font-extrabold tracking-[-0.025em] text-white sm:text-[34px]">
              Videografie diensten overzicht
            </h2>
            <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
              {subServices.map((sub, i) => (
                <Link
                  key={sub.slug}
                  href={serviceHref(sub)}
                  style={{ ["--i" as string]: i } as React.CSSProperties}
                  className="vvw-caseRow vg-ovrow flex items-center gap-4 rounded-[14px] border border-white/[0.08] bg-white/[0.02] px-[22px] py-5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="font-sora block text-base font-bold text-white">{sub.title}</span>
                    <span className="mt-1 block text-[13.5px] leading-[1.5] text-white/55">{sub.excerpt}</span>
                  </span>
                  <span className="vg-ovar flex-none text-white/40">
                    <ArrowRight size={18} strokeWidth={2.2} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* HOE WE WERKEN */}
        {service.process.length > 0 && (
          <section className="container relative z-[2] mx-auto px-4 pb-5 pt-8">
            <h2 className="font-sora mb-7 text-[28px] font-extrabold tracking-[-0.025em] text-white sm:text-[34px]">
              Hoe we werken
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {service.process.map((stepItem, i) => {
                const n = String(i + 1).padStart(2, "0");
                return (
                  <div
                    key={stepItem.title}
                    style={{ ["--i" as string]: i } as React.CSSProperties}
                    className="vvw-caseRow vg-step relative flex min-h-[200px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-[22px]"
                  >
                    <span aria-hidden="true" className="font-sora pointer-events-none absolute right-3.5 top-2.5 text-[60px] font-extrabold leading-none text-white/[0.04]">
                      {n}
                    </span>
                    <span
                      className="font-mono flex h-[42px] w-[42px] items-center justify-center rounded-[11px] text-[15px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(255,90,0,0.8)]"
                      style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}
                    >
                      {n}
                    </span>
                    <div className="mt-auto pt-6">
                      <div className="font-sora mb-[7px] text-[18px] font-bold text-white">{stepItem.title}</div>
                      <div className="text-[13.5px] leading-[1.55] text-white/55">{stepItem.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* FAQ */}
        {service.faqs.length > 0 && (
          <section className="relative z-[2] py-12">
            <div className="container mx-auto max-w-[900px] px-4">
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

        {/* GERELATEERDE DIENSTEN */}
        {relatedServices.length > 0 && (
          <section className="container relative z-[2] mx-auto px-4 py-8">
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
                    <RelIcon slug={related.slug} size={16} />
                  </span>
                  {related.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        <CTASection
          className="bg-transparent"
          title="Interesse in videografie?"
          description="Vraag een vrijblijvende offerte aan en ontvang binnen de 2 werkdagen een reactie."
        />
      </div>
    </div>
  );
}
