"use client";

import { useRef, useState, useActionState } from "react";
import { Loader2, Trash2, Upload, User } from "lucide-react";
import { saveProfileSettings } from "@/lib/admin/profileActions";
import type { SettingsFormState } from "@/lib/admin/settingsActions";

const initialState: SettingsFormState = { status: "idle" };

const inputClasses =
  "w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-amber-500/70";

/**
 * Eigen profiel van de ingelogde admin: naam + profielfoto. De foto verschijnt
 * als auteursavatar bij kennisbankartikels en op de blogcards; de koppeling
 * loopt via de naam, die exact moet overeenkomen met de auteursnaam van de
 * artikels (bv. "Jens Hardy").
 */
export function SettingsProfileForm({
  defaultName,
  initialPhotoUrl,
  email,
}: {
  defaultName: string;
  initialPhotoUrl?: string;
  email: string;
}) {
  const [state, formAction, isPending] = useActionState(saveProfileSettings, initialState);
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl ?? "");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploadBusy(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("key", "profielfoto");
      body.append("scope", "profiel");
      // Trailing slash matcht next.config `trailingSlash: true`, anders wordt
      // de POST 308-geredirect en valt de multipart-body weg.
      const res = await fetch("/api/admin/upload/", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload mislukt.");
      setPhotoUrl(data.url as string);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Uploaden mislukt.");
    } finally {
      setUploadBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="border-b border-white/10 pb-2 text-lg font-semibold text-white">Profielfoto</h2>
        <div className="flex items-center gap-5">
          <span className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-amber-400/40 bg-gradient-to-br from-amber-400/25 to-amber-400/[0.06] text-amber-300">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="Profielfoto" className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10" aria-hidden="true" />
            )}
          </span>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploadBusy}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-50"
              >
                {uploadBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploadBusy ? "Uploaden..." : photoUrl ? "Foto vervangen" : "Foto uploaden"}
              </button>
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl("")}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Verwijderen
                </button>
              )}
            </div>
            <p className="text-xs text-white/40">
              Wordt automatisch naar WebP omgezet. Deze foto vervangt het auteurs-icoon bij
              kennisbankartikels en op de blogcards.
            </p>
            {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/webp,image/png,image/jpeg,image/avif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <input type="hidden" name="photoUrl" value={photoUrl} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="border-b border-white/10 pb-2 text-lg font-semibold text-white">Gegevens</h2>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm text-white/70">
            Naam *
          </label>
          <input id="name" name="name" defaultValue={defaultName} required className={inputClasses} />
          <span className="text-xs text-white/40">
            Moet exact overeenkomen met de auteursnaam van de artikels (bv. Jens Hardy), anders
            wordt de foto daar niet getoond.
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-white/70">E-mail</span>
          <input value={email} disabled className={`${inputClasses} opacity-50`} />
        </div>
      </section>

      {state.status !== "idle" && (
        <p
          className={`text-sm ${state.status === "success" ? "text-emerald-400" : "text-red-400"}`}
          role="alert"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || uploadBusy}
        className="self-start rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-amber-500/20 hover:from-red-600 hover:to-amber-600 disabled:opacity-50"
      >
        {isPending ? "Bezig met opslaan..." : "Profiel opslaan"}
      </button>
    </form>
  );
}
