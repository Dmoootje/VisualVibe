import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import { withTimeout } from "@/lib/firestore/withTimeout";
import { DEFAULT_FOTO_GALLERIES, type FotoGallery } from "@/data/fotografieGalleries";

// Admin-managed fotografie galleries, stored as a `galleries` array in the
// singleton doc site_content/fotografie_galleries. Reads are resilient: on a
// missing field or unreachable Firestore we fall back to the seeded defaults.
// An explicit empty array (admin removed all galleries) is respected as-is.

const COLLECTION = "site_content";
const DOC_ID = "fotografie_galleries";

async function readFotografieGalleries(): Promise<FotoGallery[]> {
  try {
    const doc = await withTimeout(adminDb.collection(COLLECTION).doc(DOC_ID).get());
    const stored = doc.exists ? (doc.data()?.galleries as FotoGallery[] | undefined) : undefined;
    if (Array.isArray(stored)) return stored;
    return DEFAULT_FOTO_GALLERIES;
  } catch {
    return DEFAULT_FOTO_GALLERIES;
  }
}

/** Cached per request so the page and its sections share a single read. */
export const getFotografieGalleries = cache(readFotografieGalleries);

/** Replace the full ordered gallery list (add / delete / reorder / edit). */
export async function setFotografieGalleries(galleries: FotoGallery[]): Promise<void> {
  const ref = adminDb.collection(COLLECTION).doc(DOC_ID);
  await ref.set({ galleries, updatedAt: new Date() }, { merge: true });
}
