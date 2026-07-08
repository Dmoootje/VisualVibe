"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { regions } from "@/data/regions";

const inputClasses =
  "w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/70";

type SubmitState = { status: "idle" | "success" | "error"; message?: string };

// Reads location/search params from `window` at submit time rather than via
// next/navigation's usePathname/useSearchParams — the latter requires a
// Suspense boundary on statically prerendered pages, which would blank the
// form until client-side hydration. Not needed here since we only read
// these values on submit, never during render.
export function LeadForm({ variant }: { variant: "contact" | "offerte" }) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setState({ status: "idle" });

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const searchParams = new URLSearchParams(window.location.search);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      company: formData.get("company") || undefined,
      serviceInterest: formData.get("serviceInterest") || undefined,
      region: formData.get("region") || undefined,
      message: formData.get("message"),
      privacyAccepted: formData.get("privacyAccepted") === "on",
      sourcePage: window.location.pathname,
      sourceUrl: window.location.href,
      utmSource: searchParams.get("utm_source") || undefined,
      utmMedium: searchParams.get("utm_medium") || undefined,
      utmCampaign: searchParams.get("utm_campaign") || undefined,
      // Honeypot: left empty by real visitors, sometimes filled by bots.
      website: formData.get("website") || undefined,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setState({ status: "error", message: data.error ?? "Er ging iets mis. Probeer opnieuw." });
        setIsPending(false);
        return;
      }

      formElement.reset();
      setState({ status: "success", message: "Bedankt! We nemen binnen de 2 werkdagen contact met je op." });
      setIsPending(false);
    } catch {
      setState({ status: "error", message: "Er ging iets mis. Probeer opnieuw." });
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {state.status === "success" && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center text-green-400" role="status">
          {state.message}
        </div>
      )}

      {/* Honeypot field — hidden from real visitors via CSS, bots fill every field they find. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm text-white/70">
            Naam *
          </label>
          <input id="name" name="name" required className={inputClasses} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm text-white/70">
            E-mail *
          </label>
          <input id="email" name="email" type="email" required className={inputClasses} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm text-white/70">
            Telefoon
          </label>
          <input id="phone" name="phone" type="tel" className={inputClasses} />
        </div>

        {variant === "offerte" ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company" className="text-sm text-white/70">
              Bedrijf
            </label>
            <input id="company" name="company" className={inputClasses} />
          </div>
        ) : null}
      </div>

      {variant === "offerte" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="serviceInterest" className="text-sm text-white/70">
              Waarin ben je geïnteresseerd?
            </label>
            <select id="serviceInterest" name="serviceInterest" className={inputClasses} defaultValue="">
              <option value="" disabled>
                Kies een dienst
              </option>
              {services.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="region" className="text-sm text-white/70">
              Regio
            </label>
            <select id="region" name="region" className={inputClasses} defaultValue="">
              <option value="" disabled>
                Kies een regio
              </option>
              {regions.map((region) => (
                <option key={region.slug} value={region.slug}>
                  {region.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm text-white/70">
          {variant === "offerte" ? "Vertel ons over je project *" : "Bericht *"}
        </label>
        <textarea id="message" name="message" required rows={5} className={inputClasses} />
      </div>

      <label className="flex items-start gap-2 text-sm text-white/60">
        <input type="checkbox" name="privacyAccepted" required className="mt-1" />
        Ik ga akkoord dat VisualVibe mijn gegevens verwerkt om mijn aanvraag te beantwoorden.
      </label>

      {state.status === "error" && (
        <p className="text-sm text-red-400" role="alert">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white border-0 h-11"
      >
        {isPending ? "Bezig met verzenden..." : variant === "offerte" ? "Offerte aanvragen" : "Versturen"}
      </Button>
    </form>
  );
}
