/** Sierornament: twee gebogen goudlijnen met een ruit in het midden. */
export function WvOrnament({ className }: { className?: string }) {
  return (
    <svg
      width="120"
      height="14"
      viewBox="0 0 120 14"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ display: "block", margin: "0 auto 20px" }}
    >
      <path d="M2 7 C 20 7, 32 1.5, 46 7" stroke="#C29A4B" strokeWidth="1" />
      <path d="M118 7 C 100 7, 88 12.5, 74 7" stroke="#C29A4B" strokeWidth="1" />
      <path d="M60 1.5 L 65.5 7 L 60 12.5 L 54.5 7 Z" fill="#C29A4B" />
    </svg>
  );
}

/** Overline met hairlines links en rechts (gecentreerde variant). */
export function WvOverline({
  children,
  center,
  light,
}: {
  children: React.ReactNode;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`wv-overline-row${center ? " wv-overline-row--center" : ""}`}>
      {center && <span className="wv-hairline wv-hairline--in" aria-hidden="true" />}
      <span className={`wv-overline${light ? " wv-overline--light" : ""}`}>{children}</span>
      <span className="wv-hairline wv-hairline--out" aria-hidden="true" />
    </div>
  );
}
