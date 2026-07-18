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
      "From our knowledge base",
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
});
