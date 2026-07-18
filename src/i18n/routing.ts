import { defineRouting } from "next-intl/routing";
import { getPublishedLocales } from "./locales";

const publishedLocales = getPublishedLocales();

export const routing = defineRouting({
  // Dutch and English are published. French and German stay excluded until
  // complete translated content is ready; their redirects live in next.config.js.
  locales: publishedLocales,
  defaultLocale: "nl",
  // Dutch stays the internal locale "nl" (lang="nl", messages/nl.json) but is
  // shown under /be (Belgium). English keeps its standard /en prefix.
  localePrefix: {
    mode: "always",
    prefixes: {
      nl: "/be",
    },
  },
  // Always land on the Dutch default instead of selecting a locale from the
  // browser's Accept-Language header.
  localeDetection: false,
  // Keep automatic hreflang Link headers disabled. Route-specific metadata owns
  // the Dutch/English partner URLs so only real bilingual pages are advertised.
  alternateLinks: false,
  // Never persist a locale in a cookie: the language is determined purely by
  // the URL, so a chosen locale can't "stick" and hijack later navigation.
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];
