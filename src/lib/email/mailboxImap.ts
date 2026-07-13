import "server-only";

import { ImapFlow, type FetchMessageObject } from "imapflow";
import { simpleParser, type AddressObject, type ParsedMail } from "mailparser";
import { adminDb } from "@/lib/firebase/admin";
import { decryptImapPassword } from "@/lib/security/encryption";
import {
  SafeSmtpError,
  resolvePublicMailHost,
  validateEmailAddress,
  validateMailHost,
} from "@/lib/email/smtp";
import { emailHtmlToText, makeSnippet, sanitizeEmailHtml } from "@/lib/email/sanitizeEmailHtml";
import {
  claimMailboxSync,
  updateMailboxFields,
} from "@/lib/firestore/emailMailboxes";
import {
  countMailboxMessages,
  countUnread,
  newThreadId,
  refreshThread,
  resolveThreadId,
  toEmailMessage,
  updateMessageFields,
  upsertMessage,
} from "@/lib/firestore/emailClientStore";
import {
  EMAIL_SYSTEM_FOLDERS,
  normalizeEmailAddress,
  normalizeSubject,
  type EmailAddressValue,
  type EmailAttachmentMeta,
  type EmailMailbox,
  type EmailMessage,
  type EmailSystemFolder,
  type MailboxFolderMapping,
} from "@/types/emailClient";

const MAX_SOURCE_BYTES = 1024 * 1024;
const MAX_ATTACHMENT_SOURCE_BYTES = 30 * 1024 * 1024;
const MAX_HTML_LENGTH = 300_000;
const MAX_TEXT_LENGTH = 100_000;
const FLAG_RECONCILE_WINDOW = 300;
const CONTROL_CHARACTERS = /[\0\r\n]/;

export class SafeMailboxImapError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "SafeMailboxImapError";
  }
}

function safeError(error: unknown): SafeMailboxImapError {
  if (error instanceof SafeMailboxImapError) return error;
  if (error instanceof SafeSmtpError) {
    return new SafeMailboxImapError(error.message.replace("Mailserver-host", "IMAP-host"), error.code);
  }
  const record = error && typeof error === "object" ? (error as Record<string, unknown>) : {};
  const rawCode = typeof record.code === "string"
    ? record.code
    : record.authenticationFailed === true
      ? "EAUTH"
      : "IMAP_ERROR";
  const code = rawCode.toUpperCase();
  const response = typeof record.responseText === "string" ? record.responseText.toUpperCase() : "";
  if (code === "EAUTH" || code.includes("AUTH") || response.includes("AUTHENTICATION")) {
    return new SafeMailboxImapError(
      "IMAP-authenticatie is mislukt. Controleer gebruikersnaam en (app-)wachtwoord.",
      "EAUTH",
    );
  }
  const messages: Record<string, string> = {
    ETIMEDOUT: "De IMAP-server antwoordde niet binnen de toegestane tijd.",
    ECONNECTION: "Er kon geen verbinding met de IMAP-server worden gemaakt.",
    ECONNREFUSED: "De IMAP-server heeft de verbinding geweigerd.",
    EDNS: "De IMAP-host kon niet worden gevonden.",
    ENOTFOUND: "De IMAP-host kon niet worden gevonden.",
    CERT_HAS_EXPIRED: "Het TLS-certificaat van de IMAP-server is verlopen.",
    NONEXISTENT: "De IMAP-map bestaat niet (meer) op de server.",
  };
  return new SafeMailboxImapError(messages[code] ?? "De IMAP-actie is mislukt.", code);
}

export type MailboxImapAuth = {
  host: string;
  port: number;
  secure: boolean;
  starttls: boolean;
  username: string;
  password: string;
};

