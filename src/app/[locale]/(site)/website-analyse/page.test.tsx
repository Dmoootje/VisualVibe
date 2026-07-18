import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/analyse/AnalyseFlow", () => ({
  AnalyseFlow: () => <div data-testid="analyse-flow">Analyseformulier</div>,
}));

vi.mock("@/components/analyse/WebsiteAnalyseWidget", () => ({
  WebsiteAnalyseWidget: () => <div data-testid="analyse-widget">Analysewidget</div>,
}));

vi.mock("@/lib/analyse/integration", () => ({
  getAnalysisIntegrationPublic: vi.fn(async () => ({
    mode: "api",
    publicKey: "pk_test",
    widgetScriptUrl: "https://seowebsites.be/widgets/website-analyse.v1.js",
  })),
}));

async function loadPageModule() {
  return import("./page");
}

describe("WebsiteAnalysePage", () => {
  it("is indexable with search-focused metadata", async () => {
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
      absolute: expect.stringContaining("Gratis website analyse"),
    });
    expect(metadata.description).toContain("SEO");
    expect(metadata.description).toContain("snelheid");
    expect(JSON.stringify(metadata.openGraph?.images)).toContain(
      "Gratis%20website%20analyse.webp",
    );
    expect(JSON.stringify(metadata.openGraph?.images)).toContain(
      "Gratis VisualVibe website analyse voor SEO, snelheid, techniek en AI-vindbaarheid",
    );
  });

  it("renders SEO landing-page content around the analysis tool", async () => {
    const { default: WebsiteAnalysePage } = await loadPageModule();
    const html = renderToStaticMarkup(await WebsiteAnalysePage({ params: Promise.resolve({ locale: "nl" }) }));

    expect(html).toContain("Gratis website analyse");
    expect(html).toContain("Wat controleert onze website analyse?");
    expect(html).toContain("Technische SEO");
    expect(html).toContain("Core Web Vitals");
    expect(html).toContain("AI-vindbaarheid");
    expect(html).toContain("Gratis analyse of volledige SEO-audit?");
    expect(html).toContain("Veelgestelde vragen");
    expect(html).toContain(
      'alt="Gratis VisualVibe website analyse voor SEO, snelheid, techniek en AI-vindbaarheid"',
    );

    expect(html).toContain("/diensten/seo/");
    expect(html).toContain("/diensten/webdesign/");
    expect(html).toContain("/offerte-aanvragen/");
  });

  it("publishes FAQ structured data for long-tail search questions", async () => {
    const { default: WebsiteAnalysePage } = await loadPageModule();
    const html = renderToStaticMarkup(await WebsiteAnalysePage({ params: Promise.resolve({ locale: "nl" }) }));

    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain("Wat is een website analyse?");
    expect(html).toContain("Is de website analyse gratis?");
    expect(html).toContain("Kan ik mijn website opnieuw analyseren?");
  });

  it("renders a complete English landing page with localised SEO and links", async () => {
    const { default: WebsiteAnalysePage, generateMetadata } = await loadPageModule();
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "en" }) });
    const html = renderToStaticMarkup(await WebsiteAnalysePage({ params: Promise.resolve({ locale: "en" }) }));
    expect(metadata.title).toMatchObject({ absolute: expect.stringContaining("Free website analysis") });
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
    expect(metadata.alternates).toMatchObject({
      canonical: "https://visualvibe.media/en/website-analysis/",
      languages: {
        "nl-BE": "https://visualvibe.media/be/website-analyse/",
        "en-BE": "https://visualvibe.media/en/website-analysis/",
        "x-default": "https://visualvibe.media/be/website-analyse/",
      },
    });
    expect(html).toContain("What does our website analysis check?");
    expect(html).toContain("Is the website analysis free?");
    expect(html).toContain("/en/diensten/seo/");
    expect(html).not.toContain("Wat controleert");
    expect(html).not.toContain("/be/");
  });
});
