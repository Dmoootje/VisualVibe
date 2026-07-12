"use client";

import { useState } from "react";
import { Check, Mail } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Newsletter opt-in for the kennisbank sidebar. Posts the email to
 * /api/newsletter, which stores it in Firestore for the admin Nieuwsbrief list.
 */
export function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "submitting" || status === "success") return;
    setStatus("submitting");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          website,
          sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (!response.ok) throw new Error("subscribe failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const done = status === "success";

  return (
    <div className="relative overflow-hidden rounded-[18px] border border-[#ff7500]/28 bg-gradient-to-b from-[#ff7500]/[0.14] to-[#ff7500]/[0.03] p-4">
      <div
        className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full"
        style={{ background: "radial-gradient(circle,rgba(255,90,0,.22),transparent 70%)" }}
        aria-hidden="true"
      />
      {/* Compact: brand-chip icoon links, titel + omschrijving ernaast. */}
      <div className="mb-3 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
          <Mail className="h-[19px] w-[19px]" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div
            className="text-[15px] font-extrabold leading-tight tracking-tight text-white"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            Blijf op de hoogte
          </div>
          <p className="mt-0.5 text-[12.5px] leading-snug text-white/66">
            Elke maand de beste gidsen en tips voor KMO&apos;s in je inbox.
          </p>
        </div>
      </div>

      {done ? (
        <div className="flex items-center gap-2.5 rounded-[11px] border border-[#ff7500]/40 bg-[#ff7500]/10 px-4 py-2.5 text-sm font-semibold text-[#ff9a45]">
          <Check className="h-4 w-4" aria-hidden="true" />
          Ingeschreven, bedankt!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="jouw@email.be"
            aria-label="E-mailadres"
            className="w-full rounded-[11px] border border-white/14 bg-black/25 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#ff7500]/55"
          />
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            className="hidden"
            aria-hidden="true"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-[11px] bg-gradient-to-r from-red-500 to-[#ff7500] px-4 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-70"
          >
            {status === "submitting" ? "Bezig..." : "Inschrijven"}
          </button>
          {status === "error" && (
            <p className="text-xs text-red-400">Inschrijven mislukt. Probeer het later opnieuw.</p>
          )}
        </form>
      )}
    </div>
  );
}
