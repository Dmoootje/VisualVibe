import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { knowledgeBaseLabels } from "./localization";
import { SearchBar } from "./SearchBar";
import { toArticleCardData } from "./data";
import type { BlogPost } from "@/types";
import { toBlogCardPost } from "@/lib/kennisbank/blogCard";

const read = (path: string) => readFileSync(path, "utf8");

describe("English knowledge-base chrome", () => {
  it("provides human English labels while preserving Dutch", () => {
    expect(knowledgeBaseLabels("en")).toMatchObject({
      knowledgeBase: "Knowledge base",
      category: "Category",
      relatedArticles: "Related articles",
      readArticle: "Read the full article",
      tableOfContents: "Contents",
      share: "Share",
      clearSearch: "Clear search",
    });
    expect(knowledgeBaseLabels("nl")).toMatchObject({
      knowledgeBase: "Kennisbank",
      category: "Categorie",
      relatedArticles: "Gerelateerde artikels",
      readArticle: "Lees het volledige artikel",
      tableOfContents: "Inhoud",
      share: "Delen",
      clearSearch: "Zoekopdracht wissen",
    });
  });

  it("routes hub, category, software and article chrome through locale labels", () => {
    const base = "src/app/[locale]/(site)/kennisbank";
    for (const file of ["page.tsx", "[category]/page.tsx", "software-op-maat/page.tsx", "[category]/[slug]/page.tsx"]) {
      const source = read(`${base}/${file}`);
      expect(source, file).toContain("knowledgeBaseLabels");
    }
  });

  it("routes representative shared chrome through locale labels", () => {
    for (const file of [
      "src/components/kennisbank/KennisbankLandingView.tsx",
      "src/components/kennisbank/CategorySidebar.tsx",
      "src/components/kennisbank/ArticleCard.tsx",
      "src/components/kennisbank/FeaturedCard.tsx",
      "src/components/blog/BlogHero.tsx",
      "src/components/blog/StickyBlogSidebar.tsx",
      "src/components/blog/ShareButtons.tsx",
    ]) {
      expect(read(file), file).toContain("knowledgeBaseLabels");
    }
  });

  it("localizes layout controls, the all filter and upcoming-topic cards", () => {
    const landing = read("src/components/kennisbank/KennisbankLandingView.tsx");
    expect(landing).toContain('locale === "en" ? "Grid view"');
    expect(landing).toContain('locale === "en" ? "List view"');
    expect(landing).toContain('locale === "en" ? "All"');
    expect(landing).toContain("<BladerPerOnderwerp categories={allCategories} locale={locale}");

    const topics = read("src/components/kennisbank/BladerPerOnderwerp.tsx");
    expect(topics).toContain('locale === "en" ? "Coming soon"');
    expect(topics).toContain('locale === "en" ? `${card.name} (coming soon)`');
  });

  it("localizes article-card author image alt text", () => {
    const card = read("src/components/kennisbank/ArticleCard.tsx");
    expect(card).toContain("labels.profilePhoto");
    expect(card).not.toContain('alt={`Profielfoto van ${value}`}');
  });

  it("renders English search controls without Dutch fallback labels", () => {
    const labels = knowledgeBaseLabels("en");
    const html = renderToStaticMarkup(createElement(SearchBar, {
      value: "seo",
      onChange: () => undefined,
      onClear: () => undefined,
      submitLabel: labels.search,
      clearLabel: labels.clearSearch,
      placeholder: labels.searchPlaceholder,
    }));

    expect(html).toContain(">Search<");
    expect(html).toContain('aria-label="Clear search"');
    expect(html).not.toContain("Zoeken");
    expect(html).not.toContain("Zoekopdracht wissen");
  });

  it("localizes article-card category names and dates from the post locale", () => {
    const post = {
      locale: "en",
      slug: "example",
      categorySlug: "fotografie",
      category: "Fotografie",
      title: "Photography guide",
      excerpt: "Example",
      publishedAt: "2026-07-17T12:00:00.000Z",
      author: "VisualVibe",
      content: "",
    } as BlogPost;

    expect(toArticleCardData(post)).toMatchObject({
      categoryName: "Photography",
      date: expect.stringMatching(/17 July 2026/),
    });
    expect(toArticleCardData({ ...post, locale: "nl" })).toMatchObject({
      categoryName: "Fotografie",
      date: expect.stringMatching(/17 juli 2026/),
    });
    expect(toBlogCardPost(post).category).toBe("Photography");
    expect(toBlogCardPost({ ...post, locale: "nl" }).category).toBe("Fotografie");
  });
});
