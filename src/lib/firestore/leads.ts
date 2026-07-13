import { createHash } from "node:crypto";
import { Query, QueryDocumentSnapshot, DocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type {
  Lead,
  LeadStatus,
  LeadPriority,
  LeadFormType,
  LeadLocale,
  LeadServiceId,
} from "@/types";

const COLLECTION = "leads";

function toLead(doc: QueryDocumentSnapshot | DocumentSnapshot): Lead {
  const data = doc.data()!;
  return {
    id: doc.id,
    leadNumber: data.leadNumber ?? doc.id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? undefined,
    company: data.company ?? undefined,
    serviceInterest: data.serviceInterest ?? undefined,
    selectedServices: Array.isArray(data.selectedServices)
      ? data.selectedServices
      : data.serviceInterest
        ? [data.serviceInterest]
        : [],
    formType: data.formType ?? "contact",
    locale: data.locale ?? "nl",
    idempotencyKey: data.idempotencyKey ?? undefined,
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
  selectedServices: LeadServiceId[];
  formType: LeadFormType;
  locale: LeadLocale;
  idempotencyKey?: string;
  region?: string;
  message: string;
  sourcePage?: string;
  sourceUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  privacyAccepted: boolean;
};

export type CreateLeadResult = { lead: Lead; created: boolean };

function stripUndefined(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
}

function leadDocumentId(idempotencyKey?: string): string {
  if (!idempotencyKey) return adminDb.collection(COLLECTION).doc().id;
  return createHash("sha256").update(idempotencyKey).digest("hex").slice(0, 40);
}

/**
 * Atomically creates the lead, yearly sequence number and created event. A
 * repeated idempotency key returns the existing lead and performs no writes.
 */
export async function createLead(input: CreateLeadInput): Promise<CreateLeadResult> {
  const now = new Date();
  const year = now.getFullYear();
  const ref = adminDb.collection(COLLECTION).doc(leadDocumentId(input.idempotencyKey));
  const counterRef = adminDb.collection("counters").doc(`leads-${year}`);
  const eventRef = adminDb.collection("lead_events").doc(`${ref.id}-created`);

  return adminDb.runTransaction(async (transaction) => {
    const existing = await transaction.get(ref);
    if (existing.exists) {
      return { lead: toLead(existing), created: false };
    }

    const counter = await transaction.get(counterRef);
    const sequence = Number(counter.data()?.value ?? 0) + 1;
    const leadNumber = `LEAD-VV-${year}-${String(sequence).padStart(4, "0")}`;
    const data = stripUndefined({
      ...input,
      leadNumber,
      status: "new" satisfies LeadStatus,
      priority: "normal" satisfies LeadPriority,
      createdAt: now,
      updatedAt: now,
    });

    transaction.set(counterRef, { value: sequence, updatedAt: now }, { merge: true });
    transaction.create(ref, data);
    transaction.create(eventRef, {
      leadId: ref.id,
      type: "created",
      createdBy: "system",
      createdAt: now,
    });

    return {
      created: true,
      lead: {
        id: ref.id,
        leadNumber,
        ...input,
        status: "new" as const,
        priority: "normal" as const,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    };
  });
}

export async function listLeads(status?: LeadStatus, formType?: LeadFormType): Promise<Lead[]> {
  let query: Query = adminDb.collection(COLLECTION);
  if (status) query = query.where("status", "==", status);
  if (formType) query = query.where("formType", "==", formType);

  // Bij een formType-filter geen orderBy in de query: de combinatie van
  // where + orderBy zou een composite index vereisen. Sorteren gebeurt dan
  // in JS; de volumes zijn klein.
  if (!formType) {
    const snapshot = await query.orderBy("createdAt", "desc").get();
    return snapshot.docs.map(toLead);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(toLead).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
