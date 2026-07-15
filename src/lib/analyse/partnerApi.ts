import { createHash, createHmac, randomUUID } from "node:crypto";
import { parsePartnerAuditReport } from "@/lib/analyse/partnerReportSchema";
import type { AnalysisRunResult } from "@/types/analysis";

const START_TIMEOUT_MS = 15_000;
const POLL_REQUEST_TIMEOUT_MS = 10_000;
const POLL_INTERVAL_MS = 2_500;
const POLL_DEADLINE_MS = 270_000;

type Fetcher = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

type PartnerApiDependencies = {
  fetcher?: Fetcher;
  sleep?: (milliseconds: number) => Promise<void>;
  now?: () => number;
  nonce?: () => string;
};

export type ParsedPartnerSecretKey = {
  environment: "live" | "test";
  keyId: string;
  secret: string;
};

export function parsePartnerSecretKey(value: string): ParsedPartnerSecretKey {
  const trimmed = value.trim();
  const environment = trimmed.startsWith("sk_live_")
    ? "live"
    : trimmed.startsWith("sk_test_")
      ? "test"
      : null;
  if (!environment) {
    throw new Error("Ongeldige private partnersleutel.");
  }

  const remainder = trimmed.slice(`sk_${environment}_`.length);
  const separator = remainder.indexOf("_");
  if (separator <= 0 || separator === remainder.length - 1) {
    throw new Error("Ongeldige private partnersleutel.");
  }
  const keyId = remainder.slice(0, separator);
  const secret = remainder.slice(separator + 1);
  if (!/^[A-Za-z0-9-]+$/.test(keyId) || !secret || /\s/.test(secret)) {
    throw new Error("Ongeldige private partnersleutel.");
  }
  return { environment, keyId, secret };
}

export function createPartnerHmacHeaders(input: {
  secret: string;
  keyId: string;
  timestamp: string;
  nonce: string;
  method: "GET" | "POST";
  path: string;
  body: string;
}): Record<string, string> {
  const bodySha256 = createHash("sha256").update(input.body).digest("hex");
  const canonical = [
    input.timestamp,
    input.nonce,
    input.method,
    input.path,
    bodySha256,
  ].join("\n");
  const signature = createHmac("sha256", input.secret)
    .update(canonical)
    .digest("base64url");

  return {
    "X-Partner-Key-Id": input.keyId,
    "X-Partner-Timestamp": input.timestamp,
    "X-Partner-Nonce": input.nonce,
    "X-Partner-Body-SHA256": bodySha256,
    "X-Partner-Signature": signature,
    "Content-Type": "application/json",
  };
}

function requestPath(url: string): string {
  const parsed = new URL(url);
  return `${parsed.pathname}${parsed.search}`;
}

async function defaultSleep(milliseconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function issueTitles(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((issue) =>
      issue && typeof issue === "object" && typeof (issue as { title?: unknown }).title === "string"
        ? (issue as { title: string }).title.trim()
        : "",
    )
    .filter(Boolean)
    .slice(0, 50);
}

export async function runPartnerAnalysis(
  input: {
    apiBaseUrl: string;
    privateKey: string;
    partnerSiteId: number;
    safeUrl: string;
    externalReference: string;
    idempotencyKey: string;
  },
  dependencies: PartnerApiDependencies = {},
): Promise<AnalysisRunResult> {
  const fetcher = dependencies.fetcher ?? fetch;
  const sleep = dependencies.sleep ?? defaultSleep;
  const now = dependencies.now ?? Date.now;
  const nonce = dependencies.nonce ?? randomUUID;
  let key: ParsedPartnerSecretKey;
  try {
    key = parsePartnerSecretKey(input.privateKey);
  } catch {
    return { status: "unavailable", errorCode: "partner_key_invalid" };
  }

  const apiBaseUrl = input.apiBaseUrl.replace(/\/+$/, "");
  const startUrl = `${apiBaseUrl}/analyses`;
  const body = JSON.stringify({
    siteId: input.partnerSiteId,
    url: input.safeUrl,
    language: "nl",
    resultMode: "extended",
    externalReference: input.externalReference,
    idempotencyKey: input.idempotencyKey,
  });

  let startResponse: Response;
  try {
    startResponse = await fetcher(startUrl, {
      method: "POST",
      headers: createPartnerHmacHeaders({
        secret: key.secret,
        keyId: key.keyId,
        timestamp: String(now()),
        nonce: nonce(),
        method: "POST",
        path: requestPath(startUrl),
        body,
      }),
      body,
      signal: AbortSignal.timeout(START_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    return { status: "unavailable", errorCode: "network_error" };
  }

  if (!startResponse.ok) {
    return { status: "unavailable", errorCode: `http_${startResponse.status}` };
  }

  let started: unknown;
  try {
    started = await startResponse.json();
  } catch {
    return { status: "failed", errorCode: "unexpected_response" };
  }
  const analysisId =
    started && typeof started === "object" && typeof (started as { analysisId?: unknown }).analysisId === "string"
      ? (started as { analysisId: string }).analysisId
      : "";
  if (!analysisId) {
    return { status: "failed", errorCode: "unexpected_response" };
  }

  const pollUrl = `${startUrl}/${encodeURIComponent(analysisId)}`;
  const deadline = now() + POLL_DEADLINE_MS;
  while (now() < deadline) {
    await sleep(POLL_INTERVAL_MS);
    const emptyBody = "";
    let pollResponse: Response;
    try {
      pollResponse = await fetcher(pollUrl, {
        method: "GET",
        headers: createPartnerHmacHeaders({
          secret: key.secret,
          keyId: key.keyId,
          timestamp: String(now()),
          nonce: nonce(),
          method: "GET",
          path: requestPath(pollUrl),
          body: emptyBody,
        }),
        signal: AbortSignal.timeout(POLL_REQUEST_TIMEOUT_MS),
        cache: "no-store",
      });
    } catch {
      continue;
    }

    if (!pollResponse.ok) {
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
    if (status !== "completed") continue;

    try {
      const report = parsePartnerAuditReport(record.result);
      return {
        status: "completed",
        score: report.overallScore,
        criticalIssues: issueTitles(report.topIssues),
        ...(report.summary ? { summary: report.summary } : {}),
        report,
        partnerAnalysisId: analysisId,
      };
    } catch {
      return { status: "failed", errorCode: "invalid_partner_report" };
    }
  }

  return { status: "unavailable", errorCode: "poll_timeout" };
}
