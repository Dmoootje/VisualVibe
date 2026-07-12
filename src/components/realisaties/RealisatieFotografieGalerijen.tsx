"use client";

import { useState } from "react";
import type { FotoGallery } from "@/data/fotografieGalleries";
import { FOTO_GALLERY_ICONS } from "@/data/fotografieGalleries";
import { FiIcon, Lightbox } from "@/components/fotografie";

const iconLabel = (id: string) => FOTO_GALLERY_ICONS.find((o) => o.id === id)?.label ?? "Fotografie";

// SEO-friendly title + alt per image: the gallery title as the `title`, and the
// photo's own caption (falling back to the gallery description, then a numbered
// label) as the descriptive `alt`.
function imgMeta(gallery: FotoGallery, i: number): { title: string; alt: string } {
  const caption = gallery.images[i]?.caption?.trim();
  const alt = caption || gallery.description?.trim() || `${gallery.title} - foto ${i + 1}`;
  return { title: gallery.title, alt };
}

const ArrowR = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

/**
 * Public fotografie realisaties: a featured block for the first gallery (big
 * cover + 3 thumbnails left, copy right) followed by a grid of the remaining
 * galleries. Every tile opens the shared <Lightbox> (autoplay, keyboard, swipe,
 * thumbnails). Featured = galleries[0]; reorder in the admin to swap it. Only
 * galleries with at least one photo are passed in.
 */
