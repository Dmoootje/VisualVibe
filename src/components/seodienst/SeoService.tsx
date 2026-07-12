import { Link } from "@/i18n/navigation";
import { ArrowRight, Check } from "lucide-react";
import type { Service } from "@/types";
import { seoSubdiensten } from "@/data/seoSubdiensten";
import { Container, PageAmbient } from "@/components/ui";
import { CTASection, ProcessSteps, ServiceFaqCombine } from "@/components/sections";
import { ServiceRelatedPosts } from "@/components/sections/ServiceRelatedPosts";
import { SubdienstenGrid } from "@/components/subdiensten";
import { SectorMarquee } from "@/components/sectors";
import { SeoHero } from "./SeoHero";
import { SeoCases, type SeoCaseItem } from "./SeoCases";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
      <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#FF9A45]" />
      {children}
    </p>
  );
}

// Wat elke SEO diensten-tak omvat (checklist bij het uitleg-blok).
const INCLUDED = [
  "Lokale SEO en Google Business Profiel",
  "Technische SEO en Core Web Vitals",
  "SEO-copywriting en zoekwoordenonderzoek",
  "AI SEO (AEO/GEO) voor ChatGPT en AI Overviews",
  "Interne linkstructuur en autoriteit",
  "Maandelijkse rapportage en bijsturing",
];

const WHY = [
  {
    title: "Google én AI-zoekmachines",
    text: "We optimaliseren niet alleen voor klassieke Google-resultaten, maar ook voor ChatGPT, Perplexity en Google AI Overviews (GEO).",
  },
  {
    title: "Lokaal sterk in Limburg",
    text: "Als mediabureau uit Limburg kennen we de lokale markt. Lokale SEO en een sterk Google Business Profiel staan centraal.",
  },
  {
    title: "Meetbaar en eerlijk",
    text: "Geen vage beloftes: je krijgt heldere rapportage over posities, verkeer en Core Web Vitals, met bijsturing waar nodig.",
  },
];

/**
 * Volledige, SEO-geoptimaliseerde SEO-dienstenpagina (design_handoff_seo_service
 * + uitbreiding): één doorlopende achtergrond met transparante secties, de
 * geanimeerde rankings-hero, SEO-realisaties, een uitleg-blok voor "SEO
 * diensten", de subdiensten als ghost-glyph kaarten, sector-pills, het
 * werkproces, een uitgebreide FAQ en een CTA.
 */
