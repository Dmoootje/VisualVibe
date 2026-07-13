import "server-only";

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { domainToASCII } from "node:url";

export type NormalizedUrl =
  | { ok: true; submittedUrl: string; normalizedDomain: string; safeUrl: string }
  | { ok: false; reason: string };

const DNS_TIMEOUT_MS = 3_000;

// Hostnamen die nooit geanalyseerd mogen worden, ook al lossen ze publiek op.
const BLOCKED_HOSTNAMES = new Set(["localhost", "metadata.google.internal"]);
const BLOCKED_HOST_SUFFIXES = [".localhost", ".local", ".internal", ".lan"];

function fail(reason: string): NormalizedUrl {
  return { ok: false, reason };
}

function isPrivateIpv4(octets: number[]): boolean {
  const [a, b] = octets;
  return (
    a === 0 || // 0.0.0.0/8
    a === 10 || // 10.0.0.0/8
    a === 127 || // loopback
    (a === 100 && b >= 64 && b <= 127) || // 100.64.0.0/10 (CGNAT)
    (a === 169 && b === 254) || // link-local + cloud-metadata (169.254.169.254)
    (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
    (a === 192 && b === 168) || // 192.168.0.0/16
    (a === 198 && (b === 18 || b === 19)) || // benchmark-range
    a >= 224 // multicast/reserved/broadcast
  );
}

/**
 * Controleert of een IP-adres (v4 of v6, met of zonder brackets) in een
 * private, loopback, link-local of metadata-range valt. ::ffff:-gemapte
 * v4-adressen worden als v4 herbeoordeeld zodat die route niet omzeilbaar is.
 */
export function isPrivateIpAddress(address: string): boolean {
  const normalized = address.trim().toLowerCase().replace(/^\[|\]$/g, "");
  if (!normalized) return true;

  const version = isIP(normalized);
  if (version === 4) {
    const octets = normalized.split(".").map(Number);
    if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
      return true;
    }
    return isPrivateIpv4(octets);
  }

  if (version === 6) {
    // Zone-index (fe80::1%eth0) weghalen voor de prefixcontrole.
    const bare = normalized.split("%")[0];
    if (bare === "::" || bare === "::1") return true; // unspecified + loopback
    if (/^(?:fc|fd)/.test(bare)) return true; // fc00::/7 (unique local)
    if (/^fe[89ab]/.test(bare)) return true; // fe80::/10 (link-local)
    // ::ffff:-gemapte v4 (zowel dotted als hex-vorm) als v4 herchecken.
    const mapped = bare.match(/^::ffff:(.+)$/);
    if (mapped) {
      const rest = mapped[1];
      if (isIP(rest) === 4) return isPrivateIpAddress(rest);
      const hexGroups = rest.match(/^([a-f\d]{1,4}):([a-f\d]{1,4})$/);
      if (hexGroups) {
        const high = parseInt(hexGroups[1], 16);
        const low = parseInt(hexGroups[2], 16);
        return isPrivateIpv4([high >> 8, high & 0xff, low >> 8, low & 0xff]);
      }
      return true; // onherkenbare mapped-vorm: veilig blokkeren
    }
    return false;
  }

  // Geen geldig IP: behandel als verdacht zodat aanroepers veilig falen.
  return true;
}

function isBlockedHostname(host: string): boolean {
  if (BLOCKED_HOSTNAMES.has(host)) return true;
  return BLOCKED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

async function lookupAllAddresses(host: string): Promise<string[] | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const results = await Promise.race([
      lookup(host, { all: true }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("DNS_TIMEOUT")), DNS_TIMEOUT_MS);
      }),
    ]);
    return results.map((entry) => entry.address);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Normaliseert en valideert een door de bezoeker opgegeven website-URL voor de
 * analyse. Faalt gesloten: alles wat naar een intern adres kan wijzen (IP-
 * literal, verboden hostnaam of DNS-resolutie naar een private range) wordt
 * geweigerd met een Nederlandstalige reden.
 */
export async function normalizeAndValidateUrl(raw: string): Promise<NormalizedUrl> {
  const submittedUrl = raw.trim();
  if (!submittedUrl) return fail("Vul een websiteadres in.");
  if (submittedUrl.length > 2048) return fail("Het websiteadres is te lang.");

  // Alleen http/https; elk ander schema (javascript:, file:, ftp:, ...) weigeren.
  let candidate = submittedUrl;
  if (!/^https?:\/\//i.test(candidate)) {
    if (/^[a-z][a-z\d+.-]*:\/\//i.test(candidate)) {
      return fail("Alleen http- en https-adressen zijn toegestaan.");
    }
    candidate = `https://${candidate}`;
  }

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return fail("Dit is geen geldig websiteadres.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return fail("Alleen http- en https-adressen zijn toegestaan.");
  }
  if (url.username || url.password) {
    return fail("Een websiteadres met inloggegevens is niet toegestaan.");
  }
  if (url.port && url.port !== "80" && url.port !== "443") {
    return fail("Een websiteadres met een aangepaste poort is niet toegestaan.");
  }

  let host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (!host) return fail("Dit is geen geldig websiteadres.");

  const bareHost = host.replace(/^\[|\]$/g, "");
  if (isIP(bareHost)) {
    if (isPrivateIpAddress(bareHost)) {
      return fail("Interne of lokale IP-adressen zijn niet toegestaan.");
    }
    // Publieke IP-literal: toegestaan maar zonder www-strip of punycode.
    return {
      ok: true,
      submittedUrl,
      normalizedDomain: bareHost,
      safeUrl: `https://${host}`,
    };
  }

  // Internationale domeinnamen naar punycode zodat blocklists en DNS kloppen.
  const ascii = domainToASCII(host).toLowerCase().replace(/\.$/, "");
  if (!ascii || ascii.length > 253) return fail("Dit is geen geldig domein.");
  host = ascii;

  if (isBlockedHostname(host)) {
    return fail("Dit domein is niet toegestaan.");
  }
  if (!host.includes(".")) {
    return fail("Dit is geen geldig domein.");
  }

  const addresses = await lookupAllAddresses(host);
  if (!addresses || addresses.length === 0) {
    return fail("Domein niet gevonden.");
  }
  if (addresses.some((address) => isPrivateIpAddress(address))) {
    return fail("Dit domein verwijst naar een intern adres en is niet toegestaan.");
  }

  const normalizedDomain = host.startsWith("www.") ? host.slice(4) : host;
  if (!normalizedDomain || !normalizedDomain.includes(".")) {
    return fail("Dit is geen geldig domein.");
  }

  return {
    ok: true,
    submittedUrl,
    normalizedDomain,
    safeUrl: `https://${host}`,
  };
}
