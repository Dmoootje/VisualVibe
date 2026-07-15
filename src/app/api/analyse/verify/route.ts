import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { businessConfig } from "@/config/business.config";
import { getAnalysisQuotaConfig } from "@/lib/analyse/config";
import { normalizeAndValidateUrl } from "@/lib/analyse/domain";
import { runWebsiteAnalysis } from "@/lib/analyse/engine";
import {
  checkAndReserveQuota,
  consumeReservation,
  releaseReservation,
  type QuotaOutcome,
} from "@/lib/analyse/quota";
import { verifyVerificationCode } from "@/lib/analyse/verification";
import { sendAnalysisAdminNotification, sendAnalysisReportMail } from "@/lib/email/analysisMails";
import { adminDb } from "@/lib/firebase/admin";
import {
  getAnalysisLead,
  listAnalysisLeadsByEmail,
  newReportToken,
  updateAnalysisLead,
} from "@/lib/firestore/analysisLeads";
import { addLeadEvent } from "@/lib/firestore/leadEvents";
import { createSubscriber } from "@/lib/firestore/newsletter";
import type { LeadEventType } from "@/types";
import type { AnalysisLead, AnalysisVerifyResponse } from "@/types/analysis";

export const runtime = "nodejs";
// Tot 5 minuten: een diepere JS/SSR-crawl aan de partnerkant kan langer duren dan
// de gebruikelijke ~35s. De client kapt zijn eigen request eerder af (net onder
// Cloudflare's ~100s) en meldt dat het rapport gemaild wordt; deze functie loopt
// server-side gewoon door tot de analyse klaar is en verstuurt de rapportmail.
export const maxDuration = 300;

/**
 * Na deze tijd geldt een lead die in "analysing" blijft hangen als gestrand
 * (proces gecrasht of platform-timeout tussen statuswrite en afronding). Bewust
 * boven de function-budget (maxDuration 300s) zodat een legitieme, nog lopende
 * lange analyse niet ten onrechte wordt teruggevorderd; een echt gestrande run
 * wordt daarna alsnog vrijgegeven.
 */
const ANALYSING_LEASE_MS = 7 * 60_000;

const LIMIT_MESSAGE = "Je hebt je drie gratis analyses voor deze periode gebruikt.";
const FAILED_MESSAGE =
  "De analyse is tijdelijk niet gelukt. Je tegoed is niet gebruikt - probeer het zo opnieuw.";

const verifySchema = z.object({
  analysisLeadId: z.string().trim().min(1).max(128),
  code: z.string().trim().min(1).max(12),
});

function json(payload: AnalysisVerifyResponse, status = 200): NextResponse {
  return NextResponse.json(payload, { status });
}

function reportPath(token: string): string {
  return `/website-analyse/rapport/${token}`;
}

function reportUrlAbsolute(token: string): string {
  return `${businessConfig.url}${reportPath(token)}`;
}

/** Auditlog op de gekoppelde lead; mag de flow nooit blokkeren. */
async function safeLeadEvent(analysisLead: AnalysisLead, type: LeadEventType): Promise<void> {
  try {
    await addLeadEvent({
      leadId: analysisLead.leadId ?? analysisLead.id,
      type,
      createdBy: "system",
    });
  } catch {
    // Bewust stil: het event is informatief, niet dragend.
  }
}

/**
 * Resterende pogingen voor de actieve code. Alleen het attempts-veld wordt
 * gelezen (nooit de codehash zelf); bij twijfel geven we conservatief 0.
 */
async function attemptsLeftFor(analysisLeadId: string, maxAttempts: number): Promise<number> {
  try {
    const snapshot = await adminDb
      .collection("analysis_verifications")
      .where("analysisLeadId", "==", analysisLeadId)
      .get();
    const active = snapshot.docs
      .map((doc) => doc.data())
      .filter((data) => !data.consumedAt && !data.supersededAt)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];
    if (!active) return 0;
    const attempts = typeof active.attempts === "number" ? active.attempts : maxAttempts;
    return Math.max(0, maxAttempts - attempts);
  } catch {
    return 0;
  }
}

