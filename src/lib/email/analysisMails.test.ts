import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendAnalysisReportMail } from "@/lib/email/analysisMails";
import type { NormalizedPartnerAuditReport, AnalysisLead } from "@/types/analysis";
import type { EmailSettings } from "@/types/email";

vi.mock("server-only", () => ({}));

const mocks = vi.hoisted(() => ({
  getEmailSettings: vi.fn(),
  getAnalysisReport: vi.fn(),
  sendSmtpMail: vi.fn(),
  claimAutomaticMailDispatch: vi.fn(),
  markMailHistoryFailed: vi.fn(),
  markMailHistorySent: vi.fn(),
  sanitizeMailError: vi.fn((error: unknown) => (error instanceof Error ? error.message : "Mail error")),
}));

vi.mock("@/lib/firestore/emailSettings", () => ({
  getEmailSettings: mocks.getEmailSettings,
}));

vi.mock("@/lib/firestore/analysisReports", () => ({
  getAnalysisReport: mocks.getAnalysisReport,
}));

vi.mock("@/lib/email/smtp", () => ({
  sendSmtpMail: mocks.sendSmtpMail,
}));

vi.mock("@/lib/firestore/mailHistory", () => ({
  claimAutomaticMailDispatch: mocks.claimAutomaticMailDispatch,
  markMailHistoryFailed: mocks.markMailHistoryFailed,
  markMailHistorySent: mocks.markMailHistorySent,
  sanitizeMailError: mocks.sanitizeMailError,
}));

vi.mock("@/lib/firebase/admin", () => ({
  adminDb: { collection: vi.fn() },
}));

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
      signaturePhone: "",
      signatureEmail: "info@visualvibe.media",
      signatureWebsite: "https://visualvibe.media",
      appointmentUrl: "",
      enabledFormTypes: ["website_analysis"],
    },
    branding: { headerHtml: "", footerHtml: "" },
    createdAt: "2026-07-17T00:00:00.000Z",
    updatedAt: "2026-07-17T00:00:00.000Z",
  };
}

function reportFixture(): NormalizedPartnerAuditReport {
  return {
    schemaVersion: 1,
    url: "https://example.be/",
    overallScore: 94,
    summary: "De analyse toont een sterke technische basis met enkele contentkansen.",
    categories: [],
    page: {
      metaTitle: "SEO website analyse",
      h1: "SEO website analyse",
      wordCount: 640,
      indexable: true,
    },
    topIssues: [
      {
        id: "entity-context",
        severity: "medium",
        title: "Entiteiten mogen duidelijker",
        explanation: "De pagina mist nog context voor AI-antwoorden.",
        recommendation: "Voeg doelgroep, regio en diensten expliciet toe.",
      },
    ],
    strengths: [
      {
        id: "rendered",
        title: "Gerenderde inhoud beschikbaar",
        explanation: "De belangrijkste content is zichtbaar voor crawlers.",
      },
    ],
    technical: { renderedAvailable: true },
    keywordDensity: {
      totalWords: 640,
      stopWordCount: 210,
      single: [{ phrase: "seo", count: 11, density: 1.72, locations: ["title", "h1"] }],
      double: [],
      triple: [],
    },
    stats: {
      totalChecks: 28,
      passed: 26,
      warnings: 2,
      errors: 0,
    },
  };
}

function analysisLead(): AnalysisLead {
  return {
    id: "analysis-lead-1",
    leadId: "lead-1",
    status: "completed",
    firstName: "Sofie",
    email: "sofie@example.be",
    emailNormalized: "sofie@example.be",
    newsletterConsent: false,
    submittedUrl: "https://example.be/",
    normalizedDomain: "example.be",
    analysisId: "reservation-1",
    analysisScore: 94,
    criticalIssues: ["Fallback issue"],
    analysisSummary: "Fallback summary",
    reportToken: "report-token",
    reportId: "report-id",
    reportSchemaVersion: 1,
    createdAt: "2026-07-17T00:00:00.000Z",
    updatedAt: "2026-07-17T00:00:00.000Z",
  };
}

describe("sendAnalysisReportMail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getEmailSettings.mockResolvedValue(emailSettings());
    mocks.getAnalysisReport.mockResolvedValue({
      id: "report-id",
      partnerAnalysisId: "partner-1",
      schemaVersion: 1,
      normalizedDomain: "example.be",
      sourceUrl: "https://example.be/",
      report: reportFixture(),
      createdAt: "2026-07-17T00:00:00.000Z",
      updatedAt: "2026-07-17T00:00:00.000Z",
    });
    mocks.claimAutomaticMailDispatch.mockResolvedValue({ claimed: true, mailHistoryId: "mail-1" });
    mocks.sendSmtpMail.mockResolvedValue({
      messageId: "provider-message",
      accepted: ["sofie@example.be"],
      rejected: [],
    });
  });

  it("uses the stored full report when composing the customer report mail", async () => {
    const result = await sendAnalysisReportMail({
      analysisLead: analysisLead(),
      reportUrl: "https://visualvibe.media/be/website-analyse/rapport/report-token",
    });

    expect(result).toEqual({ status: "sent" });
    expect(mocks.getAnalysisReport).toHaveBeenCalledWith("report-id");
    const sentMail = mocks.sendSmtpMail.mock.calls[0]?.[1];
    expect(sentMail.html).toContain("Quick Wins");
    expect(sentMail.html).toContain("Entiteiten mogen duidelijker");
    expect(sentMail.html).toContain("Gerenderde inhoud beschikbaar");
    expect(sentMail.html).toContain("seo");
    expect(sentMail.html).toContain("1.72%");
  });

  it("uses the validated English analysis lead locale for the visitor email and history", async () => {
    const lead = { ...analysisLead(), locale: "en" as const, analysisSummary: "English summary", reportId: undefined };
    await sendAnalysisReportMail({ analysisLead: lead, reportUrl: "https://visualvibe.media/en/report/token" });
    const sentMail = mocks.sendSmtpMail.mock.calls[0]?.[1];
    expect(sentMail.subject).toBe("Sofie, your website analysis is ready");
    expect(sentMail.html).toContain('<html lang="en">');
    expect(mocks.claimAutomaticMailDispatch).toHaveBeenCalledWith(expect.objectContaining({ locale: "en" }));
  });
});
