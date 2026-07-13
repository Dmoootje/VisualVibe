"use client";

import { useState } from "react";
import { weddingVibeConfig, type WvImage as WvImageData } from "../config/weddingvibe.config";
import { WvImage } from "./WvImage";

/**
 * Huwelijksvideo: posterblok met pulserende playknop. Met een geconfigureerd
 * videoId wordt bij klik de YouTube-embed geladen (geen third-party request
 * vóór interactie); zonder id scrolt de knop naar het contactblok.
 */
export function VideoSection({ poster }: { poster: WvImageData }) {
  const { video } = weddingVibeConfig;
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (video.videoId) {
      setPlaying(true);
    } else {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="video" className="wv-section bg-white !px-0 !pb-0">
      <div data-reveal className="mx-auto mb-[clamp(44px,5vw,64px)] max-w-[720px] px-[clamp(20px,5vw,48px)] text-center">
        <div className="wv-overline-row wv-overline-row--center">
          <span className="wv-hairline wv-hairline--in" aria-hidden="true" />
          <span className="wv-overline">{video.overline}</span>
          <span className="wv-hairline wv-hairline--out" aria-hidden="true" />
        </div>
        <h2 className="wv-h2 mb-3 !text-[clamp(32px,4.2vw,52px)]">{video.title}</h2>
        <div className="wv-script mb-[22px] text-[clamp(30px,3.6vw,46px)] text-[#B08A3E]">{video.script}</div>
        <p className="wv-body">{video.intro}</p>
      </div>

      <div data-reveal className="relative mx-auto min-h-[380px] max-w-[1440px] overflow-hidden" style={{ aspectRatio: "21/10" }}>
        {playing && video.videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title="Huwelijksfilm van WeddingVibe"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <>
            <div className="absolute inset-0">
              <WvImage image={poster} />
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse at center,rgba(30,24,18,.08),rgba(30,24,18,.42))" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-[22px]">
              <button
                type="button"
                onClick={handlePlay}
                aria-label="Speel de huwelijksfilm af"
                className="flex h-[94px] w-[94px] cursor-pointer items-center justify-center rounded-full border border-[rgba(237,220,120,0.9)] bg-[rgba(30,24,18,0.35)] backdrop-blur-[6px] transition-transform duration-300 hover:scale-[1.08]"
                style={{ animation: "wvPulse 2.6s ease-out infinite" }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#EDDC78" aria-hidden="true">
                  <path d="M8 5.5 L 19 12 L 8 18.5 Z" />
                </svg>
              </button>
              <a
                href="#contact"
                className="border-b border-[rgba(255,255,255,0.5)] pb-[5px] text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:text-[#EDDC78]"
              >
                {video.linkLabel}
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
