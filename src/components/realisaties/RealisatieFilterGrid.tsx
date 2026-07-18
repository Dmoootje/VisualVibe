"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { HubProject } from "@/lib/realisaties/hubData";
import type { SupportedLocale } from "@/i18n/locales";
import { getLocalizedRealisatieCategoryById } from "@/data/realisatieCategories";

const PAGE_SIZE = 9;

export type HubFilterOption = { slug: string; label: string };

/**
 * "Recent werk": client-side filtering over de serialiseerbare projectdataset
 * die de servercomponent doorgeeft. Alleen dit eiland is client-side; de rest
 * van de pagina blijft server-rendered. Context-ankerstubs (#werk-<slug>)
 * laten de contexttegels elders op de pagina het grid filteren via de hash.
 */
export function RealisatieFilterGrid({
  projects,
  disciplines,
  contexts,
  locale = "nl",
}: {
  projects: HubProject[];
  /** Primaire filteropties (alleen categorieën die echt in de data zitten). */
  disciplines: HubFilterOption[];
  /** Secundaire filteropties (alleen contexten met echte projecten). */
  contexts: HubFilterOption[];
  locale?: SupportedLocale;
}) {
  const [discipline, setDiscipline] = useState<string>("alles");
  const [context, setContext] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Contexttegels linken naar #werk-<context>; pas het filter toe wanneer de
  // hash daarop wijst (bij klik én bij laden met hash). Na het toepassen wissen
  // we de hash weer (replaceState): anders vuurt hashchange niet bij een tweede
  // klik op dezelfde tegel en zou die stil niets doen.
  useEffect(() => {
    const applyHash = () => {
      const match = window.location.hash.match(/^#werk-([a-z-]+)$/);
      if (!match) return;
      const slug = match[1];
      if (contexts.some((c) => c.slug === slug)) {
        setDiscipline("alles");
        setContext(slug);
        setVisible(PAGE_SIZE);
      }
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [contexts]);

  const filtered = projects.filter(
    (p) =>
      (discipline === "alles" || p.categorySlug === discipline) &&
      (context === null || p.contexts.includes(context)),
  );
  const shown = filtered.slice(0, visible);

  // Actieve chip: zwart op brand-oranje (ruim voldoende contrast; wit op de
  // oranje gradient haalt WCAG AA niet op deze tekstgrootte).
  const chip = (active: boolean) =>
    `inline-flex items-center rounded-[10px] border px-3.5 py-2 text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500] ${
      active
        ? "border-transparent bg-[#ff7500] text-black shadow-[0_10px_24px_-12px_rgba(255,90,0,0.8)]"
        : "border-white/10 bg-white/[0.03] text-white/[0.62] hover:border-[rgba(255,122,0,0.4)] hover:text-white"
    }`;

  return (
    <div>
      {/* Ankerstubs voor de contexttegels (native anchor + hashfilter). */}
      {contexts.map((c) => (
        <div key={c.slug} id={`werk-${c.slug}`} className="scroll-mt-32" />
      ))}

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setDiscipline("alles");
            setVisible(PAGE_SIZE);
          }}
          aria-pressed={discipline === "alles"}
          className={chip(discipline === "alles")}
        >
          {locale === "en" ? "All" : "Alles"}
        </button>
        {disciplines.map((d) => (
          <button
            key={d.slug}
            type="button"
            onClick={() => {
              setDiscipline(d.slug);
              setVisible(PAGE_SIZE);
            }}
            aria-pressed={discipline === d.slug}
            className={chip(discipline === d.slug)}
          >
            {d.label}
          </button>
        ))}
      </div>

      {contexts.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/40">
            Context
          </span>
          <button
            type="button"
            onClick={() => setContext(null)}
            aria-pressed={context === null}
            className={chip(context === null)}
          >
            {locale === "en" ? "All" : "Alle"}
          </button>
          {contexts.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => {
                setContext(context === c.slug ? null : c.slug);
                setVisible(PAGE_SIZE);
              }}
              aria-pressed={context === c.slug}
              className={chip(context === c.slug)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Screenreader-feedback op filteracties (visueel onzichtbaar). */}
      <p role="status" className="sr-only">
        {locale === "en" ? `${filtered.length} case ${filtered.length === 1 ? "study" : "studies"} shown` : filtered.length === 1 ? "1 realisatie getoond" : `${filtered.length} realisaties getoond`}
      </p>

      {shown.length > 0 ? (
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((project) => (
            <Link
              key={project.id}
              href={`/realisaties/${getLocalizedRealisatieCategoryById(project.categorySlug, locale).slug}`}
              className="group flex flex-col overflow-hidden rounded-[17px] border border-white/[0.09] bg-white/[0.02] transition-colors hover:border-[rgba(255,122,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500]"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.06] bg-[#141210]">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <span className="absolute left-3.5 top-3.5 inline-flex items-center rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,7,6,.62)] px-[11px] py-1.5 font-mono text-[10px] font-bold tracking-[0.06em] text-[#FF9A45] backdrop-blur">
                  {project.discipline}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-sora text-[17px] font-bold text-white">{project.title}</h3>
                {project.description && (
                  <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-white/55">
                    {project.description}
                  </p>
                )}
                <span className="mt-auto pt-4 inline-flex items-center gap-[7px] font-mono text-[11px] font-bold tracking-[0.06em] text-white/75">
                  {locale === "en" ? "VIEW CASE STUDY" : "BEKIJK DE REALISATIE"}
                  <ArrowRight className="h-3.5 w-3.5 text-[#FF9A45] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-[16px] border border-white/[0.09] bg-white/[0.02] px-6 py-10 text-center text-[15px] text-white/55">
          {locale === "en" ? "No projects match this combination. Choose another discipline or context." : "Geen projecten in deze combinatie. Kies een andere discipline of context."}
        </p>
      )}

      {/* Blijft gemount (aria-disabled) zodra alles geladen is, zodat de
          toetsenbordfocus niet naar <body> valt bij de laatste klik. */}
      {filtered.length > PAGE_SIZE && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (filtered.length > visible) setVisible((v) => v + PAGE_SIZE);
            }}
            aria-disabled={filtered.length <= visible}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/[0.14] px-6 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500] ${
              filtered.length > visible
                ? "text-white/85 hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white"
                : "cursor-default text-white/35"
            }`}
          >
            {filtered.length > visible ? (locale === "en" ? "Load more case studies" : "Meer realisaties laden") : (locale === "en" ? "All case studies loaded" : "Alle realisaties geladen")}
          </button>
        </div>
      )}
    </div>
  );
}
