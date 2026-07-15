import "server-only";

import { getAnalysisIntegrationRuntime } from "@/lib/analyse/integration";
import { runPartnerAnalysis } from "@/lib/analyse/partnerApi";
import type { AnalysisRunResult } from "@/types/analysis";

/**
 * Start een volledige analyse via de geheime partner-API. Widgetmodus wordt op
 * de publieke analysepagina afgehandeld en komt nooit door deze serverflow.
 */
export async function runWebsiteAnalysis(input: {
  safeUrl: string;
  normalizedDomain: string;
  idempotencyKey?: string;
}): Promise<AnalysisRunResult> {
  const integration = await getAnalysisIntegrationRuntime();
  if (
    integration.mode !== "api" ||
    !integration.privateKey ||
    integration.partnerSiteId === null
  ) {
    return { status: "unavailable", errorCode: "partner_api_not_configured" };
  }

  const reference = input.idempotencyKey || input.normalizedDomain;
  return runPartnerAnalysis({
    apiBaseUrl: integration.apiBaseUrl,
    privateKey: integration.privateKey,
    partnerSiteId: integration.partnerSiteId,
    safeUrl: input.safeUrl,
    externalReference: reference,
    idempotencyKey: reference,
  });
}
