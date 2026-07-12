"use client";

import { useState } from "react";
import { imageKey, type WebdesignProject } from "@/data/webdesignShowcase";
import type { WebdesignImages } from "@/lib/firestore/webdesignImages";
import { ShowcaseImage } from "@/components/webdesign/ShowcaseImage";
import { RealisatieModal } from "@/components/webdesign/RealisatieModal";

export type SeoCaseItem = {
  project: WebdesignProject;
  badge: string;
  tags: string[];
  teaser: string;
};

/**
 * SEO-realisaties (design_handoff_seo_service): een grid van webdesign-projecten
 * met een SEO/GEO-badge. Een kaartklik opent de gedeelde realisatie-modal (op de
 * site blijven i.p.v. weglinken); de "Bekijk site"-knop in de modal linkt naar
 * de live site. Client-side enkel voor de modal-state.
 */
export function SeoCases({ items, images }: { items: SeoCaseItem[]; images: WebdesignImages }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = openId ? items.find((it) => it.project.id === openId)?.project ?? null : null;
  const thumb = (c: WebdesignProject) => images[imageKey(c.id, "thumb")] ?? images[imageKey(c.id, "1")];

  return (
    <section id="seo-cases" className="container relative z-[2] mx-auto px-2.5 sm:px-4 pb-24 pt-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 font-mono text-xs font-bold tracking-[0.18em] text-[#FF9A45]">
            SEO-REALISATIES
          </div>
          <h2 className="font-sora text-[34px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
            Websites die we lieten ranken
          </h2>
        </div>
        <p className="max-w-[300px] text-[15px] leading-[1.6] text-white/50 sm:mb-1.5">
          Projecten geoptimaliseerd voor Google én AI-zoekmachines (GEO).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ project: c, badge, tags, teaser }, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setOpenId(c.id)}
            aria-label={`${c.name} openen`}
            className="rwcard vvw-caseRow relative flex flex-col overflow-hidden rounded-[17px] border border-white/[0.09] bg-white/[0.02] text-left"
            style={{ ["--i" as string]: i } as React.CSSProperties}
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.06] bg-[#141210]">
              <div className="rwcard-img absolute inset-0">
                <ShowcaseImage
                  src={thumb(c)}
                  alt={`${c.name} website`}
                  placeholder="Screenshot"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <span
                className="absolute left-3 top-3 z-[3] inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.08em] text-[#0a0a0a] shadow-[0_6px_16px_-6px_rgba(255,90,0,0.8)]"
                style={{ background: "linear-gradient(90deg,#FFA23A,#FF7A00)" }}
              >
                {badge}
              </span>
              <span className="rwcard-open absolute right-3 top-3 z-[3] flex h-8 w-8 items-center justify-center rounded-[9px] border border-white/[0.14] bg-[rgba(10,10,10,0.6)] backdrop-blur">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-3 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/[0.09] bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-semibold text-white/60">
                    {t}
                  </span>
                ))}
              </div>
              <div className="font-sora mb-[7px] text-[19px] font-bold text-white">{c.name}</div>
              <p className="mb-[18px] text-[13.5px] leading-[1.55] text-white/55">{teaser}</p>
              <span className="rwcard-go mt-auto inline-flex items-center gap-[7px] font-mono text-[11.5px] font-bold tracking-[0.08em] text-white/75">
                BEKIJK REALISATIE
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </span>
            </div>
          </button>
        ))}
      </div>

      {open && <RealisatieModal project={open} images={images} onClose={() => setOpenId(null)} />}
    </section>
  );
}