function resolveAuth(
  mailbox: Pick<EmailMailbox, "imap">,
  plaintextPasswordOverride?: string,
): { host: string; username: string; password: string } {
  const imap = mailbox.imap;
  if (!Number.isInteger(imap.port) || imap.port < 1 || imap.port > 65535) {
    throw new SafeMailboxImapError("IMAP-poort moet tussen 1 en 65535 liggen.", "INVALID_PORT");
  }
  const username = imap.username.trim();
  if (!username || username.length > 320 || CONTROL_CHARACTERS.test(username)) {
    throw new SafeMailboxImapError("Vul een geldige IMAP-gebruikersnaam in.", "INVALID_USERNAME");
  }
  const password = plaintextPasswordOverride
    || (imap.encryptedPassword ? decryptImapPassword(imap.encryptedPassword) : "");
  if (!password) {
    throw new SafeMailboxImapError("IMAP-wachtwoord ontbreekt.", "MISSING_PASSWORD");
  }
  let host: string;
  try {
    host = validateMailHost(imap.host, "IMAP-host");
  } catch (error) {
    throw safeError(error);
  }
  return { host, username, password };
}

async function createClient(
  mailbox: Pick<EmailMailbox, "imap">,
  plaintextPasswordOverride?: string,
): Promise<ImapFlow> {
  const { host, username, password } = resolveAuth(mailbox, plaintextPasswordOverride);
  const resolved = await resolvePublicMailHost(host);
  return new ImapFlow({
    host: resolved.address,
    port: mailbox.imap.port,
    secure: mailbox.imap.security === "ssl",
    doSTARTTLS: mailbox.imap.security === "starttls",
    ...(resolved.servername ? { servername: resolved.servername } : {}),
    auth: { user: username, pass: password },
    logger: false,
    disableAutoIdle: true,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 60_000,
    maxLineLength: 1024 * 1024,
    maxLiteralSize: MAX_ATTACHMENT_SOURCE_BYTES + 64 * 1024,
    tls: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
      ...(resolved.servername ? { servername: resolved.servername } : {}),
    },
  });
}

async function closeClient(client: ImapFlow): Promise<void> {
  try {
    if (client.usable) {
      await client.logout();
    } else {
      client.close();
    }
  } catch {
    client.close();
  }
}

/** Voert een callback uit met een open IMAP-verbinding en sluit die netjes af. */
export async function withImapClient<T>(
  mailbox: Pick<EmailMailbox, "imap">,
  handler: (client: ImapFlow) => Promise<T>,
  plaintextPasswordOverride?: string,
): Promise<T> {
  let client: ImapFlow | undefined;
  try {
    client = await createClient(mailbox, plaintextPasswordOverride);
    await client.connect();
    return await handler(client);
  } catch (error) {
    throw safeError(error);
  } finally {
    if (client) await closeClient(client);
  }
}

export type RemoteFolderInfo = {
  path: string;
  name: string;
  specialUse?: string;
  delimiter: string;
};

export async function listRemoteFolders(
  mailbox: Pick<EmailMailbox, "imap">,
  plaintextPasswordOverride?: string,
): Promise<RemoteFolderInfo[]> {
  return withImapClient(
    mailbox,
    async (client) => {
      const folders = await client.list();
      return folders.map((folder) => ({
        path: folder.path,
        name: folder.name,
        ...(folder.specialUse ? { specialUse: folder.specialUse } : {}),
        delimiter: folder.delimiter ?? "/",
      }));
    },
    plaintextPasswordOverride,
  );
}

const FOLDER_NAME_HINTS: Record<Exclude<EmailSystemFolder, "inbox">, string[]> = {
  sent: ["sent", "sent items", "sent messages", "verzonden", "verzonden items", "inbox.sent", "envoyes"],
  spam: ["junk", "spam", "junk e-mail", "ongewenste e-mail", "inbox.spam", "inbox.junk"],
  trash: ["trash", "deleted", "deleted items", "deleted messages", "prullenbak", "verwijderde items", "inbox.trash", "corbeille"],
  archive: ["archive", "archief", "archives", "all mail", "inbox.archive"],
};

const SPECIAL_USE_MAP: Record<string, EmailSystemFolder> = {
  "\\Sent": "sent",
  "\\Junk": "spam",
  "\\Trash": "trash",
  "\\Archive": "archive",
};

/**
 * Detecteert de systeemmappen van de server: eerst via SPECIAL-USE-attributen,
 * daarna via bekende mapnamen. Handmatige mapping (mailbox.folderMapping) wint
 * altijd van detectie.
 */
