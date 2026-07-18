"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_STORAGE_KEY,
  OPEN_CONSENT_EVENT,
  type ConsentChoice,
} from "./consent";

/**
 * EU cookie-consent banner. Analytics listens to the explicit choice event and
 * only loads its remote script after a grant. The choice is stored so the banner
 * stays hidden on later visits; the /cookies page can re-open it through the
 * OPEN_CONSENT_EVENT so consent can be withdrawn as easily as given.
 */
export function CookieConsent() {
  const t = useTranslations("cookie");
  const [open, setOpen] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    } catch {
      // Private mode or blocked storage: fall through and show the banner.
    }
    if (stored !== "granted" && stored !== "denied") setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  // Move focus to the banner when it appears so keyboard users land on it.
  // preventScroll voorkomt dat het focussen van deze fixed bottom-banner op de
  // eerste paint een scroll-into-view forced reflow triggert (Lighthouse mobiel).
  useEffect(() => {
    if (open) acceptRef.current?.focus({ preventScroll: true });
  }, [open]);

  const choose = useCallback((choice: ConsentChoice) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // Ignore storage failures; the update below still applies for this page.
    }
    window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_CHANGE_EVENT, { detail: choice }));
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("label")}
      className="fixed inset-x-0 bottom-0 z-[100] px-2.5 pb-3 sm:px-4 sm:pb-4"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 rounded-2xl border border-[rgba(255,122,0,0.3)] bg-[rgba(11,11,11,0.94)] p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="text-sm leading-relaxed text-white/75">
          {t("text")} {" "}
          <Link href="/cookies" className="text-[#ff9a45] underline-offset-2 hover:underline">
            {t("cookies")}
          </Link>{" "}
          {t("and")} {" "}
          <Link href="/privacy" className="text-[#ff9a45] underline-offset-2 hover:underline">
            {t("privacy")}
          </Link>
          .
        </p>

        <div className="flex flex-shrink-0 flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="order-2 w-full rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:order-1 sm:w-auto"
          >
            {t("reject")}
          </button>
          <button
            ref={acceptRef}
            type="button"
            onClick={() => choose("granted")}
            className="order-1 w-full rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 sm:order-2 sm:w-auto"
            style={{
              background: "linear-gradient(90deg,#FF3B2E,#FF7A00)",
              boxShadow: "0 12px 32px -12px rgba(255,90,0,0.85)",
            }}
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
