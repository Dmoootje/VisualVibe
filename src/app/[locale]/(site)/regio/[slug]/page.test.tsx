import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));
vi.mock("@/components/seo", () => ({ BreadcrumbJsonLd: () => null, ServiceJsonLd: () => null }));
vi.mock("@/components/sections", () => ({
  BlogGrid: ({ locale }: { locale?: string }) => <div data-blog-locale={locale} />,
  CTASection: ({ title, primaryHref }: { title: string; primaryHref?: string }) => <section data-cta-href={primaryHref}>{title}</section>,
}));
vi.mock("@/features/home/RegionIntro/components/RegionMiniMap", () => ({
  RegionMiniMap: ({ slug }: { slug: string }) => <span data-map={slug} />,
}));

import RegionDetailPage, { generateMetadata, generateStaticParams } from "./page";

describe("English region detail route", () => {
  it("resolves the English slug and renders only localized region and service copy", async () => {
    const params = Promise.resolve({ locale: "en" as const, slug: "limburg-belgium" });
    const metadata = await generateMetadata({ params });
    const html = renderToStaticMarkup(await RegionDetailPage({ params }));

    expect(metadata.title).toEqual({ absolute: "Web Design, Photography and Video in Limburg | VisualVibe" });
    expect(metadata.alternates?.canonical).toContain("/en/regio/limburg-belgium/");
    expect(html).toContain("Limburg, Belgium");
    expect(html).toContain("Web design");
    expect(html).toContain('href="/services/web-design"');
    expect(html).toContain('data-cta-href="/request-a-quotation/"');
    expect(html).toContain('data-blog-locale="en"');
    expect(html).not.toMatch(/Onze diensten|Bekijk alle diensten|Werkgebied|Kennisbank|Uit de kennisbank|Realisaties|Offerte aanvragen/);
  });

  it("keeps the Dutch detail CTA and generates only published locale-slug pairs", async () => {
    const html = renderToStaticMarkup(await RegionDetailPage({ params: Promise.resolve({ locale: "nl", slug: "limburg" }) }));
    expect(html).toContain('data-cta-href="/offerte-aanvragen"');
    expect(generateStaticParams()).toEqual(expect.arrayContaining([
      { locale: "nl", slug: "limburg" },
      { locale: "en", slug: "limburg-belgium" },
    ]));
  });
});