export function detectFolderMapping(
  folders: RemoteFolderInfo[],
  manual: MailboxFolderMapping,
): MailboxFolderMapping {
  const mapping: MailboxFolderMapping = { ...manual };

  if (!mapping.inbox) {
    const inbox = folders.find((folder) => folder.path.toUpperCase() === "INBOX");
    mapping.inbox = inbox?.path ?? "INBOX";
  }

  for (const folder of folders) {
    const special = folder.specialUse ? SPECIAL_USE_MAP[folder.specialUse] : undefined;
    if (special && !mapping[special]) mapping[special] = folder.path;
  }

  for (const key of ["sent", "spam", "trash", "archive"] as const) {
    if (mapping[key]) continue;
    const hints = FOLDER_NAME_HINTS[key];
    const match = folders.find((folder) => {
      const name = folder.name.toLowerCase();
      const path = folder.path.toLowerCase();
      return hints.includes(name) || hints.includes(path);
    });
    if (match) mapping[key] = match.path;
  }

  return mapping;
}

function cleanHeader(value: string | undefined, maxLength = 998): string | undefined {
  const clean = value?.replace(/[\0\r\n]+/g, " ").replace(/\s+/g, " ").trim();
  return clean ? clean.slice(0, maxLength) : undefined;
}

function cleanReferences(value: string | string[] | undefined): string[] {
  const references = value === undefined ? [] : Array.isArray(value) ? value : [value];
  return references
    .flatMap((reference) => reference.match(/<[^<>\s]+>/g) ?? [reference])
    .map((reference) => cleanHeader(reference))
    .filter((reference): reference is string => Boolean(reference))
    .slice(-20);
}

function parseAddresses(value: AddressObject | AddressObject[] | undefined): EmailAddressValue[] {
  const objects = value ? (Array.isArray(value) ? value : [value]) : [];
  const result: EmailAddressValue[] = [];
  for (const object of objects) {
    for (const entry of object.value) {
      if (!entry.address) continue;
      try {
        const address = validateEmailAddress(entry.address);
        const name = cleanHeader(entry.name, 120);
        result.push({ ...(name ? { name } : {}), address: normalizeEmailAddress(address) });
      } catch {
        // Onbruikbare adressen uit onbetrouwbare headers negeren.
      }
    }
  }
  const seen = new Set<string>();
  return result.filter((item) => {
    if (seen.has(item.address)) return false;
    seen.add(item.address);
    return true;
  });
}

function attachmentMeta(parsed: ParsedMail): EmailAttachmentMeta[] {
  return parsed.attachments.slice(0, 25).map((attachment, index) => ({
    index,
    filename: (attachment.filename ?? `bijlage-${index + 1}`).replace(/[\0\r\n]+/g, " ").slice(0, 200),
    contentType: (attachment.contentType ?? "application/octet-stream").slice(0, 120),
    size: attachment.size ?? attachment.content?.length ?? 0,
    ...(attachment.checksum ? { checksum: attachment.checksum } : {}),
  }));
}

function messageDate(parsed: ParsedMail, fallback: Date | string | undefined): string {
  const fallbackDate =
    fallback instanceof Date ? fallback : typeof fallback === "string" ? new Date(fallback) : undefined;
  const candidate = parsed.date instanceof Date && !Number.isNaN(parsed.date.getTime())
    ? parsed.date
    : fallbackDate instanceof Date && !Number.isNaN(fallbackDate.getTime())
      ? fallbackDate
      : new Date();
  const latestAllowed = Date.now() + 24 * 60 * 60 * 1000;
  return (candidate.getTime() <= latestAllowed ? candidate : new Date()).toISOString();
}

async function findContactLeadId(address: string): Promise<string | undefined> {
  if (!address) return undefined;
  try {
    const snapshot = await adminDb
      .collection("leads")
      .where("email", "==", address)
      .limit(1)
      .get();
    return snapshot.empty ? undefined : snapshot.docs[0].id;
  } catch {
    return undefined;
  }
}

export type FolderSyncOutcome = {
  folder: EmailSystemFolder;
  path: string;
  examined: number;
  imported: number;
  flagsUpdated: number;
  hasMore: boolean;
  error?: string;
};

export type MailboxSyncOutcome = {
  mailboxId: string;
  started: boolean;
  folders: FolderSyncOutcome[];
  error?: string;
};

type ImportContext = {
  mailbox: EmailMailbox;
  folder: EmailSystemFolder;
  path: string;
  uidValidity: string;
};

