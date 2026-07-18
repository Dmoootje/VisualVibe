import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a">) => <a href={String(href)} {...props}>{children}</a>,
}));
vi.mock("@/components/seo", () => ({
  BreadcrumbJsonLd: ({ items }: { items: unknown }) => <script data-breadcrumbs={JSON.stringify(items)} />,
  FaqPageJsonLd: ({ items }: { items: unknown }) => <script data-faq={JSON.stringify(items)} />,
  ServiceJsonLd: ({ service }: { service: unknown }) => <script data-service={JSON.stringify(service)} />,
  JsonLd: ({ data }: { data: unknown }) => <script data-jsonld={JSON.stringify(data)} />,
}));
vi.mock("@/components/sections", () => ({
  CTASection: ({ title, description, primaryHref, primaryLabel }: { title: string; description?: string; primaryHref?: string; primaryLabel?: string }) => <section data-cta-href={primaryHref} data-cta-label={primaryLabel}>{title}{description}{primaryLabel}</section>,
  ServiceGrid: ({ services }: { services: Array<{ title: string; slug: string }> }) => <div>{services.map((service) => <a key={service.slug} href={`/diensten/${service.slug}`}>{service.title}</a>)}</div>,
  ProcessSteps: ({ steps }: { steps: Array<{ title: string }> }) => <div>{steps.map((step) => <span key={step.title}>{step.title}</span>)}</div>,
}));
vi.mock("@/lib/firestore/webdesignProjects", () => ({ getWebdesignProjects: vi.fn(async () => []) }));
vi.mock("@/lib/firestore/webdesignImages", () => ({ getWebdesignImages: vi.fn(async () => ({})) }));
vi.mock("@/lib/firestore/fotografieGalleries", () => ({ getFotografieGalleries: vi.fn(async () => []) }));
vi.mock("@/lib/firestore/profiles", () => ({ getAuthorPhotoMap: vi.fn(async () => ({})) }));
vi.mock("@/lib/youtube", () => ({ getVideografieVideos: vi.fn(async () => ({ videos: [] })), ytThumb: (id: string) => `thumb-${id}` }));

describe("English sector routes", () => {
  it("renders the English hub copy, metadata and public sector slugs", async () => {
    const page = await import("./page");
    const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ locale: "en" }) }));
    const metadata = await page.generateMetadata({ params: Promise.resolve({ locale: "en" }) });

    expect(html).toContain("Industries we know inside out");
    expect(html).toContain("Construction and renovation");
    expect(html).toContain("/sectoren/construction-renovation");
    expect(html).toContain("Explore sector");
    expect(html).toContain('data-cta-href="/request-a-quotation/"');
    expect(html).toContain("Sector-specific web design, photography, video, drone and SEO for ten business sectors");
    expect(html).not.toContain("Sectoren waarin wij uitblinken");
    expect(html).not.toContain("bouw-renovatie");
    expect(metadata.description).toContain("web design");
    expect(metadata.alternates?.canonical).toContain("/en/sectoren/");
  });

  it("keeps Dutch CTA destinations and emits only published static params", async () => {
    const hub = await import("./page");
    const detail = await import("./[slug]/page");
    const hubHtml = renderToStaticMarkup(await hub.default({ params: Promise.resolve({ locale: "nl" }) }));
    const detailHtml = renderToStaticMarkup(await detail.default({ params: Promise.resolve({ locale: "nl", slug: "bouw-renovatie" }) }));

    expect(hubHtml).toContain('data-cta-href="/offerte-aanvragen"');
    expect(detailHtml).toContain('data-cta-href="/offerte-aanvragen"');
    expect(detailHtml).toContain('href="/offerte-aanvragen"');
    expect(detail.generateStaticParams()).toEqual(expect.arrayContaining([
      { locale: "nl", slug: "bouw-renovatie" },
      { locale: "en", slug: "construction-renovation" },
    ]));
  });

  it("renders an English detail route with localized services, regions and no dynamic Dutch fallback", async () => {
    vi.clearAllMocks();
    const page = await import("./[slug]/page");
    const { getWebdesignProjects } = await import("@/lib/firestore/webdesignProjects");
    const { getWebdesignImages } = await import("@/lib/firestore/webdesignImages");
    const { getFotografieGalleries } = await import("@/lib/firestore/fotografieGalleries");
    const { getVideografieVideos } = await import("@/lib/youtube");
    const params = Promise.resolve({ locale: "en" as const, slug: "construction-renovation" });
    const html = renderToStaticMarkup(await page.default({ params }));
    const metadata = await page.generateMetadata({ params });

    expect(html).toContain("Construction and renovation");
    expect(html).toContain("Other industries");
    expect(html).toContain("Web design");
    expect(html).toContain("/diensten/business-website-design");
    expect(html).toContain("Limburg, Belgium");
    expect(html).toContain("/regio/limburg-belgium");
    expect(html).toContain('data-cta-href="/request-a-quotation/"');
    expect(html).toContain('data-cta-label="Request a quotation"');
    expect(html).toContain('href="/request-a-quotation"');
    expect(html).toContain("Request a quotation");
    expect(html).not.toContain('href="/offerte-aanvragen"');
    expect(html).toContain('/en/kennisbank/');
    expect(html).not.toContain('/be/kennisbank/');
    expect(html).not.toContain("Andere sectoren");
    expect(html).not.toContain(">Sectoren<");
    expect(html).not.toContain("Bekijk cases");
    expect(html).not.toContain("Aanbevolen diensten");
    expect(html).not.toContain("Webdesignprojecten");
    expect(metadata.title).toMatchObject({ absolute: expect.stringContaining("construction") });
    expect(metadata.alternates?.canonical).toContain("/en/sectoren/construction-renovation/");
    expect(getWebdesignProjects).not.toHaveBeenCalled();
    expect(getWebdesignImages).not.toHaveBeenCalled();
    expect(getFotografieGalleries).not.toHaveBeenCalled();
    expect(getVideografieVideos).not.toHaveBeenCalled();
  });
});
