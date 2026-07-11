import type { ReactElement, SVGProps } from "react";

// Icon set for the Drone & FPV service page (from the handoff `dr-*` defs).
// Stroke icons use currentColor; the play/YouTube glyphs are filled.

type IconProps = { size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>;

const strokeProps = (size: number, sw: number, rest: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24" as const,
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: sw,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...rest,
});

// Service glyphs keyed by id (overzicht / related / split headers).
const DR_PATHS: Record<string, ReactElement> = {
  foto: (
    <>
      <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="12.5" r="3.4" />
    </>
  ),
  video: (
    <>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="m16 10 6-3v10l-6-3z" />
    </>
  ),
  fpv: <path d="M3 12h4l2-5 3 10 2-7 2 4h5" />,
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01M10 21v-4h4v4" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </>
  ),
  cal: (
    <>
      <rect x="3" y="4.5" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </>
  ),
  cube: (
    <>
      <path d="M12 2.5 21 7v10l-9 4.5L3 17V7z" />
      <path d="m3 7 9 4.5L21 7" />
      <path d="M12 21.5v-10" />
    </>
  ),
  drone: (
    <>
      <circle cx="5" cy="5" r="2.4" />
      <circle cx="19" cy="5" r="2.4" />
      <circle cx="5" cy="19" r="2.4" />
      <circle cx="19" cy="19" r="2.4" />
      <path d="M6.7 6.7 9.5 9.5M17.3 6.7 14.5 9.5M6.7 17.3 9.5 14.5M17.3 17.3 14.5 14.5" />
      <rect x="9.2" y="9.2" width="5.6" height="5.6" rx="1.4" />
    </>
  ),
};

export function DrIcon({ id, size = 20, strokeWidth = 1.7, ...rest }: { id: string } & IconProps) {
  return <svg {...strokeProps(size, strokeWidth, rest)}>{DR_PATHS[id] ?? DR_PATHS.drone}</svg>;
}

export const ArrowRight = ({ size = 17, strokeWidth = 2.4, ...rest }: IconProps) => (
  <svg {...strokeProps(size, strokeWidth, rest)}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const ArrowDown = ({ size = 16, strokeWidth = 2.4, ...rest }: IconProps) => (
  <svg {...strokeProps(size, strokeWidth, rest)}>
    <path d="M12 5v14" />
    <path d="m5 12 7 7 7-7" />
  </svg>
);

export const ChevronLeft = ({ size = 18, strokeWidth = 2.2, ...rest }: IconProps) => (
  <svg {...strokeProps(size, strokeWidth, rest)}><path d="m15 18-6-6 6-6" /></svg>
);

export const ChevronRight = ({ size = 18, strokeWidth = 2.2, ...rest }: IconProps) => (
  <svg {...strokeProps(size, strokeWidth, rest)}><path d="m9 18 6-6-6-6" /></svg>
);

export const Close = ({ size = 18, strokeWidth = 2.2, ...rest }: IconProps) => (
  <svg {...strokeProps(size, strokeWidth, rest)}><path d="M18 6 6 18M6 6l12 12" /></svg>
);

export const Expand = ({ size = 19, strokeWidth = 2, ...rest }: IconProps) => (
  <svg {...strokeProps(size, strokeWidth, rest)}><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
);

export const Check = ({ size = 13, strokeWidth = 3, ...rest }: IconProps) => (
  <svg {...strokeProps(size, strokeWidth, rest)}><path d="M20 6 9 17l-5-5" /></svg>
);

export const PlayGlyph = ({ size = 24, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);
