import { cn } from "@/lib/utils";

/**
 * Single-colour stroke icons for the eight kennisbank categories, matching the
 * design handoff's `cat-*` symbol set. Pure SVG so it renders on the server and
 * inherits `currentColor`. Keyed by category slug (from kennisbankCategories).
 */
export type KbCategoryIconSlug =
  | "seo-geo"
  | "webdesign"
  | "fotografie"
  | "videografie"
  | "drone"
  | "3d-vr"
  | "podcasting"
  | "masterclasses"
  | "all";

const PATHS: Record<KbCategoryIconSlug, React.ReactNode> = {
  "seo-geo": (
    <>
      <circle cx="10.5" cy="10.5" r="7.5" />
      <path d="M21 21l-4.8-4.8" />
      <path d="M7.6 12.5V11M10.5 12.5V9.5M13.4 12.5V8" />
    </>
  ),
  webdesign: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M6.4 6.5h.01M8.9 6.5h.01M11.4 6.5h.01" />
    </>
  ),
  fotografie: (
    <>
      <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="12.5" r="3.4" />
    </>
  ),
  videografie: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m16 10 5-3v10l-5-3z" />
    </>
  ),
  drone: (
    <>
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <circle cx="5" cy="5" r="2.3" />
      <circle cx="19" cy="5" r="2.3" />
      <circle cx="5" cy="19" r="2.3" />
      <circle cx="19" cy="19" r="2.3" />
      <path d="M9.2 9.2 6.6 6.6M14.8 9.2l2.6-2.6M9.2 14.8l-2.6 2.6M14.8 14.8l2.6 2.6" />
    </>
  ),
  "3d-vr": (
    <>
      <path d="M12 2.6 20.5 7v10L12 21.4 3.5 17V7z" />
      <path d="M3.7 7.1 12 11.9l8.3-4.8M12 21.6V11.9" />
    </>
  ),
  podcasting: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
    </>
  ),
  masterclasses: (
    <>
      <path d="m3 9 9-4 9 4-9 4-9-4z" />
      <path d="M7 11.4V16c0 1.4 2.5 2.5 5 2.5s5-1.1 5-2.5v-4.6M21 9v5" />
    </>
  ),
  all: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16.5 9 5 9-5" />
    </>
  ),
};

export function CategoryIcon({
  slug,
  className,
  strokeWidth = 1.8,
}: {
  slug: string;
  className?: string;
  strokeWidth?: number;
}) {
  const paths = PATHS[(slug as KbCategoryIconSlug) in PATHS ? (slug as KbCategoryIconSlug) : "all"];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}