async function importFetchedMessage(
  context: ImportContext,
  message: FetchMessageObject,
): Promise<boolean> {
  if (!message.source) return false;
  let parsed: ParsedMail;
  try {
    parsed = await simpleParser(message.source, {
      maxHtmlLengthToParse: MAX_SOURCE_BYTES,
      skipImageLinks: true,
      skipTextToHtml: true,
    });
  } catch {
    // Eén beschadigd bericht mag de rest van de sync niet blokkeren.
    return false;
  }

  const from = parseAddresses(parsed.from)[0] ?? { address: "" };
  const to = parseAddresses(parsed.to);
  const cc = parseAddresses(parsed.cc);
  const bcc = parseAddresses(parsed.bcc);
  const replyTo = parseAddresses(parsed.replyTo)[0]?.address;
  const subject = cleanHeader(parsed.subject, 250) ?? "";
  const messageId = cleanHeader(parsed.messageId);
  const inReplyTo = cleanHeader(parsed.inReplyTo);
  const references = cleanReferences(parsed.references);
  const flags = message.flags ?? new Set<string>();

  const html = typeof parsed.html === "string" ? sanitizeEmailHtml(parsed.html).slice(0, MAX_HTML_LENGTH) : "";
  const text = (parsed.text ?? (html ? emailHtmlToText(html) : "")).replace(/\0/g, "").slice(0, MAX_TEXT_LENGTH);
  const snippet = makeSnippet(text || emailHtmlToText(html));
  const dateKey = messageDate(parsed, message.internalDate);

  const mailboxAddress = normalizeEmailAddress(context.mailbox.emailAddress);
  const direction: "inbound" | "outbound" =
    context.folder === "sent" || from.address === mailboxAddress ? "outbound" : "inbound";
  const participants = [
    ...new Set([from.address, ...to.map((a) => a.address), ...cc.map((a) => a.address)]),
  ].filter(Boolean).slice(0, 30);
  const normalizedSubject = normalizeSubject(subject);

  const threadId =
    (await resolveThreadId({
      mailboxId: context.mailbox.id,
      ...(inReplyTo ? { inReplyTo } : {}),
      references,
      normalizedSubject,
      participants,
    })) ?? newThreadId();

  const contactLeadId =
    direction === "inbound" ? await findContactLeadId(from.address) : undefined;

  const attachments = attachmentMeta(parsed);
  const result = await upsertMessage({
    mailboxId: context.mailbox.id,
    threadId,
    folder: context.folder,
    remoteFolderPath: context.path,
    remoteUid: message.uid,
    uidValidity: context.uidValidity,
    ...(messageId ? { messageId } : {}),
    ...(inReplyTo ? { inReplyTo } : {}),
    references,
    direction,
    subject,
    from,
    to,
    cc,
    bcc,
    ...(replyTo ? { replyToAddress: replyTo } : {}),
    fromAddress: from.address,
    participants,
    snippet,
    ...(html ? { htmlBody: html } : {}),
    ...(text ? { textBody: text } : {}),
    ...(typeof message.size === "number" && message.size > MAX_SOURCE_BYTES
      ? { bodyTruncated: true }
      : {}),
    hasAttachments: attachments.length > 0,
    attachments,
    isRead: flags.has("\\Seen") || context.folder === "sent",
    isStarred: flags.has("\\Flagged"),
    ...(flags.has("\\Answered") ? { isAnswered: true } : {}),
    labelIds: [],
    ...(typeof message.size === "number" ? { sizeBytes: message.size } : {}),
    dateKey,
    ...(direction === "inbound" ? { receivedAt: dateKey } : { sentAt: dateKey }),
    syncStatus: "synced",
    ...(contactLeadId ? { contactLeadId } : {}),
  });

  if (result.created) {
    await refreshThread(threadId, {
      mailboxId: context.mailbox.id,
      subject,
      normalizedSubject,
      participants,
    });
  }
  return result.created;
}