/**
 * Adminmelding "limit_reached" alleen wanneer er de afgelopen 24 uur nog geen
 * andere limit-lead voor dit e-mailadres was; zo krijgt het team geen
 * herhaalspam van dezelfde bezoeker.
 */
async function shouldNotifyLimit(analysisLead: AnalysisLead): Promise<boolean> {
  try {
    const recent = await listAnalysisLeadsByEmail(analysisLead.emailNormalized);
    const dayAgo = Date.now() - 24 * 60 * 60_000;
    return !recent.some(
      (other) =>
        other.id !== analysisLead.id &&
        other.status === "limit_reached" &&
        Date.parse(other.updatedAt) >= dayAgo,
    );
  } catch {
    // Bij twijfel geen extra mail; de lead zelf staat correct geregistreerd.
    return false;
  }
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4_096) {
    return json({ status: "error", error: "Aanvraag is te groot." }, 413);
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return json({ status: "error", error: "Ongeldige aanvraag." }, 400);
  }

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return json({ status: "error", error: "Ongeldige aanvraag." }, 400);
  }

  const analysisLead = await getAnalysisLead(parsed.data.analysisLeadId).catch(() => null);
  if (!analysisLead) {
    return json({ status: "error", error: "Aanvraag niet gevonden." }, 404);
  }

  // Idempotent: een al afgeronde aanvraag geeft het bestaande resultaat terug.
  if (analysisLead.status === "completed" && analysisLead.reportToken) {
    return json({
      status: analysisLead.analysisStatus === "reused" ? "reused" : "completed",
      reportUrl: reportPath(analysisLead.reportToken),
      score: analysisLead.analysisScore ?? 0,
      criticalIssues: analysisLead.criticalIssues ?? [],
    });
  }
  if (analysisLead.status === "limit_reached") {
    return json({ status: "limit_reached", message: LIMIT_MESSAGE });
  }
  if (analysisLead.status === "expired") {
    return json(
      { status: "error", error: "Deze aanvraag is verlopen. Vraag een nieuwe analyse aan." },
      410,
    );
  }
  if (analysisLead.status === "analysing" || analysisLead.status === "queued") {
    // Gestrande run (proces gecrasht na de statuswrite): reservering vrijgeven
    // en de lead als mislukt afsluiten, zodat de bezoeker via een nieuwe code
    // opnieuw kan starten in plaats van eeuwig op 409 te blijven hangen.
    const startedMs = analysisLead.startedAt ? Date.parse(analysisLead.startedAt) : NaN;
    const stale = Number.isFinite(startedMs) && Date.now() - startedMs > ANALYSING_LEASE_MS;
    if (!stale) {
      return json({ status: "error", error: "De analyse loopt nog. Probeer het zo opnieuw." }, 409);
    }
    if (analysisLead.analysisId) {
      await releaseReservation(analysisLead.analysisId).catch(() => undefined);
    }
    await updateAnalysisLead(analysisLead.id, {
      status: "failed",
      analysisStatus: "failed",
      failedAt: new Date().toISOString(),
      quotaReason: "stale_analysing_reclaimed",
    });
    await safeLeadEvent(analysisLead, "analysis_failed");
    return json({ status: "failed", message: FAILED_MESSAGE });
  }

  const config = await getAnalysisQuotaConfig();

  // De dure analyse mag ALLEEN draaien direct na een geldige e-mailverificatie.
  // Een lead die niet (meer) op verificatie wacht - bv. na een mislukte run of
  // een gestrand "verified" - heeft geen actieve code en moet er via
  // /api/analyse/resend een nieuwe aanvragen. Zo kan een reeds geverifieerde
  // lead de engine nooit ongelimiteerd en zonder code opnieuw afvuren.
  if (analysisLead.status !== "pending_verification") {
    return json({ status: "code_expired" });
  }

  const verdict = await verifyVerificationCode(analysisLead.id, parsed.data.code, config);
  if (verdict === "invalid") {
    const attemptsLeft = await attemptsLeftFor(analysisLead.id, config.maxCodeAttempts);
    return json({ status: "invalid_code", attemptsLeft });
  }
  if (verdict === "expired" || verdict === "attempts_exceeded") {
    // In beide gevallen is een nieuwe code nodig (via /api/analyse/resend).
    return json({ status: "code_expired" });
  }

  const verifiedAt = new Date().toISOString();
  await updateAnalysisLead(analysisLead.id, {
    status: "verified",
    emailVerifiedAt: verifiedAt,
    verifiedAt,
  });
  analysisLead.status = "verified";
  analysisLead.emailVerifiedAt = verifiedAt;
  analysisLead.verifiedAt = verifiedAt;
  await safeLeadEvent(analysisLead, "analysis_verified");

  // Nieuwsbriefinschrijving pas NA e-mailverificatie, en nooit fataal.
  if (analysisLead.newsletterConsent && !analysisLead.newsletterConsentAt) {
    try {
      await createSubscriber({
        email: analysisLead.emailNormalized,
        ...(analysisLead.sourcePage ? { sourcePage: analysisLead.sourcePage } : {}),
      });
      const consentAt = new Date().toISOString();
      await updateAnalysisLead(analysisLead.id, { newsletterConsentAt: consentAt });
      analysisLead.newsletterConsentAt = consentAt;
    } catch {
      // Inschrijving kan later alsnog; de analyse gaat gewoon door.
    }
  }

  // Quotacontrole en reservering. Staat de bewaking uit, dan is alles
  // toegestaan zonder reservering (lege reservationId).
  let outcome: QuotaOutcome;
  if (config.enabled) {
    try {
      outcome = await checkAndReserveQuota({
        emailNormalized: analysisLead.emailNormalized,
        deviceHash: analysisLead.deviceHash,
        ipHash: analysisLead.ipHash,
        normalizedDomain: analysisLead.normalizedDomain,
        config,
      });
    } catch {
      return json({ status: "failed", message: FAILED_MESSAGE });
    }
  } else {
    outcome = { decision: "allowed", reservationId: "" };
  }

  // Recent rapport voor dit domein: hergebruiken in plaats van opnieuw draaien.
  if (outcome.decision === "reused_recent") {
    const source = await getAnalysisLead(outcome.reuseFrom.analysisLeadId).catch(() => null);
    const token = newReportToken();
    const nowIso = new Date().toISOString();
    const score = source?.analysisScore ?? outcome.reuseFrom.analysisScore ?? 0;
    const criticalIssues = source?.criticalIssues ?? outcome.reuseFrom.criticalIssues ?? [];

    await updateAnalysisLead(analysisLead.id, {
      status: "completed",
      analysisStatus: "reused",
      reusedFromId: outcome.reuseFrom.analysisLeadId,
      reportToken: token,
      analysisScore: score,
      criticalIssues,
      ...(source?.analysisSummary ? { analysisSummary: source.analysisSummary } : {}),
      quotaDecision: "reused_recent",
      completedAt: nowIso,
    });

    const completedLead: AnalysisLead = {
      ...analysisLead,
      status: "completed",
      analysisStatus: "reused",
      reusedFromId: outcome.reuseFrom.analysisLeadId,
      reportToken: token,
      analysisScore: score,
      criticalIssues,
      ...(source?.analysisSummary ? { analysisSummary: source.analysisSummary } : {}),
      quotaDecision: "reused_recent",
      completedAt: nowIso,
    };

    await sendAnalysisReportMail({ analysisLead: completedLead, reportUrl: reportUrlAbsolute(token) });
    await sendAnalysisAdminNotification({ analysisLead: completedLead, kind: "completed" });
    await safeLeadEvent(analysisLead, "analysis_reused");

    return json({
      status: "reused",
      reportUrl: reportPath(token),
      score,
      criticalIssues,
    });
  }

  // Limiet of duplicaat: registreren, gededupeerd melden en netjes afwijzen.
  if ("reason" in outcome) {
    await updateAnalysisLead(analysisLead.id, {
      status: "limit_reached",
      quotaDecision: outcome.decision,
      quotaReason: outcome.reason,
    });
    const limitedLead: AnalysisLead = {
      ...analysisLead,
      status: "limit_reached",
      quotaDecision: outcome.decision,
      quotaReason: outcome.reason,
    };
    await safeLeadEvent(analysisLead, "analysis_limit_reached");
    if (await shouldNotifyLimit(analysisLead)) {
      await sendAnalysisAdminNotification({ analysisLead: limitedLead, kind: "limit_reached" });
    }
    return json({
      status: "limit_reached",
      message: outcome.decision === "duplicate_request" ? outcome.reason : LIMIT_MESSAGE,
    });
  }

  // Toegestaan: analyse starten met een actieve reservering.
  const reservationId = outcome.reservationId;
  const startedAt = new Date().toISOString();
  await updateAnalysisLead(analysisLead.id, {
    status: "analysing",
    startedAt,
    ...(reservationId ? { analysisId: reservationId } : {}),
    quotaDecision: outcome.decision,
  });
  await safeLeadEvent(analysisLead, "analysis_started");

  const failAnalysis = async (errorCode: string): Promise<NextResponse> => {
    if (reservationId) {
      try {
        await releaseReservation(reservationId);
      } catch {
        // Reservering blijft dan staan; admin kan het quotum resetten.
      }
    }
    const failedAt = new Date().toISOString();
    await updateAnalysisLead(analysisLead.id, {
      status: "failed",
      analysisStatus: "failed",
      failedAt,
      quotaReason: errorCode,
    });
    const failedLead: AnalysisLead = {
      ...analysisLead,
      status: "failed",
      analysisStatus: "failed",
      failedAt,
      quotaDecision: outcome.decision,
      quotaReason: errorCode,
    };
    await safeLeadEvent(analysisLead, "analysis_failed");
    // Gededupet via de idempotencyKey in analysisMails; nooit twee meldingen.
    await sendAnalysisAdminNotification({ analysisLead: failedLead, kind: "failed" });
    return json({ status: "failed", message: FAILED_MESSAGE });
  };

  // De URL wordt vlak voor de run opnieuw gevalideerd (DNS kan intussen naar
  // een intern adres wijzen); bij twijfel faalt de analyse veilig.
  const validatedUrl = await normalizeAndValidateUrl(analysisLead.submittedUrl);
  if (!validatedUrl.ok) {
    return failAnalysis("url_validation_failed");
  }

  const result = await runWebsiteAnalysis({
    safeUrl: validatedUrl.safeUrl,
    normalizedDomain: analysisLead.normalizedDomain,
    // Stabiel per lead: een retry hergebruikt bij de partner dezelfde analyse
    // (idempotency) i.p.v. opnieuw af te rekenen.
    idempotencyKey: analysisLead.id,
  });

  if (result.status !== "completed") {
    return failAnalysis(result.errorCode);
  }

  const token = newReportToken();
  const completedAt = new Date().toISOString();
  await updateAnalysisLead(analysisLead.id, {
    status: "completed",
    analysisStatus: "completed",
    analysisScore: result.score,
    criticalIssues: result.criticalIssues,
    ...(result.summary ? { analysisSummary: result.summary } : {}),
    reportToken: token,
    completedAt,
  });

  if (reservationId) {
    try {
      await consumeReservation(reservationId);
    } catch {
      // De reservering blijft dan meetellen; dat is de veilige kant.
    }
  }

  const completedLead: AnalysisLead = {
    ...analysisLead,
    status: "completed",
    analysisStatus: "completed",
    analysisScore: result.score,
    criticalIssues: result.criticalIssues,
    ...(result.summary ? { analysisSummary: result.summary } : {}),
    reportToken: token,
    ...(reservationId ? { analysisId: reservationId } : {}),
    quotaDecision: outcome.decision,
    startedAt,
    completedAt,
  };

  await sendAnalysisReportMail({ analysisLead: completedLead, reportUrl: reportUrlAbsolute(token) });
  await sendAnalysisAdminNotification({ analysisLead: completedLead, kind: "completed" });
  await safeLeadEvent(analysisLead, "analysis_completed");

  return json({
    status: "completed",
    reportUrl: reportPath(token),
    score: result.score,
    criticalIssues: result.criticalIssues,
  });
}
