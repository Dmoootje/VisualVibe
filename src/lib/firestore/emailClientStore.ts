import "server-only";

import { createHash } from "node:crypto";
import { FieldPath, type DocumentSnapshot, type Query } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { sanitizeMailError } from "@/lib/firestore/mailHistory";
import {
  EMAIL_OUTBOX_STATUSES,
  EMAIL_PROCESSING_STATUSES,
  EMAIL_SYSTEM_FOLDERS,
  normalizeSubject,
  type EmailAddressValue,
  type EmailAttachmentMeta,
  type EmailDraft,
  type EmailDraftKind,
  type EmailLabel,
  type EmailListFilter,
  type EmailListPage,
  type EmailMessage,
  type EmailMessageListItem,
  type EmailOutboxItem,
  type EmailOutboxStatus,
  type EmailProcessingStatus,
  type EmailSystemFolder,
  type EmailThread,
  type EmailThreadNote,
} from "@/types/emailClient";

const MESSAGES = "email_messages";
const THREADS = "email_threads";
const LABELS = "email_labels";
const DRAFTS = "email_drafts";
const OUTBOX = "email_outbox";
const NOTES = "email_thread_notes";

/** Bovengrens voor de server-side zoekscan (recente berichten). */
const SEARCH_SCAN_LIMIT = 800;
const SCAN_CHUNK = 120;

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function num(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function addressValue(value: unknown): EmailAddressValue {
  const data = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const name = str(data.name);
  return { ...(name ? { name } : {}), address: str(data.address).toLowerCase() };
}

function addressArray(value: unknown): EmailAddressValue[] {
  return Array.isArray(value) ? value.map(addressValue).filter((item) => item.address) : [];
}

function attachmentsArray(value: unknown): EmailAttachmentMeta[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item, index) => ({
      index: num(item.index, index),
      filename: str(item.filename, `bijlage-${index + 1}`),
      contentType: str(item.contentType, "application/octet-stream"),
      size: num(item.size, 0),
      ...(str(item.checksum) ? { checksum: str(item.checksum) } : {}),
      ...(str(item.storagePath) ? { storagePath: str(item.storagePath) } : {}),
    }));
}

function isSystemFolder(value: unknown): value is EmailSystemFolder {
  return typeof value === "string" && EMAIL_SYSTEM_FOLDERS.includes(value as EmailSystemFolder);
}

export function toEmailMessage(doc: DocumentSnapshot): EmailMessage {
  const data = doc.data() ?? {};
  const now = new Date().toISOString();
  return {
    id: doc.id,
    mailboxId: str(data.mailboxId),
    threadId: str(data.threadId),
    folder: isSystemFolder(data.folder) ? data.folder : "inbox",
    ...(str(data.remoteFolderPath) ? { remoteFolderPath: str(data.remoteFolderPath) } : {}),
    ...(typeof data.remoteUid === "number" ? { remoteUid: data.remoteUid } : {}),
    ...(str(data.uidValidity) ? { uidValidity: str(data.uidValidity) } : {}),
    ...(str(data.messageId) ? { messageId: str(data.messageId) } : {}),
    ...(str(data.inReplyTo) ? { inReplyTo: str(data.inReplyTo) } : {}),
    references: stringArray(data.references),
    direction: data.direction === "outbound" ? "outbound" : "inbound",
    subject: str(data.subject),
    from: addressValue(data.from),
    to: addressArray(data.to),
    cc: addressArray(data.cc),
    bcc: addressArray(data.bcc),
    ...(str(data.replyToAddress) ? { replyToAddress: str(data.replyToAddress) } : {}),
    fromAddress: str(data.fromAddress),
    participants: stringArray(data.participants),
    snippet: str(data.snippet),
    ...(str(data.htmlBody) ? { htmlBody: str(data.htmlBody) } : {}),
    ...(str(data.textBody) ? { textBody: str(data.textBody) } : {}),
    ...(data.bodyTruncated === true ? { bodyTruncated: true } : {}),
    hasAttachments: bool(data.hasAttachments, false),
    attachments: attachmentsArray(data.attachments),
    isRead: bool(data.isRead, false),
    isStarred: bool(data.isStarred, false),
    ...(data.isAnswered === true ? { isAnswered: true } : {}),
    labelIds: stringArray(data.labelIds),
    ...(typeof data.sizeBytes === "number" ? { sizeBytes: data.sizeBytes } : {}),
    dateKey: str(data.dateKey, now),
    ...(str(data.receivedAt) ? { receivedAt: str(data.receivedAt) } : {}),
    ...(str(data.sentAt) ? { sentAt: str(data.sentAt) } : {}),
    syncStatus:
      data.syncStatus === "pending-flags" || data.syncStatus === "deleted-remotely"
        ? data.syncStatus
        : "synced",
    ...(str(data.contactLeadId) ? { contactLeadId: str(data.contactLeadId) } : {}),
    createdAt: str(data.createdAt, now),
    updatedAt: str(data.updatedAt, now),
  };
}

