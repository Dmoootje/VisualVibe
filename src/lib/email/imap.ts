import "server-only";

import { createHash } from "node:crypto";
import { ImapFlow } from "imapflow";
import { simpleParser, type AddressObject, type ParsedMail } from "mailparser";
import { createMailHistoryIfAbsent } from "@/lib/firestore/mailHistory";
import { decryptImapPassword } from "@/lib/security/encryption";
import {
  SafeSmtpError,
  resolvePublicMailHost,
  validateEmailAddress,
  validateMailHost,
} from "@/lib/email/smtp";
import type { EmailLocale, ImapSettings } from "@/types/email";

const MAX_MESSAGES_PER_SYNC = 50;
const MAX_UID_SEARCH_RANGE = 5_000;
const MAX_SOURCE_BYTES = 512 * 1024;
const MAX_BODY_LENGTH = 30_000;
const CONTROL_CHARACTERS = /[\0\r\n]/;

export type ImapOperationOptions = {
  /** Plaintext is used only for an unsaved admin test and is never persisted. */
  plaintextPasswordOverride?: string;
};

export type ImapVerificationResult = { ok: true };

export type ImapSyncResult = {
  examined: number;
  imported: number;
};

export class SafeImapError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "SafeImapError";
  }
}

export function validateImapSettings(
  settings: ImapSettings,
  plaintextPasswordOverride?: string,
): ImapSettings {
  if (!Number.isInteger(settings.port) || settings.port < 1 || settings.port > 65535) {
    throw new SafeImapError("IMAP-poort moet tussen 1 en 65535 liggen.", "INVALID_PORT");
  }
  if (settings.security !== "ssl" && settings.security !== "starttls") {
    throw new SafeImapError("IMAP-beveiliging is ongeldig.", "INVALID_SECURITY");
  }

  const username = settings.username.trim();
  if (!username || username.length > 320 || CONTROL_CHARACTERS.test(username)) {
    throw new SafeImapError("Vul een geldige IMAP-gebruikersnaam in.", "INVALID_USERNAME");
  }
  if (!plaintextPasswordOverride && !settings.encryptedPassword) {
    throw new SafeImapError("IMAP-wachtwoord ontbreekt.", "MISSING_PASSWORD");
  }

  const mailbox = settings.mailbox.trim();
  if (!mailbox || mailbox.length > 255 || CONTROL_CHARACTERS.test(mailbox)) {
    throw new SafeImapError("Vul een geldige IMAP-mailbox in.", "INVALID_MAILBOX");
  }
  if (
    !Number.isInteger(settings.syncWindowDays) ||
    settings.syncWindowDays < 1 ||
    settings.syncWindowDays > 365
  ) {
    throw new SafeImapError("Het IMAP-zoekvenster moet tussen 1 en 365 dagen liggen.", "INVALID_SYNC_WINDOW");
  }

  try {
    return {
      ...settings,
      host: validateMailHost(settings.host, "IMAP-host"),
      username,
      mailbox,
    };
  } catch (error) {
    if (error instanceof SafeSmtpError) {
      throw new SafeImapError(error.message, error.code);
    }
    throw error;
  }
}

