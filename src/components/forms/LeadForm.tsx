"use client";

import { useActionState } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { submitLead, type LeadFormState } from "@/lib/leads/submitLead";

const initialState: LeadFormState = { status: "idle" };

const inputClasses =
  "w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/70";

export function LeadForm({ variant }: { variant: "contact" | "offerte" }) {
  const [state, formAction, isPending] = useActionState(submitLead, initialState);
  const locale = useLocale();
  const pathname = usePathname();

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white/80">
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="sourcePath" value={pathname} />

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
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm text-white/70">
          {variant === "offerte" ? "Vertel ons over je project *" : "Bericht *"}
        </label>
        <textarea id="message" name="message" required rows={5} className={inputClasses} />
      </div>

      <label className="flex items-start gap-2 text-sm text-white/60">
        <input type="checkbox" name="consentGiven" required className="mt-1" />
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
