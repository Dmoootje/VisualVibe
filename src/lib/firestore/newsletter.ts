import { QueryDocumentSnapshot, DocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { Subscriber } from "@/types";

const COLLECTION = "newsletter_subscribers";

function toSubscriber(doc: QueryDocumentSnapshot | DocumentSnapshot): Subscriber {
  const data = doc.data()!;
  return {
    id: doc.id,
    email: data.email,
    sourcePage: data.sourcePage ?? undefined,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  };
}

export type CreateSubscriberInput = {
  email: string;
  sourcePage?: string;
};

/**
 * Stores a newsletter subscriber. Idempotent: a repeat sign-up with the same
 * email returns the existing document instead of creating a duplicate.
 */
export async function createSubscriber(input: CreateSubscriberInput): Promise<string> {
  const email = input.email.trim().toLowerCase();
  const existing = await adminDb
    .collection(COLLECTION)
    .where("email", "==", email)
    .limit(1)
    .get();
  if (!existing.empty) {
    return existing.docs[0].id;
  }

  const ref = await adminDb.collection(COLLECTION).add({
    email,
    sourcePage: input.sourcePage ?? null,
    createdAt: new Date(),
  });
  return ref.id;
}

export async function listSubscribers(): Promise<Subscriber[]> {
  const snapshot = await adminDb.collection(COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map(toSubscriber);
}
