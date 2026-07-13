// Shared constants for the cookie-consent flow. The layout's inline
// consent-default script (which runs in <head> before Google Analytics loads)
// and the client banner both key off the same storage slot, so the choice made
// in the banner is honoured by the early script on the next page load.

/** localStorage slot holding the visitor's choice: "granted" | "denied". */
export const CONSENT_STORAGE_KEY = "vv-cookie-consent";

/** Fired to re-open the banner (e.g. the "manage cookies" button). */
export const OPEN_CONSENT_EVENT = "vv:open-consent";

export type ConsentChoice = "granted" | "denied";
