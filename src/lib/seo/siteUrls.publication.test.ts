import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/firestore/fotografieGalleries", () => ({
  getFotografieGalleries: vi.fn(async () => [{ images: [{}] }]),
}));
vi.mock("@/lib/firestore/applicationCases", () => ({
  getApplicationCases: vi.fn(async () => [{
    id: "bm-jumpfun",
    slug: "bm-jumpfun-verhuurplatform",
    published: true,
  }]),
}));

import { getSitemapEntries } from "./siteUrls";

const source = fs.readFileSync(path.join(process.cwd(), "src/lib/seo/siteUrls.ts"), "utf8");
const articlePage = fs.readFileSync(
  path.join(process.cwd(), "src/app/[locale]/(site)/kennisbank/[category]/[slug]/page.tsx"),
  "utf8",
);

describe("public sitemap locale boundary", () => {
  it("filters knowledge-base posts and alternates to published locales", () => {
    expect(source).toContain("getPublishedLocales");
    expect(source).toContain("publishedLocaleSet.has(post.locale)");
    expect(source).toContain("publishedLocaleSet.has(translation.locale)");
  });

  it("generates article pages only for published locales", () => {
    expect(articlePage).toContain("getPublishedLocales");
    expect(articlePage).toContain("publishedLocales.includes(post.locale)");
  });

  it("publishes complete Dutch and English sitemap sets without disabled locales", async () => {
    const entries = await getSitemapEntries();
    const urls = entries.map(({ url }) => url);

    expect(urls).toContain(
      "https://visualvibe.media/be/diensten/webdesign/website-laten-maken/",
    );
    expect(urls).toContain(
      "https://visualvibe.media/en/services/web-design/business-website-design/",
    );
    // The quotation page was removed (quote slide-up everywhere): neither
    // locale may advertise it in the sitemap anymore.
    expect(urls.some((url) => url.includes("offerte-aanvragen"))).toBe(false);
    expect(urls.some((url) => url.includes("request-a-quotation"))).toBe(false);
    expect(urls).toContain("https://visualvibe.media/be/trouwfotograaf-limburg/");
    expect(urls).toContain(
      "https://visualvibe.media/be/diensten/webdesign/website-met-ai-functionaliteiten/",
    );
    expect(urls).not.toContain("https://visualvibe.media/en/trouwfotograaf-limburg/");
    expect(urls).not.toContain(
      "https://visualvibe.media/en/diensten/webdesign/website-met-ai-functionaliteiten/",
    );
    expect(urls.some((url) => url.includes("/fr/"))).toBe(false);
    expect(urls.some((url) => url.includes("/de/"))).toBe(false);
  });

  it("publishes all 58 English knowledge-base partners with shared hreflang", async () => {
    const entries = await getSitemapEntries();
    const articlePattern = /\/(?:be|en)\/kennisbank\/[^/]+\/[^/]+\/$/u;
    const articleEntries = entries.filter(({ url }) => articlePattern.test(url));
    const englishArticles = articleEntries.filter(({ url }) => url.includes("/en/kennisbank/"));

    expect(englishArticles).toHaveLength(58);
    expect(articleEntries).toHaveLength(116);

    for (const entry of articleEntries) {
      const languages = entry.alternates?.languages;
      expect(languages).toMatchObject({
        "nl-BE": expect.stringContaining("/be/kennisbank/"),
        "en-BE": expect.stringContaining("/en/kennisbank/"),
        "x-default": expect.stringContaining("/be/kennisbank/"),
      });
      const partners = articleEntries.filter(
        (candidate) =>
          candidate.alternates?.languages?.["x-default"] === languages?.["x-default"],
      );
      expect(partners).toHaveLength(2);
      expect(partners[0].alternates).toEqual(partners[1].alternates);
    }
  });
});
