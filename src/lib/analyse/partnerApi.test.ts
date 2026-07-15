import { createHash, createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  createPartnerHmacHeaders,
  parsePartnerSecretKey,
  runPartnerAnalysis,
} from "./partnerApi";

const completedReport = {
  schemaVersion: 1,
  url: "https://voorbeeld.be/",
  overallScore: 91,
  summary: "Sterk resultaat",
  categories: [],
  page: {},
  topIssues: [],
  strengths: [],
  technical: {},
};

describe("parsePartnerSecretKey", () => {
  it.each([
    ["sk_live_key123_secret_with_parts", "live"],
    ["sk_test_key456_secret_with_parts", "test"],
  ] as const)("parses %s without losing secret underscores", (value, environment) => {
    expect(parsePartnerSecretKey(value)).toEqual({
      environment,
      keyId: environment === "live" ? "key123" : "key456",
      secret: "secret_with_parts",
    });
  });

  it("rejects malformed secret keys", () => {
    expect(() => parsePartnerSecretKey("sk_live_missing-secret")).toThrow();
    expect(() => parsePartnerSecretKey("pk_live_key_secret")).toThrow();
  });
});

describe("createPartnerHmacHeaders", () => {
  it("signs exact POST bytes and empty GET bodies", () => {
    const secret = "secret_with_parts";
    const keyId = "key123";
    const timestamp = "1700000000000";
    const nonce = "fixed-nonce";
    const path = "/api/partner/v1/analyses";
    const body = '{"siteId":42}';

    const post = createPartnerHmacHeaders({
      secret,
      keyId,
      timestamp,
      nonce,
      method: "POST",
      path,
      body,
    });
    const bodyHash = createHash("sha256").update(body).digest("hex");
    const canonical = [timestamp, nonce, "POST", path, bodyHash].join("\n");
    expect(post["X-Partner-Body-SHA256"]).toBe(bodyHash);
    expect(post["X-Partner-Signature"]).toBe(
      createHmac("sha256", secret).update(canonical).digest("base64url"),
    );

    const get = createPartnerHmacHeaders({
      secret,
      keyId,
      timestamp,
      nonce,
      method: "GET",
      path: `${path}/analysis-id`,
      body: "",
    });
    expect(get["X-Partner-Body-SHA256"]).toBe(createHash("sha256").update("").digest("hex"));
  });
});

describe("runPartnerAnalysis", () => {
  it("uses signed secret endpoints and returns a validated report", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const responses = [
      new Response(JSON.stringify({ analysisId: "analysis-id", status: "queued" }), { status: 202 }),
      new Response(
        JSON.stringify({ analysisId: "analysis-id", status: "completed", result: completedReport }),
        { status: 200 },
      ),
    ];
    const nonces = ["nonce-start", "nonce-poll"];

    const result = await runPartnerAnalysis(
      {
        apiBaseUrl: "https://seo.example/api/partner/v1",
        privateKey: "sk_live_key123_secret_with_parts",
        partnerSiteId: 42,
        safeUrl: "https://voorbeeld.be/",
        externalReference: "lead-id",
        idempotencyKey: "lead-id",
      },
      {
        fetcher: async (url, init) => {
          calls.push({ url: String(url), init });
          return responses.shift()!;
        },
        sleep: async () => undefined,
        now: () => 1_700_000_000_000,
        nonce: () => nonces.shift()!,
      },
    );

    expect(result.status).toBe("completed");
    if (result.status !== "completed") return;
    expect(result.partnerAnalysisId).toBe("analysis-id");
    expect(result.report.overallScore).toBe(91);
    expect(calls.map((call) => call.url)).toEqual([
      "https://seo.example/api/partner/v1/analyses",
      "https://seo.example/api/partner/v1/analyses/analysis-id",
    ]);
    expect(calls.some((call) => call.url.includes("/widget/"))).toBe(false);
    expect(JSON.parse(String(calls[0].init?.body))).toMatchObject({
      siteId: 42,
      resultMode: "extended",
      externalReference: "lead-id",
      idempotencyKey: "lead-id",
    });
    expect(calls[0].init?.headers).toMatchObject({ "X-Partner-Nonce": "nonce-start" });
    expect(calls[1].init?.headers).toMatchObject({ "X-Partner-Nonce": "nonce-poll" });
  });
});
