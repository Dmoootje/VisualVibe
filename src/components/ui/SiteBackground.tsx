/**
 * One continuous background for the whole site. Fixed behind every page and
 * section (which are transparent) so there are no per-section black bands or
 * seams: a single dark base with soft amber/red ambient orbs. Viewport-anchored
 * so it stays seamless on pages of any height. Server component, pure CSS.
 */
export function SiteBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Soft ambient orbs around the viewport edges. */}
      <div className="absolute left-[-12%] top-[-8%] h-[540px] w-[540px] rounded-full bg-amber-500/[0.07] blur-[150px]" />
      <div className="absolute right-[-12%] top-[14%] h-[580px] w-[580px] rounded-full bg-red-500/[0.06] blur-[160px]" />
      <div className="absolute left-[-10%] bottom-[6%] h-[560px] w-[560px] rounded-full bg-amber-500/[0.06] blur-[160px]" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[540px] w-[540px] rounded-full bg-red-500/[0.06] blur-[150px]" />

      {/* Warm depth from the top, fading into the dark base. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,rgba(255,117,0,0.05),transparent_60%)]" />
    </div>
  );
}
