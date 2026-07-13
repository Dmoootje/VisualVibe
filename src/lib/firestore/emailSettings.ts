import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import { encryptImapPassword, encryptSmtpPassword } from "@/lib/security/encryption";
import {
  EMAIL_FORM_TYPES,
  EMAIL_LOCALES,
  IMAP_SECURITY_MODES,
  SMTP_SECURITY_MODES,
  type EmailAutomationSettings,
  type EmailFormType,
  type EmailLocale,
  type EmailSettings,
  type EmailSettingsAdminView,
  type EmailSettingsUpdate,
  type ImapSecurity,
  type ImapSettings,
  type SmtpSecurity,
  type SmtpSettings,
} from "@/types/email";

const COLLECTION = "email_settings";
const SETTINGS_ID = "default" as const;

export const DEFAULT_SMTP_SETTINGS: SmtpSettings = {
  enabled: false,
  host: "",
  port: 587,
  security: "starttls",
  username: "",
  fromName: "VisualVibe",
  fromEmail: "hello@visualvibe.be",
  replyTo: "jens@visualvibe.be",
  adminRecipients: ["jens@visualvibe.be"],
  testRecipient: "jens@visualvibe.be",
};

export const DEFAULT_IMAP_SETTINGS: ImapSettings = {
  enabled: false,
  host: "",
  port: 993,
  security: "ssl",
  username: "",
  mailbox: "INBOX",
  syncWindowDays: 90,
};

export const DEFAULT_EMAIL_AUTOMATION_SETTINGS: EmailAutomationSettings = {
  sendCustomerConfirmation: true,
  sendAdminNotification: true,
  createAiReplyDraft: true,
  allowAiAutoSend: false,
  defaultLocale: "nl",
  responseExpectationText: "",
  signatureName: "Jens Hardy",
  signatureRole: "Zaakvoerder",
  signaturePhone: "+32 472 96 45 99",
  signatureEmail: "jens@visualvibe.be",
  signatureWebsite: "https://visualvibe.media",
  appointmentUrl: "",
  enabledFormTypes: [...EMAIL_FORM_TYPES],
};

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function dateValue(value: unknown, fallback: string): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value) {
    const toDate = (value as { toDate?: unknown }).toDate;
    if (typeof toDate === "function") {
      const date = toDate.call(value);
      if (date instanceof Date && !Number.isNaN(date.valueOf())) return date.toISOString();
    }
  }
  return fallback;
}

function isSmtpSecurity(value: unknown): value is SmtpSecurity {
  return typeof value === "string" && SMTP_SECURITY_MODES.includes(value as SmtpSecurity);
}

function isImapSecurity(value: unknown): value is ImapSecurity {
  return typeof value === "string" && IMAP_SECURITY_MODES.includes(value as ImapSecurity);
}

function isLocale(value: unknown): value is EmailLocale {
  return typeof value === "string" && EMAIL_LOCALES.includes(value as EmailLocale);
}

function stringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return [...fallback];
  return value.filter((item): item is string => typeof item === "string");
}

function formTypes(value: unknown): EmailFormType[] {
  if (!Array.isArray(value)) return [...DEFAULT_EMAIL_AUTOMATION_SETTINGS.enabledFormTypes];
  return value.filter(
    (item): item is EmailFormType =>
      typeof item === "string" && EMAIL_FORM_TYPES.includes(item as EmailFormType),
  );
}

function smtpFromData(value: unknown): SmtpSettings {
  const data = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const port = typeof data.port === "number" && Number.isInteger(data.port)
    ? data.port
    : DEFAULT_SMTP_SETTINGS.port;
  const encryptedPassword = stringValue(data.encryptedPassword);

  return {
    enabled: booleanValue(data.enabled, DEFAULT_SMTP_SETTINGS.enabled),
    host: stringValue(data.host, DEFAULT_SMTP_SETTINGS.host),
    port,
    security: isSmtpSecurity(data.security) ? data.security : DEFAULT_SMTP_SETTINGS.security,
    username: stringValue(data.username, DEFAULT_SMTP_SETTINGS.username),
    ...(encryptedPassword ? { encryptedPassword } : {}),
    fromName: stringValue(data.fromName, DEFAULT_SMTP_SETTINGS.fromName),
    fromEmail: stringValue(data.fromEmail, DEFAULT_SMTP_SETTINGS.fromEmail),
    replyTo: stringValue(data.replyTo, DEFAULT_SMTP_SETTINGS.replyTo),
    adminRecipients: stringArray(data.adminRecipients, DEFAULT_SMTP_SETTINGS.adminRecipients),
    testRecipient: stringValue(data.testRecipient, DEFAULT_SMTP_SETTINGS.testRecipient),
  };
}

