import { STAGE_HTML } from "../lib/stage";

/**
 * Right column: the living stage. Static, server-rendered markup (all motion is
 * CSS) injected as HTML - the same pattern the sector sprite / partner logos use.
 * Purely decorative (a fake browser/camera/editor/drone/3D/podcast montage), so
 * it is aria-hidden: it carries no information a screen reader needs, and its
 * low-contrast mock text is exempt from WCAG 1.4.3 (decoration) instead of being
 * flagged by the accessibility audit.
 */
export function HeroStage() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[540px] lg:mx-0"
      dangerouslySetInnerHTML={{ __html: STAGE_HTML }}
    />
  );
}
