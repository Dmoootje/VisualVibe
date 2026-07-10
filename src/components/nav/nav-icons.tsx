import type { ReactNode, SVGProps } from "react";

// All nav glyphs (24x24 line icons) used by the Diensten mega-menu + drawer.
// The svc-* set is shared with the Subdiensten handoff; the pd-* set is new
// (pillar icons for the non-webdesign services). fill:none, currentColor stroke.
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
  camera: (
    <>
      <path d="M4 7.5h3l1.8-2h6.4L17 7.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.4" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9.5h18M8 5v14M16 5v14" />
      <path d="M10.5 11.2v3.6l3-1.8z" />
    </>
  ),
  drone: (
    <>
      <circle cx="5.5" cy="5.5" r="2.4" />
      <circle cx="18.5" cy="5.5" r="2.4" />
      <circle cx="5.5" cy="18.5" r="2.4" />
      <circle cx="18.5" cy="18.5" r="2.4" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" />
      <path d="M7.4 7.4 9 9M16.6 7.4 15 9M7.4 16.6 9 15M16.6 16.6 15 15" />
    </>
  ),
  cube: (
    <>
      <path d="M12 2.5 21 7v10l-9 4.5L3 17V7z" />
      <path d="M12 12.5V21M12 12.5 21 7M12 12.5 3 7" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v4M8.5 21h7" />
    </>
  ),
  cap: (
    <>
      <path d="M12 4 2.5 9 12 14l9.5-5z" />
      <path d="M6.5 11.3V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.7" />
      <path d="M21.5 9v5" />
    </>
  ),
};

export function NavIcon({
  id,
  size = 20,
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
      {PATHS[id] ?? null}
    </svg>
  );
}
