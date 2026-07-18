import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a">) =>
    createElement("a", { href: String(href), ...props }, children),
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/lib/firestore/profiles", () => ({
  getAuthorPhotoMap: vi.fn(async () => ({})),
}));

const expectedLanguages = {
  "nl-BE": expect.stringContaining("/be/kennisbank/"),
  "en-BE": expect.stringContaining("/en/kennisbank/"),
  "x-default": expect.stringContaining("/be/kennisbank/"),
};

describe("published knowledge-base metadata", () => {
  it("links the Dutch and English knowledge-base hubs reciprocally", async () => {
    const page = await import("./page");
    const metadata = await page.generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.alternates).toMatchObject({ languages: expectedLanguages });
  });

  it("links bilingual category hubs without advertising disabled locales", async () => {
    const page = await import("./[category]/page");
    const metadata = await page.generateMetadata({
      params: Promise.resolve({ locale: "en", category: "webdesign" }),
    });

    expect(metadata.alternates).toMatchObject({ languages: expectedLanguages });
    expect(metadata.alternates?.languages).not.toHaveProperty("fr-BE");
    expect(metadata.alternates?.languages).not.toHaveProperty("de-DE");
  });

  it("uses the central English category overlay in photography metadata and hero copy", async () => {
    const page = await import("./[category]/page");
    const params = Promise.resolve({ locale: "en", category: "fotografie" });
    const metadata = await page.generateMetadata({ params });
    const html = renderToStaticMarkup(await page.default({ params }));

    expect(metadata.title).toMatchObject({
      absolute: expect.stringContaining("Photography"),
    });
    expect(metadata.description).toContain("photography");
    expect(html).toContain("Knowledge base: Photography by VisualVibe");
    expect(html).not.toContain("Knowledge base: Fotografie by VisualVibe");
  });

  it("links the bilingual custom-software knowledge category", async () => {
    const page = await import("./software-op-maat/page");
    const metadata = await page.generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });
    const html = renderToStaticMarkup(
      await page.default({ params: Promise.resolve({ locale: "en" }) }),
    );

    expect(metadata.alternates).toMatchObject({ languages: expectedLanguages });
    expect(metadata.title).toMatchObject({
      absolute: expect.stringContaining("Apps & software"),
    });
    expect(html).toContain("Building an AI application");
    expect(html).toContain('href="/diensten/custom-software/"');
  });

  it("uses the published language set and Dutch x-default on articles", async () => {
    const page = await import("./[category]/[slug]/page");
    const metadata = await page.generateMetadata({
      params: Promise.resolve({
        locale: "en",
        category: "software-op-maat",
        slug: "building-an-ai-application",
      }),
    });

    expect(metadata.alternates).toMatchObject({ languages: expectedLanguages });
    expect(metadata.alternates?.languages).not.toHaveProperty("fr-BE");
    expect(metadata.alternates?.languages).not.toHaveProperty("de-DE");
  });
});
