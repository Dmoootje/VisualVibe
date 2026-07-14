import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import { withTimeout } from "@/lib/firestore/withTimeout";
import {
  applicationCases as defaultApplicationCases,
  type ApplicationCase,
} from "@/data/applicationCases";

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
async function readApplicationCaseContent(): Promise<ApplicationCaseContent> {
  try {
    const doc = await withTimeout(adminDb.collection(COLLECTION).doc(DOC_ID).get());
    const data = doc.exists ? doc.data() : undefined;
    const storedProjects = data?.projects as ApplicationCase[] | undefined;
    const storedImages = data?.images as ApplicationCaseImages | undefined;

    return {
      projects:
        Array.isArray(storedProjects) && storedProjects.length > 0
          ? storedProjects
          : defaultApplicationCases,
      images: storedImages ?? {},
    };
  } catch {
    return {
      projects: defaultApplicationCases,
      images: {},
    };
  }
}

const getApplicationCaseContent = cache(readApplicationCaseContent);

export const getApplicationCases = cache(async (): Promise<ApplicationCase[]> => {
  const content = await getApplicationCaseContent();
  return content.projects;
});

export const getApplicationCaseImages = cache(async (): Promise<ApplicationCaseImages> => {
  const content = await getApplicationCaseContent();
  return content.images;
});

export async function getApplicationCaseBySlug(slug: string): Promise<ApplicationCase | undefined> {
  const projects = await getApplicationCases();
  return projects.find((project) => project.slug === slug && project.published);
}

export async function setApplicationCases(projects: ApplicationCase[]): Promise<void> {
  await adminDb.collection(COLLECTION).doc(DOC_ID).set(
    { projects, updatedAt: new Date() },
    { merge: true },
  );
}

export async function setApplicationCaseImage(key: string, url: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(DOC_ID).set(
    { images: { [key]: url }, updatedAt: new Date() },
    { merge: true },
  );
}
