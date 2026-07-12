"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { cleanAutoNamedFotografieImages } from "@/lib/admin/fotografieCleanup";

/**
 * Deletes the old auto-named ("g-<id>-<index>.webp") fotografie uploads from
 * Storage and removes them from the galleries in Firestore. Destructive, so it
 * confirms first. Gallery metadata (title/description/category) is kept, so you
 * can re-upload with SEO filenames straight after.
 */
export function CleanFotografieUploadsButton() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  async function run() {
    if (
      !window.confirm(
        "Alle automatisch hernoemde foto's (g-...-N.webp) worden verwijderd uit Storage en uit de galerijen. De galerijen zelf blijven staan. Doorgaan?",
      )
    ) {
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const res = await cleanAutoNamedFotografieImages();
      if (!res.ok) throw new Error(res.error ?? "Opschonen mislukt.");
      setStatus({
        ok: true,
        msg: `${res.deletedFiles} bestanden verwijderd uit Storage, ${res.removedFromDb} uit de galerijen. Herlaad de pagina en upload opnieuw.`,
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
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        Auto-hernoemde uploads opschonen
      </button>
      {status && (
        <p className={`text-xs ${status.ok ? "text-emerald-400" : "text-red-400"}`}>{status.msg}</p>
      )}
    </div>
  );
}
