import "server-only";

import type { DocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { encryptImapPassword, encryptSmtpPassword } from "@/lib/security/encryption";
import { getEmailSettings } from "@/lib/firestore/emailSettings";
import {
  IMAP_SECURITY_MODES,
  SMTP_SECURITY_MODES,
  type ImapSecurity,
  type SmtpSecurity,
} from "@/types/email";
import {
  EMAIL_SYSTEM_FOLDERS,
  EMAIL_TEMPLATE_MODES,
  type EmailMailbox,
  type EmailMailboxAdminView,
  type EmailSystemFolder,
  type EmailTemplateMode,
  type MailboxFolderMapping,
  type MailboxFolderSyncState,
  type MailboxImapSettings,
  type MailboxSmtpSettings,
  type MailboxSyncStatus,
} from "@/types/emailClient";

const COLLECTION = "email_mailboxes";
/** Vast id voor de gemigreerde bestaande verbinding, zodat migratie idempotent is. */
export const MIGRATED_PRIMARY_MAILBOX_ID = "primary";

const SYNC_STATUSES: MailboxSyncStatus[] = [
  "idle",
  "syncing",
  "synced",
  "partial-error",
  "error",
  "paused",
];

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function int(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isInteger(value) ? value : fallback;
}

function iso(value: unknown): string | undefined {
  if (typeof value === "string" && value) return value;
  if (value && typeof value === "object" && "toDate" in value) {
    const toDate = (value as { toDate?: unknown }).toDate;
    if (typeof toDate === "function") {
      const date = toDate.call(value);
      if (date instanceof Date && !Number.isNaN(date.valueOf())) return date.toISOString();
    }
  }
  return undefined;
}

function imapFromData(value: unknown): MailboxImapSettings {
  const data = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const encryptedPassword = str(data.encryptedPassword);
  return {
    enabled: bool(data.enabled, false),
    host: str(data.host),
    port: int(data.port, 993),
    security: IMAP_SECURITY_MODES.includes(data.security as ImapSecurity)
      ? (data.security as ImapSecurity)
      : "ssl",
    username: str(data.username),
    ...(encryptedPassword ? { encryptedPassword } : {}),
    initialSyncDays: Math.min(365, Math.max(1, int(data.initialSyncDays, 90))),
    batchSize: Math.min(200, Math.max(10, int(data.batchSize, 100))),
  };
}

function smtpFromData(value: unknown): MailboxSmtpSettings {
  const data = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const encryptedPassword = str(data.encryptedPassword);
  return {
    enabled: bool(data.enabled, false),
    host: str(data.host),
    port: int(data.port, 587),
    security: SMTP_SECURITY_MODES.includes(data.security as SmtpSecurity)
      ? (data.security as SmtpSecurity)
      : "starttls",
    username: str(data.username),
    ...(encryptedPassword ? { encryptedPassword } : {}),
    replyTo: str(data.replyTo),
  };
}

function folderMappingFromData(value: unknown): MailboxFolderMapping {
  const data = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const mapping: MailboxFolderMapping = {};
  for (const folder of EMAIL_SYSTEM_FOLDERS) {
    const path = str(data[folder]);
    if (path) mapping[folder] = path;
  }
  return mapping;
}

function syncStateFromData(
  value: unknown,
): Partial<Record<EmailSystemFolder, MailboxFolderSyncState>> {
  const data = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const state: Partial<Record<EmailSystemFolder, MailboxFolderSyncState>> = {};
  for (const folder of EMAIL_SYSTEM_FOLDERS) {
    const entry = data[folder];
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const path = str(record.path);
    if (!path) continue;
    state[folder] = {
      path,
      uidValidity: str(record.uidValidity, "0"),
      lastUid: int(record.lastUid, 0),
      ...(iso(record.lastSyncAt) ? { lastSyncAt: iso(record.lastSyncAt) } : {}),
    };
  }
  return state;
}

function templateMode(value: unknown, fallback: EmailTemplateMode): EmailTemplateMode {
  return EMAIL_TEMPLATE_MODES.includes(value as EmailTemplateMode)
    ? (value as EmailTemplateMode)
    : fallback;
}

function toMailbox(doc: DocumentSnapshot): EmailMailbox {
  const data = doc.data() ?? {};
  const now = new Date().toISOString();
  return {
    id: doc.id,
    name: str(data.name, doc.id),
    emailAddress: str(data.emailAddress).toLowerCase(),
    displayName: str(data.displayName),
    description: str(data.description),
    color: str(data.color, "#FF7A00"),
    isActive: bool(data.isActive, true),
    isDefaultManualMailbox: bool(data.isDefaultManualMailbox, false),
    showInUnifiedInbox: bool(data.showInUnifiedInbox, true),
    imap: imapFromData(data.imap),
    smtp: smtpFromData(data.smtp),
    signatureHtml: str(data.signatureHtml),
    templateModeNew: templateMode(data.templateModeNew, "full"),
    templateModeReply: templateMode(data.templateModeReply, "none"),
    allowedAdminEmails: Array.isArray(data.allowedAdminEmails)
      ? data.allowedAdminEmails.filter((item): item is string => typeof item === "string")
      : [],
    folderMapping: folderMappingFromData(data.folderMapping),
    folderSyncState: syncStateFromData(data.folderSyncState),
    syncStatus: SYNC_STATUSES.includes(data.syncStatus as MailboxSyncStatus)
      ? (data.syncStatus as MailboxSyncStatus)
      : "idle",
    ...(iso(data.lastSyncAt) ? { lastSyncAt: iso(data.lastSyncAt) } : {}),
    ...(iso(data.lastSyncStartedAt) ? { lastSyncStartedAt: iso(data.lastSyncStartedAt) } : {}),
    ...(str(data.lastSyncError) ? { lastSyncError: str(data.lastSyncError) } : {}),
    messageCount: int(data.messageCount, 0),
    unreadCount: int(data.unreadCount, 0),
    createdAt: iso(data.createdAt) ?? now,
    updatedAt: iso(data.updatedAt) ?? now,
  };
}

export function redactMailbox(mailbox: EmailMailbox): EmailMailboxAdminView {
  const { encryptedPassword: imapSecret, ...imap } = mailbox.imap;
  const { encryptedPassword: smtpSecret, ...smtp } = mailbox.smtp;
  return {
    ...mailbox,
    imap: { ...imap, passwordConfigured: Boolean(imapSecret) },
    smtp: { ...smtp, passwordConfigured: Boolean(smtpSecret) },
  };
}

/** Interne read: kan versleutelde wachtwoorden bevatten; nooit naar de client sturen. */
export async function getMailbox(id: string): Promise<EmailMailbox | null> {
  if (!id) return null;
  const doc = await adminDb.collection(COLLECTION).doc(id).get();
  return doc.exists ? toMailbox(doc) : null;
}

export async function listMailboxes(): Promise<EmailMailbox[]> {
  const snapshot = await adminDb.collection(COLLECTION).orderBy("createdAt", "asc").get();
  return snapshot.docs.map(toMailbox);
}

/**
 * Migreert de bestaande enkele IMAP/SMTP-configuratie uit email_settings naar
 * het eerste mailboxaccount. Idempotent: draait alleen wanneer er nog geen
 * mailboxen bestaan en de bestaande configuratie een host heeft. De versleutelde
 * wachtwoorden worden 1-op-1 overgenomen (zelfde APP_ENCRYPTION_KEY en AAD),
 * de originele email_settings blijven onaangeroerd voor de website-mails.
 */
export async function migrateLegacyMailboxIfNeeded(): Promise<EmailMailbox | null> {
  const existing = await adminDb.collection(COLLECTION).limit(1).get();
  if (!existing.empty) return null;

  const settings = await getEmailSettings();
  const hasImap = Boolean(settings.imap.host && settings.imap.username);
  const hasSmtp = Boolean(settings.smtp.host);
  if (!hasImap && !hasSmtp) return null;

  const now = new Date();
  const emailAddress = (settings.smtp.fromEmail || settings.imap.username || "").toLowerCase();
  const ref = adminDb.collection(COLLECTION).doc(MIGRATED_PRIMARY_MAILBOX_ID);
  await adminDb.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    if (doc.exists) return;
    transaction.create(ref, {
      name: "Hoofdmailbox",
      emailAddress,
      displayName: settings.smtp.fromName || "VisualVibe",
      description: "Automatisch gemigreerd vanuit de bestaande e-mailinstellingen.",
      color: "#FF7A00",
      isActive: true,
      isDefaultManualMailbox: true,
      showInUnifiedInbox: true,
      imap: {
        enabled: settings.imap.enabled && hasImap,
        host: settings.imap.host,
        port: settings.imap.port,
        security: settings.imap.security,
        username: settings.imap.username,
        ...(settings.imap.encryptedPassword
          ? { encryptedPassword: settings.imap.encryptedPassword }
          : {}),
        initialSyncDays: settings.imap.syncWindowDays,
        batchSize: 100,
      },
      smtp: {
        enabled: settings.smtp.enabled && hasSmtp,
        host: settings.smtp.host,
        port: settings.smtp.port,
        security: settings.smtp.security,
        username: settings.smtp.username,
        ...(settings.smtp.encryptedPassword
          ? { encryptedPassword: settings.smtp.encryptedPassword }
          : {}),
        replyTo: settings.smtp.replyTo,
      },
      signatureHtml: "",
      templateModeNew: "full",
      templateModeReply: "none",
      allowedAdminEmails: [],
      folderMapping: { inbox: settings.imap.mailbox || "INBOX" },
      folderSyncState: {},
      syncStatus: "idle",
      messageCount: 0,
      unreadCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  });

  const created = await ref.get();
  return created.exists ? toMailbox(created) : null;
}

export type MailboxWriteInput = {
  name: string;
  emailAddress: string;
  displayName: string;
  description: string;
  color: string;
  isActive: boolean;
  isDefaultManualMailbox: boolean;
  showInUnifiedInbox: boolean;
  signatureHtml: string;
  templateModeNew: EmailTemplateMode;
  templateModeReply: EmailTemplateMode;
  imap: Omit<MailboxImapSettings, "encryptedPassword">;
  smtp: Omit<MailboxSmtpSettings, "encryptedPassword">;
};

/**
 * Maakt of bewerkt een mailbox. Nieuwe wachtwoorden worden hier versleuteld;
 * undefined/"" behoudt het huidige geheim, null wist het bewust.
 */
export async function saveMailbox(
  input: MailboxWriteInput,
  passwords: { imap?: string | null; smtp?: string | null },
  id?: string,
): Promise<EmailMailbox> {
  const ref = id
    ? adminDb.collection(COLLECTION).doc(id)
    : adminDb.collection(COLLECTION).doc();

  const saved = await adminDb.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    const now = new Date();
    const current = doc.exists ? toMailbox(doc) : null;

    const imap: MailboxImapSettings = {
      ...input.imap,
      ...(current?.imap.encryptedPassword
        ? { encryptedPassword: current.imap.encryptedPassword }
        : {}),
    };
    if (passwords.imap === null) {
      delete imap.encryptedPassword;
    } else if (typeof passwords.imap === "string" && passwords.imap.length > 0) {
      imap.encryptedPassword = encryptImapPassword(passwords.imap);
    }

    const smtp: MailboxSmtpSettings = {
      ...input.smtp,
      ...(current?.smtp.encryptedPassword
        ? { encryptedPassword: current.smtp.encryptedPassword }
        : {}),
    };
    if (passwords.smtp === null) {
      delete smtp.encryptedPassword;
    } else if (typeof passwords.smtp === "string" && passwords.smtp.length > 0) {
      smtp.encryptedPassword = encryptSmtpPassword(passwords.smtp);
    }

    const data = {
      name: input.name,
      emailAddress: input.emailAddress.toLowerCase(),
      displayName: input.displayName,
      description: input.description,
      color: input.color,
      isActive: input.isActive,
      isDefaultManualMailbox: input.isDefaultManualMailbox,
      showInUnifiedInbox: input.showInUnifiedInbox,
      signatureHtml: input.signatureHtml,
      templateModeNew: input.templateModeNew,
      templateModeReply: input.templateModeReply,
      allowedAdminEmails: current?.allowedAdminEmails ?? [],
      imap,
      smtp,
      folderMapping: current?.folderMapping ?? {},
      folderSyncState: current?.folderSyncState ?? {},
      syncStatus: current?.syncStatus ?? "idle",
      ...(current?.lastSyncAt ? { lastSyncAt: current.lastSyncAt } : {}),
      ...(current?.lastSyncError ? { lastSyncError: current.lastSyncError } : {}),
      messageCount: current?.messageCount ?? 0,
      unreadCount: current?.unreadCount ?? 0,
      createdAt: current ? current.createdAt : now,
      updatedAt: now,
    };
    transaction.set(ref, data);
    return data;
  });

  // isDefaultManualMailbox is exclusief: zet de vlag uit op alle andere mailboxen.
  if (saved.isDefaultManualMailbox) {
    const others = await adminDb
      .collection(COLLECTION)
      .where("isDefaultManualMailbox", "==", true)
      .get();
    const batch = adminDb.batch();
    let dirty = false;
    for (const doc of others.docs) {
      if (doc.id !== ref.id) {
        batch.update(doc.ref, { isDefaultManualMailbox: false });
        dirty = true;
      }
    }
    if (dirty) await batch.commit();
  }

  const result = await ref.get();
  return toMailbox(result);
}