function toListItem(message: EmailMessage): EmailMessageListItem {
  const { htmlBody: _html, textBody: _text, ...rest } = message;
  return rest;
}

function toThread(doc: DocumentSnapshot): EmailThread {
  const data = doc.data() ?? {};
  const now = new Date().toISOString();
  return {
    id: doc.id,
    mailboxId: str(data.mailboxId),
    subject: str(data.subject),
    normalizedSubject: str(data.normalizedSubject),
    messageCount: num(data.messageCount, 0),
    unreadCount: num(data.unreadCount, 0),
    participants: stringArray(data.participants),
    latestMessageAt: str(data.latestMessageAt, now),
    latestSnippet: str(data.latestSnippet),
    ...(EMAIL_PROCESSING_STATUSES.includes(data.processingStatus as EmailProcessingStatus)
      ? { processingStatus: data.processingStatus as EmailProcessingStatus }
      : {}),
    createdAt: str(data.createdAt, now),
    updatedAt: str(data.updatedAt, now),
  };
}

function toLabel(doc: DocumentSnapshot): EmailLabel {
  const data = doc.data() ?? {};
  const now = new Date().toISOString();
  return {
    id: doc.id,
    name: str(data.name, "Label"),
    color: str(data.color, "#FF7A00"),
    hidden: bool(data.hidden, false),
    sortOrder: num(data.sortOrder, 0),
    createdAt: str(data.createdAt, now),
    updatedAt: str(data.updatedAt, now),
  };
}

function toDraft(doc: DocumentSnapshot): EmailDraft {
  const data = doc.data() ?? {};
  const now = new Date().toISOString();
  const kind: EmailDraftKind =
    data.kind === "reply" || data.kind === "reply-all" || data.kind === "forward"
      ? data.kind
      : "new";
  return {
    id: doc.id,
    mailboxId: str(data.mailboxId),
    kind,
    ...(str(data.relatedMessageId) ? { relatedMessageId: str(data.relatedMessageId) } : {}),
    ...(str(data.threadId) ? { threadId: str(data.threadId) } : {}),
    to: addressArray(data.to),
    cc: addressArray(data.cc),
    bcc: addressArray(data.bcc),
    subject: str(data.subject),
    htmlBody: str(data.htmlBody),
    templateMode:
      data.templateMode === "footer" || data.templateMode === "none" ? data.templateMode : "full",
    includeQuote: bool(data.includeQuote, true),
    attachments: attachmentsArray(data.attachments),
    createdAt: str(data.createdAt, now),
    updatedAt: str(data.updatedAt, now),
    lastSavedAt: str(data.lastSavedAt, now),
  };
}

function toOutboxItem(doc: DocumentSnapshot): EmailOutboxItem {
  const data = doc.data() ?? {};
  const now = new Date().toISOString();
  const kind: EmailDraftKind =
    data.kind === "reply" || data.kind === "reply-all" || data.kind === "forward"
      ? data.kind
      : "new";
  return {
    id: doc.id,
    mailboxId: str(data.mailboxId),
    ...(str(data.draftId) ? { draftId: str(data.draftId) } : {}),
    kind,
    ...(str(data.relatedMessageId) ? { relatedMessageId: str(data.relatedMessageId) } : {}),
    ...(str(data.threadId) ? { threadId: str(data.threadId) } : {}),
    to: addressArray(data.to),
    cc: addressArray(data.cc),
    bcc: addressArray(data.bcc),
    subject: str(data.subject),
    renderedHtml: str(data.renderedHtml),
    renderedText: str(data.renderedText),
    editorHtml: str(data.editorHtml),
    templateMode:
      data.templateMode === "footer" || data.templateMode === "none" ? data.templateMode : "full",
    includeQuote: bool(data.includeQuote, true),
    ...(str(data.inReplyTo) ? { inReplyTo: str(data.inReplyTo) } : {}),
    references: stringArray(data.references),
    attachments: attachmentsArray(data.attachments),
    status: EMAIL_OUTBOX_STATUSES.includes(data.status as EmailOutboxStatus)
      ? (data.status as EmailOutboxStatus)
      : "queued",
    attemptCount: num(data.attemptCount, 0),
    ...(str(data.lastAttemptAt) ? { lastAttemptAt: str(data.lastAttemptAt) } : {}),
    ...(str(data.lastError) ? { lastError: str(data.lastError) } : {}),
    ...(str(data.sentMessageId) ? { sentMessageId: str(data.sentMessageId) } : {}),
    createdBy: str(data.createdBy, "admin"),
    createdAt: str(data.createdAt, now),
    updatedAt: str(data.updatedAt, now),
  };
}

