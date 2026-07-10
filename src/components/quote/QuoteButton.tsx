"use client";

import type { CSSProperties, ReactNode } from "react";
import { useQuoteModal } from "./QuoteModal";

/** Opens the sitewide quote/kennismaken sheet. Use inside server components. */
export function QuoteButton({
  mode = "offerte",
  className,
  style,
  ariaLabel,
  children,
}: {
  mode?: "offerte" | "kennis";
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const { openOfferte, openKennis } = useQuoteModal();
  return (
    <button
      type="button"
      onClick={mode === "kennis" ? openKennis : openOfferte}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
