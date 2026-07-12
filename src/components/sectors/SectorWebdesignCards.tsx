"use client";

import { useState } from "react";
import { imageKey, type WebdesignProject } from "@/data/webdesignShowcase";
import type { WebdesignImages } from "@/lib/firestore/webdesignImages";
import { ShowcaseImage } from "@/components/webdesign/ShowcaseImage";
import { RealisatieModal } from "@/components/webdesign/RealisatieModal";

const ArrowUpRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

/**
 * Sector-page webdesign cases: the realisaties card style (rwcard), opening the
 * shared RealisatieModal popup. Client-side only for the open/close state; the
 * surrounding section (heading, intro) stays server-rendered.
 */
export function SectorWebdesignCards({
  projects,
  images,
}: {
  projects: WebdesignProject[];
  images: WebdesignImages;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = openId ? projects.find((p) => p.id === openId) ?? null : null;
  const thumb = (c: WebdesignProject) => images[imageKey(c.id, "thumb")] ?? images[imageKey(c.id, "1")];

  return (
    <>
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((c, i) => (
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
              <span className="rwcard-open absolute right-3 top-3 z-[3] flex h-8 w-8 items-center justify-center rounded-[9px] border border-white/[0.14] bg-[rgba(10,10,10,0.6)] backdrop-blur">
                <ArrowUpRight />
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              {c.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/[0.09] bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-semibold text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <h3 className="font-sora mb-[7px] text-[19px] font-bold text-white">{c.name}</h3>
              <p className="mb-[18px] text-[13.5px] leading-[1.55] text-white/55">{c.teaser}</p>
              <span className="rwcard-go mt-auto inline-flex items-center gap-[7px] font-mono text-[11.5px] font-bold tracking-[0.08em] text-white/75">
                BEKIJK REALISATIE
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </div>
          </button>
        ))}
      </div>

      {open && <RealisatieModal project={open} images={images} onClose={() => setOpenId(null)} />}
    </>
  );
}
