import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";

// Admin-managed images for the Webdesign service showcase. Stored as a single
// map { imageKey: url } in one Firestore doc. Keys are "hero" and, per project,
// "<projectId>-<slot>" (slot = thumb | 1 | 2 | 3 | 4). Reads are resilient:
// on a missing doc or unreachable Firestore we fall back to the defaults below.

const COLLECTION = "site_content";
const DOC_ID = "webdesign_showcase";

export type WebdesignImages = Record<string, string>;

/** Prefilled images: the hero preview + the Gordijnen Myriam case. */
export const DEFAULT_WEBDESIGN_IMAGES: WebdesignImages = {
  hero: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2Fseo-websites.webp?alt=media&token=5a197734-d989-465f-94bb-f86bb64d9e18",
  "gordijnenmyriam-thumb":
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FGordijnen-Myriam-website-design.webp?alt=media&token=2b24c37b-8192-4e42-babc-cdd2b2196fb1",
  "gordijnenmyriam-1":
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FSEO-Webdesign-Gordijnen-Myriam.webp?alt=media&token=46e73430-abd1-4c5c-a6ea-bca9e7da3e92",
  "gordijnenmyriam-2":
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FSEO-Webdesign-Gordijnen-Myriam-3.webp?alt=media&token=d02e89cb-51d4-4284-a3eb-6fa9cdcc8dd8",
  "gordijnenmyriam-3":
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FSEO-Mobiel-tablet-Webdesign-Gordijnen-Myriam.webp?alt=media&token=378976c5-4bf3-43c7-b94f-10848fc11558",
  "gordijnenmyriam-4":
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FSEO-Mobiel-Webdesign-Gordijnen-Myriam.webp?alt=media&token=61f49379-f945-41c6-975d-8d121416b17e",
};

async function readWebdesignImages(): Promise<WebdesignImages> {
  try {
    const doc = await adminDb.collection(COLLECTION).doc(DOC_ID).get();
    const stored = (doc.exists ? (doc.data()?.images as WebdesignImages) : undefined) ?? {};
    // Stored values win; defaults fill the rest. An empty string in Firestore
    // (a deliberately-removed image) overrides the default so it stays cleared.
    return { ...DEFAULT_WEBDESIGN_IMAGES, ...stored };
  } catch {
    return { ...DEFAULT_WEBDESIGN_IMAGES };
  }
}

/** Cached per request so the page and its sections share a single read. */
export const getWebdesignImages = cache(readWebdesignImages);

/** Set (or clear, with "") one image key. */
export async function setWebdesignImage(key: string, url: string): Promise<void> {
  const ref = adminDb.collection(COLLECTION).doc(DOC_ID);
  await ref.set({ images: { [key]: url }, updatedAt: new Date() }, { merge: true });
}
