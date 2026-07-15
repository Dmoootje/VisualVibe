import "server-only";

import { businessConfig } from "@/config/business.config";
import { getAnalysisIntegrationRuntime } from "@/lib/analyse/integration";
import type { AnalysisRunResult } from "@/types/analysis";

const REQUEST_TIMEOUT_MS = 45_000;

/**
 * Schrijft een begrensde diagnostische regel naar stderr. Bewust
 * process.stderr.write i.p.v. console.error: next.config's
 * compiler.removeConsole verwijdert console.* in productie, deze schrijfwijze
 * overleeft dat. Bevat nooit de site-key of de Authorization-header.
 */
function logEngineDiagnostic(message: string): void {
  try {
    process.stderr.write(`[analyse-engine] ${message}\n`);
  } catch {
    // Diagnostiek mag de analyseflow nooit breken.
  }
}

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
 * Roept de externe analyse-engine (partner-API van SEO Supercharged) aan. Gooit
 * NOOIT een fout: elke storing wordt een net AnalysisRunResult zodat de
 * aanroepende route de lead correct kan afronden. Bij een fout logt hij wel een
 * begrensde, secret-vrije diagnostische regel (status + korte body-snippet met
 * de error-code van de partner-API) zodat de weigergrond zichtbaar is in de
 * serverlogs; de site-key en de Authorization-header worden NOOIT gelogd.
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
  } catch (error) {
    // Netwerkfout of timeout: tijdelijk onbeschikbaar. Enkel de fout-naam en de
    // aangeroepen URL loggen (geen keys/headers).
    logEngineDiagnostic(
      `fetch mislukt naar ${apiUrl} (${error instanceof Error ? error.name : "onbekend"})`,
    );
    return { status: "unavailable", errorCode: "network_error" };
  }

  if (!response.ok) {
    // Maak de weigergrond van de partner-API zichtbaar: status + een begrensde,
    // secret-vrije snippet van de response-body (bevat doorgaans de error-code,
    // bv. domain_not_verified / partner_not_approved / insufficient_credit).
    let bodySnippet = "";
    try {
      bodySnippet = (await response.text()).replace(/\s+/g, " ").trim().slice(0, 300);
    } catch {
      // Body niet leesbaar; de status alleen is al bruikbaar.
    }
    logEngineDiagnostic(
      `partner-API ${response.status} van ${apiUrl}${bodySnippet ? ` - ${bodySnippet}` : ""}`,
    );
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
