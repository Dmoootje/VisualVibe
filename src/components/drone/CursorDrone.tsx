"use client";

import { useEffect, useRef } from "react";
import { Quad } from "./Quad";

/**
 * A small quadcopter that slowly trails after the cursor (desktop only). A
 * mousemove handler sets a target; a rAF loop lerps the drone toward it at a
 * gentle 0.0067/frame and banks proportional to horizontal velocity. Hidden
 * <=1000px and under prefers-reduced-motion via CSS (.dr-cursor); we also skip
 * the loop entirely in those cases so it costs nothing.
 */
export function CursorDrone() {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    const enabled =
      window.matchMedia("(min-width: 1001px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled) return;

    const half = 33;
    const pos = { x: window.innerWidth - 130, y: 120 };
    const tgt = { x: pos.x, y: pos.y };
    const onMove = (e: MouseEvent) => {
      tgt.x = e.clientX - half;
      tgt.y = e.clientY - half;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      const dx = tgt.x - pos.x;
      const dy = tgt.y - pos.y;
      pos.x += dx * 0.0067;
      pos.y += dy * 0.0067;
      const tilt = Math.max(-14, Math.min(14, dx * 0.05));
      el.style.transform = `translate(${pos.x.toFixed(1)}px,${pos.y.toFixed(1)}px) rotate(${tilt.toFixed(1)}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg ref={ref} className="dr-cursor" viewBox="0 0 120 104" aria-hidden="true">
      <g className="dr-rig">
        <Quad />
      </g>
    </svg>
  );
}
