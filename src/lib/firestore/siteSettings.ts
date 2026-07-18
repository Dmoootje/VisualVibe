import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import { withTimeout } from "@/lib/firestore/withTimeout";
import {
  DEFAULT_OPENING_HOURS,
  DEFAULT_SITE_SETTINGS,
  type OpeningHoursDay,
  type SiteSettings,
} from "@/types/siteSettings";
import type { SupportedLocale } from "@/i18n/locales";
import { mergeDutchRecords, mergeDutchVisitorFields, readLocalizedOptional, readLocalizedRequired } from "./localizedContent";

const COLLECTION = "site_settings";
const SETTINGS_ID = "default";
const CANONICAL_EMAIL = "info@visualvibe.media";
const CANONICAL_PHONE = "+32472964599";
const LEGACY_EMAILS = new Set([
  "hello@visualvibe.be",
  "podcasting.info@visualvibe.media",
]);

const ENGLISH_OPENING_HOURS: OpeningHoursDay[] = DEFAULT_OPENING_HOURS.map((day) => ({
  ...day,
  label: ({ monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday" } as Record<string, string>)[day.day],
  note: day.isOpen ? "" : "Closed",
}));

const ENGLISH_VISITOR_DEFAULTS = {
  responseTimeText: "Within two business days",
  mapMarkerTitle: "VisualVibe",
  mapDescription: "Creative media agency in Limburg",
  appointmentTitle: "Schedule a call",
  appointmentText: "Would you prefer to talk directly? Book a time that suits you.",
  appointmentButtonLabel: "Schedule a call",
  urgentContactTitle: "Need a quick answer?",
  urgentContactText: "For an urgent question, call us during office hours.",
  urgentContactButtonLabel: "Call us",
} satisfies Partial<SiteSettings>;

function toOpeningHours(value: unknown, locale: SupportedLocale): OpeningHoursDay[] {
  if (!Array.isArray(value) || value.length === 0) {
    return locale === "en" ? ENGLISH_OPENING_HOURS : DEFAULT_OPENING_HOURS;
  }
  return (value as unknown[]).map((raw) => {
    const day = (raw ?? {}) as Partial<OpeningHoursDay>;
    const englishDefault = ENGLISH_OPENING_HOURS.find((item) => item.day === day.day);
    return {
      day: String(day.day ?? ""),
      label: locale === "en" && typeof day.label !== "object"
        ? englishDefault?.label ?? ""
        : readLocalizedRequired(day.label as never, locale, `openingHours.${String(day.day)}.label`),
      isOpen: Boolean(day.isOpen),
      openTime: String(day.openTime ?? ""),
      closeTime: String(day.closeTime ?? ""),
      pauseStart: String(day.pauseStart ?? ""),
      pauseEnd: String(day.pauseEnd ?? ""),
      note: locale === "en" && typeof day.note !== "object"
        ? englishDefault?.note ?? ""
        : readLocalizedRequired(day.note as never, locale, `openingHours.${String(day.day)}.note`),
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
const VISITOR_FIELDS = ["responseTimeText", "mapMarkerTitle", "mapDescription", "appointmentTitle", "appointmentText", "appointmentButtonLabel", "urgentContactTitle", "urgentContactText", "urgentContactButtonLabel"] as const;

async function readSiteSettings(locale: SupportedLocale = "nl"): Promise<SiteSettings> {
  const now = new Date().toISOString();
  const base: SiteSettings = {
    id: SETTINGS_ID,
    ...DEFAULT_SITE_SETTINGS,
    createdAt: now,
    updatedAt: now,
  };
  if (locale === "en") {
    Object.assign(base, ENGLISH_VISITOR_DEFAULTS, {
      country: "Belgium",
      fullAddress: "Ziegelsmeer 14, 3700 Tongeren-Borgloon, Belgium",
      openingHours: ENGLISH_OPENING_HOURS,
    });
  }

  try {
    const doc = await withTimeout(adminDb.collection(COLLECTION).doc(SETTINGS_ID).get());
    if (!doc.exists) {
      return base;
    }

    const data = doc.data()!;
    const { createdAt, updatedAt, openingHours, ...rest } = data;

    const merged: SiteSettings = {
      ...base,
      ...(rest as Partial<SiteSettings>),
      openingHours: toOpeningHours(openingHours, locale),
      createdAt: createdAt?.toDate?.().toISOString() ?? now,
      updatedAt: updatedAt?.toDate?.().toISOString() ?? now,
    };

    for (const field of VISITOR_FIELDS) {
      const value = data[field];
      merged[field] = locale === "en" && (value == null || typeof value !== "object")
        ? ENGLISH_VISITOR_DEFAULTS[field] as never
        : readLocalizedOptional(value ?? base[field], locale, `siteSettings.${field}`) as never;
    }

    // A cleared number is stored as null; surface it as "unset" (undefined) so
    // the admin field shows empty and consumers get a proper number | undefined.
    if (typeof merged.latitude !== "number") merged.latitude = undefined;
    if (typeof merged.longitude !== "number") merged.longitude = undefined;

    // Older admin values are normalised immediately for the public site and the
    // contact settings form. Saving the form afterwards persists the new values.
    return normalizeLegacyContactSettings(merged);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Missing ")) throw error;
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
    const stored = doc.data() as Record<string, unknown>;
    const allMerged = mergeDutchVisitorFields(stored, clean as Record<string, unknown>, VISITOR_FIELDS);
    const merged = Object.fromEntries(Object.keys(clean).map((key) => [key, allMerged[key]]));
    if (Array.isArray(clean.openingHours)) {
      merged.openingHours = mergeDutchRecords(
        stored.openingHours as Record<string, unknown>[] | undefined,
        clean.openingHours as unknown as Record<string, unknown>[],
        ["label", "note"],
        "day",
      );
    }
    await ref.update({ ...merged, updatedAt: now });
  }
}
