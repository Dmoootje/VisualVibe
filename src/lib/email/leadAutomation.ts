import "server-only";

import { businessConfig } from "@/config/business.config";
import { resolveLeadEmailServiceBlocks } from "@/config/leadEmailServiceBlocks";
import { generateLeadReplyWithFallback } from "@/lib/ai/generateLeadReply";
import { sendSmtpMail } from "@/lib/email/smtp";
import {
  renderAdminNotification,
  renderAiReplyEmail,
  renderCustomerConfirmation,
} from "@/lib/email/templates";
import { getEmailSettings } from "@/lib/firestore/emailSettings";
import { addLeadEvent } from "@/lib/firestore/leadEvents";
import {
  claimAutomaticMailDispatch,
  createMailHistory,
  markMailHistoryFailed,
  markMailHistorySent,
  sanitizeMailError,
  type AutomaticMailHistoryType,
} from "@/lib/firestore/mailHistory";
import { getSiteSettings } from "@/lib/firestore/siteSettings";
import type { Lead } from "@/types";
import type {
  AiReplyDraft,
  EmailLocale,
  EmailSettings,
  LeadEmailData,
  RenderedEmail,
} from "@/types/email";

export type LeadAutomationDelivery = {
  type: AutomaticMailHistoryType;
  status: "sent" | "failed" | "duplicate";
  mailHistoryId?: string;
  errorCode?: string;
};

export type LeadAutomationResult = {
  status: "processed" | "skipped" | "settings_unavailable";
  aiDraftId?: string;
  aiSource?: "ai" | "fallback";
  deliveries: LeadAutomationDelivery[];
};

type PreparedAutomaticMail = {
  type: AutomaticMailHistoryType;
  rendered: RenderedEmail;
  to: string[];
  cc?: string[];
  bcc?: string[];
};

function firstName(value: string): string | undefined {
  return value.trim().split(/\s+/)[0] || undefined;
}

function localeFor(lead: Lead, settings: EmailSettings): EmailLocale {
  return lead.locale === "fr" || lead.locale === "en" || lead.locale === "nl"
    ? lead.locale
    : settings.automation.defaultLocale;
}

function adminDetailUrl(leadId: string): string {
  return `${businessConfig.url}/admin/leads/${encodeURIComponent(leadId)}/`;
}

function stableMessageId(leadId: string, type: AutomaticMailHistoryType): string {
  const safeLeadId = leadId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 100) || "lead";
  return `<${type}.${safeLeadId}@visualvibe.be>`;
}

function safeErrorCode(error: unknown): string {
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string") {
    return error.code.replace(/[^A-Z0-9_-]/gi, "_").toUpperCase().slice(0, 80) || "MAIL_ERROR";
  }
  return "MAIL_ERROR";
}

async function safeLeadEvent(
  leadId: string,
  type: "draft_generated" | "email_sent" | "email_failed",
  newValue: string,
): Promise<void> {
  try {
    await addLeadEvent({ leadId, type, newValue: newValue.slice(0, 200), createdBy: "system" });
  } catch {
    // Communication audit logging must never turn a stored lead or sent mail
    // into a failed public submission.
  }
}

function toLeadEmailData(lead: Lead, locale: EmailLocale): LeadEmailData {
  return {
    id: lead.id,
    leadNumber: lead.leadNumber,
    formType: lead.formType,
    locale,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    selectedServices: [...lead.selectedServices],
    message: lead.message,
    region: lead.region,
    sourcePage: lead.sourcePage,
    sourceUrl: lead.sourceUrl,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    createdAt: lead.createdAt,
    adminDetailUrl: adminDetailUrl(lead.id),
  };
}