function safeImapError(error: unknown): SafeImapError {
  if (error instanceof SafeImapError) return error;
  if (error instanceof SafeSmtpError) {
    return new SafeImapError(error.message.replace("Mailserver-host", "IMAP-host"), error.code);
  }

  const record = error && typeof error === "object" ? error as Record<string, unknown> : {};
  const rawCode = typeof record.code === "string"
    ? record.code
    : typeof record.authenticationFailed === "boolean" && record.authenticationFailed
      ? "EAUTH"
      : "IMAP_ERROR";
  const code = rawCode.toUpperCase();
  const response = typeof record.responseText === "string" ? record.responseText.toUpperCase() : "";
  if (code === "EAUTH" || code.includes("AUTH") || response.includes("AUTHENTICATION")) {
    return new SafeImapError(
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
  };
  return new SafeImapError(messages[code] ?? "De IMAP-actie is mislukt.", code);
}

async function createClient(settings: ImapSettings, plaintextPasswordOverride?: string) {
  const validated = validateImapSettings(settings, plaintextPasswordOverride);
  const resolved = await resolvePublicMailHost(validated.host);
  const password = plaintextPasswordOverride || (
    validated.encryptedPassword ? decryptImapPassword(validated.encryptedPassword) : ""
  );

  return {
    client: new ImapFlow({
      host: resolved.address,
      port: validated.port,
      secure: validated.security === "ssl",
      doSTARTTLS: validated.security === "starttls",
      ...(resolved.servername ? { servername: resolved.servername } : {}),
      auth: { user: validated.username, pass: password },
      logger: false,
      disableAutoIdle: true,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 30_000,
      maxLineLength: 1024 * 1024,
      maxLiteralSize: MAX_SOURCE_BYTES + 64 * 1024,
      tls: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
        ...(resolved.servername ? { servername: resolved.servername } : {}),
      },
    }),
    settings: validated,
  };
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

export async function verifyImapConnection(
  imap: ImapSettings,
  options: ImapOperationOptions = {},
): Promise<ImapVerificationResult> {
  let client: ImapFlow | undefined;
  try {
    const created = await createClient(imap, options.plaintextPasswordOverride);
    client = created.client;
    await client.connect();
    await client.mailboxOpen(created.settings.mailbox, { readOnly: true });
    return { ok: true };
  } catch (error) {
    throw safeImapError(error);
  } finally {
    if (client) await closeClient(client);
  }
}

function normalizedEmail(value: string): string {
  return value.trim().toLowerCase();
}

function cleanAddresses(value: AddressObject | AddressObject[] | undefined): string[] {
  const objects = value ? (Array.isArray(value) ? value : [value]) : [];
  const result: string[] = [];
  for (const object of objects) {
    for (const entry of object.value) {
      if (!entry.address) continue;
      try {
        result.push(validateEmailAddress(entry.address));
      } catch {
        // Ignore malformed addresses from untrusted message headers.
      }
    }
  }
  return [...new Set(result)];
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

function cleanBody(value: string | undefined): string {
  const body = value?.replace(/\0/g, "").trim() ?? "";
  if (!body) return "Dit bericht bevat geen leesbare platte tekst.";
  return body.slice(0, MAX_BODY_LENGTH);
}

function cleanAttachmentNames(attachments: ParsedMail["attachments"]): string[] {
  return attachments
    .map((attachment) => attachment.filename?.replace(/[\0\r\n]+/g, " ").trim())
    .filter((filename): filename is string => Boolean(filename))
    .map((filename) => filename.slice(0, 200))
    .slice(0, 20);
}

function receivedDate(date: Date | undefined, fallback: Date | string | undefined): Date {
  const fallbackDate = fallback instanceof Date ? fallback : fallback ? new Date(fallback) : undefined;
  const candidate = date instanceof Date && !Number.isNaN(date.getTime()) ? date : fallbackDate;
  if (!candidate || Number.isNaN(candidate.getTime())) return new Date();
  const latestAllowed = Date.now() + 24 * 60 * 60 * 1000;
  return candidate.getTime() <= latestAllowed ? candidate : new Date();
}

export async function syncImapRepliesForLead(
  imap: ImapSettings,
  lead: {
    id: string;
    leadNumber: string;
    email: string;
    locale: EmailLocale;
    createdAt: string;
    knownMessageIds: string[];
  },
): Promise<ImapSyncResult> {
  if (!imap.enabled) {
    throw new SafeImapError("IMAP-synchronisatie is uitgeschakeld.", "IMAP_DISABLED");
  }

  let client: ImapFlow | undefined;
  try {
    const created = await createClient(imap);
    client = created.client;
    await client.connect();
    const mailbox = await client.mailboxOpen(created.settings.mailbox, { readOnly: true });

    const windowStart = new Date(Date.now() - created.settings.syncWindowDays * 86_400_000);
    const leadCreatedAt = new Date(lead.createdAt);
    const since = Number.isNaN(leadCreatedAt.getTime()) || leadCreatedAt < windowStart
      ? windowStart
      : new Date(leadCreatedAt.getTime() - 86_400_000);
    const firstUid = Math.max(1, mailbox.uidNext - MAX_UID_SEARCH_RANGE);
    const matches = await client.search(
      { uid: `${firstUid}:*`, from: lead.email, since },
      { uid: true },
    );
    const uids = (matches || []).sort((a, b) => a - b).slice(-MAX_MESSAGES_PER_SYNC);
    if (uids.length === 0) return { examined: 0, imported: 0 };

    const messages = await client.fetchAll(
      uids,
      {
        uid: true,
        internalDate: true,
        size: true,
        source: { start: 0, maxLength: MAX_SOURCE_BYTES },
      },
      { uid: true },
    );

    const knownMessageIds = new Set(
      lead.knownMessageIds.map((messageId) => messageId.trim().toLowerCase()),
    );
    let imported = 0;
    for (const message of messages) {
      if (!message.source) continue;
      let parsed: ParsedMail;
      try {
        parsed = await simpleParser(message.source, {
          maxHtmlLengthToParse: MAX_SOURCE_BYTES,
          skipImageLinks: true,
          skipTextToHtml: true,
        });
      } catch {
        // A single malformed message must not block the rest of the mailbox sync.
        continue;
      }
      const from = cleanAddresses(parsed.from);
      if (!from.some((address) => normalizedEmail(address) === normalizedEmail(lead.email))) {
        continue;
      }
      const references = cleanReferences(parsed.references);
      const inReplyTo = cleanHeader(parsed.inReplyTo);
      const threadMatches = [inReplyTo, ...references].some(
        (messageId) => messageId && knownMessageIds.has(messageId.toLowerCase()),
      );
      const subjectMatches = (cleanHeader(parsed.subject, 250) ?? "")
        .toLowerCase()
        .includes(`[${lead.leadNumber.trim().toLowerCase()}]`);
      if (!threadMatches && !subjectMatches) {
        continue;
      }

      const uidScope = createHash("sha256")
        .update([
          created.settings.host,
          created.settings.username,
          mailbox.path,
          mailbox.uidValidity.toString(),
          String(message.uid),
        ].join("\u0000"))
        .digest("base64url");
      const result = await createMailHistoryIfAbsent({
        leadId: lead.id,
        type: "incoming_reply",
        direction: "inbound",
        from,
        to: cleanAddresses(parsed.to),
        cc: cleanAddresses(parsed.cc),
        subject: cleanHeader(parsed.subject, 250) ?? "Zonder onderwerp",
        htmlBody: "",
        textBody: cleanBody(parsed.text),
        status: "received",
        providerMessageId: cleanHeader(parsed.messageId),
        inReplyTo,
        references,
        receivedAt: receivedDate(parsed.date, message.internalDate),
        imapUid: message.uid,
        imapMailbox: mailbox.path,
        attachmentNames: cleanAttachmentNames(parsed.attachments),
        contentTruncated: typeof message.size === "number" && message.size > MAX_SOURCE_BYTES,
        createdBy: "imap-sync",
        locale: lead.locale,
        idempotencyKey: uidScope,
      });
      if (result.created) imported += 1;
    }

    return { examined: messages.length, imported };
  } catch (error) {
    throw safeImapError(error);
  } finally {
    if (client) await closeClient(client);
  }
}
