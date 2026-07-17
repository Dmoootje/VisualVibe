import { describe, expect, it, vi } from "vitest";
import { renderAnalysisReportEmail, renderAnalysisVerificationEmail, renderCustomerConfirmation } from "@/lib/email/templates";
import type { NormalizedPartnerAuditReport } from "@/types/analysis";
import type { EmailSettings } from "@/types/email";

vi.mock("server-only", () => ({}));

function emailSettings(): EmailSettings {
  return {
    id: "default",
    smtp: {
      enabled: true,
      host: "smtp.example.com",
      port: 587,
      security: "starttls",
      username: "info@example.com",
      fromName: "VisualVibe",
      fromEmail: "info@visualvibe.media",
      replyTo: "info@visualvibe.media",
      adminRecipients: [],
      testRecipient: "test@example.com",
    },
    imap: {
      enabled: false,
      host: "",
      port: 993,
      security: "ssl",
      username: "",
      mailbox: "INBOX",
      syncWindowDays: 14,
    },
    automation: {
      sendCustomerConfirmation: true,
      sendAdminNotification: true,
      createAiReplyDraft: false,
      allowAiAutoSend: false,
      defaultLocale: "nl",
      responseExpectationText: "",
      signatureName: "VisualVibe",
      signatureRole: "Creatief mediabureau",
      signaturePhone: "+32 472 96 45 99",
      signatureEmail: "info@visualvibe.media",
      signatureWebsite: "https://visualvibe.media",
      appointmentUrl: "",
      enabledFormTypes: ["website_analysis"],
    },
    branding: {
      headerHtml: "",
      footerHtml: "",
    },
    createdAt: "2026-07-17T00:00:00.000Z",
    updatedAt: "2026-07-17T00:00:00.000Z",
  };
}

function reportFixture(): NormalizedPartnerAuditReport {
  return {
    schemaVersion: 1,
    url: "https://example.be/",
    overallScore: 91,
    summary: "De pagina is technisch gezond, maar kan sterker scoren op content en AIO-signalen.",
    categories: [
      {
        id: "content",
        title: "Content",
        score: 86,
        checks: [
          {
            id: "content-depth",
            title: "Contentdiepte",
            status: "warning",
            description: "De pagina bevat basisinformatie.",
            advice: "Voeg praktische voorbeelden en veelgestelde vragen toe.",
          },
        ],
      },
    ],
    page: {
      metaTitle: "Webdesign Limburg",
      metaDescription: "Professioneel webdesign voor bedrijven in Limburg.",
      h1: "Webdesign Limburg",
      canonical: "https://example.be/",
      wordCount: 892,
      language: "nl-BE",
      indexable: true,
    },
    topIssues: [
      {
        id: "aio-context",
        severity: "medium",
        title: "AIO-context kan sterker",
        explanation: "De pagina mist nog enkele duidelijke entiteiten en contextsignalen.",
        recommendation: "Voeg een compacte sectie toe met doelgroep, regio en concrete resultaten.",
      },
    ],
    strengths: [
      {
        id: "indexable",
        title: "Pagina is indexeerbaar",
        explanation: "Zoekmachines kunnen de pagina opnemen in de index.",
      },
    ],
    technical: {
      csrDetected: false,
      renderedAvailable: true,
    },
    keywordDensity: {
      totalWords: 892,
      stopWordCount: 298,
      single: [{ phrase: "webdesign", count: 12, density: 1.35, locations: ["title", "h1"] }],
      double: [],
      triple: [],
    },
    stats: {
      totalChecks: 29,
      passed: 27,
      warnings: 2,
      errors: 0,
    },
  };
}

