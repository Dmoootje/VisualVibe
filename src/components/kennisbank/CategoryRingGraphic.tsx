import { CategoryIcon } from "./CategoryIcon";

/**
 * The categoriepagina hero graphic: the category glyph floating inside an
 * animated ring system (concentric circles + radar sweep + ping rings + glow).
 * Pure SVG + CSS; decorative, hidden below lg.
 */
export function CategoryRingGraphic({ slug }: { slug: string }) {
  return (
    <div className="pointer-events-none relative mx-auto hidden aspect-square w-full max-w-[500px] lg:block">
      <div className="kb-sweep" />
      <div className="kb-glow-orb" />
      <div className="kb-ping" />
      <div className="kb-ping kb-ping-2" />
      <svg viewBox="0 0 400 400" className="relative z-[2] h-full w-full overflow-visible">
        <circle cx="200" cy="200" r="155" fill="none" stroke="rgba(255,122,0,.14)" strokeWidth="1" strokeDasharray="2 9" />
        <circle cx="200" cy="200" r="118" fill="none" stroke="rgba(255,122,0,.22)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="84" fill="none" stroke="rgba(255,122,0,.4)" strokeWidth="2" />
      </svg>
      <div
        className="kb-catmedal absolute left-1/2 top-1/2 z-[3] flex items-center justify-center text-[#ff8a2e]"
        style={{ filter: "drop-shadow(0 16px 34px rgba(255,122,0,.55))" }}
      >
        <CategoryIcon slug={slug} strokeWidth={1.3} className="h-[130px] w-[130px]" />
      </div>
    </div>
  );
}
