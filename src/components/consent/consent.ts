// Shared constants for the cookie-consent flow. Analytics and the banner key
// off the same storage slot and communicate through a client-only event.

/** localStorage slot holding the visitor's choice: "granted" | "denied". */
export const CONSENT_STORAGE_KEY = "vv-cookie-consent";

/** Fired to re-open the banner (e.g. the "manage cookies" button). */
export const OPEN_CONSENT_EVENT = "vv:open-consent";

/** Fired after the visitor explicitly grants or denies analytics consent. */
export const CONSENT_CHANGE_EVENT = "vv:consent-change";

export type ConsentChoice = "granted" | "denied";
