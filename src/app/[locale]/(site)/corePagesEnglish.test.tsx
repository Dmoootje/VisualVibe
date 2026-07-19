import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/reviews/google", () => ({
  getGoogleReviews: vi.fn(async () => [{ quote: "A genuine customer review.", author: "Alex", role: "Google review", avatar: "", rating: 5 }]),
  GOOGLE_MAPS_PROFILE_URL: "https://example.com/reviews",
}));
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a">) => (
    <a href={String(href)} {...props}>{children}</a>
  ),
}));
vi.mock("@/lib/firestore/applicationCases", () => ({ getApplicationCases: vi.fn(async () => []) }));
vi.mock("@/lib/seo/siteUrls", () => ({
  getSitemapEntries: vi.fn(async () => [
    { url: "https://visualvibe.media/en/" },
    { url: "https://visualvibe.media/en/about/" },
    { url: "https://visualvibe.media/en/kennisbank/" },
  ]),
}));
vi.mock("@/features/home", () => ({
  Hero: ({ locale }: { locale?: string }) => <div data-testid="hero" data-locale={locale} />,
  Features: ({ locale }: { locale?: string }) => <div data-testid="features" data-locale={locale} />,
  RegionIntro: ({ locale }: { locale?: string }) => <div data-testid="region-intro" data-locale={locale} />,
  SectorIntro: ({ locale }: { locale?: string }) => <div data-testid="sector-intro" data-locale={locale} />,
  HowItWorks: ({ locale }: { locale?: string }) => <div data-testid="how-it-works" data-locale={locale} />,
  Testimonials: ({ locale, testimonials }: { locale?: string; testimonials?: { author: string; quote: string }[] }) => (
    <div data-testid="testimonials" data-locale={locale}>
      {testimonials?.map((review) => <span key={review.author}>{review.quote} - {review.author}</span>)}
    </div>
  ),
  BlogPreview: () => <div>REAL_ENGLISH_BLOG_PREVIEW</div>,
  Cta: ({ locale }: { locale?: string }) => <div data-testid="cta" data-locale={locale} />,
}));

describe("English core commercial pages", () => {
  it("renders the English homepage and English SEO output", async () => {
    const page = await import("./page");
    const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ locale: "en" }) }));
    const metadata = await page.generateMetadata({ params: Promise.resolve({ locale: "en" }) });

    expect(html).toContain("Creative media agency in Limburg");
    expect(html).toContain("What does VisualVibe do?");
    // Every homepage section is a real, locale-aware component (not a
    // Dutch-only one masked by a duplicated English page body) - see
    // src/features/home/*/index.tsx for the "locale" prop each one accepts.
    for (const testId of ["hero", "features", "region-intro", "sector-intro", "how-it-works", "testimonials", "cta"]) {
      expect(html).toContain(`data-testid="${testId}" data-locale="en"`);
    }
    expect(html).toContain("A genuine customer review.");
    expect(html).toContain("Alex");
    expect(html).toContain("REAL_ENGLISH_BLOG_PREVIEW");
    // The hero's primary CTA opens the quote slide-up (QuoteButton), so the
    // config carries a label only - no quotation URL exists anymore.
    const { heroConfigEn } = await import("@/features/home/Hero/config/hero.config");
    expect(heroConfigEn.primaryCta).toEqual({ label: "Request a quotation" });
    expect(heroConfigEn.secondaryCta.href).toBe("/services");
    expect(html).not.toContain('href="/en/en/');
    expect(html).not.toContain('lang="nl"');
    const { getGoogleReviews } = await import("@/lib/reviews/google");
    expect(getGoogleReviews).toHaveBeenCalledWith("en");
    expect(html).not.toContain("Wat doet VisualVibe?");
    expect(html).toContain('"inLanguage":"en-BE"');
    expect(html).not.toContain('"inLanguage":"nl-BE"');
    expect(metadata.title).toMatchObject({ absolute: expect.stringContaining("Creative media agency") });
    expect(metadata.alternates?.canonical).toContain("/en/");
  });

  it("renders the complete about page in natural English", async () => {
    const page = await import("./over-ons/page");
    const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ locale: "en" }) }));
    const metadata = await page.generateMetadata({ params: Promise.resolve({ locale: "en" }) });

    expect(html).toContain("The person behind VisualVibe");
    expect(html).toContain("One partner for digital experiences and visual stories");
    expect(html).not.toContain('href="/en/trouwfotograaf-limburg/"');
    expect(html).not.toContain("Het gezicht achter VisualVibe");
    expect(metadata.title).toMatchObject({ absolute: expect.stringContaining("About VisualVibe") });
  });

  it("uses the canonical English quotation route on the services page", async () => {
    const page = await import("./diensten/page");
    const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ locale: "en" }) }));

    expect(html).toContain('href="/request-a-quotation"');
    expect(html).not.toContain('href="/offerte-aanvragen"');
  });

  it("renders an English sitemap without Dutch knowledge-base fallbacks", async () => {
    const page = await import("./sitemap/page");
    const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ locale: "en" }) }));
    const metadata = await page.generateMetadata({ params: Promise.resolve({ locale: "en" }) });

    expect(html).toContain("All pages at a glance");
    expect(html).toContain("General pages");
    expect(html).not.toContain("Algemene pagina&#x27;s");
    expect(html).not.toContain("Kennisbank");
    expect(metadata.description).toContain("services, case studies, sectors and regions");
  });
});
