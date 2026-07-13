"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { getLeadById } from "@/lib/firestore/leads";
import { getEmailSettings } from "@/lib/firestore/emailSettings";
import {
  createMailHistory,
  getMailHistoryById,
  markMailHistoryFailed,
  markMailHistorySent,
  updateMailHistory,
} from "@/lib/firestore/mailHistory";
import { addLeadEvent } from "@/lib/firestore/leadEvents";
import { generateLeadReplyWithFallback } from "@/lib/ai/generateLeadReply";
import { resolveLeadEmailServiceBlocks } from "@/config/leadEmailServiceBlocks";
import { renderAiReplyEmail } from "@/lib/email/templates";
import { sendSmtpMail } from "@/lib/email/smtp";
import type { AiReplyDraft, LeadEmailData, MailHistory } from "@/types/email";
import type { Lead } from "@/types";

export type LeadEmailActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

type Intent = "regenerate" | "save" | "test" | "send";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}

function toEmailLead(lead: Lead): LeadEmailData {
  return {
    id: lead.id,
    leadNumber: lead.leadNumber,
    formType: lead.formType,
    locale: lead.locale,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    selectedServices: lead.selectedServices,
    message: lead.message,
    region: lead.region,
    sourcePage: lead.sourcePage,
    sourceUrl: lead.sourceUrl,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    createdAt: lead.createdAt,
    adminDetailUrl: `https://visualvibe.be/admin/leads/${encodeURIComponent(lead.id)}`,
  };
}

