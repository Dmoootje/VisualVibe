"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, Loader2, ShieldCheck, TriangleAlert } from "lucide-react";
import {
  saveAiSettingsAction,
  testAiProviderAction,
  type AiSettingsActionResult,
} from "@/lib/admin/aiSettingsActions";
import {
  AI_PROVIDER_IDS,
  AI_PROVIDER_LABELS,
  type AiProviderId,
  type AiSettingsAdminView,
} from "@/types/aiSettings";

const PROVIDER_DESCRIPTIONS: Record<AiProviderId, string> = {
  gemini: "Standaard voor alle tekst-, JSON- en fotoanalysefuncties.",
  claude: "Anthropic-provider voor tekst, structured output en beeldanalyse.",
  openai: "OpenAI Responses-provider voor tekst, structured output en beeldanalyse.",
};

const MODEL_HINTS: Record<AiProviderId, string> = {
  gemini: "Aanbevolen: gemini-3.5-flash",
  claude: "Aanbevolen: claude-sonnet-5",
  openai: "Aanbevolen: gpt-5.4-mini",
};

const inputClasses =
  "w-full rounded-md border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white placeholder:text-white/30 [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-amber-500/70";

function credentialText(settings: AiSettingsAdminView["providers"][AiProviderId]): string {
  if (settings.credentialSource === "database") {
    return settings.keyHint
      ? `Versleuteld opgeslagen, eindigt op ${settings.keyHint}`
      : "Versleuteld opgeslagen";
  }
  if (settings.credentialSource === "environment") return "Tijdelijke omgevingsfallback actief";
  return "Nog geen API-sleutel ingesteld";
}

