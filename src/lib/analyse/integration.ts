import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import {
  decryptAnalyseKey,
  encryptAnalyseKey,
  hasValidEncryptionKey,
} from "@/lib/security/encryption";
import {
  DEFAULT_ANALYSIS_API_BASE_URL,
  DEFAULT_ANALYSIS_MODE,
  DEFAULT_ANALYSIS_PUBLIC_KEY,
  DEFAULT_ANALYSIS_WIDGET_SCRIPT_URL,
  isAnalysisMode,
  type AnalysisIntegrationAdminView,
  type AnalysisIntegrationPublic,
  type AnalysisIntegrationRuntime,
  type AnalysisIntegrationUpdate,
  type AnalysisMode,
} from "@/types/analysis";

// De integratie leeft als sub-object `integration` in hetzelfde singleton als de
// quota-config (analysis_settings/default), zodat beide beheerpanelen dezelfde
// doc delen. Alle schrijf- en leesacties raken uitsluitend het integration-veld;
// de quota-velden blijven ongemoeid.
const COLLECTION = "analysis_settings";
const SETTINGS_ID = "default";

type StoredIntegration = {
  mode: AnalysisMode;
  encryptedPublicKey?: string;
  publicKeyHint?: string;
  encryptedPrivateKey?: string;
  privateKeyHint?: string;
  partnerSiteId?: number;
  widgetScriptUrl?: string;
  apiBaseUrl?: string;
};

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function integrationFromData(
  rawData: FirebaseFirestore.DocumentData | undefined,
): StoredIntegration {
  const data =
    rawData?.integration && typeof rawData.integration === "object"
      ? (rawData.integration as Record<string, unknown>)
      : {};
  const encryptedPublicKey = stringValue(data.encryptedPublicKey);
  const encryptedPrivateKey = stringValue(data.encryptedPrivateKey);
  const publicKeyHint = stringValue(data.publicKeyHint).slice(-4);
  const privateKeyHint = stringValue(data.privateKeyHint).slice(-4);
  const widgetScriptUrl = stringValue(data.widgetScriptUrl);
  const apiBaseUrl = stringValue(data.apiBaseUrl);
  const rawPartnerSiteId = Number(data.partnerSiteId);
  const partnerSiteId =
    Number.isInteger(rawPartnerSiteId) && rawPartnerSiteId > 0 ? rawPartnerSiteId : undefined;
  return {
    mode: isAnalysisMode(data.mode) ? data.mode : DEFAULT_ANALYSIS_MODE,
    ...(encryptedPublicKey ? { encryptedPublicKey } : {}),
    ...(publicKeyHint ? { publicKeyHint } : {}),
    ...(encryptedPrivateKey ? { encryptedPrivateKey } : {}),
    ...(privateKeyHint ? { privateKeyHint } : {}),
    ...(partnerSiteId ? { partnerSiteId } : {}),
    ...(widgetScriptUrl ? { widgetScriptUrl } : {}),
    ...(apiBaseUrl ? { apiBaseUrl } : {}),
  };
}

async function readStoredIntegration(): Promise<StoredIntegration> {
  try {
    const snapshot = await adminDb.collection(COLLECTION).doc(SETTINGS_ID).get();
    return integrationFromData(snapshot.data());
  } catch {
    // Firestore onbereikbaar (bv. build zonder credentials): val terug op de
    // veilige standaard zodat de analysepagina nooit crasht op configuratie.
    return { mode: DEFAULT_ANALYSIS_MODE };
  }
}

/** Alleen gemaskeerde/geconfigureerde staat; ciphertext verlaat deze module nooit. */
export async function getAnalysisIntegrationAdminView(): Promise<AnalysisIntegrationAdminView> {
  const stored = await readStoredIntegration();
  const hasPublic = Boolean(stored.encryptedPublicKey);
  const hasPrivate = Boolean(stored.encryptedPrivateKey);
  return {
    mode: stored.mode,
    encryptionConfigured: hasValidEncryptionKey(),
    publicKeyConfigured: hasPublic,
    publicKeyHint: hasPublic ? stored.publicKeyHint ?? "" : "",
    privateKeyConfigured: hasPrivate,
    privateKeyHint: hasPrivate ? stored.privateKeyHint ?? "" : "",
    partnerSiteId: stored.partnerSiteId ?? null,
    widgetScriptUrl: stored.widgetScriptUrl || DEFAULT_ANALYSIS_WIDGET_SCRIPT_URL,
    apiBaseUrl: stored.apiBaseUrl || DEFAULT_ANALYSIS_API_BASE_URL,
  };
}

/**
 * Volledige server-side runtime met ontsleutelde sleutels. Gooit nooit: een
 * onbruikbare ciphertext levert een lege sleutel op zodat de aanroeper defensief
 * kan afronden. De public key valt terug op de bestaande live testsleutel.
 */
