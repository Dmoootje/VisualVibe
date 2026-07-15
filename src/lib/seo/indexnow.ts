import "server-only";

import { randomBytes } from "node:crypto";
import { adminDb } from "@/lib/firebase/admin";
import { businessConfig } from "@/config/business.config";
import type {
  IndexNowSettingsAdminView,
  IndexNowSubmissionRecord,
  IndexNowSubmitResult,
} from "@/types/indexnow";

const COLLECTION = "indexnow_settings";
const SETTINGS_ID = "default";

// De gedeelde endpoint verdeelt de ping over alle deelnemende zoekmachines, dus
// een enkele aanroep bereikt Bing, Yandex, Seznam, Naver en Yep tegelijk.
const ENDPOINT = "https://api.indexnow.org/indexnow";

// IndexNow accepteert maximaal 10.000 URL's per verzoek.
const MAX_URLS_PER_REQUEST = 10000;

// IndexNow-sleutels mogen 8-128 tekens zijn: a-z, A-Z, 0-9 en streepjes.
const KEY_PATTERN = /^[a-zA-Z0-9-]{8,128}$/;

function siteHost(): string {
  return new URL(businessConfig.url).host;
}

function keyFileUrl(key: string): string {
  return `${businessConfig.url}/${key}.txt`;
}

/** Genereert een nieuwe, geldige IndexNow-sleutel (32 hex-tekens). */
export function generateIndexNowKey(): string {
  return randomBytes(16).toString("hex");
}

export function isValidIndexNowKey(key: string): boolean {
  return KEY_PATTERN.test(key);
}

type StoredIndexNow = {
  key: string;
  lastSubmission: IndexNowSubmissionRecord | null;
};

function submissionFromData(value: unknown): IndexNowSubmissionRecord | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  const submittedAt = typeof data.submittedAt === "string" ? data.submittedAt : "";
  if (!submittedAt) return null;
  return {
    submittedAt,
    urlCount: typeof data.urlCount === "number" ? data.urlCount : 0,
    ok: data.ok === true,
    statusCode: typeof data.statusCode === "number" ? data.statusCode : 0,
    message: typeof data.message === "string" ? data.message : "",
  };
}

async function readStored(): Promise<StoredIndexNow> {
  try {
    const snapshot = await adminDb.collection(COLLECTION).doc(SETTINGS_ID).get();
    const data = snapshot.data() ?? {};
    const key = typeof data.key === "string" ? data.key.trim() : "";
    return {
      key: isValidIndexNowKey(key) ? key : "",
      lastSubmission: submissionFromData(data.lastSubmission),
    };
  } catch {
    // Firestore onbereikbaar (bv. build zonder credentials): val veilig terug op
    // een lege staat zodat het sleutelbestand en de pagina nooit crashen.
    return { key: "", lastSubmission: null };
  }
}

/** De ruwe sleutel, gebruikt door het sleutelbestand en de aanmelding. "" als er geen is. */
export async function getIndexNowKey(): Promise<string> {
  const stored = await readStored();
  return stored.key;
}

/** Afgeleide, veilige staat voor het beheerpaneel. */
export async function getIndexNowSettingsAdminView(): Promise<IndexNowSettingsAdminView> {
  const stored = await readStored();
  return {
    keyConfigured: Boolean(stored.key),
    key: stored.key,
    keyFileUrl: stored.key ? keyFileUrl(stored.key) : "",
    host: siteHost(),
    endpoint: ENDPOINT,
    lastSubmission: stored.lastSubmission,
  };
}

/**
 * Stelt de sleutel in. `auto` (of een lege sleutel) genereert een nieuwe; anders
 * wordt de aangeleverde sleutel gevalideerd en opgeslagen. Retourneert de sleutel.
 */
export async function setIndexNowKey(
  input: { key?: string; auto?: boolean },
  updatedBy?: string,
): Promise<string> {
  const manual = (input.key ?? "").trim();
  let key: string;
  if (input.auto || !manual) {
    key = generateIndexNowKey();
  } else {
    if (!isValidIndexNowKey(manual)) {
      throw new Error(
        "Een IndexNow-sleutel mag alleen letters, cijfers en streepjes bevatten (8-128 tekens).",
      );
    }
    key = manual;
  }

  await adminDb.collection(COLLECTION).doc(SETTINGS_ID).set(
    {
      key,
      updatedAt: new Date().toISOString(),
      ...(updatedBy ? { updatedBy } : {}),
    },
    { merge: true },
  );
  return key;
}

async function recordSubmission(record: IndexNowSubmissionRecord): Promise<void> {
  try {
    await adminDb
      .collection(COLLECTION)
      .doc(SETTINGS_ID)
      .set({ lastSubmission: record }, { merge: true });
  } catch {
    // Het loggen van de aanmelding mag de aanmelding zelf nooit doen mislukken.
  }
}

/**
 * Meldt een lijst URL's aan bij IndexNow. Werkt alleen wanneer het
 * sleutelbestand publiek bereikbaar is op de live host, dus lokaal geeft de
 * endpoint doorgaans 403/422. Batcht per 10.000 URL's.
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<IndexNowSubmitResult> {
  const key = await getIndexNowKey();
  if (!key) {
    return { ok: false, statusCode: 0, urlCount: 0, message: "Er is nog geen IndexNow-sleutel ingesteld." };
  }

  const unique = Array.from(new Set(urls.filter((url) => typeof url === "string" && url.length > 0)));
  if (unique.length === 0) {
    return { ok: false, statusCode: 0, urlCount: 0, message: "Er zijn geen URL's om aan te melden." };
  }

  const host = siteHost();
  const keyLocation = keyFileUrl(key);
  let lastStatus = 0;
  let failure = "";

  for (let index = 0; index < unique.length; index += MAX_URLS_PER_REQUEST) {
    const batch = unique.slice(index, index + MAX_URLS_PER_REQUEST);
    let response: Response;
    try {
      response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host, key, keyLocation, urlList: batch }),
        cache: "no-store",
      });
    } catch (error) {
      failure = error instanceof Error ? error.message : "Netwerkfout bij IndexNow.";
      break;
    }

    lastStatus = response.status;
    // 200 = ontvangen en verwerkt, 202 = ontvangen (sleutelvalidatie loopt nog).
    if (response.status !== 200 && response.status !== 202) {
      failure = `IndexNow gaf status ${response.status}.`;
      break;
    }
  }

  const ok = failure === "";
  const record: IndexNowSubmissionRecord = {
    submittedAt: new Date().toISOString(),
    urlCount: unique.length,
    ok,
    statusCode: lastStatus,
    message: ok
      ? `${unique.length} URL's aangemeld bij IndexNow (status ${lastStatus}).`
      : failure,
  };
  await recordSubmission(record);

  return { ok, statusCode: lastStatus, urlCount: unique.length, message: record.message };
}

/** Meldt de volledige sitemap (alle canonieke, indexeerbare URL's) aan. */
export async function submitAllToIndexNow(): Promise<IndexNowSubmitResult> {
  // Dynamisch geïmporteerd zodat het sleutelbestand-endpoint niet de volledige
  // datagraaf (diensten, regio's, kennisbank, Firestore) hoeft te bundelen.
  const { getIndexableUrls } = await import("@/lib/seo/siteUrls");
  const urls = await getIndexableUrls();
  return submitUrlsToIndexNow(urls);
}
