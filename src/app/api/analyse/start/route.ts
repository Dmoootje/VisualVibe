import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAnalysisQuotaConfig } from "@/lib/analyse/config";
import { normalizeAndValidateUrl } from "@/lib/analyse/domain";
import { checkEmailDomainMx, normalizeAnalysisEmail } from "@/lib/analyse/email";
import {
  DEVICE_COOKIE_MAX_AGE_SECONDS,
  DEVICE_COOKIE_NAME,
  deviceHash,
  ipHashFromRequest,
  parseOrCreateDeviceId,
} from "@/lib/analyse/identity";
import { registerAttempt } from "@/lib/analyse/quota";
import { issueVerificationCode } from "@/lib/analyse/verification";
import { sendAnalysisVerificationMail } from "@/lib/email/analysisMails";
import { createAnalysisLead, listAnalysisLeadsByLeadId } from "@/lib/firestore/analysisLeads";
import { addLeadEvent } from "@/lib/firestore/leadEvents";
import { createLead } from "@/lib/firestore/leads";
import { hmacIdentifier } from "@/lib/security/encryption";
import type { AnalysisStartResponse } from "@/types/analysis";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Letterlijke tekst van de nieuwsbrief-checkbox. Wordt als consentversie bij
 * de analysis_lead bewaard zodat we later kunnen aantonen waarmee iemand
 * precies heeft ingestemd.
 */
const NEWSLETTER_CONSENT_TEXT =
  "Ja, stuur mij praktische tips over websites, SEO en online zichtbaarheid. Uitschrijven kan altijd.";

const noHeaderInjection = (value: string) => !/[\r\n]/.test(value);
const optionalLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine(noHeaderInjection, "Ongeldige tekens")
    .optional()
    .transform((value) => value || undefined);

const startSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Vul je voornaam in.")
    .max(80)
    .refine(noHeaderInjection, "Ongeldige voornaam"),
  email: z.string().trim().min(3, "Vul je e-mailadres in.").max(254).refine(noHeaderInjection),
  companyName: optionalLine(160),
  url: z.string().trim().min(1, "Vul een websiteadres in.").max(500, "Het websiteadres is te lang."),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "Bevestig dat we je gegevens mogen verwerken." }),
  }),
  newsletterOptIn: z.boolean().optional(),
  sourcePage: z.string().trim().max(500).optional(),
  referrer: z.string().trim().max(1000).optional(),
  utmSource: optionalLine(200),
  utmMedium: optionalLine(200),
  utmCampaign: optionalLine(200),
  // Honeypot: hier accepteren zodat de route nepsucces kan geven in plaats van
  // de val via schema-validatie aan bots te verraden.
  website: z.string().max(200).optional(),
});

function jsonError(error: string, status: number): NextResponse {
  return NextResponse.json({ status: "error", error } satisfies AnalysisStartResponse, { status });
}

