"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { adminDb, adminStorageBucket } from "@/lib/firebase/admin";
import { DEFAULT_STORAGE_DIR, slugifyKey, uploadImageBuffer } from "@/lib/firebase/uploadImage";
import { getWebdesignProjects } from "@/lib/firestore/webdesignProjects";
import { revalidateWebdesign } from "@/lib/admin/revalidateWebdesign";

// One-time cleanup for the webdesign portfolio images: convert any PNG/JPG into
// clean WebP AND rename them after the project (never the random project id), so
// filenames are SEO-friendly. Repoints Firestore at the new files and deletes the
// originals. Safe to run repeatedly: an image already stored as clean, correctly
// named WebP is skipped.

const COLLECTION = "site_content";
const DOC_ID = "webdesign_showcase";

// Descriptive filename suffix per image slot (keys are "<projectId>-<slot>").
const SLOT_SUFFIX: Record<string, string> = {
  thumb: "thumb",
  "1": "hoofdscreenshot",
  "2": "desktop",
  "3": "tablet",
  "4": "mobiel",
};

/** Extract the Storage object path from a Firebase download URL, or null. */
function pathFromUrl(url: string): string | null {
  const match = url.match(/\/o\/([^?]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/** Split "<projectId>-<slot>" into its parts (slot is the trailing token). */
function parseKey(key: string): { projectId: string; slot: string } | null {
  const dash = key.lastIndexOf("-");
  if (dash === -1) return null;
  const slot = key.slice(dash + 1);
  if (!SLOT_SUFFIX[slot]) return null;
  return { projectId: key.slice(0, dash), slot };
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

    // Map each project id to its display name so we can build clean filenames.
    const projects = await getWebdesignProjects();
    const nameById = new Map(projects.map((p) => [p.id, p.name]));

    const updated: Record<string, string> = {};
    const oldPaths = new Set<string>();
    let converted = 0;
    let skipped = 0;

    for (const [key, url] of Object.entries(images)) {
      if (!url) continue;
      const path = pathFromUrl(url);
      const parsed = parseKey(key);
      // A URL we can't map or a non-standard key: leave it untouched.
      if (!path || !parsed) {
        skipped++;
        continue;
      }

      const nameStem = (nameById.get(parsed.projectId) || parsed.projectId).trim();
      const cleanStem = slugifyKey(`${nameStem}-${SLOT_SUFFIX[parsed.slot]}`);
      const desiredPath = `${DEFAULT_STORAGE_DIR}/${cleanStem}.webp`;

      // Already a clean, correctly named WebP -> nothing to do.
      if (path === desiredPath) {
        skipped++;
        continue;
      }

      try {
        const [bytes] = await adminStorageBucket.file(path).download();
        updated[key] = await uploadImageBuffer(bytes, `${nameStem}-${SLOT_SUFFIX[parsed.slot]}`);
        oldPaths.add(path);
        converted++;
      } catch {
        // Unreadable or foreign file: skip rather than fail the whole run.
        skipped++;
      }
    }

    if (converted > 0) {
      await ref.set({ images: updated, updatedAt: new Date() }, { merge: true });
      // Only delete originals after Firestore points to the new webp files.
      await Promise.allSettled([...oldPaths].map((p) => adminStorageBucket.file(p).delete()));
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
