"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { adminDb, adminStorageBucket } from "@/lib/firebase/admin";
import type { FotoGallery } from "@/data/fotografieGalleries";

// One-time cleanup of the old auto-named fotografie uploads. The previous upload
// path named every photo "<galleryId>-<index>.webp" (e.g. "g-c8ed509d-0.webp"),
// clobbering the SEO filenames. This deletes exactly those files from Storage
// AND removes them from the galleries in Firestore, while leaving the gallery
// metadata (and any properly-named image) intact. New uploads keep their own
// filename, so re-uploading is safe.

const COLLECTION = "site_content";
const DOC_ID = "fotografie_galleries";
const FOTO_DIR = "images/library/fotografie";

// Matches the auto-generated pattern "g-<id>-<index>.webp" only. A real SEO name
// like "bedrijfsfotografie-hasselt.webp" never matches (it doesn't end in -<num>
// after a g-<id> stem).
const AUTO_NAME = /^g-[0-9a-z]+-\d+\.webp$/i;

function fileNameFrom(pathOrUrl: string): string {
  const match = pathOrUrl.match(/\/o\/([^?]+)/);
  const path = match ? decodeURIComponent(match[1]) : pathOrUrl;
  return path.split("/").pop() ?? "";
}

export type CleanResult = {
  ok: boolean;
  removedFromDb: number;
  deletedFiles: number;
  error?: string;
};

export async function cleanAutoNamedFotografieImages(): Promise<CleanResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, removedFromDb: 0, deletedFiles: 0, error: "Niet ingelogd." };

  try {
    // 1. Firestore: drop auto-named images from every gallery, keep the rest.
    const ref = adminDb.collection(COLLECTION).doc(DOC_ID);
    const snap = await ref.get();
    const galleries = (snap.exists ? snap.data()?.galleries : undefined) as FotoGallery[] | undefined;

    let removedFromDb = 0;
    if (Array.isArray(galleries)) {
      const cleaned = galleries.map((g) => {
        const kept = (g.images ?? []).filter((img) => !AUTO_NAME.test(fileNameFrom(img.src)));
        removedFromDb += (g.images?.length ?? 0) - kept.length;
        return { ...g, images: kept };
      });
      await ref.set({ galleries: cleaned, updatedAt: new Date() }, { merge: true });
    }

    // 2. Storage: delete every auto-named file in the fotografie library (also
    //    catches orphans no longer referenced by any gallery).
    const [files] = await adminStorageBucket.getFiles({ prefix: `${FOTO_DIR}/` });
    let deletedFiles = 0;
    await Promise.allSettled(
      files.map(async (file) => {
        const name = file.name.split("/").pop() ?? "";
        if (AUTO_NAME.test(name)) {
          await file.delete();
          deletedFiles++;
        }
      }),
    );

    return { ok: true, removedFromDb, deletedFiles };
  } catch (e) {
    return {
      ok: false,
      removedFromDb: 0,
      deletedFiles: 0,
      error: e instanceof Error ? e.message : "Opschonen mislukt.",
    };
  }
}
