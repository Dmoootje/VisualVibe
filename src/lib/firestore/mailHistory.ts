import "server-only";

import { createHash } from "node:crypto";
import type { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type {
  MailDirection,
  MailHistory,
  MailHistoryStatus,
  MailHistoryType,
} from "@/types/email";

const MAIL_HISTORY_COLLECTION = "mail_history";
const MAIL_DISPATCHES_COLLECTION = "mail_dispatches";

export type CreateMailHistoryInput = {
  leadId: string;
  type: MailHistoryType;
  direction?: MailDirection;
  from?: string[];
  to: string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  status?: MailHistoryStatus;
  providerMessageId?: string;
  inReplyTo?: string;
  references?: string[];
  receivedAt?: Date | string;
  imapUid?: number;
  imapMailbox?: string;
  attachmentNames?: string[];
  contentTruncated?: boolean;
  errorCode?: string;
  errorMessage?: string;
  sentAt?: Date | string;
  createdBy: string;
  locale: MailHistory["locale"];
  idempotencyKey?: string;
};

export type UpdateMailHistoryInput = Partial<
  Pick<
    MailHistory,
    | "to"
    | "from"
    | "direction"
    | "cc"
    | "bcc"
    | "replyTo"
    | "subject"
    | "htmlBody"
    | "textBody"
    | "providerMessageId"
    | "inReplyTo"
    | "references"
    | "receivedAt"
    | "imapUid"
    | "imapMailbox"
    | "attachmentNames"
    | "contentTruncated"
    | "errorCode"
    | "errorMessage"
    | "createdBy"
    | "locale"
  >
>;

export type MailStatusTransitionOptions = {
  providerMessageId?: string;
  errorCode?: string;
  errorMessage?: string;
  sentAt?: Date | string;
};

export type AutomaticMailHistoryType = Extract<
  MailHistoryType,
  | "customer_confirmation"
  | "admin_notification"
  | "automated_reply"
  | "analysis_verification"
  | "analysis_report"
  | "analysis_admin_notification"
>;

export type MailDispatchStatus = "queued" | "sent" | "failed";

export type MailDispatch = {
  id: string;
  leadId: string;
  type: AutomaticMailHistoryType;
  mailHistoryId: string;
  status: MailDispatchStatus;
  attemptCount: number;
  createdAt: string;
  updatedAt: string;
  lastClaimedAt: string;
};

export type MailDispatchClaim = {
  claimed: boolean;
  dispatchId: string;
  mailHistoryId: string;
  status: MailDispatchStatus;
};

const STATUS_TRANSITIONS: Record<MailHistoryStatus, readonly MailHistoryStatus[]> = {
  draft: ["queued"],
  queued: ["sent", "failed"],
  sent: [],
  failed: ["queued"],
  received: [],
};

function toIso(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value) {
    const toDate = (value as { toDate?: unknown }).toDate;
    if (typeof toDate === "function") {
      const date = toDate.call(value) as unknown;
      if (date instanceof Date) return date.toISOString();
    }
  }
  return undefined;
}

