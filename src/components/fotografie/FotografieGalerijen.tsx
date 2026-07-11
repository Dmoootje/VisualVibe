"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FG_GALLERIES, FG_IMG } from "@/data/fotografieShowcase";
import { FiIcon } from "./FiIcon";
import { WeddingVibeLogo } from "./WeddingVibeLogo";

const ArrowR = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

/**
 * Galerijen block: a featured bento (1 big + 2 small tiles) + a WeddingVibe card
 * and a "meer projecten" card. Any gallery tile opens a full lightbox with
 * autoplay, keyboard (arrows/Esc), touch-swipe and a thumbnail rail. A shutter-
 * flash fires on open for continuity with the hero.
 */
export function FotografieGalerijen() {
  const [lbOpen, setLbOpen] = useState(false);
  const [gal, setGal] = useState(0);
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const [flash, setFlash] = useState(false);
  const [mounted, setMounted] = useState(false);
  const touchX = useRef(0);

  useEffect(() => setMounted(true), []);
  const flashT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const slidesFor = useCallback((i: number) => {
    const g = FG_GALLERIES[i];
    return g.keys.map((k, n) => ({ src: FG_IMG[k], cap: `${g.title} – ${n + 1}` }));
  }, []);

  const slides = slidesFor(gal);
  const len = slides.length;
  const step = useCallback((d: number) => setIdx((i) => (i + d + len) % len), [len]);
  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  const fire = () => {
    setFlash(true);
    clearTimeout(flashT.current);
    flashT.current = setTimeout(() => setFlash(false), 560);
  };

  const openLb = (i: number) => {
    fire();
    setGal(i);
    setIdx(0);
    setAuto(true);
    setLbOpen(true);
  };
  const closeLb = useCallback(() => setLbOpen(false), []);

  // Keyboard + scroll lock while open.
  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") closeLb();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lbOpen, next, prev, closeLb]);

  // Autoplay: advance every 5s. Re-armed on idx change so manual nav restarts it.
  useEffect(() => {
    if (!lbOpen || !auto) return;
    const t = setTimeout(next, 5000);
    return () => clearTimeout(t);
  }, [lbOpen, auto, idx, gal, next]);

  useEffect(() => () => clearTimeout(flashT.current), []);

  const featured = [0, 1, 2];
  const g = FG_GALLERIES[gal];

  return (
    <section id="galerijen" className="relative z-[2] mx-auto max-w-[1300px] px-4 pb-16 pt-6 sm:px-8">
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
              onClick={() => openLb(i)}
              aria-label={`Open galerij ${gg.title}`}
              className={`fg-gcard group relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#141210] text-left ${big ? "lg:row-span-2" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="fg-gimg absolute inset-0 h-full w-full object-cover" src={FG_IMG[gg.keys[0]]} alt={gg.title} />
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

      {/* shutter flash (portaled so it covers the fixed nav) */}
      {mounted && flash && createPortal(
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
          <div className="fg-bladeT absolute left-0 right-0 top-0 h-1/2 bg-[#050505]" />
          <div className="fg-bladeB absolute bottom-0 left-0 right-0 h-1/2 bg-[#050505]" />
          <div className="fg-flash absolute inset-0 bg-white" />
        </div>,
        document.body
      )}

      {/* lightbox (portaled to escape the page's z-10 stacking context) */}
      {mounted && lbOpen && createPortal(
        <div className="fixed inset-0 z-[90] flex flex-col text-white" role="dialog" aria-modal="true" aria-label={`Galerij ${g.title}`}>
          <div className="fg-lbbg absolute inset-0 backdrop-blur-[10px]" style={{ background: "radial-gradient(120% 90% at 50% 0%,rgba(255,90,0,.1),transparent 55%),rgba(4,4,4,.94)" }} onClick={closeLb} />

          <div className="fg-lbcard relative z-[1] mx-auto flex h-full w-[min(1120px,100%)] max-w-full flex-col px-4 pb-[22px] pt-5 sm:px-[clamp(16px,3vw,40px)]" onClick={(e) => e.stopPropagation()}>
            {/* top bar */}
            <div className="mb-4 flex flex-none flex-col items-start justify-between gap-3 sm:flex-row">
              <div className="min-w-0">
                <span className="mb-[11px] inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-[#FF9A45]">
                  <FiIcon id={g.icon} size={13} />{g.badge}
                </span>
                <h3 className="font-sora text-[26px] font-extrabold tracking-[-0.02em] text-white">{g.title}</h3>
                <p className="mt-1.5 max-w-[560px] text-[14.5px] leading-relaxed text-white/60">{g.desc}</p>
              </div>
              <div className="flex flex-none items-center gap-2.5">
                <button type="button" onClick={() => setAuto((a) => !a)} className="fg-lbarrow flex h-11 items-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.04] px-[15px] font-mono text-[11px] font-bold tracking-[0.04em] text-white">
                  {auto ? (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>PAUZE</>
                  ) : (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m6 4 14 8-14 8V4z" /></svg>PLAY</>
                  )}
                </button>
                <button type="button" onClick={closeLb} aria-label="Sluiten" className="fg-lbx flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-white/[0.14] bg-white/[0.04] text-white/75">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* progress */}
            <div key={idx} className={`fg-lbprogbar relative mb-3.5 h-[3px] flex-none overflow-hidden rounded-[3px] bg-white/10 ${auto ? "" : "paused"}`} />

            {/* stage */}
            <div
              className="relative min-h-0 flex-1 overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0e0d0c]"
              onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? 0; }}
              onTouchEnd={(e) => { const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current; if (Math.abs(dx) > 45) (dx < 0 ? next : prev)(); }}
            >
              <div className="fg-lbtrack" style={{ transform: `translateX(-${idx * 100}%)` }}>
                {slides.map((s) => (
                  <div key={s.cap} className="relative flex h-full w-full flex-none items-center justify-center bg-[#0b0a09]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.src} alt={s.cap} className="h-full w-full object-contain" />
                    <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 px-[22px] pb-4 pt-[34px]" style={{ background: "linear-gradient(180deg,transparent,rgba(6,6,6,.82))" }}>
                      <span className="font-mono text-xs font-semibold text-white/85">{s.cap}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={prev} aria-label="Vorige" className="fg-lbarrow absolute left-3.5 top-1/2 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.16] bg-[rgba(10,10,10,.55)] text-white backdrop-blur">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button type="button" onClick={next} aria-label="Volgende" className="fg-lbarrow absolute right-3.5 top-1/2 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.16] bg-[rgba(10,10,10,.55)] text-white backdrop-blur">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
              <span className="absolute right-4 top-4 z-[2] rounded-full bg-[rgba(8,7,6,.62)] px-3 py-1.5 font-mono text-xs font-bold text-white backdrop-blur">{idx + 1} / {len}</span>
            </div>

            {/* thumbnails */}
            <div className="mt-3.5 flex flex-none gap-2.5 overflow-x-auto p-0.5">
              {slides.map((s, k) => (
                <button
                  key={s.cap}
                  type="button"
                  onClick={() => setIdx(k)}
                  aria-label={`Ga naar foto ${k + 1}`}
                  className={`fg-lbthumb h-[60px] w-[84px] flex-none overflow-hidden rounded-[10px] border-2 border-white/[0.12] bg-[#0b0a09] ${k === idx ? "on" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
