"use client";

import { useState } from "react";
import Image from "next/image";
import type { FotoGallery } from "@/data/fotografieGalleries";
import { FOTO_GALLERY_ICONS } from "@/data/fotografieGalleries";
import { FiIcon, Lightbox } from "@/components/fotografie";

const iconLabel = (id: string) => FOTO_GALLERY_ICONS.find((o) => o.id === id)?.label ?? "Fotografie";

// SEO-friendly title + alt per image: the branded gallery title as the `title`,
// and the photo's own caption (falling back to the gallery description, then a
// numbered label) as the descriptive `alt`.
function imgMeta(gallery: FotoGallery, i: number): { title: string; alt: string } {
  const caption = gallery.images[i]?.caption?.trim();
  const alt = caption || gallery.description?.trim() || `${gallery.title} - foto ${i + 1}`;
  return { title: `${gallery.title} | VisualVibe`, alt };
}

const ArrowR = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

/**
 * Public fotografie realisaties: one featured gallery (big cover with a thumbnail
 * strip inside it), a "Sorteer op stijl" category filter, and a grid of the rest.
 * Every tile opens the shared <Lightbox>. The featured stays fixed; the filter
 * re-scopes the grid below it. Backgrounds are transparent so the site-wide
 * flowing background shows through (no per-section bands).
 */
