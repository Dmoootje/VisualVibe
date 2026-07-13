"use client";

import { useState } from "react";
import { weddingVibeConfig } from "../config/weddingvibe.config";

/**
 * FAQ-accordion: één item tegelijk open, plusknop roteert 45 graden. Alle
 * antwoorden staan in de HTML (max-height-transitie), dus ook zonder open
 * te klappen indexeerbaar; de FAQPage JSON-LD staat op de pagina zelf.
 */
export function FaqSection() {
  const { faq } = weddingVibeConfig;
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="wv-section bg-[#FAF6EE]">
      <div className="mx-auto max-w-[800px]">
        <div data-reveal className="mb-[clamp(40px,5vw,56px)] text-center">
          <div className="wv-overline-row wv-overline-row--center">
            <span className="wv-hairline wv-hairline--in" aria-hidden="true" />
            <span className="wv-overline">{faq.overline}</span>
            <span className="wv-hairline wv-hairline--out" aria-hidden="true" />
          </div>
          <h2 className="wv-h2 !text-[clamp(32px,4.2vw,48px)]">
            {faq.title} <em>{faq.accent}</em>
          </h2>
        </div>
        <div data-reveal>
          {faq.items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.question} className="border-b border-[rgba(194,154,75,0.28)]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                  className="flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-[18px] bg-transparent px-1 py-6 text-left"
                >
                  <span className="wv-serif text-[22px] font-semibold leading-[1.3]">{item.question}</span>
                  <span
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[rgba(194,154,75,0.5)] text-[#B08A3E] transition-all duration-[450ms]"
                    style={{
                      transform: open ? "rotate(45deg)" : "rotate(0deg)",
                      background: open ? "rgba(194,154,75,.14)" : "transparent",
                    }}
                    aria-hidden="true"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                      <path d="M7 1 V 13" />
                      <path d="M1 7 H 13" />
                    </svg>
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{ maxHeight: open ? 320 : 0, opacity: open ? 1 : 0 }}
                >
                  <p className="m-0 max-w-[660px] px-1 pb-7 text-base leading-[1.75] text-[#6B5F55]">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
