import "server-only";

import { businessConfig } from "@/config/business.config";
import { getAnalysisIntegrationRuntime } from "@/lib/analyse/integration";
import type { AnalysisRunResult } from "@/types/analysis";

const REQUEST_TIMEOUT_MS = 45_000;

function pickScore(data: Record<string, unknown>): number | undefined {
  const nested =
    data.result && typeof data.result === "object" ? (data.result as Record<string, unknown>) : undefined;
  const candidates = [data.score, data.totalScore, nested?.score];
  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) return candidate;
  }
  return undefined;
}

function toIssueStrings(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const issues: string[] = [];
  for (const item of raw) {
    if (typeof item === "string" && item.trim()) {
      issues.push(item.trim());
      continue;
    }
    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>;
      const text =
        (typeof record.title === "string" && record.title.trim()) ||
        (typeof record.message === "string" && record.message.trim()) ||
        "";
      if (text) issues.push(text);
    }
  }
  return issues;
}

/**
 * Roept de externe analyse-engine (Replit partner-API) aan. Gooit NOOIT een
 * fout en logt nooit response-bodies: elke storing wordt een net
 * AnalysisRunResult zodat de aanroepende route de lead correct kan afronden.
 *
 * TODO: de responsemapping hieronder is bewust defensief (score uit meerdere
 * kandidaatvelden, issues uit criticalIssues/issues). Zodra het definitieve
 * API-contract van de engine live is, deze mapping vastklikken op de echte
 * veldnamen en de fallbacks verwijderen.
 */
export async function runWebsiteAnalysis(input: {
  safeUrl: string;
  normalizedDomain: string;
}): Promise<AnalysisRunResult> {
  const integration = await getAnalysisIntegrationRuntime();
  // Admin-config heeft voorrang; env-overrides blijven als noodklep bestaan.
  const apiUrl =
    process.env.WEBSITE_ANALYSE_API_URL?.trim() || `${integration.apiBaseUrl}/widget/analyses`;
  const siteKey = process.env.WEBSITE_ANALYSE_SITE_KEY?.trim() || integration.publicKey;
  const secretKey = integration.privateKey;

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: businessConfig.url,
        "X-Partner-Site-Key": siteKey,
        // De directe partner-API authenticeert met de private key als Bearer;
        // de site-key blijft meegestuurd zodat de bestaande koppeling blijft werken.
        ...(secretKey ? { Authorization: `Bearer ${secretKey}` } : {}),
      },
      body: JSON.stringify({ url: input.safeUrl, locale: "nl" }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    // Netwerkfout of timeout: tijdelijk onbeschikbaar, geen details loggen.
    return { status: "unavailable", errorCode: "network_error" };
  }

  if (!response.ok) {
    return { status: "unavailable", errorCode: `http_${response.status}` };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    return { status: "failed", errorCode: "unexpected_response" };
  }

  if (!data || typeof data !== "object") {
    return { status: "failed", errorCode: "unexpected_response" };
  }

  const record = data as Record<string, unknown>;
  const score = pickScore(record);
  if (score === undefined) {
    return { status: "failed", errorCode: "unexpected_response" };
  }

  return {
    status: "completed",
    score,
    criticalIssues: toIssueStrings(record.criticalIssues ?? record.issues ?? []),
    ...(typeof record.summary === "string" && record.summary.trim()
      ? { summary: record.summary.trim() }
      : {}),
    raw: data,
  };
}