function imapFromData(value: unknown): ImapSettings {
  const data = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const port = typeof data.port === "number" && Number.isInteger(data.port)
    ? data.port
    : DEFAULT_IMAP_SETTINGS.port;
  const syncWindowDays = typeof data.syncWindowDays === "number" && Number.isInteger(data.syncWindowDays)
    ? data.syncWindowDays
    : DEFAULT_IMAP_SETTINGS.syncWindowDays;
  const encryptedPassword = stringValue(data.encryptedPassword);

  return {
    enabled: booleanValue(data.enabled, DEFAULT_IMAP_SETTINGS.enabled),
    host: stringValue(data.host, DEFAULT_IMAP_SETTINGS.host),
    port,
    security: isImapSecurity(data.security) ? data.security : DEFAULT_IMAP_SETTINGS.security,
    username: stringValue(data.username, DEFAULT_IMAP_SETTINGS.username),
    ...(encryptedPassword ? { encryptedPassword } : {}),
    mailbox: stringValue(data.mailbox, DEFAULT_IMAP_SETTINGS.mailbox),
    syncWindowDays,
  };
}

function automationFromData(value: unknown): EmailAutomationSettings {
  const data = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const defaults = DEFAULT_EMAIL_AUTOMATION_SETTINGS;
  return {
    sendCustomerConfirmation: booleanValue(data.sendCustomerConfirmation, defaults.sendCustomerConfirmation),
    sendAdminNotification: booleanValue(data.sendAdminNotification, defaults.sendAdminNotification),
    createAiReplyDraft: booleanValue(data.createAiReplyDraft, defaults.createAiReplyDraft),
    allowAiAutoSend: booleanValue(data.allowAiAutoSend, defaults.allowAiAutoSend),
    defaultLocale: isLocale(data.defaultLocale) ? data.defaultLocale : defaults.defaultLocale,
    responseExpectationText: stringValue(data.responseExpectationText, defaults.responseExpectationText),
    signatureName: stringValue(data.signatureName, defaults.signatureName),
    signatureRole: stringValue(data.signatureRole, defaults.signatureRole),
    signaturePhone: stringValue(data.signaturePhone, defaults.signaturePhone),
    signatureEmail: stringValue(data.signatureEmail, defaults.signatureEmail),
    signatureWebsite: stringValue(data.signatureWebsite, defaults.signatureWebsite),
    appointmentUrl: stringValue(data.appointmentUrl, defaults.appointmentUrl),
    enabledFormTypes: formTypes(data.enabledFormTypes),
  };
}

function toEmailSettings(data: Record<string, unknown> | undefined): EmailSettings {
  const now = new Date().toISOString();
  return {
    id: SETTINGS_ID,
    smtp: smtpFromData(data?.smtp),
    imap: imapFromData(data?.imap),
    automation: automationFromData(data?.automation),
    createdAt: dateValue(data?.createdAt, now),
    updatedAt: dateValue(data?.updatedAt, now),
    ...(typeof data?.updatedBy === "string" ? { updatedBy: data.updatedBy } : {}),
  };
}

export function redactEmailSettings(settings: EmailSettings): EmailSettingsAdminView {
  const { encryptedPassword: smtpPassword, ...smtp } = settings.smtp;
  const { encryptedPassword: imapPassword, ...imap } = settings.imap;
  return {
    ...settings,
    smtp: { ...smtp, passwordConfigured: Boolean(smtpPassword) },
    imap: { ...imap, passwordConfigured: Boolean(imapPassword) },
  };
}

/** Internal read. The returned object can contain encryptedPassword. */
export async function getEmailSettings(): Promise<EmailSettings> {
  const snapshot = await adminDb.collection(COLLECTION).doc(SETTINGS_ID).get();
  return toEmailSettings(snapshot.exists ? snapshot.data() : undefined);
}

