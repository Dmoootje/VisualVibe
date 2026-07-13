"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth/session";
import { getEmailSettings, updateEmailSettings } from "@/lib/firestore/emailSettings";
import {
  SafeSmtpError,
  sendSmtpMail,
  validateSmtpSettings,
  verifySmtpConnection,
} from "@/lib/email/smtp";
import { SafeImapError, validateImapSettings, verifyImapConnection } from "@/lib/email/imap";
import { renderEmailPreview } from "@/lib/email/templates";
import {
  EMAIL_FORM_TYPES,
  EMAIL_LOCALES,
  IMAP_SECURITY_MODES,
  SMTP_SECURITY_MODES,
  type EmailFormType,
  type EmailLocale,
  type EmailSettings,
  type EmailSettingsUpdate,
  type ImapSecurity,
  type ImapSettings,
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
  smtpPassword?: string;
  imapPassword?: string;
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

function parseSettings(
  formData: FormData,
  scope: "all" | "smtp" | "imap" = "all",
): { data?: ParsedSettings; error?: string } {
  const host = value(formData, "host");
  const rawPort = value(formData, "port");
  const port = Number(rawPort);
  const security = value(formData, "security") as SmtpSecurity;
  const username = value(formData, "username");
  const smtpPassword = String(formData.get("password") ?? "");
  const fromName = value(formData, "fromName");
  const fromEmail = value(formData, "fromEmail").toLowerCase();
  const replyTo = value(formData, "replyTo").toLowerCase();
  const adminRecipients = parseRecipients(value(formData, "adminRecipients"));
  const testRecipient = value(formData, "testRecipient").toLowerCase();
  const defaultLocale = value(formData, "defaultLocale") as EmailLocale;
  const imapHost = value(formData, "imapHost");
  const rawImapPort = value(formData, "imapPort");
  const imapPort = Number(rawImapPort);
  const imapSecurity = value(formData, "imapSecurity") as ImapSecurity;
  const imapUsername = value(formData, "imapUsername");
  const imapPassword = String(formData.get("imapPassword") ?? "");
  const imapMailbox = value(formData, "imapMailbox");
  const imapSyncWindowDays = Number(value(formData, "imapSyncWindowDays"));
  const enabledFormTypes = formData
    .getAll("enabledFormTypes")
    .map(String)
    .filter((item): item is EmailFormType => EMAIL_FORM_TYPES.includes(item as EmailFormType));

  if (scope !== "imap") {
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
    if (![username, smtpPassword].every((item) => !/[\r\n]/.test(item))) {
      return { error: "Gebruikersnaam of wachtwoord bevat ongeldige tekens." };
    }
    if (smtpPassword.length > 1024) {
      return { error: "Het SMTP-wachtwoord is te lang." };
    }
    if (smtpPassword && !username) {
      return { error: "Vul ook een SMTP-gebruikersnaam in om authenticatie te gebruiken." };
    }
  }
  if (scope !== "smtp") {
    if (!Number.isInteger(imapPort) || imapPort < 1 || imapPort > 65535) {
      return { error: "Vul een geldige IMAP-poort tussen 1 en 65535 in." };
    }
    if (!IMAP_SECURITY_MODES.includes(imapSecurity)) {
      return { error: "Kies een geldige IMAP-beveiliging." };
    }
    if (imapHost && (imapHost.length > 253 || /[\s\r\n]/.test(imapHost))) {
      return { error: "Vul een geldige IMAP-host in." };
    }
    if ([imapUsername, imapPassword, imapMailbox].some((item) => /[\0\r\n]/.test(item))) {
      return { error: "De IMAP-instellingen bevatten ongeldige tekens." };
    }
    if (imapPassword.length > 1024) {
      return { error: "Het IMAP-wachtwoord is te lang." };
    }
    if (!imapMailbox || imapMailbox.length > 255) {
      return { error: "Vul een geldige IMAP-mailbox in." };
    }
    if (!Number.isInteger(imapSyncWindowDays) || imapSyncWindowDays < 1 || imapSyncWindowDays > 365) {
      return { error: "Het IMAP-zoekvenster moet tussen 1 en 365 dagen liggen." };
    }
  }

  const signatureEmail = value(formData, "signatureEmail").toLowerCase();
  const signatureWebsite = value(formData, "signatureWebsite");
  const appointmentUrl = value(formData, "appointmentUrl");
  if (scope !== "imap") {
    if (!EMAIL_LOCALES.includes(defaultLocale)) {
      return { error: "Kies een geldige standaardtaal." };
    }
    if (!optionalEmailSchema.safeParse(signatureEmail).success) {
      return { error: "Vul een geldig e-mailadres voor de ondertekening in." };
    }
    if (!optionalUrlSchema.safeParse(signatureWebsite).success) {
      return { error: "Vul een geldige website-URL in, inclusief https://." };
    }
    if (!optionalUrlSchema.safeParse(appointmentUrl).success) {
      return { error: "Vul een geldige afsprakenlink in, inclusief https://." };
    }
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
      adminRecipients: adminRecipients ?? [],
      testRecipient,
    },
    imap: {
      enabled: checked(formData, "imapEnabled"),
      host: imapHost,
      port: imapPort,
      security: imapSecurity,
      username: imapUsername,
      mailbox: imapMailbox,
      syncWindowDays: imapSyncWindowDays,
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

  // Header-/footer-HTML (Opmaak-tab). Alleen meesturen wanneer de velden in
  // het formulier zaten; een lege string is een bewuste "geen header/footer".
  const headerHtml = formData.get("brandingHeaderHtml");
  const footerHtml = formData.get("brandingFooterHtml");
  if (typeof headerHtml === "string" || typeof footerHtml === "string") {
    const tooLong = [headerHtml, footerHtml].some(
      (html) => typeof html === "string" && html.length > 100_000,
    );
    if (tooLong) {
      return { error: "De header- of footer-HTML is te groot (max 100.000 tekens)." };
    }
    update.branding = {
      ...(typeof headerHtml === "string" ? { headerHtml } : {}),
      ...(typeof footerHtml === "string" ? { footerHtml } : {}),
    };
  }

  return {
    data: {
      update,
      ...(smtpPassword ? { smtpPassword } : {}),
      ...(imapPassword ? { imapPassword } : {}),
    },
  };
}

function mergeSettings(current: EmailSettings, update: EmailSettingsUpdate): EmailSettings {
  return {
    ...current,
    smtp: { ...current.smtp, ...update.smtp },
    imap: { ...current.imap, ...update.imap },
    automation: { ...current.automation, ...update.automation },
    branding: { ...current.branding, ...update.branding },
  };
}

function requireImapConfiguration(imap: ImapSettings, passwordOverride?: string): string | null {
  if (!imap.host || !imap.username || !imap.mailbox) {
    return "Vul eerst alle verplichte IMAP-velden in.";
  }
  if (!passwordOverride && !imap.encryptedPassword) {
    return "Vul het IMAP-wachtwoord in of sla eerst een wachtwoord op.";
  }
  return null;
}

function actionError(error: unknown, fallback: string): EmailSettingsActionState {
  if (error instanceof SafeSmtpError || error instanceof SafeImapError) {
    return { status: "error", message: error.message };
  }
  return { status: "error", message: fallback };
}

type CredentialEndpoint = {
  host: string;
  port: number;
  security: string;
  username: string;
  encryptedPassword?: string;
};

function requirePasswordForChangedEndpoint(
  current: CredentialEndpoint,
  candidate: CredentialEndpoint,
  newPassword: string | undefined,
  protocol: "SMTP" | "IMAP",
): string | null {
  if (!current.encryptedPassword || newPassword || !candidate.username.trim()) return null;
  const unchanged =
    current.host.trim().toLowerCase() === candidate.host.trim().toLowerCase() &&
    current.port === candidate.port &&
    current.security === candidate.security &&
    current.username.trim() === candidate.username.trim();
  return unchanged
    ? null
    : `Vul het ${protocol}-wachtwoord opnieuw in nadat je host, poort, beveiliging of gebruikersnaam wijzigt.`;
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

  const parsed = parseSettings(formData, "all");
  if (!parsed.data) return { status: "error", message: parsed.error ?? "Controleer de instellingen." };

  if (parsed.data.update.smtp?.enabled && !parsed.data.update.smtp.host) {
    return { status: "error", message: "Vul een SMTP-host in voordat je SMTP inschakelt." };
  }

  try {
    const current = await getEmailSettings();
    const candidate = mergeSettings(current, parsed.data.update);
    const smtpCredentialError = requirePasswordForChangedEndpoint(
      current.smtp,
      candidate.smtp,
      parsed.data.smtpPassword,
      "SMTP",
    );
    if (smtpCredentialError) return { status: "error", message: smtpCredentialError };
    const imapCredentialError = requirePasswordForChangedEndpoint(
      current.imap,
      candidate.imap,
      parsed.data.imapPassword,
      "IMAP",
    );
    if (imapCredentialError) return { status: "error", message: imapCredentialError };
    if (candidate.smtp.enabled || candidate.smtp.host) {
      validateSmtpSettings(candidate.smtp, parsed.data.smtpPassword);
    }
    if (candidate.imap.enabled || candidate.imap.host) {
      validateImapSettings(candidate.imap, parsed.data.imapPassword);
    }
    await updateEmailSettings(
      parsed.data.update,
      {
        smtp: parsed.data.smtpPassword ?? (candidate.smtp.username ? undefined : null),
        imap: parsed.data.imapPassword ?? (candidate.imap.username ? undefined : null),
      },
      admin.email,
    );
    revalidatePath("/admin/settings/email");
    return { status: "success", message: "E-mailinstellingen opgeslagen." };
  } catch (error) {
    return actionError(error, "Opslaan mislukt. Controleer de configuratie en probeer opnieuw.");
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

  const parsed = parseSettings(formData, "smtp");
  if (!parsed.data) return { status: "error", message: parsed.error ?? "Controleer de instellingen." };

  try {
    const current = await getEmailSettings();
    const candidate = mergeSettings(current, parsed.data.update);
    const credentialError = requirePasswordForChangedEndpoint(
      current.smtp,
      candidate.smtp,
      parsed.data.smtpPassword,
      "SMTP",
    );
    if (credentialError) return { status: "error", message: credentialError };
    const missing = requireSmtpConfiguration(candidate.smtp, parsed.data.smtpPassword);
    if (missing) return { status: "error", message: missing };

    await verifySmtpConnection(candidate.smtp, {
      plaintextPasswordOverride: parsed.data.smtpPassword,
    });
    return { status: "success", message: "De SMTP-verbinding werkt." };
  } catch (error) {
    return actionError(
      error,
      "Verbinding mislukt. Controleer host, poort, beveiliging en inloggegevens.",
    );
  }
}

export async function testImapConnectionAction(
  _previousState: EmailSettingsActionState,
  formData: FormData,
): Promise<EmailSettingsActionState> {
  try {
    await requireAdmin();
  } catch {
    return { status: "error", message: "Je sessie is verlopen. Meld je opnieuw aan." };
  }

  const parsed = parseSettings(formData, "imap");
  if (!parsed.data) return { status: "error", message: parsed.error ?? "Controleer de instellingen." };

  try {
    const current = await getEmailSettings();
    const candidate = mergeSettings(current, parsed.data.update);
    const credentialError = requirePasswordForChangedEndpoint(
      current.imap,
      candidate.imap,
      parsed.data.imapPassword,
      "IMAP",
    );
    if (credentialError) return { status: "error", message: credentialError };
    const missing = requireImapConfiguration(candidate.imap, parsed.data.imapPassword);
    if (missing) return { status: "error", message: missing };

    await verifyImapConnection(candidate.imap, {
      plaintextPasswordOverride: parsed.data.imapPassword,
    });
    return { status: "success", message: `De IMAP-verbinding met ${candidate.imap.mailbox} werkt.` };
  } catch (error) {
    return actionError(
      error,
      "Verbinding mislukt. Controleer host, poort, beveiliging, mailbox en inloggegevens.",
    );
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

  const parsed = parseSettings(formData, "smtp");
  if (!parsed.data) return { status: "error", message: parsed.error ?? "Controleer de instellingen." };

  try {
    const current = await getEmailSettings();
    const candidate = mergeSettings(current, parsed.data.update);
    const credentialError = requirePasswordForChangedEndpoint(
      current.smtp,
      candidate.smtp,
      parsed.data.smtpPassword,
      "SMTP",
    );
    if (credentialError) return { status: "error", message: credentialError };
    const missing = requireSmtpConfiguration(candidate.smtp, parsed.data.smtpPassword);
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
        plaintextPasswordOverride: parsed.data.smtpPassword,
        allowWhenDisabled: true,
      },
    );
    return {
      status: "success",
      message: `Testmail verstuurd naar ${candidate.smtp.testRecipient}.`,
    };
  } catch (error) {
    return actionError(error, "De testmail kon niet worden verstuurd. Controleer de SMTP-instellingen.");
  }
}
