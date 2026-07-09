"use client";
import React from "react";
import { SECTORS, type Sector } from "../data/sectors";
import { SectorIcon } from "./SectorIcon";

/**
 * Two rows of sector pills scrolling in opposite directions on an infinite loop.
 * Top row -> left, bottom row -> right. Pauses on hover. Respects prefers-reduced-motion.
 * Each row duplicates its list so the -50% keyframe loops seamlessly.
 */
export function SectorMarquee({ exclude, animate = true }: { exclude?: string; animate?: boolean }) {
  const others = SECTORS.filter((s) => s.id !== exclude);
  const top = [...others, ...others];
  const rev = [...others].reverse();
  const bottom = [...rev, ...rev];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="vv-mq">
        <div className="vv-mq-track vv-mq-l">
          {top.map((s, i) => (<Pill key={"t" + i} s={s} animate={animate} />))}
        </div>
      </div>
      <div className="vv-mq">
        <div className="vv-mq-track vv-mq-r">
          {bottom.map((s, i) => (<Pill key={"b" + i} s={s} animate={animate} />))}
        </div>
      </div>
    </div>
  );
}

function Pill({ s, animate }: { s: Sector; animate: boolean }) {
  return (
    <a href={"/sectoren/" + s.id} className="vv-pill">
      <SectorIcon id={s.id} size={36} animate={animate} />
      <span>{s.name}</span>
    </a>
  );
}
