import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

async function loadPageModule() {
  return import("./page");
}

describe("SeoGeoChecklistPage", () => {
  it("is indexable with checklist-focused metadata", async () => {
    const { generateMetadata } = await loadPageModule();
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "nl" }) });

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
    expect(JSON.stringify(metadata.openGraph?.images)).toContain(
      "SEO-GEO-checklist.webp",
    );
    expect(JSON.stringify(metadata.openGraph?.images)).toContain(
      "VisualVibe SEO/GEO checklist voor Google en AI-vindbaarheid",
    );
  });

  it("renders all checklist categories and the PDF call to action", async () => {
    const { default: SeoGeoChecklistPage } = await loadPageModule();
    const html = renderToStaticMarkup(await SeoGeoChecklistPage({ params: Promise.resolve({ locale: "nl" }) }));

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
    expect(html).toContain(
      'alt="VisualVibe SEO/GEO checklist voor Google en AI-vindbaarheid"',
    );
  });

  it("renders the complete English checklist", async () => {
    const { default: SeoGeoChecklistPage, generateMetadata } = await loadPageModule();
    const html = renderToStaticMarkup(await SeoGeoChecklistPage({ params: Promise.resolve({ locale: "en" }) }));
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "en" }) });
    expect(html).toContain("Technical SEO");
    expect(html).toContain("Content &amp; keywords");
    expect(html).toContain("checkpoints");
    expect(html).not.toContain("controlepunten");
    expect(html).toContain('"inLanguage":"en-BE"');
    expect(html).not.toContain('"inLanguage":"nl-BE"');
    expect(metadata.description).toContain("AI search");
  });
});
