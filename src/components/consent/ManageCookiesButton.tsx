"use client";

import { OPEN_CONSENT_EVENT } from "./consent";

/**
 * Re-opens the consent banner so a visitor can change or withdraw consent from
 * the cookie policy page. Renders nothing until mounted-only concerns are moot
 * because it is a plain button; the banner listens for OPEN_CONSENT_EVENT.
 */
export function ManageCookiesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="inline-flex items-center gap-2 rounded-xl border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] px-5 py-2.5 text-sm font-semibold text-[#ff9a45] transition-colors hover:bg-[rgba(255,122,0,0.18)]"
    >
      Cookievoorkeuren aanpassen
    </button>
  );
}
