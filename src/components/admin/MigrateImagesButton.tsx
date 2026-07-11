"use client";

import { useState } from "react";
import { Loader2, ImageDown } from "lucide-react";
import { migrateImagesToWebp } from "@/lib/admin/migrateImages";

/**
 * One-time cleanup button: converts existing PNG/JPG portfolio images to clean
 * WebP and deletes the originals. Safe to run more than once.
 */
export function MigrateImagesButton() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  async function run() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await migrateImagesToWebp();
      if (!res.ok) throw new Error(res.error ?? "Migratie mislukt.");
      setStatus({
        ok: true,
        msg:
          res.converted > 0
            ? `${res.converted} afbeelding(en) omgezet naar WebP en opgeschoond.`
            : "Alles staat al als WebP, niets te doen.",
      });
    } catch (e) {
      setStatus({ ok: false, msg: e instanceof Error ? e.message : "Er ging iets mis." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/10 disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageDown className="h-4 w-4" />}
        Bestaande afbeeldingen naar WebP omzetten
      </button>
      {status && (
        <span className={`text-xs ${status.ok ? "text-emerald-400" : "text-red-400"}`}>
          {status.msg}
        </span>
      )}
      <p className="max-w-xl text-[11px] text-white/30">
        Zet reeds geuploade PNG/JPG-screenshots om naar WebP met schone bestandsnamen en verwijdert
        de oude bestanden. Veilig om meermaals te draaien.
      </p>
    </div>
  );
}
