"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { updateProfile } from "@/lib/firestore/profiles";
import type { SettingsFormState } from "@/lib/admin/settingsActions";

/**
 * Saves the admin's own profile (naam + profielfoto). De foto verschijnt als
 * auteursavatar op alle blog-/kennisbankoppervlakken, dus we revalideren die
 * routes zodat de wijziging zonder rebuild zichtbaar wordt.
 */
export async function saveProfileSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { status: "error", message: "Niet ingelogd." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const photoUrl = String(formData.get("photoUrl") ?? "").trim();

  if (!name) {
    return { status: "error", message: "Naam is verplicht." };
  }
  // De foto komt altijd uit onze eigen upload-route (Firebase Storage).
  if (photoUrl && !photoUrl.startsWith("https://firebasestorage.googleapis.com/")) {
    return { status: "error", message: "Ongeldige foto-URL." };
  }

  try {
    await updateProfile(admin.uid, { name, photoUrl });
  } catch {
    return { status: "error", message: "Opslaan mislukt. Probeer opnieuw." };
  }

  revalidatePath("/admin/settings/profiel");
  // Auteursavatar staat op home (blogpreview), kennisbank en sectorpagina's.
  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/kennisbank", "page");
  revalidatePath("/[locale]/kennisbank/[category]", "page");
  revalidatePath("/[locale]/kennisbank/[category]/[slug]", "page");
  revalidatePath("/[locale]/sectoren/[slug]", "page");

  return { status: "success", message: "Profiel opgeslagen." };
}
