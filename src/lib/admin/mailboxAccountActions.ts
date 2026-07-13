"use server";

// Beheeracties voor mailboxaccounts (multi-mailbox). Staat volledig los van de
// website-SMTP in email_settings: die blijft de transactionele websitemails
// versturen en wordt hier nooit gewijzigd.

import { getCurrentAdmin, type CurrentAdmin } from "@/lib/auth/session";
import {
  deleteMailboxDoc,
  getMailbox,
  listMailboxes,
  migrateLegacyMailboxIfNeeded,
  redactMailbox,
  saveMailbox,
  updateMailboxFields,
  type MailboxWriteInput,
} from "@/lib/firestore/emailMailboxes";
import { countUnread, deleteMailboxData } from "@/lib/firestore/emailClientStore";
import {
  SafeMailboxImapError,
  detectFolderMapping,
  listRemoteFolders,
  verifyMailboxImap,
} from "@/lib/email/mailboxImap";
import { sendFromMailbox, newMailboxMessageId, verifyMailboxSmtp } from "@/lib/email/mailboxSmtp";
import { SafeSmtpError, validateEmailAddress, validateMailHost } from "@/lib/email/smtp";
import { sanitizeEmailHtml } from "@/lib/email/sanitizeEmailHtml";
import {
  EMAIL_SYSTEM_FOLDERS,
  EMAIL_TEMPLATE_MODES,
  type EmailMailbox,
  type EmailMailboxAdminView,
  type EmailSystemFolder,
  type EmailTemplateMode,
  type MailboxConnectionState,
  type MailboxFolderMapping,
} from "@/types/emailClient";
import type { ImapSecurity, SmtpSecurity } from "@/types/email";

export type MailboxActionResult<T> = { ok: true; data: T } | { ok: false; message: string };

async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}

function friendlyError(error: unknown): string {
  if (error instanceof SafeMailboxImapError || error instanceof SafeSmtpError) {
    return error.message;
  }
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return "Je sessie is verlopen. Meld je opnieuw aan.";
  }
  return "De actie is mislukt. Probeer het opnieuw.";
}

function connectionState(mailbox: EmailMailbox): MailboxConnectionState {
  if (!mailbox.isActive) return "disabled";
  const imapReady = mailbox.imap.enabled && Boolean(mailbox.imap.host) && Boolean(mailbox.imap.encryptedPassword);
  const smtpReady = mailbox.smtp.enabled && Boolean(mailbox.smtp.host);
  if (imapReady && smtpReady) {
    return mailbox.syncStatus === "error" || mailbox.syncStatus === "partial-error"
      ? "partial-error"
      : "connected";
  }
  if (imapReady) return "imap-only";
  if (smtpReady) return "smtp-only";
  return "disconnected";
}

export type MailboxAccountOverview = {
  mailbox: EmailMailboxAdminView;
  connection: MailboxConnectionState;
  inboxUnread: number;
};

export async function listMailboxAccountsAction(): Promise<
  MailboxActionResult<MailboxAccountOverview[]>
