import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { LeadEvent, LeadEventType } from "@/types";

const COLLECTION = "lead_events";

function toLeadEvent(doc: QueryDocumentSnapshot): LeadEvent {
  const data = doc.data();
  return {
    id: doc.id,
    leadId: data.leadId,
    type: data.type,
    oldValue: data.oldValue ?? undefined,
    newValue: data.newValue ?? undefined,
    createdBy: data.createdBy,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  };
}

export type AddLeadEventInput = {
  leadId: string;
  type: LeadEventType;
  oldValue?: string;
  newValue?: string;
  createdBy: string;
};

export async function addLeadEvent(input: AddLeadEventInput): Promise<void> {
  await adminDb.collection(COLLECTION).add({ ...input, createdAt: new Date() });
}

export async function listEventsByLead(leadId: string): Promise<LeadEvent[]> {
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("leadId", "==", leadId)
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map(toLeadEvent);
}
