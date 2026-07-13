"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DEFAULT_TROUWSTUDIO_SETTINGS,
  EDITING_STYLE_LABELS,
  WEDDING_EDITING_STYLES,
  type TrouwstudioSettings,
} from "@/features/trouwstudio/types";
import { WEDDING_ALBUM_TEMPLATES } from "@/features/trouwstudio/templates/ivoryEditorial";
import { saveTrouwstudioSettingsAction } from "@/lib/admin/trouwstudioActions";
import { inputClasses } from "./shared";
import { AI_PROVIDER_LABELS, type AiSettingsAdminView } from "@/types/aiSettings";

export function TrouwstudioSettingsForm({
  settings,
  aiSettings,
}: {
  settings: TrouwstudioSettings;
  aiSettings: AiSettingsAdminView;
}) {
  const [form, setForm] = useState<TrouwstudioSettings>({ ...DEFAULT_TROUWSTUDIO_SETTINGS, ...settings });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const set = <K extends keyof TrouwstudioSettings>(key: K, value: TrouwstudioSettings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setBusy(true);
    setStatus(null);
    const result = await saveTrouwstudioSettingsAction(form);
    setBusy(false);
    setStatus(
      result.ok
        ? { type: "ok", text: "Instellingen opgeslagen." }
        : { type: "error", text: result.error ?? "Opslaan mislukt." },
    );
  };

  const label = "flex flex-col gap-1.5 text-sm text-white/70";
  const section = "rounded-lg border border-white/10 bg-white/[0.03] p-6";
  const activeAi = aiSettings.providers[aiSettings.activeProvider];

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      {/* Algemeen */}
      <section className={section}>
        <h2 className="mb-4 text-lg font-semibold">Algemeen</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={label}>
            Standaardtaal
            <select value={form.defaultLanguage} onChange={(e) => set("defaultLanguage", e.target.value)} className={inputClasses}>
              <option value="nl">Nederlands</option>
              <option value="fr">Frans</option>
              <option value="en">Engels</option>
            </select>
          </label>
          <label className={label}>
            Standaardfotostijl
            <select
              value={form.defaultEditingStyle}
              onChange={(e) => set("defaultEditingStyle", e.target.value as TrouwstudioSettings["defaultEditingStyle"])}
              className={inputClasses}
            >
              {WEDDING_EDITING_STYLES.map((style) => (
                <option key={style} value={style}>
                  {EDITING_STYLE_LABELS[style]}
                </option>
              ))}
            </select>
          </label>
          <label className={label}>
            Standaardalbumtemplate
            <select value={form.defaultTemplateId} onChange={(e) => set("defaultTemplateId", e.target.value)} className={inputClasses}>
              {WEDDING_ALBUM_TEMPLATES.filter((t) => t.available).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-6 flex items-center gap-2.5 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.confirmBulkActions}
              onChange={(e) => set("confirmBulkActions", e.target.checked)}
              className="h-4 w-4 accent-amber-500"
            />
            Bevestiging vragen bij destructieve bulkacties
          </label>
        </div>
      </section>

      {/* AI */}
      <section className={section}>
        <h2 className="mb-1 text-lg font-semibold">AI-analyse</h2>
        <p className="mb-4 text-[13px] text-white/50">
          De provider en API-sleutels worden centraal en volledig server-side beheerd. De Trouwstudio
          gebruikt momenteel {AI_PROVIDER_LABELS[aiSettings.activeProvider]} ({activeAi.model}).{" "}
          {activeAi.keyConfigured
            ? "De provider is geconfigureerd voor echte analyses."
            : "Er is nog geen sleutel ingesteld; analyses draaien in duidelijk gelabelde Demonstratiemodus."}
        </p>
        <Link
          href="/admin/settings/ai"
          className="mb-5 inline-flex rounded-md border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500/15"
        >
          AI-provider en sleutels beheren
        </Link>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={label}>
            Confidence-drempel ({Math.round(form.confidenceThreshold * 100)}%)
            <input
              type="range"
              min={0.4}
              max={0.95}
              step={0.05}
              value={form.confidenceThreshold}
              onChange={(e) => set("confidenceThreshold", Number(e.target.value))}
            />
            <span className="text-[12px] text-white/45">
              Analyses onder deze zekerheid komen in &quot;Controle nodig&quot;.
            </span>
          </label>
          <label className={label}>
            Batchgrootte per analyse-aanvraag
            <input
              type="number"
              min={1}
              max={10}
              value={form.batchSize}
              onChange={(e) => set("batchSize", Number(e.target.value))}
              className={inputClasses}
            />
          </label>
          <label className={label}>
            Maximale gelijktijdige uploads
            <input
              type="number"
              min={1}
              max={4}
              value={form.maxConcurrent}
              onChange={(e) => set("maxConcurrent", Number(e.target.value))}
              className={inputClasses}
            />
          </label>
          <label className="mt-6 flex items-center gap-2.5 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.autoOptimize}
              onChange={(e) => set("autoOptimize", e.target.checked)}
              className="h-4 w-4 accent-amber-500"
            />
            Automatisch optimaliseren bij hoge zekerheid
          </label>
        </div>
        <p className="mt-4 rounded-md border border-white/10 bg-white/[0.03] p-3 text-[12.5px] text-white/50">
          Generatieve beeldbewerking (achtergrond uitbreiden, objecten verwijderen) is nog niet
          aangesloten en staat daarom vast uit. Zodra een generatief beeldmodel is gekoppeld wordt
          deze instelling actief.
        </p>
      </section>

      {/* Export */}
      <section className={section}>
        <h2 className="mb-4 text-lg font-semibold">Export</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={label}>
            JPEG-kwaliteit ({form.exportJpegQuality})
            <input
              type="range"
              min={50}
              max={100}
              value={form.exportJpegQuality}
              onChange={(e) => set("exportJpegQuality", Number(e.target.value))}
            />
          </label>
          <label className={label}>
            Bestandsnaamtemplate
            <input
              type="text"
              value={form.exportFilenameTemplate}
              onChange={(e) => set("exportFilenameTemplate", e.target.value)}
              placeholder="{project}-{nummer}"
              className={inputClasses}
            />
            <span className="text-[12px] text-white/45">Beschikbaar: {"{project}"} en {"{nummer}"}.</span>
          </label>
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded-md bg-amber-500/90 px-5 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
        >
          {busy ? "Opslaan..." : "Instellingen opslaan"}
        </button>
        {status && (
          <span className={`text-sm ${status.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>{status.text}</span>
        )}
      </div>
    </div>
  );
}
