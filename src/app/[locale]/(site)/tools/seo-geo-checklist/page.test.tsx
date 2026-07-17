import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

async function loadPageModule() {
  return import("./page");
}

describe("SeoGeoChecklistPage", () => {
  it("is indexable with checklist-focused metadata", async () => {
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
      absolute: expect.stringContaining("SEO/GEO checklist"),
    });
    expect(metadata.description).toContain("SEO");
    expect(metadata.description).toContain("AI-vindbaarheid");
  });

  it("renders all checklist categories and the PDF call to action", async () => {
    const { default: SeoGeoChecklistPage } = await loadPageModule();
    const html = renderToStaticMarkup(<SeoGeoChecklistPage />);

    expect(html).toContain("SEO/GEO checklist");
    expect(html).toContain("Technische SEO");
    expect(html).toContain("Content &amp; zoekwoorden");
    expect(html).toContain("AEO/GEO &amp; AI-vindbaarheid");
    expect(html).toContain("Structured data");
    expect(html).toContain("Snelheid &amp; afbeeldingen");
    expect(html).toContain("Lokale vindbaarheid");
    expect(html).toContain("Download als VisualVibe PDF");
    expect(html).toContain("Analyseer je pagina gratis");
    expect(html).toContain('href="/website-analyse"');
  });
});
