import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a">) =>
    createElement("a", { href: String(href), ...props }, children),
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/firestore/profiles", () => ({
  getAuthorPhotoMap: vi.fn(async () => ({})),
}));

vi.mock("@/components/blog", () => {
  const englishHref = (href: string) =>
    href.startsWith("http") || href.startsWith("#") ? href : `/en${href}`;

  return {
    BlogHero: ({ authorUrl }: { authorUrl?: string }) =>
      authorUrl ? createElement("a", { href: englishHref(authorUrl) }, "author") : null,
    MdxContent: () => null,
    StickyBlogSidebar: ({
      cta,
      service,
    }: {
      cta: { href: string };
      service?: { href: string };
    }) =>
      createElement(
        "aside",
        null,
        createElement("a", { href: englishHref(cta.href) }, "sidebar CTA"),
        service
          ? createElement("a", { href: englishHref(service.href) }, "sidebar service")
          : null,
      ),
  };
});

vi.mock("@/components/sections", () => {
  const englishHref = (href: string) => `/en${href}`;

  return {
    Breadcrumbs: () => null,
    CTASection: ({ primaryHref }: { primaryHref: string }) =>
      createElement("a", { href: englishHref(primaryHref) }, "page CTA"),
    ServiceGrid: ({
      services,
    }: {
      services: Array<{ parentSlug?: string; slug: string; title: string }>;
    }) =>
      createElement(
        "div",
        null,
        services.map((service) => {
          const href = service.parentSlug
            ? `/diensten/${service.parentSlug}/${service.slug}`
            : `/diensten/${service.slug}`;
          return createElement("a", { href: englishHref(href), key: href }, service.title);
        }),
      ),
    RegionGrid: ({ regions }: { regions: Array<{ slug: string; title: string }> }) =>
      createElement(
        "div",
        null,
        regions.map((region) => {
          const href = `/regio/${region.slug}`;
          return createElement("a", { href: englishHref(href), key: href }, region.title);
        }),
      ),
    BlogGrid: ({
      posts,
      locale = "nl",
    }: {
      posts: Array<{ categorySlug: string; slug: string; title: string }>;
      locale?: "nl" | "en";
    }) =>
      createElement(
        "div",
        null,
        posts.map((post) => {
          const prefix = locale === "en" ? "/en" : "/be";
          const href = `${prefix}/kennisbank/${post.categorySlug}/${post.slug}/`;
          return createElement("a", { href, key: href }, post.title);
        }),
      ),
  };
});

describe("English knowledge-base article routes", () => {
  it("renders canonical English links for every article relationship", async () => {
    const page = await import("./page");
    const html = renderToStaticMarkup(
      await page.default({
        params: Promise.resolve({
          locale: "en",
          category: "seo-geo",
          slug: "technical-seo-checklist",
        }),
      }),
    );

    expect(html).toContain('href="/en/request-a-quotation/"');
    expect(html).toContain('href="/en/about/"');
    expect(html).toContain('href="/en/diensten/seo/technical-seo"');
    expect(html).toContain('href="/en/regio/limburg-belgium"');
    expect(html).toContain(
      'href="/en/kennisbank/seo-geo/local-seo-for-smes-in-limburg/"',
    );

    expect(html).not.toContain("/en/en/");
    expect(html).not.toContain("/en/over-ons");
    expect(html).not.toContain("/en/offerte-aanvragen");
    expect(html).not.toContain("/en/diensten/seo/technische-seo");
    expect(html).not.toContain("/be/kennisbank/");
  });
});
