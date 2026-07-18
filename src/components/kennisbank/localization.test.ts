import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { knowledgeBaseLabels } from "./localization";

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
    });
    expect(knowledgeBaseLabels("nl")).toMatchObject({
      knowledgeBase: "Kennisbank",
      category: "Categorie",
      relatedArticles: "Gerelateerde artikels",
      readArticle: "Lees het volledige artikel",
      tableOfContents: "Inhoud",
      share: "Delen",
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
});
