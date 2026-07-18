import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("Task 7 editorial corrections", () => {
  it("keeps the English homepage at full source parity without Dutch review leakage", () => {
    const source = read("src/app/[locale]/(site)/page.tsx");
    for (const copy of [
      "Personal guidance, clear communication and one point of contact from briefing to delivery.",
      "Summary of our customer reviews",
      "Who we work with",
      "What our customers say",
      "<BlogPreview />",
      "Creative media agency in Limburg | VisualVibe",
      "VisualVibe, a creative media agency in Limburg for web design, SEO, photography and video production",
    ]) expect(source).toContain(copy);
  });

  it("passes locale into both lead forms and hides Dutch settings prose on English contact", () => {
    const contact = read("src/app/[locale]/(site)/contact/page.tsx");
    const quotation = read("src/app/[locale]/(site)/offerte-aanvragen/page.tsx");
    const form = read("src/components/forms/LeadForm.tsx");
    expect(contact).toContain('<LeadForm variant="contact" locale={locale}');
    expect(quotation).toContain('<LeadForm variant="offerte" locale={locale}');
    expect(form).toContain('locale: SupportedLocale');
    expect(contact).toContain('locale !== "en" && settings.responseTimeText');
    expect(contact).toContain('locale !== "en" && (');
  });

  it("uses approved English paths and structured-data URLs", () => {
    const files = [
      read("src/app/[locale]/(site)/tools/page.tsx"),
      read("src/app/[locale]/(site)/tools/seo-geo-checklist/page.tsx"),
      read("src/app/[locale]/(site)/website-analyse/page.tsx"),
      read("src/app/[locale]/(site)/website-analyse/rapport/[token]/page.tsx"),
      read("src/app/[locale]/(site)/over-ons/page.tsx"),
      read("src/app/[locale]/(site)/sitemap/page.tsx"),
    ].join("\n");
    for (const route of ["/en/about/", "/en/request-a-quotation/", "/en/website-analysis/"]) expect(files).toContain(route);
    expect(files).toContain('${businessConfig.url}/en/tools/seo-geo-checklist/');
    expect(files).toContain('`/website-analysis/report/${token}/`');
    expect(files).toContain('locale: en ? "en" : "nl"');
  });

  it("contains every exact reviewed wording replacement", () => {
    const files = [
      read("src/app/[locale]/(site)/commercialCopy.ts"),
      read("src/data/toolsEnglish.ts"),
      read("src/app/[locale]/(site)/website-analyse/page.tsx"),
      read("src/app/[locale]/(site)/over-ons/page.tsx"),
    ].join("\n");
    for (const copy of [
      "Have a question or an idea for a project? Tell us what you want to achieve and we will help you shape it.",
      "Tell us briefly about your project. We will send you a tailored, no-obligation quotation within two working days.",
      "Email verification helps prevent abuse and automated spam requests, keeping free analyses available to genuine businesses and website owners.",
      "See a clear score, findings by category and practical recommendations you can review immediately.",
      "Tick off completed work, track your progress and share a branded PDF with your team.",
      "Wedding photography has its own dedicated label: WeddingVibe.",
      "About VisualVibe and Jens Hardy | Media agency in Limburg",
    ]) expect(files).toContain(copy);
  });

  it("uses English breadcrumb locales, final sitemap paths and report restart route", () => {
    const sitemap = read("src/app/[locale]/(site)/sitemap/page.tsx");
    const tools = read("src/app/[locale]/(site)/tools/page.tsx");
    const checklist = read("src/app/[locale]/(site)/tools/seo-geo-checklist/page.tsx");
    const restart = read("src/components/analyse/RequestNewAnalysisButton.tsx");
    expect(sitemap).toContain('<BreadcrumbJsonLd locale="en"');
    expect(tools).toContain('locale={en ? "en" : "nl"}');
    expect(checklist).toContain('locale={en ? "en" : "nl"}');
    expect(sitemap).toContain('<NextLink href="/en/"');
    expect(sitemap).toContain('href: "/en/tools/"');
    expect(restart).toContain('locale === "en" ? "/en/website-analysis/"');
  });

  it("prevents Dutch address settings leakage and keeps exact About wording", () => {
    const contact = read("src/app/[locale]/(site)/contact/page.tsx");
    const about = read("src/app/[locale]/(site)/over-ons/page.tsx");
    expect(contact).toContain('locale === "en" ? "Belgium"');
    expect(contact).toContain('locale === "en" ? `${settings.companyName}, Tongeren-Borgloon, Belgium`');
    expect(contact).not.toContain('locale === "en" ? settings.fullAddress');
    expect(about).toContain("Online visibility in Google Search and AI-generated answers.");
  });

  it("localizes the real knowledge preview chrome and final article destinations", () => {
    const preview = read("src/features/home/BlogPreview/index.tsx");
    const header = read("src/features/home/BlogPreview/components/BlogHeader.tsx");
    const card = read("src/features/home/BlogPreview/components/BlogCard.tsx");
    expect(preview).toContain('<BlogHeader locale={copyLocale} />');
    expect(preview).toContain('<BlogGrid posts={blogPosts} locale={copyLocale} />');
    expect(header).toContain("From our knowledge base");
    expect(card).toContain('`/en/kennisbank/${post.categorySlug}/${post.slug}/`');
    expect(card).toContain('en ? "Read the full article"');
  });

  it("keeps Task 7 links on current route-tree destinations or owned aliases", () => {
    const files = [
      read("src/app/[locale]/(site)/page.tsx"),
      read("src/app/[locale]/(site)/over-ons/page.tsx"),
      read("src/app/[locale]/(site)/website-analyse/page.tsx"),
      read("src/app/[locale]/(site)/sitemap/page.tsx"),
    ].join("\n");
    for (const href of [
      "/en/diensten/", "/en/regio/", "/en/sectoren/", "/en/realisaties/",
      "/en/diensten/seo/", "/en/diensten/webdesign/", "/en/trouwfotograaf-limburg/",
    ]) expect(files).toContain(href);
    for (const invented of ["/en/services/", "/en/regions/", "/en/sectors/", "/en/case-studies/", "/en/wedding-photographer-limburg/"]) {
      expect(files).not.toContain(invented);
    }
  });
});
