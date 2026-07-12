"use client";

import { useState } from "react";
import { imageKey, type WebdesignProject } from "@/data/webdesignShowcase";
import type { WebdesignImages } from "@/lib/firestore/webdesignImages";
import { ShowcaseImage } from "./ShowcaseImage";
import { RealisatieModal } from "./RealisatieModal";

const ArrowUpRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

/** Realisatie-showcase: a grid of project cards. Clicking a card opens a modal
 * with the screenshots and what we delivered. Images are admin-managed. */
export function WebdesignShowcase({
  projects,
  images,
}: {
  projects: WebdesignProject[];
  images: WebdesignImages;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = openId ? projects.find((p) => p.id === openId) ?? null : null;
  const img = (c: WebdesignProject, slot: "thumb" | "1" | "2" | "3" | "4") => images[imageKey(c.id, slot)];

  return (
    <section id="showcase" className="relative z-[2] bg-[#0a0a0a] pb-24 pt-6 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3.5 font-mono text-xs font-bold tracking-[0.18em] text-[#FF9A45]">REALISATIES</div>
            <h2 className="max-w-[620px] text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-4xl">
              Websites die we voor KMO&apos;s bouwden
            </h2>
          </div>
          <p className="max-w-[290px] text-[15px] leading-relaxed text-white/50">
            Klik een project open voor screenshots en wat we precies leverden.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setOpenId(c.id)}
              aria-label={`${c.name} openen`}
              className="vvw-caseRow group flex flex-col overflow-hidden rounded-[18px] border border-white/[0.09] bg-white/[0.02] text-left transition-colors duration-300 hover:border-[rgba(255,122,0,0.45)]"
              style={{ ["--i" as string]: i } as React.CSSProperties}
            >
              <div className="relative aspect-video w-full overflow-hidden border-b border-white/[0.06] bg-white/[0.03]">
                <ShowcaseImage
                  src={img(c, "thumb") ?? img(c, "1")}
                  alt={`${c.name} website`}
                  placeholder="Screenshot"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[rgba(10,10,10,0.55)] backdrop-blur">
                  <ArrowUpRight />
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                {c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/[0.09] bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-white/60">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{c.name}</h3>
                  {c.teaser && <p className="mt-1.5 text-sm leading-relaxed text-white/50">{c.teaser}</p>}
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-1 font-mono text-[11px] font-bold tracking-[0.1em] text-[#FF9A45]">
                  BEKIJK REALISATIE
                  <ArrowUpRight />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {open && <RealisatieModal project={open} images={images} onClose={() => setOpenId(null)} />}
    </section>
  );
}
