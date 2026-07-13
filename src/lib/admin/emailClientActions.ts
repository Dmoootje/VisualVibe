"use server";

// Server actions van de in-app e-mailclient. Elke actie controleert de
// adminsessie en de mailboxrechten server-side; versleutelde wachtwoorden
// verlaten de server nooit.

import { getCurrentAdmin, type CurrentAdmin } from "@/lib/auth/session";
import { adminStorageBucket } from "@/lib/firebase/admin";
import { getEmailSettings } from "@/lib/firestore/emailSettings";
import { createLead, getLeadById } from "@/lib/firestore/leads";
import {
  getMailbox,
  listMailboxes,
  migrateLegacyMailboxIfNeeded,
  redactMailbox,
} from "@/lib/firestore/emailMailboxes";
import {
  claimOutboxItem,
  countDrafts,
  countFolder,
  countPendingOutbox,
  countUnread,
  createLabel,
  createOutboxItem,
  createThreadNote,
  deleteDraftDoc,
  deleteLabel,
  deleteMessageDoc,
  deleteOutboxItem,
  deleteThreadNote,
  finishOutboxItem,
  getDraft,
  getMessage,
  getOutboxItem,
  getThread,
  getThreadMessages,
  listDrafts,
  listLabels,
  listMessages,
  listOutbox,
  listThreadNotes,
  newThreadId,
  refreshThread,
  resolveThreadId,
  saveDraftDoc,
  setThreadProcessingStatus,
  updateLabel,
  updateMessageFields,
  upsertMessage,
} from "@/lib/firestore/emailClientStore";
import {
  SafeMailboxImapError,
  appendToSentFolder,
  deleteRemoteMessages,
  downloadRemoteAttachment,
  moveRemoteMessages,
  setRemoteFlags,
  syncMailboxAccount,
  withImapClient,
} from "@/lib/email/mailboxImap";
import {
  buildRawMimeMessage,
  newMailboxMessageId,
  sendFromMailbox,
  type MailboxOutgoingMessage,
} from "@/lib/email/mailboxSmtp";
import {
  buildForwardQuoteHtml,
  buildReplyQuoteHtml,
  renderComposedEmail,
} from "@/lib/email/composeRender";
import { emailHtmlToText, makeSnippet, sanitizeEmailHtml } from "@/lib/email/sanitizeEmailHtml";
import { SafeSmtpError, validateEmailAddress } from "@/lib/email/smtp";
import { adminDb } from "@/lib/firebase/admin";
import {
  normalizeEmailAddress,
  normalizeSubject,
  type EmailAddressValue,
  type EmailDraft,
  type EmailDraftKind,
  type EmailLabel,
  type EmailListFilter,
  type EmailListPage,
  type EmailMailbox,
  type EmailMessage,
  type EmailOutboxItem,
  type EmailProcessingStatus,
  type EmailSidebarCounts,
  type EmailSystemFolder,
  type EmailTemplateMode,
  type EmailThread,
  type EmailThreadNote,
  type MailboxConnectionState,
  type MailboxSummary,
} from "@/types/emailClient";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; message: string };

const MAX_BULK = 200;
const MAX_EDITOR_HTML = 200_000;
const MAX_TOTAL_ATTACHMENT_BYTES = 25 * 1024 * 1024;
const OUTGOING_ATTACHMENT_PREFIX = "email-client/outgoing/";

async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}

function canAccessMailbox(mailbox: EmailMailbox, admin: CurrentAdmin): boolean {
  if (mailbox.allowedAdminEmails.length === 0) return true;
  return mailbox.allowedAdminEmails
    .map((email) => email.toLowerCase())
    .includes(admin.email.toLowerCase());
}

async function requireMailboxAccess(
  mailboxId: string,
  admin: CurrentAdmin,
): Promise<EmailMailbox> {
  const mailbox = await getMailbox(mailboxId);
  if (!mailbox || !canAccessMailbox(mailbox, admin)) {
    throw new Error("MAILBOX_FORBIDDEN");
  }
  return mailbox;
}

async function accessibleMailboxes(admin: CurrentAdmin): Promise<EmailMailbox[]> {
  const mailboxes = await listMailboxes();
  return mailboxes.filter((mailbox) => canAccessMailbox(mailbox, admin));
}

