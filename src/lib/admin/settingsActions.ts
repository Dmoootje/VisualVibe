"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { updateSiteSettings } from "@/lib/firestore/siteSettings";

export type SettingsFormState = { status: "idle" | "success" | "error"; message?: string };

export async function saveSiteSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { status: "error", message: "Niet ingelogd." };
  }

  const companyName = String(formData.get("companyName") ?? "").trim();
  const mainEmail = String(formData.get("mainEmail") ?? "").trim();
  const leadNotificationEmail = String(formData.get("leadNotificationEmail") ?? "").trim();

  if (!companyName || !mainEmail || !leadNotificationEmail) {
    return { status: "error", message: "Bedrijfsnaam, e-mail en notificatie-e-mail zijn verplicht." };
  }

  await updateSiteSettings({
    companyName,
    mainEmail,
    leadNotificationEmail,
    phone: String(formData.get("phone") ?? "") || undefined,
    whatsapp: String(formData.get("whatsapp") ?? "") || undefined,
    address: String(formData.get("address") ?? "") || undefined,
    googleMapsUrl: String(formData.get("googleMapsUrl") ?? "") || undefined,
    facebookUrl: String(formData.get("facebookUrl") ?? "") || undefined,
    instagramUrl: String(formData.get("instagramUrl") ?? "") || undefined,
    linkedinUrl: String(formData.get("linkedinUrl") ?? "") || undefined,
  });

  revalidatePath("/admin/settings");

  return { status: "success", message: "Instellingen opgeslagen." };
}
