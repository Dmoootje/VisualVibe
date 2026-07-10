import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import {
  webdesignProjects as defaultWebdesignProjects,
  type WebdesignProject,
} from "@/data/webdesignShowcase";

// Admin-managed project listings for the Webdesign service showcase. Stored as a
// `projects` array in the same Firestore doc that holds the images
// (site_content/webdesign_showcase). Reads are resilient: on a missing/empty
// field or an unreachable Firestore we fall back to the seeded defaults so the
// public page never renders empty.

const COLLECTION = "site_content";
const DOC_ID = "webdesign_showcase";

async function readWebdesignProjects(): Promise<WebdesignProject[]> {
  try {
    const doc = await adminDb.collection(COLLECTION).doc(DOC_ID).get();
    const stored = doc.exists ? (doc.data()?.projects as WebdesignProject[] | undefined) : undefined;
    if (Array.isArray(stored) && stored.length > 0) return stored;
    return defaultWebdesignProjects;
  } catch {
    return defaultWebdesignProjects;
  }
}

/** Cached per request so the page and its sections share a single read. */
export const getWebdesignProjects = cache(readWebdesignProjects);

/** Replace the full ordered project list (add / delete / reorder / edit). */
export async function setWebdesignProjects(projects: WebdesignProject[]): Promise<void> {
  const ref = adminDb.collection(COLLECTION).doc(DOC_ID);
  // `merge: true` keeps the sibling `images` map; arrays are replaced whole,
  // which is exactly what reorder/delete need.
  await ref.set({ projects, updatedAt: new Date() }, { merge: true });
}
