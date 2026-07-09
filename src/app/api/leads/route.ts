import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createLead } from "@/lib/firestore/leads";
import { addLeadEvent } from "@/lib/firestore/leadEvents";

const leadSchema = z.object({
  name: z.string().min(2, "Naam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceInterest: z.string().optional(),
  region: z.string().optional(),
  message: z.string().min(10, "Vertel ons iets meer over je project"),
  sourcePage: z.string().optional(),
  sourceUrl: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "Bevestig dat we je gegevens mogen verwerken" }),
  }),
  // Honeypot - real users never fill this in; bots that fill every field do.
  website: z.string().max(0, "Spam gedetecteerd").optional(),
});

export async function POST(request: NextRequest) {
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

  // Honeypot tripped - pretend success so the bot doesn't learn anything, but don't save.
  if (parsed.data.website) {
    return NextResponse.json({ status: "ok" });
  }

  const { website: _honeypot, ...lead } = parsed.data;

  const leadId = await createLead(lead);
  await addLeadEvent({ leadId, type: "created", createdBy: "system" });

  return NextResponse.json({ status: "ok" });
}
