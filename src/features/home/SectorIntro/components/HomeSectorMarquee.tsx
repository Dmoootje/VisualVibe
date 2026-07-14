"use client";

import { useEffect, useRef, useState } from "react";
import { SectorMarquee } from "@/components/sectors";

export function HomeSectorMarquee() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePageVisibility = () => setPageVisible(document.visibilityState === "visible");
    const updateMotionPreference = () => setReduceMotion(motionQuery.matches);

    updatePageVisibility();
    updateMotionPreference();

    const observer = root
      ? new IntersectionObserver(
          ([entry]) => setInView(entry.isIntersecting),
          { threshold: 0.05 }
        )
      : null;

    if (root && observer) observer.observe(root);
    document.addEventListener("visibilitychange", updatePageVisibility);
    motionQuery.addEventListener("change", updateMotionPreference);

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", updatePageVisibility);
      motionQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  const running = inView && pageVisible && !reduceMotion;

  return (
    <div
      ref={rootRef}
      className={`home-sector-marquee${running ? " is-running" : ""}`}
    >
      <SectorMarquee animate={running} />
    </div>
  );
}
