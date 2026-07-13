// Datamodel voor de in-app e-mailclient (multi-mailbox).
// De bestaande website-SMTP en lead-mailflow (src/types/email.ts) blijven
// onaangeroerd; dit model beschrijft de aparte mailboxaccounts en hun
// gesynchroniseerde berichten.

import type { ImapSecurity, SmtpSecurity } from "@/types/email";

/** Systeemmappen die met IMAP worden gesynchroniseerd of in de app bestaan. */
export const EMAIL_SYSTEM_FOLDERS = [
  "inbox",
  "sent",
  "spam",
  "trash",
  "archive",
] as const;
export type EmailSystemFolder = (typeof EMAIL_SYSTEM_FOLDERS)[number];

export const EMAIL_FOLDER_LABELS: Record<EmailSystemFolder, string> = {
  inbox: "Postvak IN",
  sent: "Verzonden",
  spam: "Spam",
  trash: "Prullenbak",
  archive: "Archief",
};

export type EmailAddressValue = {
  name?: string;
  address: string;
};

/** IMAP-instellingen van een mailboxaccount. Wachtwoord alleen versleuteld, server-side. */
export type MailboxImapSettings = {
  enabled: boolean;
  host: string;
  port: number;
  security: ImapSecurity;
  username: string;
  encryptedPassword?: string;
  /** Aantal dagen historiek bij de eerste synchronisatie. */
  initialSyncDays: number;
  /** Maximaal aantal berichten per map per syncbeurt. */
  batchSize: number;
};

/** SMTP-instellingen van een mailboxaccount. Wachtwoord alleen versleuteld, server-side. */
export type MailboxSmtpSettings = {
  enabled: boolean;
  host: string;
  port: number;
  security: SmtpSecurity;
  username: string;
  encryptedPassword?: string;
  replyTo: string;
};

export type MailboxFolderMapping = Partial<Record<EmailSystemFolder, string>>;

/** Sync-cursor per systeemmap: UIDVALIDITY + hoogste verwerkte UID. */
export type MailboxFolderSyncState = {
  path: string;
  uidValidity: string;
  lastUid: number;
  lastSyncAt?: string;
};

export type MailboxSyncStatus =
  | "idle"
  | "syncing"
  | "synced"
  | "partial-error"
  | "error"
  | "paused";

export const EMAIL_TEMPLATE_MODES = ["full", "footer", "none"] as const;
/** full = header+footer, footer = alleen footer, none = alleen handtekening. */
export type EmailTemplateMode = (typeof EMAIL_TEMPLATE_MODES)[number];

export type EmailMailbox = {
  id: string;
  name: string;
  emailAddress: string;
  displayName: string;
  description: string;
  color: string;
  isActive: boolean;
  isDefaultManualMailbox: boolean;
  showInUnifiedInbox: boolean;
  imap: MailboxImapSettings;
  smtp: MailboxSmtpSettings;
  /** Eigen handtekening-HTML; leeg = geen persoonlijke handtekening. */
  signatureHtml: string;
  /** Template-standaard voor nieuwe berichten. */
  templateModeNew: EmailTemplateMode;
  /** Template-standaard voor antwoorden en doorsturen. */
  templateModeReply: EmailTemplateMode;
  /** Leeg = alle admins mogen deze mailbox gebruiken. */
  allowedAdminEmails: string[];
  folderMapping: MailboxFolderMapping;
  folderSyncState: Partial<Record<EmailSystemFolder, MailboxFolderSyncState>>;
  syncStatus: MailboxSyncStatus;
  lastSyncAt?: string;
  lastSyncStartedAt?: string;
  lastSyncError?: string;
  messageCount: number;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
};

/** Redacted mailbox voor de admin-client: nooit versleutelde wachtwoorden meesturen. */
export type EmailMailboxAdminView = Omit<EmailMailbox, "imap" | "smtp"> & {
  imap: Omit<MailboxImapSettings, "encryptedPassword"> & { passwordConfigured: boolean };
  smtp: Omit<MailboxSmtpSettings, "encryptedPassword"> & { passwordConfigured: boolean };
};