function editableTextFromDraft(draft: AiReplyDraft): string {
  const closingLine = draft.closing.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
  return [
    draft.greeting,
    draft.summary,
    ...draft.serviceSections.flatMap((section) => [section.title, section.body]),
    draft.questions.length ? `Vragen:\n${draft.questions.map((question) => `- ${question}`).join("\n")}` : "",
    draft.nextStep,
    closingLine ?? "",
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");
}

function draftFromEditor(subject: string, body: string): AiReplyDraft {
  return {
    subject,
    greeting: "",
    summary: body,
    serviceSections: [],
    questions: [],
    nextStep: "",
    closing: "",
  };
}

function readEditor(formData: FormData): { subject?: string; body?: string; error?: string } {
  const subject = String(formData.get("subject") ?? "").trim().replace(/\s+/g, " ");
  const body = String(formData.get("body") ?? "").replace(/\0/g, "").trim();

  if (!subject || subject.length > 200 || /[\r\n]/.test(subject)) {
    return { error: "Vul een geldig onderwerp van maximaal 200 tekens in." };
  }
  if (!body || body.length > 30_000) {
    return { error: "Vul een antwoordtekst van maximaal 30.000 tekens in." };
  }
  return { subject, body };
}

function revalidateLead(leadId: string) {
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
}

async function getEditableDraft(draftId: string, leadId: string): Promise<MailHistory | null> {
  if (!draftId) return null;
  const draft = await getMailHistoryById(draftId);
  if (!draft || draft.leadId !== leadId || draft.type !== "ai_draft" || draft.status !== "draft") {
    return null;
  }
  return draft;
}

async function regenerateDraft(lead: Lead, createdBy: string): Promise<LeadEmailActionState> {
  const settings = await getEmailSettings();
  const blocks = resolveLeadEmailServiceBlocks(lead.selectedServices, lead.locale);
  const result = await generateLeadReplyWithFallback({
    locale: lead.locale,
    leadNumber: lead.leadNumber,
    formType: lead.formType,
    firstName: lead.name.trim().split(/\s+/)[0] || undefined,
    name: lead.name,
    company: lead.company,
    message: lead.message,
    selectedServices: blocks.map((block) => block.id),
    serviceBlocks: blocks.map((block) => ({
      serviceId: block.id,
      title: block.label,
      preparationPoints: [...block.preparationPoints],
    })),
    contact: {
      companyName: "VisualVibe",
      signatureName: settings.automation.signatureName,
      signatureRole: settings.automation.signatureRole,
      phone: settings.automation.signaturePhone,
      email: settings.automation.signatureEmail,
      website: settings.automation.signatureWebsite,
      appointmentUrl: settings.automation.appointmentUrl,
      responseExpectationText: settings.automation.responseExpectationText,
    },
  });

  // De vaste template verzorgt de definitieve footer. We nemen enkel de eerste
  // afsluitregel over, zodat naam en contactgegevens niet dubbel verschijnen.
  const editableText = editableTextFromDraft(result.draft);
  const rendered = renderAiReplyEmail(
    { lead: toEmailLead(lead), settings },
    draftFromEditor(result.draft.subject, editableText),
  );
  const historyId = await createMailHistory({
    leadId: lead.id,
    type: "ai_draft",
    to: [lead.email],
    replyTo: rendered.replyTo,
    subject: rendered.subject,
    htmlBody: rendered.html,
    textBody: editableText,
    status: "draft",
    createdBy,
    locale: lead.locale,
  });
  await addLeadEvent({
    leadId: lead.id,
    type: "draft_generated",
    newValue: `${historyId}:${result.source}`,
    createdBy,
  });
  revalidateLead(lead.id);

  return {
    status: "success",
    message:
      result.source === "ai"
        ? "Nieuw AI-concept gegenereerd. Controleer het altijd voor verzending."
        : "AI was niet beschikbaar. Er is een veilig standaardconcept aangemaakt.",
  };
}

async function saveDraft(
  lead: Lead,
  draftId: string,
  subject: string,
  body: string,
  createdBy: string,
): Promise<LeadEmailActionState> {
  const settings = await getEmailSettings();
  const rendered = renderAiReplyEmail(
    { lead: toEmailLead(lead), settings },
    draftFromEditor(subject, body),
  );
  const existing = await getEditableDraft(draftId, lead.id);
  let savedId: string;

  if (existing) {
    await updateMailHistory(existing.id, {
      subject: rendered.subject,
      htmlBody: rendered.html,
      textBody: body,
      createdBy,
    });
    savedId = existing.id;
  } else {
    savedId = await createMailHistory({
      leadId: lead.id,
      type: "ai_draft",
      to: [lead.email],
      replyTo: rendered.replyTo,
      subject: rendered.subject,
      htmlBody: rendered.html,
      textBody: body,
      status: "draft",
      createdBy,
      locale: lead.locale,
    });
  }

  await addLeadEvent({
    leadId: lead.id,
    type: "draft_edited",
    newValue: savedId,
    createdBy,
  });
  revalidateLead(lead.id);
  return { status: "success", message: "Onderwerp en antwoordtekst opgeslagen." };
}

async function sendManualMail({
  lead,
  subject,
  body,
  createdBy,
  test,
}: {
  lead: Lead;
  subject: string;
  body: string;
  createdBy: string;
  test: boolean;
}): Promise<LeadEmailActionState> {
  const settings = await getEmailSettings();
  const rendered = renderAiReplyEmail(
    { lead: toEmailLead(lead), settings },
    draftFromEditor(subject, body),
  );
  const recipient = test ? createdBy || settings.smtp.testRecipient : lead.email;
  const historyId = await createMailHistory({
    leadId: lead.id,
    type: "manual_reply",
    to: [recipient],
    replyTo: rendered.replyTo,
    subject: test ? `[TEST] ${rendered.subject}` : rendered.subject,
    htmlBody: rendered.html,
    textBody: rendered.text,
    status: "queued",
    createdBy,
    locale: lead.locale,
  });

  let providerMessageId: string;
  try {
    const result = await sendSmtpMail(settings.smtp, {
      to: recipient,
      replyTo: rendered.replyTo,
      subject: test ? `[TEST] ${rendered.subject}` : rendered.subject,
      html: rendered.html,
      text: rendered.text,
    });
    providerMessageId = result.messageId;
  } catch (error) {
    await Promise.allSettled([
      markMailHistoryFailed(historyId, error, "MANUAL_SEND_FAILED"),
      addLeadEvent({
        leadId: lead.id,
        type: "email_failed",
        newValue: `${test ? "test" : "customer"}:${historyId}`,
        createdBy,
      }),
    ]);
    revalidateLead(lead.id);
    return {
      status: "error",
      message: test
        ? "De testmail kon niet worden verstuurd. De fout staat in de e-mailhistorie."
        : "Het antwoord kon niet worden verstuurd. De fout staat in de e-mailhistorie.",
    };
  }

  // De provider heeft de mail aanvaard. Een los auditprobleem mag dat resultaat
  // niet als mislukte verzending voorstellen of een onveilige dubbele retry uitlokken.
  const [historyResult] = await Promise.allSettled([
    markMailHistorySent(historyId, providerMessageId),
    addLeadEvent({
      leadId: lead.id,
      type: "email_sent",
      newValue: `${test ? "test" : "customer"}:${historyId}`,
      createdBy,
    }),
  ]);
  revalidateLead(lead.id);
  return {
    status: "success",
    message:
      historyResult.status === "fulfilled"
        ? test
          ? `Testmail verstuurd naar ${recipient}.`
          : `Antwoord verstuurd naar ${lead.email}.`
        : "De mail is verstuurd, maar de historiek kon niet volledig worden bijgewerkt. Verstuur niet opnieuw.",
  };
}

export async function handleLeadEmailAction(
  _previousState: LeadEmailActionState,
  formData: FormData,
): Promise<LeadEmailActionState> {
  let admin: Awaited<ReturnType<typeof requireAdmin>>;
  try {
    admin = await requireAdmin();
  } catch {
    return { status: "error", message: "Je sessie is verlopen. Meld je opnieuw aan." };
  }

  const leadId = String(formData.get("leadId") ?? "").trim();
  const intent = String(formData.get("intent") ?? "") as Intent;
  if (!leadId || !["regenerate", "save", "test", "send"].includes(intent)) {
    return { status: "error", message: "Ongeldige communicatieactie." };
  }

  try {
    const lead = await getLeadById(leadId);
    if (!lead) return { status: "error", message: "Lead niet gevonden." };
    if (intent === "regenerate") return await regenerateDraft(lead, admin.email);

    const editor = readEditor(formData);
    if (!editor.subject || !editor.body) {
      return { status: "error", message: editor.error ?? "Vul onderwerp en antwoordtekst in." };
    }

    if (intent === "save") {
      return await saveDraft(
        lead,
        String(formData.get("draftId") ?? "").trim(),
        editor.subject,
        editor.body,
        admin.email,
      );
    }
    return await sendManualMail({
      lead,
      subject: editor.subject,
      body: editor.body,
      createdBy: admin.email,
      test: intent === "test",
    });
  } catch {
    return {
      status: "error",
      message: "De communicatieactie is mislukt. Probeer opnieuw of controleer de e-mailhistorie.",
    };
  }
}
