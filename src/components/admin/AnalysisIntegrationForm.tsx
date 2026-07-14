"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, Loader2, ShieldCheck, TriangleAlert } from "lucide-react";
import {
  saveAnalysisIntegrationAction,
  type AnalysisIntegrationActionResult,
} from "@/lib/admin/analysisSettingsActions";
import type { AnalysisIntegrationAdminView, AnalysisMode } from "@/types/analysis";

const inputClasses =
  "w-full rounded-md border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white placeholder:text-white/30 [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-amber-500/70";

const MODE_OPTIONS: { value: AnalysisMode; title: string; description: string }[] = [
  {
    value: "api",
    title: "Directe API",
    description:
      "Eigen flow met e-mailverificatie en quota. De server roept SEO Supercharged aan met de private key.",
  },
  {
    value: "widget",
    title: "Widget embed",
    description:
      "De externe widget van SEO Supercharged wordt op de pagina geladen (client-side script, public key).",
  },
];

function keyStatusText(configured: boolean, hint: string): string {
  if (!configured) return "Nog geen sleutel ingesteld";
  return hint ? `Versleuteld opgeslagen, eindigt op ${hint}` : "Versleuteld opgeslagen";
}

export function AnalysisIntegrationForm({
  integration,
}: {
  integration: AnalysisIntegrationAdminView;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [mode, setMode] = useState<AnalysisMode>(integration.mode);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<AnalysisIntegrationActionResult | null>(null);

  useEffect(() => {
    setMode(integration.mode);
  }, [integration]);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    setSaving(true);
    setResult(null);
    const response = await saveAnalysisIntegrationAction(new FormData(formRef.current));
    setSaving(false);
    setResult(response);
    if (response.ok) {
      for (const name of ["publicKey", "privateKey"]) {
        const keyField = formRef.current.elements.namedItem(name);
        if (keyField instanceof HTMLInputElement) keyField.value = "";
      }
      for (const name of ["removePublicKey", "removePrivateKey"]) {
        const removeField = formRef.current.elements.namedItem(name);
        if (removeField instanceof HTMLInputElement) removeField.checked = false;
      }
      router.refresh();
    }
  };

  return (
    <form ref={formRef} onSubmit={save} className="flex max-w-5xl flex-col gap-6">
      <section className="rounded-xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-white">SEO Supercharged-koppeling</h2>
            <p className="mt-1 text-sm leading-6 text-white/55">
              De public en private key worden met AES-256-GCM versleuteld in Firestore opgeslagen. De
              browser ontvangt nooit de private key en ziet nooit plaintext of ciphertext.
            </p>
            <p
              className={`mt-2 text-sm ${
                integration.encryptionConfigured ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {integration.encryptionConfigured
                ? "APP_ENCRYPTION_KEY is aanwezig. Nieuwe sleutels kunnen veilig worden opgeslagen."
                : "APP_ENCRYPTION_KEY ontbreekt. Stel eerst deze server-hoofdsleutel in."}
            </p>
          </div>
        </div>
      </section>

      <fieldset className="rounded-xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <legend className="px-1 text-lg font-semibold text-white">Werkwijze</legend>
        <p className="mb-4 mt-1 text-sm leading-6 text-white/50">
          Bepaalt wat de bezoeker op /website-analyse ziet en welke sleutel wordt gebruikt.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {MODE_OPTIONS.map((option) => {
            const selected = mode === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                  selected
                    ? "border-amber-500/60 bg-amber-500/10"
                    : "border-white/10 bg-black/20 hover:border-white/20"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white">{option.title}</span>
                  {option.value === "api" && (
                    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                      Standaard
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-xs leading-5 text-white/45">
                  {option.description}
                </span>
                <input
                  className="sr-only"
                  type="radio"
                  name="mode"
                  value={option.value}
                  checked={selected}
                  onChange={() => setMode(option.value)}
                />
              </label>
            );
          })}
        </div>

        {mode === "widget" && (
          <p className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-5 text-amber-200/90">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              De widget laadt een extern script. Voeg het domein van de widget-URL toe aan je
              Content-Security-Policy (script-src, connect-src, img-src en frame-src) in Cloudflare,
              anders blokkeert de browser de widget.
            </span>
          </p>
        )}
      </fieldset>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Public key</h2>
            <span
              className={`inline-flex items-center gap-1.5 text-xs ${
                integration.publicKeyConfigured ? "text-emerald-300" : "text-white/40"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  integration.publicKeyConfigured ? "bg-emerald-400" : "bg-white/25"
                }`}
              />
              {integration.publicKeyConfigured ? "Ingesteld" : "Niet ingesteld"}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-white/45">
            Gebruikt door de widget (client-side). Begint doorgaans met <code>pk_</code>.
          </p>

          <label className="mt-4 block text-sm text-white/70">
            Nieuwe public key
            <span className="relative mt-1.5 block">
              <KeyRound
                className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/30"
                aria-hidden="true"
              />
              <input
                type="password"
                name="publicKey"
                className={`${inputClasses} pl-9`}
                placeholder={
                  integration.publicKeyConfigured ? "Leeg laten om te behouden" : "Plak de public key"
                }
                autoComplete="off"
                spellCheck={false}
              />
            </span>
          </label>
          <p className="mt-2 min-h-9 text-xs leading-5 text-white/40">
            {keyStatusText(integration.publicKeyConfigured, integration.publicKeyHint)}
          </p>
          {integration.publicKeyConfigured && (
            <label className="mt-1 flex items-start gap-2 text-xs leading-5 text-red-300/80">
              <input
                type="checkbox"
                name="removePublicKey"
                className="mt-0.5 h-4 w-4 shrink-0 accent-red-500"
              />
              Opgeslagen public key verwijderen bij opslaan
            </label>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Private key</h2>
            <span
              className={`inline-flex items-center gap-1.5 text-xs ${
                integration.privateKeyConfigured ? "text-emerald-300" : "text-white/40"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  integration.privateKeyConfigured ? "bg-emerald-400" : "bg-white/25"
                }`}
              />
              {integration.privateKeyConfigured ? "Ingesteld" : "Niet ingesteld"}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-white/45">
            Alleen server-side voor de directe API (Authorization: Bearer). Begint doorgaans met{" "}
            <code>sk_</code>.
          </p>

          <label className="mt-4 block text-sm text-white/70">
            Nieuwe private key
            <span className="relative mt-1.5 block">
              <KeyRound
                className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/30"
                aria-hidden="true"
              />
              <input
                type="password"
                name="privateKey"
                className={`${inputClasses} pl-9`}
                placeholder={
                  integration.privateKeyConfigured
                    ? "Leeg laten om te behouden"
                    : "Plak de private key"
                }
                autoComplete="off"
                spellCheck={false}
              />
            </span>
          </label>
          <p className="mt-2 min-h-9 text-xs leading-5 text-white/40">
            {keyStatusText(integration.privateKeyConfigured, integration.privateKeyHint)}
          </p>
          {integration.privateKeyConfigured && (
            <label className="mt-1 flex items-start gap-2 text-xs leading-5 text-red-300/80">
              <input
                type="checkbox"
                name="removePrivateKey"
                className="mt-0.5 h-4 w-4 shrink-0 accent-red-500"
              />
              Opgeslagen private key verwijderen bij opslaan
            </label>
          )}
        </section>
      </div>

      <fieldset className="rounded-xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <legend className="px-1 text-lg font-semibold text-white">Endpoints</legend>
        <p className="mb-4 mt-1 text-sm leading-6 text-white/50">
          Overschrijf de standaard-URLs zodra SEO Supercharged een definitieve omgeving heeft. Laat
          leeg om de ingebouwde standaard te gebruiken.
        </p>
        <div className="grid gap-4">
          <label className="block text-sm text-white/70">
            Widget-script-URL
            <input
              type="url"
              name="widgetScriptUrl"
              defaultValue={integration.widgetScriptUrl}
              className={`${inputClasses} mt-1.5`}
              placeholder="https://.../widgets/website-analyse.v1.js"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <label className="block text-sm text-white/70">
            API-base-URL
            <input
              type="url"
              name="apiBaseUrl"
              defaultValue={integration.apiBaseUrl}
              className={`${inputClasses} mt-1.5`}
              placeholder="https://.../api/partner/v1"
              autoComplete="off"
              spellCheck={false}
            />
            <span className="mt-1 block text-xs text-white/35">
              De analyse-aanroep gebruikt deze basis plus <code>/widget/analyses</code>.
            </span>
          </label>
        </div>
      </fieldset>

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

      <button
        type="submit"
        disabled={saving || !integration.encryptionConfigured}
        className="inline-flex self-start items-center gap-2 rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/15 hover:from-red-600 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {saving ? "Veilig opslaan..." : "Integratie opslaan"}
      </button>
    </form>
  );
}
