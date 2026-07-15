import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { RelatedArticles } from "./RelatedArticles";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) =>
    createElement("a", { href }, children),
}));
vi.mock("@/lib/kennisbank/posts", () => ({ getAllPosts: () => [] }));
vi.mock("@/lib/firestore/profiles", () => ({ getAuthorPhotoMap: async () => ({}) }));

describe("RelatedArticles", () => {
  it("renders a relevant alt for the author photo", async () => {
    const element = await RelatedArticles({
      items: [
        {
          title: "Gerelateerd artikel",
          href: "/kennisbank/seo-geo/gerelateerd-artikel",
          author: "Jens Hardy",
          authorImage: "/images/team/profielfoto.webp",
        },
      ],
    });
    const html = renderToStaticMarkup(element);

    expect(html).toContain('alt="Profielfoto van Jens Hardy"');
  });
});
