import { adminDb } from "@/lib/firebase/admin";
import type { SiteSettings } from "@/types";

const COLLECTION = "site_settings";
const SETTINGS_ID = "default";

const FALLBACK = {
  companyName: "VisualVibe",
  mainEmail: "hello@visualvibe.be",
  leadNotificationEmail: "hello@visualvibe.be",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const doc = await adminDb.collection(COLLECTION).doc(SETTINGS_ID).get();
  const now = new Date().toISOString();

  if (!doc.exists) {
    return { id: SETTINGS_ID, ...FALLBACK, createdAt: now, updatedAt: now };
  }

  const data = doc.data()!;
  return {
    id: SETTINGS_ID,
    companyName: data.companyName ?? FALLBACK.companyName,
    mainEmail: data.mainEmail ?? FALLBACK.mainEmail,
    leadNotificationEmail: data.leadNotificationEmail ?? FALLBACK.leadNotificationEmail,
    phone: data.phone ?? undefined,
    whatsapp: data.whatsapp ?? undefined,
    address: data.address ?? undefined,
    googleMapsUrl: data.googleMapsUrl ?? undefined,
    facebookUrl: data.facebookUrl ?? undefined,
    instagramUrl: data.instagramUrl ?? undefined,
    linkedinUrl: data.linkedinUrl ?? undefined,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? now,
    updatedAt: data.updatedAt?.toDate?.().toISOString() ?? now,
  };
}

export type UpdateSiteSettingsInput = Partial<Omit<SiteSettings, "id" | "createdAt" | "updatedAt">>;

export async function updateSiteSettings(input: UpdateSiteSettingsInput): Promise<void> {
  const ref = adminDb.collection(COLLECTION).doc(SETTINGS_ID);
  const doc = await ref.get();
  const now = new Date();

  if (!doc.exists) {
    await ref.set({ ...FALLBACK, ...input, createdAt: now, updatedAt: now });
  } else {
    await ref.update({ ...input, updatedAt: now });
  }
}
