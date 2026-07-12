"use client";

import { useState } from "react";
import { FG_GALLERIES, FG_IMG } from "@/data/fotografieShowcase";
import { FiIcon } from "./FiIcon";
import { WeddingVibeLogo } from "./WeddingVibeLogo";
import { Lightbox } from "./Lightbox";

const ArrowR = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

// SEO-friendly title + alt: the branded gallery title as `title`, the gallery
// description as the descriptive `alt` (this showcase has no per-photo captions).
function imgMeta(g: { title: string; desc?: string }): { title: string; alt: string } {
  return { title: `${g.title} | VisualVibe`, alt: g.desc?.trim() || g.title };
}

/**
 * Galerijen block: a featured bento (1 big + 2 small tiles) + a WeddingVibe card
 * and a "meer projecten" card. Any gallery tile opens the shared <Lightbox>
 * (autoplay, keyboard, swipe, thumbnails), which fires a shutter-flash on open.
 */
export function FotografieGalerijen() {
  const [openGal, setOpenGal] = useState<number | null>(null);
  const g = openGal !== null ? FG_GALLERIES[openGal] : null;
  const slides = g
    ? g.keys.map((k, n) => ({
        src: FG_IMG[k],
        cap: `${g.title} - ${n + 1}`,
        alt: imgMeta(g).alt,
        title: imgMeta(g).title,
      }))
    : [];

  const featured = [0, 1, 2];

  return (
    <section id="galerijen" className="container relative z-[2] mx-auto px-4 pb-16 pt-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#FF9A45]">Onze galerijen</p>
          <h2 className="font-sora text-[32px] font-extrabold leading-[1.06] tracking-[-0.025em] text-white sm:text-[40px]">
            Kies een stijl, open de galerij
          </h2>
        </div>
        <p className="max-w-[330px] text-[15px] leading-relaxed text-white/55">
          Klik een kaart open voor een volledige, browsebare fotogalerij, met autoplay op elk toestel.
        </p>
      </div>

      {/* featured bento */}
      <div className="grid grid-cols-1 gap-4 [grid-auto-rows:210px] lg:grid-cols-[1.7fr_1fr] lg:[grid-auto-rows:200px]">
        {featured.map((i) => {
          const gg = FG_GALLERIES[i];
          const big = i === 0;
          return (
            <button
              key={gg.title}
              type="button"
              onClick={() => setOpenGal(i)}
              aria-label={`Open galerij ${gg.title}`}
              className={`fg-gcard group relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#141210] text-left ${big ? "lg:row-span-2" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="fg-gimg absolute inset-0 h-full w-full object-cover" src={FG_IMG[gg.keys[0]]} alt={imgMeta(gg).alt} title={imgMeta(gg).title} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.15) 0%,transparent 34%,rgba(10,10,10,.9) 100%)" }} />
              <span className="absolute left-4 top-4 z-[2] inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,7,6,.62)] px-3 py-[7px] font-mono text-[10.5px] font-bold tracking-[0.05em] text-[#FF9A45] backdrop-blur">
                <FiIcon id={gg.icon} size={13} />{gg.badge}
              </span>
              <span className="absolute right-3.5 top-3.5 z-[2] inline-flex items-center gap-1.5 rounded-full bg-[rgba(8,7,6,.55)] px-[11px] py-1.5 font-mono text-[10.5px] font-bold text-white/85 backdrop-blur">
                <FiIcon id="foto" size={12} strokeWidth={1.9} />{gg.keys.length}
              </span>
              <span className="fg-giris absolute left-1/2 top-[44%] z-[2] flex h-[60px] w-[60px] items-center justify-center rounded-full text-white shadow-[0_14px_34px_-10px_rgba(255,90,0,0.9)]" style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}>
                <FiIcon id="aperture" size={27} strokeWidth={1.9} />
              </span>
              <div className="absolute bottom-[18px] left-5 right-5 z-[2]">
                <div className={`font-sora font-bold tracking-[-0.01em] text-white ${big ? "text-[26px]" : "text-[19px]"}`}>{gg.title}</div>
                <div className="mt-[5px] text-[13px] leading-relaxed text-white/[0.72]">{gg.desc}</div>
                <span className="fg-ggo mt-[11px] inline-flex items-center gap-[7px] font-mono text-[11px] font-bold tracking-[0.05em] text-white/80">
                  BEKIJK GALERIJ <ArrowR />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* WeddingVibe + meer projecten */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <a
          href="https://weddingvibe.be/"
          target="_blank"
          rel="noopener"
          className="fg-wed relative flex min-h-[150px] items-center gap-5 overflow-hidden rounded-[20px] bg-white px-[26px] py-[22px] shadow-[0_20px_48px_-22px_rgba(201,162,75,0.55)]"
        >
          <WeddingVibeLogo className="relative z-[1] h-[38px] w-auto flex-none" />
          <span className="relative z-[1] w-px self-stretch" style={{ background: "linear-gradient(180deg,transparent,rgba(201,162,75,.55),transparent)" }} />
          <span className="relative z-[1] flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="inline-flex w-fit items-center rounded-full border border-[rgba(201,162,75,0.4)] bg-[rgba(201,162,75,0.14)] px-[11px] py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#9A7B2E]">Bruidsfotografie</span>
            <span className="text-[26px] font-bold leading-[1.05] tracking-[0.01em] text-[#2A2320]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Huwelijks- &amp; bruidsfotografie</span>
            <span className="text-[13px] text-[#8A7A5E]">Ontdek de WeddingVibe-galerij &rarr;</span>
          </span>
          <span className="war relative z-[1] flex h-11 w-11 flex-none items-center justify-center rounded-full text-white shadow-[0_6px_16px_-6px_rgba(201,162,75,0.8)]" style={{ background: "linear-gradient(135deg,#EED89A,#C9A24B)" }}>
            <ArrowR size={18} />
          </span>
        </a>

        <a
          href="/realisaties/fotografie"
          className="fg-more relative flex min-h-[150px] items-center justify-between gap-5 overflow-hidden rounded-[20px] border border-[rgba(255,122,0,0.28)] px-7 py-6"
          style={{ background: "radial-gradient(120% 160% at 100% 0%,rgba(255,90,0,.16),transparent 60%),rgba(255,255,255,.02)" }}
        >
          <div className="relative">
            <span className="mb-3 inline-flex items-center rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] px-[11px] py-[5px] font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#FF9A45]">Portfolio</span>
            <div className="font-sora text-[23px] font-extrabold tracking-[-0.02em] text-white">Bekijk meer projecten</div>
            <div className="mt-1.5 max-w-[300px] text-sm leading-relaxed text-white/60">Het volledige fotografie-portfolio: alle stijlen op één plek.</div>
          </div>
          <span className="war relative flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full text-white shadow-[0_14px_34px_-12px_rgba(255,90,0,0.9)]" style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}>
            <ArrowR size={22} />
          </span>
        </a>
      </div>

      <Lightbox
        open={openGal !== null}
        slides={slides}
        title={g?.title ?? ""}
        desc={g?.desc}
        badge={g?.badge}
        icon={g?.icon ?? "foto"}
        onClose={() => setOpenGal(null)}
      />
    </section>
  );
}
