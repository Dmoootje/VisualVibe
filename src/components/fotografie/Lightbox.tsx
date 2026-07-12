"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiIcon } from "./FiIcon";

export type LightboxSlide = { src: string; cap: string; title?: string };

/**
 * Prop-driven fullscreen gallery lightbox (extracted from the Fotografie service
 * page so realisaties galleries can reuse it). Autoplay (5s), keyboard (arrows/
 * Esc), touch-swipe, thumbnail rail, progress bar and slide counter. Portaled to
 * document.body so it escapes any page stacking context (covers the fixed nav).
 * A brief shutter-flash fires on open for continuity with the camera hero.
 */
export function Lightbox({
  open,
  slides,
  title,
  desc,
  badge,
  icon,
  startIndex = 0,
  onClose,
  flashOnOpen = true,
}: {
  open: boolean;
  slides: LightboxSlide[];
  title: string;
  desc?: string;
  badge?: string;
  icon: string;
  startIndex?: number;
  onClose: () => void;
  flashOnOpen?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [idx, setIdx] = useState(startIndex);
  const [auto, setAuto] = useState(true);
  const [flash, setFlash] = useState(false);
  const touchX = useRef(0);
  const flashT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const len = slides.length;
  const step = (d: number) => setIdx((i) => (i + d + len) % len);
  const next = () => step(1);
  const prev = () => step(-1);

  useEffect(() => setMounted(true), []);
  useEffect(() => () => clearTimeout(flashT.current), []);

  // On open: reset to the chosen slide, resume autoplay, fire the shutter flash.
  useEffect(() => {
    if (!open) return;
    setIdx(startIndex);
    setAuto(true);
    if (flashOnOpen) {
      setFlash(true);
      clearTimeout(flashT.current);
      flashT.current = setTimeout(() => setFlash(false), 560);
    }
  }, [open, startIndex, flashOnOpen]);

  // Keyboard + scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx((i) => (i + 1 + len) % len);
      else if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + len) % len);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, len, onClose]);

  // Autoplay: advance every 5s, re-armed on idx change so manual nav restarts it.
  useEffect(() => {
    if (!open || !auto || len < 2) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % len), 5000);
    return () => clearTimeout(t);
  }, [open, auto, idx, len]);

  if (!mounted) return null;

  return (
    <>
      {flash && createPortal(
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
          <div className="fg-bladeT absolute left-0 right-0 top-0 h-1/2 bg-[#050505]" />
          <div className="fg-bladeB absolute bottom-0 left-0 right-0 h-1/2 bg-[#050505]" />
          <div className="fg-flash absolute inset-0 bg-white" />
        </div>,
        document.body
      )}

      {open && createPortal(
        <div className="fixed inset-0 z-[90] flex flex-col text-white" role="dialog" aria-modal="true" aria-label={`Galerij ${title}`}>
          <div className="fg-lbbg absolute inset-0 backdrop-blur-[10px]" style={{ background: "radial-gradient(120% 90% at 50% 0%,rgba(255,90,0,.1),transparent 55%),rgba(4,4,4,.94)" }} onClick={onClose} />

          <div className="fg-lbcard relative z-[1] mx-auto flex h-full w-[min(1120px,100%)] max-w-full flex-col px-4 pb-[22px] pt-5 sm:px-[clamp(16px,3vw,40px)]" onClick={(e) => e.stopPropagation()}>
            {/* top bar */}
            <div className="mb-4 flex flex-none flex-col items-start justify-between gap-3 sm:flex-row">
              <div className="min-w-0">
                {badge && (
                  <span className="mb-[11px] inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-[#FF9A45]">
                    <FiIcon id={icon} size={13} />{badge}
                  </span>
                )}
                <h3 className="font-sora text-[26px] font-extrabold tracking-[-0.02em] text-white">{title}</h3>
                {desc && <p className="mt-1.5 max-w-[560px] text-[14.5px] leading-relaxed text-white/60">{desc}</p>}
              </div>
              <div className="flex flex-none items-center gap-2.5">
                <button type="button" onClick={() => setAuto((a) => !a)} className="fg-lbarrow flex h-11 items-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.04] px-[15px] font-mono text-[11px] font-bold tracking-[0.04em] text-white">
                  {auto ? (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>PAUZE</>
                  ) : (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m6 4 14 8-14 8V4z" /></svg>PLAY</>
                  )}
                </button>
                <button type="button" onClick={onClose} aria-label="Sluiten" className="fg-lbx flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-white/[0.14] bg-white/[0.04] text-white/75">
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
                    <img src={s.src} alt={s.cap} title={s.title} className="h-full w-full object-contain" />
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
    </>
  );
}
