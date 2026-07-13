"use client";

import { useMemo } from "react";
import { weddingVibeConfig, type WvImage as WvImageData } from "../config/weddingvibe.config";
import { useWvModal } from "./WvModalContext";
import { WvImage } from "./WvImage";

const PETAL_COLORS = ["#EDDC78", "#D2AC47", "#F2D8D2", "#E8D5BC", "#FBF3E4", "#DFBE6F"];

/**
 * Deterministische pseudo-random (LCG): zelfde blaadjes op server en client,
 * dus geen hydration-mismatch (Math.random zou dat wel geven).
 */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type Petal = {
  left: string;
  width: number;
  height: number;
  color: string;
  fallDur: string;
  fallDelay: string;
  swayDur: string;
  swayDelay: string;
};

function buildPetals(count: number): Petal[] {
  const rnd = seededRandom(20260713);
  const petals: Petal[] = [];
  for (let i = 0; i < count; i++) {
    const w = 9 + rnd() * 10;
    petals.push({
      left: `${(rnd() * 100).toFixed(1)}%`,
      width: Math.round(w),
      height: Math.round(w * 0.82),
      color: PETAL_COLORS[i % PETAL_COLORS.length],
      fallDur: `${(9 + rnd() * 9).toFixed(1)}s`,
      fallDelay: `${(-rnd() * 18).toFixed(1)}s`,
      swayDur: `${(2.2 + rnd() * 2.4).toFixed(1)}s`,
      swayDelay: `${(-rnd() * 3).toFixed(1)}s`,
    });
  }
  return petals;
}

export function WeddingHero({ fallbackImage }: { fallbackImage: WvImageData }) {
  const { openModal } = useWvModal();
  const { hero, settings } = weddingVibeConfig;
  const petals = useMemo(() => (settings.bloemblaadjes ? buildPetals(32) : []), [settings.bloemblaadjes]);
  const videoId = settings.heroVideoId;

  return (
    <header
      id="top"
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden text-center"
    >
      {/* Fallback-foto achter de video */}
      <div className="absolute inset-0">
        <WvImage image={fallbackImage} />
      </div>

      {/* Fullscreen YouTube-loop, cover-fit */}
      {videoId && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3`}
            title="WeddingVibe herovideo"
            allow="autoplay; encrypted-media"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[max(100vh,56.25vw)] w-[max(100vw,178vh)] -translate-x-1/2 -translate-y-1/2 border-0"
          />
        </div>
      )}

      {/* Donkere scrim */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,rgba(30,24,18,.42) 0%,rgba(30,24,18,.48) 55%,rgba(30,24,18,.7) 100%)",
        }}
      />

      {/* Dwarrelende bloemblaadjes */}
      {petals.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden" aria-hidden="true">
          {petals.map((petal, i) => (
            <div
              key={i}
              className="wv-petal absolute top-[-40px]"
              style={{ left: petal.left, animation: `wvFall ${petal.fallDur} linear ${petal.fallDelay} infinite` }}
            >
              <div
                style={{
                  width: petal.width,
                  height: petal.height,
                  background: petal.color,
                  borderRadius: "62% 38% 58% 42%",
                  opacity: 0.8,
                  animation: `wvSway ${petal.swayDur} ease-in-out ${petal.swayDelay} infinite alternate`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Tekst */}
      <div className="relative z-[8] flex max-w-[880px] flex-col items-center px-[clamp(20px,5vw,48px)] pb-[90px] pt-[120px]">
        <div className="wv-rise mb-[26px] flex items-center gap-4" style={{ animationDelay: ".1s" }}>
          <span className="h-px w-11" style={{ background: "linear-gradient(90deg,transparent,#EDDC78)" }} />
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#EDDC78]">{hero.overline}</span>
          <span className="h-px w-11" style={{ background: "linear-gradient(90deg,#EDDC78,transparent)" }} />
        </div>
        <h1
          className="wv-serif wv-rise m-0 text-[clamp(46px,7.4vw,86px)] font-medium leading-[1.04] text-white [text-wrap:balance]"
          style={{ animationDelay: ".25s" }}
        >
          {hero.titleLines[0]}
          <br />
          {hero.titleLines[1]}
        </h1>
        <div
          className="wv-script wv-gold-gradient-text wv-rise mt-1.5 text-[clamp(40px,6vw,72px)] leading-[1.15]"
          style={{ animationDelay: ".4s" }}
        >
          {hero.script}
        </div>
        <p
          className="wv-rise mt-[26px] max-w-[600px] text-[clamp(16px,1.4vw,18px)] leading-[1.75] text-[rgba(255,255,255,0.88)]"
          style={{ animationDelay: ".55s" }}
        >
          {hero.intro}
        </p>
        <div
          className="wv-rise mt-[38px] flex w-full flex-col flex-wrap justify-center gap-4 sm:w-auto sm:flex-row"
          style={{ animationDelay: ".7s" }}
        >
          <a href="#werk" className="wv-btn wv-btn--gold w-full sm:w-auto">
            {hero.primaryCta}
          </a>
          <button type="button" onClick={openModal} className="wv-btn wv-btn--outline-light w-full sm:w-auto">
            {hero.secondaryCta}
          </button>
        </div>
        <div
          className="wv-rise mt-[34px] text-xs uppercase leading-8 tracking-[0.16em] text-[rgba(255,255,255,0.72)]"
          style={{ animationDelay: ".85s" }}
        >
          {hero.trustLine}
          <br />
          <span className="text-[rgba(255,255,255,0.55)]">{hero.trustSub}</span>
        </div>
      </div>
    </header>
  );
}
