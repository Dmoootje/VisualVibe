"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth/session";
import { getEmailSettings, updateEmailSettings } from "@/lib/firestore/emailSettings";
import { sendSmtpMail, validateSmtpSettings, verifySmtpConnection } from "@/lib/email/smtp";
import { renderEmailPreview } from "@/lib/email/templates";
import {
  EMAIL_FORM_TYPES,
  EMAIL_LOCALES,
  SMTP_SECURITY_MODES,
  type EmailFormType,
  type EmailLocale,
  type EmailSettings,
  type EmailSettingsUpdate,
  type SmtpSecurity,
  type SmtpSettings,
} from "@/types/email";

export type EmailSettingsActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const emailSchema = z.string().trim().email();
const optionalEmailSchema = z.union([z.literal(""), emailSchema]);
const optionalUrlSchema = z.union([z.literal(""), z.string().trim().url()]);
const safeHeaderSchema = z.string().trim().max(320).refine((value) => !/[\r\n]/.test(value));

type ParsedSettings = {
  update: EmailSettingsUpdate;
  password?: string;
};

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}

function value(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function checked(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

function parseRecipients(raw: string): string[] | null {
  const recipients = [...new Set(raw.split(/[,;\n]+/).map((item) => item.trim().toLowerCase()).filter(Boolean))];
  if (recipients.length === 0 || recipients.some((recipient) => !emailSchema.safeParse(recipient).success)) {
    return null;
  }
  return recipients;
}

function parseSettings(formData: FormData): { data?: ParsedSettings; error?: string } {
  const host = value(formData, "host");
  const rawPort = value(formData, "port");
  const port = Number(rawPort);
  const security = value(formData, "security") as SmtpSecurity;
  const username = value(formData, "username");
  const password = String(formData.get("password") ?? "");
  const fromName = value(formData, "fromName");
  const fromEmail = value(formData, "fromEmail").toLowerCase();
  const replyTo = value(formData, "replyTo").toLowerCase();
  const adminRecipients = parseRecipients(value(formData, "adminRecipients"));
  const testRecipient = value(formData, "testRecipient").toLowerCase();
  const defaultLocale = value(formData, "defaultLocale") as EmailLocale;
  const enabledFormTypes = formData
    .getAll("enabledFormTypes")
    .map(String)
    .filter((item): item is EmailFormType => EMAIL_FORM_TYPES.includes(item as EmailFormType));

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return { error: "Vul een geldige SMTP-poort tussen 1 en 65535 in." };
  }
  if (!SMTP_SECURITY_MODES.includes(security)) {
    return { error: "Kies een geldige SMTP-beveiliging." };
  }
  if (host && (host.length > 253 || /[\s\r\n]/.test(host))) {
    return { error: "Vul een geldige SMTP-host in." };
  }
  if (!safeHeaderSchema.safeParse(fromName).success || !fromName) {
    return { error: "Vul een geldige naam voor de afzender in." };
  }
  if (!emailSchema.safeParse(fromEmail).success) {
    return { error: "Vul een geldig e-mailadres voor de afzender in." };
  }
  if (!optionalEmailSchema.safeParse(replyTo).success) {
    return { error: "Vul een geldig Reply-To-adres in." };
  }
  if (!adminRecipients) {
    return { error: "Vul minstens één geldig intern e-mailadres in." };
  }
  if (!emailSchema.safeParse(testRecipient).success) {
    return { error: "Vul een geldig adres voor de testmail in." };
  }
  if (![username, password].every((item) => !/[\r\n]/.test(item))) {
    return { error: "Gebruikersnaam of wachtwoord bevat ongeldige tekens." };
  }
  if (password.length > 1024) {
    return { error: "Het SMTP-wachtwoord is te lang." };
  }
  if (!EMAIL_LOCALES.includes(defaultLocale)) {
    return { error: "Kies een geldige standaardtaal." };
  }

  const signatureEmail = value(formData, "signatureEmail").toLowerCase();
  const signatureWebsite = value(formData, "signatureWebsite");
  const appointmentUrl = value(formData, "appointmentUrl");
  if (!optionalEmailSchema.safeParse(signatureEmail).success) {
    return { error: "Vul een geldig e-mailadres voor de ondertekening in." };
  }
  if (!optionalUrlSchema.safeParse(signatureWebsite).success) {
    return { error: "Vul een geldige website-URL in, inclusief https://." };
  }
  if (!optionalUrlSchema.safeParse(appointmentUrl).success) {
    return { error: "Vul een geldige afsprakenlink in, inclusief https://." };
  }

  const update: EmailSettingsUpdate = {
    smtp: {
      enabled: checked(formData, "enabled"),
      host,
      port,
      security,
      username,
      fromName,
      fromEmail,
      replyTo,
      adminRecipients,
      testRecipient,
    },
    automation: {
      sendCustomerConfirmation: checked(formData, "sendCustomerConfirmation"),
      sendAdminNotification: checked(formData, "sendAdminNotification"),
      createAiReplyDraft: checked(formData, "createAiReplyDraft"),
      allowAiAutoSend: checked(formData, "allowAiAutoSend"),
      defaultLocale,
      responseExpectationText: value(formData, "responseExpectationText"),
      signatureName: value(formData, "signatureName"),
      signatureRole: value(formData, "signatureRole"),
      signaturePhone: value(formData, "signaturePhone"),
      signatureEmail,
      signatureWebsite,
      appointmentUrl,
      enabledFormTypes,
    },
  };

  return { data: { update, ...(password ? { password } : {}) } };
}

function mergeSettings(current: EmailSettings, update: EmailSettingsUpdate): EmailSettings {
  return {
    ...current,
    smtp: { ...current.smtp, ...update.smtp },
    automation: { ...current.automation, ...update.automation },
  };
}

function requireSmtpConfiguration(smtp: SmtpSettings, passwordOverride?: string): string | null {
  if (!smtp.host || !smtp.fromEmail || smtp.adminRecipients.length === 0) {
    return "Vul eerst alle verplichte SMTP-velden in.";
  }
  if (smtp.username && !passwordOverride && !smtp.encryptedPassword) {
    return "Vul het SMTP-wachtwoord in of sla eerst een wachtwoord op.";
  }
  return null;
}

export async function saveEmailSettingsAction(
  _previousState: EmailSettingsActionState,
  formData: FormData,
): Promise<EmailSettingsActionState> {
  let admin: Awaited<ReturnType<typeof requireAdmin>>;
  try {
    admin = await requireAdmin();
  } catch {
    return { status: "error", message: "Je sessie is verlopen. Meld je opnieuw aan." };
  }

  const parsed = parseSettings(formData);
  if (!parsed.data) return { status: "error", message: parsed.error ?? "Controleer de instellingen." };

  if (parsed.data.update.smtp?.enabled && !parsed.data.update.smtp.host) {
    return { status: "error", message: "Vul een SMTP-host in voordat je SMTP inschakelt." };
  }

  try {
    const current = await getEmailSettings();
    const candidate = mergeSettings(current, parsed.data.update);
    if (candidate.smtp.enabled || candidate.smtp.host) {
      validateSmtpSettings(candidate.smtp, parsed.data.password);
    }
    await updateEmailSettings(parsed.data.update, parsed.data.password, admin.email);
    revalidatePath("/admin/settings/email");
    return { status: "success", message: "E-mailinstellingen opgeslagen." };
  } catch {
    return { status: "error", message: "Opslaan mislukt. Controleer de configuratie en probeer opnieuw." };
  }
}

export async function testSmtpConnectionAction(
  _previousState: EmailSettingsActionState,
  formData: FormData,
): Promise<EmailSettingsActionState> {
  try {
    await requireAdmin();
  } catch {
    return { status: "error", message: "Je sessie is verlopen. Meld je opnieuw aan." };
  }

  const parsed = parseSettings(formData);
  if (!parsed.data) return { status: "error", message: parsed.error ?? "Controleer de instellingen." };

  try {
    const candidate = mergeSettings(await getEmailSettings(), parsed.data.update);
    const missing = requireSmtpConfiguration(candidate.smtp, parsed.data.password);
    if (missing) return { status: "error", message: missing };

    await verifySmtpConnection(candidate.smtp, {
      plaintextPasswordOverride: parsed.data.password,
    });
    return { status: "success", message: "De SMTP-verbinding werkt." };
  } catch {
    return {
      status: "error",
      message: "Verbinding mislukt. Controleer host, poort, beveiliging en inloggegevens.",
    };
  }
}

export async function sendSmtpTestEmailAction(
  _previousState: EmailSettingsActionState,
  formData: FormData,
): Promise<EmailSettingsActionState> {
  try {
    await requireAdmin();
  } catch {
    return { status: "error", message: "Je sessie is verlopen. Meld je opnieuw aan." };
  }

  const parsed = parseSettings(formData);
  if (!parsed.data) return { status: "error", message: parsed.error ?? "Controleer de instellingen." };

  try {
    const candidate = mergeSettings(await getEmailSettings(), parsed.data.update);
    const missing = requireSmtpConfiguration(candidate.smtp, parsed.data.password);
    if (missing) return { status: "error", message: missing };

    const preview = await renderEmailPreview(candidate, candidate.automation.defaultLocale);
    await sendSmtpMail(
      candidate.smtp,
      {
        to: candidate.smtp.testRecipient,
        replyTo: (preview.replyTo ?? candidate.smtp.replyTo) || undefined,
        subject: `[TEST] ${preview.subject}`,
        html: preview.html,
        text: preview.text,
      },
      {
        plaintextPasswordOverride: parsed.data.password,
        allowWhenDisabled: true,
      },
    );
    return {
      status: "success",
      message: `Testmail verstuurd naar ${candidate.smtp.testRecipient}.`,
    };
  } catch {
    return {
      status: "error",
      message: "De testmail kon niet worden verstuurd. Controleer de SMTP-instellingen.",
    };
  }
}
