import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { LeadNote } from "@/types";

const COLLECTION = "lead_notes";

function toLeadNote(doc: QueryDocumentSnapshot): LeadNote {
  const data = doc.data();
  return {
    id: doc.id,
    leadId: data.leadId,
    note: data.note,
    createdBy: data.createdBy,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  };
}

export async function addLeadNote(leadId: string, note: string, createdBy: string): Promise<string> {
  const ref = await adminDb.collection(COLLECTION).add({
    leadId,
    note,
    createdBy,
    createdAt: new Date(),
  });
  return ref.id;
}

export async function listNotesByLead(leadId: string): Promise<LeadNote[]> {
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("leadId", "==", leadId)
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map(toLeadNote);
}
