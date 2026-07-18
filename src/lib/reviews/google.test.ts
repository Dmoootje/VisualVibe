import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getGoogleReviews } from "./google";

describe("localized Google reviews", () => {
  beforeEach(() => {
    process.env.GOOGLE_PLACES_API_KEY = "test-key";
    process.env.GOOGLE_PLACE_ID = "places/test";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.GOOGLE_PLACES_API_KEY;
    delete process.env.GOOGLE_PLACE_ID;
  });

  it("requests and maps the English Places response without Dutch fallback text", async () => {
    const fetchMock = vi.fn(async (_url: string) => new Response(JSON.stringify({ reviews: [{ rating: 5, text: { text: "Excellent guidance." }, originalText: { text: "Uitstekende begeleiding." }, authorAttribution: {}, relativePublishTimeDescription: "a month ago" }] })));
    vi.stubGlobal("fetch", fetchMock);
    const reviews = await getGoogleReviews("en");
    expect(String(fetchMock.mock.calls[0][0])).toContain("languageCode=en");
    expect(String(fetchMock.mock.calls[0][0])).toContain("regionCode=BE");
    expect(reviews[0]).toMatchObject({ quote: "Excellent guidance.", author: "Google user", role: "a month ago", rating: 5 });
    expect(reviews[0].quote).not.toContain("Uitstekende");
  });

  it("does not use original Dutch review text when English translated text is absent", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ reviews: [{ rating: 5, originalText: { text: "Nederlandse review" }, authorAttribution: {} }] }))));
    expect(await getGoogleReviews("en")).toEqual([]);
  });

  it("preserves Dutch request and fallbacks", async () => {
    const fetchMock = vi.fn(async (_url: string) => new Response(JSON.stringify({ reviews: [{ rating: 4, text: { text: "Prima." }, authorAttribution: {} }] })));
    vi.stubGlobal("fetch", fetchMock);
    const reviews = await getGoogleReviews("nl");
    expect(String(fetchMock.mock.calls[0][0])).toContain("languageCode=nl");
    expect(reviews[0]).toMatchObject({ author: "Google-gebruiker", role: "Google review" });
  });
});