function toDate(value: Date | string | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function cleanAddresses(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/**
 * Removes credential-shaped fragments before an SMTP/provider error is stored.
 * Callers should still pass concise error codes rather than raw configuration.
 */
export function sanitizeMailError(value: unknown): string | undefined {
  const raw = value instanceof Error ? value.message : typeof value === "string" ? value : "";
  if (!raw) return undefined;

  return raw
    .replace(/:\/\/([^:/\s]+):([^@\s]+)@/g, "://$1:[REDACTED]@")
    .replace(
      /\b(password|passwd|pass|token|secret|authorization|credential|api[-_ ]?key)\b\s*[:=]\s*[^\s,;]+/gi,
      "$1=[REDACTED]",
    )
    .slice(0, 2_000);
}

function toMailHistory(doc: QueryDocumentSnapshot | DocumentSnapshot): MailHistory {
  const data = doc.data();
  if (!data) throw new Error("Mail history document heeft geen gegevens.");

  return {
    id: doc.id,
    leadId: String(data.leadId ?? ""),
    type: data.type as MailHistoryType,
    direction: data.direction === "inbound" || data.type === "incoming_reply" ? "inbound" : "outbound",
    from: cleanAddresses(data.from),
    to: cleanAddresses(data.to),
    cc: cleanAddresses(data.cc),
    bcc: cleanAddresses(data.bcc),
    replyTo: optionalString(data.replyTo),
    subject: String(data.subject ?? ""),
    htmlBody: String(data.htmlBody ?? ""),
    textBody: String(data.textBody ?? ""),
    status: data.status as MailHistoryStatus,
    providerMessageId: optionalString(data.providerMessageId),
    inReplyTo: optionalString(data.inReplyTo),
    references: cleanAddresses(data.references),
    receivedAt: toIso(data.receivedAt),
    imapUid: typeof data.imapUid === "number" ? data.imapUid : undefined,
    imapMailbox: optionalString(data.imapMailbox),
    attachmentNames: cleanAddresses(data.attachmentNames),
    contentTruncated: data.contentTruncated === true ? true : undefined,
    errorCode: optionalString(data.errorCode),
    errorMessage: optionalString(data.errorMessage),
    createdAt: toIso(data.createdAt) ?? new Date().toISOString(),
    sentAt: toIso(data.sentAt),
    createdBy: String(data.createdBy ?? "system"),
    locale: data.locale as MailHistory["locale"],
    idempotencyKey: optionalString(data.idempotencyKey),
  };
}

function toMailDispatch(doc: DocumentSnapshot): MailDispatch {
  const data = doc.data();
  if (!data) throw new Error("Mail dispatch document heeft geen gegevens.");

  const createdAt = toIso(data.createdAt) ?? new Date().toISOString();
  return {
    id: doc.id,
    leadId: String(data.leadId ?? ""),
    type: data.type as AutomaticMailHistoryType,
    mailHistoryId: String(data.mailHistoryId ?? ""),
    status: data.status as MailDispatchStatus,
    attemptCount: typeof data.attemptCount === "number" ? data.attemptCount : 1,
    createdAt,
    updatedAt: toIso(data.updatedAt) ?? createdAt,
    lastClaimedAt: toIso(data.lastClaimedAt) ?? createdAt,
  };
}

const AUTO_MAIL_HISTORY_PREFIX = "auto_";

/**
 * Deterministic dispatch id. Without a dedupe key exactly one automatic mail
 * per lead+type is allowed (legacy behaviour); with a dedupe key each distinct
 * logical message (e.g. every analysis verification code) gets its own claim.
 */
function automaticDispatchId(
  leadId: string,
  type: AutomaticMailHistoryType,
  dedupeKey?: string,
): string {
  const scope = dedupeKey
    ? `${leadId}\u0000${type}\u0000${dedupeKey}`
    : `${leadId}\u0000${type}`;
  return createHash("sha256").update(scope).digest("hex").slice(0, 48);
}

function isAutomaticMailType(type: MailHistoryType): type is AutomaticMailHistoryType {
  return (
    type === "customer_confirmation" ||
    type === "admin_notification" ||
    type === "automated_reply" ||
    type === "analysis_verification" ||
    type === "analysis_report" ||
    type === "analysis_admin_notification"
  );
}

function createStoredMail(input: CreateMailHistoryInput, now: Date) {
  const status = input.status ?? "draft";
  const sentAt = status === "sent" ? toDate(input.sentAt) ?? now : null;

  return {
    leadId: input.leadId,
    type: input.type,
    direction: input.direction ?? (input.type === "incoming_reply" ? "inbound" : "outbound"),
    from: cleanAddresses(input.from),
    to: cleanAddresses(input.to),
    cc: cleanAddresses(input.cc),
    bcc: cleanAddresses(input.bcc),
    replyTo: input.replyTo?.trim() || null,
    subject: input.subject,
    htmlBody: input.htmlBody,
    textBody: input.textBody,
    status,
    providerMessageId: input.providerMessageId?.trim() || null,
    inReplyTo: input.inReplyTo?.trim() || null,
    references: cleanAddresses(input.references),
    receivedAt: toDate(input.receivedAt) ?? null,
    imapUid: Number.isInteger(input.imapUid) ? input.imapUid : null,
    imapMailbox: input.imapMailbox?.trim() || null,
    attachmentNames: cleanAddresses(input.attachmentNames),
    contentTruncated: input.contentTruncated === true,
    errorCode: sanitizeMailError(input.errorCode) ?? null,
    errorMessage: sanitizeMailError(input.errorMessage) ?? null,
    createdAt: now,
    sentAt,
    createdBy: input.createdBy,
    locale: input.locale,
    idempotencyKey: input.idempotencyKey?.trim() || null,
  };
}

export async function createMailHistory(input: CreateMailHistoryInput): Promise<string> {
  const ref = input.idempotencyKey
    ? adminDb
        .collection(MAIL_HISTORY_COLLECTION)
        .doc(
          `idem_${createHash("sha256")
            .update(`${input.leadId}\u0000${input.type}\u0000${input.idempotencyKey}`)
            .digest("hex")
            .slice(0, 48)}`,
        )
    : adminDb.collection(MAIL_HISTORY_COLLECTION).doc();

  if (input.idempotencyKey) {
    await adminDb.runTransaction(async (transaction) => {
      const existing = await transaction.get(ref);
      if (!existing.exists) {
        transaction.create(ref, createStoredMail(input, new Date()));
      }
    });
    return ref.id;
  }

  await ref.create(createStoredMail(input, new Date()));
  return ref.id;
}

/**
 * Creates an idempotent history record and tells importers whether this call
 * performed the write. A stable idempotency key is required.
 */
export async function createMailHistoryIfAbsent(
  input: CreateMailHistoryInput & { idempotencyKey: string },
): Promise<{ id: string; created: boolean }> {
  const ref = adminDb
    .collection(MAIL_HISTORY_COLLECTION)
    .doc(
      `idem_${createHash("sha256")
        .update(`${input.leadId}\u0000${input.type}\u0000${input.idempotencyKey}`)
        .digest("hex")
        .slice(0, 48)}`,
    );

  const created = await adminDb.runTransaction(async (transaction) => {
    const existing = await transaction.get(ref);
    if (existing.exists) return false;
    transaction.create(ref, createStoredMail(input, new Date()));
    return true;
  });

  return { id: ref.id, created };
}

export async function getMailHistoryById(id: string): Promise<MailHistory | null> {
  const doc = await adminDb.collection(MAIL_HISTORY_COLLECTION).doc(id).get();
  return doc.exists ? toMailHistory(doc) : null;
}

export async function listMailHistoryByLead(leadId: string): Promise<MailHistory[]> {
  const snapshot = await adminDb
    .collection(MAIL_HISTORY_COLLECTION)
    .where("leadId", "==", leadId)
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map(toMailHistory);
}

/** Updates editable content/metadata without bypassing the status state machine. */
export async function updateMailHistory(id: string, input: UpdateMailHistoryInput): Promise<void> {
  const patch: Record<string, unknown> = {};

  if (input.to !== undefined) patch.to = cleanAddresses(input.to);
  if (input.from !== undefined) patch.from = cleanAddresses(input.from);
  if (input.direction !== undefined) patch.direction = input.direction;
  if (input.cc !== undefined) patch.cc = cleanAddresses(input.cc);
  if (input.bcc !== undefined) patch.bcc = cleanAddresses(input.bcc);
  if (input.replyTo !== undefined) patch.replyTo = input.replyTo.trim() || null;
  if (input.subject !== undefined) patch.subject = input.subject;
  if (input.htmlBody !== undefined) patch.htmlBody = input.htmlBody;
  if (input.textBody !== undefined) patch.textBody = input.textBody;
  if (input.providerMessageId !== undefined) {
    patch.providerMessageId = input.providerMessageId.trim() || null;
  }
  if (input.inReplyTo !== undefined) patch.inReplyTo = input.inReplyTo.trim() || null;
  if (input.references !== undefined) patch.references = cleanAddresses(input.references);
  if (input.receivedAt !== undefined) patch.receivedAt = toDate(input.receivedAt);
  if (input.imapUid !== undefined) patch.imapUid = input.imapUid;
  if (input.imapMailbox !== undefined) patch.imapMailbox = input.imapMailbox.trim() || null;
  if (input.attachmentNames !== undefined) patch.attachmentNames = cleanAddresses(input.attachmentNames);
  if (input.contentTruncated !== undefined) patch.contentTruncated = input.contentTruncated;
  if (input.errorCode !== undefined) patch.errorCode = sanitizeMailError(input.errorCode) ?? null;
  if (input.errorMessage !== undefined) {
    patch.errorMessage = sanitizeMailError(input.errorMessage) ?? null;
  }
  if (input.createdBy !== undefined) patch.createdBy = input.createdBy;
  if (input.locale !== undefined) patch.locale = input.locale;

  if (Object.keys(patch).length === 0) return;
  await adminDb.collection(MAIL_HISTORY_COLLECTION).doc(id).update(patch);
}

/**
 * Applies a guarded status transition and keeps the associated automatic
 * dispatch in sync. Sent records are terminal; failed records may be queued
 * again explicitly.
 */
export async function transitionMailHistoryStatus(
  id: string,
  nextStatus: MailHistoryStatus,
  options: MailStatusTransitionOptions = {},
): Promise<MailHistory> {
  const historyRef = adminDb.collection(MAIL_HISTORY_COLLECTION).doc(id);

  return adminDb.runTransaction(async (transaction) => {
    const historyDoc = await transaction.get(historyRef);
    if (!historyDoc.exists) throw new Error("Mail history niet gevonden.");

    const current = toMailHistory(historyDoc);
    if (current.status === nextStatus) return current;
    if (!STATUS_TRANSITIONS[current.status].includes(nextStatus)) {
      throw new Error(`Ongeldige mailstatusovergang: ${current.status} -> ${nextStatus}.`);
    }

    // Claimed automatic history docs are named `auto_<dispatchId>`, so the
    // dispatch is recovered from the document id itself. This also covers
    // dispatches that were claimed with an extra dedupe key.
    const dispatchRef = isAutomaticMailType(current.type)
      ? adminDb
          .collection(MAIL_DISPATCHES_COLLECTION)
          .doc(
            historyDoc.id.startsWith(AUTO_MAIL_HISTORY_PREFIX)
              ? historyDoc.id.slice(AUTO_MAIL_HISTORY_PREFIX.length)
              : automaticDispatchId(current.leadId, current.type),
          )
      : null;
    const dispatchDoc = dispatchRef ? await transaction.get(dispatchRef) : null;
    const now = new Date();
    const patch: Record<string, unknown> = { status: nextStatus };

    if (nextStatus === "queued") {
      patch.providerMessageId = null;
      patch.errorCode = null;
      patch.errorMessage = null;
      patch.sentAt = null;
    } else if (nextStatus === "sent") {
      patch.providerMessageId = options.providerMessageId?.trim() || null;
      patch.errorCode = null;
      patch.errorMessage = null;
      patch.sentAt = toDate(options.sentAt) ?? now;
    } else if (nextStatus === "failed") {
      patch.errorCode = sanitizeMailError(options.errorCode) ?? null;
      patch.errorMessage = sanitizeMailError(options.errorMessage) ?? null;
      patch.sentAt = null;
    }

    transaction.update(historyRef, patch);
    if (dispatchRef && dispatchDoc?.exists) {
      transaction.update(dispatchRef, {
        status: nextStatus as MailDispatchStatus,
        updatedAt: now,
      });
    }

    return {
      ...current,
      status: nextStatus,
      providerMessageId:
        nextStatus === "sent" ? options.providerMessageId?.trim() || undefined : undefined,
      errorCode: nextStatus === "failed" ? sanitizeMailError(options.errorCode) : undefined,
      errorMessage: nextStatus === "failed" ? sanitizeMailError(options.errorMessage) : undefined,
      sentAt:
        nextStatus === "sent" ? (toDate(options.sentAt) ?? now).toISOString() : undefined,
    };
  });
}

export async function queueMailHistory(id: string): Promise<MailHistory> {
  return transitionMailHistoryStatus(id, "queued");
}

export async function markMailHistorySent(
  id: string,
  providerMessageId?: string,
  sentAt?: Date | string,
): Promise<MailHistory> {
  return transitionMailHistoryStatus(id, "sent", { providerMessageId, sentAt });
}

export async function markMailHistoryFailed(
  id: string,
  error?: unknown,
  errorCode?: string,
): Promise<MailHistory> {
  return transitionMailHistoryStatus(id, "failed", {
    errorCode,
    errorMessage: sanitizeMailError(error),
  });
}

/**
 * Atomically claims one automatic mail per lead+type, or per lead+type+
 * idempotencyKey when the caller provides one. The dispatch document contains
 * only routing/status metadata, never message bodies or SMTP data.
 */
export async function claimAutomaticMailDispatch(
  input: Omit<CreateMailHistoryInput, "type" | "status" | "sentAt"> & {
    type: AutomaticMailHistoryType;
  },
): Promise<MailDispatchClaim> {
  const dedupeKey = input.idempotencyKey?.trim() || undefined;
  const dispatchId = automaticDispatchId(input.leadId, input.type, dedupeKey);
  const dispatchRef = adminDb.collection(MAIL_DISPATCHES_COLLECTION).doc(dispatchId);
  const mailHistoryId = `${AUTO_MAIL_HISTORY_PREFIX}${dispatchId}`;
  const historyRef = adminDb.collection(MAIL_HISTORY_COLLECTION).doc(mailHistoryId);

  return adminDb.runTransaction(async (transaction) => {
    const dispatchDoc = await transaction.get(dispatchRef);
    if (dispatchDoc.exists) {
      const dispatch = toMailDispatch(dispatchDoc);
      return {
        claimed: false,
        dispatchId,
        mailHistoryId: dispatch.mailHistoryId,
        status: dispatch.status,
      };
    }

    // A history document without a dispatch can only result from an interrupted
    // legacy/manual write. Repair the claim conservatively and never send twice.
    const historyDoc = await transaction.get(historyRef);
    if (historyDoc.exists) {
      const history = toMailHistory(historyDoc);
      const status: MailDispatchStatus =
        history.status === "sent" ? "sent" : history.status === "failed" ? "failed" : "queued";
      const now = new Date();
      transaction.set(dispatchRef, {
        leadId: input.leadId,
        type: input.type,
        mailHistoryId,
        status,
        attemptCount: 1,
        createdAt: now,
        updatedAt: now,
        lastClaimedAt: now,
      });
      return { claimed: false, dispatchId, mailHistoryId, status };
    }

    const now = new Date();
    transaction.create(
      historyRef,
      createStoredMail(
        {
          ...input,
          status: "queued",
          type: input.type,
          providerMessageId: undefined,
          errorCode: undefined,
          errorMessage: undefined,
          idempotencyKey: dedupeKey ?? dispatchId,
        },
        now,
      ),
    );
    transaction.create(dispatchRef, {
      leadId: input.leadId,
      type: input.type,
      mailHistoryId,
      status: "queued" satisfies MailDispatchStatus,
      attemptCount: 1,
      createdAt: now,
      updatedAt: now,
      lastClaimedAt: now,
    });

    return { claimed: true, dispatchId, mailHistoryId, status: "queued" };
  });
}

/** Explicitly claims a retry only after the previous automatic attempt failed. */
export async function retryFailedAutomaticMailDispatch(
  leadId: string,
  type: AutomaticMailHistoryType,
): Promise<MailDispatchClaim> {
  const dispatchId = automaticDispatchId(leadId, type);
  const dispatchRef = adminDb.collection(MAIL_DISPATCHES_COLLECTION).doc(dispatchId);

  return adminDb.runTransaction(async (transaction) => {
    const dispatchDoc = await transaction.get(dispatchRef);
    if (!dispatchDoc.exists) throw new Error("Automatische maildispatch niet gevonden.");

    const dispatch = toMailDispatch(dispatchDoc);
    const historyRef = adminDb.collection(MAIL_HISTORY_COLLECTION).doc(dispatch.mailHistoryId);
    const historyDoc = await transaction.get(historyRef);
    if (!historyDoc.exists) throw new Error("Mail history voor dispatch niet gevonden.");

    const history = toMailHistory(historyDoc);
    if (dispatch.status !== "failed" || history.status !== "failed") {
      return {
        claimed: false,
        dispatchId,
        mailHistoryId: dispatch.mailHistoryId,
        status: dispatch.status,
      };
    }

    const now = new Date();
    transaction.update(historyRef, {
      status: "queued" satisfies MailHistoryStatus,
      providerMessageId: null,
      errorCode: null,
      errorMessage: null,
      sentAt: null,
    });
    transaction.update(dispatchRef, {
      status: "queued" satisfies MailDispatchStatus,
      attemptCount: dispatch.attemptCount + 1,
      updatedAt: now,
      lastClaimedAt: now,
    });

    return {
      claimed: true,
      dispatchId,
      mailHistoryId: dispatch.mailHistoryId,
      status: "queued",
    };
  });
}

export async function getAutomaticMailDispatch(
  leadId: string,
  type: AutomaticMailHistoryType,
): Promise<MailDispatch | null> {
  const id = automaticDispatchId(leadId, type);
  const doc = await adminDb.collection(MAIL_DISPATCHES_COLLECTION).doc(id).get();
  return doc.exists ? toMailDispatch(doc) : null;
}
