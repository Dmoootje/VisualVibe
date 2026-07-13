import "server-only";
import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import {
  DEFAULT_WEDDINGVIBE_PRICING,
  type WeddingVibePricing,
} from "@/features/weddingvibe/config/imageSlots";

// Admin-beheerde content van de WeddingVibe one-pager: prijzen van de
// investeringstabel + beeld-overrides per benoemde slot. Eén doc, zelfde
// patroon als site_content/webdesign_showcase (merge-writes, seed-fallback).

const COLLECTION = "site_content";
const DOC_ID = "weddingvibe";

export type WeddingVibeContent = {
  pricing: WeddingVibePricing;
  prijzenTonen: boolean;
  /** Beeld-overrides per slot; ontbrekend of "" = config-default gebruiken. */
  images: Record<string, string>;
};

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

async function readWeddingVibeContent(): Promise<WeddingVibeContent> {
  const defaults: WeddingVibeContent = {
    pricing: { ...DEFAULT_WEDDINGVIBE_PRICING },
    prijzenTonen: true,
    images: {},
  };

  try {
    const doc = await adminDb.collection(COLLECTION).doc(DOC_ID).get();
    if (!doc.exists) return defaults;
    const data = doc.data() ?? {};

    const pricing = (data.pricing ?? {}) as Record<string, unknown>;
    const imagesRaw = (data.images ?? {}) as Record<string, unknown>;
    const images: Record<string, string> = {};
    for (const [slot, url] of Object.entries(imagesRaw)) {
      if (typeof url === "string" && url.trim()) images[slot] = url.trim();
    }

    return {
      pricing: {
        fotografie: str(pricing.fotografie, defaults.pricing.fotografie),
        film: str(pricing.film, defaults.pricing.film),
        combo: str(pricing.combo, defaults.pricing.combo),
      },
      prijzenTonen: typeof data.prijzenTonen === "boolean" ? data.prijzenTonen : defaults.prijzenTonen,
      images,
    };
  } catch {
    return defaults;
  }
}

export const getWeddingVibeContent = cache(readWeddingVibeContent);

/** Eén slot bijwerken; een lege url verwijdert de override (terug naar default). */
export async function setWeddingVibeImage(slot: string, url: string): Promise<void> {
  await adminDb
    .collection(COLLECTION)
    .doc(DOC_ID)
    .set({ images: { [slot]: url }, updatedAt: new Date() }, { merge: true });
}

export async function setWeddingVibePricing(
  pricing: WeddingVibePricing,
  prijzenTonen: boolean,
): Promise<void> {
  await adminDb
    .collection(COLLECTION)
    .doc(DOC_ID)
    .set({ pricing, prijzenTonen, updatedAt: new Date() }, { merge: true });
}
