"use client";

import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { saveApplicationCaseImage } from "@/lib/admin/applicationCaseActions";

export function ApplicationCaseImageField({
  imageKey,
  label,
  initialUrl,
  aspect,
}: {
  imageKey: string;
  label: string;
  initialUrl?: string;
  aspect: string;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("key", imageKey);
      form.append("scope", "applicaties");
      const response = await fetch("/api/admin/upload/", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Upload mislukt.");
      const saved = await saveApplicationCaseImage(imageKey, data.url);
      if (!saved.ok) throw new Error(saved.error ?? "Opslaan mislukt.");
      setUrl(data.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Er ging iets mis.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      const saved = await saveApplicationCaseImage(imageKey, "");
      if (!saved.ok) throw new Error(saved.error ?? "Verwijderen mislukt.");
      setUrl("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Er ging iets mis.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-white/60">{label}</span>
      <div className={`relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] ${aspect}`}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-[11px] text-white/30">
            Nog geen screenshot
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/65">
            <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10 disabled:opacity-50"
        >
          <Upload className="h-3.5 w-3.5" />
          {url ? "Vervangen" : "Uploaden"}
        </button>
        {url && (
          <button
            type="button"
            disabled={busy}
            onClick={remove}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Wissen
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/webp,image/png,image/jpeg,image/avif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
        }}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
