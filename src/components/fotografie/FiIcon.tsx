import type { ReactNode, SVGProps } from "react";

// The inline icon set from the Fotografie handoff (defs `#fi-*`). Each is drawn
// with fill:none, stroke:currentColor, round caps/joins.
const PATHS: Record<string, ReactNode> = {
  foto: (
    <>
      <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="12.5" r="3.4" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m16 10 5-3v10l-5-3z" />
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
  web: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18" />
      <path d="M6 6.75h.01M8.5 6.75h.01" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  aperture: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v6.5M20 8l-5.6 3.2M20 16l-5.6-3.2M12 21v-6.5M4 16l5.6-3.2M4 8l5.6 3.2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  box: (
    <>
      <path d="M12 2.5 21 7v10l-9 4.5L3 17V7z" />
      <path d="M3 7l9 4.5L21 7" />
      <path d="M12 21.5v-10" />
    </>
  ),
  cal: (
    <>
      <rect x="3" y="4.5" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </>
  ),
  home: (
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </>
  ),
  spark: (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  ),
  heart: (
    <path d="M12 20s-7-4.6-9.4-9.1C1 8 2.6 4.6 6 4.6c2 0 3.3 1.2 4 2.3.7-1.1 2-2.3 4-2.3 3.4 0 5 3.4 3.4 6.3C19 15.4 12 20 12 20z" />
  ),
  biz: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
      <path d="M12 12.5v2" />
    </>
  ),
  party: (
    <>
      <path d="M3 21l4.6-11.4 6.8 6.8L3 21z" />
      <path d="M13.5 3.5l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" />
      <path d="M19.5 10l.5 1.1 1.1.5-1.1.5-.5 1.1-.5-1.1-1.1-.5 1.1-.5z" />
    </>
  ),
  sport: (
    <>
      <path d="M6 4h12v3.5a6 6 0 0 1-12 0V4z" />
      <path d="M6 5H3.4v1.6A3.4 3.4 0 0 0 7 10M18 5h2.6v1.6A3.4 3.4 0 0 1 17 10" />
      <path d="M12 13.5V16" />
      <path d="M8.5 20h7M9.6 20a2.4 2.4 0 0 1 4.8 0" />
    </>
  ),
};

export function FiIcon({
  id,
  size = 24,
  strokeWidth = 1.8,
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
      {PATHS[id] ?? PATHS.aperture}
    </svg>
  );
}
