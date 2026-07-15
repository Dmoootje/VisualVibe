import "server-only";

import { businessConfig } from "@/config/business.config";
import { getAnalysisIntegrationRuntime } from "@/lib/analyse/integration";
import type { AnalysisRunResult } from "@/types/analysis";

// De partner-API van SEO Supercharged is ASYNCHROON: POST /widget/analyses geeft
// HTTP 202 met { analysisId, pollToken, status:"queued" } en start een job; de
// score volgt pas na pollen op GET /widget/analyses/{analysisId} met header
// Authorization: Poll <pollToken>, tot de status "completed" is. Er is geen
// synchrone/wait-optie. Dit draait binnen de verify-route (maxDuration 300s / 5
// min). Een analyse duurt meestal ~35s, maar een diepere JS/SSR-crawl aan de
// partnerkant kan tot enkele minuten oplopen; daarom pollt de engine tot ~4,5 min.
// De client kapt zelf eerder af (net onder Cloudflare's ~100s edge-timeout) en
// meldt dat het rapport gemaild wordt; de server rondt intussen af en verstuurt de
// rapportmail.
const START_TIMEOUT_MS = 15_000;
const POLL_INTERVAL_MS = 2_500;
const POLL_REQUEST_TIMEOUT_MS = 10_000;
const POLL_DEADLINE_MS = 270_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Schrijft een begrensde diagnostische regel naar stderr. Bewust
 * process.stderr.write i.p.v. console.error: next.config's
 * compiler.removeConsole verwijdert console.* in productie, deze schrijfwijze
 * overleeft dat. Bevat nooit de site-key, de pollToken of de Authorization-header.
 */
function logEngineDiagnostic(message: string): void {
  try {
    process.stderr.write(`[analyse-engine] ${message}\n`);
  } catch {
    // Diagnostiek mag de analyseflow nooit breken.
  }
}

function errorName(error: unknown): string {
  return error instanceof Error ? error.name : "onbekend";
}

function safeJsonSnippet(value: unknown): string {
  try {
    return JSON.stringify(value).replace(/\s+/g, " ").slice(0, 400);
  } catch {
    return "(onleesbaar)";
  }
}

async function bodySnippet(response: Response): Promise<string> {
  try {
    const text = (await response.text()).replace(/\s+/g, " ").trim().slice(0, 300);
    return text ? ` - ${text}` : "";
  } catch {
    return "";
  }
}

/** Score uit de completed-`result` (schaal 0-100); defensief over meerdere veldnamen. */
function pickScore(result: Record<string, unknown>): number | undefined {
  const candidates = [result.overallScore, result.score, result.totalScore];
  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) return candidate;
  }
  return undefined;
}

/** Maakt korte strings van de topIssues (title) voor de rapport-teaser. */
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
 * Start de asynchrone partner-analyse en pollt tot ze klaar is. Gooit NOOIT een
 * fout: elke storing wordt een net AnalysisRunResult zodat de verify-route de
 * lead correct kan afronden. Bij een fout logt hij een begrensde, secret-vrije
 * diagnostische regel; de keys en de pollToken worden NOOIT gelogd.
 */
