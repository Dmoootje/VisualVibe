"use client";

import { useState } from "react";
import Image from "next/image";
import type { FotoGallery } from "@/data/fotografieGalleries";
import { FOTO_GALLERY_ICONS } from "@/data/fotografieGalleries";
import { FiIcon, Lightbox } from "@/components/fotografie";

const iconLabel = (id: string) => FOTO_GALLERY_ICONS.find((o) => o.id === id)?.label ?? "Fotografie";

// SEO-friendly title + alt per image (same convention as the realisaties page):
// branded gallery title as `title`, the photo's caption (falling back to the
// gallery description, then a numbered label) as descriptive `alt`.
function imgMeta(gallery: FotoGallery, i: number): { title: string; alt: string } {
  const caption = gallery.images[i]?.caption?.trim();
  const alt = caption || gallery.description?.trim() || `${gallery.title} - foto ${i + 1}`;
  return { title: `${gallery.title} | VisualVibe`, alt };
}

const ArrowR = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

/**
 * Sector-page fotogalerij tiles: asymmetric on desktop (first gallery large,
 * the rest stacked beside it), one column on mobile. Every tile opens the
 * shared fullscreen <Lightbox> popup, exactly like the realisaties page.
 */
export function SectorGalleryCards({ galleries }: { galleries: FotoGallery[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const g = openId ? galleries.find((x) => x.id === openId) ?? null : null;
  const slides = g
    ? g.images.map((img, n) => ({
        src: img.src,
        cap: img.caption?.trim() || `${g.title} - ${n + 1}`,
        alt: imgMeta(g, n).alt,
        title: imgMeta(g, n).title,
      }))
    : [];

  const [featured, ...rest] = galleries;

  const tileChrome = (gal: FotoGallery, big: boolean) => (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.12) 0%,transparent 32%,rgba(10,10,10,.9) 100%)" }} />
      <span className="absolute left-4 top-4 z-[2] inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,7,6,.62)] px-3 py-[7px] font-mono text-[10.5px] font-bold leading-none tracking-[0.05em] text-[#FF9A45] backdrop-blur">
        <FiIcon id={gal.icon} size={13} />{iconLabel(gal.icon)}
      </span>
      <span className="absolute right-3.5 top-3.5 z-[2] inline-flex items-center gap-1.5 rounded-full bg-[rgba(8,7,6,.55)] px-[11px] py-1.5 font-mono text-[10.5px] font-bold leading-none text-white/85 backdrop-blur">
        <FiIcon id="foto" size={12} strokeWidth={1.9} />{gal.images.length}
      </span>
      <span className={`fg-giris absolute left-1/2 top-[44%] z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_14px_34px_-10px_rgba(255,90,0,0.9)] ${big ? "h-16 w-16" : "h-[60px] w-[60px]"}`} style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}>
        <FiIcon id="aperture" size={big ? 29 : 27} strokeWidth={1.9} />
      </span>
      <div className="absolute bottom-[18px] left-5 right-5 z-[2]">
        <h3 className={`font-sora font-bold tracking-[-0.01em] text-white ${big ? "text-[24px]" : "text-[20px]"}`}>{gal.title}</h3>
        {gal.description && <div className="mt-[5px] line-clamp-2 text-[13px] leading-relaxed text-white/[0.72]">{gal.description}</div>}
        <span className="fg-ggo mt-[11px] inline-flex items-center gap-[7px] font-mono text-[11px] font-bold tracking-[0.05em] text-white/80">
          BEKIJK GALERIJ <ArrowR />
        </span>
      </div>
    </>
  );

  return (
    <>
      {galleries.length === 1 ? (
        <button
          type="button"
          onClick={() => setOpenId(featured.id)}
          aria-label={`Open galerij ${featured.title}`}
          className="vvw-caseRow fg-gcard group relative block aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#141210] text-left sm:aspect-[16/9]"
        >
          <Image
            className="fg-gimg object-cover"
            src={featured.images[0].src}
            alt={imgMeta(featured, 0).alt}
            title={imgMeta(featured, 0).title}
            fill
            sizes="(max-width: 1400px) 100vw, 1360px"
          />
          {tileChrome(featured, true)}
        </button>
      ) : (
        <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-3">
          <button
            type="button"
            onClick={() => setOpenId(featured.id)}
            aria-label={`Open galerij ${featured.title}`}
            style={{ ["--i" as string]: 0 } as React.CSSProperties}
            className="vvw-caseRow fg-gcard group relative block aspect-[16/10] overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#141210] text-left lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:h-full lg:min-h-[420px]"
          >
            <Image
              className="fg-gimg object-cover"
              src={featured.images[0].src}
              alt={imgMeta(featured, 0).alt}
              title={imgMeta(featured, 0).title}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
            />
            {tileChrome(featured, true)}
          </button>
          {rest.map((gal, k) => (
            <button
              key={gal.id}
              type="button"
              onClick={() => setOpenId(gal.id)}
              aria-label={`Open galerij ${gal.title}`}
              style={{ ["--i" as string]: k + 1 } as React.CSSProperties}
              className="vvw-caseRow fg-gcard group relative block aspect-[16/10] overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#141210] text-left lg:aspect-[4/5]"
            >
              <Image
                className="fg-gimg object-cover"
                src={gal.images[0].src}
                alt={imgMeta(gal, 0).alt}
                title={imgMeta(gal, 0).title}
                fill
                sizes="(max-width: 1024px) 100vw, 440px"
              />
              {tileChrome(gal, false)}
            </button>
          ))}
        </div>
      )}

      <Lightbox
        open={openId !== null}
        slides={slides}
        title={g?.title ?? ""}
        desc={g?.description}
        badge={g ? iconLabel(g.icon) : undefined}
        icon={g?.icon ?? "foto"}
        onClose={() => setOpenId(null)}
      />
    </>
  );
}
