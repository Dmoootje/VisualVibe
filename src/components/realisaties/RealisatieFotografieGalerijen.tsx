"use client";

import { useState } from "react";
import type { FotoGallery } from "@/data/fotografieGalleries";
import { FOTO_GALLERY_ICONS } from "@/data/fotografieGalleries";
import { FiIcon, Lightbox } from "@/components/fotografie";

const iconLabel = (id: string) => FOTO_GALLERY_ICONS.find((o) => o.id === id)?.label ?? "Fotografie";

/**
 * Public grid of admin-managed fotografie galleries. Each tile opens the shared
 * <Lightbox>. Reuses the `fg-*` card styling + FiIcon from the fotografie
 * service page. Only galleries with at least one photo are passed in.
 */
export function RealisatieFotografieGalerijen({ galleries }: { galleries: FotoGallery[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const g = open !== null ? galleries[open] : null;
  const slides = g
    ? g.images.map((img, n) => ({ src: img.src, cap: img.caption?.trim() || `${g.title} - ${n + 1}` }))
    : [];

  return (
    <section className="relative mx-auto max-w-[1300px] px-4 py-12 sm:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#FF9A45]">Galerijen</p>
        <h2 className="font-sora text-[28px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-[34px]">
          Onze fotogalerijen
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-white/60">
          Klik een galerij open voor de volledige, browsebare reeks, met autoplay op elk toestel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleries.map((gal, i) => (
          <button
            key={gal.id}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open galerij ${gal.title}`}
            className="fg-gcard group relative aspect-[4/3] overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#141210] text-left"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="fg-gimg absolute inset-0 h-full w-full object-cover" src={gal.images[0].src} alt={gal.title} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.15) 0%,transparent 34%,rgba(10,10,10,.9) 100%)" }} />
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
                BEKIJK GALERIJ
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </span>
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={open !== null}
        slides={slides}
        title={g?.title ?? ""}
        desc={g?.description}
        badge={g ? iconLabel(g.icon) : undefined}
        icon={g?.icon ?? "foto"}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}