export function RealisatieFotografieGalerijen({ galleries }: { galleries: FotoGallery[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [cat, setCat] = useState<string>("all");

  const g = openId ? galleries.find((x) => x.id === openId) ?? null : null;
  const slides = g
    ? g.images.map((img, n) => ({
        src: img.src,
        cap: img.caption?.trim() || `${g.title} - ${n + 1}`,
        alt: imgMeta(g, n).alt,
        title: imgMeta(g, n).title,
      }))
    : [];

  const featured = galleries[0];
  const featThumbs = featured.images.slice(1, 4);
  const rest = galleries.slice(1);

  // "Sorteer op stijl": chips for the categories present among the grid galleries.
  const counts = new Map<string, number>();
  rest.forEach((x) => counts.set(x.icon, (counts.get(x.icon) ?? 0) + 1));
  const filters = [
    { key: "all", label: "Alle", icon: "aperture", count: rest.length },
    ...[...counts.keys()].map((icon) => ({ key: icon, label: iconLabel(icon), icon, count: counts.get(icon) ?? 0 })),
  ];
  const shownRest = cat === "all" ? rest : rest.filter((x) => x.icon === cat);

  return (
    <>
      {/* ===== FEATURED - uitgelichte galerij ===== */}
      <section className="relative px-4 pb-12 pt-10 sm:pb-14">
        <div className="container relative z-[2] mx-auto grid items-center gap-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* LINKS: galerij-preview (thumbnails ín de hoofdafbeelding) */}
          <button
            type="button"
            onClick={() => setOpenId(featured.id)}
            aria-label={`Open galerij ${featured.title}`}
            className="fg-gcard group relative block aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#141210]"
          >
            <Image
              className="fg-gimg object-cover"
              src={featured.images[0].src}
              alt={imgMeta(featured, 0).alt}
              title={imgMeta(featured, 0).title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 780px"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.1),transparent 34%,rgba(10,10,10,.72))" }} />
            <span className="absolute left-4 top-4 z-[2] inline-flex items-center gap-[7px] rounded-full bg-[rgba(8,7,6,.6)] px-[13px] py-[7px] font-mono text-[11px] font-bold leading-none text-white backdrop-blur">
              <FiIcon id="foto" size={13} strokeWidth={1.9} className="text-[#FF9A45]" />{featured.images.length} beelden
            </span>
            <span className="fg-giris absolute left-1/2 top-[38%] z-[2] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_16px_38px_-10px_rgba(255,90,0,0.9)]" style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}>
              <FiIcon id="aperture" size={29} strokeWidth={1.9} />
            </span>
            {/* thumbnail strip inside the image */}
            {featThumbs.length > 0 && (
              <div className="absolute inset-x-4 bottom-4 z-[2] grid grid-cols-3 gap-2.5">
                {featThumbs.map((img, n) => (
                  <span key={img.src} className="relative block aspect-video overflow-hidden rounded-[10px] border border-white/20 bg-[#141210] shadow-lg">
                    <Image
                      className="object-cover"
                      src={img.src}
                      alt={imgMeta(featured, n + 1).alt}
                      title={imgMeta(featured, n + 1).title}
                      fill
                      sizes="(max-width: 1024px) 33vw, 250px"
                    />
                  </span>
                ))}
              </div>
            )}
          </button>

          {/* RECHTS: copy */}
          <div>
            <div className="mb-4 flex w-fit items-center gap-2.5 rounded-full border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.1)] px-[15px] py-2 font-mono text-xs font-bold leading-none tracking-[0.1em] text-[#FF9A45]">
              <span className="vvw-liveDot h-[7px] w-[7px] rounded-full bg-[#FF7A00]" />
              UITGELICHTE GALERIJ
            </div>
            <div className="mb-3 flex w-fit items-center gap-2 font-mono text-[11px] font-bold leading-none tracking-[0.12em] text-white/40">
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
              onClick={() => setOpenId(featured.id)}
              className="vvw-visitLink inline-flex items-center gap-2 rounded-xl border border-[rgba(255,122,0,0.35)] bg-[rgba(255,122,0,0.12)] px-[26px] py-3.5 text-[15px] font-bold text-white"
            >
              Bekijk galerij
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ===== ALLE GALERIJEN (met sorteren erboven) ===== */}
      {rest.length > 0 && (
        <section className="container relative z-[2] mx-auto px-4 pb-24">
          {/* Sorteer op stijl - onder de hoofdafbeelding, boven de galerijen */}
          {filters.length > 2 && (
            <div className="mb-8">
              <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#FF9A45]">Sorteer op stijl</p>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => {
                  const on = f.key === cat;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setCat(f.key)}
                      className={
                        on
                          ? "inline-flex items-center gap-2 rounded-[10px] border border-transparent bg-gradient-to-r from-red-500 to-[#FF7A00] px-[15px] py-[9px] text-[13px] font-bold text-white shadow-[0_10px_24px_-12px_rgba(255,90,0,0.8)]"
                          : "inline-flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/[0.03] px-[15px] py-[9px] text-[13px] font-bold text-white/[0.62] transition-colors hover:border-[rgba(255,122,0,0.4)] hover:text-white"
                      }
                    >
                      <FiIcon id={f.icon} size={14} className={on ? "text-white" : "text-[#FF9A45]"} />
                      {f.label}
                      <span className="font-mono text-[11px] font-bold opacity-55">{f.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
                {cat === "all" ? "Alle galerijen" : iconLabel(cat)}
              </p>
              <h2 className="font-sora text-[28px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-[34px]">
                Kies een stijl, open de galerij
              </h2>
            </div>
            <p className="max-w-[300px] text-[15px] leading-relaxed text-white/55">
              Elke galerij opent als een browsebare fotoviewer, met autoplay op elk toestel.
            </p>
          </div>

          {shownRest.length > 0 ? (
            <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
              {shownRest.map((gal, k) => (
                <button
                  key={gal.id}
                  type="button"
                  onClick={() => setOpenId(gal.id)}
                  aria-label={`Open galerij ${gal.title}`}
                  style={{ ["--i" as string]: k } as React.CSSProperties}
                  className="vvw-caseRow fg-gcard group relative aspect-[4/5] overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#141210] text-left"
                >
                  <Image
                    className="fg-gimg object-cover"
                    src={gal.images[0].src}
                    alt={imgMeta(gal, 0).alt}
                    title={imgMeta(gal, 0).title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.12) 0%,transparent 32%,rgba(10,10,10,.9) 100%)" }} />
                  <span className="absolute left-4 top-4 z-[2] inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,7,6,.62)] px-3 py-[7px] font-mono text-[10.5px] font-bold leading-none tracking-[0.05em] text-[#FF9A45] backdrop-blur">
                    <FiIcon id={gal.icon} size={13} />{iconLabel(gal.icon)}
                  </span>
                  <span className="absolute right-3.5 top-3.5 z-[2] inline-flex items-center gap-1.5 rounded-full bg-[rgba(8,7,6,.55)] px-[11px] py-1.5 font-mono text-[10.5px] font-bold leading-none text-white/85 backdrop-blur">
                    <FiIcon id="foto" size={12} strokeWidth={1.9} />{gal.images.length}
                  </span>
                  <span className="fg-giris absolute left-1/2 top-[44%] z-[2] flex h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_14px_34px_-10px_rgba(255,90,0,0.9)]" style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}>
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
              ))}
            </div>
          ) : (
            <p className="text-[15px] text-white/55">Geen galerijen in deze stijl.</p>
          )}
        </section>
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
