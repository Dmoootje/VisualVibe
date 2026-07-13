import type { LeadServiceId } from "@/types";

export type WeddingLeadInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  selectedServices: LeadServiceId[];
};

/**
 * Verstuurt een trouwaanvraag naar het bestaande leadplatform (/api/leads),
 * volgens hetzelfde patroon als QuoteModal: idempotency-key, honeypot leeg,
 * bron-URL en formType "wedding". Trouwspecifieke velden (bruid, bruidegom,
 * trouwdatum, locatie, interesses) zitten gestructureerd in `message`.
 */
export async function submitWeddingLead(input: WeddingLeadInput): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        phone: input.phone || undefined,
        serviceInterest: "fotografie",
        selectedServices: input.selectedServices,
        formType: "wedding",
        locale: "nl",
        idempotencyKey: crypto.randomUUID(),
        message: input.message,
        sourcePage: window.location.pathname,
        sourceUrl: window.location.href,
        privacyAccepted: true,
        website: "",
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, error: data?.error ?? "Er ging iets mis. Probeer het opnieuw." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Er ging iets mis. Probeer het opnieuw." };
  }
}
