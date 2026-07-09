import { STAGE_HTML } from "../lib/stage";

/**
 * Right column: the living stage. Static, server-rendered markup (all motion is
 * CSS) injected as HTML - the same pattern the sector sprite / partner logos use.
 */
export function HeroStage() {
  return (
    <div
      className="relative mx-auto w-full max-w-[540px] lg:mx-0"
      dangerouslySetInnerHTML={{ __html: STAGE_HTML }}
    />
  );
}
