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

async function readApplicationCases(): Promise<ApplicationCase[]> {
  try {
    const doc = await withTimeout(adminDb.collection(COLLECTION).doc(DOC_ID).get());
    const stored = doc.exists ? (doc.data()?.projects as ApplicationCase[] | undefined) : undefined;
    return Array.isArray(stored) && stored.length > 0 ? stored : defaultApplicationCases;
  } catch {
    return defaultApplicationCases;
  }
}

async function readApplicationCaseImages(): Promise<ApplicationCaseImages> {
  try {
    const doc = await withTimeout(adminDb.collection(COLLECTION).doc(DOC_ID).get());
    return (doc.exists ? (doc.data()?.images as ApplicationCaseImages | undefined) : undefined) ?? {};
  } catch {
    return {};
  }
}

export const getApplicationCases = cache(readApplicationCases);
export const getApplicationCaseImages = cache(readApplicationCaseImages);

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
