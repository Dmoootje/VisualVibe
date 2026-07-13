"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { weddingVibeConfig } from "../config/weddingvibe.config";
import { submitWeddingLead } from "../lib/submitWeddingLead";
import { useWvModal } from "./WvModalContext";
import { WvOrnament } from "./WvOrnament";

/** "Controleer jullie datum"-popup: datumcheck-formulier -> leadcentrum. */
export function DateModal() {
  const { open, closeModal } = useWvModal();
  const { modal } = weddingVibeConfig;
  const [fields, setFields] = useState({ bruid: "", bruidegom: "", email: "", datum: "", vragen: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // Sluiten reset het bedankscherm zodat de popup opnieuw bruikbaar is.
  useEffect(() => {
    if (!open && status === "sent") {
      setStatus("idle");
      setFields({ bruid: "", bruidegom: "", email: "", datum: "", vragen: "" });
    }
  }, [open, status]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  if (!open) return null;

  const setField = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);

    const message = [
      "WeddingVibe datumcheck (popup)",
      `Bruid: ${fields.bruid}`,
      `Bruidegom: ${fields.bruidegom}`,
      `Trouwdatum: ${fields.datum}`,
      fields.vragen ? `\nVragen:\n${fields.vragen}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const result = await submitWeddingLead({
      name: `${fields.bruid} & ${fields.bruidegom}`,
      email: fields.email,
      message,
      selectedServices: ["fotografie"],
    });

    if (result.ok) {
      setStatus("sent");
    } else {
      setStatus("error");
      setError(result.error ?? null);
    }
  };

  const paar = [fields.bruid, fields.bruidegom].filter(Boolean).join(" & ");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(24,19,14,0.62)] p-5 backdrop-blur-[7px]"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-label={modal.overline}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-[540px] overflow-y-auto bg-white p-[clamp(30px,5vw,50px)] shadow-[0_44px_110px_rgba(20,15,10,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeModal}
          aria-label="Sluiten"
          className="absolute right-3.5 top-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[rgba(194,154,75,0.45)] bg-transparent text-[#B08A3E] transition-colors hover:bg-[rgba(194,154,75,0.14)]"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M1 1 L 13 13" />
            <path d="M13 1 L 1 13" />
          </svg>
        </button>

        {status !== "sent" ? (
          <>
            <div className="mb-3.5 flex items-center gap-3.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B08A3E]">{modal.overline}</span>
              <span className="h-px flex-[0_1_50px]" style={{ background: "linear-gradient(90deg,#C29A4B,transparent)" }} aria-hidden="true" />
            </div>
            <h3 className="wv-serif m-0 mb-2.5 text-[clamp(28px,4vw,36px)] font-medium leading-[1.12]">
              {modal.title} <em className="italic text-[#B08A3E]">{modal.accent}</em>
            </h3>
            <p className="m-0 mb-7 text-[15px] leading-[1.7] text-[#6B5F55]">{modal.intro}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
              <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
                <label className="wv-label">
                  Naam bruid
                  <input type="text" required value={fields.bruid} onChange={setField("bruid")} placeholder="bv. Sophie" className="wv-input" />
                </label>
                <label className="wv-label">
                  Naam bruidegom
                  <input type="text" required value={fields.bruidegom} onChange={setField("bruidegom")} placeholder="bv. Duco" className="wv-input" />
                </label>
                <label className="wv-label">
                  E-mailadres
                  <input type="email" required value={fields.email} onChange={setField("email")} placeholder="naam@voorbeeld.be" className="wv-input" />
                </label>
                <label className="wv-label">
                  Trouwdatum
                  <input type="date" required value={fields.datum} onChange={setField("datum")} className="wv-input !py-[9px]" />
                </label>
              </div>
              <label className="wv-label">
                <span>
                  Jullie vragen{" "}
                  <span className="font-normal normal-case tracking-[0.08em] text-[#C4B49B]">(optioneel)</span>
                </span>
                <textarea rows={3} value={fields.vragen} onChange={setField("vragen")} placeholder="Waar trouwen jullie? Waar dromen jullie van?" className="wv-textarea !p-[13px]" />
              </label>
              <button type="submit" disabled={status === "sending"} className="wv-btn wv-btn--gold !py-[17px] disabled:cursor-default disabled:opacity-80">
                {status === "sending" ? "Versturen..." : modal.submitLabel}
              </button>
              {status === "error" && error && (
                <p className="m-0 text-center text-[13px] text-[#A03A2E]" role="alert">{error}</p>
              )}
              <p className="m-0 text-center text-xs text-[#A08B6E]">
                Jens ontvangt jullie aanvraag meteen. Door te versturen ga je akkoord met ons{" "}
                <Link href="/privacy" className="underline">privacybeleid</Link>.
              </p>
            </form>
          </>
        ) : (
          <div className="px-0 pb-2 pt-[18px] text-center">
            <WvOrnament />
            <div className="wv-script wv-gold-gradient-text mb-4 text-[52px] leading-[1.1]">{modal.bedanktScript}</div>
            <p className="wv-serif m-0 mb-3 text-[22px] leading-[1.45] text-[#2A2320]">
              Van harte gefeliciteerd met jullie aankomende huwelijk{paar ? `, ${paar}` : ""}!
            </p>
            <p className="m-0 mb-[30px] text-[14.5px] leading-[1.7] text-[#6B5F55]">{modal.bedanktSub}</p>
            <button type="button" onClick={closeModal} className="wv-btn wv-btn--outline !px-[34px] !py-[15px] !text-[12px]">
              Sluiten
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
