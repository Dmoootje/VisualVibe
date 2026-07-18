import { describe, expect, it } from "vitest";
import path from "node:path";
import type { BlogPost } from "@/types/blog";
import { getAllPosts, getPostBySlug, getPostTranslations, listPostFiles } from "./posts";
import { validateKennisbankPosts } from "./validation";
import { localizedPostHref } from "./urls";

function post(overrides: Partial<BlogPost>): BlogPost {
  return {
    title: "Test",
    slug: "test",
    category: "SEO & GEO",
    categorySlug: "seo-geo",
    pillar: false,
    status: "published",
    locale: "nl",
    translationKey: "test",
    author: "Jens Hardy",
    authorProfile: { type: "Person", name: "Jens Hardy" },
    publishedAt: "2026-01-01T00:00:00.000Z",
    excerpt: "Test excerpt",
    content: "Test content",
    seoTitle: "Test title",
    seoDescription: "Test description",
    ...overrides,
  };
}

describe("knowledge-base translation identity", () => {
  it("loads 58 Dutch posts with stable, unique kebab-case translation keys", () => {
    const posts = getAllPosts({ includeDrafts: true, locale: "nl" });
    const keys = posts.map((item) => item.translationKey);

    expect(posts).toHaveLength(58);
    expect(new Set(keys)).toHaveLength(58);
    expect(keys.every((key) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key))).toBe(true);
  });

  it("discovers English MDX posts stored in the locale subdirectory", () => {
    expect(listPostFiles()).toContain(
      ["en", "seo-for-websites-in-limburg.mdx"].join(path.sep),
    );
  });

  it("resolves a slug only inside the requested locale", () => {
    const dutch = getAllPosts({ includeDrafts: true, locale: "nl" })[0];

    expect(getPostBySlug(dutch.slug, { includeDrafts: true, locale: "nl" }))?.toBe(dutch);
    expect(getPostBySlug(dutch.slug, { includeDrafts: true, locale: "en" })).toBeUndefined();
  });

  it("returns translations keyed by locale for a translation key", () => {
    const dutch = getAllPosts({ includeDrafts: true, locale: "nl" })[0];
    const translations = getPostTranslations(dutch.translationKey, { includeDrafts: true });

    expect(translations.nl).toBe(dutch);
    expect(translations.en).toBeUndefined();
  });

  it("builds an article URL from the translated post's own locale and slug", () => {
    expect(
      localizedPostHref({ locale: "en", categorySlug: "seo-geo", slug: "english-slug" }),
    ).toBe("/en/kennisbank/seo-geo/english-slug/");
  });

  it("rejects duplicate translation keys within one locale", () => {
    const issues = validateKennisbankPosts([
      post({ slug: "eerste" }),
      post({ slug: "tweede" }),
    ]);

    expect(issues.some(({ code }) => code === "duplicate-translation-key")).toBe(true);
  });

  it("rejects translation keys that are not kebab-case", () => {
    const issues = validateKennisbankPosts([post({ translationKey: "Geen geldige sleutel" })]);

    expect(issues.some(({ code }) => code === "invalid-translation")).toBe(true);
  });

  it("allows locale-specific slugs and detects a missing English partner only in readiness mode", () => {
    const dutch = post({ slug: "nederlandse-slug" });
    const normalIssues = validateKennisbankPosts([dutch]);
    const readinessIssues = validateKennisbankPosts([dutch], new Date(), {
      requireEnglishPartners: true,
    });

    expect(normalIssues.some(({ code }) => code === "missing-english-partner")).toBe(false);
    expect(readinessIssues.some(({ code }) => code === "missing-english-partner")).toBe(true);
  });

  it("rejects related post links that resolve only in another locale", () => {
    const issues = validateKennisbankPosts([
      post({ slug: "nederlands", relatedPosts: ["/kennisbank/seo-geo/english/"] }),
      post({ slug: "english", locale: "en", translationKey: "ander-artikel" }),
    ]);

    expect(issues.some(({ code }) => code === "cross-locale-link")).toBe(true);
  });

  it("rejects a parent pillar link that resolves only in another locale", () => {
    const issues = validateKennisbankPosts([
      post({
        slug: "nederlandse-sub",
        clusterType: "sub",
        parentPillar: "/kennisbank/seo-geo/english-pillar/",
      }),
      post({
        slug: "english-pillar",
        locale: "en",
        translationKey: "pillar",
        pillar: true,
        clusterType: "pillar",
      }),
    ]);

    expect(issues.some(({ code }) => code === "cross-locale-link")).toBe(true);
  });
});
