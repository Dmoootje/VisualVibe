"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FG_HERO_IMAGE, FG_SLIDES, FG_CAT_ICON } from "@/data/fotografieShowcase";
import { FiIcon } from "./FiIcon";

/**
 * Cinematic camera-viewfinder hero (design_handoff_fotografie_service). The
 * orange shutter button is an interactive toy: each click plays a shutter-flash
 * and reveals the next photography category (per-session shuffled, never the same
 * twice in a row). All 8 slides stay mounted (opacity-toggled next/image fills)
 * so there's no flash of white.
 */
export function FotografieHero() {
  const [cur, setCur] = useState(-1);
  const [badge, setBadge] = useState(false);
  const [flash, setFlash] = useState(false);
  const [mounted, setMounted] = useState(false);
  const busy = useRef(false);
  const seq = useRef<{ order: number[]; pos: number; cur: number }>({ order: [], pos: -1, cur: -1 });
  const timers = useRef<{ sw?: ReturnType<typeof setTimeout>; bz?: ReturnType<typeof setTimeout>; ft?: ReturnType<typeof setTimeout> }>({});

  useEffect(() => {
    setMounted(true);
    const t = timers.current;
    return () => {
      clearTimeout(t.sw);
      clearTimeout(t.bz);
      clearTimeout(t.ft);
    };
  }, []);

  function shuffle(exclude: number): number[] {
    const a = FG_SLIDES.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (a[0] === exclude && a.length > 1) [a[0], a[1]] = [a[1], a[0]];
    return a;
  }

  function fire() {
    setFlash(true);
    clearTimeout(timers.current.ft);
    timers.current.ft = setTimeout(() => setFlash(false), 560);
  }

  function onShutter() {
    if (busy.current) return;
    busy.current = true;
    setBadge(false);
    fire();
    clearTimeout(timers.current.sw);
    timers.current.sw = setTimeout(() => {
      const st = seq.current;
      let order = st.order;
      let pos = st.pos + 1;
      if (!order.length || pos >= order.length) {
        order = shuffle(st.cur);
        pos = 0;
      }
      const nc = order[pos];
      seq.current = { order, pos, cur: nc };
      setCur(nc);
      setBadge(true);
    }, 240);
    clearTimeout(timers.current.bz);
    timers.current.bz = setTimeout(() => {
      busy.current = false;
    }, 560);
  }

  const slide = cur >= 0 ? FG_SLIDES[cur] : null;
  const catIcon = slide ? FG_CAT_ICON[slide.id] ?? "foto" : null;
  const btnIcon = catIcon ?? "aperture";

  return (
    <section className="relative overflow-hidden pb-14 pt-24">
      {/* Masked grid texture aimed at the viewfinder. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px)",
          backgroundSize: "54px 54px",
          WebkitMaskImage: "radial-gradient(ellipse at 74% 42%,#000,transparent 66%)",
          maskImage: "radial-gradient(ellipse at 74% 42%,#000,transparent 66%)",
        }}
      />

      <div className="container relative z-[2] mx-auto grid items-center gap-10 px-2.5 sm:px-4 lg:grid-cols-[1.02fr_.98fr] lg:gap-14">
        {/* copy */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-[22px] flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.04em] text-white/45">
            <Link href="/diensten" className="transition-colors hover:text-white">
              Diensten
            </Link>
            <span className="text-white/25">/</span>
            <span className="text-[#FF9A45]">Fotografie</span>
          </div>
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.1)] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#FF9A45]">
            <span className="fg-live h-[7px] w-[7px] rounded-full bg-[#FF7A00]" />
            Beeld dat verkoopt
          </div>
          <h1 className="font-sora mb-5 text-[clamp(44px,11vw,66px)] font-extrabold leading-[1.0] tracking-[-0.03em] text-white sm:text-[66px]">
            Fotografie
          </h1>
          <p className="mb-8 max-w-[500px] text-lg leading-relaxed text-white/65 sm:text-[19px]">
            Sterke beelden maken het verschil tussen een merk dat vertrouwen wekt en één dat eraan
            voorbijgaat. Wij fotograferen bedrijven, producten, events en vastgoed in heel Limburg.
          </p>
          <div className="flex flex-col justify-center gap-3.5 sm:flex-row sm:flex-wrap lg:justify-start">
            <Link
              href="/offerte-aanvragen"
              className="fg-btn inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-base font-bold text-white transition-transform hover:-translate-y-0.5 sm:w-auto"
              style={{ background: "linear-gradient(90deg,#FF3B2E,#FF7A00)", boxShadow: "0 16px 40px -14px rgba(255,90,0,.85)" }}
            >
              Offerte aanvragen
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            <a
              href="#galerijen"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.14] bg-white/5 px-7 py-3.5 text-base font-bold text-white transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Bekijk galerijen
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14" /><path d="m5 12 7 7 7-7" /></svg>
            </a>
          </div>
        </div>

        {/* viewfinder */}
        <div className="relative flex min-h-[520px] items-center justify-center">
          <div
            aria-hidden="true"
            className="fg-spin pointer-events-none absolute z-0 h-[540px] w-[540px] rounded-full blur-[52px]"
            style={{ background: "conic-gradient(from 0deg,transparent 0deg,rgba(255,122,0,.28) 80deg,transparent 190deg,rgba(255,90,0,.2) 290deg,transparent 360deg)" }}
          />

          <button
            type="button"
            onClick={onShutter}
            aria-label="Maak de foto, toon een fotografiestijl"
            className="fg-viewfinder fg-vfdrop relative z-[1] block w-[min(100%,472px)] cursor-pointer rounded-[22px] p-[1.5px] text-left"
            style={{ background: "linear-gradient(150deg,rgba(255,150,60,.7),rgba(255,90,0,.25) 55%,rgba(255,255,255,.05))", boxShadow: "0 46px 100px -34px rgba(255,80,0,.6)" }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[21px] border border-white/5 bg-[#0e0d0c]">
              <Image
                className="fg-shot object-cover"
                src={FG_HERO_IMAGE}
                alt="Sfeervolle nachtelijke luchtfoto met de drone, fotografie door VisualVibe uit Limburg"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 472px"
              />
              {FG_SLIDES.map((s, i) => (
                <Image
                  key={s.id}
                  className={`object-cover object-center ${cur === i ? "" : "opacity-0"}`}
                  src={s.image}
                  alt={`${s.title} - VisualVibe fotografie`}
                  aria-hidden={cur !== i}
                  fill
                  sizes="(max-width: 1024px) 100vw, 472px"
                />
              ))}

              {/* vignette */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 40%,transparent 55%,rgba(6,6,6,.62))" }} />
              {/* entrance sheen */}
              <div aria-hidden="true" className="fg-sheen pointer-events-none absolute bottom-0 left-0 top-0 z-[3] w-[55%]" style={{ background: "linear-gradient(105deg,transparent,rgba(255,255,255,.4),transparent)" }} />
              {/* rule-of-thirds grid */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-[22px] opacity-50" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.14) 1px,transparent 1px)", backgroundSize: "33.33% 33.33%" }} />
              {/* corner ticks */}
              <span aria-hidden="true" className="pointer-events-none absolute left-4 top-4 h-[26px] w-[26px] border-l-2 border-t-2 border-white/85" />
              <span aria-hidden="true" className="pointer-events-none absolute right-4 top-4 h-[26px] w-[26px] border-r-2 border-t-2 border-white/85" />
              <span aria-hidden="true" className="pointer-events-none absolute bottom-4 left-4 h-[26px] w-[26px] border-b-2 border-l-2 border-white/85" />
              <span aria-hidden="true" className="pointer-events-none absolute bottom-4 right-4 h-[26px] w-[26px] border-b-2 border-r-2 border-white/85" />
              {/* focus box */}
              <div aria-hidden="true" className="fg-focus pointer-events-none absolute left-1/2 top-[46%] h-[118px] w-[118px]">
                <span className="absolute left-0 top-0 h-[18px] w-[18px] border-l-2 border-t-2 border-[#FF7A00]" />
                <span className="absolute right-0 top-0 h-[18px] w-[18px] border-r-2 border-t-2 border-[#FF7A00]" />
                <span className="absolute bottom-0 left-0 h-[18px] w-[18px] border-b-2 border-l-2 border-[#FF7A00]" />
                <span className="absolute bottom-0 right-0 h-[18px] w-[18px] border-b-2 border-r-2 border-[#FF7A00]" />
              </div>
              {/* top HUD */}
              <div aria-hidden="true" className="pointer-events-none absolute left-3.5 top-3.5 inline-flex items-center gap-[7px] rounded-lg bg-[rgba(8,7,6,.6)] px-[11px] py-1.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-white backdrop-blur">
                <span className="fg-rec h-2 w-2 rounded-full bg-[#FF3B2E]" />
                SCHERP
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute right-3.5 top-3.5 inline-flex items-center rounded-lg bg-[rgba(8,7,6,.6)] px-2.5 py-1.5 text-[#FF9A45] backdrop-blur">
                <FiIcon id="aperture" size={15} strokeWidth={1.7} className="fg-iris" />
              </div>
              {/* EXIF */}
              <div aria-hidden="true" className="pointer-events-none absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 font-mono text-[10.5px] font-semibold text-white/90">
                <span className="inline-flex gap-2.5"><span>ISO&nbsp;100</span><span className="text-[#FF9A45]">f/1.8</span><span>1/250</span></span>
                <span className="rounded-md border border-[rgba(255,122,0,0.35)] bg-[rgba(255,122,0,0.18)] px-2 py-[3px] text-[#FFB877]">RAW</span>
              </div>

              {/* badge on reveal */}
              {badge && slide && (
                <div className="fg-badgein absolute bottom-[92px] left-1/2 z-[5] inline-flex max-w-[calc(100%-28px)] -translate-x-1/2 items-center gap-2.5 rounded-xl border border-[rgba(255,122,0,0.42)] bg-[rgba(8,7,6,.74)] py-[9px] pl-2.5 pr-3.5 backdrop-blur-md shadow-[0_14px_32px_-14px_rgba(0,0,0,0.9)]">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg border border-[rgba(255,122,0,0.4)] bg-[rgba(255,122,0,0.16)] text-[#FF9A45]">
                    <FiIcon id={catIcon ?? "foto"} size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="font-sora block text-[13.5px] font-bold leading-[1.2] text-white">{slide.title}</span>
                    <span className="mt-0.5 block text-[11.5px] leading-[1.35] text-white/[0.68]">{slide.message}</span>
                  </span>
                </div>
              )}

              {/* first-load hint */}
              {cur < 0 && (
                <div aria-hidden="true" className="fg-hint pointer-events-none absolute bottom-[98px] left-1/2 z-[6] flex -translate-x-1/2 flex-col items-center gap-[7px]">
                  <div className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-[rgba(255,122,0,0.55)] bg-[rgba(8,7,6,.82)] px-[17px] py-[11px] backdrop-blur-md shadow-[0_16px_36px_-12px_rgba(255,90,0,0.6)]">
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg border border-[rgba(255,122,0,0.45)] bg-[rgba(255,122,0,0.18)] text-[#FF9A45]">
                      <FiIcon id="foto" size={16} />
                    </span>
                    <span className="font-sora text-[14.5px] font-bold text-white">
                      Foto&apos;s nodig? <span className="text-[#FF9A45]">Klik hier</span>
                    </span>
                  </div>
                  <span className="fg-hintarrow flex text-[#FF7A00]" style={{ filter: "drop-shadow(0 4px 10px rgba(255,90,0,.7))" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="m5 12 7 7 7-7" /></svg>
                  </span>
                </div>
              )}
            </div>
          </button>

          {/* floating chips */}
          <div aria-hidden="true" className="fg-floaty pointer-events-none absolute right-[-6px] top-6 z-[3] flex items-center gap-2.5 rounded-[13px] border border-[rgba(255,122,0,0.22)] bg-[rgba(20,17,14,.92)] px-[15px] py-[11px] backdrop-blur shadow-[0_18px_36px_-16px_rgba(0,0,0,0.85)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.14)] text-[#FF9A45]"><FiIcon id="foto" size={19} strokeWidth={1.7} /></span>
            <div><div className="font-sora text-[15px] font-extrabold leading-none text-white">7 stijlen</div><div className="mt-0.5 text-[10px] text-white/50">fotografie</div></div>
          </div>
          <div aria-hidden="true" className="fg-floaty d pointer-events-none absolute bottom-[22px] left-[-10px] z-[3] flex items-center gap-2.5 rounded-[13px] border border-[rgba(255,122,0,0.22)] bg-[rgba(20,17,14,.92)] px-[15px] py-[11px] backdrop-blur shadow-[0_18px_36px_-16px_rgba(0,0,0,0.85)]">
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-[rgba(90,196,125,0.16)]"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5ac47d" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
            <span className="text-[13px] font-bold text-white">Web + print klaar</span>
          </div>

          {/* shutter button */}
          <div className="absolute bottom-[-16px] left-1/2 z-[4] -translate-x-1/2">
            <button
              type="button"
              onClick={onShutter}
              aria-label="Maak de foto"
              className="fg-shutter relative flex h-[66px] w-[66px] items-center justify-center rounded-full text-white"
              style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)", boxShadow: "0 18px 42px -14px rgba(255,90,0,.9),inset 0 1px 0 rgba(255,255,255,.35)" }}
            >
              <FiIcon id={btnIcon} size={30} strokeWidth={1.9} className="fg-shutico" />
            </button>
          </div>
        </div>
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
    </section>
  );
}
