import "server-only";

import { randomInt, timingSafeEqual } from "node:crypto";
import { adminDb } from "@/lib/firebase/admin";
import { hmacIdentifier } from "@/lib/security/encryption";
import type { AnalysisQuotaConfig } from "@/types/analysis";

const VERIFICATIONS_COLLECTION = "analysis_verifications";
const THROTTLE_COLLECTION = "analysis_code_throttle";
const CODE_PURPOSE = "verification-code";
const THROTTLE_WINDOW_MS = 60 * 60_000;

/**
 * Verificatiedocument. De code zelf wordt UITSLUITEND als HMAC-hash bewaard;
 * plaintext-codes worden nooit opgeslagen of gelogd.
 */
type VerificationDoc = {
  analysisLeadId: string;
  emailNormalized: string;
  codeHash: string;
  attempts: number;
  expiresAt: string;
  consumedAt?: string;
  supersededAt?: string;
  createdAt: string;
};

function codeHashFor(code: string, analysisLeadId: string): string {
  return hmacIdentifier(`${code}:${analysisLeadId}`, CODE_PURPOSE);
}

function hashesMatch(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

/**
 * Maakt een nieuwe 6-cijferige verificatiecode aan. Alles gebeurt in EEN
 * transactie: throttle per e-mail controleren en ophogen, eerdere actieve
 * codes voor deze analysis_lead superseden en de nieuwe code (als hash)
 * wegschrijven. De plaintext-code wordt alleen geretourneerd voor de mail.
 */
export async function issueVerificationCode(
  analysisLeadId: string,
  emailNormalized: string,
  config: AnalysisQuotaConfig,
): Promise<{ ok: true; code: string } | { ok: false; reason: "rate_limited" }> {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const codeHash = codeHashFor(code, analysisLeadId);

  const throttleRef = adminDb
    .collection(THROTTLE_COLLECTION)
    .doc(hmacIdentifier(emailNormalized, "code-throttle"));
  const activeQuery = adminDb
    .collection(VERIFICATIONS_COLLECTION)
    .where("analysisLeadId", "==", analysisLeadId);

  return adminDb.runTransaction(async (transaction) => {
    const now = new Date();
    const nowIso = now.toISOString();
    const windowStart = now.getTime() - THROTTLE_WINDOW_MS;

    // Reads eerst (Firestore-transactieregel), daarna pas writes.
    const [throttleDoc, activeSnapshot] = await Promise.all([
      transaction.get(throttleRef),
      transaction.get(activeQuery),
    ]);

    const rawEntries = throttleDoc.data()?.entries;
    const entries: string[] = Array.isArray(rawEntries)
      ? rawEntries.filter(
          (entry): entry is string =>
            typeof entry === "string" && Date.parse(entry) > windowStart,
        )
      : [];
    if (entries.length >= config.maxCodesPerEmailPerHour) {
      return { ok: false, reason: "rate_limited" as const };
    }

    transaction.set(throttleRef, { entries: [...entries, nowIso], updatedAt: nowIso });

    for (const doc of activeSnapshot.docs) {
      const data = doc.data() as VerificationDoc;
      if (!data.consumedAt && !data.supersededAt) {
        transaction.update(doc.ref, { supersededAt: nowIso });
      }
    }

    const verification: VerificationDoc = {
      analysisLeadId,
      emailNormalized,
      codeHash,
      attempts: 0,
      expiresAt: new Date(now.getTime() + config.codeTtlMinutes * 60_000).toISOString(),
      createdAt: nowIso,
    };
    transaction.create(adminDb.collection(VERIFICATIONS_COLLECTION).doc(), verification);

    return { ok: true as const, code };
  });
}

/**
 * Controleert een ingevoerde code transactioneel: verlopen codes, het maximum
 * aantal pogingen en een timingsafe hash-vergelijking. Een foute code verhoogt
 * de teller; een juiste code wordt geconsumeerd en is daarna onbruikbaar.
 */
export async function verifyVerificationCode(
  analysisLeadId: string,
  code: string,
  config: AnalysisQuotaConfig,
): Promise<"ok" | "invalid" | "expired" | "attempts_exceeded"> {
  const submitted = code.trim();
  const submittedHash = codeHashFor(submitted, analysisLeadId);
  const activeQuery = adminDb
    .collection(VERIFICATIONS_COLLECTION)
    .where("analysisLeadId", "==", analysisLeadId);

  return adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(activeQuery);
    const nowIso = new Date().toISOString();

    // Actieve code = niet geconsumeerd en niet gesuperseded; bij meerdere
    // (hoort niet voor te komen) telt de recentste.
    const active = snapshot.docs
      .filter((doc) => {
        const data = doc.data() as VerificationDoc;
        return !data.consumedAt && !data.supersededAt;
      })
      .sort((a, b) =>
        (b.data() as VerificationDoc).createdAt.localeCompare(
          (a.data() as VerificationDoc).createdAt,
        ),
      )[0];

    if (!active) return "invalid" as const;
    const data = active.data() as VerificationDoc;

    if (data.expiresAt <= nowIso) return "expired" as const;
    if (data.attempts >= config.maxCodeAttempts) return "attempts_exceeded" as const;

    if (!hashesMatch(submittedHash, data.codeHash)) {
      transaction.update(active.ref, { attempts: data.attempts + 1 });
      return "invalid" as const;
    }

    transaction.update(active.ref, { consumedAt: nowIso });
    return "ok" as const;
  });
}
