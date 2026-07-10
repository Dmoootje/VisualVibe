"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { services } from "@/data/services";
import { regions } from "@/data/regions";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/40 [color-scheme:dark] transition-colors focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30";

type SubmitState = { status: "idle" | "success" | "error"; message?: string };

// The contact form types its field placeholders one after another when the page
// loads (name -> email -> phone -> company -> message), ending with a blinking
// white cursor dot. Each label is drawn by an overlay while the field is empty
// (a native placeholder can't do per-character colour or a blinking caret).
const CONTACT_STEPS: { name: string; text: string; multiline?: boolean }[] = [
  { name: "name", text: "Voor- en achternaam*" },
  { name: "email", text: "E-mailadres*" },
  { name: "phone", text: "Telefoonnummer" },
  { name: "company", text: "Bedrijfsnaam" },
  { name: "message", text: "Vertel ons meer over je uitdaging, doelen en wensen..", multiline: true },
];

// Native placeholders for the non-animated (offerte) variant.
const OFFERTE_PLACEHOLDERS: Record<string, string> = {
  name: "Voor- en achternaam*",
  email: "E-mailadres*",
  phone: "Telefoonnummer",
  company: "Bedrijfsnaam",
  message: "Vertel ons over je project, doelen en wensen…",
};

// Reads location/search params from `window` at submit time rather than via
// next/navigation's usePathname/useSearchParams - the latter requires a
// Suspense boundary on statically prerendered pages, which would blank the
// form until client-side hydration. Not needed here since we only read
// these values on submit, never during render.
export function LeadForm({ variant }: { variant: "contact" | "offerte" }) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [isPending, setIsPending] = useState(false);

  // Typewriter placeholder state (contact variant only).
  const animate = variant === "contact";
  const [typed, setTyped] = useState<string[]>(() => CONTACT_STEPS.map(() => ""));
  const [activeIndex, setActiveIndex] = useState(-1);
  const [typingDone, setTypingDone] = useState(false);
  const [filled, setFilled] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!animate) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(CONTACT_STEPS.map((s) => s.text));
      setTypingDone(true);
      return;
    }

    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    (async () => {
      await wait(500);
      for (let i = 0; i < CONTACT_STEPS.length; i++) {
        if (cancelled) return;
        setActiveIndex(i);
        const text = CONTACT_STEPS[i].text;
        for (let c = 1; c <= text.length; c++) {
          if (cancelled) return;
          setTyped((prev) => {
            const next = prev.slice();
            next[i] = text.slice(0, c);
            return next;
          });
          await wait(text[c - 1] === " " ? 28 : 48);
        }
        await wait(320);
      }
      if (cancelled) return;
      setActiveIndex(-1);
      setTypingDone(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [animate]);

  function markFilled(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = event.currentTarget;
    setFilled((prev) => ({ ...prev, [target.name]: target.value.length > 0 }));
  }

  /** Overlay label shown while an animated field is empty. */
  function placeholderOverlay(index: number, name: string, multiline = false) {
    if (!animate || filled[name]) return null;

    let caret: React.ReactNode = null;
    if (typingDone && name === "message") {
      caret = <span className="vv-caret text-white">.</span>;
    } else if (index === activeIndex) {
      caret = <span className="vv-caret ml-px text-white/60">|</span>;
    }

    return (
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 select-none px-4 text-white/40",
          multiline ? "flex items-start pt-3 leading-relaxed" : "flex items-center"
        )}
      >
        <span className={cn("min-w-0", multiline ? "whitespace-pre-wrap" : "truncate")}>
          {typed[index]}
          {caret}
        </span>
      </div>
    );
  }

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
      setFilled({}); // Empty again -> the animated placeholders reappear.
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

      {/* Honeypot field - hidden from real visitors via CSS, bots fill every field they find. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <input
            name="name"
            required
            aria-label="Voor- en achternaam"
            placeholder={animate ? undefined : OFFERTE_PLACEHOLDERS.name}
            onInput={markFilled}
            className={inputClasses}
          />
          {placeholderOverlay(0, "name")}
        </div>
        <div className="relative">
          <input
            name="email"
            type="email"
            required
            aria-label="E-mailadres"
            placeholder={animate ? undefined : OFFERTE_PLACEHOLDERS.email}
            onInput={markFilled}
            className={inputClasses}
          />
          {placeholderOverlay(1, "email")}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <input
            name="phone"
            type="tel"
            aria-label="Telefoonnummer"
            placeholder={animate ? undefined : OFFERTE_PLACEHOLDERS.phone}
            onInput={markFilled}
            className={inputClasses}
          />
          {placeholderOverlay(2, "phone")}
        </div>
        <div className="relative">
          <input
            name="company"
            aria-label="Bedrijfsnaam"
            placeholder={animate ? undefined : OFFERTE_PLACEHOLDERS.company}
            onInput={markFilled}
            className={inputClasses}
          />
          {placeholderOverlay(3, "company")}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <select
          name="serviceInterest"
          defaultValue=""
          aria-label="Waar ben je in geïnteresseerd?"
          className={inputClasses}
        >
          <option value="" disabled className="bg-neutral-900 text-white">
            Waar ben je in geïnteresseerd?
          </option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug} className="bg-neutral-900 text-white">
              {service.title}
            </option>
          ))}
        </select>

        <select
          name="region"
          defaultValue=""
          aria-label="Regio / doelgroep"
          className={inputClasses}
        >
          <option value="" disabled className="bg-neutral-900 text-white">
            Regio / doelgroep
          </option>
          {regions.map((region) => (
            <option key={region.slug} value={region.slug} className="bg-neutral-900 text-white">
              {region.title}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <textarea
          name="message"
          required
          rows={5}
          aria-label="Je bericht"
          placeholder={animate ? undefined : OFFERTE_PLACEHOLDERS.message}
          onInput={markFilled}
          className={inputClasses}
        />
        {placeholderOverlay(4, "message", true)}
      </div>

      {state.status === "error" && (
        <p className="text-sm text-red-400" role="alert">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-start gap-2.5 text-sm text-white/60">
          <input
            type="checkbox"
            name="privacyAccepted"
            required
            className="mt-0.5 h-4 w-4 shrink-0 accent-amber-500"
          />
          <span>
            Ik ga akkoord met de verwerking van mijn gegevens volgens het{" "}
            <a href="#" className="text-amber-400 hover:underline">
              privacybeleid
            </a>
            .
          </span>
        </label>

        <Button
          type="submit"
          disabled={isPending}
          className="h-11 w-full shrink-0 gap-2 border-0 bg-gradient-to-r from-red-500 to-amber-500 px-6 text-white shadow-lg shadow-amber-500/20 hover:from-red-600 hover:to-amber-600 sm:w-auto"
        >
          {isPending ? "Bezig met verzenden..." : variant === "offerte" ? "Offerte aanvragen" : "Bericht versturen"}
          {!isPending && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </div>
    </form>
  );
}
