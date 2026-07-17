import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  getAnalysisQuotaConfig: vi.fn(),
  normalizeAndValidateUrl: vi.fn(),
  checkEmailDomainMx: vi.fn(),
  normalizeAnalysisEmail: vi.fn(),
  checkAndRegisterIpAttempt: vi.fn(),
  checkAndReserveQuota: vi.fn(),
  finalizeAnalysisSuccess: vi.fn(),
  finalizeAnalysisFailure: vi.fn(),
  runWebsiteAnalysis: vi.fn(),
  issueVerificationCode: vi.fn(),
  verifyVerificationCode: vi.fn(),
  sendAnalysisVerificationMail: vi.fn(),
  sendAnalysisAdminNotification: vi.fn(),
  sendAnalysisReportMail: vi.fn(),
  createAnalysisLead: vi.fn(),
  getAnalysisLead: vi.fn(),
  listAnalysisLeadsByEmail: vi.fn(),
  listAnalysisLeadsByLeadId: vi.fn(),
  updateAnalysisLead: vi.fn(),
  createAnalysisReport: vi.fn(),
  createSubscriber: vi.fn(),
  createLead: vi.fn(),
  addLeadEvent: vi.fn(),
}));

vi.mock("@/lib/analyse/config", () => ({
  getAnalysisQuotaConfig: mocks.getAnalysisQuotaConfig,
}));
vi.mock("@/lib/analyse/domain", () => ({
  normalizeAndValidateUrl: mocks.normalizeAndValidateUrl,
}));
vi.mock("@/lib/analyse/email", () => ({
  checkEmailDomainMx: mocks.checkEmailDomainMx,
  normalizeAnalysisEmail: mocks.normalizeAnalysisEmail,
}));
vi.mock("@/lib/analyse/identity", () => ({
  DEVICE_COOKIE_MAX_AGE_SECONDS: 31_536_000,
  DEVICE_COOKIE_NAME: "analysis-device",
  deviceHash: () => "device-1",
  ipHashFromRequest: () => "ip-1",
  parseOrCreateDeviceId: () => ({ deviceId: "device-id" }),
}));
vi.mock("@/lib/analyse/limitResponse", () => ({
  toAnalysisLimitResponse: vi.fn((outcome) => outcome),
}));
vi.mock("@/lib/analyse/quota", () => ({
  AnalysisMaintenanceError: class AnalysisMaintenanceError extends Error {},
  checkAndRegisterIpAttempt: mocks.checkAndRegisterIpAttempt,
  checkAndReserveQuota: mocks.checkAndReserveQuota,
  finalizeAnalysisSuccess: mocks.finalizeAnalysisSuccess,
  finalizeAnalysisFailure: mocks.finalizeAnalysisFailure,
}));
vi.mock("@/lib/analyse/verification", () => ({
  issueVerificationCode: mocks.issueVerificationCode,
  verifyVerificationCode: mocks.verifyVerificationCode,
}));
vi.mock("@/lib/analyse/engine", () => ({ runWebsiteAnalysis: mocks.runWebsiteAnalysis }));
vi.mock("@/lib/email/analysisMails", () => ({
  sendAnalysisVerificationMail: mocks.sendAnalysisVerificationMail,
  sendAnalysisAdminNotification: mocks.sendAnalysisAdminNotification,
  sendAnalysisReportMail: mocks.sendAnalysisReportMail,
}));
vi.mock("@/lib/firestore/analysisLeads", () => ({
  createAnalysisLead: mocks.createAnalysisLead,
  getAnalysisLead: mocks.getAnalysisLead,
  listAnalysisLeadsByEmail: mocks.listAnalysisLeadsByEmail,
  listAnalysisLeadsByLeadId: mocks.listAnalysisLeadsByLeadId,
  newReportToken: () => "report-token",
  updateAnalysisLead: mocks.updateAnalysisLead,
}));
vi.mock("@/lib/firestore/leads", () => ({ createLead: mocks.createLead }));
vi.mock("@/lib/firestore/leadEvents", () => ({ addLeadEvent: mocks.addLeadEvent }));
vi.mock("@/lib/firestore/analysisReports", () => ({
  createAnalysisReport: mocks.createAnalysisReport,
}));
vi.mock("@/lib/firestore/newsletter", () => ({ createSubscriber: mocks.createSubscriber }));
vi.mock("@/lib/firebase/admin", () => ({ adminDb: { collection: vi.fn() } }));
vi.mock("@/lib/security/encryption", () => ({ hmacIdentifier: () => "lead-key" }));
vi.mock("@/config/business.config", () => ({
  businessConfig: { url: "https://visualvibe.be" },
}));