function friendlyError(error: unknown): string {
  if (error instanceof SafeMailboxImapError || error instanceof SafeSmtpError) {
    return error.message;
  }
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") return "Je sessie is verlopen. Meld je opnieuw aan.";
    if (error.message === "MAILBOX_FORBIDDEN") {
      return "Je hebt geen toegang tot deze mailbox.";
    }
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

// ---------------------------------------------------------------------------
// Bootstrap en lijsten

export type EmailClientBootstrap = {
  mailboxes: MailboxSummary[];
  labels: EmailLabel[];
  counts: EmailSidebarCounts;
  adminEmail: string;
};

export async function getEmailClientBootstrapAction(): Promise<ActionResult<EmailClientBootstrap>> {
  try {
    const admin = await requireAdmin();
    await migrateLegacyMailboxIfNeeded();
    const [mailboxes, labels] = await Promise.all([accessibleMailboxes(admin), listLabels()]);

    const perMailboxInboxUnread: Record<string, number> = {};
    await Promise.all(
      mailboxes.map(async (mailbox) => {
        perMailboxInboxUnread[mailbox.id] = await countUnread(mailbox.id);
      }),
    );
    const [drafts, outboxPending, spam] = await Promise.all([
      countDrafts(),
      countPendingOutbox(),
      countFolder("spam"),
    ]);
    const inboxUnread = Object.values(perMailboxInboxUnread).reduce((sum, value) => sum + value, 0);

    return {
      ok: true,
      data: {
        mailboxes: mailboxes.map((mailbox) => ({
          mailbox: redactMailbox(mailbox),
          inboxUnread: perMailboxInboxUnread[mailbox.id] ?? 0,
          connection: connectionState(mailbox),
        })),
        labels,
        counts: { inboxUnread, drafts, outboxPending, spam, perMailboxInboxUnread },
        adminEmail: admin.email,
      },
    };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function getSidebarCountsAction(): Promise<ActionResult<EmailSidebarCounts>> {
  try {
    const admin = await requireAdmin();
    const mailboxes = await accessibleMailboxes(admin);
    const perMailboxInboxUnread: Record<string, number> = {};
    await Promise.all(
      mailboxes.map(async (mailbox) => {
        perMailboxInboxUnread[mailbox.id] = await countUnread(mailbox.id);
      }),
    );
    const [drafts, outboxPending, spam] = await Promise.all([
      countDrafts(),
      countPendingOutbox(),
      countFolder("spam"),
    ]);
    const inboxUnread = Object.values(perMailboxInboxUnread).reduce((sum, value) => sum + value, 0);
    return {
      ok: true,
      data: { inboxUnread, drafts, outboxPending, spam, perMailboxInboxUnread },
    };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function fetchEmailListAction(
  filter: EmailListFilter,
  cursor: { dateKey: string; id: string } | null,
): Promise<ActionResult<EmailListPage>> {
  try {
    const admin = await requireAdmin();
    const mailboxes = await accessibleMailboxes(admin);
    if (filter.mailboxId && !mailboxes.some((mailbox) => mailbox.id === filter.mailboxId)) {
      throw new Error("MAILBOX_FORBIDDEN");
    }
    const unifiedMailboxIds = filter.mailboxId
      ? null
      : mailboxes
          .filter((mailbox) => mailbox.showInUnifiedInbox && mailbox.isActive)
          .map((mailbox) => mailbox.id);
    const page = await listMessages(filter, { cursor, unifiedMailboxIds });
    return { ok: true, data: page };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

// ---------------------------------------------------------------------------
// Detail en thread

export type ContactPanelData = {
  leadId: string;
  leadNumber: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  previousThreads: Array<{ id: string; subject: string; latestMessageAt: string }>;
} | null;

export type ThreadDetail = {
  thread: EmailThread | null;
  messages: EmailMessage[];
  notes: EmailThreadNote[];
  contact: ContactPanelData;
};

async function buildContactPanel(
  messages: EmailMessage[],
  admin: CurrentAdmin,
): Promise<ContactPanelData> {
  const inbound = [...messages].reverse().find((message) => message.direction === "inbound");
  if (!inbound) return null;
  const address = inbound.fromAddress;
  if (!address) return null;

  let leadId = inbound.contactLeadId;
  if (!leadId) {
    const snapshot = await adminDb.collection("leads").where("email", "==", address).limit(1).get();
    leadId = snapshot.empty ? undefined : snapshot.docs[0].id;
  }
  if (!leadId) return null;
  const lead = await getLeadById(leadId);
  if (!lead) return null;

  const threadsSnapshot = await adminDb
    .collection("email_threads")
    .where("participants", "array-contains", address)
    .limit(6)
    .get();
  const previousThreads = threadsSnapshot.docs
    .filter((doc) => doc.id !== inbound.threadId)
    .map((doc) => ({
      id: doc.id,
      subject: String(doc.data().subject ?? "(zonder onderwerp)"),
      latestMessageAt: String(doc.data().latestMessageAt ?? ""),
    }))
    .sort((a, b) => b.latestMessageAt.localeCompare(a.latestMessageAt))
    .slice(0, 5);

  void admin;
  return {
    leadId: lead.id,
    leadNumber: lead.leadNumber,
    name: lead.name,
    email: lead.email,
    ...(lead.phone ? { phone: lead.phone } : {}),
    ...(lead.company ? { company: lead.company } : {}),
    status: lead.status,
    previousThreads,
  };
}

export async function fetchThreadDetailAction(
  threadId: string,
): Promise<ActionResult<ThreadDetail>> {
  try {
    const admin = await requireAdmin();
    const messages = await getThreadMessages(threadId);
    if (messages.length === 0) {
      return { ok: true, data: { thread: null, messages: [], notes: [], contact: null } };
    }
    await requireMailboxAccess(messages[0].mailboxId, admin);
    const [thread, notes, contact] = await Promise.all([
      getThread(threadId),
      listThreadNotes(threadId),
      buildContactPanel(messages, admin),
    ]);
    return { ok: true, data: { thread, messages, notes, contact } };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

/** Eén bericht ophalen (bv. reply-context van een heropend concept). */
export async function fetchMessageAction(
  messageId: string,
): Promise<ActionResult<EmailMessage | null>> {
  try {
    const admin = await requireAdmin();
    const message = await getMessage(messageId);
    if (!message) return { ok: true, data: null };
    await requireMailboxAccess(message.mailboxId, admin);
    return { ok: true, data: message };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

/** Berichtbron (headers + body) voor administrators, rechtstreeks van de server. */
export async function fetchMessageSourceAction(
  messageId: string,
): Promise<ActionResult<{ source: string; truncated: boolean }>> {
  try {
    const admin = await requireAdmin();
    const message = await getMessage(messageId);
    if (!message) return { ok: false, message: "Bericht niet gevonden." };
    const mailbox = await requireMailboxAccess(message.mailboxId, admin);
    if (!message.remoteFolderPath || typeof message.remoteUid !== "number") {
      return { ok: false, message: "Voor dit bericht is geen serverbron beschikbaar." };
    }
    const source = await withImapClient(mailbox, async (client) => {
      const lock = await client.getMailboxLock(message.remoteFolderPath as string, { readOnly: true });
      try {
        const fetched = await client.fetchOne(
          String(message.remoteUid),
          { uid: true, source: { start: 0, maxLength: 512 * 1024 } },
          { uid: true },
        );
        return fetched && fetched.source ? fetched.source.toString("utf8") : null;
      } finally {
        lock.release();
      }
    });
    if (!source) return { ok: false, message: "Het bericht bestaat niet meer op de server." };
    return {
      ok: true,
      data: { source, truncated: (message.sizeBytes ?? 0) > 512 * 1024 },
    };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

// ---------------------------------------------------------------------------
// Vlaggen, labels en verplaatsen

async function loadOwnedMessages(
  ids: string[],
  admin: CurrentAdmin,
): Promise<{ messages: EmailMessage[]; mailboxes: Map<string, EmailMailbox> }> {
  const unique = [...new Set(ids)].slice(0, MAX_BULK);
  const messages: EmailMessage[] = [];
  for (const id of unique) {
    const message = await getMessage(id);
    if (message) messages.push(message);
  }
  const mailboxes = new Map<string, EmailMailbox>();
  for (const mailboxId of new Set(messages.map((message) => message.mailboxId))) {
    mailboxes.set(mailboxId, await requireMailboxAccess(mailboxId, admin));
  }
  return { messages, mailboxes };
}

/** Best effort: IMAP-flagwijziging per mailbox; lokale status blijft leidend. */
async function pushFlagsToImap(
  messages: EmailMessage[],
  mailboxes: Map<string, EmailMailbox>,
  changes: { seen?: boolean; flagged?: boolean },
): Promise<void> {
  for (const [mailboxId, mailbox] of mailboxes) {
    if (!mailbox.imap.enabled) continue;
    const remote = messages.filter(
      (message) =>
        message.mailboxId === mailboxId &&
        message.remoteFolderPath &&
        typeof message.remoteUid === "number",
    );
    if (remote.length === 0) continue;
    try {
      await setRemoteFlags(mailbox, remote, changes);
    } catch {
      for (const message of remote) {
        await updateMessageFields(message.id, { syncStatus: "pending-flags" }).catch(() => undefined);
      }
    }
  }
}

export async function setMessagesReadAction(
  ids: string[],
  isRead: boolean,
): Promise<ActionResult<null>> {
  try {
    const admin = await requireAdmin();
    const { messages, mailboxes } = await loadOwnedMessages(ids, admin);
    for (const message of messages) {
      if (message.isRead !== isRead) await updateMessageFields(message.id, { isRead });
    }
    for (const threadId of new Set(messages.map((message) => message.threadId))) {
      await refreshThread(threadId);
    }
    await pushFlagsToImap(messages, mailboxes, { seen: isRead });
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function setMessagesStarredAction(
  ids: string[],
  isStarred: boolean,
): Promise<ActionResult<null>> {
  try {
    const admin = await requireAdmin();
    const { messages, mailboxes } = await loadOwnedMessages(ids, admin);
    for (const message of messages) {
      if (message.isStarred !== isStarred) await updateMessageFields(message.id, { isStarred });
    }
    await pushFlagsToImap(messages, mailboxes, { flagged: isStarred });
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function assignLabelAction(
  ids: string[],
  labelId: string,
  add: boolean,
): Promise<ActionResult<null>> {
  try {
    const admin = await requireAdmin();
    const labels = await listLabels();
    if (!labels.some((label) => label.id === labelId)) {
      return { ok: false, message: "Het label bestaat niet meer." };
    }
    const { messages } = await loadOwnedMessages(ids, admin);
    for (const message of messages) {
      const labelIds = add
        ? [...new Set([...message.labelIds, labelId])]
        : message.labelIds.filter((id) => id !== labelId);
      if (labelIds.length !== message.labelIds.length || add !== message.labelIds.includes(labelId)) {
        await updateMessageFields(message.id, { labelIds });
      }
    }
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

/**
 * Verplaatst berichten (archiveren, spam, prullenbak, terugzetten). De
 * IMAP-move gebeurt eerst; lukt die niet omdat het bericht op de server
 * ontbreekt, dan verhuist het bericht alleen lokaal.
 */
export async function moveMessagesAction(
  ids: string[],
  target: EmailSystemFolder,
): Promise<ActionResult<null>> {
  try {
    const admin = await requireAdmin();
    const { messages, mailboxes } = await loadOwnedMessages(ids, admin);

    for (const [mailboxId, mailbox] of mailboxes) {
      const group = messages.filter((message) => message.mailboxId === mailboxId);
      const remote = group.filter(
        (message) => message.remoteFolderPath && typeof message.remoteUid === "number" && message.syncStatus !== "deleted-remotely",
      );
      let targetPath: string | undefined = mailbox.folderMapping[target];
      if (mailbox.imap.enabled && remote.length > 0) {
        const result = await moveRemoteMessages(mailbox, remote, target);
        targetPath = result.targetPath;
      }
      for (const message of group) {
        await updateMessageFields(message.id, {
          folder: target,
          ...(targetPath ? { remoteFolderPath: targetPath } : {}),
          // De UID in de doelmap is pas bij de volgende sync bekend.
          syncStatus: "pending-flags",
        });
        await adminDb
          .collection("email_messages")
          .doc(message.id)
          .update({ remoteUid: null })
          .catch(() => undefined);
      }
    }
    for (const threadId of new Set(messages.map((message) => message.threadId))) {
      await refreshThread(threadId);
    }
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

/** Definitief verwijderen kan alleen vanuit Spam of Prullenbak. */
export async function deleteMessagesPermanentlyAction(
  ids: string[],
): Promise<ActionResult<null>> {
  try {
    const admin = await requireAdmin();
    const { messages, mailboxes } = await loadOwnedMessages(ids, admin);
    const deletable = messages.filter(
      (message) => message.folder === "trash" || message.folder === "spam",
    );
    if (deletable.length === 0) {
      return { ok: false, message: "Alleen berichten in Spam of Prullenbak kunnen definitief worden verwijderd." };
    }
    for (const [mailboxId, mailbox] of mailboxes) {
      const remote = deletable.filter(
        (message) =>
          message.mailboxId === mailboxId &&
          message.remoteFolderPath &&
          typeof message.remoteUid === "number" &&
          message.syncStatus !== "deleted-remotely",
      );
      if (mailbox.imap.enabled && remote.length > 0) {
        await deleteRemoteMessages(mailbox, remote).catch(() => undefined);
      }
    }
    for (const message of deletable) {
      await deleteMessageDoc(message.id);
    }
    for (const threadId of new Set(deletable.map((message) => message.threadId))) {
      await refreshThread(threadId);
    }
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

// ---------------------------------------------------------------------------
// Labels beheren

export async function createLabelAction(
  name: string,
  color: string,
): Promise<ActionResult<EmailLabel>> {
  try {
    await requireAdmin();
    const clean = name.trim().slice(0, 40);
    if (!clean) return { ok: false, message: "Geef het label een naam." };
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) return { ok: false, message: "Kies een geldige labelkleur." };
    const existing = await listLabels();
    if (existing.some((label) => label.name.toLowerCase() === clean.toLowerCase())) {
      return { ok: false, message: "Er bestaat al een label met deze naam." };
    }
    const label = await createLabel({ name: clean, color });
    return { ok: true, data: label };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function updateLabelAction(
  id: string,
  fields: { name?: string; color?: string; hidden?: boolean },
): Promise<ActionResult<null>> {
  try {
    await requireAdmin();
    const patch: { name?: string; color?: string; hidden?: boolean } = {};
    if (typeof fields.name === "string") {
      const clean = fields.name.trim().slice(0, 40);
      if (!clean) return { ok: false, message: "Geef het label een naam." };
      patch.name = clean;
    }
    if (typeof fields.color === "string") {
      if (!/^#[0-9a-fA-F]{6}$/.test(fields.color)) {
        return { ok: false, message: "Kies een geldige labelkleur." };
      }
      patch.color = fields.color;
    }
    if (typeof fields.hidden === "boolean") patch.hidden = fields.hidden;
    await updateLabel(id, patch);
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function deleteLabelAction(id: string): Promise<ActionResult<null>> {
  try {
    await requireAdmin();
    await deleteLabel(id);
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

// ---------------------------------------------------------------------------
// Concepten

export type DraftInput = {
  id?: string;
  mailboxId: string;
  kind: EmailDraftKind;
  relatedMessageId?: string;
  to: EmailAddressValue[];
  cc: EmailAddressValue[];
  bcc: EmailAddressValue[];
  subject: string;
  htmlBody: string;
  templateMode: EmailTemplateMode;
  includeQuote: boolean;
  attachments: EmailDraft["attachments"];
};

function cleanRecipients(list: EmailAddressValue[], max = 50): EmailAddressValue[] {
  const seen = new Set<string>();
  const result: EmailAddressValue[] = [];
  for (const entry of list.slice(0, max)) {
    const address = normalizeEmailAddress(entry.address ?? "");
    if (!address || seen.has(address)) continue;
    try {
      validateEmailAddress(address);
    } catch {
      continue;
    }
    seen.add(address);
    const name = (entry.name ?? "").replace(/[\r\n\0]/g, " ").trim().slice(0, 120);
    result.push({ ...(name ? { name } : {}), address });
  }
  return result;
}

function cleanDraftInput(input: DraftInput): DraftInput {
  return {
    ...input,
    to: cleanRecipients(input.to),
    cc: cleanRecipients(input.cc),
    bcc: cleanRecipients(input.bcc),
    subject: input.subject.replace(/[\r\n\0]/g, " ").trim().slice(0, 250),
    htmlBody: sanitizeEmailHtml(input.htmlBody.slice(0, MAX_EDITOR_HTML)),
    // Uploads moeten binnen het uploadpad blijven; bijlagen zonder storagePath
    // zijn verwijzingen naar het originele bericht (doorsturen) en worden pas
    // bij verzending van de IMAP-server gehaald.
    attachments: input.attachments
      .filter(
        (attachment) =>
          !attachment.storagePath || attachment.storagePath.startsWith(OUTGOING_ATTACHMENT_PREFIX),
      )
      .slice(0, 15),
  };
}

export async function saveDraftAction(input: DraftInput): Promise<ActionResult<EmailDraft>> {
  try {
    const admin = await requireAdmin();
    await requireMailboxAccess(input.mailboxId, admin);
    const clean = cleanDraftInput(input);
    const related = clean.relatedMessageId ? await getMessage(clean.relatedMessageId) : null;
    const draft = await saveDraftDoc(
      {
        mailboxId: clean.mailboxId,
        kind: clean.kind,
        ...(clean.relatedMessageId ? { relatedMessageId: clean.relatedMessageId } : {}),
        ...(related?.threadId ? { threadId: related.threadId } : {}),
        to: clean.to,
        cc: clean.cc,
        bcc: clean.bcc,
        subject: clean.subject,
        htmlBody: clean.htmlBody,
        templateMode: clean.templateMode,
        includeQuote: clean.includeQuote,
        attachments: clean.attachments,
      },
      input.id,
    );
    return { ok: true, data: draft };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function listDraftsAction(): Promise<ActionResult<EmailDraft[]>> {
  try {
    const admin = await requireAdmin();
    const mailboxes = await accessibleMailboxes(admin);
    const allowed = new Set(mailboxes.map((mailbox) => mailbox.id));
    const drafts = await listDrafts();
    return { ok: true, data: drafts.filter((draft) => allowed.has(draft.mailboxId)) };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function getDraftAction(id: string): Promise<ActionResult<EmailDraft | null>> {
  try {
    const admin = await requireAdmin();
    const draft = await getDraft(id);
    if (draft) await requireMailboxAccess(draft.mailboxId, admin);
    return { ok: true, data: draft };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function deleteDraftAction(id: string): Promise<ActionResult<null>> {
  try {
    const admin = await requireAdmin();
    const draft = await getDraft(id);
    if (draft) {
      await requireMailboxAccess(draft.mailboxId, admin);
      for (const attachment of draft.attachments) {
        if (attachment.storagePath?.startsWith(OUTGOING_ATTACHMENT_PREFIX)) {
          await adminStorageBucket.file(attachment.storagePath).delete({ ignoreNotFound: true });
        }
      }
      await deleteDraftDoc(id);
    }
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

// ---------------------------------------------------------------------------
// Verzenden en outbox

async function loadOutgoingAttachments(
  attachments: EmailDraft["attachments"],
): Promise<Array<{ filename: string; contentType: string; content: Buffer }>> {
  const result: Array<{ filename: string; contentType: string; content: Buffer }> = [];
  let total = 0;
  for (const attachment of attachments) {
    if (!attachment.storagePath?.startsWith(OUTGOING_ATTACHMENT_PREFIX)) continue;
    const [content] = await adminStorageBucket.file(attachment.storagePath).download();
    total += content.length;
    if (total > MAX_TOTAL_ATTACHMENT_BYTES) {
      throw new SafeSmtpError("De bijlagen zijn samen groter dan 25 MB.", "ATTACHMENTS_TOO_LARGE");
    }
    result.push({
      filename: attachment.filename,
      contentType: attachment.contentType,
      content,
    });
  }
  return result;
}

/** Slaat het verzonden bericht lokaal op en koppelt het aan de juiste thread. */
async function storeSentMessage(
  mailbox: EmailMailbox,
  item: EmailOutboxItem,
  messageId: string,
  sentPath: string | undefined,
): Promise<void> {
  const now = new Date().toISOString();
  const normalizedSubject = normalizeSubject(item.subject);
  const participants = [
    ...new Set([
      normalizeEmailAddress(mailbox.emailAddress),
      ...item.to.map((entry) => entry.address),
      ...item.cc.map((entry) => entry.address),
    ]),
  ].slice(0, 30);
  const threadId =
    item.threadId ||
    (await resolveThreadId({
      mailboxId: mailbox.id,
      ...(item.inReplyTo ? { inReplyTo: item.inReplyTo } : {}),
      references: item.references,
      normalizedSubject,
      participants,
    })) ||
    newThreadId();

  const text = item.renderedText || emailHtmlToText(item.renderedHtml);
  await upsertMessage({
    mailboxId: mailbox.id,
    threadId,
    folder: "sent",
    ...(sentPath ? { remoteFolderPath: sentPath } : {}),
    messageId,
    ...(item.inReplyTo ? { inReplyTo: item.inReplyTo } : {}),
    references: item.references,
    direction: "outbound",
    subject: item.subject,
    from: {
      ...(mailbox.displayName ? { name: mailbox.displayName } : {}),
      address: normalizeEmailAddress(mailbox.emailAddress),
    },
    to: item.to,
    cc: item.cc,
    bcc: item.bcc,
    fromAddress: normalizeEmailAddress(mailbox.emailAddress),
    participants,
    snippet: makeSnippet(text),
    htmlBody: sanitizeEmailHtml(item.renderedHtml),
    textBody: text.slice(0, 100_000),
    hasAttachments: item.attachments.length > 0,
    attachments: item.attachments.map(({ storagePath: _omit, ...meta }) => meta),
    isRead: true,
    isStarred: false,
    labelIds: [],
    dateKey: now,
    sentAt: now,
    syncStatus: sentPath ? "pending-flags" : "synced",
  });
  await refreshThread(threadId, {
    mailboxId: mailbox.id,
    subject: item.subject,
    normalizedSubject,
    participants,
  });
}

/** Voert de daadwerkelijke verzending van een geclaimd outbox-item uit. */
async function processOutboxItem(itemId: string): Promise<ActionResult<{ status: string }>> {
  const claimed = await claimOutboxItem(itemId);
  if (!claimed) {
    return { ok: false, message: "Dit bericht wordt al verzonden of is al verwerkt." };
  }
  const mailbox = await getMailbox(claimed.mailboxId);
  if (!mailbox || !mailbox.smtp.enabled || !mailbox.isActive) {
    await finishOutboxItem(itemId, {
      status: "failed",
      error: "De SMTP-verbinding van deze mailbox is niet beschikbaar.",
    });
    return { ok: false, message: "De SMTP-verbinding van deze mailbox is niet beschikbaar." };
  }

  try {
    const attachments = await loadOutgoingAttachments(claimed.attachments);

    // Doorgestuurde originele bijlagen: on demand van de IMAP-server halen.
    const forwarded = claimed.attachments.filter((attachment) => !attachment.storagePath);
    if (forwarded.length > 0 && claimed.relatedMessageId) {
      const related = await getMessage(claimed.relatedMessageId);
      if (related) {
        const relatedMailbox =
          related.mailboxId === mailbox.id ? mailbox : await getMailbox(related.mailboxId);
        if (relatedMailbox?.imap.enabled) {
          for (const meta of forwarded) {
            const downloaded = await downloadRemoteAttachment(relatedMailbox, related, meta.index);
            if (downloaded) {
              attachments.push({
                filename: downloaded.filename,
                contentType: downloaded.contentType,
                content: downloaded.content,
              });
            }
          }
        }
      }
    }

    const messageId = newMailboxMessageId(mailbox);
    const outgoing: MailboxOutgoingMessage = {
      to: claimed.to.map((entry) => entry.address),
      cc: claimed.cc.map((entry) => entry.address),
      bcc: claimed.bcc.map((entry) => entry.address),
      subject: claimed.subject,
      html: claimed.renderedHtml,
      text: claimed.renderedText,
      messageId,
      ...(claimed.inReplyTo ? { inReplyTo: claimed.inReplyTo } : {}),
      ...(claimed.references.length ? { references: claimed.references } : {}),
      ...(attachments.length ? { attachments } : {}),
    };

    const result = await sendFromMailbox(mailbox, outgoing);
    const finalMessageId = result.messageId || messageId;

    // Kopie in de Verzonden-map van de server (best effort, geen dubbele
    // verzending bij falen; de volgende sync dedupet op Message-ID).
    let sentPath: string | undefined;
    if (mailbox.imap.enabled) {
      try {
        const raw = await buildRawMimeMessage(mailbox, { ...outgoing, messageId: finalMessageId });
        const appended = await appendToSentFolder(mailbox, raw);
        sentPath = appended?.path;
      } catch {
        sentPath = undefined;
      }
    }

    await storeSentMessage(mailbox, claimed, finalMessageId, sentPath);
    if (claimed.relatedMessageId) {
      await updateMessageFields(claimed.relatedMessageId, { isAnswered: true }).catch(() => undefined);
    }
    await finishOutboxItem(itemId, { status: "sent", sentMessageId: finalMessageId });
    if (claimed.draftId) {
      await deleteDraftDoc(claimed.draftId).catch(() => undefined);
    }
    return { ok: true, data: { status: "sent" } };
  } catch (error) {
    await finishOutboxItem(itemId, { status: "failed", error });
    return {
      ok: false,
      message:
        error instanceof SafeSmtpError || error instanceof SafeMailboxImapError
          ? `Verzenden mislukt: ${error.message}`
          : "Verzenden mislukt. Het bericht staat in de Outbox en kan opnieuw worden geprobeerd.",
    };
  }
}

export type SendEmailInput = DraftInput & {
  draftId?: string;
};

export async function sendEmailAction(
  input: SendEmailInput,
): Promise<ActionResult<{ outboxId: string; status: string }>> {
  try {
    const admin = await requireAdmin();
    const mailbox = await requireMailboxAccess(input.mailboxId, admin);
    if (!mailbox.smtp.enabled || !mailbox.isActive) {
      return {
        ok: false,
        message: "Deze mailbox kan niet verzenden. Controleer de SMTP-instellingen of kies een andere afzender.",
      };
    }
    const clean = cleanDraftInput(input);
    if (clean.to.length === 0) {
      return { ok: false, message: "Vul minstens één geldige ontvanger in." };
    }
    if (!clean.subject) {
      return { ok: false, message: "Vul een onderwerp in." };
    }
    if (!emailHtmlToText(clean.htmlBody).trim()) {
      return { ok: false, message: "Het bericht is leeg." };
    }

    // Threading: antwoorden blijven in dezelfde conversatie via In-Reply-To
    // en References van het originele bericht.
    const related = clean.relatedMessageId ? await getMessage(clean.relatedMessageId) : null;
    if (related && related.mailboxId !== mailbox.id) {
      // Antwoorden vanuit een andere mailbox mag, maar de headers blijven kloppen.
      await requireMailboxAccess(related.mailboxId, admin);
    }
    const inReplyTo = clean.kind !== "forward" ? related?.messageId : undefined;
    const references = related?.messageId
      ? [...new Set([...related.references, related.messageId])].slice(-20)
      : [];

    let quoteHtml = "";
    if (related && clean.includeQuote) {
      quoteHtml = clean.kind === "forward" ? buildForwardQuoteHtml(related) : buildReplyQuoteHtml(related);
    }

    const settings = await getEmailSettings();
    const rendered = renderComposedEmail({
      mailbox,
      settings,
      bodyHtml: clean.htmlBody,
      templateMode: clean.templateMode,
      ...(quoteHtml ? { quoteHtml } : {}),
    });

    const outboxItem = await createOutboxItem({
      mailboxId: mailbox.id,
      ...(input.draftId ? { draftId: input.draftId } : {}),
      kind: clean.kind,
      ...(clean.relatedMessageId ? { relatedMessageId: clean.relatedMessageId } : {}),
      ...(related?.threadId && clean.kind !== "forward" ? { threadId: related.threadId } : {}),
      to: clean.to,
      cc: clean.cc,
      bcc: clean.bcc,
      subject: clean.subject,
      renderedHtml: rendered.html,
      renderedText: rendered.text,
      editorHtml: clean.htmlBody,
      templateMode: clean.templateMode,
      includeQuote: clean.includeQuote,
      ...(inReplyTo ? { inReplyTo } : {}),
      references,
      attachments: clean.attachments,
      createdBy: admin.email,
    });

    const result = await processOutboxItem(outboxItem.id);
    if (!result.ok) {
      return { ok: false, message: result.message };
    }
    return { ok: true, data: { outboxId: outboxItem.id, status: "sent" } };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function listOutboxAction(): Promise<ActionResult<EmailOutboxItem[]>> {
  try {
    const admin = await requireAdmin();
    const mailboxes = await accessibleMailboxes(admin);
    const allowed = new Set(mailboxes.map((mailbox) => mailbox.id));
    const items = await listOutbox();
    return { ok: true, data: items.filter((item) => allowed.has(item.mailboxId)) };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function retryOutboxAction(id: string): Promise<ActionResult<{ status: string }>> {
  try {
    const admin = await requireAdmin();
    const item = await getOutboxItem(id);
    if (!item) return { ok: false, message: "Outbox-item niet gevonden." };
    await requireMailboxAccess(item.mailboxId, admin);
    if (item.status !== "failed") {
      return { ok: false, message: "Alleen mislukte berichten kunnen opnieuw worden geprobeerd." };
    }
    return await processOutboxItem(id);
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function cancelOutboxAction(id: string): Promise<ActionResult<null>> {
  try {
    const admin = await requireAdmin();
    const item = await getOutboxItem(id);
    if (!item) return { ok: false, message: "Outbox-item niet gevonden." };
    await requireMailboxAccess(item.mailboxId, admin);
    if (item.status !== "queued" && item.status !== "failed") {
      return { ok: false, message: "Alleen wachtende of mislukte berichten kunnen worden geannuleerd." };
    }
    await finishOutboxItem(id, { status: "cancelled" });
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function deleteOutboxAction(id: string): Promise<ActionResult<null>> {
  try {
    const admin = await requireAdmin();
    const item = await getOutboxItem(id);
    if (!item) return { ok: true, data: null };
    await requireMailboxAccess(item.mailboxId, admin);
    if (item.status === "sending") {
      return { ok: false, message: "Dit bericht wordt momenteel verzonden en kan niet worden verwijderd." };
    }
    await deleteOutboxItem(id);
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

/** Zet een mislukt/geannuleerd outbox-item terug om in een concept te bewerken. */
export async function outboxToDraftAction(id: string): Promise<ActionResult<EmailDraft>> {
  try {
    const admin = await requireAdmin();
    const item = await getOutboxItem(id);
    if (!item) return { ok: false, message: "Outbox-item niet gevonden." };
    await requireMailboxAccess(item.mailboxId, admin);
    if (item.status !== "failed" && item.status !== "cancelled") {
      return { ok: false, message: "Alleen mislukte of geannuleerde berichten kunnen worden bewerkt." };
    }
    const draft = await saveDraftDoc({
      mailboxId: item.mailboxId,
      kind: item.kind,
      ...(item.relatedMessageId ? { relatedMessageId: item.relatedMessageId } : {}),
      ...(item.threadId ? { threadId: item.threadId } : {}),
      to: item.to,
      cc: item.cc,
      bcc: item.bcc,
      subject: item.subject,
      htmlBody: item.editorHtml,
      templateMode: item.templateMode,
      includeQuote: item.includeQuote,
      attachments: item.attachments,
    });
    await deleteOutboxItem(id);
    return { ok: true, data: draft };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

// ---------------------------------------------------------------------------
// Synchronisatie

export type SyncSummary = {
  mailboxId: string;
  started: boolean;
  imported: number;
  examined: number;
  error?: string;
};

export async function syncMailboxesAction(
  mailboxId?: string,
): Promise<ActionResult<SyncSummary[]>> {
  try {
    const admin = await requireAdmin();
    const mailboxes = mailboxId
      ? [await requireMailboxAccess(mailboxId, admin)]
      : await accessibleMailboxes(admin);
    const targets = mailboxes.filter(
      (mailbox) => mailbox.isActive && mailbox.imap.enabled && mailbox.syncStatus !== "paused",
    );
    if (targets.length === 0) {
      return { ok: false, message: "Er is geen actieve mailbox met ingeschakelde IMAP-synchronisatie." };
    }
    const summaries: SyncSummary[] = [];
    for (const mailbox of targets) {
      try {
        const outcome = await syncMailboxAccount(mailbox);
        summaries.push({
          mailboxId: mailbox.id,
          started: outcome.started,
          imported: outcome.folders.reduce((sum, folder) => sum + folder.imported, 0),
          examined: outcome.folders.reduce((sum, folder) => sum + folder.examined, 0),
          ...(outcome.error ? { error: outcome.error } : {}),
        });
      } catch (error) {
        summaries.push({
          mailboxId: mailbox.id,
          started: false,
          imported: 0,
          examined: 0,
          error: friendlyError(error),
        });
      }
    }
    return { ok: true, data: summaries };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

// ---------------------------------------------------------------------------
// Notities, verwerkingsstatus en contacten

export async function addThreadNoteAction(
  threadId: string,
  note: string,
): Promise<ActionResult<EmailThreadNote>> {
  try {
    const admin = await requireAdmin();
    const thread = await getThread(threadId);
    if (!thread) return { ok: false, message: "Gesprek niet gevonden." };
    await requireMailboxAccess(thread.mailboxId, admin);
    const clean = note.replace(/\0/g, "").trim().slice(0, 4000);
    if (!clean) return { ok: false, message: "De notitie is leeg." };
    const created = await createThreadNote({
      threadId,
      mailboxId: thread.mailboxId,
      note: clean,
      createdBy: admin.email,
    });
    return { ok: true, data: created };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function deleteThreadNoteAction(noteId: string): Promise<ActionResult<null>> {
  try {
    const admin = await requireAdmin();
    const note = await deleteThreadNote(noteId);
    if (note) await requireMailboxAccess(note.mailboxId, admin);
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function setThreadProcessingStatusAction(
  threadId: string,
  status: EmailProcessingStatus,
): Promise<ActionResult<null>> {
  try {
    const admin = await requireAdmin();
    const thread = await getThread(threadId);
    if (!thread) return { ok: false, message: "Gesprek niet gevonden." };
    await requireMailboxAccess(thread.mailboxId, admin);
    await setThreadProcessingStatus(threadId, status);
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

/** Contactsuggesties voor het Aan/CC/BCC-veld (leads + eerdere afzenders). */
export async function searchContactsAction(
  query: string,
): Promise<ActionResult<Array<{ name: string; email: string; company?: string }>>> {
  try {
    await requireAdmin();
    const clean = query.trim().toLowerCase();
    if (clean.length < 2) return { ok: true, data: [] };

    const results = new Map<string, { name: string; email: string; company?: string }>();
    const leadSnapshot = await adminDb
      .collection("leads")
      .orderBy("email")
      .startAt(clean)
      .endAt(`${clean}\uf8ff`)
      .limit(6)
      .get();
    for (const doc of leadSnapshot.docs) {
      const data = doc.data();
      const email = String(data.email ?? "").toLowerCase();
      if (!email) continue;
      results.set(email, {
        name: String(data.name ?? ""),
        email,
        ...(data.company ? { company: String(data.company) } : {}),
      });
    }

    const messageSnapshot = await adminDb
      .collection("email_messages")
      .orderBy("fromAddress")
      .startAt(clean)
      .endAt(`${clean}\uf8ff`)
      .limit(6)
      .get();
    for (const doc of messageSnapshot.docs) {
      const data = doc.data();
      const email = String(data.fromAddress ?? "").toLowerCase();
      if (!email || results.has(email)) continue;
      const from = data.from as { name?: string } | undefined;
      results.set(email, { name: String(from?.name ?? ""), email });
    }

    return { ok: true, data: [...results.values()].slice(0, 8) };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

/** Maakt een lead/contact aan op basis van de afzender van een bericht. */
export async function createContactFromMessageAction(
  messageId: string,
): Promise<ActionResult<{ leadId: string; created: boolean }>> {
  try {
    const admin = await requireAdmin();
    const message = await getMessage(messageId);
    if (!message) return { ok: false, message: "Bericht niet gevonden." };
    await requireMailboxAccess(message.mailboxId, admin);
    const address = message.fromAddress;
    if (!address) return { ok: false, message: "Dit bericht heeft geen bruikbaar afzenderadres." };

    // Bestaat er al een lead met dit adres, koppel die dan zonder duplicaat.
    const existing = await adminDb.collection("leads").where("email", "==", address).limit(1).get();
    if (!existing.empty) {
      await updateMessageFields(message.id, { contactLeadId: existing.docs[0].id });
      return { ok: true, data: { leadId: existing.docs[0].id, created: false } };
    }

    const result = await createLead({
      name: message.from.name || address,
      email: address,
      selectedServices: [],
      formType: "contact",
      locale: "nl",
      idempotencyKey: `email-client-contact:${address}`,
      message: `Contact aangemaakt vanuit de e-mailclient (onderwerp: ${message.subject || "zonder onderwerp"}).`,
      privacyAccepted: false,
    });
    await updateMessageFields(message.id, { contactLeadId: result.lead.id });
    return { ok: true, data: { leadId: result.lead.id, created: result.created } };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}
