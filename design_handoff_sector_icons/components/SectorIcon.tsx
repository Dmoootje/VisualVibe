"use client";
import React from "react";

export type SectorIconProps = {
  /** sector slug, e.g. "horeca" (matches the sprite symbol id) */
  id: string;
  /** rendered pixel size (square). Default 34. */
  size?: number;
  /** enable the subtle pulse-glow + shimmer. Default true. */
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * A single sector glyph. Requires <SectorIconSprite/> mounted once in the tree,
 * and the visualvibe.css stylesheet imported globally.
 * Colour comes from CSS var --vv-accent (via currentColor).
 */
export function SectorIcon({ id, size = 34, animate = true, className, style }: SectorIconProps) {
  return (
    <svg
      className={"vv-ico " + (animate ? "vv-animate " : "") + (className || "")}
      viewBox="0 0 48 48"
      style={{ width: size, height: size, ...style }}
      role="img"
      aria-label={id}
    >
      <use className="vv-base" href={"#sector-" + id} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <use className="vv-shim" href={"#sector-" + id} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The large decorative "hero" treatment used on a sector detail page:
 * radial glow + two counter-rotating dashed rings + the glyph, centred.
 */
export function SectorHeroEmblem({ id, size = 340, animate = true }: { id: string; size?: number; animate?: boolean }) {
  const gid = "vvHeroGlow-" + id;
  const dim = "min(" + size + "px, 84vw)";
  return (
    <svg className={"vv-ico " + (animate ? "vv-animate" : "")} viewBox="0 0 200 200" style={{ width: dim, height: dim }}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(242,138,16,0.30)" />
          <stop offset="55%" stopColor="rgba(242,138,16,0.07)" />
          <stop offset="100%" stopColor="rgba(242,138,16,0)" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="99" fill={"url(#" + gid + ")"} />
      <circle className="vv-ring" cx="100" cy="100" r="94" fill="none" stroke="rgba(242,138,16,0.30)" strokeWidth={1} strokeDasharray="2 9" strokeLinecap="round" />
      <circle className="vv-ring2" cx="100" cy="100" r="79" fill="none" stroke="rgba(242,138,16,0.18)" strokeWidth={1} strokeDasharray="1 11" strokeLinecap="round" />
      <circle cx="100" cy="100" r="67" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      <use className="vv-base" href={"#sector-" + id} width={48} height={48} transform="translate(54.4 54.4) scale(1.9)" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <use className="vv-shim" href={"#sector-" + id} width={48} height={48} transform="translate(54.4 54.4) scale(1.9)" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
