import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import { withTimeout } from "@/lib/firestore/withTimeout";
import {
  applicationCases as defaultApplicationCases,
  type ApplicationCase,
} from "@/data/applicationCases";
import type { SupportedLocale } from "@/i18n/locales";
import { mergeDutchRecords, readLocalizedRequired } from "./localizedContent";

const COLLECTION = "site_content";
const DOC_ID = "application_cases";

export type ApplicationCaseImages = Record<string, string>;

type ApplicationCaseContent = {
  projects: ApplicationCase[];
  images: ApplicationCaseImages;
};

/**
 * Projects and image URLs live in the same Firestore document. Reading them
 * separately doubled the backend round trips on every case/category render.
 * One request-scoped cached read now feeds both consumers.
 */
const VISITOR_FIELDS = ["slug", "title", "client", "tags", "tagline", "excerpt", "challenge", "solution", "capabilities", "technology", "results", "ssr", "seoTitle", "seoDescription"] as const;

export function localizeApplicationCase(raw: Record<string, unknown>, locale: SupportedLocale): ApplicationCase {
  const result = { ...raw } as unknown as ApplicationCase;
  for (const field of VISITOR_FIELDS) {
    (result as unknown as Record<string, unknown>)[field] = readLocalizedRequired(raw[field] as never, locale, `applicationCase.${String(raw.id)}.${field}`);
  }
  return result;
}

async function readApplicationCaseContent(locale: SupportedLocale): Promise<ApplicationCaseContent> {
  try {
    const doc = await withTimeout(adminDb.collection(COLLECTION).doc(DOC_ID).get());
    const data = doc.exists ? doc.data() : undefined;
    const storedProjects = data?.projects as Record<string, unknown>[] | undefined;
    const storedImages = data?.images as ApplicationCaseImages | undefined;

    return {
      projects:
        Array.isArray(storedProjects) && storedProjects.length > 0
          ? storedProjects.map((project) => localizeApplicationCase(project, locale))
          : defaultApplicationCases.map((project) => localizeApplicationCase(project, locale)),
      images: storedImages ?? {},
    };
  } catch {
    return {
      projects: defaultApplicationCases.map((project) => localizeApplicationCase(project, locale)),
      images: {},
    };
  }
}

const getApplicationCaseContent = cache(readApplicationCaseContent);

export const getApplicationCases = cache(async (locale: SupportedLocale = "nl"): Promise<ApplicationCase[]> => {
  const content = await getApplicationCaseContent(locale);
  return content.projects;
});

export const getApplicationCaseImages = cache(async (): Promise<ApplicationCaseImages> => {
  const content = await getApplicationCaseContent("nl");
  return content.images;
});

export async function getApplicationCaseBySlug(slug: string): Promise<ApplicationCase | undefined> {
  const projects = await getApplicationCases();
  return projects.find((project) => project.slug === slug && project.published);
}

export async function setApplicationCases(projects: ApplicationCase[]): Promise<void> {
  const ref = adminDb.collection(COLLECTION).doc(DOC_ID);
  const snapshot = await ref.get();
  const stored = snapshot.exists ? snapshot.data()?.projects as Record<string, unknown>[] | undefined : undefined;
  const merged = mergeDutchRecords(stored, projects as unknown as Record<string, unknown>[], VISITOR_FIELDS);
  await ref.set(
    { projects: merged, updatedAt: new Date() },
    { merge: true },
  );
}

export async function setApplicationCaseImage(key: string, url: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(DOC_ID).set(
    { images: { [key]: url }, updatedAt: new Date() },
    { merge: true },
  );
}
