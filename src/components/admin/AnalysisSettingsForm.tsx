"use client";

import { useActionState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  saveAnalysisSettingsAction,
  type AnalysisSettingsActionState,
} from "@/lib/admin/analysisSettingsActions";
import { DEFAULT_ANALYSIS_QUOTA_CONFIG, type AnalysisQuotaConfig } from "@/types/analysis";

const INITIAL_STATE: AnalysisSettingsActionState = { status: "idle" };

const inputClasses =
  "w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/35 [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-amber-500/70 disabled:cursor-not-allowed disabled:opacity-50";

type NumericFieldDef = {
  key: Exclude<keyof AnalysisQuotaConfig, "enabled" | "maintenanceMode">;
  label: string;
  hint: string;
  zeroIsUnlimited?: boolean;
};

const QUOTA_FIELDS: NumericFieldDef[] = [
  {
    key: "maxPerEmail24h",
    label: "Analyses per e-mailadres (24 uur)",
    hint: "Aantal succesvol afgeronde analyses dat een geverifieerd e-mailadres in 24 uur mag aanvragen.",
    zeroIsUnlimited: true,
  },
  {
    key: "maxPerDevice24h",
    label: "Analyses per toestel (24 uur)",
    hint: "Aantal succesvol afgeronde analyses per toestel (gehashte first-party cookie) in 24 uur.",
    zeroIsUnlimited: true,
  },
  {
    key: "maxPerIp24h",
    label: "Aanvragen per IP (24 uur)",
    hint: "Maximaal aantal analyseaanvragen per gehasht IP-adres per 24 uur.",
    zeroIsUnlimited: true,
  },
  {
    key: "maxPerIp30d",
    label: "Analyses per IP (30 dagen)",
    hint: "Maximaal aantal analyses per gehasht IP-adres per 30 dagen.",
    zeroIsUnlimited: true,
  },
  {
    key: "maxCodesPerEmailPerHour",
    label: "Verificatiecodes per e-mailadres per uur",
    hint: "Beperkt hoe vaak per uur een nieuwe verificatiecode naar hetzelfde e-mailadres mag worden gestuurd.",
  },
  {
    key: "duplicateWindowMinutes",
    label: "Duplicaatvenster (minuten)",
    hint: "Beschermt kort tegen dubbelklikken voor dezelfde combinatie van e-mail, toestel en domein. Een toegestane aanvraag start altijd een nieuwe analyse.",
  },
  {
    key: "codeTtlMinutes",
    label: "Geldigheid verificatiecode (minuten)",
    hint: "Na dit aantal minuten vervalt een verstuurde verificatiecode en moet de bezoeker een nieuwe aanvragen.",
  },
  {
    key: "maxCodeAttempts",
    label: "Invoerpogingen per code",
    hint: "Maximaal aantal foutieve invoerpogingen voordat een verificatiecode ongeldig wordt.",
  },
];

export function AnalysisSettingsForm({ config }: { config: AnalysisQuotaConfig }) {
  const [state, formAction, pending] = useActionState(saveAnalysisSettingsAction, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <section className="flex flex-col gap-6 rounded-xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Quota en limieten</h2>
          <p className="mt-1 text-sm leading-6 text-white/50">
            Alle limieten worden server-side afgedwongen. IP-adressen en toestel-ID&apos;s worden
            uitsluitend als hash bewaard.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-black/20 p-4">
          <input
            type="checkbox"
            name="enabled"
            defaultChecked={config.enabled}
            className="mt-1 h-4 w-4 shrink-0 accent-amber-500"
          />
          <span>
            <span className="text-sm font-medium text-white">Websiteanalyse inschakelen</span>
            <span className="mt-1 block text-xs leading-5 text-white/45">
              Schakel uit om de gratis websiteanalyse tijdelijk te sluiten. Bestaande rapporten
              blijven bereikbaar.
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] p-4">
          <input
            type="checkbox"
            name="maintenanceMode"
            defaultChecked={config.maintenanceMode}
            className="mt-1 h-4 w-4 shrink-0 accent-amber-500"
          />
          <span>
            <span className="text-sm font-medium text-white">Onderhoudsmodus</span>
            <span className="mt-1 block text-xs leading-5 text-white/45">
              Nieuwe analysestarts worden tijdelijk geweigerd. Bestaande rapporten blijven
              bereikbaar.
            </span>
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          {QUOTA_FIELDS.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label htmlFor={field.key} className="text-sm text-white/70">
                {field.label}
              </label>
              <input
                id={field.key}
                name={field.key}
                type="number"
                min={0}
                step={1}
                defaultValue={String(config[field.key])}
                className={inputClasses}
              />
              <span className="text-xs leading-5 text-white/40">
                {field.hint} {field.zeroIsUnlimited ? "0 = onbeperkt. " : ""}Standaard:{" "}
                {DEFAULT_ANALYSIS_QUOTA_CONFIG[field.key]}.
              </span>
            </div>
          ))}
        </div>
      </section>

      {state.status !== "idle" && (
        <div
          role={state.status === "success" ? "status" : "alert"}
          className={`flex max-w-3xl items-start gap-2.5 rounded-lg border p-4 text-sm ${
            state.status === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {state.status === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <span>{state.message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-amber-500/20 hover:from-red-600 hover:to-amber-600 disabled:opacity-50"
      >
        {pending ? "Bezig met opslaan..." : "Opslaan"}
      </button>
    </form>
  );
}