/** Zet de ondertekende device-cookie wanneer die nieuw of ongeldig was. */
function withDeviceCookie(response: NextResponse, newCookieValue?: string): NextResponse {
  if (newCookieValue) {
    response.cookies.set(DEVICE_COOKIE_NAME, newCookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: DEVICE_COOKIE_MAX_AGE_SECONDS,
    });
  }
  return response;
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 32_768) {
    return jsonError("Aanvraag is te groot.", 413);
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return jsonError("Ongeldige aanvraag.", 400);
  }

  const parsed = startSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Controleer het formulier en probeer opnieuw.",
      400,
    );
  }

  // Honeypot ingevuld: stil nepsucces zonder lead, met een onbruikbaar id.
  if (parsed.data.website) {
    return NextResponse.json({ status: "code_sent", analysisLeadId: "hp" } satisfies AnalysisStartResponse);
  }

  const input = parsed.data;
  const { deviceId, newCookieValue } = parseOrCreateDeviceId(
    request.cookies.get(DEVICE_COOKIE_NAME)?.value,
  );

  // E-mailadres normaliseren en wegwerpdomeinen weigeren.
  const normalizedEmail = normalizeAnalysisEmail(input.email);
  if (!normalizedEmail.ok) {
    const message =
      normalizedEmail.reason === "disposable"
        ? "Gebruik een vast e-mailadres, geen tijdelijk adres."
        : "Gebruik een geldig e-mailadres.";
    return withDeviceCookie(jsonError(message, 400), newCookieValue);
  }

  // MX-controle: alleen blokkeren wanneer het domein aantoonbaar geen mail
  // kan ontvangen; een DNS-storing ("unknown") laat de aanvraag door.
  const mxStatus = await checkEmailDomainMx(normalizedEmail.domain);
  if (mxStatus === "invalid") {
    return withDeviceCookie(
      jsonError("Dit e-maildomein kan geen mail ontvangen. Controleer je e-mailadres.", 400),
      newCookieValue,
    );
  }

  const normalizedUrl = await normalizeAndValidateUrl(input.url);
  if (!normalizedUrl.ok) {
    return withDeviceCookie(jsonError(normalizedUrl.reason, 400), newCookieValue);
  }

  const config = await getAnalysisQuotaConfig();
  const hashedDevice = deviceHash(deviceId);
  const hashedIp = ipHashFromRequest(request);

  // Poging registreren voor de ip- en combotellers. Wanneer de quotabewaking
  // uitstaat, slaan we ook het tellen over; de flow zelf loopt gewoon door.
  if (config.enabled) {
    try {
      await registerAttempt({
        emailNormalized: normalizedEmail.emailNormalized,
        deviceHash: hashedDevice,
        ipHash: hashedIp,
        normalizedDomain: normalizedUrl.normalizedDomain,
        config,
      });
    } catch {
      // De teller mag een geldige aanvraag nooit blokkeren.
    }
  }

  try {
    // Idempotency per e-mail+domein+uur: dubbele submits binnen hetzelfde uur
    // hergebruiken dezelfde lead in plaats van duplicaten aan te maken.
    const hourBucket = new Date().toISOString().slice(0, 13);
    const idempotencyKey = `wa:${hmacIdentifier(
      `${normalizedEmail.emailNormalized}|${normalizedUrl.normalizedDomain}|${hourBucket}`,
      "analysis-lead-idempotency",
    )}`;

    const { lead, created } = await createLead({
      name: input.firstName,
      email: normalizedEmail.emailNormalized,
      company: input.companyName,
      selectedServices: ["seo"],
      formType: "website_analysis",
      locale: "nl",
      idempotencyKey,
      message: `Gratis websiteanalyse aangevraagd voor ${normalizedUrl.submittedUrl}`,
      sourcePage: input.sourcePage,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      privacyAccepted: true,
    });

    // Dubbele submit binnen hetzelfde uur (createLead vond de bestaande lead):
    // hergebruik de openstaande analyse-lead zonder een tweede code/mail. Zo
    // krijgt de bezoeker geen twee verificatiemails van een dubbelklik.
    if (!created) {
      const existing = (await listAnalysisLeadsByLeadId(lead.id)).find(
        (item) => item.status === "pending_verification",
      );
      if (existing) {
        return withDeviceCookie(
          NextResponse.json({
            status: "code_sent",
            analysisLeadId: existing.id,
          } satisfies AnalysisStartResponse),
          newCookieValue,
        );
      }
    }

    const analysisLead = await createAnalysisLead({
      leadId: lead.id,
      leadNumber: lead.leadNumber,
      status: "pending_verification",
      firstName: input.firstName,
      companyName: input.companyName,
      email: normalizedEmail.email,
      emailNormalized: normalizedEmail.emailNormalized,
      newsletterConsent: Boolean(input.newsletterOptIn),
      ...(input.newsletterOptIn ? { newsletterConsentTextVersion: NEWSLETTER_CONSENT_TEXT } : {}),
      submittedUrl: normalizedUrl.submittedUrl,
      normalizedDomain: normalizedUrl.normalizedDomain,
      deviceHash: hashedDevice,
      ipHash: hashedIp,
      sourcePage: input.sourcePage,
      referrer: input.referrer,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
    });

    const issued = await issueVerificationCode(
      analysisLead.id,
      normalizedEmail.emailNormalized,
      config,
    );
    if (!issued.ok) {
      const response = jsonError(
        "Je hebt te veel verificatiecodes aangevraagd. Probeer het over een uur opnieuw.",
        429,
      );
      response.headers.set("Retry-After", "3600");
      return withDeviceCookie(response, newCookieValue);
    }

    // Mailresultaat is bewust niet fataal: de flow blijft testbaar en de
    // status staat al in mail_history. De code zelf wordt nergens gelogd.
    await sendAnalysisVerificationMail({ analysisLead, code: issued.code });

    try {
      await addLeadEvent({ leadId: lead.id, type: "analysis_requested", createdBy: "system" });
    } catch {
      // Auditlog mag de aanvraag nooit blokkeren.
    }

    return withDeviceCookie(
      NextResponse.json({
        status: "code_sent",
        analysisLeadId: analysisLead.id,
      } satisfies AnalysisStartResponse),
      newCookieValue,
    );
  } catch {
    return withDeviceCookie(
      jsonError("Je aanvraag kon niet veilig worden opgeslagen. Probeer het opnieuw.", 503),
      newCookieValue,
    );
  }
}
