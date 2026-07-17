import type { CSSProperties, ReactNode } from "react";

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
  return (
    <button
      type="button"
      data-quote-modal={mode}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