function toNote(doc: DocumentSnapshot): EmailThreadNote {
  const data = doc.data() ?? {};
  const now = new Date().toISOString();
  return {
    id: doc.id,
    threadId: str(data.threadId),
    mailboxId: str(data.mailboxId),
    note: str(data.note),
    createdBy: str(data.createdBy, "admin"),
    createdAt: str(data.createdAt, now),
    updatedAt: str(data.updatedAt, now),
  };
}

/**
 * Stabiel document-id per logisch bericht: op Message-ID wanneer die bestaat
 * (dedupet Sent-append en servermoves), anders op map+UIDVALIDITY+UID.
 */
export function messageDocId(mailboxId: string, identity: string): string {
  return `em_${createHash("sha256").update(`${mailboxId} ${identity}`).digest("hex").slice(0, 44)}`;
}

export function newThreadId(): string {
  return adminDb.collection(THREADS).doc().id;
}

/**
 * Bepaalt de thread voor een bericht binnen EEN mailbox: eerst via
 * In-Reply-To/References, daarna via genormaliseerd onderwerp + overlappende
 * deelnemers. Gesprekken uit verschillende mailboxen worden nooit samengevoegd.
 */
export async function resolveThreadId(input: {
  mailboxId: string;
  inReplyTo?: string;
  references: string[];
  normalizedSubject: string;
  participants: string[];
}): Promise<string | null> {
  const refs = [...new Set([input.inReplyTo, ...input.references].filter((v): v is string => Boolean(v)))]
    .slice(-10);
  if (refs.length > 0) {
    const snapshot = await adminDb
      .collection(MESSAGES)
      .where("mailboxId", "==", input.mailboxId)
      .where("messageId", "in", refs)
      .limit(1)
      .get();
    if (!snapshot.empty) return str(snapshot.docs[0].data().threadId) || null;
  }

  if (!input.normalizedSubject) return null;
  const threads = await adminDb
    .collection(THREADS)
    .where("mailboxId", "==", input.mailboxId)
    .where("normalizedSubject", "==", input.normalizedSubject)
    .limit(5)
    .get();
  for (const doc of threads.docs) {
    const thread = toThread(doc);
    if (thread.participants.some((address) => input.participants.includes(address))) {
      return thread.id;
    }
  }
  return null;
}

export type UpsertMessageInput = Omit<EmailMessage, "id" | "createdAt" | "updatedAt">;

export type UpsertMessageResult = {
  id: string;
  created: boolean;
};

/**
 * Slaat een gesynchroniseerd of verzonden bericht idempotent op. Bestaat het
 * bericht al, dan worden alleen serverstatusvelden (map, flags, uid) bijgewerkt
 * zodat lokale labels en contactkoppelingen behouden blijven.
 */
