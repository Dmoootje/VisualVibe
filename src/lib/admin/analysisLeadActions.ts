"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { businessConfig } from "@/config/business.config";
import { getCurrentAdmin } from "@/lib/auth/session";
import { normalizeAndValidateUrl } from "@/lib/analyse/domain";
import { runWebsiteAnalysis } from "@/lib/analyse/engine";
import { grantExtraCredits, resetQuotaForEmail } from "@/lib/analyse/quota";
import { sendAnalysisAdminNotification, sendAnalysisReportMail } from "@/lib/email/analysisMails";
import {
  getAnalysisLead,
  newReportToken,
  updateAnalysisLead,
} from "@/lib/firestore/analysisLeads";
import { createAnalysisReport } from "@/lib/firestore/analysisReports";
import { addLeadEvent } from "@/lib/firestore/leadEvents";
import { changeLeadStatus, createLeadNote } from "@/lib/admin/leadActions";
import type { AnalysisLead, AnalysisRunResult } from "@/types/analysis";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}

function reportUrlFor(reportToken: string): string {
  return `${businessConfig.url}/website-analyse/rapport/${encodeURIComponent(reportToken)}`;
}

function revalidateLeadDetail(leadId?: string): void {
  if (leadId) {
    revalidatePath(`/admin/leads/${leadId}`);
  }
}

/**
 * Admin override: start een volledig nieuwe analyse ZONDER quotacheck en
 * zonder reservering. De afhandeling spiegelt de verify-flow: bij succes een
 * rapporttoken, score en mails; bij mislukking status "failed". Alle events
 * komen op de gekoppelde lead met het admin-e-mailadres als createdBy.
 */
export async function rerunAnalysisAction(analysisLeadId: string): Promise<void> {
  const admin = await requireAdmin();
  const analysisLead = await getAnalysisLead(analysisLeadId);
  if (!analysisLead) {
    throw new Error("Analyse-aanvraag niet gevonden");
  }

  const leadId = analysisLead.leadId;
  // Nieuw run-id: geen reservering (admin override), maar wel nodig zodat de
  // rapportmail-dedupe deze run niet als duplicaat van een vorige run ziet.
  const runId = `admin-rerun-${randomUUID()}`;

  await updateAnalysisLead(analysisLeadId, {
    status: "analysing",
    analysisStatus: "running",
    analysisId: runId,
    startedAt: new Date().toISOString(),
  });
  if (leadId) {
    await addLeadEvent({
      leadId,
      type: "analysis_started",
      newValue: analysisLead.normalizedDomain,
      createdBy: admin.email,
    });
  }

  // De opgegeven URL opnieuw valideren (SSRF-checks) voor de engine-aanroep.
  const normalized = await normalizeAndValidateUrl(analysisLead.submittedUrl);
  let result: AnalysisRunResult = normalized.ok
    ? await runWebsiteAnalysis({
        safeUrl: normalized.safeUrl,
        normalizedDomain: analysisLead.normalizedDomain,
        idempotencyKey: runId,
        locale: analysisLead.locale ?? "nl",
      })
    : { status: "failed", errorCode: "invalid_url" };

  const analysisReport =
    result.status === "completed"
      ? await createAnalysisReport({
          partnerAnalysisId: result.partnerAnalysisId,
          normalizedDomain: analysisLead.normalizedDomain,
          sourceUrl: result.report.url,
          report: result.report,
        }).catch(() => null)
      : null;
  if (result.status === "completed" && !analysisReport) {
    result = { status: "failed", errorCode: "report_storage_failed" };
  }

  if (result.status === "completed" && analysisReport) {
    const reportToken = analysisLead.reportToken ?? newReportToken();
    await updateAnalysisLead(analysisLeadId, {
      status: "completed",
      analysisStatus: "completed",
      analysisScore: result.score,
      criticalIssues: result.criticalIssues,
      ...(result.summary ? { analysisSummary: result.summary } : {}),
      reportToken,
      reportId: analysisReport.id,
      reportSchemaVersion: analysisReport.schemaVersion,
      completedAt: new Date().toISOString(),
    });

    const updated = await getAnalysisLead(analysisLeadId);
    if (updated) {
      const reportUrl = reportUrlFor(reportToken);
      await sendAnalysisReportMail({ analysisLead: updated, reportUrl });
      await sendAnalysisAdminNotification({ analysisLead: updated, kind: "completed" });
    }

    if (leadId) {
      await addLeadEvent({
        leadId,
        type: "analysis_completed",
        newValue: String(result.score),
        createdBy: admin.email,
      });
    }
  } else if (result.status !== "completed") {
    await updateAnalysisLead(analysisLeadId, {
      status: "failed",
      analysisStatus: "failed",
      failedAt: new Date().toISOString(),
    });

    const updated = await getAnalysisLead(analysisLeadId);
    if (updated) {
      await sendAnalysisAdminNotification({ analysisLead: updated, kind: "failed" });
    }

    if (leadId) {
      await addLeadEvent({
        leadId,
        type: "analysis_failed",
        newValue: result.errorCode,
        createdBy: admin.email,
      });
    }
  }

  revalidateLeadDetail(leadId);
}

