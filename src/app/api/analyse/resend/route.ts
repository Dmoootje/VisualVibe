import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAnalysisQuotaConfig } from "@/lib/analyse/config";
import { issueVerificationCode } from "@/lib/analyse/verification";
import { sendAnalysisVerificationMail } from "@/lib/email/analysisMails";
import { getAnalysisLead, updateAnalysisLead } from "@/lib/firestore/analysisLeads";
import type { AnalysisResendResponse } from "@/types/analysis";

// Statussen waarvoor een (nieuwe) verificatiecode legitiem is: nog niet
// geverifieerd, of een mislukte/gestrande run die de bezoeker opnieuw wil
// starten. Een nieuwe code vraagt altijd een nieuwe verificatie af, zodat een
// heranalyse nooit zonder geldige code kan draaien.
const RESENDABLE = new Set(["pending_verification", "failed", "verified"]);

export const runtime = "nodejs";
export const maxDuration = 30;

const resendSchema = z.object({
  analysisLeadId: z.string().trim().min(1).max(128),
});

function jsonError(error: string, status: number): NextResponse {
  return NextResponse.json({ status: "error", error } satisfies AnalysisResendResponse, { status });
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

  const parsed = resendSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Ongeldige aanvraag.", 400);
  }

  const analysisLead = await getAnalysisLead(parsed.data.analysisLeadId).catch(() => null);
  if (!analysisLead) {
    return jsonError("Aanvraag niet gevonden.", 404);
  }
  if (!RESENDABLE.has(analysisLead.status)) {
    return jsonError("Deze aanvraag kan geen nieuwe verificatiecode ontvangen.", 400);
  }

  const config = await getAnalysisQuotaConfig();
  if (config.maintenanceMode) {
    return jsonError("De websiteanalyse is tijdelijk in onderhoud. Probeer het later opnieuw.", 503);
  }
  const issued = await issueVerificationCode(
    analysisLead.id,
    analysisLead.emailNormalized,
    config,
  );
  if (!issued.ok) {
    const response = jsonError(
      "Je hebt te veel verificatiecodes aangevraagd. Probeer het over een uur opnieuw.",
      429,
    );
    response.headers.set("Retry-After", "3600");
    return response;
  }

  // Een mislukte/gestrande lead terugzetten op verificatie, zodat de nieuwe
  // code de flow weer door de codecontrole in /verify stuurt.
  if (analysisLead.status !== "pending_verification") {
    await updateAnalysisLead(analysisLead.id, { status: "pending_verification" });
  }

  // Mailresultaat is bewust niet fataal; de status staat in mail_history en de
  // code zelf wordt nergens gelogd of onversleuteld opgeslagen.
  await sendAnalysisVerificationMail({ analysisLead, code: issued.code });

  return NextResponse.json({ status: "code_sent" } satisfies AnalysisResendResponse);
}
