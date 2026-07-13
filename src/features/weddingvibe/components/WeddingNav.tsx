"use client";

import { weddingVibeConfig } from "../config/weddingvibe.config";
import { useWvModal } from "./WvModalContext";

/** Sticky WeddingVibe-nav: wit blur, goud hairline, anchor-links + datum-CTA. */
export function WeddingNav() {
  const { openModal } = useWvModal();
  const { nav } = weddingVibeConfig;

  return (
    <nav
      className="sticky top-0 z-40 border-b border-[rgba(194,154,75,0.22)] bg-[rgba(255,255,255,0.92)] backdrop-blur-[14px]"
      aria-label="WeddingVibe"
    >
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-[clamp(20px,4vw,48px)] py-4">
        <a href="#top" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/weddingvibe-logo.svg" alt="WeddingVibe" className="block h-[26px] w-auto" />
        </a>
        <div className="flex flex-wrap items-center gap-[clamp(16px,2.4vw,32px)] text-[13px] uppercase tracking-[0.12em]">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden text-[#2A2320] transition-colors hover:text-[#B08A3E] sm:inline"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={openModal}
            className="wv-btn wv-btn--gold !px-6 !py-3 !text-[12px] !tracking-[0.16em]"
          >
            {nav.cta}
          </button>
        </div>
      </div>
    </nav>
  );
}
