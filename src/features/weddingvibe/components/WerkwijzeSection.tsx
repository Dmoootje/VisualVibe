"use client";

import { useRef } from "react";
import { weddingVibeConfig } from "../config/weddingvibe.config";

/** Werkwijze: 6 stappenkaarten in een scroll-snap-carrousel met pijlknoppen. */
export function WerkwijzeSection() {
  const { werkwijze } = weddingVibeConfig;
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: Math.max(el.clientWidth * 0.7, 300) * direction, behavior: "smooth" });
  };

  return (
    <section id="werkwijze" className="wv-section bg-white">
      <div className="wv-container">
        <div data-reveal className="mx-auto mb-[clamp(52px,6vw,80px)] max-w-[640px] text-center">
          <div className="wv-overline-row wv-overline-row--center">
            <span className="wv-hairline wv-hairline--in" aria-hidden="true" />
            <span className="wv-overline">{werkwijze.overline}</span>
            <span className="wv-hairline wv-hairline--out" aria-hidden="true" />
          </div>
          <h2 className="wv-h2 !text-[clamp(34px,4.4vw,54px)] !leading-[1.1]">
            {werkwijze.title} <em>{werkwijze.accent}</em>
          </h2>
        </div>

        <div data-reveal className="relative">
          <div
            ref={trackRef}
            className="wv-scroll flex gap-[clamp(22px,3vw,36px)] overflow-x-auto px-0.5 pb-3 pt-1.5 [scroll-snap-type:x_mandatory]"
          >
            {werkwijze.steps.map((step, i) => (
              <div
                key={step.title}
                className="relative flex-[0_0_min(290px,76vw)] border-t border-[rgba(194,154,75,0.35)] pt-[30px] [scroll-snap-align:start]"
              >
                <span className="absolute left-0 top-[-5px] h-[9px] w-[9px] rotate-45 bg-[#C29A4B]" aria-hidden="true" />
                <div className="wv-serif mb-3 text-[40px] italic leading-none text-[rgba(194,154,75,0.75)]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h4 className="wv-serif m-0 mb-2.5 text-[22px] font-semibold">{step.title}</h4>
                <p className="m-0 text-[14.5px] leading-[1.7] text-[#6B5F55]">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-[26px] flex justify-center gap-3.5">
            <button type="button" onClick={() => scrollBy(-1)} className="wv-roundbtn" aria-label="Vorige stappen">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 2 L 4 8 L 10 14" />
              </svg>
            </button>
            <button type="button" onClick={() => scrollBy(1)} className="wv-roundbtn" aria-label="Volgende stappen">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2 L 12 8 L 6 14" />
              </svg>
            </button>
          </div>
        </div>

        <div data-reveal className="mt-[clamp(32px,4vw,44px)] text-center">
          <a href="#contact" className="wv-btn wv-btn--gold">
            {werkwijze.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