export function AiSettingsForm({ settings }: { settings: AiSettingsAdminView }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [activeProvider, setActiveProvider] = useState(settings.activeProvider);
  const [models, setModels] = useState<Record<AiProviderId, string>>(() =>
    Object.fromEntries(
      AI_PROVIDER_IDS.map((provider) => [provider, settings.providers[provider].model]),
    ) as Record<AiProviderId, string>,
  );
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<AiProviderId | null>(null);
  const [result, setResult] = useState<AiSettingsActionResult | null>(null);

  useEffect(() => {
    setActiveProvider(settings.activeProvider);
    setModels(
      Object.fromEntries(
        AI_PROVIDER_IDS.map((provider) => [provider, settings.providers[provider].model]),
      ) as Record<AiProviderId, string>,
    );
  }, [settings]);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    setSaving(true);
    setResult(null);
    const response = await saveAiSettingsAction(new FormData(formRef.current));
    setSaving(false);
    setResult(response);
    if (response.ok) {
      for (const provider of AI_PROVIDER_IDS) {
        const keyField = formRef.current.elements.namedItem(`${provider}ApiKey`);
        const removeField = formRef.current.elements.namedItem(`${provider}RemoveApiKey`);
        if (keyField instanceof HTMLInputElement) keyField.value = "";
        if (removeField instanceof HTMLInputElement) removeField.checked = false;
      }
      router.refresh();
    }
  };

  const testConnection = async (provider: AiProviderId) => {
    setTesting(provider);
    setResult(null);
    const response = await testAiProviderAction(provider);
    setTesting(null);
    setResult(response);
  };

  return (
    <form ref={formRef} onSubmit={save} className="flex max-w-5xl flex-col gap-6">
      <section className="rounded-xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-white">Beveiligde opslag</h2>
            <p className="mt-1 text-sm leading-6 text-white/55">
              API-sleutels worden met AES-256-GCM versleuteld in Firestore opgeslagen. De browser
              ontvangt alleen of een sleutel aanwezig is en ziet nooit plaintext of ciphertext.
            </p>
            <p className={`mt-2 text-sm ${settings.encryptionConfigured ? "text-emerald-300" : "text-red-300"}`}>
              {settings.encryptionConfigured
                ? "APP_ENCRYPTION_KEY is aanwezig. Nieuwe sleutels kunnen veilig worden opgeslagen."
                : "APP_ENCRYPTION_KEY ontbreekt. Stel eerst deze ene server-hoofdsleutel in."}
            </p>
          </div>
        </div>
      </section>

      <fieldset className="rounded-xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <legend className="px-1 text-lg font-semibold text-white">Actieve provider</legend>
        <p className="mb-4 mt-1 text-sm leading-6 text-white/50">
          Deze keuze geldt centraal voor realisatieteksten, leadconcepten, Trouwstudio-teksten,
          projectinvulling en fotoanalyse.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {AI_PROVIDER_IDS.map((provider) => {
            const selected = activeProvider === provider;
            return (
              <label
                key={provider}
                className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                  selected
                    ? "border-amber-500/60 bg-amber-500/10"
                    : "border-white/10 bg-black/20 hover:border-white/20"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white">{AI_PROVIDER_LABELS[provider]}</span>
                  {provider === "gemini" && (
                    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                      Standaard
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-xs leading-5 text-white/45">
                  {PROVIDER_DESCRIPTIONS[provider]}
                </span>
                <input
                  className="sr-only"
                  type="radio"
                  name="activeProvider"
                  value={provider}
                  checked={selected}
                  onChange={() => setActiveProvider(provider)}
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 lg:grid-cols-3">
        {AI_PROVIDER_IDS.map((provider) => {
          const providerSettings = settings.providers[provider];
          const testPending = testing === provider;
          return (
            <section
              key={provider}
              className={`rounded-xl border bg-white/[0.035] p-5 ${
                activeProvider === provider ? "border-amber-500/40" : "border-white/10"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">{AI_PROVIDER_LABELS[provider]}</h2>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs ${
                    providerSettings.keyConfigured ? "text-emerald-300" : "text-white/40"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      providerSettings.keyConfigured ? "bg-emerald-400" : "bg-white/25"
                    }`}
                  />
                  {providerSettings.keyConfigured ? "Ingesteld" : "Niet ingesteld"}
                </span>
              </div>

              <label className="mt-5 block text-sm text-white/70">
                Model
                <input
                  name={`${provider}Model`}
                  value={models[provider]}
                  onChange={(event) => setModels((current) => ({
                    ...current,
                    [provider]: event.target.value,
                  }))}
                  className={`${inputClasses} mt-1.5`}
                  autoComplete="off"
                  required
                />
                <span className="mt-1 block text-xs text-white/35">{MODEL_HINTS[provider]}</span>
              </label>

              <label className="mt-4 block text-sm text-white/70">
                Nieuwe API-sleutel
                <span className="relative mt-1.5 block">
                  <KeyRound className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/30" aria-hidden="true" />
                  <input
                    type="password"
                    name={`${provider}ApiKey`}
                    className={`${inputClasses} pl-9`}
                    placeholder={providerSettings.keyConfigured ? "Leeg laten om te behouden" : "Plak API-sleutel"}
                    autoComplete="new-password"
                    spellCheck={false}
                  />
                </span>
              </label>

              <p className="mt-2 min-h-10 text-xs leading-5 text-white/40">
                {credentialText(providerSettings)}
              </p>

              {providerSettings.credentialSource === "database" && (
                <label className="mt-3 flex items-start gap-2 text-xs leading-5 text-red-300/80">
                  <input
                    type="checkbox"
                    name={`${provider}RemoveApiKey`}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-red-500"
                  />
                  Opgeslagen sleutel verwijderen bij opslaan
                </label>
              )}

              <button
                type="button"
                onClick={() => testConnection(provider)}
                disabled={saving || testing !== null || !providerSettings.keyConfigured}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {testPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {testPending ? "Testen..." : "Opgeslagen verbinding testen"}
              </button>
            </section>
          );
        })}
      </div>

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
        disabled={saving || testing !== null || !settings.encryptionConfigured}
        className="inline-flex self-start items-center gap-2 rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/15 hover:from-red-600 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {saving ? "Veilig opslaan..." : "AI-instellingen opslaan"}
      </button>
    </form>
  );
}
