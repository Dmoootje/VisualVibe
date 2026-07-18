import { describe, expect, it } from "vitest";
import {
  localizedPublicUrl,
  publishedLanguageAlternates,
} from "./publicationRoutes";

describe("publication route pairs", () => {
  const pair = {
    nl: "/offerte-aanvragen/",
    en: "/request-a-quotation/",
  } as const;

  it("builds locale-prefixed public URLs from normalized route paths", () => {
    expect(localizedPublicUrl("https://visualvibe.be", "nl", pair.nl)).toBe(
      "https://visualvibe.be/be/offerte-aanvragen/",
    );
    expect(localizedPublicUrl("https://visualvibe.be", "en", pair.en)).toBe(
      "https://visualvibe.be/en/request-a-quotation/",
    );
    expect(localizedPublicUrl("https://visualvibe.be/", "en", "contact")).toBe(
      "https://visualvibe.be/en/contact/",
    );
  });

  it("emits only published bilingual hreflang entries and a Dutch default", () => {
    expect(publishedLanguageAlternates("https://visualvibe.be", pair)).toEqual({
      "nl-BE": "https://visualvibe.be/be/offerte-aanvragen/",
      "en-BE": "https://visualvibe.be/en/request-a-quotation/",
      "x-default": "https://visualvibe.be/be/offerte-aanvragen/",
    });
  });
});
