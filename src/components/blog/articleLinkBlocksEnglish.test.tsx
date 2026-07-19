import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { BlogCTA } from "./BlogCTA";
import { MdxLink } from "./MdxContent";
import { RelatedArticles } from "./RelatedArticles";
import { RelatedRegions } from "./RelatedRegions";
import { RelatedServices } from "./RelatedServices";
import { normalizeKnowledgeBaseHref } from "@/lib/kennisbank/publicLinks";

const { getAllPosts } = vi.hoisted(() => ({
  getAllPosts: vi.fn(() => []),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) =>
    createElement("a", { href }, children),
}));
vi.mock("@/lib/kennisbank/posts", () => ({ getAllPosts }));
vi.mock("@/lib/firestore/profiles", () => ({ getAuthorPhotoMap: async () => ({}) }));

describe("English in-article knowledge-base links", () => {
  it("resolves legacy English route wording through stable publication IDs", () => {
    expect([
      "/en/diensten/fotografie/real-estate-photography/",
      "/en/diensten/photography/real-estate-photography/",
    ].map((href) => normalizeKnowledgeBaseHref(href, "en"))).toEqual([
      "/services/photography/property-photography/",
      "/services/photography/property-photography/",
    ]);
    expect(normalizeKnowledgeBaseHref(
      "/en/diensten/drone-fpv/real-estate-drone-imagery/",
      "en",
    )).toBe("/services/drone-fpv/real-estate-drone-footage/");
    expect(normalizeKnowledgeBaseHref(
      "/en/diensten/drone-fpv/project-drone-footage/",
      "en",
    )).toBe("/services/drone-fpv/construction-project-drone-footage/");
    expect(normalizeKnowledgeBaseHref(
      "/en/diensten/videography/corporate-event-aftermovie/",
      "en",
    )).toBe("/services/videography/event-aftermovie/");
    expect(normalizeKnowledgeBaseHref(
      "/en/diensten/photography/corporate-portraits/",
      "en",
    )).toBe("/services/photography/business-portraits/");
    expect(normalizeKnowledgeBaseHref(
      "/en/diensten/masterclasses/workshop-filming/",
      "en",
    )).toBe("/services/masterclasses/workshop-video-production/");
    expect(normalizeKnowledgeBaseHref(
      "/en/diensten/web-design/seo-website-development/",
      "en",
    )).toBe("/services/web-design/seo-ready-website/");
    expect(normalizeKnowledgeBaseHref(
      "/en/diensten/web-design/website-with-ai-features/",
      "en",
    )).toBe("/services/custom-software/ai-application-development/");
    expect(normalizeKnowledgeBaseHref(
      "/en/kennisbank/webdesign/website-laten-maken-kosten/",
      "en",
    )).toBe("/kennisbank/webdesign/website-development-costs/");
  });

  it("canonicalizes native MDX anchors at the article locale boundary", () => {
    const html = renderToStaticMarkup(
      createElement(
        "div",
        null,
        createElement(
          MdxLink,
          { href: "/en/about/", locale: "en" },
          "About",
        ),
        createElement(
          MdxLink,
          { href: "/diensten/seo/technische-seo/", locale: "en" },
          "Technical SEO",
        ),
        createElement(
          MdxLink,
          { href: "/realisaties/photography/", locale: "en" },
          "Photography portfolio",
        ),
      ),
    );

    expect(html).toContain('href="/about/"');
    expect(html).toContain('href="/services/seo/technical-seo/"');
    expect(html).not.toContain("realisaties/photography");
  });

  it("normalizes CTAs, related services and regions before locale-aware rendering", () => {
    const html = renderToStaticMarkup(
      createElement(
        "div",
        null,
        createElement(BlogCTA, {
          title: "Technical SEO",
          buttonLabel: "Request an audit",
          href: "/en/offerte-aanvragen/",
          secondaryLabel: "View technical SEO",
          secondaryHref: "/diensten/seo/technische-seo/",
          locale: "en",
        }),
        createElement(RelatedServices, {
          locale: "en",
          items: [
            { title: "Technical SEO", href: "/diensten/seo/technische-seo/" },
            { title: "Wedding photography", href: "/trouwfotograaf-limburg/" },
            { title: "Photography portfolio", href: "/realisaties/photography/" },
          ],
        }),
        createElement(RelatedRegions, {
          locale: "en",
          items: [{ name: "Limburg", href: "/regio/limburg/" }],
        }),
      ),
    );

    expect(html).toContain('href="/request-a-quotation/"');
    expect(html).toContain('href="/services/seo/technical-seo/"');
    expect(html).toContain('href="/regio/limburg-belgium/"');
    expect(html).not.toContain("offerte-aanvragen");
    expect(html).not.toContain("trouwfotograaf-limburg");
    expect(html).not.toContain("realisaties/photography");
  });

  it("uses the article locale for related-article lookup and hrefs", async () => {
    const element = await RelatedArticles({
      locale: "en",
      items: [
        {
          title: "Local SEO for SMEs",
          href: "/en/kennisbank/seo-geo/local-seo-for-smes-in-limburg/",
        },
      ],
    });
    const html = renderToStaticMarkup(element);

    expect(getAllPosts).toHaveBeenCalledWith({ locale: "en" });
    expect(html).toContain(
      'href="/kennisbank/seo-geo/local-seo-for-smes-in-limburg/"',
    );
    expect(html).not.toContain("/en/kennisbank/");
  });
});
