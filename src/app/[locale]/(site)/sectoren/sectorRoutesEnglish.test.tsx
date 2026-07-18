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
  CTASection: ({ title, description }: { title: string; description?: string }) => <section>{title}{description}</section>,
  ServiceGrid: ({ services }: { services: Array<{ title: string; slug: string }> }) => <div>{services.map((service) => <a key={service.slug} href={`/diensten/${service.slug}`}>{service.title}</a>)}</div>,
  ProcessSteps: ({ steps }: { steps: Array<{ title: string }> }) => <div>{steps.map((step) => <span key={step.title}>{step.title}</span>)}</div>,
}));
vi.mock("@/lib/firestore/webdesignProjects", () => ({ getWebdesignProjects: vi.fn(async () => { throw new Error("English must not load Firestore projects"); }) }));
vi.mock("@/lib/firestore/webdesignImages", () => ({ getWebdesignImages: vi.fn(async () => { throw new Error("English must not load Firestore images"); }) }));
vi.mock("@/lib/firestore/fotografieGalleries", () => ({ getFotografieGalleries: vi.fn(async () => { throw new Error("English must not load Firestore galleries"); }) }));
vi.mock("@/lib/firestore/profiles", () => ({ getAuthorPhotoMap: vi.fn(async () => ({})) }));
vi.mock("@/lib/youtube", () => ({ getVideografieVideos: vi.fn(async () => { throw new Error("English must not load YouTube"); }), ytThumb: (id: string) => `thumb-${id}` }));

describe("English sector routes", () => {
  it("renders the English hub copy, metadata and public sector slugs", async () => {
    const page = await import("./page");
    const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ locale: "en" }) }));
    const metadata = await page.generateMetadata({ params: Promise.resolve({ locale: "en" }) });

    expect(html).toContain("Industries we know inside out");
    expect(html).toContain("Construction and renovation");
    expect(html).toContain("/sectoren/construction-renovation");
    expect(html).toContain("Explore sector");
    expect(html).not.toContain("Sectoren waarin wij uitblinken");
    expect(html).not.toContain("bouw-renovatie");
    expect(metadata.description).toContain("web design");
    expect(metadata.alternates?.canonical).toContain("/en/sectoren/");
  });

  it("renders an English detail route with localized services, regions and no dynamic Dutch fallback", async () => {
    const page = await import("./[slug]/page");
    const params = Promise.resolve({ locale: "en" as const, slug: "construction-renovation" });
    const html = renderToStaticMarkup(await page.default({ params }));
    const metadata = await page.generateMetadata({ params });

    expect(html).toContain("Construction and renovation");
    expect(html).toContain("Other industries");
    expect(html).toContain("Web design");
    expect(html).toContain("/diensten/business-website-design");
    expect(html).toContain("Limburg, Belgium");
    expect(html).toContain("/regio/limburg-belgium");
    expect(html).not.toContain("Andere sectoren");
    expect(html).not.toContain("Aanbevolen diensten");
    expect(html).not.toContain("Webdesignprojecten");
    expect(metadata.title).toMatchObject({ absolute: expect.stringContaining("construction") });
    expect(metadata.alternates?.canonical).toContain("/en/sectoren/construction-renovation/");
  });
});
