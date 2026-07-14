import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import { withTimeout } from "@/lib/firestore/withTimeout";
import {
  DEFAULT_OPENING_HOURS,
  DEFAULT_SITE_SETTINGS,
  type OpeningHoursDay,
  type SiteSettings,
} from "@/types/siteSettings";

const COLLECTION = "site_settings";
const SETTINGS_ID = "default";
const CANONICAL_EMAIL = "info@visualvibe.media";
const CANONICAL_PHONE = "+32472964599";
const LEGACY_EMAILS = new Set([
  "hello@visualvibe.be",
  "podcasting.info@visualvibe.media",
]);

function toOpeningHours(value: unknown): OpeningHoursDay[] {
  if (!Array.isArray(value) || value.length === 0) return DEFAULT_OPENING_HOURS;
  return value.map((raw) => {
    const day = (raw ?? {}) as Partial<OpeningHoursDay>;
    return {
      day: String(day.day ?? ""),
      label: String(day.label ?? ""),
      isOpen: Boolean(day.isOpen),
      openTime: String(day.openTime ?? ""),
      closeTime: String(day.closeTime ?? ""),
      pauseStart: String(day.pauseStart ?? ""),
      pauseEnd: String(day.pauseEnd ?? ""),
      note: String(day.note ?? ""),
    };
  });
}

function normalizeEmail(value: string): string {
  return LEGACY_EMAILS.has(value.trim().toLowerCase()) ? CANONICAL_EMAIL : value;
}

function normalizePhone(value: string | undefined): string | undefined {
  if (!value) return value;
  const compact = value.replace(/[\s().-]/g, "");
  return compact === "0235296023" ? CANONICAL_PHONE : value;
}

function normalizeLegacyContactSettings(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    mainEmail: normalizeEmail(settings.mainEmail),
    leadNotificationEmail: normalizeEmail(settings.leadNotificationEmail),
    phone: normalizePhone(settings.phone),
    mobilePhone: normalizePhone(settings.mobilePhone),
    whatsapp: normalizePhone(settings.whatsapp),
  };
}

/**
 * Reads the singleton site settings. Resilient by design: if the doc is missing
 * or Firestore is unreachable (e.g. no credentials at build time) it returns the
 * defaults, so public pages never crash or render empty contact details.
 */
async function readSiteSettings(): Promise<SiteSettings> {
  const now = new Date().toISOString();
  const base: SiteSettings = {
    id: SETTINGS_ID,
    ...DEFAULT_SITE_SETTINGS,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const doc = await withTimeout(adminDb.collection(COLLECTION).doc(SETTINGS_ID).get());
    if (!doc.exists) return base;

    const data = doc.data()!;
    const { createdAt, updatedAt, openingHours, ...rest } = data;

    const merged: SiteSettings = {
      ...base,
      ...(rest as Partial<SiteSettings>),
      openingHours: toOpeningHours(openingHours),
      createdAt: createdAt?.toDate?.().toISOString() ?? now,
      updatedAt: updatedAt?.toDate?.().toISOString() ?? now,
    };

    // A cleared number is stored as null; surface it as "unset" (undefined) so
    // the admin field shows empty and consumers get a proper number | undefined.
    if (typeof merged.latitude !== "number") merged.latitude = undefined;
    if (typeof merged.longitude !== "number") merged.longitude = undefined;

    // Older admin values are normalised immediately for the public site and the
    // contact settings form. Saving the form afterwards persists the new values.
    return normalizeLegacyContactSettings(merged);
  } catch {
    return base;
  }
}

/** Cached per request so the footer, schema and page share a single read. */
export const getSiteSettings = cache(readSiteSettings);

// null is allowed so a cleared numeric field can be written to Firestore (a
// present value that overrides the default) instead of being dropped.
export type UpdateSiteSettingsInput = {
  [K in keyof Omit<SiteSettings, "id" | "createdAt" | "updatedAt">]?: SiteSettings[K] | null;
};

/** Drops undefined values so Firestore never receives them. */
function stripUndefined<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

export async function updateSiteSettings(input: UpdateSiteSettingsInput): Promise<void> {
  const ref = adminDb.collection(COLLECTION).doc(SETTINGS_ID);
  const doc = await ref.get();
  const now = new Date();
  const clean = stripUndefined(input);

  if (!doc.exists) {
    await ref.set({ ...DEFAULT_SITE_SETTINGS, ...clean, createdAt: now, updatedAt: now });
  } else {
    await ref.update({ ...clean, updatedAt: now });
  }
}
