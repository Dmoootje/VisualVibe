"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { setIndexNowKey, submitAllToIndexNow } from "@/lib/seo/indexnow";

export type IndexNowActionResult = {
  ok: boolean;
  message: string;
};

const SETTINGS_PATH = "/admin/settings/indexnow";

/**
 * Slaat de IndexNow-sleutel op. `mode=auto` genereert (of vernieuwt) een sleutel;
 * anders wordt de ingevoerde sleutel gevalideerd en bewaard.
 */
export async function saveIndexNowKeyAction(formData: FormData): Promise<IndexNowActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, message: "Je sessie is verlopen. Meld je opnieuw aan." };

  const mode = String(formData.get("mode") ?? "").trim();
  const manualKey = String(formData.get("key") ?? "").trim();
  const auto = mode === "auto" || !manualKey;

  try {
    await setIndexNowKey({ key: manualKey, auto }, admin.email);
    revalidatePath(SETTINGS_PATH);
    return {
      ok: true,
      message: auto
        ? "Nieuwe IndexNow-sleutel gegenereerd. Meld daarna alle pagina's aan."
        : "IndexNow-sleutel opgeslagen.",
    };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Opslaan mislukt." };
  }
}

/** Meldt alle canonieke, indexeerbare URL's in een keer aan bij IndexNow. */
export async function submitAllToIndexNowAction(): Promise<IndexNowActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, message: "Je sessie is verlopen. Meld je opnieuw aan." };

  try {
    const result = await submitAllToIndexNow();
    revalidatePath(SETTINGS_PATH);
    return { ok: result.ok, message: result.message };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Aanmelden mislukt." };
  }
}