export type EmailAttachmentMeta = {
  index: number;
  filename: string;
  contentType: string;
  size: number;
  checksum?: string;
  /** Alleen voor uitgaande bijlagen: pad in Firebase Storage. */
  storagePath?: string;
};

export type EmailMessageSyncStatus = "synced" | "pending-flags" | "deleted-remotely";

export const EMAIL_PROCESSING_STATUSES = [
  "new",
  "in-progress",
  "waiting-customer",
  "waiting-internal",
  "completed",
] as const;
export type EmailProcessingStatus = (typeof EMAIL_PROCESSING_STATUSES)[number];

export const EMAIL_PROCESSING_LABELS: Record<EmailProcessingStatus, string> = {
  "new": "Nieuw",
  "in-progress": "In behandeling",
  "waiting-customer": "Wacht op klant",
  "waiting-internal": "Wacht intern",
  "completed": "Afgehandeld",
};

/** Eén gesynchroniseerd of verzonden bericht in de e-mailclient. */
export type EmailMessage = {
  id: string;
  mailboxId: string;
  threadId: string;
  folder: EmailSystemFolder;
  /** Werkelijk IMAP-mappad waar het bericht vandaan komt. */
  remoteFolderPath?: string;
  remoteUid?: number;
  uidValidity?: string;
  /** RFC 5322 Message-ID inclusief <>. */
  messageId?: string;
  inReplyTo?: string;
  references: string[];
  direction: "inbound" | "outbound";
  subject: string;
  from: EmailAddressValue;
  to: EmailAddressValue[];
  cc: EmailAddressValue[];
  bcc: EmailAddressValue[];
  replyToAddress?: string;
  /** Genormaliseerde adressen (lowercase) voor zoeken/filteren. */
  fromAddress: string;
  participants: string[];
  snippet: string;
  /** Gesanitizede HTML (server-side ontsmet vóór opslag). */
  htmlBody?: string;
  textBody?: string;
  bodyTruncated?: boolean;
  hasAttachments: boolean;
  attachments: EmailAttachmentMeta[];
  isRead: boolean;
  isStarred: boolean;
  isAnswered?: boolean;
  labelIds: string[];
  sizeBytes?: number;
  /** ISO-datum voor sortering (receivedAt of sentAt). */
  dateKey: string;
  receivedAt?: string;
  sentAt?: string;
  syncStatus: EmailMessageSyncStatus;
  contactLeadId?: string;
  createdAt: string;
  updatedAt: string;
};

/** Lichte lijstweergave: geen bodies over de lijn sturen. */
export type EmailMessageListItem = Omit<EmailMessage, "htmlBody" | "textBody"> & {
  threadMessageCount?: number;
};

export type EmailThread = {
  id: string;
  mailboxId: string;
  subject: string;
  normalizedSubject: string;
  messageCount: number;
  unreadCount: number;
  participants: string[];
  latestMessageAt: string;
  latestSnippet: string;
  processingStatus?: EmailProcessingStatus;
  createdAt: string;
  updatedAt: string;
};