export async function upsertMessage(input: UpsertMessageInput): Promise<UpsertMessageResult> {
  const identity = input.messageId
    ? input.messageId
    : `${input.remoteFolderPath ?? input.folder}:${input.uidValidity ?? "0"}:${input.remoteUid ?? 0}`;
  const id = messageDocId(input.mailboxId, identity);
  const ref = adminDb.collection(MESSAGES).doc(id);
  const now = new Date().toISOString();

  const created = await adminDb.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    if (doc.exists) {
      transaction.update(ref, {
        folder: input.folder,
        ...(input.remoteFolderPath ? { remoteFolderPath: input.remoteFolderPath } : {}),
        ...(typeof input.remoteUid === "number" ? { remoteUid: input.remoteUid } : {}),
        ...(input.uidValidity ? { uidValidity: input.uidValidity } : {}),
        isRead: input.isRead,
        isStarred: input.isStarred,
        ...(input.isAnswered ? { isAnswered: true } : {}),
        syncStatus: "synced",
        updatedAt: now,
      });
      return false;
    }
    transaction.create(ref, {
      mailboxId: input.mailboxId,
      threadId: input.threadId,
      folder: input.folder,
      ...(input.remoteFolderPath ? { remoteFolderPath: input.remoteFolderPath } : {}),
      ...(typeof input.remoteUid === "number" ? { remoteUid: input.remoteUid } : {}),
      ...(input.uidValidity ? { uidValidity: input.uidValidity } : {}),
      ...(input.messageId ? { messageId: input.messageId } : {}),
      ...(input.inReplyTo ? { inReplyTo: input.inReplyTo } : {}),
      references: input.references,
      direction: input.direction,
      subject: input.subject,
      from: input.from,
      to: input.to,
      cc: input.cc,
      bcc: input.bcc,
      ...(input.replyToAddress ? { replyToAddress: input.replyToAddress } : {}),
      fromAddress: input.fromAddress,
      participants: input.participants,
      snippet: input.snippet,
      ...(input.htmlBody ? { htmlBody: input.htmlBody } : {}),
      ...(input.textBody ? { textBody: input.textBody } : {}),
      ...(input.bodyTruncated ? { bodyTruncated: true } : {}),
      hasAttachments: input.hasAttachments,
      attachments: input.attachments,
      isRead: input.isRead,
      isStarred: input.isStarred,
      ...(input.isAnswered ? { isAnswered: true } : {}),
      labelIds: input.labelIds,
      ...(typeof input.sizeBytes === "number" ? { sizeBytes: input.sizeBytes } : {}),
      dateKey: input.dateKey,
      ...(input.receivedAt ? { receivedAt: input.receivedAt } : {}),
      ...(input.sentAt ? { sentAt: input.sentAt } : {}),
      syncStatus: input.syncStatus,
      ...(input.contactLeadId ? { contactLeadId: input.contactLeadId } : {}),
      createdAt: now,
      updatedAt: now,
    });
    return true;
  });

  return { id, created };
}

/** Herbouwt de aggregaten van een thread (aantallen, laatste bericht). */
export async function refreshThread(
  threadId: string,
  seed?: {
    mailboxId: string;
    subject: string;
    normalizedSubject: string;
    participants: string[];
  },
): Promise<void> {
  const snapshot = await adminDb
    .collection(MESSAGES)
    .where("threadId", "==", threadId)
    .orderBy("dateKey", "desc")
    .limit(60)
    .get();
  const ref = adminDb.collection(THREADS).doc(threadId);
  if (snapshot.empty) {
    if (!seed) await ref.delete().catch(() => undefined);
    return;
  }

  const messages = snapshot.docs.map(toEmailMessage);
  const latest = messages[0];
  const participants = [...new Set(messages.flatMap((message) => message.participants))].slice(0, 40);
  const unreadCount = messages.filter((message) => !message.isRead && message.folder !== "trash").length;
  const now = new Date().toISOString();
  const existing = await ref.get();

  const data = {
    mailboxId: seed?.mailboxId ?? latest.mailboxId,
    subject: existing.exists ? str(existing.data()?.subject, latest.subject) : (seed?.subject ?? latest.subject),
    normalizedSubject:
      seed?.normalizedSubject ?? normalizeSubject(latest.subject) ?? "",
    messageCount: messages.length,
    unreadCount,
    participants,
    latestMessageAt: latest.dateKey,
    latestSnippet: latest.snippet,
    ...(existing.exists && str(existing.data()?.processingStatus)
      ? { processingStatus: str(existing.data()?.processingStatus) }
      : {}),
    createdAt: existing.exists ? str(existing.data()?.createdAt, now) : now,
    updatedAt: now,
  };
  await ref.set(data);
}

export async function getMessage(id: string): Promise<EmailMessage | null> {
  if (!id) return null;
  const doc = await adminDb.collection(MESSAGES).doc(id).get();
  return doc.exists ? toEmailMessage(doc) : null;
}

export async function getThread(id: string): Promise<EmailThread | null> {
  if (!id) return null;
  const doc = await adminDb.collection(THREADS).doc(id).get();
  return doc.exists ? toThread(doc) : null;
}

export async function getThreadMessages(threadId: string): Promise<EmailMessage[]> {
  const snapshot = await adminDb
    .collection(MESSAGES)
    .where("threadId", "==", threadId)
    .orderBy("dateKey", "asc")
    .limit(100)
    .get();
  return snapshot.docs.map(toEmailMessage);
}

export async function findMessageByMessageId(
  mailboxId: string,
  messageId: string,
): Promise<EmailMessage | null> {
  if (!messageId) return null;
  const snapshot = await adminDb
    .collection(MESSAGES)
    .where("mailboxId", "==", mailboxId)
    .where("messageId", "==", messageId)
    .limit(1)
    .get();
  return snapshot.empty ? null : toEmailMessage(snapshot.docs[0]);
}

