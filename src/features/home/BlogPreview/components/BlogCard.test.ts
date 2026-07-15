import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { BlogCardPost } from "@/lib/kennisbank/blogCard";
import { BlogCard } from "./BlogCard";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) =>
    createElement("a", { href }, children),
}));

describe("BlogCard", () => {
  it("renders a relevant alt for the author photo", () => {
    const post: BlogCardPost = {
      title: "Testartikel",
      slug: "testartikel",
      categorySlug: "seo-geo",
      category: "SEO & GEO",
      publishedAt: "2026-07-15T10:00:00.000Z",
      readingTime: "5 min",
      author: "Jens Hardy",
      excerpt: "Testsamenvatting",
    };

    const html = renderToStaticMarkup(
      createElement(BlogCard, {
        post,
        index: 0,
        authorImage: "/images/team/profielfoto.webp",
      }),
    );

    expect(html).toContain('alt="Profielfoto van Jens Hardy"');
  });
});