export type EmailLabel = {
  id: string;
  name: string;
  color: string;
  hidden: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type EmailDraftKind = "new" | "reply" | "reply-all" | "forward";

export type EmailDraft = {
  id: string;
  mailboxId: string;
  kind: EmailDraftKind;
  /** Bericht-id in email_messages waarop dit een antwoord/doorsturing is. */
  relatedMessageId?: string;
  threadId?: string;
  to: EmailAddressValue[];
  cc: EmailAddressValue[];
  bcc: EmailAddressValue[];
  subject: string;
  /** Editor-HTML (nog niet gewrapt in branding). */
  htmlBody: string;
  templateMode: EmailTemplateMode;
  includeQuote: boolean;
  attachments: EmailAttachmentMeta[];
  createdAt: string;
  updatedAt: string;
  lastSavedAt: string;
};

export const EMAIL_OUTBOX_STATUSES = [
  "queued",
  "sending",
  "failed",
  "sent",
  "cancelled",
] as const;
export type EmailOutboxStatus = (typeof EMAIL_OUTBOX_STATUSES)[number];

export type EmailOutboxItem = {
  id: string;
  mailboxId: string;
  draftId?: string;
  kind: EmailDraftKind;
  relatedMessageId?: string;
  threadId?: string;
  to: EmailAddressValue[];
  cc: EmailAddressValue[];
  bcc: EmailAddressValue[];
  subject: string;
  /** Volledig gerenderde HTML (branding + handtekening + citaat). */
  renderedHtml: string;
  renderedText: string;
  /** Oorspronkelijke editorinhoud zodat een mislukt bericht bewerkbaar blijft. */
  editorHtml: string;
  templateMode: EmailTemplateMode;
  includeQuote: boolean;
  inReplyTo?: string;
  references: string[];
  attachments: EmailAttachmentMeta[];
  status: EmailOutboxStatus;
  attemptCount: number;
  lastAttemptAt?: string;
  lastError?: string;
  sentMessageId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type EmailThreadNote = {
  id: string;
  threadId: string;
  mailboxId: string;
  note: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

/** Filters voor de berichtenlijst en zoekfunctie. */
export type EmailListFilter = {
  view:
    | "inbox"
    | "starred"
    | "sent"
    | "all"
    | "spam"
    | "trash"
    | "archive"
    | "label";
  labelId?: string;
  mailboxId?: string;
  query?: string;
  unreadOnly?: boolean;
  readOnly?: boolean;
  starredOnly?: boolean;
  withAttachments?: boolean;
  withoutAttachments?: boolean;
  unansweredOnly?: boolean;
  dateFrom?: string;
  dateTo?: string;
};

export type EmailListPage = {
  items: EmailMessageListItem[];
  /** Cursor: dateKey + id van het laatste item, of null als er niets meer is. */
  nextCursor: { dateKey: string; id: string } | null;
  /** true wanneer een tekstzoekopdracht slechts een recent venster doorzocht. */
  searchWindowLimited?: boolean;
};

export type MailboxConnectionState =
  | "connected"
  | "imap-only"
  | "smtp-only"
  | "partial-error"
  | "disconnected"
  | "disabled";

export type MailboxSummary = {
  mailbox: EmailMailboxAdminView;
  inboxUnread: number;
  connection: MailboxConnectionState;
};

export type EmailSidebarCounts = {
  inboxUnread: number;
  drafts: number;
  outboxPending: number;
  spam: number;
  perMailboxInboxUnread: Record<string, number>;
};

export function normalizeEmailAddress(value: string): string {
  return value.trim().toLowerCase();
}

/** RE:/FW:-prefixen strippen voor threadmatching en nette onderwerpen. */
export function normalizeSubject(value: string): string {
  return value
    .replace(/^\s*((re|fw|fwd|aw|antw|doorst)\s*(\[\d+\])?\s*:\s*)+/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function replySubject(subject: string): string {
  const clean = subject.replace(/\s+/g, " ").trim();
  return /^re\s*:/i.test(clean) ? clean : `Re: ${clean}`;
}

export function forwardSubject(subject: string): string {
  const clean = subject.replace(/\s+/g, " ").trim();
  return /^(fw|fwd)\s*:/i.test(clean) ? clean : `Fwd: ${clean}`;
}

export function formatEmailAddress(value: EmailAddressValue): string {
  return value.name ? `${value.name} <${value.address}>` : value.address;
}

export const MAILBOX_COLORS = [
  "#FF7A00",
  "#38bdf8",
  "#a78bfa",
  "#34d399",
  "#f472b6",
  "#facc15",
  "#f87171",
  "#94a3b8",
] as const;

export const LABEL_COLORS = [
  "#FF7A00",
  "#38bdf8",
  "#a78bfa",
  "#34d399",
  "#f472b6",
  "#facc15",
  "#f87171",
  "#94a3b8",
  "#fb923c",
  "#22d3ee",
] as const;
