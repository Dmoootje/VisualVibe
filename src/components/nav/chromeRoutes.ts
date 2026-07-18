export type PublicChromeLocale = "nl" | "en";

export function getChromeRoutes(locale: PublicChromeLocale) {
  if (locale === "en") {
    return {
      about: "/about",
      quotation: "/request-a-quotation",
      wedding: null,
    } as const;
  }

  return {
    about: "/over-ons",
    quotation: "/offerte-aanvragen",
    wedding: "/trouwfotograaf-limburg",
  } as const;
}
