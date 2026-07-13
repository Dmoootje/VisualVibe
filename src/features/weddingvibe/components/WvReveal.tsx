"use client";

import { useEffect } from "react";

/**
 * Scroll-reveal voor alle [data-reveal]-elementen binnen .wv-root. Progressief:
 * zonder JavaScript blijft alles gewoon zichtbaar; de beginstijlen worden pas
 * hier gezet (zoals in het handoff-prototype).
 */
export function WvReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.querySelector(".wv-root");
    if (!root) return;

    const els = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "none";
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Elementen die al in beeld staan niet verstoppen (geen flits bij laden).
      if (rect.top < window.innerHeight * 0.9) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = "opacity .9s ease, transform .9s cubic-bezier(.22,.61,.36,1)";
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return null;
}