export function RealisatieFotografieGalerijen({ galleries }: { galleries: FotoGallery[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const g = open !== null ? galleries[open] : null;
  const slides = g
    ? g.images.map((img, n) => ({ src: img.src, cap: imgMeta(g, n).alt, title: g.title }))
    : [];

  const featured = galleries[0];
  const featThumbs = featured.images.slice(1, 4);
  const rest = galleries.slice(1);

  return (
    <>
      {/* ===== FEATURED - uitgelichte galerij ===== */}
      <section className="relative overflow-hidden pb-14 pt-12 sm:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-120px] top-10 z-0 h-[620px] w-[760px] max-w-full bg-[radial-gradient(circle_at_60%_45%,rgba(255,90,0,0.12),transparent_64%)]"
        />

        <div className="container relative z-[2] mx-auto grid items-center gap-9 px-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* LINKS: galerij-preview */}
          <div>
            <button
              type="button"
              onClick={() => setOpen(0)}
              aria-label={`Open galerij ${featured.title}`}
              className="fg-gcard group relative block aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#141210]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="fg-gimg absolute inset-0 h-full w-full object-cover" src={featured.images[0].src} alt={imgMeta(featured, 0).alt} title={imgMeta(featured, 0).title} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.1),transparent 40%,rgba(10,10,10,.55))" }} />
              <span className="fg-giris absolute left-1/2 top-1/2 z-[2] flex h-16 w-16 items-center justify-center rounded-full text-white shadow-[0_16px_38px_-10px_rgba(255,90,0,0.9)]" style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}>
                <FiIcon id="aperture" size={29} strokeWidth={1.9} />
              </span>
              <span className="absolute bottom-4 left-4 z-[2] inline-flex items-center gap-[7px] rounded-full bg-[rgba(8,7,6,.6)] px-[13px] py-[7px] font-mono text-[11px] font-bold text-white backdrop-blur">
                <FiIcon id="foto" size={13} strokeWidth={1.9} className="text-[#FF9A45]" />{featured.images.length} beelden
              </span>
            </button>

            {featThumbs.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {featThumbs.map((img, n) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setOpen(0)}
                    aria-label={`Open galerij ${featured.title}`}
                    className="fg-thumb group relative aspect-[4/3] overflow-hidden rounded-[13px] border border-white/[0.09] bg-[#141210]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="fg-gimg absolute inset-0 h-full w-full object-cover" src={img.src} alt={imgMeta(featured, n + 1).alt} title={imgMeta(featured, n + 1).title} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RECHTS: copy */}
          <div>
            <div className="mb-[22px] inline-flex items-center gap-2.5 rounded-full border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.1)] px-[15px] py-2 font-mono text-xs font-bold tracking-[0.1em] text-[#FF9A45]">
              <span className="vvw-liveDot h-[7px] w-[7px] rounded-full bg-[#FF7A00]" />
              UITGELICHTE GALERIJ
            </div>
            <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.12em] text-white/40">
              <FiIcon id={featured.icon} size={14} className="text-[#FF9A45]" />
              {featured.title.toUpperCase()}
            </div>
            <h2 className="font-sora mb-5 text-[clamp(30px,9vw,42px)] font-extrabold leading-[1.03] tracking-[-0.025em] text-white sm:text-[44px]">
              {featured.title}
            </h2>
            {featured.description && (
              <p className="mb-[26px] text-[16.5px] leading-[1.65] text-white/[0.68]">{featured.description}</p>
            )}
            {featured.tags && featured.tags.length > 0 && (
              <div className="mb-[30px] flex flex-wrap gap-[7px]">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/[0.09] bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => setOpen(0)}
              className="vvw-visitLink inline-flex items-center gap-2 rounded-xl border border-[rgba(255,122,0,0.35)] bg-[rgba(255,122,0,0.12)] px-[26px] py-3.5 text-[15px] font-bold text-white"
            >
              Bekijk galerij
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ===== ALLE GALERIJEN ===== */}
      {rest.length > 0 && (
        <section className="container relative z-[2] mx-auto px-4 pb-24">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">Alle galerijen</p>
              <h2 className="font-sora text-[28px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-[34px]">
                Kies een stijl, open de galerij
              </h2>
            </div>
            <p className="max-w-[300px] text-[15px] leading-relaxed text-white/55">
              Elke galerij opent als een browsebare fotoviewer, met autoplay op elk toestel.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((gal, k) => {
              const i = k + 1;
              return (
                <button
                  key={gal.id}
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Open galerij ${gal.title}`}
                  style={{ ["--i" as string]: k } as React.CSSProperties}
                  className="vvw-caseRow fg-gcard group relative aspect-[4/5] overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#141210] text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="fg-gimg absolute inset-0 h-full w-full object-cover" src={gal.images[0].src} alt={imgMeta(gal, 0).alt} title={imgMeta(gal, 0).title} />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.12) 0%,transparent 32%,rgba(10,10,10,.9) 100%)" }} />
                  <span className="absolute left-4 top-4 z-[2] inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,7,6,.62)] px-3 py-[7px] font-mono text-[10.5px] font-bold tracking-[0.05em] text-[#FF9A45] backdrop-blur">
                    <FiIcon id={gal.icon} size={13} />{iconLabel(gal.icon)}
                  </span>
                  <span className="absolute right-3.5 top-3.5 z-[2] inline-flex items-center gap-1.5 rounded-full bg-[rgba(8,7,6,.55)] px-[11px] py-1.5 font-mono text-[10.5px] font-bold text-white/85 backdrop-blur">
                    <FiIcon id="foto" size={12} strokeWidth={1.9} />{gal.images.length}
                  </span>
                  <span className="fg-giris absolute left-1/2 top-[44%] z-[2] flex h-[60px] w-[60px] items-center justify-center rounded-full text-white shadow-[0_14px_34px_-10px_rgba(255,90,0,0.9)]" style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}>
                    <FiIcon id="aperture" size={27} strokeWidth={1.9} />
                  </span>
                  <div className="absolute bottom-[18px] left-5 right-5 z-[2]">
                    <div className="font-sora text-[20px] font-bold tracking-[-0.01em] text-white">{gal.title}</div>
                    {gal.description && <div className="mt-[5px] line-clamp-2 text-[13px] leading-relaxed text-white/[0.72]">{gal.description}</div>}
                    <span className="fg-ggo mt-[11px] inline-flex items-center gap-[7px] font-mono text-[11px] font-bold tracking-[0.05em] text-white/80">
                      BEKIJK GALERIJ <ArrowR />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <Lightbox
        open={open !== null}
        slides={slides}
        title={g?.title ?? ""}
        desc={g?.description}
        badge={g ? iconLabel(g.icon) : undefined}
        icon={g?.icon ?? "foto"}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
