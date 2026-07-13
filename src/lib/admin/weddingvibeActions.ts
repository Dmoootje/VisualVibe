"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { setWeddingVibeImage, setWeddingVibePricing } from "@/lib/firestore/weddingvibe";
import {
  WEDDINGVIBE_IMAGE_SLOTS,
  type WeddingVibePricing,
} from "@/features/weddingvibe/config/imageSlots";

export type WeddingVibeActionResult = { ok: boolean; error?: string };

function revalidateWeddingVibe(): void {
  // De one-pager staat buiten de (site)-groep maar onder [locale] (/be-prefix),
  // dus de dynamische padvorm is nodig (zoals revalidateWebdesign).
  revalidatePath("/[locale]/trouwfotograaf-limburg", "page");
  revalidatePath("/admin/settings/weddingvibe");
}

const VALID_SLOTS = new Set(WEDDINGVIBE_IMAGE_SLOTS.map((def) => def.slot));

/** Beeld-override opslaan; lege url = terug naar het standaardbeeld. */
export async function saveWeddingVibeImage(slot: string, url: string): Promise<WeddingVibeActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Niet ingelogd." };
  if (!VALID_SLOTS.has(slot)) return { ok: false, error: "Onbekend beeld-slot." };

  const clean = String(url ?? "").trim();
  if (clean && (!/^https:\/\//.test(clean) || clean.length > 2048)) {
    return { ok: false, error: "Ongeldige afbeeldings-URL." };
  }

  try {
    await setWeddingVibeImage(slot, clean);
  } catch {
    return { ok: false, error: "Opslaan mislukt." };
  }
  revalidateWeddingVibe();
  return { ok: true };
}

export async function saveWeddingVibePricingAction(
  pricing: WeddingVibePricing,
  prijzenTonen: boolean,
): Promise<WeddingVibeActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Niet ingelogd." };

  const clean = (value: unknown): string => String(value ?? "").trim().slice(0, 40);
  const cleaned: WeddingVibePricing = {
    fotografie: clean(pricing?.fotografie),
    film: clean(pricing?.film),
    combo: clean(pricing?.combo),
  };
  if (!cleaned.fotografie || !cleaned.film || !cleaned.combo) {
    return { ok: false, error: "Vul alle drie de prijzen in (bv. €2.150)." };
  }

  try {
    await setWeddingVibePricing(cleaned, Boolean(prijzenTonen));
  } catch {
    return { ok: false, error: "Opslaan mislukt." };
  }
  revalidateWeddingVibe();
  return { ok: true };
}