/** Stuurt de rapportmail van een afgeronde analyse opnieuw naar de aanvrager. */
export async function resendReportAction(analysisLeadId: string): Promise<void> {
  const admin = await requireAdmin();
  const analysisLead = await getAnalysisLead(analysisLeadId);
  if (!analysisLead) {
    throw new Error("Analyse-aanvraag niet gevonden");
  }
  if (analysisLead.status !== "completed" || !analysisLead.reportToken) {
    throw new Error("Alleen een afgeronde analyse met rapport kan opnieuw gemaild worden");
  }

  // Uniek run-id meegeven zodat de mail_history-dedupe (idempotencyKey op
  // basis van analysisId) een bewuste hersending niet als duplicaat blokkeert.
  const resendLead: AnalysisLead = { ...analysisLead, analysisId: `admin-resend-${randomUUID()}` };
  await sendAnalysisReportMail({
    analysisLead: resendLead,
    reportUrl: reportUrlFor(analysisLead.reportToken),
  });

  if (analysisLead.leadId) {
    await addLeadEvent({
      leadId: analysisLead.leadId,
      type: "analysis_report_resent",
      newValue: analysisLead.normalizedDomain,
      createdBy: admin.email,
    });
  }

  revalidateLeadDetail(analysisLead.leadId);
}

/** Maakt het e-mailquotum voor dit adres leeg (toegekende extra credits blijven). */
export async function resetQuotaAction(emailNormalized: string, leadId: string): Promise<void> {
  const admin = await requireAdmin();
  await resetQuotaForEmail(emailNormalized);
  await addLeadEvent({ leadId, type: "analysis_quota_reset", createdBy: admin.email });
  revalidateLeadDetail(leadId);
}

/** Kent extra analysetegoeden toe bovenop het standaard e-mailquotum. */
export async function grantCreditAction(
  emailNormalized: string,
  leadId: string,
  count: number,
): Promise<void> {
  const admin = await requireAdmin();
  await grantExtraCredits(emailNormalized, count);
  await addLeadEvent({
    leadId,
    type: "analysis_credit_granted",
    newValue: String(count),
    createdBy: admin.email,
  });
  revalidateLeadDetail(leadId);
}

/**
 * Zet de analyselead om naar een commerciele lead: status "contacted" plus een
 * notitie. changeLeadStatus en createLeadNote loggen zelf de bijhorende events
 * (status_change en note_added) en doen de revalidatie.
 */
export async function convertToCommercialAction(leadId: string): Promise<void> {
  await requireAdmin();
  await changeLeadStatus(leadId, "contacted");
  await createLeadNote(leadId, "Geconverteerd vanuit websiteanalyse");
}
