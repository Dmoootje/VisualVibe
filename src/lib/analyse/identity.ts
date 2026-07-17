import "server-only";

import { randomUUID, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";
import { hmacIdentifier } from "@/lib/security/encryption";

export const DEVICE_COOKIE_NAME = "vv_device";
/** 400 dagen: het maximum dat browsers (Chrome) voor cookies toestaan. */
export const DEVICE_COOKIE_MAX_AGE_SECONDS = 400 * 24 * 60 * 60;

const UUID_REGEX = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;
const COOKIE_SIGNATURE_PURPOSE = "device-cookie";

function safeStringEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

/**
 * Leest of maakt het device-ID uit de vv_device-cookie. Formaat:
 * "<uuid>.<hmac>", ondertekend met de app-sleutel zodat een bezoeker geen
 * eigen device-ID kan kiezen. Ongeldig of afwezig = nieuw ID + newCookieValue
 * (de API-route zet de cookie zelf HttpOnly/Secure/SameSite=Lax).
 */
export function parseOrCreateDeviceId(
  cookieValue: string | undefined,
): { deviceId: string; newCookieValue?: string } {
  if (cookieValue) {
    const separator = cookieValue.indexOf(".");
    if (separator > 0) {
      const uuid = cookieValue.slice(0, separator).toLowerCase();
      const signature = cookieValue.slice(separator + 1);
      if (UUID_REGEX.test(uuid) && signature) {
        const expected = hmacIdentifier(uuid, COOKIE_SIGNATURE_PURPOSE);
        if (safeStringEqual(signature, expected)) {
          return { deviceId: uuid };
        }
      }
    }
  }

  const deviceId = randomUUID();
  const signature = hmacIdentifier(deviceId, COOKIE_SIGNATURE_PURPOSE);
  return { deviceId, newCookieValue: `${deviceId}.${signature}` };
}

/** Quota-hash van het device-ID; het ruwe ID wordt nooit opgeslagen. */
export function deviceHash(deviceId: string): string {
  return hmacIdentifier(deviceId, "device-quota");
}

/**
 * Bepaalt de IP-hash uit de request-headers. Het ruwe IP wordt hier alleen
 * kortstondig in geheugen gebruikt en NOOIT opgeslagen, gelogd of
 * geretourneerd; alleen de HMAC-hash verlaat deze functie.
 *
 * Firebase App Hosting loopt via de Google External Application Load Balancer.
 * Die voegt rechts in XFF `<client-ip>,<load-balancer-ip>` toe en verklaart
 * alle voorafgaande waarden onbetrouwbaar. Daarom worden uitsluitend de twee
 * laatste posities gevalideerd en is de voorlaatste het quota-IP. X-Real-IP is
 * geen autoriteit. Zie https://cloud.google.com/load-balancing/docs/https#x-forwarded-for_header.
 */
export function ipHashFromRequest(request: Request): string {
  const ip = trustedClientIp(request.headers.get("x-forwarded-for")) ?? "unknown-ip";
  return hmacIdentifier(ip, "ip-quota");
}

function normalizeIp(raw: string): string | null {
  const trimmed = raw.trim();
  const unbracketed = trimmed.startsWith("[") && trimmed.endsWith("]")
    ? trimmed.slice(1, -1)
    : trimmed;
  const version = isIP(unbracketed);
  if (version === 4) return unbracketed;
  if (version !== 6) return null;

  try {
    const hostname = new URL(`http://[${unbracketed}]/`).hostname;
    return hostname.slice(1, -1).toLowerCase();
  } catch {
    return null;
  }
}

function trustedClientIp(forwarded: string | null): string | null {
  if (!forwarded) return null;
  const values = forwarded.split(",").map((value) => value.trim());
  if (values.length < 2) return null;

  const trustedClient = normalizeIp(values.at(-2) ?? "");
  const trustedProxy = normalizeIp(values.at(-1) ?? "");
  return trustedClient && trustedProxy ? trustedClient : null;
}
