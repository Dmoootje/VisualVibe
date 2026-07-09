/**
 * Subtle orange process-line that runs behind the row of number badges on
 * desktop, connecting the four steps. It sits below the cards (z-0) so it only
 * shows through the gaps, reading as a connecting line between the steps.
 */
export function ProcessPathLine() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[38px] z-0 hidden lg:block"
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      {/* Nodes above each gap between the four cards */}
      <div className="absolute inset-x-0 top-0 flex -translate-y-1/2 justify-between px-[8%]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-amber-500/70 shadow-[0_0_8px_rgba(255,117,0,0.8)]" />
        ))}
      </div>
    </div>
  );
}
