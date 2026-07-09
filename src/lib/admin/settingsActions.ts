"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { updateSiteSettings, type UpdateSiteSettingsInput } from "@/lib/firestore/siteSettings";
import type { OpeningHoursDay } from "@/types/siteSettings";

export type SettingsFormState = { status: "idle" | "success" | "error"; message?: string };

/** "" -> undefined, trimmed otherwise. */
function optional(formData: FormData, key: string): string | undefined {
  const value = String(formData.get(key) ?? "").trim();
  return value || undefined;
}

function optionalNumber(formData: FormData, key: string): number | undefined {
  const value = String(formData.get(key) ?? "").trim().replace(",", ".");
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseOpeningHours(
  formData: FormData
): { hours?: OpeningHoursDay[]; error?: string } {
  const raw = formData.get("openingHours");
  if (typeof raw !== "string" || !raw) return {};
  let parsed: OpeningHoursDay[];
  try {
    parsed = JSON.parse(raw) as OpeningHoursDay[];
  } catch {
    return { error: "Openingsuren konden niet verwerkt worden." };
  }
  for (const day of parsed) {
    if (day.isOpen && (!day.openTime || !day.closeTime)) {
      return { error: `Vul open- en sluitingstijd in voor ${day.label || day.day}.` };
    }
  }
  return { hours: parsed };
}

/**
 * Saves the full contact/CRM settings (all sections of /admin/settings/contact).
 */
export async function saveContactSettings(
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
    return { status: "error", message: "Bedrijfsnaam, contact-e-mail en notificatie-e-mail zijn verplicht." };
  }

  const { hours, error } = parseOpeningHours(formData);
  if (error) {
    return { status: "error", message: error };
  }

  const input: UpdateSiteSettingsInput = {
    // 1. Bedrijfsgegevens
    companyName,
    mainEmail,
    leadNotificationEmail,
    phone: optional(formData, "phone"),
    mobilePhone: optional(formData, "mobilePhone"),
    whatsapp: optional(formData, "whatsapp"),
    vatNumber: optional(formData, "vatNumber"),
    contactPerson: optional(formData, "contactPerson"),
    responseTimeText: optional(formData, "responseTimeText"),
    // 2. Adres
    street: optional(formData, "street"),
    houseNumber: optional(formData, "houseNumber"),
    postalCode: optional(formData, "postalCode"),
    city: optional(formData, "city"),
    province: optional(formData, "province"),
    country: optional(formData, "country"),
    fullAddress: optional(formData, "fullAddress"),
    // 3. Kaart
    latitude: optionalNumber(formData, "latitude"),
    longitude: optionalNumber(formData, "longitude"),
    googleMapsUrl: optional(formData, "googleMapsUrl"),
    googleMapsEmbedUrl: optional(formData, "googleMapsEmbedUrl"),
    routeUrl: optional(formData, "routeUrl"),
    mapMarkerTitle: optional(formData, "mapMarkerTitle"),
    mapDescription: optional(formData, "mapDescription"),
    // 4. Social
    facebookUrl: optional(formData, "facebookUrl"),
    instagramUrl: optional(formData, "instagramUrl"),
    linkedinUrl: optional(formData, "linkedinUrl"),
    youtubeUrl: optional(formData, "youtubeUrl"),
    tiktokUrl: optional(formData, "tiktokUrl"),
    // 6. CTA's
    appointmentTitle: optional(formData, "appointmentTitle"),
    appointmentText: optional(formData, "appointmentText"),
    appointmentButtonLabel: optional(formData, "appointmentButtonLabel"),
    appointmentButtonUrl: optional(formData, "appointmentButtonUrl"),
    urgentContactTitle: optional(formData, "urgentContactTitle"),
    urgentContactText: optional(formData, "urgentContactText"),
    urgentContactButtonLabel: optional(formData, "urgentContactButtonLabel"),
    urgentContactButtonUrl: optional(formData, "urgentContactButtonUrl"),
  };
  if (hours) input.openingHours = hours;

  try {
    await updateSiteSettings(input);
  } catch {
    return { status: "error", message: "Opslaan mislukt. Probeer opnieuw." };
  }

  revalidatePath("/admin/settings/contact");
  revalidatePath("/contact");

  return { status: "success", message: "Contactgegevens opgeslagen." };
}
