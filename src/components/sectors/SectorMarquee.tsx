import { Link } from "@/i18n/navigation";
import { sectors } from "@/data/sectors";
import type { Sector } from "@/types";
import { SectorIcon } from "./SectorIcon";

/**
 * Two rows of sector pills scrolling in opposite directions on an infinite loop.
 * Top row -> left, bottom row -> right. Pauses on hover, respects
 * prefers-reduced-motion (see the .vv-mq styles in globals.css). Each row
 * duplicates its list so the -50% keyframe loops seamlessly.
 */
export function SectorMarquee({ exclude, animate = true }: { exclude?: string; animate?: boolean }) {
  const others = sectors.filter((s) => s.slug !== exclude);
  const top = [...others, ...others];
  const bottom = [...others].reverse();
  const bottomDup = [...bottom, ...bottom];

  return (
    <div className="flex flex-col gap-4">
      <div className="vv-mq">
        <div className="vv-mq-track vv-mq-l">
          {top.map((s, i) => (
            <Pill key={`t${i}`} sector={s} animate={animate} />
          ))}
        </div>
      </div>
      <div className="vv-mq">
        <div className="vv-mq-track vv-mq-r">
          {bottomDup.map((s, i) => (
            <Pill key={`b${i}`} sector={s} animate={animate} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Pill({ sector, animate }: { sector: Sector; animate: boolean }) {
  return (
    <Link href={`/sectoren/${sector.slug}`} className="vv-pill">
      {sector.icon && <SectorIcon id={sector.icon} size={36} animate={animate} />}
      <span>{sector.title}</span>
    </Link>
  );
}
