import "server-only";

import { createHash, createHmac } from "node:crypto";
import { businessConfig } from "@/config/business.config";
import { sendSmtpMail } from "@/lib/email/smtp";
import {
  renderAnalysisAdminNotification,
  renderAnalysisReportEmail,
  renderAnalysisVerificationEmail,
} from "@/lib/email/templates";
import { adminDb } from "@/lib/firebase/admin";
import { getAnalysisReport } from "@/lib/firestore/analysisReports";
import { getEmailSettings } from "@/lib/firestore/emailSettings";
import {
  claimAutomaticMailDispatch,
  markMailHistoryFailed,
  markMailHistorySent,
  sanitizeMailError,
  type AutomaticMailHistoryType,
} from "@/lib/firestore/mailHistory";
import { DEFAULT_ANALYSIS_QUOTA_CONFIG, type AnalysisLead } from "@/types/analysis";
import type { EmailSettings, RenderedEmail, SmtpSendResult } from "@/types/email";

export type AnalysisMailResult = { status: "sent" | "skipped" | "failed" | "duplicate" };

export type AnalysisAdminNotificationKind = "completed" | "limit_reached" | "failed";

type AnalysisMailType = Extract<
  AutomaticMailHistoryType,
  "analysis_verification" | "analysis_report" | "analysis_admin_notification"
>;

type PreparedAnalysisMail = {
  type: AnalysisMailType;
  /** Volledige mail zoals die via SMTP vertrekt. */
  rendered: RenderedEmail;
  /** Variant die in mail_history wordt bewaard; bij verificatie is de code gemaskeerd. */
  stored: RenderedEmail;
  to: string[];
  idempotencyKey: string;
};

async function loadEmailSettings(): Promise<EmailSettings | null> {
  try {
    return await getEmailSettings();
  } catch {
    // De analyse-flow mag nooit crashen op een instellingenlookup.
    return null;
  }
}

async function loadStoredAnalysisReport(analysisLead: AnalysisLead) {
  if (!analysisLead.reportId) return null;
  try {
    return await getAnalysisReport(analysisLead.reportId);
  } catch {
    // De rapportmail mag nooit blokkeren op een tijdelijke Firestore-read.
    // Zonder volledig rapport valt de template terug op score + samenvatting.
    return null;
  }
}

/**
 * Geldigheidsduur van de verificatiecode voor de mailtekst. Enkelvoudige
 * documentlees zonder query; bij problemen geldt de standaardwaarde.
 */
async function resolveCodeTtlMinutes(): Promise<number> {
  try {
    const snapshot = await adminDb.collection("analysis_settings").doc("default").get();
    const value = snapshot.exists ? snapshot.data()?.codeTtlMinutes : undefined;
    if (typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 24 * 60) {
      return value;
    }
  } catch {
    // Val stil terug op de standaardwaarde; de mail zelf blijft correct.
  }
  return DEFAULT_ANALYSIS_QUOTA_CONFIG.codeTtlMinutes;
}

/**
 * Dedupe-hash van de verificatiecode voor de idempotencyKey. De code zelf mag
 * nergens in plaintext bewaard of gelogd worden; met APP_ENCRYPTION_KEY als
 * HMAC-sleutel is de hash bovendien niet offline te brute-forcen.
 */
function codeDedupeHash(analysisLeadId: string, code: string): string {
  const secret = process.env.APP_ENCRYPTION_KEY?.trim();
  const scope = `${analysisLeadId}:${code}`;
  const digest = secret
    ? createHmac("sha256", secret).update(scope).digest("hex")
    : createHash("sha256").update(scope).digest("hex");
  return digest.slice(0, 32);
}

function safeErrorCode(error: unknown): string {
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string") {
    return error.code.replace(/[^A-Z0-9_-]/gi, "_").toUpperCase().slice(0, 80) || "MAIL_ERROR";
  }
  return "MAIL_ERROR";
}