/** Flagverschillen (gelezen/ster) van een recent UID-venster overnemen. */
async function reconcileFlags(
  client: ImapFlow,
  context: ImportContext,
  uidNext: number,
): Promise<number> {
  const firstUid = Math.max(1, uidNext - FLAG_RECONCILE_WINDOW);
  const serverFlags = new Map<number, Set<string>>();
  try {
    const fetched = await client.fetchAll(`${firstUid}:*`, { uid: true, flags: true }, { uid: true });
    for (const item of fetched) {
      if (typeof item.uid === "number") serverFlags.set(item.uid, item.flags ?? new Set());
    }
  } catch {
    return 0;
  }
  if (serverFlags.size === 0) return 0;

  const snapshot = await adminDb
    .collection("email_messages")
    .where("mailboxId", "==", context.mailbox.id)
    .where("remoteFolderPath", "==", context.path)
    .where("remoteUid", ">=", firstUid)
    .limit(FLAG_RECONCILE_WINDOW)
    .get();

  let updated = 0;
  for (const doc of snapshot.docs) {
    const local = toEmailMessage(doc);
    if (local.uidValidity && local.uidValidity !== context.uidValidity) continue;
    if (typeof local.remoteUid !== "number") continue;
    const flags = serverFlags.get(local.remoteUid);
    if (!flags) {
      if (local.syncStatus !== "deleted-remotely") {
        await updateMessageFields(local.id, { syncStatus: "deleted-remotely" });
        updated += 1;
      }
      continue;
    }
    const isRead = flags.has("\\Seen");
    const isStarred = flags.has("\\Flagged");
    const isAnswered = flags.has("\\Answered");
    if (
      local.isRead !== isRead ||
      local.isStarred !== isStarred ||
      Boolean(local.isAnswered) !== isAnswered ||
      local.syncStatus !== "synced"
    ) {
      await updateMessageFields(local.id, {
        isRead,
        isStarred,
        isAnswered,
        syncStatus: "synced",
      });
      await refreshThread(local.threadId);
      updated += 1;
    }
  }
  return updated;
}

/**
 * Volledige synchronisatie van een mailboxaccount: mapdetectie, nieuwe
 * berichten importeren per systeemmap en flags bijwerken. Eén map die faalt
 * blokkeert de andere mappen niet.
 */
export async function syncMailboxAccount(mailbox: EmailMailbox): Promise<MailboxSyncOutcome> {
  if (!mailbox.imap.enabled) {
    throw new SafeMailboxImapError("IMAP is uitgeschakeld voor deze mailbox.", "IMAP_DISABLED");
  }
  const claimed = await claimMailboxSync(mailbox.id);
  if (!claimed) {
    return { mailboxId: mailbox.id, started: false, folders: [] };
  }

  const outcomes: FolderSyncOutcome[] = [];
  let fatalError: SafeMailboxImapError | null = null;

  try {
    await withImapClient(mailbox, async (client) => {
      const remoteFolders = await client.list();
      const mapping = detectFolderMapping(
        remoteFolders.map((folder) => ({
          path: folder.path,
          name: folder.name,
          ...(folder.specialUse ? { specialUse: folder.specialUse } : {}),
          delimiter: folder.delimiter ?? "/",
        })),
        mailbox.folderMapping,
      );

      const syncState = { ...mailbox.folderSyncState };

      for (const folder of EMAIL_SYSTEM_FOLDERS) {
        const path = mapping[folder];
        if (!path) continue;
        const outcome: FolderSyncOutcome = {
          folder,
          path,
          examined: 0,
          imported: 0,
          flagsUpdated: 0,
          hasMore: false,
        };
        outcomes.push(outcome);

        try {
          const opened = await client.mailboxOpen(path, { readOnly: true });
          const uidValidity = String(opened.uidValidity ?? "0");
          const context: ImportContext = { mailbox, folder, path, uidValidity };
          const state = syncState[folder];
          const sameGeneration = state && state.uidValidity === uidValidity && state.path === path;
          const sinceUid = sameGeneration ? state.lastUid : 0;

          let uids: number[] = [];
          if (sinceUid > 0) {
            const found = await client.search({ uid: `${sinceUid + 1}:*` }, { uid: true });
            uids = (found || []).filter((uid) => uid > sinceUid);
          } else {
            const since = new Date(Date.now() - mailbox.imap.initialSyncDays * 86_400_000);
            const found = await client.search({ since }, { uid: true });
            uids = found || [];
          }
          uids.sort((a, b) => a - b);
          outcome.hasMore = uids.length > mailbox.imap.batchSize;
          const batch = uids.slice(0, mailbox.imap.batchSize);

          let highestUid = sinceUid;
          if (batch.length > 0) {
            const fetched = await client.fetchAll(
              batch,
              {
                uid: true,
                flags: true,
                internalDate: true,
                size: true,
                source: { start: 0, maxLength: MAX_SOURCE_BYTES },
              },
              { uid: true },
            );
            for (const message of fetched) {
              outcome.examined += 1;
              const created = await importFetchedMessage(context, message);
              if (created) outcome.imported += 1;
              if (typeof message.uid === "number" && message.uid > highestUid) {
                highestUid = message.uid;
              }
            }
          }

          outcome.flagsUpdated = await reconcileFlags(client, context, opened.uidNext ?? 1);

          syncState[folder] = {
            path,
            uidValidity,
            lastUid: highestUid,
            lastSyncAt: new Date().toISOString(),
          };
        } catch (error) {
          outcome.error = safeError(error).message;
        }
      }

      const [messageCount, unreadCount] = await Promise.all([
        countMailboxMessages(mailbox.id),
        countUnread(mailbox.id),
      ]);
      const hadErrors = outcomes.some((outcome) => outcome.error);
      await updateMailboxFields(mailbox.id, {
        folderMapping: mapping,
        folderSyncState: syncState,
        syncStatus: hadErrors ? "partial-error" : "synced",
        lastSyncAt: new Date().toISOString(),
        lastSyncError: hadErrors
          ? outcomes.filter((o) => o.error).map((o) => `${o.path}: ${o.error}`).join(" | ").slice(0, 500)
          : "",
        messageCount,
        unreadCount,
      });
    });
  } catch (error) {
    fatalError = safeError(error);
    await updateMailboxFields(mailbox.id, {
      syncStatus: "error",
      lastSyncError: fatalError.message,
    }).catch(() => undefined);
  }

  return {
    mailboxId: mailbox.id,
    started: true,
    folders: outcomes,
    ...(fatalError ? { error: fatalError.message } : {}),
  };
}

