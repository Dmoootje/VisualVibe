import type { ReactNode, SVGProps } from "react";

// The 7 custom 24x24 line icons from the Subdiensten handoff. `id` maps to the
// service; each is drawn with fill:none, stroke:currentColor, round caps/joins.
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