function stableAnalysisMessageId(
  analysisLeadId: string,
  type: AnalysisMailType,
  idempotencyKey: string,
): string {
  const safeId = analysisLeadId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || "analyse";
  // De idempotencyKey bevat nooit een plaintext code; hier wordt hij bovendien
  // opnieuw gehasht zodat het Message-ID geen interne sleutels lekt.
  const suffix = createHash("sha256").update(idempotencyKey).digest("hex").slice(0, 12);
  return `<${type}.${safeId}.${suffix}@visualvibe.be>`;
}

/**
 * Claimt de dispatch (dedupe bij retries), verstuurt via SMTP en werkt de
 * mail_history-status bij. Verificatiecodes worden nooit gelogd en alleen
 * gemaskeerd in mail_history bewaard (zie `stored`).
 */
async function dispatchAnalysisMail(
  analysisLead: AnalysisLead,
  settings: EmailSettings,
  mail: PreparedAnalysisMail,
): Promise<AnalysisMailResult> {
  const historyLeadId = analysisLead.leadId ?? analysisLead.id;

  let claim: Awaited<ReturnType<typeof claimAutomaticMailDispatch>>;
  try {
    claim = await claimAutomaticMailDispatch({
      leadId: historyLeadId,
      type: mail.type,
      to: mail.to,
      cc: [],
      bcc: [],
      ...(mail.stored.replyTo ? { replyTo: mail.stored.replyTo } : {}),
      subject: mail.stored.subject,
      htmlBody: mail.stored.html,
      textBody: mail.stored.text,
      createdBy: "system",
      locale: "nl",
      idempotencyKey: mail.idempotencyKey,
    });
  } catch {
    // Zonder geclaimde dispatch versturen we bewust niets: liever geen mail
    // dan mogelijk twee dezelfde.
    return { status: "failed" };
  }

  if (!claim.claimed) return { status: "duplicate" };

  const messageId = stableAnalysisMessageId(analysisLead.id, mail.type, mail.idempotencyKey);
  let sendResult: SmtpSendResult;
  try {
    sendResult = await sendSmtpMail(settings.smtp, {
      to: mail.to,
      ...(mail.rendered.replyTo ? { replyTo: mail.rendered.replyTo } : {}),
      subject: mail.rendered.subject,
      html: mail.rendered.html,
      text: mail.rendered.text,
      messageId,
    });
    if (sendResult.accepted.length === 0) {
      const rejected = new Error("De SMTP-server accepteerde geen ontvangers.") as Error & {
        code: string;
      };
      rejected.code = "NO_RECIPIENT_ACCEPTED";
      throw rejected;
    }
  } catch (error) {
    try {
      await markMailHistoryFailed(
        claim.mailHistoryId,
        sanitizeMailError(error) || "De e-mail kon niet worden verzonden.",
        safeErrorCode(error),
      );
    } catch {
      // De dispatch blijft dan queued staan; dat voorkomt hoe dan ook een
      // dubbele verzending bij een latere poging.
    }
    return { status: "failed" };
  }

  // De provider heeft de mail geaccepteerd. Als de historie-update tijdelijk
  // niet lukt, blijft de dispatch geclaimd en wordt er nooit opnieuw verzonden.
  try {
    await markMailHistorySent(claim.mailHistoryId, sendResult.messageId || messageId);
  } catch {
    // Bewust stil: de mail is verstuurd en dat is het resultaat dat telt.
  }
  return { status: "sent" };
}

