import type { ReactElement, SVGProps } from "react";

// Small inline glyph set for the Videografie service page (kept local so the
// page stays self-contained). Stroke icons use currentColor; the YouTube and
// play glyphs are filled.

type IconProps = { size?: number } & SVGProps<SVGSVGElement>;

const stroke = (size: number, sw: number, rest: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24" as const,
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: sw,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...rest,
});

export const PlayGlyph = ({ size = 24, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);

export const YouTubeGlyph = ({ size = 17, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF3B2E" aria-hidden="true" {...rest}>
    <path d="M23 12s0-3.5-.4-5.2a2.7 2.7 0 0 0-1.9-1.9C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.7.4a2.7 2.7 0 0 0-1.9 1.9C1 8.5 1 12 1 12s0 3.5.4 5.2a2.7 2.7 0 0 0 1.9 1.9c1.8.4 8.7.4 8.7.4s6.9 0 8.7-.4a2.7 2.7 0 0 0 1.9-1.9C23 15.5 23 12 23 12z" />
    <path d="M10 15.5 15 12l-5-3.5z" fill="#fff" />
  </svg>
);

export const ArrowRight = ({ size = 17, strokeWidth = 2.4, ...rest }: IconProps & { strokeWidth?: number }) => (
  <svg {...stroke(size, strokeWidth, rest)} aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const ArrowDown = ({ size = 16, strokeWidth = 2.4, ...rest }: IconProps & { strokeWidth?: number }) => (
  <svg {...stroke(size, strokeWidth, rest)} aria-hidden="true">
    <path d="M12 5v14" />
    <path d="m5 12 7 7 7-7" />
  </svg>
);

export const Chevron = ({ size = 18, strokeWidth = 2.2, ...rest }: IconProps & { strokeWidth?: number }) => (
  <svg {...stroke(size, strokeWidth, rest)} aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronLeft = ({ size = 18, strokeWidth = 2.2, ...rest }: IconProps & { strokeWidth?: number }) => (
  <svg {...stroke(size, strokeWidth, rest)} aria-hidden="true">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRight = ({ size = 18, strokeWidth = 2.2, ...rest }: IconProps & { strokeWidth?: number }) => (
  <svg {...stroke(size, strokeWidth, rest)} aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const Close = ({ size = 18, strokeWidth = 2.2, ...rest }: IconProps & { strokeWidth?: number }) => (
  <svg {...stroke(size, strokeWidth, rest)} aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const Camera = ({ size = 19, strokeWidth = 1.9, ...rest }: IconProps & { strokeWidth?: number }) => (
  <svg {...stroke(size, strokeWidth, rest)} aria-hidden="true">
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="m16 10 6-3v10l-6-3z" />
  </svg>
);

export const Check = ({ size = 13, strokeWidth = 3, ...rest }: IconProps & { strokeWidth?: number }) => (
  <svg {...stroke(size, strokeWidth, rest)} aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const Volume = ({ size = 16, strokeWidth = 2, ...rest }: IconProps & { strokeWidth?: number }) => (
  <svg {...stroke(size, strokeWidth, rest)} aria-hidden="true">
    <path d="M11 5 6 9H2v6h4l5 4z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
  </svg>
);

export const Fullscreen = ({ size = 16, strokeWidth = 2, ...rest }: IconProps & { strokeWidth?: number }) => (
  <svg {...stroke(size, strokeWidth, rest)} aria-hidden="true">
    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);

// Related-diensten chip icons, keyed by service slug.
const REL_PATHS: Record<string, ReactElement> = {
  fotografie: (
    <>
      <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="12.5" r="3.4" />
    </>
  ),
  "drone-fpv": (
    <>
      <circle cx="5" cy="5" r="2.4" />
      <circle cx="19" cy="5" r="2.4" />
      <circle cx="5" cy="19" r="2.4" />
      <circle cx="19" cy="19" r="2.4" />
      <path d="M6.7 6.7 9.5 9.5M17.3 6.7 14.5 9.5M6.7 17.3 9.5 14.5M17.3 17.3 14.5 14.5" />
      <rect x="9.2" y="9.2" width="5.6" height="5.6" rx="1.4" />
    </>
  ),
  podcasting: (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v4M9 21h6" />
    </>
  ),
};

export const RelIcon = ({ slug, size = 16, ...rest }: { slug: string } & IconProps) => (
  <svg {...stroke(size, 1.7, rest)} aria-hidden="true">
    {REL_PATHS[slug] ?? REL_PATHS.fotografie}
  </svg>
);

// Overzicht glyphs, keyed by videografie subservice slug.
const DIENST_PATHS: Record<string, ReactElement> = {
  bedrijfsvideo: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01M10 21v-4h4v4" />
    </>
  ),
  promovideo: (
    <>
      <path d="m3 11 13-5v12L3 13z" />
      <path d="M16 8.5a3 3 0 0 1 0 5" />
      <path d="M6 13v4a2 2 0 0 0 2 2h1" />
    </>
  ),
  "social-media-video": (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  "event-aftermovie": (
    <>
      <rect x="3" y="4.5" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </>
  ),
  wervingsvideo: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.2 2.7-5.4 6-5.4s6 2.2 6 5.4" />
      <path d="M16 5.2a3 3 0 0 1 0 5.6M21.5 20c0-2.6-1.7-4.5-4.2-5.1" />
    </>
  ),
  "testimonial-video": (
    <>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z" />
      <path d="M9.5 10.5h.01M12 10.5h.01M14.5 10.5h.01" />
    </>
  ),
  "podcast-video": (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v4M9 21h6" />
    </>
  ),
  nieuwsreportage: (
    <>
      <path d="M4 6h13v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 19V7a1 1 0 0 1 1-1z" />
      <path d="M17 9h2.5A1.5 1.5 0 0 1 21 10.5V19a1.5 1.5 0 0 1-1.5 1.5M7 10h6M7 13h6M7 16h4" />
    </>
  ),
};

export const DienstIcon = ({ slug, size = 19, ...rest }: { slug: string } & IconProps) => (
  <svg {...stroke(size, 1.7, rest)} aria-hidden="true">
    {DIENST_PATHS[slug] ?? DIENST_PATHS.bedrijfsvideo}
  </svg>
);
