import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import type { Profile } from "@/types";

const COLLECTION = "profiles";

export async function getProfile(uid: string): Promise<Profile | null> {
  const doc = await adminDb.collection(COLLECTION).doc(uid).get();
  if (!doc.exists) {
    return null;
  }
  const data = doc.data()!;
  return {
    uid,
    email: data.email,
    name: data.name || undefined,
    photoUrl: data.photoUrl || undefined,
    role: data.role === "admin" ? "admin" : "user",
    createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  };
}

/** Creates a non-privileged profile on first login unless authorization was established separately. */
export async function ensureProfile(
  uid: string,
  email: string,
  role: Profile["role"] = "user"
): Promise<Profile> {
  const existing = await getProfile(uid);
  if (existing) {
    return existing;
  }

  const now = new Date();
  await adminDb.collection(COLLECTION).doc(uid).set({ email, role, createdAt: now });
  return { uid, email, role, createdAt: now.toISOString() };
}

export type UpdateProfileInput = {
  name?: string;
  /** "" wist de foto (persisted zodat leegmaken blijft plakken). */
  photoUrl?: string;
};

export async function updateProfile(uid: string, input: UpdateProfileInput): Promise<void> {
  await adminDb.collection(COLLECTION).doc(uid).set(input, { merge: true });
}

/**
 * Auteursnaam -> profielfoto-URL, over alle admin-profielen. Blogposts kennen
 * hun auteur alleen bij naam (frontmatter), dus de koppeling loopt via de
 * profielnaam: die moet exact overeenkomen met de auteursnaam van de artikels
 * (bv. "Jens Hardy"). Faalt stil naar {} zodat builds zonder Firestore werken.
 */
export const getAuthorPhotoMap = cache(async (): Promise<Record<string, string>> => {
  try {
    const snap = await adminDb.collection(COLLECTION).get();
    const map: Record<string, string> = {};
    for (const doc of snap.docs) {
      const data = doc.data();
      const name = typeof data.name === "string" ? data.name.trim() : "";
      const photoUrl = typeof data.photoUrl === "string" ? data.photoUrl.trim() : "";
      if (name && photoUrl) map[name] = photoUrl;
    }
    return map;
  } catch {
    return {};
  }
});
