export type PublicChromeLocale = "nl" | "en";

// The quotation page was removed: every quote CTA opens the QuoteButton
// slide-up sheet instead of navigating, so there is no `quotation` route here.
export function getChromeRoutes(locale: PublicChromeLocale) {
  if (locale === "en") {
    return {
      about: "/about",
      wedding: null,
    } as const;
  }

  return {
    about: "/over-ons",
    wedding: "/trouwfotograaf-limburg",
  } as const;
}
