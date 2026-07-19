import type { CSSProperties, ReactNode } from "react";

/**
 * Opens the sitewide quote/kennismaken sheet. Use inside server components -
 * the `data-quote-modal` marker is picked up by QuoteModalController's
 * document-level (capture-phase) click listener, so no client boundary is
 * needed here. `onClick` still fires normally afterwards (e.g. to close a
 * mobile nav drawer) since the modal open doesn't call preventDefault/stop.
 */
export function QuoteButton({
  mode = "offerte",
  className,
  style,
  ariaLabel,
  onClick,
  children,
}: {
  mode?: "offerte" | "kennis";
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      data-quote-modal={mode}
      className={className}
      style={style}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
