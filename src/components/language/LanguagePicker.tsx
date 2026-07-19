"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BelgiumFlag, UkFlag } from "./flags";
import "./language-picker.css";

/**
 * Floating, animated language switcher (bottom-right, site-wide).
 *
 * Dutch and English pages use different slugs (e.g. /be/diensten/webdesign vs
 * /en/services/web-design, /over-ons vs /about), so a naive path swap would
 * 404. Instead we read the per-page hreflang alternates the pages already emit
 * in <head> (nl-BE / en-BE) and navigate to the exact equivalent, falling back
 * to the target locale's home when a page has no alternate.
 */

type LocaleOption = {
  code: "nl" | "en";
  label: string;
  short: string;
  hreflang: string;
  home: string;
};

// Published locales only (see src/i18n/locales.ts). Add fr/de + their flags
// here once those locales are published.
const LOCALES: readonly LocaleOption[] = [
  { code: "nl", label: "Nederlands", short: "NL", hreflang: "nl-BE", home: "/be/" },
  { code: "en", label: "English", short: "EN", hreflang: "en-BE", home: "/en/" },
];

const UI = {
  nl: { trigger: "Taal kiezen", heading: "Taal" },
  en: { trigger: "Choose language", heading: "Language" },
} as const;

function FlagChip({ code }: { code: LocaleOption["code"] }) {
  return <span className="vvlang-flag">{code === "en" ? <UkFlag /> : <BelgiumFlag />}</span>;
}

function Chevron() {
  return (
    <svg className="vvlang-chev" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Check() {
  return (
    <svg className="vvlang-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function LanguagePicker({ locale }: { locale: string }) {
  const current: LocaleOption["code"] = locale === "en" ? "en" : "nl";
  const ui = UI[current];
  const [open, setOpen] = useState(false);
  const [alternates, setAlternates] = useState<Record<string, string>>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Read the per-page hreflang alternates from <head>; refresh on navigation.
  useEffect(() => {
    const map: Record<string, string> = {};
    document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]').forEach((link) => {
      const hl = link.getAttribute("hreflang");
      const href = link.getAttribute("href");
      if (!hl || !href) return;
      try {
        const url = new URL(href, window.location.origin);
        map[hl] = url.pathname + url.search;
      } catch {
        /* ignore malformed alternates */
      }
    });
    setAlternates(map);
  }, [pathname]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) close();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const targetHref = (option: LocaleOption) => alternates[option.hreflang] ?? option.home;

  return (
    <div ref={rootRef} className={`vvlang${open ? " is-open" : ""}`}>
      {open && (
        <div className="vvlang-pop" role="menu" aria-label={ui.trigger}>
          <p className="vvlang-pop-label">{ui.heading}</p>
          {LOCALES.map((option) => {
            const active = option.code === current;
            const content = (
              <>
                <FlagChip code={option.code} />
                <span className="vvlang-opt-name">
                  {option.label}
                  <span className="vvlang-opt-sub">{option.short}</span>
                </span>
                <Check />
              </>
            );
            return active ? (
              <div key={option.code} className="vvlang-opt is-active" role="menuitem" aria-current="true">
                {content}
              </div>
            ) : (
              <a
                key={option.code}
                href={targetHref(option)}
                hrefLang={option.code}
                className="vvlang-opt"
                role="menuitem"
                onClick={close}
              >
                {content}
              </a>
            );
          })}
        </div>
      )}

      <button
        type="button"
        className="vvlang-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ui.trigger}
        onClick={() => setOpen((value) => !value)}
      >
        <FlagChip code={current} />
        <span className="vvlang-code">{current.toUpperCase()}</span>
        <Chevron />
      </button>
    </div>
  );
}
