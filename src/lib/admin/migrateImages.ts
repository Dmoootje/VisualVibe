"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { adminDb, adminStorageBucket } from "@/lib/firebase/admin";
import { uploadImageBuffer } from "@/lib/firebase/uploadImage";
import { revalidateWebdesign } from "@/lib/admin/revalidateWebdesign";

// One-time cleanup: convert already-uploaded portfolio images (PNG/JPG with a
// timestamped name) into clean WebP, repoint Firestore at the new files, and
// delete the originals. Safe to run repeatedly: anything already stored as
// .webp is skipped.

const COLLECTION = "site_content";
const DOC_ID = "webdesign_showcase";

/** Extract the Storage object path from a Firebase download URL, or null. */
function pathFromUrl(url: string): string | null {
  const match = url.match(/\/o\/([^?]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export type MigrateResult = { ok: boolean; converted: number; skipped: number; error?: string };

export async function migrateImagesToWebp(): Promise<MigrateResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, converted: 0, skipped: 0, error: "Niet ingelogd." };

  try {
    const ref = adminDb.collection(COLLECTION).doc(DOC_ID);
    const snap = await ref.get();
    const images = (snap.exists ? snap.data()?.images : undefined) as
      | Record<string, string>
      | undefined;

    if (!images) return { ok: true, converted: 0, skipped: 0 };

    const updated: Record<string, string> = {};
    const oldPaths: string[] = [];
    let converted = 0;
    let skipped = 0;

    for (const [key, url] of Object.entries(images)) {
      if (!url) continue;
      const path = pathFromUrl(url);
      // Already a clean webp (or a URL we can't map) -> leave it alone.
      if (!path || path.endsWith(".webp")) {
        skipped++;
        continue;
      }
      try {
        const [bytes] = await adminStorageBucket.file(path).download();
        updated[key] = await uploadImageBuffer(bytes, key);
        oldPaths.push(path);
        converted++;
      } catch {
        // Unreadable or foreign file: skip rather than fail the whole run.
        skipped++;
      }
    }

    if (converted > 0) {
      await ref.set({ images: updated, updatedAt: new Date() }, { merge: true });
      // Only delete originals after Firestore points to the new webp files.
      await Promise.allSettled(oldPaths.map((p) => adminStorageBucket.file(p).delete()));
      revalidateWebdesign();
    }

    return { ok: true, converted, skipped };
  } catch (e) {
    return {
      ok: false,
      converted: 0,
      skipped: 0,
      error: e instanceof Error ? e.message : "Migratie mislukt.",
    };
  }
}