type RemoteRef = Pick<EmailMessage, "remoteFolderPath" | "remoteUid">;

function groupByFolder(messages: RemoteRef[]): Map<string, number[]> {
  const groups = new Map<string, number[]>();
  for (const message of messages) {
    if (!message.remoteFolderPath || typeof message.remoteUid !== "number") continue;
    const uids = groups.get(message.remoteFolderPath) ?? [];
    uids.push(message.remoteUid);
    groups.set(message.remoteFolderPath, uids);
  }
  return groups;
}

/** Zet of verwijdert IMAP-flags (\Seen / \Flagged) voor een set berichten. */
export async function setRemoteFlags(
  mailbox: EmailMailbox,
  messages: RemoteRef[],
  changes: { seen?: boolean; flagged?: boolean },
): Promise<void> {
  const groups = groupByFolder(messages);
  if (groups.size === 0) return;
  await withImapClient(mailbox, async (client) => {
    for (const [path, uids] of groups) {
      const lock = await client.getMailboxLock(path);
      try {
        if (changes.seen === true) await client.messageFlagsAdd(uids, ["\\Seen"], { uid: true });
        if (changes.seen === false) await client.messageFlagsRemove(uids, ["\\Seen"], { uid: true });
        if (changes.flagged === true) await client.messageFlagsAdd(uids, ["\\Flagged"], { uid: true });
        if (changes.flagged === false) await client.messageFlagsRemove(uids, ["\\Flagged"], { uid: true });
      } finally {
        lock.release();
      }
    }
  });
}

/**
 * Verplaatst berichten server-side naar een systeemmap. Bestaat de doelmap
 * nog niet (bv. Archief), dan wordt die eerst aangemaakt.
 */
