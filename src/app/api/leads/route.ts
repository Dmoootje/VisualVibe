import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createLead } from "@/lib/firestore/leads";
import { processLeadAutomations } from "@/lib/email/leadAutomation";
import { checkLeadRateLimit } from "@/lib/security/rateLimit";
import { LEAD_FORM_TYPES, LEAD_SERVICE_IDS } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const noHeaderInjection = (value: string) => !/[\r\n]/.test(value);
const optionalLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine(noHeaderInjection, "Ongeldige tekens")
    .optional()
    .transform((value) => value || undefined);

const leadSchema = z.object({
  name: z.string().trim().min(2, "Naam is verplicht").max(120).refine(noHeaderInjection, "Ongeldige naam"),
  email: z.string().trim().toLowerCase().email("Ongeldig e-mailadres").max(254).refine(noHeaderInjection),
  phone: optionalLine(50),
  company: optionalLine(160),
  serviceInterest: z.enum(LEAD_SERVICE_IDS).optional(),
  selectedServices: z.array(z.enum(LEAD_SERVICE_IDS)).max(LEAD_SERVICE_IDS.length).default([]),
  formType: z.enum(LEAD_FORM_TYPES).default("contact"),
  locale: z.enum(["nl", "fr", "en"]).default("nl"),
  idempotencyKey: z.string().trim().regex(/^[A-Za-z0-9_-]{8,128}$/).optional(),
  region: optionalLine(100),
  message: z.string().trim().min(10, "Vertel ons iets meer over je project").max(5000),
  sourcePage: z.string().trim().max(500).optional(),
  sourceUrl: z.string().trim().max(2048).optional(),
  utmSource: optionalLine(200),
  utmMedium: optionalLine(200),
  utmCampaign: optionalLine(200),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "Bevestig dat we je gegevens mogen verwerken" }),
  }),
  // Accept a value here so the route can return fake success instead of
  // revealing the honeypot to bots during schema validation.
  website: z.string().max(200).optional(),
});

function requestIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}
export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 32_768) {
    return NextResponse.json({ error: "Aanvraag is te groot." }, { status: 413 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Controleer het formulier en probeer opnieuw." },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ status: "ok" });
  }

  // An IP bucket prevents attackers from bypassing the limiter by rotating
  // e-mail addresses. The separate address bucket also limits distributed
  // attempts against one identity without storing either value in plaintext.
  const [ipRateLimit, emailRateLimit] = await Promise.all([
    checkLeadRateLimit(`ip:${requestIp(request)}`, { limit: 10 }),
    checkLeadRateLimit(`email:${parsed.data.email}`, { limit: 5 }),
  ]);
  const blockedRateLimit = [ipRateLimit, emailRateLimit].find((result) => !result.allowed);
  if (blockedRateLimit) {
    return NextResponse.json(
      { error: "Te veel aanvragen. Probeer het later opnieuw." },
      { status: 429, headers: { "Retry-After": String(blockedRateLimit.retryAfterSeconds) } }
    );
  }

  const { website: _honeypot, ...rawLead } = parsed.data;
  const selectedServices = Array.from(
    new Set(rawLead.selectedServices.length ? rawLead.selectedServices : rawLead.serviceInterest ? [rawLead.serviceInterest] : [])
  );

  try {
    const result = await createLead({ ...rawLead, selectedServices });

    // Return success as soon as persistence succeeds. Next keeps the request
    // context alive for this callback, while deterministic mail dispatches and
    // the AI-draft idempotency key make retries safe. Scheduling this for an
    // existing idempotent lead also resumes work if an earlier request stopped
    // between persistence and the first automation write.
    after(async () => {
      await processLeadAutomations(result.lead).catch(() => undefined);
    });

    return NextResponse.json({ status: "ok", leadNumber: result.lead.leadNumber });
  } catch {
    return NextResponse.json(
      { error: "Je aanvraag kon niet veilig worden opgeslagen. Probeer opnieuw." },
      { status: 503 }
    );
  }
}
