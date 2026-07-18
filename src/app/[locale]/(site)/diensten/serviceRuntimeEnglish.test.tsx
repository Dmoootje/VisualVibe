import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));
vi.mock("@/components/seo", () => ({
  BreadcrumbJsonLd: ({ items, locale }: { items: unknown; locale?: string }) => (
    <script data-breadcrumb-locale={locale}>{JSON.stringify(items)}</script>
  ),
  ServiceJsonLd: ({ service, locale }: { service: unknown; locale?: string }) => (
    <script data-service-locale={locale}>{JSON.stringify(service)}</script>
  ),
  FaqPageJsonLd: () => null,
}));
vi.mock("@/components/sections", () => ({
  PageHero: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <header><h1>{title}</h1><p>{subtitle}</p></header>
  ),
  CTASection: ({ title, description, primaryLabel, primaryHref }: {
    title: string;
    description?: string;
    primaryLabel?: string;
    primaryHref?: string;
  }) => <section><h2>{title}</h2><p>{description}</p><a href={primaryHref}>{primaryLabel}</a></section>,
  ServiceGrid: ({ services }: { services: Array<{ slug: string; parentSlug?: string; title: string }> }) => (
    <ul>{services.map((service) => (
      <li key={service.slug}>
        <a href={`/diensten/${service.parentSlug ? `${service.parentSlug}/` : ""}${service.slug}`}>
          {service.title}
        </a>
      </li>
    ))}</ul>
  ),
  ProcessSteps: ({ steps }: { steps: Array<{ title: string }> }) => (
    <ol>{steps.map((step) => <li key={step.title}>{step.title}</li>)}</ol>
  ),
  ServiceFaqCombine: ({ faqHeading, combineEyebrow, combineHeading }: {
    faqHeading?: string;
    combineEyebrow?: string;
    combineHeading?: string;
  }) => <section>{faqHeading} {combineEyebrow} {combineHeading}</section>,
}));
vi.mock("@/components/sections/ServiceRelatedPosts", () => ({
  ServiceRelatedPosts: () => <aside data-dutch-related-posts />,
}));
vi.mock("@/features/home/RegionIntro/components", () => ({
  RegionMapCard: ({ region }: { region: { slug: string; title: string } }) => (
    <a href={`/regio/${region.slug}/`}>{region.title}</a>
  ),
}));
vi.mock("@/components/webdesign", () => ({
  WebdesignHero: () => <div data-dutch-bespoke="webdesign" />,
  WebdesignShowcase: () => null,
}));
vi.mock("@/components/seodienst", () => ({ SeoService: () => <div data-dutch-bespoke="seo" /> }));
vi.mock("@/components/fotografie", () => ({ FotografieService: () => <div data-dutch-bespoke="photography" /> }));
vi.mock("@/components/videografie", () => ({ VideografieService: () => <div data-dutch-bespoke="videography" /> }));
vi.mock("@/components/drone", () => ({ DroneFpvService: () => <div data-dutch-bespoke="drone" /> }));
vi.mock("@/components/xr", () => ({ XrService: () => <div data-dutch-bespoke="xr" /> }));
vi.mock("@/components/subdiensten", () => ({ SubdienstenGrid: () => null }));
vi.mock("@/lib/firestore/webdesignImages", () => ({
  getWebdesignImages: vi.fn(async () => { throw new Error("English used Dutch bespoke media"); }),
}));
vi.mock("@/lib/firestore/webdesignProjects", () => ({
  getWebdesignProjects: vi.fn(async () => { throw new Error("English used Dutch bespoke projects"); }),
}));
vi.mock("@/lib/youtube", () => ({
  getVideografieVideos: vi.fn(async () => { throw new Error("English used Dutch video helper"); }),
}));
vi.mock("@/lib/realisaties/hubData", () => ({
  getHubData: vi.fn(async () => { throw new Error("English used Dutch realisation helper"); }),
}));

describe("English dynamic service runtime", () => {
  it("renders an English main-service slug through localized generic content", async () => {
    const page = await import("./[slug]/page");
    const params = Promise.resolve({ locale: "en" as const, slug: "web-design" });
    const metadata = await page.generateMetadata({ params });
    const html = renderToStaticMarkup(await page.default({ params }));

    expect(page.generateStaticParams()).toEqual(expect.arrayContaining([
      { locale: "nl", slug: "webdesign" },
      { locale: "en", slug: "web-design" },
    ]));
    expect(metadata.alternates?.canonical).toContain("/en/diensten/web-design/");
    expect(html).toContain("Web design");
    expect(html).toContain('href="/diensten/web-design/business-website-design"');
    expect(html).toContain("Service overview");
    expect(html).toContain("How we work");
    expect(html).toContain("Request a quotation");
    expect(html).toContain('href="/request-a-quotation/"');
    expect(html).toContain("https://visualvibe.media/en/diensten/web-design/");
    expect(html).not.toMatch(/\/en\/en\/|href="\/en\/request-a-quotation\/"|data-dutch-bespoke|data-dutch-related-posts|Diensten overzicht|Hoe we werken|Offerte aanvragen|Bekijk de realisaties/);
  });

  it("renders an English subservice from its stable-ID editorial mirror", async () => {
    const page = await import("./[slug]/[sub]/page");
    const params = Promise.resolve({
      locale: "en" as const,
      slug: "web-design",
      sub: "business-website-design",
    });
    const metadata = await page.generateMetadata({ params });
    const html = renderToStaticMarkup(await page.default({ params }));

    expect(page.generateStaticParams()).toEqual(expect.arrayContaining([
      { locale: "nl", slug: "webdesign", sub: "website-laten-maken" },
      { locale: "en", slug: "web-design", sub: "business-website-design" },
    ]));
    expect(metadata.alternates?.canonical).toContain(
      "/en/diensten/web-design/business-website-design/",
    );
    expect(html).toContain("Business website design");
    expect(html).toContain("Having a website built involves more than putting a new design online");
    expect(html).toContain("A website designed to do a clear job");
    expect(html).toContain('href="/diensten/web-design/online-shop-development"');
    expect(html).toContain("Part of Web design");
    expect(html).toContain("Frequently asked questions");
    expect(html).toContain("Related services");
    expect(html).toContain("Request a quotation");
    expect(html).toContain('href="/request-a-quotation/"');
    expect(html).toContain(
      "https://visualvibe.media/en/diensten/web-design/business-website-design/",
    );
    expect(html).not.toMatch(/\/en\/en\/|href="\/en\/request-a-quotation\/"|data-dutch-related-posts|Onderdeel van|Veelgestelde vragen|Gerelateerde diensten|Offerte aanvragen|Actief in deze regio/);
  });
});
