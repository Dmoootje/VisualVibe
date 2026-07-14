import type { ReactNode, SVGProps } from "react";

// Custom 24x24 line icons for the service cards. `id` maps to the service;
// each is drawn with fill:none, stroke:currentColor, round caps/joins.
const PATHS: Record<string, ReactNode> = {
  website: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18" />
      <path d="M6 6.75h.01M8.5 6.75h.01" />
      <path d="M7 13h5M7 16h9" />
    </>
  ),
  webshop: (
    <>
      <circle cx="9.5" cy="20" r="1.1" />
      <circle cx="18" cy="20" r="1.1" />
      <path d="M2.5 3.5H5l2.3 11.2a1.4 1.4 0 0 0 1.4 1.1h8.6a1.4 1.4 0 0 0 1.4-1.1L21.5 7.5H6" />
    </>
  ),
  onepager: (
    <>
      <rect x="5.5" y="2.5" width="13" height="19" rx="2" />
      <path d="M8.5 7h7M8.5 11h7M8.5 15h4.5" />
    </>
  ),
  vernieuwen: (
    <>
      <path d="M20.5 8A8.5 8.5 0 0 0 6 5L3.5 7.2" />
      <path d="M3.5 3v4.2h4.2" />
      <path d="M3.5 16A8.5 8.5 0 0 0 18 19l2.5-2.2" />
      <path d="M20.5 21v-4.2h-4.2" />
    </>
  ),
  onderhoud: (
    <path d="M14.7 6.3a4.2 4.2 0 0 0-5.4 5.4L3.2 17.8l3 3 6.1-6.1a4.2 4.2 0 0 0 5.4-5.4l-2.6 2.6-2.6-.7-.7-2.6z" />
  ),
  wordpress: (
    <>
      <path d="M11.5 20H21" />
      <path d="M16.6 3.4a2 2 0 0 1 2.9 2.9L7 18.8l-4 1 1-4z" />
      <path d="M4 4.5h5M4 8h3.5" />
    </>
  ),
  seo: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
      <path d="M8.6 12.5v-1.5M11 12.5V9M13.4 12.5V8" />
    </>
  ),
  "ai-website": (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18" />
      <path d="M6 6.75h.01M8.5 6.75h.01" />
      <path d="m13 11.2.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z" />
    </>
  ),
  software: (
    <>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m14 4-4 16" />
      <circle cx="12" cy="12" r="9" opacity=".35" />
    </>
  ),
  // SEO-subdienst glyphs (SEO-dienstenpagina).
  "seo-lokaal": (
    <>
      <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  "seo-technisch": (
    <>
      <path d="M4 14a8 8 0 0 1 16 0" />
      <path d="m12 14 4.2-3.6" />
      <circle cx="12" cy="14" r="1.2" />
      <path d="M4 18h16" />
    </>
  ),
  "seo-copy": (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
  "seo-gbp": (
    <>
      <path d="M3.5 9 5 4h14l1.5 5" />
      <path d="M4.5 9v10h15V9" />
      <path d="M9.5 19v-5h5v5" />
      <path d="M3.5 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
    </>
  ),
  "seo-ai": (
    <>
      <path d="M12 3.2 13.7 8 18 9.5 13.7 11 12 15.8 10.3 11 6 9.5 10.3 8z" />
      <path d="M18 14.5l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z" />
    </>
  ),
  // Hoofddienst-categorie glyphs (gebruikt op de regio-dienstenkaarten).
  webdesign: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18" />
      <path d="M6 6.75h.01M8.5 6.75h.01" />
      <path d="M7 13h5M7 16h9" />
    </>
  ),
  fotografie: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8.5 7 10 4.5h4L15.5 7" />
      <circle cx="12" cy="13.5" r="3.4" />
    </>
  ),
  videografie: (
    <>
      <rect x="3" y="7" width="12" height="10" rx="2" />
      <path d="M15 10.5 21 7v10l-6-3.5z" />
    </>
  ),
  "drone-fpv": (
    <>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="m8 8 2 2M16 8l-2 2M8 16l2-2M16 16l-2-2" />
    </>
  ),
  "3d-vr-ar": (
    <>
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5 12 12l8-4.5" />
      <path d="M12 12v9" />
    </>
  ),
  podcasting: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v3M9 21h6" />
    </>
  ),
  masterclasses: (
    <>
      <path d="M12 4 2 9l10 5 10-5-10-5z" />
      <path d="M6 11v4c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-4" />
      <path d="M22 9v5" />
    </>
  ),
};

/** Just the inner paths for one glyph, to embed inside another <svg>/<g>. */
export function SvcGlyph({ id }: { id: string }) {
  return <>{PATHS[id] ?? null}</>;
}

/** True when a glyph exists for this id. */
export const hasSvcGlyph = (id: string) => id in PATHS;

export function SvcIcon({
  id,
  size = 24,
  strokeWidth = 1.7,
  ...rest
}: { id: string; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {PATHS[id]}
    </svg>
  );
}
