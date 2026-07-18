import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "inter" }),
  Sora: () => ({ variable: "sora" }),
  Manrope: () => ({ variable: "manrope" }),
  JetBrains_Mono: () => ({ variable: "mono" }),
  Cormorant_Garamond: () => ({ variable: "cormorant" }),
}));
vi.mock("next-intl", () => ({
  hasLocale: () => true,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("next-intl/server", () => ({
  getMessages: vi.fn(async () => ({})),
  setRequestLocale: vi.fn(),
}));
vi.mock("@/components/consent", () => ({ ConsentAnalytics: () => null, CookieConsent: () => null }));
vi.mock("@/components/ui", () => ({ SiteBackground: () => null }));
vi.mock("@/lib/firestore/siteSettings", () => ({
  getSiteSettings: vi.fn(async () => ({
    companyName: "VisualVibe", mainEmail: "info@visualvibe.media", phone: "+32472964599",
    openingHours: [], country: "Belgium", fullAddress: "Ziegelsmeer 14",
  })),
}));

describe("locale layout SEO", () => {
  it("composes English default metadata and site-wide JSON-LD", async () => {
    const layout = await import("./layout");
    expect(typeof layout.generateMetadata).toBe("function");
    const metadata = await layout.generateMetadata!({ params: Promise.resolve({ locale: "en" }) });
    const { OrganizationJsonLd, WebSiteJsonLd, LocalBusinessJsonLd } = await import("@/components/seo");
    const html = renderToStaticMarkup(<>
      <OrganizationJsonLd locale="en" />
      <WebSiteJsonLd locale="en" />
      {await LocalBusinessJsonLd({ locale: "en" })}
    </>);

    expect(metadata.title).toMatchObject({ default: expect.stringContaining("Creative media agency") });
    expect(metadata.description).toContain("Creative media agency in Limburg");
    expect(metadata.openGraph).toMatchObject({ locale: "en_BE", url: "https://visualvibe.media/en/" });
    expect(html).toContain('"inLanguage":"en-BE"');
    expect(html).toContain('"jobTitle":"Managing director"');
    expect(html).toContain('"availableLanguage":["English"]');
    expect(html).toContain('"name":"Creative and digital services"');
    expect(html).not.toMatch(/Zaakvoerder|Creatieve en digitale diensten|Webdesign|Nederlands-Limburg/);

    const { getSiteSettings } = await import("@/lib/firestore/siteSettings");
    expect(getSiteSettings).toHaveBeenCalledWith("en");
  });
});
