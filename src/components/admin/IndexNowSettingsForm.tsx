"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  KeyRound,
  Loader2,
  RefreshCw,
  Rocket,
  Search,
  TriangleAlert,
} from "lucide-react";
import {
  saveIndexNowKeyAction,
  submitAllToIndexNowAction,
  type IndexNowActionResult,
} from "@/lib/admin/indexnowActions";
import type { IndexNowSettingsAdminView } from "@/types/indexnow";

const inputClasses =
  "w-full rounded-md border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white placeholder:text-white/30 [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-amber-500/70";

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("nl-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type PendingAction = "auto" | "manual" | "submit" | null;

export function IndexNowSettingsForm({ settings }: { settings: IndexNowSettingsAdminView }) {
  const router = useRouter();
  const [manualKey, setManualKey] = useState("");
  const [pending, setPending] = useState<PendingAction>(null);
  const [result, setResult] = useState<IndexNowActionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const saveKey = async (mode: "auto" | "manual") => {
    if (pending) return;
    if (mode === "manual" && !manualKey.trim()) {
      setResult({ ok: false, message: "Vul eerst een sleutel in of gebruik automatisch genereren." });
      return;
    }
    if (
      mode === "auto" &&
      settings.keyConfigured &&
      !window.confirm(
        "Een nieuwe sleutel maakt het huidige sleutelbestand ongeldig. Meld daarna opnieuw alle pagina's aan. Doorgaan?",
      )
    ) {
      return;
    }

    setPending(mode);
    setResult(null);
    const formData = new FormData();
    formData.set("mode", mode);
    if (mode === "manual") formData.set("key", manualKey.trim());
    const response = await saveIndexNowKeyAction(formData);
    setPending(null);
    setResult(response);
    if (response.ok) {
      setManualKey("");
      router.refresh();
    }
  };

  const submitAll = async () => {
    if (pending) return;
    setPending("submit");
    setResult(null);
    const response = await submitAllToIndexNowAction();
    setPending(null);
    setResult(response);
    if (response.ok) router.refresh();
  };

  const copyKey = async () => {
    if (!settings.key) return;
    try {
      await navigator.clipboard.writeText(settings.key);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Klembord niet beschikbaar: geen blokkerende foutmelding nodig.
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Search className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-white">Zo werkt IndexNow</h2>
            <p className="mt-1 text-sm leading-6 text-white/55">
              De sleutel wordt als tekstbestand op <code>{settings.host}</code> gehost, zodat de
              zoekmachines kunnen bevestigen dat de aanmelding van de eigenaar komt. De sleutel is
              dus publiek van opzet en hoeft niet geheim te blijven. Google gebruikt IndexNow niet;
              daarvoor blijft de XML-sitemap leidend.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Sleutel</h2>
          <span
            className={`inline-flex items-center gap-1.5 text-xs ${
              settings.keyConfigured ? "text-emerald-300" : "text-white/40"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                settings.keyConfigured ? "bg-emerald-400" : "bg-white/25"
              }`}
            />
            {settings.keyConfigured ? "Ingesteld" : "Niet ingesteld"}
          </span>
        </div>

        {settings.keyConfigured ? (
          <div className="mt-4 space-y-3">
            <div>
              <span className="block text-xs uppercase tracking-wide text-white/40">
                Actieve sleutel
              </span>
              <div className="mt-1.5 flex items-center gap-2">
                <code className="flex-1 truncate rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90">
                  {settings.key}
                </code>
                <button
                  type="button"
                  onClick={copyKey}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/10"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  {copied ? "Gekopieerd" : "Kopieer"}
                </button>
              </div>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wide text-white/40">
                Sleutelbestand
              </span>
              <a
                href={settings.keyFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1.5 break-all text-sm text-amber-300 hover:text-amber-200"
              >
                {settings.keyFileUrl}
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
              <p className="mt-1 text-xs leading-5 text-white/40">
                Dit bestand moet na deploy de sleutel als platte tekst tonen. Controleer het na een
                wijziging voordat je pagina's aanmeldt.
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-white/55">
            Er is nog geen sleutel. Genereer er automatisch een om IndexNow te activeren.
          </p>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block flex-1 text-sm text-white/70">
            Eigen sleutel instellen (optioneel)
            <span className="relative mt-1.5 block">
              <KeyRound
                className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/30"
                aria-hidden="true"
              />
              <input
                value={manualKey}
                onChange={(event) => setManualKey(event.target.value)}
                className={`${inputClasses} pl-9`}
                placeholder="8-128 tekens: letters, cijfers en streepjes"
                autoComplete="off"
                spellCheck={false}
              />
            </span>
          </label>
          <button
            type="button"
            onClick={() => saveKey("manual")}
            disabled={pending !== null || !manualKey.trim()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending === "manual" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Sleutel opslaan
          </button>
        </div>

        <button
          type="button"
          onClick={() => saveKey("auto")}
          disabled={pending !== null}
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/15 hover:from-red-600 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending === "auto" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          )}
          {settings.keyConfigured ? "Automatisch vernieuwen" : "Automatisch genereren"}
        </button>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white">Alle pagina's aanmelden</h2>
        <p className="mt-1 text-sm leading-6 text-white/55">
          Meldt in een keer alle canonieke, indexeerbare URL's aan (dezelfde set als de
          XML-sitemap). Doe dit de eerste keer na het instellen van de sleutel, en daarna telkens
          na een grote inhoudsupdate. Dit werkt alleen op de live site, want de zoekmachines halen
          eerst het sleutelbestand op.
        </p>

        {settings.lastSubmission && (
          <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4 text-sm">
            <div className="flex items-center gap-2">
              {settings.lastSubmission.ok ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              ) : (
                <TriangleAlert className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
              )}
              <span className="font-medium text-white/85">
                Laatste aanmelding: {formatDateTime(settings.lastSubmission.submittedAt)}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-5 text-white/50">
              {settings.lastSubmission.urlCount} URL&apos;s
              {settings.lastSubmission.statusCode ? ` - status ${settings.lastSubmission.statusCode}` : ""}
              {settings.lastSubmission.message ? ` - ${settings.lastSubmission.message}` : ""}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={submitAll}
          disabled={pending !== null || !settings.keyConfigured}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/15 hover:from-red-600 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending === "submit" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Rocket className="h-4 w-4" aria-hidden="true" />
          )}
          {pending === "submit" ? "Aanmelden..." : "Alle pagina's aanmelden"}
        </button>
        {!settings.keyConfigured && (
          <p className="mt-2 text-xs text-white/40">Stel eerst een sleutel in.</p>
        )}
      </section>

      {result && (
        <div
          role={result.ok ? "status" : "alert"}
          className={`flex items-start gap-2.5 rounded-lg border p-4 text-sm ${
            result.ok
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {result.ok ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
}
