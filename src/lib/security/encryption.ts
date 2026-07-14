import "server-only";

import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const ENVELOPE_VERSION = "v1";
const IV_BYTES = 12;
const AUTH_TAG_BYTES = 16;
export const SMTP_PASSWORD_AAD = "visualvibe:smtp-password:v1";
export const IMAP_PASSWORD_AAD = "visualvibe:imap-password:v1";
const AI_PROVIDER_IDS = ["gemini", "claude", "openai"] as const;
type EncryptedAiProviderId = (typeof AI_PROVIDER_IDS)[number];

function decodeEncryptionKey(rawValue: string | undefined): Buffer {
  const raw = rawValue?.trim() ?? "";
  if (!raw) {
    throw new Error("APP_ENCRYPTION_KEY ontbreekt in de serveromgeving.");
  }

  let key: Buffer;
  if (/^[a-f\d]{64}$/i.test(raw)) {
    key = Buffer.from(raw, "hex");
  } else if (/^[A-Za-z\d+/]{43}=?$/.test(raw)) {
    key = Buffer.from(raw, "base64");
  } else {
    throw new Error("APP_ENCRYPTION_KEY moet 32 bytes in hex- of base64vorm bevatten.");
  }

  if (key.length !== 32) {
    throw new Error("APP_ENCRYPTION_KEY moet exact 32 bytes bevatten.");
  }
  return key;
}

export function hasValidEncryptionKey(
  keyValue: string | undefined = process.env.APP_ENCRYPTION_KEY,
): boolean {
  try {
    decodeEncryptionKey(keyValue);
    return true;
  } catch {
    return false;
  }
}

function encodePart(value: Buffer): string {
  return value.toString("base64url");
}

function decodePart(value: string, label: string): Buffer {
  if (!value || !/^[A-Za-z\d_-]+$/.test(value)) {
    throw new Error(`Ongeldige versleutelde waarde (${label}).`);
  }
  return Buffer.from(value, "base64url");
}

/** Encrypts a server-side secret into a versioned, authenticated envelope. */
function encryptSecretWithAad(
  plaintext: string,
  aad: string,
  keyValue: string | undefined = process.env.APP_ENCRYPTION_KEY,
): string {
  if (!plaintext) throw new Error("Een lege geheime waarde kan niet worden versleuteld.");

  const key = decodeEncryptionKey(keyValue);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_BYTES });
  cipher.setAAD(Buffer.from(aad, "utf8"));
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [ENVELOPE_VERSION, encodePart(iv), encodePart(tag), encodePart(ciphertext)].join(":");
}

/** Decrypts and authenticates a secret. Tampered envelopes fail closed. */
function decryptSecretWithAad(
  envelope: string,
  aad: string,
  keyValue: string | undefined = process.env.APP_ENCRYPTION_KEY,
): string {
  const [version, ivPart, tagPart, ciphertextPart, ...extra] = envelope.split(":");
  if (version !== ENVELOPE_VERSION || extra.length > 0) {
    throw new Error("Onbekende of ongeldige versleutelde waarde.");
  }

  const key = decodeEncryptionKey(keyValue);
  const iv = decodePart(ivPart, "iv");
  const tag = decodePart(tagPart, "auth tag");
  const ciphertext = decodePart(ciphertextPart, "ciphertext");
  if (iv.length !== IV_BYTES || tag.length !== AUTH_TAG_BYTES || ciphertext.length === 0) {
    throw new Error("Ongeldige versleutelde waarde.");
  }

  try {
    const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_BYTES });
    decipher.setAAD(Buffer.from(aad, "utf8"));
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  } catch {
    throw new Error("De versleutelde waarde kon niet veilig worden ontsleuteld.");
  }
}

export function encryptSecret(
  plaintext: string,
  keyValue: string | undefined = process.env.APP_ENCRYPTION_KEY,
): string {
  return encryptSecretWithAad(plaintext, SMTP_PASSWORD_AAD, keyValue);
}