export async function runWebsiteAnalysis(input: {
  safeUrl: string;
  normalizedDomain: string;
  /** Stabiele sleutel tegen dubbele kosten bij een retry (partner-idempotency). */
  idempotencyKey?: string;
}): Promise<AnalysisRunResult> {
  const integration = await getAnalysisIntegrationRuntime();
  // Admin-config heeft voorrang; env-override blijft als noodklep bestaan.
  const analysesUrl =
    process.env.WEBSITE_ANALYSE_API_URL?.trim() || `${integration.apiBaseUrl}/widget/analyses`;
  const siteKey = process.env.WEBSITE_ANALYSE_SITE_KEY?.trim() || integration.publicKey;
  const secretKey = integration.privateKey;
  const deadline = Date.now() + POLL_DEADLINE_MS;

  // 1) Start de analyse. Succes = HTTP 202 met { analysisId, pollToken, status }.
  let startResponse: Response;
  try {
    startResponse = await fetch(analysesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: businessConfig.url,
        "X-Partner-Site-Key": siteKey,
        // Het header dekt de authenticatie; de body-validatie eist de key
        // daarnaast als `siteKey`, en verwacht `language` (niet `locale`).
        ...(secretKey ? { Authorization: `Bearer ${secretKey}` } : {}),
      },
      body: JSON.stringify({
        siteKey,
        url: input.safeUrl,
        language: "nl",
        ...(input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : {}),
      }),
      signal: AbortSignal.timeout(START_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    logEngineDiagnostic(`start-fetch mislukt naar ${analysesUrl} (${errorName(error)})`);
    return { status: "unavailable", errorCode: "network_error" };
  }

  if (!startResponse.ok) {
    logEngineDiagnostic(
      `partner-API start ${startResponse.status} van ${analysesUrl}${await bodySnippet(startResponse)}`,
    );
    return { status: "unavailable", errorCode: `http_${startResponse.status}` };
  }

  let started: unknown;
  try {
    started = await startResponse.json();
  } catch {
    logEngineDiagnostic("start-respons is geen geldige JSON");
    return { status: "failed", errorCode: "unexpected_response" };
  }
  const startRecord =
    started && typeof started === "object" ? (started as Record<string, unknown>) : {};
  const analysisId = typeof startRecord.analysisId === "string" ? startRecord.analysisId : "";
  const pollToken = typeof startRecord.pollToken === "string" ? startRecord.pollToken : "";
  if (!analysisId || !pollToken) {
    logEngineDiagnostic(`start-respons mist analysisId/pollToken: ${safeJsonSnippet(startRecord)}`);
    return { status: "failed", errorCode: "unexpected_response" };
  }

  // 2) Poll tot completed/failed of de deadline. Auth: uitsluitend Poll <token>
  //    (geen siteKey, geen Bearer), zoals de partner-API vereist.
  const pollUrl = `${analysesUrl}/${encodeURIComponent(analysisId)}`;
  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);

    let pollResponse: Response;
    try {
      pollResponse = await fetch(pollUrl, {
        method: "GET",
        headers: { Authorization: `Poll ${pollToken}` },
        signal: AbortSignal.timeout(POLL_REQUEST_TIMEOUT_MS),
        cache: "no-store",
      });
    } catch {
      // Tijdelijke netwerk/timeout-fout op een poll: opnieuw proberen tot de deadline.
      continue;
    }

    if (!pollResponse.ok) {
      logEngineDiagnostic(`poll ${pollResponse.status} voor analyse ${analysisId}`);
      return { status: "unavailable", errorCode: `poll_http_${pollResponse.status}` };
    }

    let poll: unknown;
    try {
      poll = await pollResponse.json();
    } catch {
      continue;
    }
    const record = poll && typeof poll === "object" ? (poll as Record<string, unknown>) : {};
    const status = typeof record.status === "string" ? record.status : "";

    if (status === "failed" || status === "cancelled") {
      return { status: "failed", errorCode: "engine_failed" };
    }
    if (status === "completed") {
      const result =
        record.result && typeof record.result === "object"
          ? (record.result as Record<string, unknown>)
          : {};
      const score = pickScore(result);
      if (score === undefined) {
        logEngineDiagnostic(`completed zonder overallScore: ${safeJsonSnippet(result)}`);
        return { status: "failed", errorCode: "unexpected_response" };
      }
      return {
        status: "completed",
        score,
        criticalIssues: toIssueStrings(result.topIssues),
        ...(typeof result.summary === "string" && result.summary.trim()
          ? { summary: result.summary.trim() }
          : {}),
        raw: poll,
      };
    }
    // queued | running: blijven pollen tot de volgende ronde.
  }

  // Deadline bereikt terwijl de analyse nog liep (zeldzaam bij ~35s runtijd).
  logEngineDiagnostic(`analyse ${analysisId} niet klaar binnen ${POLL_DEADLINE_MS}ms`);
  return { status: "unavailable", errorCode: "poll_timeout" };
}
