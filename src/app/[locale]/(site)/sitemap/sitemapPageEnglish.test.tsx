import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.ComponentProps<"a">) => (
    <a href={String(href)} {...props}>{children}</a>
  ),
}));
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a">) => (
    <a href={String(href)} {...props}>{children}</a>
  ),
}));
vi.mock("@/components/seo", () => ({ BreadcrumbJsonLd: () => null }));
vi.mock("@/lib/seo/siteUrls", () => ({
  getSitemapEntries: vi.fn(async () => [
    { url: "https://visualvibe.media/en/" },
    { url: "https://visualvibe.media/en/about/" },
    { url: "https://visualvibe.media/en/diensten/" },
    { url: "https://visualvibe.media/en/diensten/web-design/business-website-design/" },
    { url: "https://visualvibe.media/en/regio/limburg-belgium/" },
    { url: "https://visualvibe.media/en/sectoren/construction-renovation/" },
    { url: "https://visualvibe.media/en/realisaties/web-design/" },
    { url: "https://visualvibe.media/en/kennisbank/" },
    { url: "https://visualvibe.media/en/kennisbank/webdesign/what-does-a-website-cost/" },
    { url: "https://visualvibe.media/en/tools/" },
  ]),
}));
vi.mock("@/lib/firestore/applicationCases", () => ({
  getApplicationCases: vi.fn(async () => []),
}));

describe("English visible sitemap page", () => {
  it("renders the shared inventory total and representative grouped links", async () => {
    const page = await import("./page");
    const html = renderToStaticMarkup(await page.default({
      params: Promise.resolve({ locale: "en" }),
    }));

    expect(html).toContain("There are 10 pages in total.");
    expect(html).toContain('href="/en/diensten/web-design/business-website-design/"');
    expect(html).toContain('href="/en/regio/limburg-belgium/"');
    expect(html).toContain('href="/en/sectoren/construction-renovation/"');
    expect(html).toContain('href="/en/realisaties/web-design/"');
    expect(html).toContain('href="/en/kennisbank/webdesign/what-does-a-website-cost/"');
  });
});
