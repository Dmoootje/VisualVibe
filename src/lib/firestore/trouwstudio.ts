import "server-only";
import { cache } from "react";
import { randomUUID } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import {
  DEFAULT_TROUWSTUDIO_SETTINGS,
  type TrouwstudioSettings,
  type WeddingAlbum,
  type WeddingPhoto,
  type WeddingProject,
} from "@/features/trouwstudio/types";

// Persistentielaag Trouwstudio. Alle toegang loopt server-side via de admin
// SDK (afgeschermd door getCurrentAdmin in de actions/routes); clients praten
// nooit rechtstreeks met deze collecties, dus de bestaande deny-by-default
// Firestore-rules volstaan. Structuur:
//   trouwstudio_projects/{projectId}                 -> WeddingProject
//   trouwstudio_projects/{projectId}/photos/{id}     -> WeddingPhoto
//   trouwstudio_projects/{projectId}/albums/{id}     -> WeddingAlbum
//   site_content/trouwstudio_settings                -> TrouwstudioSettings

const PROJECTS = "trouwstudio_projects";

function now(): string {
  return new Date().toISOString();
}

function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T;
}

/**
 * Voor merge-updates: een expliciete `undefined` in de patch betekent
 * "veld wissen" (bv. een AI-voorstel weigeren) en wordt vertaald naar
 * FieldValue.delete(); gewoon weglaten laat het veld ongemoeid.
 */
function toMergePatch(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).map(([key, v]) => [key, v === undefined ? FieldValue.delete() : v]),
  );
}

/* ---------------- Projecten ---------------- */

export async function listWeddingProjects(): Promise<WeddingProject[]> {
  const snapshot = await adminDb.collection(PROJECTS).orderBy("updatedAt", "desc").get();
  return snapshot.docs.map((doc) => doc.data() as WeddingProject);
}

export const getWeddingProject = cache(async (projectId: string): Promise<WeddingProject | null> => {
  const doc = await adminDb.collection(PROJECTS).doc(projectId).get();
  return doc.exists ? (doc.data() as WeddingProject) : null;
});

export async function createWeddingProject(
  input: Omit<WeddingProject, "id" | "status" | "photoCount" | "optimizedPhotoCount" | "albumPhotoCount" | "archived" | "createdAt" | "updatedAt">,
): Promise<WeddingProject> {
  const id = `wp-${randomUUID().slice(0, 12)}`;
  const project: WeddingProject = {
    ...input,
    id,
    status: "concept",
    photoCount: 0,
    optimizedPhotoCount: 0,
    albumPhotoCount: 0,
    archived: false,
    createdAt: now(),
    updatedAt: now(),
  };
  await adminDb.collection(PROJECTS).doc(id).set(stripUndefined(project));
  return project;
}

export async function updateWeddingProject(projectId: string, patch: Partial<WeddingProject>): Promise<void> {
  await adminDb
    .collection(PROJECTS)
    .doc(projectId)
    .set(stripUndefined({ ...patch, updatedAt: now() }), { merge: true });
}

/** Verwijdert project + foto's + albums definitief (na bevestiging in de UI). */
export async function deleteWeddingProject(projectId: string): Promise<void> {
  const ref = adminDb.collection(PROJECTS).doc(projectId);
  for (const sub of ["photos", "albums"]) {
    const docs = await ref.collection(sub).listDocuments();
    for (let i = 0; i < docs.length; i += 400) {
      const batch = adminDb.batch();
      for (const doc of docs.slice(i, i + 400)) batch.delete(doc);
      await batch.commit();
    }
  }
  await ref.delete();
}

/** Herberekent de tellers op het projectdocument uit de fotocollectie. */
export async function refreshProjectCounters(projectId: string): Promise<void> {
  const photos = await listWeddingPhotos(projectId);
  const optimized = photos.filter((p) =>
    ["goedgekeurd", "handmatig_aangepast", "afgewerkt", "export_klaar"].includes(p.status),
  ).length;
  await updateWeddingProject(projectId, {
    photoCount: photos.length,
    optimizedPhotoCount: optimized,
    albumPhotoCount: photos.filter((p) => p.selectedForAlbum).length,
  });
}

/* ---------------- Foto's ---------------- */

