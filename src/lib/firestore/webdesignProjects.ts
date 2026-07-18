import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import { withTimeout } from "@/lib/firestore/withTimeout";
import {
  webdesignProjects as defaultWebdesignProjects,
  type WebdesignProject,
} from "@/data/webdesignShowcase";
import type { SupportedLocale } from "@/i18n/locales";
import { mergeDutchRecords, readLocalizedOptional, readLocalizedRequired } from "./localizedContent";

// Admin-managed project listings for the Webdesign service showcase. Stored as a
// `projects` array in the same Firestore doc that holds the images
// (site_content/webdesign_showcase). Reads are resilient: on a missing/empty
// field or an unreachable Firestore we fall back to the seeded defaults so the
// public page never renders empty.

const COLLECTION = "site_content";
const DOC_ID = "webdesign_showcase";

const VISITOR_FIELDS = ["name", "client", "tags", "teaser", "text", "features", "terms"] as const;

export function localizeWebdesignProject(raw: Record<string, unknown>, locale: SupportedLocale): WebdesignProject {
  const result = { ...raw } as unknown as WebdesignProject;
  for (const field of VISITOR_FIELDS) {
    (result as unknown as Record<string, unknown>)[field] = readLocalizedRequired(raw[field] as never, locale, `webdesignProject.${String(raw.id)}.${field}`);
  }
  result.sectors = readLocalizedOptional(raw.sectors as never, locale, `webdesignProject.${String(raw.id)}.sectors`);
  return result;
}

async function readWebdesignProjects(locale: SupportedLocale = "nl"): Promise<WebdesignProject[]> {
  try {
    const doc = await withTimeout(adminDb.collection(COLLECTION).doc(DOC_ID).get());
    const stored = doc.exists ? (doc.data()?.projects as WebdesignProject[] | undefined) : undefined;
    if (Array.isArray(stored) && stored.length > 0) return (stored as unknown as Record<string, unknown>[]).map((project) => localizeWebdesignProject(project, locale));
    return (defaultWebdesignProjects as unknown as Record<string, unknown>[]).map((project) => localizeWebdesignProject(project, locale));
  } catch {
    return (defaultWebdesignProjects as unknown as Record<string, unknown>[]).map((project) => localizeWebdesignProject(project, locale));
  }
}

/** Cached per request so the page and its sections share a single read. */
export const getWebdesignProjects = cache(readWebdesignProjects);

/** Replace the full ordered project list (add / delete / reorder / edit). */
export async function setWebdesignProjects(projects: WebdesignProject[]): Promise<void> {
  const ref = adminDb.collection(COLLECTION).doc(DOC_ID);
  // `merge: true` keeps the sibling `images` map; arrays are replaced whole,
  // which is exactly what reorder/delete need.
  const snapshot = await ref.get();
  const stored = snapshot.exists ? snapshot.data()?.projects as Record<string, unknown>[] | undefined : undefined;
  const merged = mergeDutchRecords(stored, projects as unknown as Record<string, unknown>[], VISITOR_FIELDS);
  await ref.set({ projects: merged, updatedAt: new Date() }, { merge: true });
}