export async function getAnalysisIntegrationRuntime(): Promise<AnalysisIntegrationRuntime> {
  const stored = await readStoredIntegration();

  let publicKey = "";
  if (stored.encryptedPublicKey) {
    try {
      publicKey = decryptAnalyseKey("public", stored.encryptedPublicKey).trim();
    } catch {
      publicKey = "";
    }
  }

  let privateKey = "";
  if (stored.encryptedPrivateKey) {
    try {
      privateKey = decryptAnalyseKey("private", stored.encryptedPrivateKey).trim();
    } catch {
      privateKey = "";
    }
  }

  return {
    mode: stored.mode,
    publicKey: publicKey || DEFAULT_ANALYSIS_PUBLIC_KEY,
    privateKey,
    partnerSiteId: stored.partnerSiteId ?? null,
    widgetScriptUrl: stored.widgetScriptUrl || DEFAULT_ANALYSIS_WIDGET_SCRIPT_URL,
    apiBaseUrl: stored.apiBaseUrl || DEFAULT_ANALYSIS_API_BASE_URL,
  };
}

/** Client-veilige subset voor de publieke pagina; bevat nooit de private key. */
export async function getAnalysisIntegrationPublic(): Promise<AnalysisIntegrationPublic> {
  const runtime = await getAnalysisIntegrationRuntime();
  return {
    mode: runtime.mode,
    publicKey: runtime.publicKey,
    widgetScriptUrl: runtime.widgetScriptUrl,
  };
}

function validateKey(label: string, value: string): string {
  const key = value.trim();
  if (!key) return "";
  if (key.length > 512 || /\s/.test(key)) {
    throw new Error(`De ${label} is ongeldig.`);
  }
  return key;
}

function validateUrl(label: string, value: string, fallback: string): string {
  const raw = value.trim();
  if (!raw) return fallback;
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`De ${label} is geen geldige URL.`);
  }
  if (parsed.protocol !== "https:") {
    throw new Error(`De ${label} moet met https:// beginnen.`);
  }
  return raw.replace(/\/+$/, "");
}

/**
 * Slaat modus, sleutels en URLs op. Lege sleutelvelden behouden de bestaande
 * ciphertext; een remove-vlag verwijdert de sleutel (inclusief hint). Alleen het
 * integration-veld wordt met merge geschreven, dus de quota-config blijft intact.
 */
export async function updateAnalysisIntegration(
  input: AnalysisIntegrationUpdate,
  updatedBy?: string,
): Promise<void> {
  if (!isAnalysisMode(input.mode)) {
    throw new Error("Kies een geldige analysemodus.");
  }

  const publicKey = validateKey("public key", input.publicKey ?? "");
  const privateKey = validateKey("private key", input.privateKey ?? "");
  const partnerSiteId = input.partnerSiteId ?? null;
  if (
    input.mode === "api" &&
    (!Number.isInteger(partnerSiteId) || partnerSiteId === null || partnerSiteId <= 0)
  ) {
    throw new Error("Vul een geldig Partner site-ID in voor de directe API.");
  }
  if (publicKey && input.removePublicKey) {
    throw new Error("Kies voor de public key tussen vervangen of verwijderen.");
  }
  if (privateKey && input.removePrivateKey) {
    throw new Error("Kies voor de private key tussen vervangen of verwijderen.");
  }

  const widgetScriptUrl = validateUrl(
    "widget-script-URL",
    input.widgetScriptUrl ?? "",
    DEFAULT_ANALYSIS_WIDGET_SCRIPT_URL,
  );
  const apiBaseUrl = validateUrl("API-base-URL", input.apiBaseUrl ?? "", DEFAULT_ANALYSIS_API_BASE_URL);

  const integration: Record<string, unknown> = {
    mode: input.mode,
    widgetScriptUrl,
    apiBaseUrl,
    partnerSiteId,
    updatedAt: new Date().toISOString(),
    ...(updatedBy ? { updatedBy } : {}),
  };

  if (input.removePublicKey) {
    integration.encryptedPublicKey = FieldValue.delete();
    integration.publicKeyHint = FieldValue.delete();
  } else if (publicKey) {
    integration.encryptedPublicKey = encryptAnalyseKey("public", publicKey);
    integration.publicKeyHint = publicKey.slice(-4);
  }

  if (input.removePrivateKey) {
    integration.encryptedPrivateKey = FieldValue.delete();
    integration.privateKeyHint = FieldValue.delete();
  } else if (privateKey) {
    integration.encryptedPrivateKey = encryptAnalyseKey("private", privateKey);
    integration.privateKeyHint = privateKey.slice(-4);
  }

  await adminDb.collection(COLLECTION).doc(SETTINGS_ID).set({ integration }, { merge: true });
}
