import { FALLING_HTML } from "../lib/stage";

/** Full-bleed layer of slowly falling orange blocks behind the hero. */
export function HeroFalling() {
  return (
    <div
      aria-hidden="true"
      className="vvh-hero-falling pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      dangerouslySetInnerHTML={{ __html: FALLING_HTML }}
    />
  );
}