export async function listWeddingPhotos(projectId: string): Promise<WeddingPhoto[]> {
  const snapshot = await adminDb.collection(PROJECTS).doc(projectId).collection("photos").orderBy("filename").get();
  return snapshot.docs.map((doc) => doc.data() as WeddingPhoto);
}

export async function getWeddingPhoto(projectId: string, photoId: string): Promise<WeddingPhoto | null> {
  const doc = await adminDb.collection(PROJECTS).doc(projectId).collection("photos").doc(photoId).get();
  return doc.exists ? (doc.data() as WeddingPhoto) : null;
}

export async function createWeddingPhoto(photo: WeddingPhoto): Promise<void> {
  await adminDb
    .collection(PROJECTS)
    .doc(photo.projectId)
    .collection("photos")
    .doc(photo.id)
    .set(stripUndefined(photo as unknown as Record<string, unknown>));
}

export async function updateWeddingPhoto(projectId: string, photoId: string, patch: Partial<WeddingPhoto>): Promise<void> {
  await adminDb
    .collection(PROJECTS)
    .doc(projectId)
    .collection("photos")
    .doc(photoId)
    .set(toMergePatch({ ...patch, updatedAt: now() }), { merge: true });
}

export async function updateWeddingPhotosBulk(
  projectId: string,
  photoIds: string[],
  patch: Partial<WeddingPhoto>,
): Promise<void> {
  const base = adminDb.collection(PROJECTS).doc(projectId).collection("photos");
  for (let i = 0; i < photoIds.length; i += 400) {
    const batch = adminDb.batch();
    for (const photoId of photoIds.slice(i, i + 400)) {
      batch.set(base.doc(photoId), toMergePatch({ ...patch, updatedAt: now() }), { merge: true });
    }
    await batch.commit();
  }
}

export async function deleteWeddingPhotos(projectId: string, photoIds: string[]): Promise<void> {
  const base = adminDb.collection(PROJECTS).doc(projectId).collection("photos");
  for (let i = 0; i < photoIds.length; i += 400) {
    const batch = adminDb.batch();
    for (const photoId of photoIds.slice(i, i + 400)) batch.delete(base.doc(photoId));
    await batch.commit();
  }
}

export async function findPhotoByHash(projectId: string, contentHash: string): Promise<WeddingPhoto | null> {
  const snapshot = await adminDb
    .collection(PROJECTS)
    .doc(projectId)
    .collection("photos")
    .where("contentHash", "==", contentHash)
    .limit(1)
    .get();
  return snapshot.empty ? null : (snapshot.docs[0].data() as WeddingPhoto);
}

/* ---------------- Albums ---------------- */

export async function getWeddingAlbum(projectId: string): Promise<WeddingAlbum | null> {
  const snapshot = await adminDb.collection(PROJECTS).doc(projectId).collection("albums").limit(1).get();
  return snapshot.empty ? null : (snapshot.docs[0].data() as WeddingAlbum);
}

export async function saveWeddingAlbum(album: WeddingAlbum): Promise<void> {
  await adminDb
    .collection(PROJECTS)
    .doc(album.projectId)
    .collection("albums")
    .doc(album.id)
    .set(stripUndefined({ ...album, updatedAt: now() } as unknown as Record<string, unknown>));
}

/* ---------------- Instellingen ---------------- */

async function readTrouwstudioSettings(): Promise<TrouwstudioSettings> {
  try {
    const doc = await adminDb.collection("site_content").doc("trouwstudio_settings").get();
    if (!doc.exists) return { ...DEFAULT_TROUWSTUDIO_SETTINGS };
    return { ...DEFAULT_TROUWSTUDIO_SETTINGS, ...(doc.data() as Partial<TrouwstudioSettings>) };
  } catch {
    return { ...DEFAULT_TROUWSTUDIO_SETTINGS };
  }
}

export const getTrouwstudioSettings = cache(readTrouwstudioSettings);

export async function setTrouwstudioSettings(patch: Partial<TrouwstudioSettings>): Promise<void> {
  await adminDb
    .collection("site_content")
    .doc("trouwstudio_settings")
    .set(stripUndefined({ ...patch, updatedAt: now() } as Record<string, unknown>), { merge: true });
}