export async function moveRemoteMessages(
  mailbox: EmailMailbox,
  messages: RemoteRef[],
  targetFolder: EmailSystemFolder,
): Promise<{ targetPath: string }> {
  const groups = groupByFolder(messages);
  return withImapClient(mailbox, async (client) => {
    let targetPath = mailbox.folderMapping[targetFolder];
    if (!targetPath) {
      const remoteFolders = await client.list();
      const mapping = detectFolderMapping(
        remoteFolders.map((folder) => ({
          path: folder.path,
          name: folder.name,
          ...(folder.specialUse ? { specialUse: folder.specialUse } : {}),
          delimiter: folder.delimiter ?? "/",
        })),
        mailbox.folderMapping,
      );
      targetPath = mapping[targetFolder];
    }
    if (!targetPath) {
      const fallbackNames: Record<EmailSystemFolder, string> = {
        inbox: "INBOX",
        sent: "Sent",
        spam: "Junk",
        trash: "Trash",
        archive: "Archive",
      };
      targetPath = fallbackNames[targetFolder];
      await client.mailboxCreate(targetPath).catch(() => undefined);
    }
    for (const [path, uids] of groups) {
      if (path === targetPath) continue;
      const lock = await client.getMailboxLock(path);
      try {
        await client.messageMove(uids, targetPath, { uid: true });
      } finally {
        lock.release();
      }
    }
    return { targetPath };
  });
}

/** Verwijdert berichten definitief van de server (na expliciete bevestiging). */
export async function deleteRemoteMessages(
  mailbox: EmailMailbox,
  messages: RemoteRef[],
): Promise<void> {
  const groups = groupByFolder(messages);
  if (groups.size === 0) return;
  await withImapClient(mailbox, async (client) => {
    for (const [path, uids] of groups) {
      const lock = await client.getMailboxLock(path);
      try {
        await client.messageDelete(uids, { uid: true });
      } finally {
        lock.release();
      }
    }
  });
}

/** Bewaart een verzonden bericht in de Verzonden-map van de server. */
export async function appendToSentFolder(
  mailbox: EmailMailbox,
  raw: Buffer,
): Promise<{ path: string } | null> {
  return withImapClient(mailbox, async (client) => {
    let path = mailbox.folderMapping.sent;
    if (!path) {
      const remoteFolders = await client.list();
      const mapping = detectFolderMapping(
        remoteFolders.map((folder) => ({
          path: folder.path,
          name: folder.name,
          ...(folder.specialUse ? { specialUse: folder.specialUse } : {}),
          delimiter: folder.delimiter ?? "/",
        })),
        mailbox.folderMapping,
      );
      path = mapping.sent;
    }
    if (!path) return null;
    await client.append(path, raw, ["\\Seen"]);
    return { path };
  });
}

export type DownloadedAttachment = {
  filename: string;
  contentType: string;
  content: Buffer;
};

/**
 * Haalt één bijlage op uit het originele bericht op de IMAP-server. Bijlagen
 * worden bewust niet in Firestore of Storage bewaard.
 */
export async function downloadRemoteAttachment(
  mailbox: EmailMailbox,
  message: Pick<EmailMessage, "remoteFolderPath" | "remoteUid" | "attachments">,
  attachmentIndex: number,
): Promise<DownloadedAttachment | null> {
  if (!message.remoteFolderPath || typeof message.remoteUid !== "number") return null;
  const meta = message.attachments.find((attachment) => attachment.index === attachmentIndex);
  if (!meta) return null;

  return withImapClient(mailbox, async (client) => {
    const lock = await client.getMailboxLock(message.remoteFolderPath as string, { readOnly: true });
    try {
      const fetched = await client.fetchOne(
        String(message.remoteUid),
        { uid: true, source: { start: 0, maxLength: MAX_ATTACHMENT_SOURCE_BYTES } },
        { uid: true },
      );
      if (!fetched || !fetched.source) return null;
      const parsed = await simpleParser(fetched.source, { skipImageLinks: true, skipTextToHtml: true });
      const attachment = parsed.attachments[attachmentIndex];
      if (!attachment?.content) return null;
      return {
        filename: meta.filename,
        contentType: attachment.contentType || meta.contentType,
        content: attachment.content,
      };
    } finally {
      lock.release();
    }
  });
}

/** Verbindingstest voor de IMAP-kant van een mailboxaccount. */
export async function verifyMailboxImap(
  mailbox: Pick<EmailMailbox, "imap" | "folderMapping">,
  plaintextPasswordOverride?: string,
): Promise<{ ok: true }> {
  await withImapClient(
    mailbox as Pick<EmailMailbox, "imap">,
    async (client) => {
      await client.mailboxOpen(mailbox.folderMapping?.inbox ?? "INBOX", { readOnly: true });
    },
    plaintextPasswordOverride,
  );
  return { ok: true };
}
