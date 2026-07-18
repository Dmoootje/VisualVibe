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
vi.mock("@/features/home", () => ({
  Hero: () => null, Features: () => null, RegionIntro: () => null, SectorIntro: () => null,
  HowItWorks: () => null, Testimonials: () => null, BlogPreview: () => <div>REAL_ENGLISH_BLOG_PREVIEW</div>, Cta: () => null,
}));

describe("English core commercial pages", () => {
  it("renders the English homepage and English SEO output", async () => {
    const page = await import("./page");
    const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ locale: "en" }) }));
    const metadata = await page.generateMetadata({ params: Promise.resolve({ locale: "en" }) });

    expect(html).toContain("Creative media agency in Limburg");
    expect(html).toContain("What does VisualVibe do?");
    expect(html).toContain("A genuine customer review.");
    expect(html).toContain("Alex");
    expect(html).toContain("REAL_ENGLISH_BLOG_PREVIEW");
    expect(html).toContain('href="/en/request-a-quotation"');
    expect(html).not.toContain('href="/en/en/');
    expect(html).not.toContain('lang="nl"');
    const { getGoogleReviews } = await import("@/lib/reviews/google");
    expect(getGoogleReviews).toHaveBeenCalledWith("en");
    expect(html).not.toContain("Wat doet VisualVibe?");
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