/** Redacted read intended for authenticated admin pages and actions. */
export async function getEmailSettingsForAdmin(): Promise<EmailSettingsAdminView> {
  return redactEmailSettings(await getEmailSettings());
}

function applySmtpUpdate(current: SmtpSettings, update: EmailSettingsUpdate["smtp"]): SmtpSettings {
  if (!update) return current;
  return {
    ...current,
    ...(typeof update.enabled === "boolean" ? { enabled: update.enabled } : {}),
    ...(typeof update.host === "string" ? { host: update.host.trim() } : {}),
    ...(typeof update.port === "number" ? { port: update.port } : {}),
    ...(isSmtpSecurity(update.security) ? { security: update.security } : {}),
    ...(typeof update.username === "string" ? { username: update.username.trim() } : {}),
    ...(typeof update.fromName === "string" ? { fromName: update.fromName.trim() } : {}),
    ...(typeof update.fromEmail === "string" ? { fromEmail: update.fromEmail.trim().toLowerCase() } : {}),
    ...(typeof update.replyTo === "string" ? { replyTo: update.replyTo.trim().toLowerCase() } : {}),
    ...(Array.isArray(update.adminRecipients)
      ? { adminRecipients: update.adminRecipients.map((email) => email.trim().toLowerCase()).filter(Boolean) }
      : {}),
    ...(typeof update.testRecipient === "string"
      ? { testRecipient: update.testRecipient.trim().toLowerCase() }
      : {}),
  };
}

function applyImapUpdate(current: ImapSettings, update: EmailSettingsUpdate["imap"]): ImapSettings {
  if (!update) return current;
  return {
    ...current,
    ...(typeof update.enabled === "boolean" ? { enabled: update.enabled } : {}),
    ...(typeof update.host === "string" ? { host: update.host.trim() } : {}),
    ...(typeof update.port === "number" ? { port: update.port } : {}),
    ...(isImapSecurity(update.security) ? { security: update.security } : {}),
    ...(typeof update.username === "string" ? { username: update.username.trim() } : {}),
    ...(typeof update.mailbox === "string" ? { mailbox: update.mailbox.trim() } : {}),
    ...(typeof update.syncWindowDays === "number" ? { syncWindowDays: update.syncWindowDays } : {}),
  };
}

function applyAutomationUpdate(
  current: EmailAutomationSettings,
  update: EmailSettingsUpdate["automation"],
): EmailAutomationSettings {
  if (!update) return current;
  return automationFromData({ ...current, ...update });
}

/**
 * Updates the singleton atomically. New secrets are encrypted inside this
 * server-only repository and are never returned. undefined/"" preserves a
 * current secret; null deliberately clears it.
 */
export async function updateEmailSettings(
  input: EmailSettingsUpdate,
  passwords: { smtp?: string | null; imap?: string | null } = {},
  updatedBy?: string,
): Promise<EmailSettingsAdminView> {
  const ref = adminDb.collection(COLLECTION).doc(SETTINGS_ID);

  const saved = await adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = toEmailSettings(snapshot.exists ? snapshot.data() : undefined);
    const now = new Date();
    const smtp = applySmtpUpdate(current.smtp, input.smtp);
    const imap = applyImapUpdate(current.imap, input.imap);
    const automation = applyAutomationUpdate(current.automation, input.automation);

    if (passwords.smtp === null) {
      delete smtp.encryptedPassword;
    } else if (typeof passwords.smtp === "string" && passwords.smtp.length > 0) {
      smtp.encryptedPassword = encryptSmtpPassword(passwords.smtp);
    }

    if (passwords.imap === null) {
      delete imap.encryptedPassword;
    } else if (typeof passwords.imap === "string" && passwords.imap.length > 0) {
      imap.encryptedPassword = encryptImapPassword(passwords.imap);
    }

    const data = {
      smtp,
      imap,
      automation,
      createdAt: snapshot.exists ? snapshot.data()?.createdAt ?? now : now,
      updatedAt: now,
      ...(updatedBy ? { updatedBy } : {}),
    };
    transaction.set(ref, data);
    return toEmailSettings(data);
  });

  return redactEmailSettings(saved);
}
