import "server-only";

import { resolve4, resolveMx } from "node:dns/promises";
import { isDisposableEmailDomain } from "@/config/disposableEmailDomains";

export type NormalizedEmail =
  | { ok: true; email: string; emailNormalized: string; domain: string }
  | { ok: false; reason: "invalid" | "disposable" };

// Praktische e-mailregex: local-part met de gangbare tekens, domein met
// minstens een punt en geldige labels. Bewust geen exotische quoted locals.
const EMAIL_REGEX =
  /^[a-z\d.!#$%&'*+/=?^_`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)+$/i;

const DNS_TIMEOUT_MS = 3_000;

/**
 * Normaliseert het e-mailadres voor de analyseflow. Het volledige adres wordt
 * lowercase voor emailNormalized; punten en plus-aliassen blijven bewust staan
 * (quota per exact adres, geen aannames over providergedrag).
 */
export function normalizeAnalysisEmail(raw: string): NormalizedEmail {
  const email = raw.trim();
  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return { ok: false, reason: "invalid" };
  }

  const emailNormalized = email.toLowerCase();
  const separator = emailNormalized.lastIndexOf("@");
  const local = emailNormalized.slice(0, separator);
  const domain = emailNormalized.slice(separator + 1);
  if (local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..")) {
    return { ok: false, reason: "invalid" };
  }
  if (isDisposableEmailDomain(domain)) {
    return { ok: false, reason: "disposable" };
  }

  return { ok: true, email, emailNormalized, domain };
}

/** Vlag voor "definitief geen records" tegenover een tijdelijke DNS-storing. */
function isDefinitiveDnsMiss(error: unknown): boolean {
  const code =
    error && typeof error === "object" && "code" in error && typeof error.code === "string"
      ? error.code
      : "";
  return code === "ENOTFOUND" || code === "ENODATA";
}

async function withDnsTimeout<T>(work: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("DNS_TIMEOUT")), DNS_TIMEOUT_MS);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * MX-controle van het e-maildomein. "invalid" alleen wanneer er aantoonbaar
 * geen MX- en geen A-records zijn; elke DNS-fout of timeout geeft "unknown"
 * zodat een DNS-storing nooit een geldige aanvraag blokkeert.
 */
export async function checkEmailDomainMx(domain: string): Promise<"ok" | "unknown" | "invalid"> {
  const host = domain.trim().toLowerCase().replace(/\.$/, "");
  if (!host) return "invalid";

  try {
    const records = await withDnsTimeout(resolveMx(host));
    if (records.length > 0) return "ok";
  } catch (error) {
    if (!isDefinitiveDnsMiss(error)) return "unknown";
  }

  // Geen MX-records: sommige (kleine) domeinen ontvangen mail via het A-record.
  try {
    const addresses = await withDnsTimeout(resolve4(host));
    return addresses.length > 0 ? "ok" : "invalid";
  } catch (error) {
    return isDefinitiveDnsMiss(error) ? "invalid" : "unknown";
  }
}
