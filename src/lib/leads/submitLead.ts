"use server";

import { z } from "zod";
import { adminDb } from "@/lib/firebase/admin";

const leadSchema = z.object({
  name: z.string().min(2, "Naam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceInterest: z.string().optional(),
  message: z.string().min(10, "Vertel ons iets meer over je project"),
  locale: z.string(),
  sourcePath: z.string(),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: "Bevestig dat we je gegevens mogen verwerken" }),
  }),
});

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    company: formData.get("company") || undefined,
    serviceInterest: formData.get("serviceInterest") || undefined,
    message: formData.get("message"),
    locale: formData.get("locale"),
    sourcePath: formData.get("sourcePath"),
    consentGiven: formData.get("consentGiven") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Controleer het formulier en probeer opnieuw.",
    };
  }

  const { consentGiven: _consentGiven, ...lead } = parsed.data;

  await adminDb.collection("leads").add({
    ...lead,
    consentGiven: true,
    consentTimestamp: new Date(),
    createdAt: new Date(),
    status: "new",
  });

  return { status: "success", message: "Bedankt! We nemen binnen de 2 werkdagen contact met je op." };
}
