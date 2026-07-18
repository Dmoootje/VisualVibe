import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import { withTimeout } from "@/lib/firestore/withTimeout";
import { DEFAULT_FOTO_GALLERIES, type FotoGallery } from "@/data/fotografieGalleries";
import type { SupportedLocale } from "@/i18n/locales";
import { mergeDutchRecords, readLocalizedOptional, readLocalizedRequired } from "./localizedContent";

// Admin-managed fotografie galleries, stored as a `galleries` array in the
// singleton doc site_content/fotografie_galleries. Reads are resilient: on a
// missing field or unreachable Firestore we fall back to the seeded defaults.
// An explicit empty array (admin removed all galleries) is respected as-is.

const COLLECTION = "site_content";
const DOC_ID = "fotografie_galleries";

const VISITOR_FIELDS = ["title", "description", "tags"] as const;

export function localizeFotografieGallery(raw: Record<string, unknown>, locale: SupportedLocale): FotoGallery {
  return {
    ...(raw as unknown as FotoGallery),
    title: readLocalizedRequired(raw.title as never, locale, `gallery.${String(raw.id)}.title`),
    description: readLocalizedRequired(raw.description as never, locale, `gallery.${String(raw.id)}.description`),
    tags: readLocalizedOptional(raw.tags as never, locale, `gallery.${String(raw.id)}.tags`),
    images: Array.isArray(raw.images) ? raw.images.map((image, index) => {
      const item = image as Record<string, unknown>;
      return { src: String(item.src ?? ""), caption: readLocalizedOptional(item.caption as never, locale, `gallery.${String(raw.id)}.images.${index}.caption`) };
    }) : [],
  };
}

async function readFotografieGalleries(locale: SupportedLocale = "nl"): Promise<FotoGallery[]> {
  try {
    const doc = await withTimeout(adminDb.collection(COLLECTION).doc(DOC_ID).get());
    const stored = doc.exists ? (doc.data()?.galleries as FotoGallery[] | undefined) : undefined;
    if (Array.isArray(stored)) return (stored as unknown as Record<string, unknown>[]).map((gallery) => localizeFotografieGallery(gallery, locale));
    return (DEFAULT_FOTO_GALLERIES as unknown as Record<string, unknown>[]).map((gallery) => localizeFotografieGallery(gallery, locale));
  } catch {
    return (DEFAULT_FOTO_GALLERIES as unknown as Record<string, unknown>[]).map((gallery) => localizeFotografieGallery(gallery, locale));
  }
}

/** Cached per request so the page and its sections share a single read. */
export const getFotografieGalleries = cache(readFotografieGalleries);

/** Replace the full ordered gallery list (add / delete / reorder / edit). */
export async function setFotografieGalleries(galleries: FotoGallery[]): Promise<void> {
  const ref = adminDb.collection(COLLECTION).doc(DOC_ID);
  const snapshot = await ref.get();
  const stored = snapshot.exists ? snapshot.data()?.galleries as Record<string, unknown>[] | undefined : undefined;
  const merged = mergeDutchRecords(stored, galleries as unknown as Record<string, unknown>[], VISITOR_FIELDS);
  for (const gallery of merged) {
    const previous = stored?.find((item) => item.id === gallery.id);
    gallery.images = mergeDutchRecords(
      previous?.images as Record<string, unknown>[] | undefined,
      gallery.images as Record<string, unknown>[],
      ["caption"],
      "src",
    );
  }
  await ref.set({ galleries: merged, updatedAt: new Date() }, { merge: true });
}
