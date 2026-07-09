"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { setWebdesignImage } from "@/lib/firestore/webdesignImages";

export type ImageActionResult = { ok: boolean; error?: string };

/** Persist (url) or clear ("") one webdesign showcase image key. */
export async function saveWebdesignImage(key: string, url: string): Promise<ImageActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Niet ingelogd." };
  if (!key) return { ok: false, error: "Ongeldige sleutel." };

  try {
    await setWebdesignImage(key, url);
  } catch {
    return { ok: false, error: "Opslaan mislukt." };
  }

  revalidatePath("/diensten/webdesign");
  revalidatePath("/admin/settings/webdesign");
  return { ok: true };
}