export function decryptSecret(
  envelope: string,
  keyValue: string | undefined = process.env.APP_ENCRYPTION_KEY,
): string {
  return decryptSecretWithAad(envelope, SMTP_PASSWORD_AAD, keyValue);
}

export const encryptSmtpPassword = encryptSecret;
export const decryptSmtpPassword = decryptSecret;

export function encryptImapPassword(
  plaintext: string,
  keyValue: string | undefined = process.env.APP_ENCRYPTION_KEY,
): string {
  return encryptSecretWithAad(plaintext, IMAP_PASSWORD_AAD, keyValue);
}

export function decryptImapPassword(
  envelope: string,
  keyValue: string | undefined = process.env.APP_ENCRYPTION_KEY,
): string {
  return decryptSecretWithAad(envelope, IMAP_PASSWORD_AAD, keyValue);
}

function aiProviderAad(provider: EncryptedAiProviderId): string {
  if (!AI_PROVIDER_IDS.includes(provider)) {
    throw new Error("Onbekende AI-provider voor versleuteling.");
  }
  return `visualvibe:ai-provider-key:${provider}:v1`;
}

/** Encrypts an AI key with provider-specific authenticated context. */
export function encryptAiProviderKey(
  provider: EncryptedAiProviderId,
  plaintext: string,
  keyValue: string | undefined = process.env.APP_ENCRYPTION_KEY,
): string {
  return encryptSecretWithAad(plaintext, aiProviderAad(provider), keyValue);
}

/** Decrypts an AI key and rejects ciphertext copied between providers. */
export function decryptAiProviderKey(
  provider: EncryptedAiProviderId,
  envelope: string,
  keyValue: string | undefined = process.env.APP_ENCRYPTION_KEY,
): string {
  return decryptSecretWithAad(envelope, aiProviderAad(provider), keyValue);
}

const ANALYSE_KEY_KINDS = ["public", "private"] as const;
type AnalyseKeyKind = (typeof ANALYSE_KEY_KINDS)[number];

function analyseKeyAad(kind: AnalyseKeyKind): string {
  if (!ANALYSE_KEY_KINDS.includes(kind)) {
    throw new Error("Onbekend analysesleuteltype voor versleuteling.");
  }
  return `visualvibe:seo-analyse-key:${kind}:v1`;
}

/** Encrypts a SEO Supercharged widget/partner key with kind-specific context. */
export function encryptAnalyseKey(
  kind: AnalyseKeyKind,
  plaintext: string,
  keyValue: string | undefined = process.env.APP_ENCRYPTION_KEY,
): string {
  return encryptSecretWithAad(plaintext, analyseKeyAad(kind), keyValue);
}

/** Decrypts an analyse key and rejects ciphertext copied between public/private. */
export function decryptAnalyseKey(
  kind: AnalyseKeyKind,
  envelope: string,
  keyValue: string | undefined = process.env.APP_ENCRYPTION_KEY,
): string {
  return decryptSecretWithAad(envelope, analyseKeyAad(kind), keyValue);
}

/**
 * HMAC-SHA256 over `purpose + ":" + value` met de app-sleutel, als base64url.
 * Dit is de ENIGE hashfunctie voor device-, IP- en verificatiecode-hashes:
 * ruwe waarden worden nergens opgeslagen, gelogd of geretourneerd. De purpose
 * werkt als domain-separator zodat hashes uit verschillende contexten nooit
 * onderling vergelijkbaar of herbruikbaar zijn.
 */
export function hmacIdentifier(value: string, purpose: string): string {
  if (!purpose) throw new Error("Een HMAC-purpose is verplicht.");
  const key = decodeEncryptionKey(process.env.APP_ENCRYPTION_KEY);
  return createHmac("sha256", key).update(`${purpose}:${value}`, "utf8").digest("base64url");
}
