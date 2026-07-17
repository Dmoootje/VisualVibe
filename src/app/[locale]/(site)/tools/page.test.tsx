import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

async function loadPageModule() {
  return import("./page");
}

describe("ToolsPage", () => {
  it("is indexable with tools-focused metadata", async () => {
    const { metadata } = await loadPageModule();

    expect(metadata.robots).toMatchObject({
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    });
    expect(metadata.title).toMatchObject({
      absolute: expect.stringContaining("Gratis tools"),
    });
    expect(metadata.description).toContain("website analyse");
    expect(metadata.description).toContain("SEO/GEO checklist");
  });

  it("renders the first public tools and links to their pages", async () => {
    const { default: ToolsPage } = await loadPageModule();
    const html = renderToStaticMarkup(<ToolsPage />);

    expect(html).toContain("Gratis tools voor je website");
    expect(html).toContain("Website analyse");
    expect(html).toContain("SEO/GEO checklist");
    expect(html).toContain('href="/website-analyse"');
    expect(html).toContain('href="/tools/seo-geo-checklist"');
  });
});
