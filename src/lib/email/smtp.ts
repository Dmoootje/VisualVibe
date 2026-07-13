import "server-only";

import { lookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";
import { domainToASCII } from "node:url";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { decryptSmtpPassword } from "@/lib/security/encryption";
import type {
  SmtpMailMessage,
  SmtpSendResult,
  SmtpSettings,
} from "@/types/email";

const HEADER_INJECTION = /[\r\n\0]/;
const HOST_LABEL = /^(?!-)[a-z\d-]{1,63}(?<!-)$/i;
const LOCAL_PART = /^[a-z\d.!#$%&'*+/=?^_`{|}~-]+$/i;
const DNS_LOOKUP_TIMEOUT_MS = 10_000;

const NON_PUBLIC_IPV4 = new BlockList();
const NON_PUBLIC_IPV6 = new BlockList();
for (const [network, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const) {
  NON_PUBLIC_IPV4.addSubnet(network, prefix, "ipv4");
}
for (const [network, prefix] of [
  ["::", 96],
  ["::1", 128],
  ["::ffff:0:0", 96],
  ["64:ff9b::", 96],
  ["64:ff9b:1::", 48],
  ["100::", 64],
  ["2001::", 23],
  ["2001:2::", 48],
  ["2001:db8::", 32],
  ["2002::", 16],
  ["3fff::", 20],
  ["fc00::", 7],
  ["fe80::", 10],
  ["fec0::", 10],
  ["ff00::", 8],
] as const) {
  NON_PUBLIC_IPV6.addSubnet(network, prefix, "ipv6");
}

function isPrivateAddress(host: string): boolean {
  const normalized = host.toLowerCase().replace(/^\[|\]$/g, "");
  if (normalized === "localhost" || normalized.endsWith(".localhost") || normalized.endsWith(".local")) {
    return true;
  }
  const version = isIP(normalized);
  return version === 4
    ? NON_PUBLIC_IPV4.check(normalized, "ipv4")
    : version === 6
      ? NON_PUBLIC_IPV6.check(normalized, "ipv6")
      : false;
}

export type SmtpOperationOptions = {
  /** Plaintext is used only for an unsaved admin test and is never persisted. */
  plaintextPasswordOverride?: string;
  allowWhenDisabled?: boolean;
};

export type SmtpVerificationResult = { ok: true };

export class SafeSmtpError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "SafeSmtpError";
  }
}

export function assertSafeHeaderValue(value: string, field: string, maxLength = 250): string {
  const clean = value.trim();
  if (!clean || clean.length > maxLength || HEADER_INJECTION.test(clean)) {
    throw new SafeSmtpError(`${field} bevat een ongeldige waarde.`, "INVALID_HEADER");
  }
  return clean;
}

export function validateMailHost(value: string, field = "Mailserver-host"): string {
  const host = assertSafeHeaderValue(value, field, 253);
  if (/[\s/@\\]/.test(host) || host.includes("://")) {
    throw new SafeSmtpError(`${field} is ongeldig.`, "INVALID_HOST");
  }
  if (isIP(host)) {
    if (isPrivateAddress(host)) {
      throw new SafeSmtpError(`${field} mag geen lokaal of intern adres zijn.`, "PRIVATE_HOST");
    }
    return host;
  }

  const ascii = domainToASCII(host).toLowerCase().replace(/\.$/, "");
  if (!ascii || ascii.length > 253 || !ascii.split(".").every((label) => HOST_LABEL.test(label))) {
    throw new SafeSmtpError(`${field} is ongeldig.`, "INVALID_HOST");
  }
  if (isPrivateAddress(ascii)) {
    throw new SafeSmtpError(`${field} mag geen lokaal of intern adres zijn.`, "PRIVATE_HOST");
  }
  return ascii;
}

export function validateSmtpHost(value: string): string {
  return validateMailHost(value, "SMTP-host");
}

export type ResolvedMailHost = {
  address: string;
  family: 4 | 6;
  servername?: string;
};

/** Resolves once, rejects every non-public answer and returns a pinned address. */
export async function resolvePublicMailHost(host: string): Promise<ResolvedMailHost> {
  const version = isIP(host);
  if (version) {
    if (isPrivateAddress(host)) {
      throw new SafeSmtpError("Mailserver-host mag geen lokaal of intern adres zijn.", "PRIVATE_HOST");
    }
    return { address: host, family: version === 4 ? 4 : 6 };
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;
  const addresses = await Promise.race([
    lookup(host, { all: true, verbatim: true }),
    new Promise<never>((_resolve, reject) => {
      timeout = setTimeout(
        () => reject(new SafeSmtpError("Mailserver-host kon niet tijdig worden gevonden.", "ETIMEDOUT")),
        DNS_LOOKUP_TIMEOUT_MS,
      );
    }),
  ]).finally(() => {
    if (timeout) clearTimeout(timeout);
  });
  if (addresses.length === 0) {
    throw new SafeSmtpError("Mailserver-host kon niet worden gevonden.", "EDNS");
  }
  if (addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new SafeSmtpError(
      "Mailserver-host verwijst naar een lokaal of intern adres.",
      "PRIVATE_HOST",
    );
  }
  const selected = addresses.find(({ family }) => family === 4) ?? addresses[0];
  return {
    address: selected.address,
    family: selected.family === 4 ? 4 : 6,
    servername: host,
  };
}

export function validateEmailAddress(value: string, field = "E-mailadres"): string {
  const email = assertSafeHeaderValue(value, field, 254);
  if (email.includes(",") || email.includes(";") || email.includes("<") || email.includes(">")) {
    throw new SafeSmtpError(`${field} is ongeldig.`, "INVALID_EMAIL");
  }

  const separator = email.lastIndexOf("@");
  if (separator <= 0 || separator === email.length - 1) {
    throw new SafeSmtpError(`${field} is ongeldig.`, "INVALID_EMAIL");
  }
  const local = email.slice(0, separator);
  const rawDomain = email.slice(separator + 1);
  const domain = domainToASCII(rawDomain).toLowerCase();
  if (
    local.length > 64 ||
    !LOCAL_PART.test(local) ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    local.includes("..") ||
    !domain ||
    domain.length > 253 ||
    !domain.includes(".") ||
    !domain.split(".").every((label) => HOST_LABEL.test(label))
  ) {
    throw new SafeSmtpError(`${field} is ongeldig.`, "INVALID_EMAIL");
  }
  return `${local}@${domain}`;
}

function validateRecipients(value: string | string[] | undefined, field: string, required = false): string[] {
  const values = value === undefined ? [] : Array.isArray(value) ? value : [value];
  const result = [...new Set(values.map((email) => validateEmailAddress(email, field)))];
  if (required && result.length === 0) {
    throw new SafeSmtpError(`${field} is verplicht.`, "MISSING_RECIPIENT");
  }
  return result;
}

export function validateSmtpSettings(settings: SmtpSettings, plaintextPasswordOverride?: string): SmtpSettings {
  const port = settings.port;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new SafeSmtpError("SMTP-poort moet tussen 1 en 65535 liggen.", "INVALID_PORT");
  }
  if (!(["none", "ssl", "starttls"] as const).includes(settings.security)) {
    throw new SafeSmtpError("SMTP-beveiliging is ongeldig.", "INVALID_SECURITY");
  }

  const username = settings.username.trim();
  if (username.length > 320 || HEADER_INJECTION.test(username)) {
    throw new SafeSmtpError("SMTP-gebruikersnaam is ongeldig.", "INVALID_USERNAME");
  }
  if (username && settings.security === "none") {
    throw new SafeSmtpError(
      "SMTP-authenticatie vereist SSL/TLS of STARTTLS.",
      "INSECURE_AUTH",
    );
  }
  if (username && !plaintextPasswordOverride && !settings.encryptedPassword) {
    throw new SafeSmtpError("SMTP-wachtwoord ontbreekt.", "MISSING_PASSWORD");
  }

  return {
    ...settings,
    host: validateSmtpHost(settings.host),
    username,
    fromName: assertSafeHeaderValue(settings.fromName, "Afzendernaam"),
    fromEmail: validateEmailAddress(settings.fromEmail, "Afzenderadres"),
    replyTo: settings.replyTo ? validateEmailAddress(settings.replyTo, "Reply-To") : "",
    adminRecipients: validateRecipients(settings.adminRecipients, "Interne ontvanger", true),
    testRecipient: settings.testRecipient
      ? validateEmailAddress(settings.testRecipient, "Testontvanger")
      : "",
  };
}

function safeSmtpError(error: unknown): SafeSmtpError {
  if (error instanceof SafeSmtpError) return error;
  const code =
    error && typeof error === "object" && "code" in error && typeof error.code === "string"
      ? error.code.toUpperCase()
      : "SMTP_ERROR";
  const messages: Record<string, string> = {
    EAUTH: "SMTP-authenticatie is mislukt. Controleer gebruikersnaam en wachtwoord.",
    ETIMEDOUT: "De SMTP-server antwoordde niet binnen de toegestane tijd.",
    ECONNECTION: "Er kon geen verbinding met de SMTP-server worden gemaakt.",
    ECONNREFUSED: "De SMTP-server heeft de verbinding geweigerd.",
    EDNS: "De SMTP-host kon niet worden gevonden.",
    ENOTFOUND: "De SMTP-host kon niet worden gevonden.",
    EENVELOPE: "De SMTP-server weigerde een of meer ontvangers.",
    EMESSAGE: "De SMTP-server weigerde de inhoud van het bericht.",
  };
  return new SafeSmtpError(messages[code] ?? "De SMTP-actie is mislukt.", code);
}

async function createTransport(settings: SmtpSettings, plaintextPasswordOverride?: string) {
  const validated = validateSmtpSettings(settings, plaintextPasswordOverride);
  const resolved = await resolvePublicMailHost(validated.host);
  const password = plaintextPasswordOverride || (
    validated.encryptedPassword ? decryptSmtpPassword(validated.encryptedPassword) : ""
  );
  const auth = validated.username ? { user: validated.username, pass: password } : undefined;

  const options: SMTPTransport.Options = {
    host: resolved.address,
    port: validated.port,
    secure: validated.security === "ssl",
    requireTLS: validated.security === "starttls",
    ignoreTLS: validated.security === "none",
    auth,
    tls: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
      ...(resolved.servername ? { servername: resolved.servername } : {}),
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    logger: false,
    debug: false,
    disableFileAccess: true,
    disableUrlAccess: true,
  };

  return { transporter: nodemailer.createTransport(options), settings: validated };
}

export async function verifySmtpConnection(
  smtp: SmtpSettings,
  options: Pick<SmtpOperationOptions, "plaintextPasswordOverride"> = {},
): Promise<SmtpVerificationResult> {
  let transporter: ReturnType<typeof nodemailer.createTransport> | undefined;
  try {
    ({ transporter } = await createTransport(smtp, options.plaintextPasswordOverride));
    await transporter.verify();
    return { ok: true };
  } catch (error) {
    throw safeSmtpError(error);
  } finally {
    transporter?.close();
  }
}

function stringAddresses(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((address) => String(address));
}

export async function sendSmtpMail(
  smtp: SmtpSettings,
  message: SmtpMailMessage,
  options: SmtpOperationOptions = {},
): Promise<SmtpSendResult> {
  if (!smtp.enabled && !options.allowWhenDisabled) {
    throw new SafeSmtpError("SMTP-verzending is uitgeschakeld.", "SMTP_DISABLED");
  }

  const to = validateRecipients(message.to, "Ontvanger", true);
  const cc = validateRecipients(message.cc, "CC");
  const bcc = validateRecipients(message.bcc, "BCC");
  const replyTo = message.replyTo ? validateEmailAddress(message.replyTo, "Reply-To") : undefined;
  const subject = assertSafeHeaderValue(message.subject, "Onderwerp", 250);
  if (!message.html.trim() || !message.text.trim()) {
    throw new SafeSmtpError("Zowel de HTML- als tekstversie is verplicht.", "INVALID_MESSAGE");
  }
  if (message.messageId) assertSafeHeaderValue(message.messageId, "Message-ID", 250);
  const inReplyTo = message.inReplyTo
    ? assertSafeHeaderValue(message.inReplyTo, "In-Reply-To", 998)
    : undefined;
  const references = message.references?.map((reference) =>
    assertSafeHeaderValue(reference, "References", 998),
  );

  let transporter: ReturnType<typeof nodemailer.createTransport> | undefined;
  try {
    const created = await createTransport(smtp, options.plaintextPasswordOverride);
    transporter = created.transporter;
    const info = await transporter.sendMail({
      from: { name: created.settings.fromName, address: created.settings.fromEmail },
      to,
      ...(cc.length ? { cc } : {}),
      ...(bcc.length ? { bcc } : {}),
      replyTo: replyTo || created.settings.replyTo || undefined,
      subject,
      html: message.html,
      text: message.text,
      ...(message.messageId ? { messageId: message.messageId } : {}),
      ...(inReplyTo ? { inReplyTo } : {}),
      ...(references?.length ? { references } : {}),
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

    return {
      messageId: String(info.messageId ?? ""),
      accepted: stringAddresses(info.accepted),
      rejected: stringAddresses(info.rejected),
      ...(typeof info.response === "string" ? { response: info.response } : {}),
    };
  } catch (error) {
    throw safeSmtpError(error);
  } finally {
    transporter?.close();
  }
}