export function SeoService({
  service,
  seoItems,
  images,
  relatedServices,
  crossLinks,
}: {
  service: Service;
  seoItems: SeoCaseItem[];
  images: import("@/lib/firestore/webdesignImages").WebdesignImages;
  relatedServices: Service[];
  /** Gedeelde cross-link-secties (realisaties, regio's) vanuit de dienstpagina. */
  crossLinks?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden">
      {/* Eén doorlopende, paginabrede achtergrond; alle secties zijn transparant. */}
      <PageAmbient />

      <div className="relative z-10">
        <SeoHero />
        <SeoCases items={seoItems} images={images} />

        {/* Wat zijn SEO diensten? - direct-antwoord blok (GEO + SEO). */}
        <section className="relative py-14 sm:py-16">
          <div className="container mx-auto grid items-start gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <Eyebrow>SEO diensten uitgelegd</Eyebrow>
              <h2 className="font-sora text-[28px] font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[34px]">
                Wat zijn SEO diensten?
              </h2>
              <p className="mt-4 text-[16.5px] leading-[1.7] text-white/70">
                <strong className="font-semibold text-white">
                  SEO diensten zijn alle diensten die je website hoger laten scoren in zoekmachines
                </strong>
                , van technische optimalisatie en content tot lokale vindbaarheid. Het doel: gevonden
                worden door mensen die actief op zoek zijn naar wat jij aanbiedt, zonder telkens voor
                advertenties te betalen.
              </p>
              <p className="mt-4 text-[16.5px] leading-[1.7] text-white/60">
                Bij VisualVibe combineren we klassieke SEO met GEO (Generative Engine Optimization),
                zodat je niet alleen in Google rankt maar ook geciteerd wordt door AI-zoekmachines
                zoals ChatGPT, Perplexity en Google AI Overviews. Zo blijft je KMO in Limburg
                vindbaar, ook nu het zoekgedrag verschuift naar AI.
              </p>
              <p className="mt-4 text-[16.5px] leading-[1.7] text-white/60">
                Elke opdracht start met een SEO-audit. Op basis daarvan bepalen we welke SEO diensten
                het meeste effect hebben, van technische fixes tot content en lokale optimalisatie.
              </p>
            </div>

            <div className="rounded-[20px] border border-white/[0.09] bg-white/[0.02] p-7 sm:p-8">
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
                Wat onze SEO diensten omvatten
              </div>
              <ul className="mt-5 flex flex-col gap-3.5">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.14)]">
                      <Check className="h-3 w-3 text-[#FF9A45]" strokeWidth={3} />
                    </span>
                    <span className="text-[14.5px] font-medium leading-snug text-white/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Onze SEO diensten - subdiensten als geanimeerde ghost-glyph kaarten. */}
        <section className="relative py-14 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div className="max-w-xl">
                <Eyebrow>Onze SEO diensten</Eyebrow>
                <h2 className="font-sora text-[28px] font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[34px]">
                  Vijf SEO diensten, één strategie
                </h2>
                <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-white/60">
                  Van lokale vindbaarheid tot AI-zoekmachines: elke SEO-dienst versterkt de andere.
                  Klik door voor de details per dienst.
                </p>
              </div>
              <Link
                href={service.slug === "seo" ? "/offerte-aanvragen" : "/diensten/seo"}
                className="inline-flex items-center gap-2 whitespace-nowrap self-start rounded-xl border border-white/[0.14] px-[22px] py-3 text-sm font-bold text-white/85 transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white"
              >
                Vraag een SEO-offerte
                <ArrowRight className="h-[15px] w-[15px]" />
              </Link>
            </div>
            <SubdienstenGrid services={seoSubdiensten} />
          </div>
        </section>

        {/* Voor welke sectoren - sector-pills. */}
        <section className="relative overflow-hidden py-14 sm:py-16">
          <div className="container mx-auto mb-8 px-4">
            <Eyebrow>Voor wie</Eyebrow>
            <h2 className="font-sora text-[28px] font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[34px]">
              SEO diensten voor elke sector
            </h2>
            <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-white/60">
              Van horeca en bouw tot retail, vastgoed en KMO: we vertalen SEO naar de zoektermen en
              klanten van jouw sector.
            </p>
          </div>
          <SectorMarquee />
        </section>

        {/* Hoe we werken. */}
        {service.process.length > 0 && (
          <section className="relative py-14 sm:py-16">
            <div className="container mx-auto px-4">
              <Eyebrow>Aanpak</Eyebrow>
              <h2 className="mb-8 font-sora text-[28px] font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[34px]">
                Hoe onze SEO diensten werken
              </h2>
              <ProcessSteps steps={service.process} />
            </div>
          </section>
        )}

        {/* Uit de kennisbank: SEO/GEO-artikels (interne links + GEO-surface). */}
        <ServiceRelatedPosts
          serviceSlug="seo"
          heading="Verdiep je in SEO en GEO"
          intro="Praktische gidsen over lokale SEO, technische SEO en zichtbaarheid in AI-zoekmachines."
        />

        {/* Cross-links naar realisaties en regio-hubs (interne-link-regels). */}
        {crossLinks}

        {/* Veelgestelde vragen (links) + Combineer SEO met (rechts). */}
        <ServiceFaqCombine
          faqs={service.faqs}
          faqHeading="Veelgestelde vragen over SEO diensten"
          combineWith="SEO"
          relatedServices={relatedServices}
        />

        <CTASection
          className="bg-transparent"
          title="Klaar om beter vindbaar te worden?"
          description="Vraag een vrijblijvende offerte voor onze SEO diensten aan en ontvang binnen de 2 werkdagen een reactie."
        />
      </div>
    </div>
  );
}