export async function updateMailboxFields(
  id: string,
  fields: Partial<
    Pick<
      EmailMailbox,
      | "isActive"
      | "isDefaultManualMailbox"
      | "syncStatus"
      | "lastSyncAt"
      | "lastSyncStartedAt"
      | "lastSyncError"
      | "folderMapping"
      | "folderSyncState"
      | "messageCount"
      | "unreadCount"
    >
  >,
): Promise<void> {
  await adminDb
    .collection(COLLECTION)
    .doc(id)
    .update({ ...fields, updatedAt: new Date() });
}

/**
 * Claimt een syncbeurt zodat niet twee zware synchronisaties tegelijk draaien.
 * Een claim ouder dan 3 minuten wordt als verlopen beschouwd.
 */
export async function claimMailboxSync(id: string): Promise<boolean> {
  const ref = adminDb.collection(COLLECTION).doc(id);
  return adminDb.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    if (!doc.exists) return false;
    const mailbox = toMailbox(doc);
    if (mailbox.syncStatus === "syncing" && mailbox.lastSyncStartedAt) {
      const startedAt = new Date(mailbox.lastSyncStartedAt).getTime();
      if (Date.now() - startedAt < 3 * 60_000) return false;
    }
    transaction.update(ref, {
      syncStatus: "syncing",
      lastSyncStartedAt: new Date().toISOString(),
      updatedAt: new Date(),
    });
    return true;
  });
}

export async function deleteMailboxDoc(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).delete();
}
