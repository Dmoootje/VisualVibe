/**
 * One continuous background for the whole homepage. Sits behind every section
 * (which are transparent) so there are no per-section black bands or seams: a
 * single dark base with soft amber/red ambient orbs distributed down the page.
 * Server component, pure CSS, no image files.
 */
export default function HomeBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#070707]"
    >
      {/* Ambient orbs spread across the full page height. */}
      <div className="absolute left-[-10%] top-[5%] h-[420px] w-[420px] rounded-full bg-amber-500/[0.06] blur-[130px]" />
      <div className="absolute right-[-8%] top-[22%] h-[460px] w-[460px] rounded-full bg-red-500/[0.05] blur-[140px]" />
      <div className="absolute left-[-6%] top-[45%] h-[480px] w-[480px] rounded-full bg-amber-500/[0.05] blur-[150px]" />
      <div className="absolute right-[-10%] top-[66%] h-[440px] w-[440px] rounded-full bg-red-500/[0.05] blur-[140px]" />
      <div className="absolute left-1/4 top-[86%] h-[420px] w-[420px] rounded-full bg-amber-500/[0.045] blur-[150px]" />

      {/* Warm depth from the top, fading into the dark base. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_55%_at_50%_0%,rgba(255,117,0,0.05),transparent_60%)]" />
    </div>
  );
}