describe("renderAnalysisReportEmail", () => {
  it("renders a natural English website analysis report when requested", () => {
    const email = renderAnalysisReportEmail({
      firstName: "Alex",
      domain: "example.be",
      score: 91,
      criticalIssues: ["Clarify the page's regional focus"],
      analysisSummary: "The site has a sound technical foundation and clear opportunities for stronger content.",
      reportUrl: "https://visualvibe.media/en/website-analysis/report/demo-token",
      locale: "en",
      settings: emailSettings(),
    });

    expect(email.subject).toBe("Alex, your website analysis is ready");
    expect(email.html).toContain('<html lang="en">');
    expect(email.html).toContain("Overall score");
    expect(email.html).toContain("View your full report");
    expect(email.text).toContain("Would you like to know how best to address these points?");
    expect(email.text).not.toContain("Je websiteanalyse");
  });

  it("includes detailed findings only when report metadata identifies English", () => {
    const fixture = reportFixture();
    const report: NormalizedPartnerAuditReport = { ...fixture, summary: "The technical foundation is sound.", page: { ...fixture.page, language: "en-GB" }, topIssues: [{ id: "context", severity: "medium", title: "Clarify regional context", explanation: "The region is not explicit.", recommendation: "Name the service area." }] };
    const email = renderAnalysisReportEmail({ firstName: "Alex", domain: "example.be", criticalIssues: [], report, reportUrl: "https://visualvibe.media/en/report/demo", locale: "en", settings: emailSettings() });
    expect(email.text).toContain("The technical foundation is sound.");
    expect(email.text).toContain("Clarify regional context");
    expect(email.html).toContain("Key findings");
  });

  it("uses safe English fallback copy when stored report findings are not known to be English", () => {
    const report = reportFixture();
    const email = renderAnalysisReportEmail({ firstName: "Alex", domain: "example.be", score: 91, criticalIssues: ["Nederlandse bevinding"], analysisSummary: "Nederlandse samenvatting", report, reportUrl: "https://visualvibe.media/en/report/demo", locale: "en", settings: emailSettings() });
    expect(email.text).toContain("We have analysed example.be. Your score is shown below, and your full report is available online.");
    expect(email.text).not.toContain("Nederlandse bevinding");
    expect(email.text).not.toContain("Nederlandse samenvatting");
    expect(email.text).not.toContain(report.summary);
  });

  it("uses editorially approved English wording in analysis emails", () => {
    const verification = renderAnalysisVerificationEmail({ firstName: "Alex", code: "123456", ttlMinutes: 15, locale: "en", settings: emailSettings() });
    expect(verification.text).toContain("If you did not request a website analysis, you can safely ignore this email.");
    const report = renderAnalysisReportEmail({ firstName: "Alex", domain: "example.be", score: 91, criticalIssues: [], reportUrl: "https://visualvibe.media/en/report/demo", locale: "en", settings: emailSettings() });
    expect(report.text).toContain("Would you like to know how best to address these points? We would be happy to talk you through the report and provide a no-obligation quotation tailored to your needs.");
  });

  it("renders the richer analyzer summary and follow-up CTAs", () => {
    const email = renderAnalysisReportEmail({
      firstName: "Sofie",
      domain: "example.be",
      score: 91,
      criticalIssues: ["Meta description is te kort"],
      reportUrl: "https://visualvibe.media/be/website-analyse/rapport/demo-token",
      report: reportFixture(),
      settings: emailSettings(),
    });

    expect(email.subject).toContain("Sofie");
    expect(email.html).toContain("Quick Wins");
    expect(email.html).toContain("Geslaagd");
    expect(email.html).toContain("27");
    expect(email.html).toContain("Aandacht");
    expect(email.html).toContain("2");
    expect(email.html).toContain("Topkeyword");
    expect(email.html).toContain("webdesign");
    expect(email.html).toContain("1.35%");
    expect(email.html).toContain("AIO-context kan sterker");
    expect(email.html).toContain("Pagina is indexeerbaar");
    expect(email.html).toContain("Nieuwe gratis analyse starten");
    expect(email.html).toContain("https://visualvibe.media/be/website-analyse/");
    expect(email.html).toContain("Geavanceerde analyse via SEO Websites");
    expect(email.html).toContain("https://seowebsites.be/nl/seo-website-analyse");
    expect(email.text).toContain("Nieuwe gratis analyse starten");
    expect(email.text).toContain("Geavanceerde analyse via SEO Websites");
  });
});

describe("renderCustomerConfirmation", () => {
  it("acknowledges an English quotation request in natural business English", () => {
    const email = renderCustomerConfirmation({
      lead: { id: "lead-1", leadNumber: "VV-100", formType: "offerte", locale: "en", name: "Alex Morgan", email: "alex@example.com", selectedServices: ["webdesign", "seo"], message: "We need a new site for Belgium.", createdAt: "2026-07-18T00:00:00.000Z" },
      settings: emailSettings(),
    });
    expect(email.subject).toBe("[VV-100] We have received your request, Alex");
    expect(email.html).toContain('<html lang="en">');
    expect(email.text).toContain("Jens will review your request and contact you personally");
    expect(email.text).toContain("Web design, SEO");
    expect(email.text).not.toContain("Gekozen diensten");
  });
});
