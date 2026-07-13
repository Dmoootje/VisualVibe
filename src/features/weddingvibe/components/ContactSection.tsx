"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { LeadServiceId } from "@/types";
import { weddingVibeConfig, type WvImage as WvImageData } from "../config/weddingvibe.config";
import { submitWeddingLead } from "../lib/submitWeddingLead";
import { WvImage } from "./WvImage";

/** Interesse-pill naar bestaande lead-service-ids voor het leadplatform. */
const PILL_SERVICES: Record<string, LeadServiceId[]> = {
  Fotografie: ["fotografie"],
  Huwelijksfilm: ["videografie"],
  "Foto & video": ["fotografie", "videografie"],
  Bruiloftwebsite: ["webdesign"],
  "Nog niet zeker": [],
};

export function ContactSection({ background }: { background: WvImageData }) {
  const { contact, settings } = weddingVibeConfig;
  const [fields, setFields] = useState({ namen: "", email: "", telefoon: "", datum: "", locatie: "", bericht: "" });
  const [interesses, setInteresses] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const setField = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending" || status === "sent") return;
    setStatus("sending");
    setError(null);

    const chosen = Object.keys(interesses).filter((key) => interesses[key]);
    const services = [...new Set(chosen.flatMap((key) => PILL_SERVICES[key] ?? []))];
    const message = [
      "WeddingVibe contactformulier (trouwaanvraag)",
      `Namen: ${fields.namen}`,
      fields.telefoon ? `Telefoon: ${fields.telefoon}` : null,
      fields.datum ? `Trouwdatum: ${fields.datum}` : null,
      fields.locatie ? `Trouwlocatie: ${fields.locatie}` : null,
      chosen.length > 0 ? `Interesse: ${chosen.join(", ")}` : null,
      fields.bericht ? `\nPlannen:\n${fields.bericht}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const result = await submitWeddingLead({
      name: fields.namen,
      email: fields.email,
      phone: fields.telefoon,
      message,
      selectedServices: services.length > 0 ? services : ["fotografie"],
    });

    if (result.ok) {
      setStatus("sent");
    } else {
      setStatus("error");
      setError(result.error ?? null);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-[clamp(80px,10vw,130px)] px-[clamp(20px,5vw,64px)]">
      <div className="absolute inset-0">
        <WvImage image={background} />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg,rgba(38,32,26,.85) 0%,rgba(38,32,26,.6) 60%,rgba(38,32,26,.45) 100%)",
        }}
      />
      <div className="wv-container relative z-[2] flex flex-wrap items-center gap-[clamp(40px,6vw,80px)]">
        <div data-reveal className="flex-[1_1_380px]">
          <div className="wv-overline-row">
            <span className="wv-overline wv-overline--light">{contact.overline}</span>
          </div>
          <h2 className="wv-h2 mb-[22px] !text-[clamp(34px,4.4vw,54px)] !leading-[1.1] text-white">
            {contact.title} <em className="!text-[#EDDC78]">{contact.accent}</em>
          </h2>
          <p className="m-0 mb-[34px] max-w-[480px] text-[17px] leading-[1.8] text-[rgba(255,255,255,0.85)]">
            {contact.intro}
          </p>
          <div className="text-[13px] leading-[2.1] tracking-[0.06em] text-[rgba(255,255,255,0.75)]">
            {contact.directLabel}
            <br />
            <a href={settings.whatsapp} className="!text-[#EDDC78]" target="_blank" rel="noopener">
              WhatsApp Jens
            </a>
            <br />
            <a href={settings.telefoonHref} className="!text-white">
              {settings.telefoon}
            </a>
            <br />
            <a href={`mailto:${settings.contactEmail}`} className="!text-white">
              {settings.contactEmail}
            </a>
          </div>
        </div>

        <form
          data-reveal
          onSubmit={handleSubmit}
          className="flex max-w-[620px] flex-[1_1_460px] flex-col gap-6 bg-white p-[clamp(30px,4vw,48px)] shadow-[0_34px_80px_rgba(20,15,10,0.4)]"
        >
          <div className="grid gap-[22px] [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
            <label className="wv-label">
              Jullie namen
              <input type="text" required value={fields.namen} onChange={setField("namen")} placeholder="bv. Sophie & Duco" className="wv-input" />
            </label>
            <label className="wv-label">
              E-mailadres
              <input type="email" required value={fields.email} onChange={setField("email")} placeholder="naam@voorbeeld.be" className="wv-input" />
            </label>
            <label className="wv-label">
              Telefoonnummer
              <input type="tel" value={fields.telefoon} onChange={setField("telefoon")} placeholder="+32 ..." className="wv-input" />
            </label>
            <label className="wv-label">
              Trouwdatum
              <input type="text" value={fields.datum} onChange={setField("datum")} placeholder="bv. 12 september 2026" className="wv-input" />
            </label>
            <label className="wv-label">
              Trouwlocatie
              <input type="text" value={fields.locatie} onChange={setField("locatie")} placeholder="bv. Kasteel van Hoen, Borgloon" className="wv-input" />
            </label>
          </div>

          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A08B6E]">
              Waarin hebben jullie interesse?
            </div>
            <div className="flex flex-wrap gap-2.5">
              {contact.interesses.map((label) => {
                const active = !!interesses[label];
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setInteresses((prev) => ({ ...prev, [label]: !prev[label] }))}
                    aria-pressed={active}
                    className={`wv-pill${active ? " wv-pill--active" : ""}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="wv-label">
            Vertel iets over jullie plannen
            <textarea rows={4} value={fields.bericht} onChange={setField("bericht")} placeholder="Jullie dag, locatie, sfeer, aantal gasten..." className="wv-textarea" />
          </label>

          <button type="submit" disabled={status === "sending" || status === "sent"} className="wv-btn wv-btn--gold !py-[18px] disabled:cursor-default disabled:opacity-80">
            {status === "sent" ? contact.submittedLabel : status === "sending" ? "Versturen..." : contact.submitLabel}
          </button>
          {status === "error" && error && (
            <p className="m-0 text-center text-[13px] text-[#A03A2E]" role="alert">{error}</p>
          )}
          <p className="m-0 text-center text-xs text-[#A08B6E]">
            Door te versturen ga je akkoord met ons{" "}
            <Link href="/privacy" className="underline">privacybeleid</Link>.
          </p>
        </form>
      </div>
    </section>
  );
}
