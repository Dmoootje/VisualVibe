"use client";

import { useRef, useState } from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { saveWebdesignImage } from "@/lib/admin/webdesignActions";

/**
 * One managed image field: preview + upload/replace + remove. Uploads the file
 * to /api/admin/upload (Firebase Storage), then persists the returned URL under
 * `imageKey` via a server action. Add/replace/delete per the CMS requirement.
 */
export function ImageUploadField({
  imageKey,
  label,
  initialUrl,
  aspect = "aspect-video",
}: {
  imageKey: string;
  label: string;
  initialUrl?: string;
  aspect?: string;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("key", imageKey);
      // Trailing slash matches next.config `trailingSlash: true` so the POST
      // isn't 308-redirected (which can drop the multipart body).
      const res = await fetch("/api/admin/upload/", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload mislukt.");

      const saved = await saveWebdesignImage(imageKey, data.url);
      if (!saved.ok) throw new Error(saved.error ?? "Opslaan mislukt.");
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er ging iets mis.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    setBusy(true);
    setError(null);
    try {
      const saved = await saveWebdesignImage(imageKey, "");
      if (!saved.ok) throw new Error(saved.error ?? "Verwijderen mislukt.");
      setUrl("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er ging iets mis.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-white/60">{label}</span>
      <div
        className={`relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] ${aspect}`}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[11px] text-white/30">
            Geen afbeelding
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10 disabled:opacity-50"
        >
          <Upload className="h-3.5 w-3.5" />
          {url ? "Vervangen" : "Uploaden"}
        </button>
        {url && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Verwijderen
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/webp,image/png,image/jpeg,image/avif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