export async function updateMessageFields(
  id: string,
  fields: Partial<
    Pick<
      EmailMessage,
      | "isRead"
      | "isStarred"
      | "isAnswered"
      | "labelIds"
      | "folder"
      | "remoteFolderPath"
      | "remoteUid"
      | "uidValidity"
      | "syncStatus"
      | "contactLeadId"
    >
  >,
): Promise<void> {
  const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) patch[key] = value;
  }
  await adminDb.collection(MESSAGES).doc(id).update(patch);
}

export async function deleteMessageDoc(id: string): Promise<void> {
  await adminDb.collection(MESSAGES).doc(id).delete();
}

type ScanFilterContext = {
  filter: EmailListFilter;
  unifiedMailboxIds: string[] | null;
  labels: Map<string, EmailLabel>;
  query: string;
};

function matchesFilter(message: EmailMessage, context: ScanFilterContext): boolean {
  const { filter, unifiedMailboxIds, query } = context;
  if (filter.mailboxId && message.mailboxId !== filter.mailboxId) return false;
  if (!filter.mailboxId && unifiedMailboxIds && !unifiedMailboxIds.includes(message.mailboxId)) {
    return false;
  }
  if (filter.view === "label" && filter.labelId && !message.labelIds.includes(filter.labelId)) {
    return false;
  }
  if (filter.unreadOnly && message.isRead) return false;
  if (filter.readOnly && !message.isRead) return false;
  if (filter.starredOnly && !message.isStarred) return false;
  if (filter.withAttachments && !message.hasAttachments) return false;
  if (filter.withoutAttachments && message.hasAttachments) return false;
  if (filter.unansweredOnly && (message.isAnswered || message.direction === "outbound")) {
    return false;
  }
  if (filter.dateFrom && message.dateKey < filter.dateFrom) return false;
  if (filter.dateTo && message.dateKey > `${filter.dateTo}￿`) return false;

  if (query) {
    const haystack = [
      message.subject,
      message.snippet,
      message.fromAddress,
      message.from.name ?? "",
      ...message.participants,
      ...message.attachments.map((attachment) => attachment.filename),
    ]
      .join("\n")
      .toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

function baseListQuery(filter: EmailListFilter): Query {
  const collection = adminDb.collection(MESSAGES);
  let query: Query;
  switch (filter.view) {
    case "starred":
      query = filter.mailboxId
        ? collection.where("mailboxId", "==", filter.mailboxId).where("isStarred", "==", true)
        : collection.where("isStarred", "==", true);
      break;
    case "all":
      query = filter.mailboxId
        ? collection
            .where("mailboxId", "==", filter.mailboxId)
            .where("folder", "in", ["inbox", "sent", "archive"])
        : collection.where("folder", "in", ["inbox", "sent", "archive"]);
      break;
    case "label":
      query = collection.where("labelIds", "array-contains", filter.labelId ?? "__none__");
      break;
    case "inbox":
    case "sent":
    case "spam":
    case "trash":
    case "archive":
      query = filter.mailboxId
        ? collection.where("mailboxId", "==", filter.mailboxId).where("folder", "==", filter.view)
        : collection.where("folder", "==", filter.view);
      break;
    default:
      query = collection.where("folder", "==", "inbox");
  }
  return query.orderBy("dateKey", "desc").orderBy(FieldPath.documentId(), "desc");
}

/**
 * Berichtenlijst met server-side paginering. Eenvoudige weergaven gebruiken
 * een directe indexquery; tekstzoeken en secundaire filters scannen server-side
 * een begrensd recent venster zodat de client nooit hele mailboxen laadt.
 */
export async function listMessages(
  filter: EmailListFilter,
  options: {
    cursor?: { dateKey: string; id: string } | null;
    pageSize?: number;
    /** Mailboxen zichtbaar in "Alle postvakken" (null = geen beperking). */
    unifiedMailboxIds?: string[] | null;
  } = {},
): Promise<EmailListPage> {
  const pageSize = Math.min(100, Math.max(10, options.pageSize ?? 50));
  const query = (filter.query ?? "").trim().toLowerCase();
  const needsScan = Boolean(
    query ||
      filter.unreadOnly ||
      filter.readOnly ||
      filter.starredOnly ||
      filter.withAttachments ||
      filter.withoutAttachments ||
      filter.unansweredOnly ||
      filter.dateFrom ||
      filter.dateTo ||
      (filter.view === "label" && filter.mailboxId) ||
      (!filter.mailboxId && options.unifiedMailboxIds),
  );

  const context: ScanFilterContext = {
    filter,
    unifiedMailboxIds: options.unifiedMailboxIds ?? null,
    labels: new Map(),
    query,
  };

  let base = baseListQuery(filter);
  if (options.cursor) {
    base = base.startAfter(options.cursor.dateKey, options.cursor.id);
  }

  const items: EmailMessageListItem[] = [];
  let lastDoc: DocumentSnapshot | null = null;
  let scanned = 0;
  let exhausted = false;

  if (!needsScan) {
    const snapshot = await base.limit(pageSize + 1).get();
    const docs = snapshot.docs.slice(0, pageSize);
    for (const doc of docs) items.push(toListItem(toEmailMessage(doc)));
    lastDoc = docs.length > 0 ? docs[docs.length - 1] : null;
    exhausted = snapshot.docs.length <= pageSize;
  } else {
    let cursorQuery = base;
    while (items.length < pageSize && scanned < SEARCH_SCAN_LIMIT) {
      const snapshot = await cursorQuery.limit(SCAN_CHUNK).get();
      if (snapshot.empty) {
        exhausted = true;
        break;
      }
      for (const doc of snapshot.docs) {
        scanned += 1;
        lastDoc = doc;
        const message = toEmailMessage(doc);
        if (matchesFilter(message, context)) {
          items.push(toListItem(message));
          if (items.length >= pageSize) break;
        }
      }
      if (snapshot.docs.length < SCAN_CHUNK) {
        exhausted = items.length < pageSize;
        break;
      }
      cursorQuery = base.startAfter(lastDoc);
    }
  }

  // Threadtellingen voor de zichtbare pagina ophalen (max 1 getAll).
  const threadIds = [...new Set(items.map((item) => item.threadId).filter(Boolean))];
  if (threadIds.length > 0) {
    const refs = threadIds.map((id) => adminDb.collection(THREADS).doc(id));
    const docs = await adminDb.getAll(...refs);
    const counts = new Map<string, number>();
    for (const doc of docs) {
      if (doc.exists) counts.set(doc.id, num(doc.data()?.messageCount, 1));
    }
    for (const item of items) {
      const count = counts.get(item.threadId);
      if (count && count > 1) item.threadMessageCount = count;
    }
  }

  const nextCursor =
    !exhausted && lastDoc
      ? { dateKey: str(lastDoc.data()?.dateKey, ""), id: lastDoc.id }
      : null;

  return {
    items,
    nextCursor,
    ...(needsScan && query && scanned >= SEARCH_SCAN_LIMIT ? { searchWindowLimited: true } : {}),
  };
}

export async function countUnread(mailboxId?: string): Promise<number> {
  let query: Query = adminDb
    .collection(MESSAGES)
    .where("folder", "==", "inbox")
    .where("isRead", "==", false);
  if (mailboxId) query = query.where("mailboxId", "==", mailboxId);
  const result = await query.count().get();
  return result.data().count;
}

export async function countFolder(folder: EmailSystemFolder, mailboxId?: string): Promise<number> {
  let query: Query = adminDb.collection(MESSAGES).where("folder", "==", folder);
  if (mailboxId) query = query.where("mailboxId", "==", mailboxId);
  const result = await query.count().get();
  return result.data().count;
}

export async function countMailboxMessages(mailboxId: string): Promise<number> {
  const result = await adminDb
    .collection(MESSAGES)
    .where("mailboxId", "==", mailboxId)
    .count()
    .get();
  return result.data().count;
}

// ---------------------------------------------------------------------------
// Labels

export async function listLabels(): Promise<EmailLabel[]> {
  const snapshot = await adminDb.collection(LABELS).orderBy("sortOrder", "asc").get();
  return snapshot.docs.map(toLabel);
}

export async function createLabel(input: {
  name: string;
  color: string;
}): Promise<EmailLabel> {
  const now = new Date().toISOString();
  const existing = await adminDb.collection(LABELS).orderBy("sortOrder", "desc").limit(1).get();
  const sortOrder = existing.empty ? 1 : num(existing.docs[0].data().sortOrder, 0) + 1;
  const ref = await adminDb.collection(LABELS).add({
    name: input.name,
    color: input.color,
    hidden: false,
    sortOrder,
    createdAt: now,
    updatedAt: now,
  });
  const doc = await ref.get();
  return toLabel(doc);
}

export async function updateLabel(
  id: string,
  fields: Partial<Pick<EmailLabel, "name" | "color" | "hidden" | "sortOrder">>,
): Promise<void> {
  const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) patch[key] = value;
  }
  await adminDb.collection(LABELS).doc(id).update(patch);
}

