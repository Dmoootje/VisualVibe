import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

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
});
