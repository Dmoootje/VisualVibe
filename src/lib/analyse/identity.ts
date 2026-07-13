import "server-only";

import { randomUUID, timingSafeEqual } from "node:crypto";
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
 * TRUST-AANNAME: X-Forwarded-For / X-Real-IP worden vertrouwd zoals de hosting
 * (Firebase App Hosting / Vercel) ze aanlevert. Deze headers zijn door een
 * client vrij te zetten wanneer de app direct benaderbaar is; het IP-quotum is
 * daarom bewust een AANVULLENDE controle (nooit de enige blokkade, cf. de
 * opdracht) bovenop de niet-spoofbare e-mailverificatie- en devicelimieten.
 * Voor harde IP-limieten hoort de trusted-proxy/client-IP-config op
 * platformniveau te staan.
 */
export function ipHashFromRequest(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const first = forwarded?.split(",")[0]?.trim() || realIp?.trim() || "";
  if (!first) return undefined;

  const ip = first.toLowerCase().replace(/^\[|\]$/g, "");
  if (!ip) return undefined;
  return hmacIdentifier(ip, "ip-quota");
}
