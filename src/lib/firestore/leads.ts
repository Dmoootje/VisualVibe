import { Query, QueryDocumentSnapshot, DocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { Lead, LeadStatus, LeadPriority } from "@/types";

const COLLECTION = "leads";

function toLead(doc: QueryDocumentSnapshot | DocumentSnapshot): Lead {
  const data = doc.data()!;
  return {
    id: doc.id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? undefined,
    company: data.company ?? undefined,
    serviceInterest: data.serviceInterest ?? undefined,
    region: data.region ?? undefined,
    message: data.message,
    sourcePage: data.sourcePage ?? undefined,
    sourceUrl: data.sourceUrl ?? undefined,
    utmSource: data.utmSource ?? undefined,
    utmMedium: data.utmMedium ?? undefined,
    utmCampaign: data.utmCampaign ?? undefined,
    privacyAccepted: Boolean(data.privacyAccepted),
    status: data.status ?? "new",
    priority: data.priority ?? "normal",
    createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  };
}

export type CreateLeadInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  region?: string;
  message: string;
  sourcePage?: string;
  sourceUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  privacyAccepted: boolean;
};

export async function createLead(input: CreateLeadInput): Promise<string> {
  const now = new Date();
  const ref = await adminDb.collection(COLLECTION).add({
    ...input,
    status: "new" satisfies LeadStatus,
    priority: "normal" satisfies LeadPriority,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function listLeads(status?: LeadStatus): Promise<Lead[]> {
  const base: Query = adminDb.collection(COLLECTION);
  const query = status ? base.where("status", "==", status) : base;
  const snapshot = await query.orderBy("createdAt", "desc").get();
  return snapshot.docs.map(toLead);
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const doc = await adminDb.collection(COLLECTION).doc(id).get();
  return doc.exists ? toLead(doc) : null;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).update({ status, updatedAt: new Date() });
}

export async function updateLeadPriority(id: string, priority: LeadPriority): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).update({ priority, updatedAt: new Date() });
}
