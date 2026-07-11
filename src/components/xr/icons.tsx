import type { ReactElement, SVGProps } from "react";

// Icon set for the 3D, VR & AR service + realisatie pages (from the handoff
// `xr-*` <defs>). Stroke icons use currentColor; the play glyph is filled.

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

// Service glyphs keyed by id (overzicht / related / chips / HUD).
const XR_PATHS: Record<string, ReactElement> = {
  cube: (
    <>
      <path d="M12 2.5 21 7v10l-9 4.5L3 17V7z" />
      <path d="m3 7 9 4.5L21 7" />
      <path d="M12 21.5v-10" />
    </>
  ),
  vr: (
    <path d="M3 8.5h18a1 1 0 0 1 1 1V15a2 2 0 0 1-2 2h-3.2a2 2 0 0 1-1.7-1l-.9-1.5a1.5 1.5 0 0 0-2.6 0l-.9 1.5a2 2 0 0 1-1.7 1H4a2 2 0 0 1-2-2V9.5a1 1 0 0 1 1-1z" />
  ),
  ar: (
    <>
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
      <path d="M12 8.5 15.5 10.5v3L12 15.5 8.5 13.5v-3z" />
      <path d="M8.5 10.5 12 12.5l3.5-2M12 12.5v3" />
    </>
  ),
  tour: (
    <>
      <path d="M12 2v20M2 12h20" />
      <path d="m9 5 3-3 3 3M9 19l3 3 3-3M5 9l-3 3 3 3M19 9l3 3-3 3" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </>
  ),
  config: (
    <>
      <path d="M12 2.5 21 7v10l-9 4.5L3 17V7z" />
      <path d="m3 7 9 4.5L21 7" />
      <path d="M12 21.5v-10" />
      <circle cx="17.5" cy="9.2" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
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
  pin: (
    <>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
};

export function XrIcon({ id, size = 20, strokeWidth = 1.7, ...rest }: { id: string } & IconProps) {
  return <svg {...strokeProps(size, strokeWidth, rest)}>{XR_PATHS[id] ?? XR_PATHS.cube}</svg>;
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

export const PlayGlyph = ({ size = 30, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);
