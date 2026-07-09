"use client";
import React, { useState, useEffect, useMemo } from "react";

export type CTAProps = {
  heading?: string;
  ctaLabel?: string;
  href?: string;
  /** Force a specific variant (0-3). Omit for a random surprise on each load. */
  variant?: 0 | 1 | 2 | 3;
};

const Arrow = () => (
  <svg className="cta-arrow" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

function useBubbles(n = 16) {
  return useMemo(() => {
    const r = (a: number, b: number) => Math.round((a + Math.random() * (b - a)) * 100) / 100;
    return Array.from({ length: n }, (_, i) => {
      const s = r(6, 16);
      return { key: i, left: r(4, 96) + "%", size: s, dur: r(4.5, 9) + "s", delay: r(0, 6) + "s" };
    });
  }, []);
}

/**
 * Animated VisualVibe CTA. Renders one of 4 variants at random on each mount
 * (SSR-safe: starts on variant 0, re-rolls after hydration so no mismatch).
 * Pass `variant` to pin a specific one. Requires styles/cta.css imported globally.
 */
export function CTABlock({
  heading = "Actief in kmo? Laten we kennismaken.",
  ctaLabel = "Offerte aanvragen",
  href = "/contact",
  variant,
}: CTAProps) {
  const [v, setV] = useState<number>(variant ?? 0);
  useEffect(() => {
    if (variant == null) setV(Math.floor(Math.random() * 4));
  }, [variant]);
  const bubbles = useBubbles();

  if (v === 0) {
    return (
      <div className="cta-ring">
        <div className="cta-panel bg-a">
          <div className="cta-content">
            <h3 className="cta-h">{heading}</h3>
            <a className="cta-btn grad pulseGlow" href={href}>{ctaLabel} <Arrow /></a>
          </div>
        </div>
      </div>
    );
  }
  if (v === 1) {
    return (
      <div className="cta-panel bg-b">
        <div className="cta-bubbles" aria-hidden="true">
          {bubbles.map((b) => (
            <span key={b.key} className="bubble" style={{ left: b.left, width: b.size, height: b.size, animationDuration: b.dur, animationDelay: b.delay }} />
          ))}
        </div>
        <div className="cta-content">
          <h3 className="cta-h">{heading}</h3>
          <a className="cta-btn grad" href={href} style={{ boxShadow: "0 14px 40px -12px rgba(255,90,0,0.7)" }}>{ctaLabel} <Arrow /></a>
        </div>
      </div>
    );
  }
  if (v === 2) {
    return (
      <div className="cta-panel bg-c orb">
        <div className="cta-content">
          <h3 className="cta-h">{heading}</h3>
          <a className="cta-btn cta-ghost" href={href}>{ctaLabel} <Arrow /></a>
        </div>
      </div>
    );
  }
  return (
    <div className="cta-panel bg-d">
      <div className="cta-breathe" aria-hidden="true" />
      <div className="cta-content">
        <h3 className="cta-h">{heading}</h3>
        <a className="cta-btn gflow shine" href={href}>{ctaLabel} <Arrow /></a>
      </div>
    </div>
  );
}
