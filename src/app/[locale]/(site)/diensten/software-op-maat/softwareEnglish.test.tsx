import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a">) => (
    <a href={String(href)} {...props}>{children}</a>
  ),
}));

describe("English custom software pages", () => {
  it("renders the localized hub with English metadata, schema and detail links", async () => {
    const page = await import("./page");
    const params = Promise.resolve({ locale: "en" });
    const html = renderToStaticMarkup(await page.default({ params }));
    expect(typeof page.generateMetadata).toBe("function");
    const metadata = await page.generateMetadata!({ params });

    expect(metadata.title).toMatchObject({ absolute: expect.stringContaining("Custom software") });
    expect(metadata.alternates?.canonical).toContain("/en/services/custom-software/");
    expect(html).toContain("Custom apps and software built around your business");
    expect(html).toContain('href="/services/custom-software/app-development/"');
    expect(html).toContain('href="/services/web-design/"');
    expect(html).not.toContain("website-with-ai-features");
    expect(html).toContain("https://visualvibe.media/en/services/custom-software/");
    expect(html).toContain("Request a quotation");
    expect(html).not.toMatch(/Software op maat|Welke digitale|Bekijk deze dienst|Veelgestelde vragen|Bedrijven, kmo|Vlaanderen|Offerte aanvragen/);
  });

  it("renders an English detail route with localized content, schema and internal targets", async () => {
    const page = await import("./[subslug]/page");
    const params = Promise.resolve({ locale: "en", subslug: "app-development" });
    const html = renderToStaticMarkup(await page.default({ params }));
    const metadata = await page.generateMetadata({ params });

    expect(metadata.title).toMatchObject({ absolute: expect.stringContaining("App development") });
    expect(metadata.alternates?.canonical).toContain("/en/services/custom-software/app-development/");
    expect(html).toContain("App development for your business");
    expect(html).toContain("https://visualvibe.media/en/services/custom-software/app-development/");
    expect(html).toContain('href="/services/custom-software/web-application-development/"');
    expect(html).toContain("Request a quotation");
    expect(html).not.toMatch(/Wat deze oplossing|Geschikt voor|Aanpak|Veelgestelde vragen|Andere mogelijkheden|Bedrijven, kmo|Vlaanderen|Offerte aanvragen/);
  });

  it.each([
    ["web-application-development", "Web application development"],
    ["ai-application-development", "AI application development"],
    ["api-integrations-and-automation", "API integrations and automation"],
    ["app-design-ux-ui", "App design and UX/UI"],
  ])("renders the complete English detail page for %s", async (subslug, heading) => {
    const page = await import("./[subslug]/page");
    const params = Promise.resolve({ locale: "en", subslug });
    const html = renderToStaticMarkup(await page.default({ params }));
    const metadata = await page.generateMetadata({ params });

    expect(html).toContain(heading);
    expect(html).toContain("Frequently asked questions about");
    expect(metadata.alternates?.canonical).toContain(`/en/services/custom-software/${subslug}/`);
    expect(html).not.toMatch(/Wat deze oplossing|Geschikt voor|Aanpak|Veelgestelde vragen|Andere mogelijkheden/);
  });
});
