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
      {/* Ambient orbs spread across the full page height, alternating warm
          amber/red so the glow gently drifts left-right down the page. */}
      <div className="absolute left-[-10%] top-[4%] h-[460px] w-[460px] rounded-full bg-amber-500/[0.08] blur-[140px]" />
      <div className="absolute right-[-8%] top-[19%] h-[500px] w-[500px] rounded-full bg-red-500/[0.07] blur-[150px]" />
      <div className="absolute left-[-6%] top-[36%] h-[520px] w-[520px] rounded-full bg-amber-500/[0.07] blur-[160px]" />
      <div className="absolute right-[-10%] top-[53%] h-[480px] w-[480px] rounded-full bg-red-500/[0.06] blur-[150px]" />
      <div className="absolute left-[-4%] top-[70%] h-[500px] w-[500px] rounded-full bg-amber-500/[0.06] blur-[160px]" />
      <div className="absolute right-[-6%] top-[87%] h-[460px] w-[460px] rounded-full bg-red-500/[0.06] blur-[150px]" />

      {/* Warm depth from the top, fading into the dark base. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_55%_at_50%_0%,rgba(255,117,0,0.06),transparent_60%)]" />
    </div>
  );
}
