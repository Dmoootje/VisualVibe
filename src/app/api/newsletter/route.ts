import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSubscriber } from "@/lib/firestore/newsletter";

const subscriberSchema = z.object({
  email: z.string().email("Ongeldig e-mailadres"),
  sourcePage: z.string().optional(),
  // Honeypot - real users never fill this in; bots that fill every field do.
  website: z.string().max(0, "Spam gedetecteerd").optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const parsed = subscriberSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Controleer je e-mailadres en probeer opnieuw." },
      { status: 400 }
    );
  }

  // Honeypot tripped - pretend success so the bot doesn't learn anything.
  if (parsed.data.website) {
    return NextResponse.json({ status: "ok" });
  }

  await createSubscriber({
    email: parsed.data.email,
    sourcePage: parsed.data.sourcePage,
  });

  return NextResponse.json({ status: "ok" });
}