> {
  try {
    await requireAdmin();
    await migrateLegacyMailboxIfNeeded();
    const mailboxes = await listMailboxes();
    const overviews: MailboxAccountOverview[] = [];
    for (const mailbox of mailboxes) {
      overviews.push({
        mailbox: redactMailbox(mailbox),
        connection: connectionState(mailbox),
        inboxUnread: await countUnread(mailbox.id),
      });
    }
    return { ok: true, data: overviews };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export type MailboxAccountInput = {
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
  imap: {
    enabled: boolean;
    host: string;
    port: number;
    security: ImapSecurity;
    username: string;
    initialSyncDays: number;
    batchSize: number;
  };
  smtp: {
    enabled: boolean;
    host: string;
    port: number;
    security: SmtpSecurity;
    username: string;
    replyTo: string;
  };
};

export type MailboxPasswords = {
  /** Nieuw wachtwoord, "" = huidige behouden, null = bewust wissen. */
  imap?: string | null;
  smtp?: string | null;
};

function validateInput(input: MailboxAccountInput): { input: MailboxWriteInput } | { error: string } {
  const name = input.name.trim().slice(0, 80);
  if (!name) return { error: "Geef de mailbox een interne naam." };

  let emailAddress: string;
  try {
    emailAddress = validateEmailAddress(input.emailAddress, "E-mailadres");
  } catch (error) {
    return { error: error instanceof SafeSmtpError ? error.message : "E-mailadres is ongeldig." };
  }

  if (!/^#[0-9a-fA-F]{6}$/.test(input.color)) {
    return { error: "Kies een geldige mailboxkleur." };
  }

  const checkHost = (host: string, label: string): string | null => {
    if (!host.trim()) return null;
    try {
      validateMailHost(host, label);
      return null;
    } catch (error) {
      return error instanceof SafeSmtpError ? error.message : `${label} is ongeldig.`;
    }
  };
  if (input.imap.enabled) {
    if (!input.imap.host.trim()) return { error: "Vul een IMAP-host in of schakel IMAP uit." };
    const hostError = checkHost(input.imap.host, "IMAP-host");
    if (hostError) return { error: hostError };
    if (!input.imap.username.trim()) return { error: "Vul een IMAP-gebruikersnaam in." };
  }
  if (input.smtp.enabled) {
    if (!input.smtp.host.trim()) return { error: "Vul een SMTP-host in of schakel SMTP uit." };
    const hostError = checkHost(input.smtp.host, "SMTP-host");
    if (hostError) return { error: hostError };
  }
  if (input.smtp.replyTo.trim()) {
    try {
      validateEmailAddress(input.smtp.replyTo, "Reply-To");
    } catch (error) {
      return { error: error instanceof SafeSmtpError ? error.message : "Reply-To is ongeldig." };
    }
  }

  const clampPort = (port: number, fallback: number) =>
    Number.isInteger(port) && port >= 1 && port <= 65535 ? port : fallback;

  return {
    input: {
      name,
      emailAddress,
      displayName: input.displayName.trim().slice(0, 120) || name,
      description: input.description.trim().slice(0, 300),
      color: input.color,
      isActive: input.isActive,
      isDefaultManualMailbox: input.isDefaultManualMailbox,
      showInUnifiedInbox: input.showInUnifiedInbox,
      signatureHtml: sanitizeEmailHtml(input.signatureHtml.slice(0, 20_000)),
      templateModeNew: EMAIL_TEMPLATE_MODES.includes(input.templateModeNew)
        ? input.templateModeNew
        : "full",
      templateModeReply: EMAIL_TEMPLATE_MODES.includes(input.templateModeReply)
        ? input.templateModeReply
        : "none",
      imap: {
        enabled: input.imap.enabled,
        host: input.imap.host.trim(),
        port: clampPort(input.imap.port, 993),
        security: input.imap.security === "starttls" ? "starttls" : "ssl",
        username: input.imap.username.trim(),
        initialSyncDays: Math.min(365, Math.max(1, Math.trunc(input.imap.initialSyncDays) || 90)),
        batchSize: Math.min(200, Math.max(10, Math.trunc(input.imap.batchSize) || 100)),
      },
      smtp: {
        enabled: input.smtp.enabled,
        host: input.smtp.host.trim(),
        port: clampPort(input.smtp.port, 587),
        security:
          input.smtp.security === "ssl" || input.smtp.security === "none"
            ? input.smtp.security
            : "starttls",
        username: input.smtp.username.trim(),
        replyTo: input.smtp.replyTo.trim().toLowerCase(),
      },
    },
  };
}

export async function saveMailboxAccountAction(
  input: MailboxAccountInput,
  passwords: MailboxPasswords,
  id?: string,
): Promise<MailboxActionResult<EmailMailboxAdminView>> {
  try {
    await requireAdmin();
    const validated = validateInput(input);
    if ("error" in validated) return { ok: false, message: validated.error };
    const saved = await saveMailbox(
      validated.input,
      {
        imap: passwords.imap === null ? null : passwords.imap || undefined,
        smtp: passwords.smtp === null ? null : passwords.smtp || undefined,
      },
      id,
    );
    return { ok: true, data: redactMailbox(saved) };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

/** Bouwt een tijdelijk mailboxobject voor tests met (nog) niet opgeslagen invoer. */
async function mailboxForTest(
  input: MailboxAccountInput,
  id?: string,
): Promise<EmailMailbox> {
  const stored = id ? await getMailbox(id) : null;
  const validated = validateInput(input);
  if ("error" in validated) throw new SafeSmtpError(validated.error, "INVALID_INPUT");
  const now = new Date().toISOString();
  return {
    id: id ?? "unsaved",
    ...validated.input,
    imap: {
      ...validated.input.imap,
      ...(stored?.imap.encryptedPassword
        ? { encryptedPassword: stored.imap.encryptedPassword }
        : {}),
    },
    smtp: {
      ...validated.input.smtp,
      ...(stored?.smtp.encryptedPassword
        ? { encryptedPassword: stored.smtp.encryptedPassword }
        : {}),
    },
    allowedAdminEmails: stored?.allowedAdminEmails ?? [],
    folderMapping: stored?.folderMapping ?? {},
    folderSyncState: stored?.folderSyncState ?? {},
    syncStatus: stored?.syncStatus ?? "idle",
    messageCount: stored?.messageCount ?? 0,
    unreadCount: stored?.unreadCount ?? 0,
    createdAt: stored?.createdAt ?? now,
    updatedAt: now,
  };
}

export async function testMailboxImapAction(
  input: MailboxAccountInput,
  id?: string,
  plaintextPassword?: string,
): Promise<MailboxActionResult<null>> {
  try {
    await requireAdmin();
    const mailbox = await mailboxForTest(input, id);
    await verifyMailboxImap(mailbox, plaintextPassword || undefined);
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function testMailboxSmtpAction(
  input: MailboxAccountInput,
  id?: string,
  plaintextPassword?: string,
): Promise<MailboxActionResult<null>> {
  try {
    await requireAdmin();
    const mailbox = await mailboxForTest(input, id);
    await verifyMailboxSmtp(mailbox, plaintextPassword || undefined);
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function sendMailboxTestEmailAction(
  id: string,
): Promise<MailboxActionResult<{ recipient: string }>> {
  try {
    const admin = await requireAdmin();
    const mailbox = await getMailbox(id);
    if (!mailbox) return { ok: false, message: "Mailbox niet gevonden." };
    if (!mailbox.smtp.enabled) {
      return { ok: false, message: "SMTP staat uit voor deze mailbox." };
    }
    const recipient = admin.email || mailbox.emailAddress;
    await sendFromMailbox(mailbox, {
      to: [recipient],
      subject: `[TEST] Testmail van mailbox ${mailbox.emailAddress}`,
      html: `<p>Dit is een testmail van het mailboxaccount <strong>${mailbox.emailAddress}</strong> in de VisualVibe e-mailclient.</p>`,
      text: `Dit is een testmail van het mailboxaccount ${mailbox.emailAddress} in de VisualVibe e-mailclient.`,
      messageId: newMailboxMessageId(mailbox),
    });
    return { ok: true, data: { recipient } };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function setDefaultMailboxAction(id: string): Promise<MailboxActionResult<null>> {
  try {
    await requireAdmin();
    const mailbox = await getMailbox(id);
    if (!mailbox) return { ok: false, message: "Mailbox niet gevonden." };
    const all = await listMailboxes();
    for (const other of all) {
      if (other.id !== id && other.isDefaultManualMailbox) {
        await updateMailboxFields(other.id, { isDefaultManualMailbox: false });
      }
    }
    await updateMailboxFields(id, { isDefaultManualMailbox: true });
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function setMailboxActiveAction(
  id: string,
  isActive: boolean,
): Promise<MailboxActionResult<null>> {
  try {
    await requireAdmin();
    await updateMailboxFields(id, { isActive });
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function setMailboxSyncPausedAction(
  id: string,
  paused: boolean,
): Promise<MailboxActionResult<null>> {
  try {
    await requireAdmin();
    const mailbox = await getMailbox(id);
    if (!mailbox) return { ok: false, message: "Mailbox niet gevonden." };
    await updateMailboxFields(id, { syncStatus: paused ? "paused" : "idle" });
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

/**
 * Verwijdert een mailboxaccount. `removeLocalData` bepaalt of ook de lokaal
 * gesynchroniseerde berichten verdwijnen; berichten op de externe mailserver
 * worden hier nooit aangeraakt.
 */
export async function deleteMailboxAccountAction(
  id: string,
  removeLocalData: boolean,
): Promise<MailboxActionResult<{ removedDocuments: number }>> {
  try {
    await requireAdmin();
    const mailbox = await getMailbox(id);
    if (!mailbox) return { ok: false, message: "Mailbox niet gevonden." };
    let removedDocuments = 0;
    if (removeLocalData) {
      removedDocuments = await deleteMailboxData(id);
    }
    await deleteMailboxDoc(id);
    return { ok: true, data: { removedDocuments } };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export type RemoteFolderOverview = {
  folders: Array<{ path: string; name: string; specialUse?: string }>;
  detectedMapping: MailboxFolderMapping;
  currentMapping: MailboxFolderMapping;
};

export async function fetchRemoteFoldersAction(
  id: string,
): Promise<MailboxActionResult<RemoteFolderOverview>> {
  try {
    await requireAdmin();
    const mailbox = await getMailbox(id);
    if (!mailbox) return { ok: false, message: "Mailbox niet gevonden." };
    const folders = await listRemoteFolders(mailbox);
    const detectedMapping = detectFolderMapping(folders, mailbox.folderMapping);
    return {
      ok: true,
      data: {
        folders: folders.map(({ path, name, specialUse }) => ({
          path,
          name,
          ...(specialUse ? { specialUse } : {}),
        })),
        detectedMapping,
        currentMapping: mailbox.folderMapping,
      },
    };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function saveFolderMappingAction(
  id: string,
  mapping: MailboxFolderMapping,
): Promise<MailboxActionResult<null>> {
  try {
    await requireAdmin();
    const mailbox = await getMailbox(id);
    if (!mailbox) return { ok: false, message: "Mailbox niet gevonden." };
    const clean: MailboxFolderMapping = {};
    for (const folder of EMAIL_SYSTEM_FOLDERS) {
      const path = mapping[folder as EmailSystemFolder];
      if (typeof path === "string" && path.trim() && !/[\0\r\n]/.test(path)) {
        clean[folder as EmailSystemFolder] = path.trim().slice(0, 255);
      }
    }
    if (!clean.inbox) clean.inbox = "INBOX";
    await updateMailboxFields(id, { folderMapping: clean });
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}