/** Stuurt de 6-cijferige verificatiecode naar de aanvrager. */
export async function sendAnalysisVerificationMail(input: {
  analysisLead: AnalysisLead;
  code: string;
}): Promise<AnalysisMailResult> {
  const { analysisLead, code } = input;
  const settings = await loadEmailSettings();
  if (!settings) return { status: "failed" };
  if (!settings.smtp.enabled) return { status: "skipped" };

  const ttlMinutes = await resolveCodeTtlMinutes();
  const rendered = renderAnalysisVerificationEmail({
    firstName: analysisLead.firstName,
    code,
    ttlMinutes,
    settings,
  });
  // De code mag nooit onversleuteld in Firestore staan; mail_history krijgt
  // daarom een variant waarin de code is gemaskeerd.
  const stored = renderAnalysisVerificationEmail({
    firstName: analysisLead.firstName,
    code: "******",
    ttlMinutes,
    settings,
  });

  return dispatchAnalysisMail(analysisLead, settings, {
    type: "analysis_verification",
    rendered,
    stored,
    to: [analysisLead.email],
    idempotencyKey: `${analysisLead.id}:verification:${codeDedupeHash(analysisLead.id, code)}`,
  });
}

/** Stuurt de rapportmail met score, bevindingen en rapportlink naar de aanvrager. */
export async function sendAnalysisReportMail(input: {
  analysisLead: AnalysisLead;
  reportUrl: string;
}): Promise<AnalysisMailResult> {
  const { analysisLead, reportUrl } = input;
  const settings = await loadEmailSettings();
  if (!settings) return { status: "failed" };
  if (!settings.smtp.enabled) return { status: "skipped" };
  const storedReport = await loadStoredAnalysisReport(analysisLead);

  const rendered = renderAnalysisReportEmail({
    firstName: analysisLead.firstName,
    domain: analysisLead.normalizedDomain,
    ...(typeof analysisLead.analysisScore === "number"
      ? { score: analysisLead.analysisScore }
      : {}),
    criticalIssues: analysisLead.criticalIssues ?? [],
    ...(analysisLead.analysisSummary ? { analysisSummary: analysisLead.analysisSummary } : {}),
    ...(storedReport?.report ? { report: storedReport.report } : {}),
    reportUrl,
    settings,
  });

  return dispatchAnalysisMail(analysisLead, settings, {
    type: "analysis_report",
    rendered,
    stored: rendered,
    to: [analysisLead.email],
    idempotencyKey: `${analysisLead.id}:report:${analysisLead.analysisId ?? "reuse"}`,
  });
}

/** Meldt een afgeronde, gelimiteerde of mislukte analyse aan het interne team. */
export async function sendAnalysisAdminNotification(input: {
  analysisLead: AnalysisLead;
  kind: AnalysisAdminNotificationKind;
}): Promise<AnalysisMailResult> {
  const { analysisLead, kind } = input;
  const settings = await loadEmailSettings();
  if (!settings) return { status: "failed" };
  if (!settings.smtp.enabled) return { status: "skipped" };
  if (settings.smtp.adminRecipients.length === 0) return { status: "skipped" };

  const rendered = renderAnalysisAdminNotification({
    analysisLead: {
      firstName: analysisLead.firstName,
      email: analysisLead.email,
      ...(analysisLead.companyName ? { companyName: analysisLead.companyName } : {}),
      submittedUrl: analysisLead.submittedUrl,
      normalizedDomain: analysisLead.normalizedDomain,
      ...(typeof analysisLead.analysisScore === "number"
        ? { analysisScore: analysisLead.analysisScore }
        : {}),
      ...(analysisLead.criticalIssues ? { criticalIssues: analysisLead.criticalIssues } : {}),
      ...(analysisLead.quotaDecision ? { quotaDecision: analysisLead.quotaDecision } : {}),
      status: analysisLead.status,
      ...(analysisLead.leadNumber ? { leadNumber: analysisLead.leadNumber } : {}),
    },
    kind,
    ...(analysisLead.leadId
      ? {
          adminDetailUrl: `${businessConfig.url}/admin/leads/${encodeURIComponent(analysisLead.leadId)}/`,
        }
      : {}),
    settings,
  });

  return dispatchAnalysisMail(analysisLead, settings, {
    type: "analysis_admin_notification",
    rendered,
    stored: rendered,
    to: settings.smtp.adminRecipients,
    idempotencyKey: `${analysisLead.id}:admin:${kind}`,
  });
}
