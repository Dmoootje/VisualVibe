"use client";

import { useEffect, useState } from "react";
import { imageKey, type WebdesignProject } from "@/data/webdesignShowcase";
import type { WebdesignImages } from "@/lib/firestore/webdesignImages";
import { ShowcaseImage } from "./ShowcaseImage";

const Magnifier = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={2.4} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" strokeLinecap="round" /></svg>
);
const Check = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);
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

  // Lock scroll and close on Escape while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

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
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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

      {open && (
        <RealisatieModal project={open} img={(slot) => img(open, slot)} onClose={() => setOpenId(null)} />
      )}
    </section>
  );
}

function RealisatieModal({
  project: c,
  img,
  onClose,
}: {
  project: WebdesignProject;
  img: (slot: "thumb" | "1" | "2" | "3" | "4") => string | undefined;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${c.name} details`}
      onClick={onClose}
    >
      <div className="relative w-full max-w-[1040px]" onClick={(e) => e.stopPropagation()}>
        {/* Oranje gloed achter de popup (thema-oranje, geen rood). */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-[28px] bg-gradient-to-r from-[#FF7A00] to-[#FF9A45] opacity-40 blur-2xl"
        />
        <div className="vvw-modalPanel relative max-h-[88vh] overflow-y-auto overflow-x-hidden rounded-[20px] border border-[rgba(255,122,0,0.18)] bg-[#0d0d0d] p-5 shadow-2xl sm:p-8">
          <button
            type="button"
          onClick={onClose}
          aria-label="Sluiten"
          className="absolute right-4 top-4 z-[2] flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        <div className="mb-6 flex flex-wrap items-center gap-3 pr-10">
          <span className="text-2xl font-bold text-white sm:text-3xl">{c.name}</span>
          <span className="inline-flex flex-wrap gap-1.5">
            {c.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/[0.09] bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-white/60">
                {t}
              </span>
            ))}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* gallery - toon alleen ingevulde beelden, geen lege placeholders */}
          <div className="flex min-w-0 flex-col gap-3">
            {(img("1") ?? img("2")) && (
              <div className="aspect-video w-full overflow-hidden rounded-[13px] border border-white/[0.08]">
                <ShowcaseImage src={img("1") ?? img("2")} alt={`${c.name} hoofdscreenshot`} placeholder="Hoofdscreenshot" />
              </div>
            )}
            {(img("2") || img("3") || img("4")) && (
              <div className="flex items-start gap-4 overflow-x-auto pb-1">
                {img("2") && <Device label="DESKTOP" ratio="aspect-video" src={img("2")} name={c.name} />}
                {img("3") && <Device label="TABLET" ratio="aspect-[3/4]" src={img("3")} name={c.name} />}
                {img("4") && <Device label="MOBIEL" ratio="aspect-[1/2]" src={img("4")} name={c.name} />}
              </div>
            )}
          </div>

          {/* info */}
          <div className="min-w-0">
            {c.client && (
              <div className="mb-2 break-words font-mono text-[11px] font-bold tracking-[0.12em] text-white/40">{c.client}</div>
            )}
            {c.text && <p className="mb-5 break-words text-[15px] leading-relaxed text-white/70">{c.text}</p>}

            {c.terms.length > 0 && (
              <>
                <div className="mb-2.5 font-mono text-[11px] font-bold tracking-[0.12em] text-white/40">SEO-FOCUS</div>
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {c.terms.map((tm) => (
                    <span key={tm} className="inline-flex items-center gap-1.5 rounded-[7px] border border-[rgba(255,122,0,0.22)] bg-[rgba(255,122,0,0.08)] px-2.5 py-1.5 font-mono text-[11px] text-[#FF9A45]">
                      <Magnifier />
                      {tm}
                    </span>
                  ))}
                </div>
              </>
            )}

            {c.features.length > 0 && (
              <>
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
              </>
            )}

            {c.url && (
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="vvw-visitLink inline-flex items-center gap-2 rounded-[11px] border border-[rgba(255,122,0,0.35)] bg-[rgba(255,122,0,0.12)] px-5 py-3 text-sm font-bold text-white"
              >
                Bekijk site
                <ArrowUpRight />
              </a>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
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