function editableAiDraftText(draft: AiReplyDraft): string {
  return [
    draft.greeting,
    draft.summary,
    ...draft.serviceSections.flatMap((section) => [section.title, section.body]),
    draft.questions.length
      ? `Vragen:\n${draft.questions.map((question) => `- ${question}`).join("\n")}`
      : "",
    draft.nextStep,
    draft.closing.split(/\r?\n/).map((line) => line.trim()).find(Boolean) ?? "",
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");
}

async function prepareAiDraft(
  lead: Lead,
  leadData: LeadEmailData,
  settings: EmailSettings,
): Promise<{
  draft?: AiReplyDraft;
  historyId?: string;
  source?: "ai" | "fallback";
}> {
  if (!settings.automation.createAiReplyDraft && !settings.automation.allowAiAutoSend) return {};

  try {
    const siteSettings = await getSiteSettings();
    const serviceBlocks = resolveLeadEmailServiceBlocks(
      leadData.selectedServices,
      leadData.locale,
    ).map((block) => ({
      serviceId: block.id,
      title: block.label,
      preparationPoints: [...block.preparationPoints],
    }));

    const generation = await generateLeadReplyWithFallback({
      locale: leadData.locale,
      leadNumber: leadData.leadNumber,
      formType: leadData.formType,
      firstName: firstName(leadData.name),
      name: leadData.name,
      company: leadData.company,
      message: leadData.message,
      selectedServices: leadData.selectedServices,
      serviceBlocks,
      businessKnowledge: [
        businessConfig.description,
        `Bedrijfsnaam: ${siteSettings.companyName || businessConfig.displayName}`,
        siteSettings.fullAddress ? `Adres: ${siteSettings.fullAddress}` : "",
        siteSettings.mainEmail ? `Algemeen e-mailadres: ${siteSettings.mainEmail}` : "",
      ].filter(Boolean),
      contact: {
        companyName: siteSettings.companyName || businessConfig.displayName,
        signatureName:
          settings.automation.signatureName || siteSettings.contactPerson || businessConfig.founder,
        signatureRole: settings.automation.signatureRole,
        phone:
          settings.automation.signaturePhone || siteSettings.phone || businessConfig.telephone,
        email:
          settings.automation.signatureEmail || siteSettings.mainEmail || businessConfig.email,
        website: settings.automation.signatureWebsite || businessConfig.url,
        appointmentUrl: settings.automation.appointmentUrl,
        responseExpectationText: settings.automation.responseExpectationText,
      },
    });

    const rendered = renderAiReplyEmail({ lead: leadData, settings }, generation.draft);
    const historyId = await createMailHistory({
      leadId: lead.id,
      type: "ai_draft",
      to: [lead.email],
      cc: [],
      bcc: [],
      replyTo: rendered.replyTo,
      subject: rendered.subject,
      htmlBody: rendered.html,
      // Store the editable content without the template footer. The footer is
      // added once, server-side, when Jens sends the reviewed draft.
      textBody: editableAiDraftText(generation.draft),
      status: "draft",
      errorCode: generation.source === "fallback" ? "AI_FALLBACK" : undefined,
      errorMessage: generation.source === "fallback" ? generation.error : undefined,
      createdBy: "system",
      locale: leadData.locale,
      idempotencyKey: `${lead.id}:ai_draft:initial`,
    });

    await safeLeadEvent(lead.id, "draft_generated", `${historyId}:${generation.source}`);
    return { draft: generation.draft, historyId, source: generation.source };
  } catch {
    // Customer/admin deterministic mails remain independent from AI and its
    // history record. Auto-send is intentionally skipped without a stored draft.
    return {};
  }
}

async function sendAutomaticMail(
  lead: Lead,
  settings: EmailSettings,
  mail: PreparedAutomaticMail,
): Promise<LeadAutomationDelivery> {
  let claim: Awaited<ReturnType<typeof claimAutomaticMailDispatch>>;
  try {
    claim = await claimAutomaticMailDispatch({
      leadId: lead.id,
      type: mail.type,
      to: mail.to,
      cc: mail.cc ?? [],
      bcc: mail.bcc ?? [],
      replyTo: mail.rendered.replyTo,
      subject: mail.rendered.subject,
      htmlBody: mail.rendered.html,
      textBody: mail.rendered.text,
      createdBy: "system",
      locale: localeFor(lead, settings),
    });
  } catch (error) {
    const errorCode = safeErrorCode(error);
    await safeLeadEvent(lead.id, "email_failed", `${mail.type}:${errorCode}`);
    return { type: mail.type, status: "failed", errorCode };
  }

  if (!claim.claimed) {
    return {
      type: mail.type,
      status: "duplicate",
      mailHistoryId: claim.mailHistoryId,
    };
  }

  let sendResult: Awaited<ReturnType<typeof sendSmtpMail>>;
  try {
    sendResult = await sendSmtpMail(settings.smtp, {
      to: mail.to,
      cc: mail.cc,
      bcc: mail.bcc,
      replyTo: mail.rendered.replyTo,
      subject: mail.rendered.subject,
      html: mail.rendered.html,
      text: mail.rendered.text,
      messageId: stableMessageId(lead.id, mail.type),
    });
    if (sendResult.accepted.length === 0) {
      const rejected = new Error("De SMTP-server accepteerde geen ontvangers.") as Error & {
        code: string;
      };
      rejected.code = "NO_RECIPIENT_ACCEPTED";
      throw rejected;
    }
  } catch (error) {
    const errorCode = safeErrorCode(error);
    try {
      await markMailHistoryFailed(
        claim.mailHistoryId,
        sanitizeMailError(error) || "De e-mail kon niet worden verzonden.",
        errorCode,
      );
    } catch {
      // The deterministic queued dispatch still prevents a duplicate send if
      // recording the failure itself is temporarily unavailable.
    }
    await safeLeadEvent(lead.id, "email_failed", `${mail.type}:${errorCode}`);
    return {
      type: mail.type,
      status: "failed",
      mailHistoryId: claim.mailHistoryId,
      errorCode,
    };
  }

  // The provider accepted the mail. If the subsequent Firestore update is
  // temporarily unavailable, leave the deterministic dispatch queued instead
  // of marking it failed: a retry could otherwise send the same mail twice.
  try {
    await markMailHistorySent(
      claim.mailHistoryId,
      sendResult.messageId || stableMessageId(lead.id, mail.type),
    );
  } catch {
    await safeLeadEvent(
      lead.id,
      "email_sent",
      `${mail.type}:${claim.mailHistoryId}:history_update_pending`,
    );
    return {
      type: mail.type,
      status: "sent",
      mailHistoryId: claim.mailHistoryId,
      errorCode: "HISTORY_UPDATE_PENDING",
    };
  }

  await safeLeadEvent(lead.id, "email_sent", `${mail.type}:${claim.mailHistoryId}`);
  return { type: mail.type, status: "sent", mailHistoryId: claim.mailHistoryId };
}

/**
 * Runs all optional post-persistence work for one safely stored lead. This
 * function is deliberately self-contained and never exposes SMTP credentials
 * or provider errors to the public lead route.
 */
export async function processLeadAutomations(lead: Lead): Promise<LeadAutomationResult> {
  let settings: EmailSettings;
  try {
    settings = await getEmailSettings();
  } catch {
    return { status: "settings_unavailable", deliveries: [] };
  }

  if (!settings.automation.enabledFormTypes.includes(lead.formType)) {
    return { status: "skipped", deliveries: [] };
  }

  const locale = localeFor(lead, settings);
  const baseLeadData = toLeadEmailData(lead, locale);
  const ai = await prepareAiDraft(lead, baseLeadData, settings);
  const leadData: LeadEmailData = ai.draft
    ? {
        ...baseLeadData,
        aiSummary: ai.draft.summary,
        missingInformation: ai.draft.questions,
        suggestedNextAction: ai.draft.nextStep,
      }
    : baseLeadData;

  // SMTP being disabled is an intentional configuration state, not a failed
  // send attempt. AI drafts above remain available for review.
  if (!settings.smtp.enabled) {
    return {
      status: "processed",
      aiDraftId: ai.historyId,
      aiSource: ai.source,
      deliveries: [],
    };
  }

  const prepared: PreparedAutomaticMail[] = [];
  const preparationFailures: LeadAutomationDelivery[] = [];
  if (settings.automation.sendCustomerConfirmation) {
    try {
      prepared.push({
        type: "customer_confirmation",
        rendered: renderCustomerConfirmation({ lead: leadData, settings }),
        to: [lead.email],
      });
    } catch {
      preparationFailures.push({
        type: "customer_confirmation",
        status: "failed",
        errorCode: "TEMPLATE_ERROR",
      });
      await safeLeadEvent(lead.id, "email_failed", "customer_confirmation:TEMPLATE_ERROR");
    }
  }
  if (settings.automation.sendAdminNotification && settings.smtp.adminRecipients.length > 0) {
    try {
      prepared.push({
        type: "admin_notification",
        rendered: renderAdminNotification({ lead: leadData, settings }),
        to: settings.smtp.adminRecipients,
      });
    } catch {
      preparationFailures.push({
        type: "admin_notification",
        status: "failed",
        errorCode: "TEMPLATE_ERROR",
      });
      await safeLeadEvent(lead.id, "email_failed", "admin_notification:TEMPLATE_ERROR");
    }
  }
  if (settings.automation.allowAiAutoSend && ai.draft && ai.historyId) {
    try {
      prepared.push({
        type: "automated_reply",
        rendered: renderAiReplyEmail({ lead: leadData, settings }, ai.draft),
        to: [lead.email],
      });
    } catch {
      preparationFailures.push({
        type: "automated_reply",
        status: "failed",
        errorCode: "TEMPLATE_ERROR",
      });
      await safeLeadEvent(lead.id, "email_failed", "automated_reply:TEMPLATE_ERROR");
    }
  }

  const settled = await Promise.allSettled(
    prepared.map((mail) => sendAutomaticMail(lead, settings, mail)),
  );
  const settledDeliveries = settled.map((result, index): LeadAutomationDelivery => {
    if (result.status === "fulfilled") return result.value;
    return {
      type: prepared[index].type,
      status: "failed",
      errorCode: "AUTOMATION_ERROR",
    };
  });
  const deliveries = [...preparationFailures, ...settledDeliveries];

  return {
    status: "processed",
    aiDraftId: ai.historyId,
    aiSource: ai.source,
    deliveries,
  };
}
