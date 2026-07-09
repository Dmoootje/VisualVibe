"use client";

import { useState } from "react";
import { webdesignProjects, imageKey } from "@/data/webdesignShowcase";
import type { WebdesignImages } from "@/lib/firestore/webdesignImages";
import { ShowcaseImage } from "./ShowcaseImage";

const Magnifier = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={2.4} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" strokeLinecap="round" /></svg>
);
const Check = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);

/** Animated realisatie-showcase: an accordion of real web projects. One open at
 * a time (first open by default). Images are admin-managed (passed in). */
export function WebdesignShowcase({ images }: { images: WebdesignImages }) {
  const [open, setOpen] = useState(0);

  return (
    <section id="showcase" className="relative z-[2] bg-[#0a0a0a] pb-24 pt-6 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3.5 font-mono text-xs font-bold tracking-[0.18em] text-[#FF9A45]">REALISATIES</div>
            <h2 className="max-w-[620px] text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-4xl">
              Websites die we voor KMO's bouwden
            </h2>
          </div>
          <p className="max-w-[290px] text-[15px] leading-relaxed text-white/50">
            Klik een project open voor screenshots en wat we precies leverden.
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          {webdesignProjects.map((c, i) => {
            const isOpen = open === i;
            const img = (slot: "thumb" | "1" | "2" | "3" | "4") => images[imageKey(c.id, slot)];
            return (
              <div key={c.id} className="vvw-caseRow" style={{ ["--i" as string]: i } as React.CSSProperties}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="vvw-caseHead flex w-full items-center gap-4 rounded-[18px] border p-5 text-left sm:gap-6"
                  style={{
                    borderColor: isOpen ? "rgba(255,122,0,.5)" : "rgba(255,255,255,.09)",
                    background: isOpen ? "rgba(255,122,0,.05)" : "rgba(255,255,255,.02)",
                  }}
                >
                  <span className="min-w-[34px] font-mono text-[15px] font-bold text-[#FF9A45]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xl font-bold text-white sm:text-[22px]">{c.name}</span>
                      <span className="inline-flex flex-wrap gap-1.5">
                        {c.tags.map((t) => (
                          <span key={t} className="rounded-full border border-white/[0.09] bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-white/60">
                            {t}
                          </span>
                        ))}
                      </span>
                    </div>
                    <div className="mt-1.5 text-sm text-white/50">{c.teaser}</div>
                  </div>
                  <span className="hidden h-[82px] w-[132px] flex-none overflow-hidden rounded-[11px] border border-white/[0.09] bg-white/[0.04] sm:block">
                    <ShowcaseImage src={img("thumb")} alt={`${c.name} thumbnail`} placeholder="Thumb" className="h-full w-full object-contain" />
                  </span>
                  <span
                    className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full border border-white/[0.14] transition-transform duration-[400ms]"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                  </span>
                </button>

                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-9 px-1 pb-2 pt-6 lg:grid-cols-[668px_1fr]">
                      {/* gallery */}
                      <div className="flex flex-col gap-3">
                        <div className="aspect-video w-full max-w-full overflow-hidden rounded-[13px] border border-white/[0.08]">
                          <ShowcaseImage src={img("1")} alt={`${c.name} hoofdscreenshot`} placeholder="Hoofdscreenshot" />
                        </div>
                        <div className="flex items-start gap-4 overflow-x-auto pb-1">
                          <Device label="DESKTOP" ratio="aspect-video" src={img("2")} name={c.name} />
                          <Device label="TABLET" ratio="aspect-[3/4]" src={img("3")} name={c.name} />
                          <Device label="MOBIEL" ratio="aspect-[1/2]" src={img("4")} name={c.name} />
                        </div>
                      </div>

                      {/* info */}
                      <div>
                        <div className="mb-2 font-mono text-[11px] font-bold tracking-[0.12em] text-white/40">{c.client}</div>
                        <p className="mb-5 text-[15px] leading-relaxed text-white/70">{c.text}</p>

                        <div className="mb-2.5 font-mono text-[11px] font-bold tracking-[0.12em] text-white/40">SEO-FOCUS</div>
                        <div className="mb-5 flex flex-wrap gap-1.5">
                          {c.terms.map((tm) => (
                            <span key={tm} className="inline-flex items-center gap-1.5 rounded-[7px] border border-[rgba(255,122,0,0.22)] bg-[rgba(255,122,0,0.08)] px-2.5 py-1.5 font-mono text-[11px] text-[#FF9A45]">
                              <Magnifier />
                              {tm}
                            </span>
                          ))}
                        </div>

                        <div className="mb-3 font-mono text-[11px] font-bold tracking-[0.12em] text-white/40">WAT WE LEVERDEN</div>
                        <div className="mb-6 flex flex-col gap-2.5">
                          {c.features.map((f) => (
                            <div key={f} className="flex items-center gap-3">
                              <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.14)]">
                                <Check />
                              </span>
                              <span className="text-sm font-semibold text-white/85">{f}</span>
                            </div>
                          ))}
                        </div>

                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vvw-visitLink inline-flex items-center gap-2 rounded-[11px] border border-[rgba(255,122,0,0.35)] bg-[rgba(255,122,0,0.12)] px-5 py-3 text-sm font-bold text-white"
                        >
                          Bekijk site
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Device({ label, ratio, src, name }: { label: string; ratio: string; src?: string; name: string }) {
  return (
    <div className={`relative h-[210px] flex-none overflow-hidden rounded-[13px] border border-white/[0.08] ${ratio}`}>
      <ShowcaseImage src={src} alt={`${name} ${label.toLowerCase()}`} placeholder={label} />
      <span className="pointer-events-none absolute left-2 top-2 z-[3] rounded-[5px] bg-[rgba(10,10,10,0.6)] px-1.5 py-[3px] font-mono text-[9px] font-bold tracking-[0.1em] text-white">
        {label}
      </span>
    </div>
  );
}