/** Verwijdert een label en haalt het in batches van alle berichten af. */
export async function deleteLabel(id: string): Promise<void> {
  for (;;) {
    const snapshot = await adminDb
      .collection(MESSAGES)
      .where("labelIds", "array-contains", id)
      .limit(300)
      .get();
    if (snapshot.empty) break;
    const batch = adminDb.batch();
    for (const doc of snapshot.docs) {
      const labelIds = stringArray(doc.data().labelIds).filter((labelId) => labelId !== id);
      batch.update(doc.ref, { labelIds, updatedAt: new Date().toISOString() });
    }
    await batch.commit();
    if (snapshot.docs.length < 300) break;
  }
  await adminDb.collection(LABELS).doc(id).delete();
}

// ---------------------------------------------------------------------------
// Concepten

export async function listDrafts(mailboxId?: string): Promise<EmailDraft[]> {
  const snapshot = await adminDb.collection(DRAFTS).orderBy("updatedAt", "desc").limit(200).get();
  const drafts = snapshot.docs.map(toDraft);
  return mailboxId ? drafts.filter((draft) => draft.mailboxId === mailboxId) : drafts;
}

export async function getDraft(id: string): Promise<EmailDraft | null> {
  if (!id) return null;
  const doc = await adminDb.collection(DRAFTS).doc(id).get();
  return doc.exists ? toDraft(doc) : null;
}

