import "server-only";

import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import {
  DEFAULT_ANALYSIS_QUOTA_CONFIG,
  type AnalysisQuotaConfig,
} from "@/types/analysis";

const COLLECTION = "analysis_settings";
const SETTINGS_ID = "default";

const NUMERIC_KEYS = [
  "maxPerEmail90d",
  "maxPerDevice90d",
  "maxPerIp24h",
  "maxPerIp30d",
  "maxCodesPerEmailPerHour",
  "duplicateWindowMinutes",
  "codeTtlMinutes",
  "maxCodeAttempts",
] as const satisfies readonly (keyof AnalysisQuotaConfig)[];

type NumericKey = (typeof NUMERIC_KEYS)[number];

function mergeWithDefaults(data: Record<string, unknown> | undefined): AnalysisQuotaConfig {
  const merged: AnalysisQuotaConfig = { ...DEFAULT_ANALYSIS_QUOTA_CONFIG };
  if (!data) return merged;

  if (typeof data.enabled === "boolean") merged.enabled = data.enabled;
  for (const key of NUMERIC_KEYS) {
    const value = data[key];
    if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
      merged[key] = value;
    }
  }
  return merged;
}

async function readAnalysisQuotaConfig(): Promise<AnalysisQuotaConfig> {
  try {
    const doc = await adminDb.collection(COLLECTION).doc(SETTINGS_ID).get();
    return mergeWithDefaults(doc.exists ? doc.data() : undefined);
  } catch {
    // Firestore onbereikbaar (bv. build zonder credentials): val terug op de
    // defaults zodat de analyseflow nooit crasht op configuratie.
    return { ...DEFAULT_ANALYSIS_QUOTA_CONFIG };
  }
}

/** Per request gecachet zodat route + quota + verificatie een read delen. */
export const getAnalysisQuotaConfig = cache(readAnalysisQuotaConfig);

/**
 * Werkt de quota-instellingen bij (admin). Alleen gehele getallen >= 0 worden
 * geaccepteerd; ongeldige invoer geeft een fout in plaats van stille clamping.
 */
export async function updateAnalysisQuotaConfig(
  input: Partial<AnalysisQuotaConfig>,
  updatedBy?: string,
): Promise<AnalysisQuotaConfig> {
  const patch: Partial<AnalysisQuotaConfig> = {};

  if (input.enabled !== undefined) {
    if (typeof input.enabled !== "boolean") {
      throw new Error("De instelling 'enabled' moet een boolean zijn.");
    }
    patch.enabled = input.enabled;
  }
  for (const key of NUMERIC_KEYS) {
    const value = input[key];
    if (value === undefined) continue;
    if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
      throw new Error(`De instelling '${key}' moet een geheel getal van 0 of hoger zijn.`);
    }
    patch[key as NumericKey] = value;
  }

  const ref = adminDb.collection(COLLECTION).doc(SETTINGS_ID);
  return adminDb.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    const merged = mergeWithDefaults(doc.exists ? doc.data() : undefined);
    const next: AnalysisQuotaConfig = { ...merged, ...patch };

    transaction.set(
      ref,
      {
        ...next,
        updatedAt: new Date().toISOString(),
        ...(updatedBy ? { updatedBy } : {}),
      },
      { merge: true },
    );
    return next;
  });
}
