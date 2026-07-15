import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  getAnalysisQuotaConfig: vi.fn(),
  normalizeAndValidateUrl: vi.fn(),
  checkEmailDomainMx: vi.fn(),
  normalizeAnalysisEmail: vi.fn(),
  checkAndRegisterIpAttempt: vi.fn(),
  checkAndReserveQuota: vi.fn(),
  consumeReservation: vi.fn(),
  releaseReservation: vi.fn(),
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
  consumeReservation: mocks.consumeReservation,
  releaseReservation: mocks.releaseReservation,
}));
vi.mock("@/lib/analyse/verification", () => ({
  issueVerificationCode: mocks.issueVerificationCode,
  verifyVerificationCode: mocks.verifyVerificationCode,
}));
vi.mock("@/lib/analyse/engine", () => ({ runWebsiteAnalysis: vi.fn() }));
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
vi.mock("@/lib/firestore/analysisReports", () => ({ createAnalysisReport: vi.fn() }));
vi.mock("@/lib/firestore/newsletter", () => ({ createSubscriber: vi.fn() }));
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
    mocks.createAnalysisLead.mockResolvedValue(pendingLead);
    mocks.issueVerificationCode.mockResolvedValue({ ok: true, code: "123456" });
    mocks.getAnalysisLead.mockResolvedValue(pendingLead);
    mocks.verifyVerificationCode.mockResolvedValue("expired");
    mocks.listAnalysisLeadsByEmail.mockResolvedValue([]);
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
});