export async function saveDraftDoc(
  input: Omit<EmailDraft, "id" | "createdAt" | "updatedAt" | "lastSavedAt">,
  id?: string,
): Promise<EmailDraft> {
  const now = new Date().toISOString();
  const ref = id ? adminDb.collection(DRAFTS).doc(id) : adminDb.collection(DRAFTS).doc();
  const existing = id ? await ref.get() : null;
  await ref.set({
    mailboxId: input.mailboxId,
    kind: input.kind,
    ...(input.relatedMessageId ? { relatedMessageId: input.relatedMessageId } : {}),
    ...(input.threadId ? { threadId: input.threadId } : {}),
    to: input.to,
    cc: input.cc,
    bcc: input.bcc,
    subject: input.subject,
    htmlBody: input.htmlBody,
    templateMode: input.templateMode,
    includeQuote: input.includeQuote,
    attachments: input.attachments,
    createdAt: existing?.exists ? str(existing.data()?.createdAt, now) : now,
    updatedAt: now,
    lastSavedAt: now,
  });
  const doc = await ref.get();
  return toDraft(doc);
}

export async function deleteDraftDoc(id: string): Promise<void> {
  await adminDb.collection(DRAFTS).doc(id).delete();
}

export async function countDrafts(): Promise<number> {
  const result = await adminDb.collection(DRAFTS).count().get();
  return result.data().count;
}

// ---------------------------------------------------------------------------
// Outbox

export async function listOutbox(): Promise<EmailOutboxItem[]> {
  const snapshot = await adminDb.collection(OUTBOX).orderBy("createdAt", "desc").limit(200).get();
  return snapshot.docs.map(toOutboxItem);
}

export async function getOutboxItem(id: string): Promise<EmailOutboxItem | null> {
  if (!id) return null;
  const doc = await adminDb.collection(OUTBOX).doc(id).get();
  return doc.exists ? toOutboxItem(doc) : null;
}

export async function createOutboxItem(
  input: Omit<
    EmailOutboxItem,
    "id" | "status" | "attemptCount" | "createdAt" | "updatedAt" | "lastAttemptAt" | "lastError" | "sentMessageId"
  >,
): Promise<EmailOutboxItem> {
  const now = new Date().toISOString();
  const ref = await adminDb.collection(OUTBOX).add({
    mailboxId: input.mailboxId,
    ...(input.draftId ? { draftId: input.draftId } : {}),
    kind: input.kind,
    ...(input.relatedMessageId ? { relatedMessageId: input.relatedMessageId } : {}),
    ...(input.threadId ? { threadId: input.threadId } : {}),
    to: input.to,
    cc: input.cc,
    bcc: input.bcc,
    subject: input.subject,
    renderedHtml: input.renderedHtml,
    renderedText: input.renderedText,
    editorHtml: input.editorHtml,
    templateMode: input.templateMode,
    includeQuote: input.includeQuote,
    ...(input.inReplyTo ? { inReplyTo: input.inReplyTo } : {}),
    references: input.references,
    attachments: input.attachments,
    status: "queued",
    attemptCount: 0,
    createdBy: input.createdBy,
    createdAt: now,
    updatedAt: now,
  });
  const doc = await ref.get();
  return toOutboxItem(doc);
}

