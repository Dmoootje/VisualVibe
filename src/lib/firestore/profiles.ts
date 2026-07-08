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
    name: data.name ?? undefined,
    role: data.role ?? "admin",
    createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  };
}

/** Creates the profile doc on first login; returns the existing one otherwise. */
export async function ensureProfile(uid: string, email: string): Promise<Profile> {
  const existing = await getProfile(uid);
  if (existing) {
    return existing;
  }

  const now = new Date();
  await adminDb.collection(COLLECTION).doc(uid).set({ email, role: "admin", createdAt: now });
  return { uid, email, role: "admin", createdAt: now.toISOString() };
}
