import "server-only";

import { randomBytes } from "node:crypto";
import type { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { AnalysisLead, AnalysisLeadStatus } from "@/types/analysis";

const COLLECTION = "analysis_leads";

/** Datums staan als ISO-strings in de documenten; Timestamps defensief mee-afhandelen. */
function toIsoString(value: unknown): string {
  if (typeof value === "string") return value;
  const maybeTimestamp = value as { toDate?: () => Date } | undefined;
  return maybeTimestamp?.toDate?.().toISOString() ?? new Date().toISOString();
}

function toAnalysisLead(doc: QueryDocumentSnapshot | DocumentSnapshot): AnalysisLead {
  const data = doc.data()!;
  const { id: _id, createdAt, updatedAt, ...rest } = data;
  return {
    ...(rest as Omit<AnalysisLead, "id" | "createdAt" | "updatedAt">),
    id: doc.id,
    createdAt: toIsoString(createdAt),
    updatedAt: toIsoString(updatedAt),
  };
}

/** Drops undefined values so Firestore never receives them. */
function stripUndefined(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
}

export type CreateAnalysisLeadInput = Omit<AnalysisLead, "id" | "status" | "createdAt" | "updatedAt"> & {
  status?: AnalysisLeadStatus;
};

export async function createAnalysisLead(input: CreateAnalysisLeadInput): Promise<AnalysisLead> {
  const nowIso = new Date().toISOString();
  const ref = adminDb.collection(COLLECTION).doc();
  const lead: AnalysisLead = {
    ...input,
    id: ref.id,
    status: input.status ?? "pending_verification",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const { id: _id, ...documentData } = lead;
  await ref.create(stripUndefined(documentData));
  return lead;
}

export async function getAnalysisLead(id: string): Promise<AnalysisLead | null> {
  const doc = await adminDb.collection(COLLECTION).doc(id).get();
  return doc.exists ? toAnalysisLead(doc) : null;
}

export async function getAnalysisLeadByReportToken(token: string): Promise<AnalysisLead | null> {
  const clean = token.trim();
  if (!clean) return null;
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("reportToken", "==", clean)
    .limit(1)
    .get();
  return snapshot.empty ? null : toAnalysisLead(snapshot.docs[0]);
}

export async function updateAnalysisLead(id: string, patch: Partial<AnalysisLead>): Promise<void> {
  const { id: _id, ...rest } = patch;
  await adminDb
    .collection(COLLECTION)
    .doc(id)
    .update(stripUndefined({ ...rest, updatedAt: new Date().toISOString() }));
}

function sortNewestFirst(leads: AnalysisLead[]): AnalysisLead[] {
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listAnalysisLeadsByLeadId(leadId: string): Promise<AnalysisLead[]> {
  const snapshot = await adminDb.collection(COLLECTION).where("leadId", "==", leadId).get();
  return sortNewestFirst(snapshot.docs.map(toAnalysisLead));
}

export async function listAnalysisLeadsByEmail(
  emailNormalized: string,
  max?: number,
): Promise<AnalysisLead[]> {
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("emailNormalized", "==", emailNormalized)
    .get();
  const leads = sortNewestFirst(snapshot.docs.map(toAnalysisLead));
  return max !== undefined && max > 0 ? leads.slice(0, max) : leads;
}

export async function listRecentCompletedByDomain(
  normalizedDomain: string,
  sinceDays: number,
): Promise<AnalysisLead[]> {
  const since = Date.now() - sinceDays * 24 * 60 * 60_000;
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("normalizedDomain", "==", normalizedDomain)
    .get();
  const leads = snapshot.docs
    .map(toAnalysisLead)
    .filter((lead) => lead.status === "completed" && Date.parse(lead.createdAt) >= since);
  return sortNewestFirst(leads);
}

/** Niet-voorspelbaar rapporttoken: 32 random bytes als base64url. */
export function newReportToken(): string {
  return randomBytes(32).toString("base64url");
}
