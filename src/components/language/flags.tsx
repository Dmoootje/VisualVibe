import { useId } from "react";

/**
 * Inline SVG flags. The repo bans image files (only logo/favicon in public),
 * so flags are hand-drawn SVG. Each flag fills its rounded chip via
 * preserveAspectRatio="slice" (cover), so different native flag ratios still
 * read as one consistent set of chips.
 */

export function BelgiumFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 9 6" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect x="0" width="3" height="6" fill="#2A2A2E" />
      <rect x="3" width="3" height="6" fill="#FDDA24" />
      <rect x="6" width="3" height="6" fill="#EF3340" />
    </svg>
  );
}

export function UkFlag({ className }: { className?: string }) {
  // Unique clip id per instance so the trigger + list flags never collide.
  const clip = useId().replace(/[:]/g, "");
  return (
    <svg className={className} viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <clipPath id={clip}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#00247D" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${clip})`} stroke="#CF142B" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#CF142B" strokeWidth="6" />
    </svg>
  );
}