import { DEFAULT_ANALYSIS_QUOTA_CONFIG } from "@/types/analysis";
import { AnalysisMaintenanceError } from "@/lib/analyse/quota";
import { POST as startAnalysis } from "./start/route";
import { POST as verifyAnalysis } from "./verify/route";
import { POST as resendCode } from "./resend/route";

const pendingLead = {
  id: "analysis-lead-1",
  leadId: "lead-1",
  status: "pending_verification" as const,
  firstName: "Jan",
  email: "jan@example.com",
  emailNormalized: "jan@example.com",
  newsletterConsent: false,
  submittedUrl: "https://example.com",
  normalizedDomain: "example.com",
  createdAt: "2026-07-15T18:00:00.000Z",
  updatedAt: "2026-07-15T18:00:00.000Z",
};

function request(path: string, body: object): NextRequest {
  return new NextRequest(`http://localhost${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("analysis maintenance route gates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAnalysisQuotaConfig.mockResolvedValue({
      ...DEFAULT_ANALYSIS_QUOTA_CONFIG,
      maintenanceMode: true,
    });
    mocks.normalizeAnalysisEmail.mockReturnValue({
      ok: true,
      email: "jan@example.com",
      emailNormalized: "jan@example.com",
      domain: "example.com",
    });
    mocks.checkEmailDomainMx.mockResolvedValue("valid");
    mocks.normalizeAndValidateUrl.mockResolvedValue({
      ok: true,
      submittedUrl: "https://example.com",
      normalizedDomain: "example.com",
      safeUrl: "https://example.com/",
    });
    mocks.checkAndRegisterIpAttempt.mockResolvedValue({ decision: "allowed" });
    mocks.checkAndReserveQuota.mockResolvedValue({
      decision: "allowed",
      reservationId: "reservation-1",
    });
    mocks.createLead.mockResolvedValue({
      lead: { id: "lead-1", leadNumber: "L-1" },
      created: true,
    });
    mocks.createAnalysisLead.mockResolvedValue({ ...pendingLead });
    mocks.issueVerificationCode.mockResolvedValue({ ok: true, code: "123456" });
    mocks.getAnalysisLead.mockResolvedValue({
      ...pendingLead,
      status: "pending_verification",
    });
    mocks.verifyVerificationCode.mockResolvedValue("expired");
    mocks.listAnalysisLeadsByEmail.mockResolvedValue([]);
    mocks.updateAnalysisLead.mockResolvedValue(undefined);
    mocks.finalizeAnalysisSuccess.mockResolvedValue(undefined);
    mocks.finalizeAnalysisFailure.mockResolvedValue(undefined);
    mocks.createAnalysisReport.mockResolvedValue({ id: "report-id", schemaVersion: 1 });
    mocks.runWebsiteAnalysis.mockResolvedValue({
      status: "completed",
      score: 88,
      criticalIssues: [],
      partnerAnalysisId: "partner-id",
      report: {
        schemaVersion: 1,
        url: "https://example.com/",
        overallScore: 88,
        summary: "Sterk rapport",
        categories: [],
        page: {},
        topIssues: [],
        strengths: [],
        technical: {},
      },
    });
  });

  it("propagates the validated English visitor locale into both leads and the verification email", async () => {
    mocks.getAnalysisQuotaConfig.mockResolvedValue({ ...DEFAULT_ANALYSIS_QUOTA_CONFIG, maintenanceMode: false });
    mocks.createAnalysisLead.mockImplementation(async (input: typeof pendingLead & { locale?: "nl" | "en" | "fr" }) => ({ ...pendingLead, ...input }));
    const response = await startAnalysis(request("/api/analyse/start", { firstName: "Alex", email: "alex@example.com", url: "https://example.com", privacyAccepted: true, locale: "en" }));
    expect(response.status).toBe(200);
    expect(mocks.createLead).toHaveBeenCalledWith(expect.objectContaining({ locale: "en" }));
    expect(mocks.createAnalysisLead).toHaveBeenCalledWith(expect.objectContaining({ locale: "en" }));
    expect(mocks.sendAnalysisVerificationMail).toHaveBeenCalledWith(expect.objectContaining({ analysisLead: expect.objectContaining({ locale: "en" }) }));
  });

  it("refuses start before registering an attempt or creating a lead", async () => {
    const response = await startAnalysis(request("/api/analyse/start", {
      firstName: "Jan",
      email: "jan@example.com",
      url: "https://example.com",
      privacyAccepted: true,
    }));

    expect(response.status).toBe(503);
    expect(mocks.checkAndRegisterIpAttempt).not.toHaveBeenCalled();
    expect(mocks.createLead).not.toHaveBeenCalled();
    expect(mocks.issueVerificationCode).not.toHaveBeenCalled();
  });

  it("refuses verify before consuming a code or creating a reservation", async () => {
    const response = await verifyAnalysis(request("/api/analyse/verify", {
      analysisLeadId: pendingLead.id,
      code: "123456",
    }));

    expect(response.status).toBe(503);
    expect(mocks.verifyVerificationCode).not.toHaveBeenCalled();
    expect(mocks.checkAndReserveQuota).not.toHaveBeenCalled();
    expect(mocks.updateAnalysisLead).not.toHaveBeenCalled();
  });

  it("refuses resend before issuing a verification code", async () => {
    const response = await resendCode(request("/api/analyse/resend", {
      analysisLeadId: pendingLead.id,
    }));

    expect(response.status).toBe(503);
    expect(mocks.issueVerificationCode).not.toHaveBeenCalled();
    expect(mocks.sendAnalysisVerificationMail).not.toHaveBeenCalled();
  });

  it("keeps completed reports available during maintenance", async () => {
    mocks.getAnalysisLead.mockResolvedValue({
      ...pendingLead,
      status: "completed",
      analysisStatus: "completed",
      reportToken: "existing-report",
      analysisScore: 88,
      criticalIssues: [],
    });

    const response = await verifyAnalysis(request("/api/analyse/verify", {
      analysisLeadId: pendingLead.id,
      code: "123456",
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      status: "completed",
      reportUrl: "/website-analyse/rapport/existing-report",
    });
    expect(mocks.getAnalysisQuotaConfig).not.toHaveBeenCalled();
  });

  it("maps a live start-transaction maintenance race to the maintenance 503", async () => {
    mocks.getAnalysisQuotaConfig.mockResolvedValue({
      ...DEFAULT_ANALYSIS_QUOTA_CONFIG,
      maintenanceMode: false,
    });
    mocks.checkAndRegisterIpAttempt.mockRejectedValue(new AnalysisMaintenanceError());

    const response = await startAnalysis(request("/api/analyse/start", {
      firstName: "Jan",
      email: "jan@example.com",
      url: "https://example.com",
      privacyAccepted: true,
    }));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      status: "error",
      error: expect.stringContaining("onderhoud"),
    });
    expect(mocks.createLead).not.toHaveBeenCalled();
  });

  it("maps a live reservation maintenance race to the maintenance 503", async () => {
    mocks.getAnalysisQuotaConfig.mockResolvedValue({
      ...DEFAULT_ANALYSIS_QUOTA_CONFIG,
      maintenanceMode: false,
    });
    mocks.verifyVerificationCode.mockResolvedValue("valid");
    mocks.checkAndReserveQuota.mockRejectedValue(new AnalysisMaintenanceError());

    const response = await verifyAnalysis(request("/api/analyse/verify", {
      analysisLeadId: pendingLead.id,
      code: "123456",
    }));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      status: "error",
      error: expect.stringContaining("onderhoud"),
    });
  });

  it("surfaces a retryable error without reporting success when completion finalization fails", async () => {
    mocks.getAnalysisQuotaConfig.mockResolvedValue({
      ...DEFAULT_ANALYSIS_QUOTA_CONFIG,
      maintenanceMode: false,
    });
    mocks.verifyVerificationCode.mockResolvedValue("valid");
    mocks.finalizeAnalysisSuccess.mockRejectedValue(new Error("transaction unavailable"));

    const response = await verifyAnalysis(request("/api/analyse/verify", {
      analysisLeadId: pendingLead.id,
      code: "123456",
    }));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      status: "error",
      error: expect.stringContaining("opnieuw"),
    });
    expect(mocks.updateAnalysisLead).toHaveBeenCalledWith(
      pendingLead.id,
      expect.objectContaining({
        status: "analysing",
        completionPending: expect.objectContaining({
          reportId: "report-id",
          reportToken: "report-token",
        }),
      }),
    );
    expect(mocks.finalizeAnalysisSuccess).toHaveBeenCalledWith(pendingLead.id);
    expect(mocks.sendAnalysisReportMail).not.toHaveBeenCalled();
  });

  it("retries a staged completion instead of starting or reclaiming the analysis", async () => {
    const completionPending = {
      analysisScore: 88,
      criticalIssues: [],
      reportToken: "report-token",
      reportId: "report-id",
      reportSchemaVersion: 1,
      completedAt: "2026-07-15T18:10:00.000Z",
    };
    mocks.getAnalysisLead.mockResolvedValue({
      ...pendingLead,
      status: "analysing",
      analysisStatus: "running",
      analysisId: "reservation-1",
      startedAt: new Date().toISOString(),
      completionPending,
    });
    mocks.finalizeAnalysisSuccess.mockResolvedValue(completionPending);

    const response = await verifyAnalysis(request("/api/analyse/verify", {
      analysisLeadId: pendingLead.id,
      code: "123456",
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      status: "completed",
      reportUrl: "/website-analyse/rapport/report-token",
      score: 88,
    });
    expect(mocks.finalizeAnalysisSuccess).toHaveBeenCalledWith(pendingLead.id);
    expect(mocks.verifyVerificationCode).not.toHaveBeenCalled();
    expect(mocks.runWebsiteAnalysis).not.toHaveBeenCalled();
  });

  it("leaves a failed analysis retryable when atomic failure finalization fails", async () => {
    mocks.getAnalysisQuotaConfig.mockResolvedValue({
      ...DEFAULT_ANALYSIS_QUOTA_CONFIG,
      maintenanceMode: false,
    });
    mocks.verifyVerificationCode.mockResolvedValue("valid");
    mocks.runWebsiteAnalysis.mockResolvedValue({
      status: "failed",
      errorCode: "partner_failed",
    });
    mocks.finalizeAnalysisFailure.mockRejectedValue(new Error("transaction unavailable"));

    const response = await verifyAnalysis(request("/api/analyse/verify", {
      analysisLeadId: pendingLead.id,
      code: "123456",
    }));

    expect(response.status).toBe(503);
    expect(mocks.updateAnalysisLead).toHaveBeenCalledWith(
      pendingLead.id,
      expect.objectContaining({
        status: "analysing",
        failurePending: expect.objectContaining({ reason: "partner_failed" }),
      }),
    );
    expect(mocks.finalizeAnalysisFailure).toHaveBeenCalledWith(
      pendingLead.id,
      expect.objectContaining({ reason: "partner_failed" }),
    );
    expect(mocks.sendAnalysisAdminNotification).not.toHaveBeenCalledWith(
      expect.objectContaining({ kind: "failed" }),
    );
  });

  it("uses atomic failure finalization when reclaiming a stale analysing lead", async () => {
    mocks.getAnalysisLead.mockResolvedValue({
      ...pendingLead,
      status: "analysing",
      analysisId: "reservation-1",
      startedAt: "2026-07-15T17:00:00.000Z",
    });
    mocks.finalizeAnalysisFailure.mockRejectedValue(new Error("transaction unavailable"));

    const response = await verifyAnalysis(request("/api/analyse/verify", {
      analysisLeadId: pendingLead.id,
      code: "123456",
    }));

    expect(response.status).toBe(503);
    expect(mocks.finalizeAnalysisFailure).toHaveBeenCalledWith(
      pendingLead.id,
      expect.objectContaining({ reason: "stale_analysing_reclaimed" }),
    );
    expect(mocks.updateAnalysisLead).not.toHaveBeenCalledWith(
      pendingLead.id,
      expect.objectContaining({ status: "failed" }),
    );
  });
});
