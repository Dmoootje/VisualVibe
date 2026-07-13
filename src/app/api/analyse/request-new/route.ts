import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAnalysisLead, updateAnalysisLead } from "@/lib/firestore/analysisLeads";
import { addLeadEvent } from "@/lib/firestore/leadEvents";
import type { AnalysisRequestNewResponse } from "@/types/analysis";

export const runtime = "nodejs";

const requestNewSchema = z.object({
  analysisLeadId: z.string().trim().min(1).max(128),
});

function jsonError(error: string, status: number): NextResponse {
  return NextResponse.json({ status: "error", error } satisfies AnalysisRequestNewResponse, {
    status,
  });
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4_096) {
    return jsonError("Aanvraag is te groot.", 413);
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return jsonError("Ongeldige aanvraag.", 400);
  }

  const parsed = requestNewSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Ongeldige aanvraag.", 400);
  }

  const analysisLead = await getAnalysisLead(parsed.data.analysisLeadId).catch(() => null);
  if (!analysisLead) {
    return jsonError("Aanvraag niet gevonden.", 404);
  }

  // Alleen na een afgeronde (of hergebruikte) analyse kan de aanvrager een
  // nieuwe, geforceerde analyse aanvragen; de admin beoordeelt het verzoek.
  const isCompleted =
    analysisLead.status === "completed" || analysisLead.analysisStatus === "reused";
  if (!isCompleted) {
    return jsonError("Een nieuwe analyse aanvragen kan alleen na een afgeronde analyse.", 400);
  }

  // Idempotent: een herhaald verzoek verandert niets en logt geen extra event.
  if (analysisLead.forceRequested) {
    return NextResponse.json({ status: "requested" } satisfies AnalysisRequestNewResponse);
  }

  await updateAnalysisLead(analysisLead.id, { forceRequested: true });
  try {
    await addLeadEvent({
      leadId: analysisLead.leadId ?? analysisLead.id,
      type: "analysis_force_requested",
      createdBy: "system",
    });
  } catch {
    // Auditlog mag het verzoek nooit blokkeren.
  }

  return NextResponse.json({ status: "requested" } satisfies AnalysisRequestNewResponse);
}
