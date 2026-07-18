import "server-only";

import type { DocumentSnapshot } from "firebase-admin/firestore";
import { parsePartnerAuditReport } from "@/lib/analyse/partnerReportSchema";
import { adminDb } from "@/lib/firebase/admin";
import type {
  AnalysisReportDocument,
  NormalizedPartnerAuditReport,
} from "@/types/analysis";

const COLLECTION = "analysis_reports";

export type CreateAnalysisReportInput = {
  partnerAnalysisId: string;
  normalizedDomain: string;
  sourceUrl: string;
  report: NormalizedPartnerAuditReport;
};

function toIsoString(value: unknown): string {
  if (typeof value === "string") return value;
  const timestamp = value as { toDate?: () => Date } | undefined;
  return timestamp?.toDate?.().toISOString() ?? new Date().toISOString();
}

function fromSnapshot(snapshot: DocumentSnapshot): AnalysisReportDocument | null {
  if (!snapshot.exists) return null;
  const data = snapshot.data();
  if (!data) return null;
  try {
    const report = parsePartnerAuditReport(data.report);
    return {
      id: snapshot.id,
      partnerAnalysisId: String(data.partnerAnalysisId ?? ""),
      schemaVersion: Number(data.schemaVersion ?? report.schemaVersion),
      normalizedDomain: String(data.normalizedDomain ?? ""),
      sourceUrl: String(data.sourceUrl ?? report.url),
      ...(report.outputLanguage ? { outputLanguage: report.outputLanguage } : {}),
      report,
      createdAt: toIsoString(data.createdAt),
      updatedAt: toIsoString(data.updatedAt),
    };
  } catch {
    return null;
  }
}

export async function createAnalysisReport(
  input: CreateAnalysisReportInput,
): Promise<AnalysisReportDocument> {
  const ref = adminDb.collection(COLLECTION).doc();
  const now = new Date().toISOString();
  const document: AnalysisReportDocument = {
    id: ref.id,
    partnerAnalysisId: input.partnerAnalysisId,
    schemaVersion: input.report.schemaVersion,
    normalizedDomain: input.normalizedDomain,
    sourceUrl: input.sourceUrl,
    ...(input.report.outputLanguage ? { outputLanguage: input.report.outputLanguage } : {}),
    report: input.report,
    createdAt: now,
    updatedAt: now,
  };
  const { id: _id, ...data } = document;
  await ref.create(data);
  return document;
}

export async function getAnalysisReport(id: string): Promise<AnalysisReportDocument | null> {
  const clean = id.trim();
  if (!clean) return null;
  const snapshot = await adminDb.collection(COLLECTION).doc(clean).get();
  return fromSnapshot(snapshot);
}
