import "server-only";

import { randomUUID } from "node:crypto";
import MailComposer from "nodemailer/lib/mail-composer";
import { decryptSmtpPassword } from "@/lib/security/encryption";
import {
  sendSmtpMail,
  verifySmtpConnection,
  type SmtpVerificationResult,
} from "@/lib/email/smtp";
import type { SmtpMailAttachment, SmtpSendResult, SmtpSettings } from "@/types/email";
import type { EmailMailbox } from "@/types/emailClient";

// Verzendlaag voor mailboxaccounts. De algemene website-SMTP (email_settings)
// blijft exclusief voor transactionele websitemails; deze module bouwt per
// mailboxaccount een eigen SmtpSettings-object en hergebruikt de bestaande,
// beveiligde sendSmtpMail-pijplijn (SSRF-checks, headervalidatie, TLS-eisen).

/** Vertaalt een mailboxaccount naar de bestaande SmtpSettings-vorm. */
export function mailboxToSmtpSettings(mailbox: EmailMailbox): SmtpSettings {
  return {
    enabled: mailbox.smtp.enabled,
    host: mailbox.smtp.host,
    port: mailbox.smtp.port,
    security: mailbox.smtp.security,
    username: mailbox.smtp.username,
    ...(mailbox.smtp.encryptedPassword
      ? { encryptedPassword: mailbox.smtp.encryptedPassword }
      : {}),
    fromName: mailbox.displayName || mailbox.name,
    fromEmail: mailbox.emailAddress,
    replyTo: mailbox.smtp.replyTo,
    adminRecipients: [mailbox.emailAddress],
    testRecipient: mailbox.emailAddress,
  };
}

/** Stabiele Message-ID op het eigen domein van de mailbox. */
export function newMailboxMessageId(mailbox: EmailMailbox): string {
  const domain = mailbox.emailAddress.split("@")[1] || "visualvibe.media";
  return `<${randomUUID()}@${domain}>`;
}

export type MailboxOutgoingMessage = {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  text: string;
  messageId: string;
  inReplyTo?: string;
  references?: string[];
  attachments?: SmtpMailAttachment[];
};

export async function sendFromMailbox(
  mailbox: EmailMailbox,
  message: MailboxOutgoingMessage,
): Promise<SmtpSendResult> {
  return sendSmtpMail(mailboxToSmtpSettings(mailbox), {
    to: message.to,
    ...(message.cc?.length ? { cc: message.cc } : {}),
    ...(message.bcc?.length ? { bcc: message.bcc } : {}),
    subject: message.subject,
    html: message.html,
    text: message.text,
    messageId: message.messageId,
    ...(message.inReplyTo ? { inReplyTo: message.inReplyTo } : {}),
    ...(message.references?.length ? { references: message.references } : {}),
    ...(message.attachments?.length ? { attachments: message.attachments } : {}),
  });
}

export async function verifyMailboxSmtp(
  mailbox: EmailMailbox,
  plaintextPasswordOverride?: string,
): Promise<SmtpVerificationResult> {
  return verifySmtpConnection(mailboxToSmtpSettings(mailbox), {
    ...(plaintextPasswordOverride ? { plaintextPasswordOverride } : {}),
  });
}

/**
 * Bouwt het volledige MIME-bericht (zelfde Message-ID en bijlagen) zodat een
 * kopie via IMAP in de Verzonden-map van de server kan worden bewaard.
 */
export async function buildRawMimeMessage(
  mailbox: EmailMailbox,
  message: MailboxOutgoingMessage,
): Promise<Buffer> {
  const composer = new MailComposer({
    from: { name: mailbox.displayName || mailbox.name, address: mailbox.emailAddress },
    to: message.to,
    ...(message.cc?.length ? { cc: message.cc } : {}),
    ...(message.bcc?.length ? { bcc: message.bcc } : {}),
    ...(mailbox.smtp.replyTo ? { replyTo: mailbox.smtp.replyTo } : {}),
    subject: message.subject,
    html: message.html,
    text: message.text,
    messageId: message.messageId,
    ...(message.inReplyTo ? { inReplyTo: message.inReplyTo } : {}),
    ...(message.references?.length ? { references: message.references.join(" ") } : {}),
    ...(message.attachments?.length
      ? {
          attachments: message.attachments.map((attachment) => ({
            filename: attachment.filename,
            content: attachment.content,
            ...(attachment.contentType ? { contentType: attachment.contentType } : {}),
          })),
        }
      : {}),
  });
  return composer.compile().build();
}

/** Alleen voor verbindingstests met een nog niet opgeslagen wachtwoord. */
export function hasUsableSmtpPassword(mailbox: EmailMailbox): boolean {
  if (!mailbox.smtp.username) return true;
  if (!mailbox.smtp.encryptedPassword) return false;
  try {
    return decryptSmtpPassword(mailbox.smtp.encryptedPassword).length > 0;
  } catch {
    return false;
  }
}