/** Claimt een outbox-item atomair voor verzending (queued/failed -> sending). */
export async function claimOutboxItem(id: string): Promise<EmailOutboxItem | null> {
  const ref = adminDb.collection(OUTBOX).doc(id);
  return adminDb.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    if (!doc.exists) return null;
    const item = toOutboxItem(doc);
    if (item.status !== "queued" && item.status !== "failed") return null;
    const now = new Date().toISOString();
    transaction.update(ref, {
      status: "sending",
      attemptCount: item.attemptCount + 1,
      lastAttemptAt: now,
      updatedAt: now,
    });
    return { ...item, status: "sending" as const, attemptCount: item.attemptCount + 1 };
  });
}

export async function finishOutboxItem(
  id: string,
  result:
    | { status: "sent"; sentMessageId: string }
    | { status: "failed"; error: unknown }
    | { status: "queued" }
    | { status: "cancelled" },
): Promise<void> {
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { status: result.status, updatedAt: now };
  if (result.status === "sent") {
    patch.sentMessageId = result.sentMessageId;
    patch.lastError = null;
  } else if (result.status === "failed") {
    patch.lastError = sanitizeMailError(result.error) ?? "Onbekende verzendfout.";
  } else if (result.status === "queued") {
    patch.lastError = null;
  }
  await adminDb.collection(OUTBOX).doc(id).update(patch);
}

export async function deleteOutboxItem(id: string): Promise<void> {
  await adminDb.collection(OUTBOX).doc(id).delete();
}

export async function countPendingOutbox(): Promise<number> {
  const result = await adminDb
    .collection(OUTBOX)
    .where("status", "in", ["queued", "sending", "failed"])
    .count()
    .get();
  return result.data().count;
}

// ---------------------------------------------------------------------------
// Interne notities en verwerkingsstatus

export async function listThreadNotes(threadId: string): Promise<EmailThreadNote[]> {
  const snapshot = await adminDb
    .collection(NOTES)
    .where("threadId", "==", threadId)
    .orderBy("createdAt", "asc")
    .limit(50)
    .get();
  return snapshot.docs.map(toNote);
}

export async function createThreadNote(input: {
  threadId: string;
  mailboxId: string;
  note: string;
  createdBy: string;
}): Promise<EmailThreadNote> {
  const now = new Date().toISOString();
  const ref = await adminDb.collection(NOTES).add({
    threadId: input.threadId,
    mailboxId: input.mailboxId,
    note: input.note,
    createdBy: input.createdBy,
    createdAt: now,
    updatedAt: now,
  });
  return toNote(await ref.get());
}

export async function deleteThreadNote(id: string): Promise<EmailThreadNote | null> {
  const ref = adminDb.collection(NOTES).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const note = toNote(doc);
  await ref.delete();
  return note;
}

export async function setThreadProcessingStatus(
  threadId: string,
  status: EmailProcessingStatus,
): Promise<void> {
  await adminDb
    .collection(THREADS)
    .doc(threadId)
    .update({ processingStatus: status, updatedAt: new Date().toISOString() });
}

// ---------------------------------------------------------------------------
// Mailboxdata verwijderen (bij het verwijderen van een account)

async function deleteWhere(collection: string, field: string, value: string): Promise<number> {
  let deleted = 0;
  for (;;) {
    const snapshot = await adminDb
      .collection(collection)
      .where(field, "==", value)
      .limit(300)
      .get();
    if (snapshot.empty) break;
    const batch = adminDb.batch();
    for (const doc of snapshot.docs) batch.delete(doc.ref);
    await batch.commit();
    deleted += snapshot.docs.length;
    if (snapshot.docs.length < 300) break;
  }
  return deleted;
}

/** Verwijdert alle lokale gegevens van een mailbox (nooit iets op de mailserver). */
export async function deleteMailboxData(mailboxId: string): Promise<number> {
  let total = 0;
  total += await deleteWhere(MESSAGES, "mailboxId", mailboxId);
  total += await deleteWhere(THREADS, "mailboxId", mailboxId);
  total += await deleteWhere(DRAFTS, "mailboxId", mailboxId);
  total += await deleteWhere(OUTBOX, "mailboxId", mailboxId);
  total += await deleteWhere(NOTES, "mailboxId", mailboxId);
  return total;
}
