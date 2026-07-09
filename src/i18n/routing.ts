import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "fr", "en"],
  defaultLocale: "nl",
  // Dutch stays the internal locale "nl" (lang="nl", messages/nl.json) but is
  // shown under /be (Belgium). French/English keep their own code (/fr, /en).
  localePrefix: {
    mode: "always",
    prefixes: {
      nl: "/be",
    },
  },
  // Always land on the Dutch default instead of auto-redirecting to the
  // browser's Accept-Language (which kept pushing dev sessions to /en).
  localeDetection: false,
  // Never persist a locale in a cookie: the language is determined purely by
  // the URL, so a chosen locale can't "stick" and hijack later navigation.
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];
