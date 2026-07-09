// No firebase-admin import here - this file is imported by middleware.ts,
// which runs on the Edge runtime and can't bundle the Admin SDK's Node.js
// dependencies (node:crypto, node:fs, ...). Keep it dependency-free.
export const SESSION_COOKIE_NAME = "vv_session";
export const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000; // 5 days
