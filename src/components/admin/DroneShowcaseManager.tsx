"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { saveDroneShowcaseAction } from "@/lib/admin/droneShowcaseActions";
import type { DronePhoto, DroneVideo } from "@/data/droneShowcase";

// Beheert de media van de Drone & FPV-dienstpagina: de dronefotografie-band
// (foto's) en de dronevideografie-band (YouTube-video's). Slaat de volledige,
// geordende lijsten op via saveDroneShowcaseAction (site_content/drone_showcase);
// de dienstpagina leest ze server-side, dus wijzigingen zijn meteen live.

const inputClasses =
  "w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-amber-500/70";
const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/70 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

/** Haal de 11-teken-YouTube-id uit een ruwe id of een YouTube-URL. */
function ytId(raw: string): string {
  const value = raw.trim();
  const byUrl = value.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if (byUrl) return byUrl[1];
  return /^[A-Za-z0-9_-]{11}$/.test(value) ? value : "";
}

function move<T>(list: T[], index: number, delta: -1 | 1): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function DroneShowcaseManager({
  initialPhotos,
  initialVideos,
}: {
  initialPhotos: DronePhoto[];
  initialVideos: DroneVideo[];
}) {
  const [photos, setPhotos] = useState<DronePhoto[]>(initialPhotos);
  const [videos, setVideos] = useState<DroneVideo[]>(initialVideos);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const baseline = useMemo(
    () => JSON.stringify({ initialPhotos, initialVideos }),
    [initialPhotos, initialVideos],
  );
  const dirty = JSON.stringify({ initialPhotos: photos, initialVideos: videos }) !== baseline;

  const setPhoto = (i: number, patch: Partial<DronePhoto>) =>
    setPhotos((prev) => prev.map((p, k) => (k === i ? { ...p, ...patch } : p)));
  const setVideo = (i: number, patch: Partial<DroneVideo>) =>
    setVideos((prev) => prev.map((v, k) => (k === i ? { ...v, ...patch } : v)));

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const cleanVideos = videos.map((v) => ({ ...v, yt: ytId(v.yt) }));
    const result = await saveDroneShowcaseAction(photos, cleanVideos);
    setSaving(false);
    if (result.ok) {
      setMessage({ type: "ok", text: "Opgeslagen. De dronepagina is bijgewerkt." });
      setVideos(cleanVideos);
    } else {
      setMessage({ type: "error", text: result.error ?? "Opslaan mislukt." });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ===== Dronefotografie ===== */}
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Dronefotografie</h2>
            <p className="text-sm text-white/50">De foto&apos;s in de linkerband. Sleep de volgorde met de pijltjes.</p>
          </div>
          <button
            type="button"
            onClick={() => setPhotos((prev) => [...prev, { src: "", title: "", label: "" }])}
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
          >
            <Plus className="h-4 w-4" /> Foto toevoegen
          </button>
        </div>

        {photos.length === 0 ? (
          <p className="text-sm text-amber-300">Nog geen foto&apos;s. Voeg er minstens een toe.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {photos.map((photo, index) => (
              <PhotoRow
                key={index}
                photo={photo}
                index={index}
                total={photos.length}
                onChange={(patch) => setPhoto(index, patch)}
                onMove={(delta) => setPhotos((prev) => move(prev, index, delta))}
                onRemove={() => setPhotos((prev) => prev.filter((_, k) => k !== index))}
              />
            ))}
          </ul>
        )}
      </section>

      {/* ===== Dronevideografie ===== */}
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Dronevideografie</h2>
            <p className="text-sm text-white/50">YouTube-video&apos;s in de rechterband. Plak een YouTube-link of -id.</p>
          </div>
          <button
            type="button"
            onClick={() => setVideos((prev) => [...prev, { yt: "", title: "", tag: "" }])}
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
          >
            <Plus className="h-4 w-4" /> Video toevoegen
          </button>
        </div>

        {videos.length === 0 ? (
          <p className="text-sm text-amber-300">Nog geen video&apos;s. Voeg er minstens een toe.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {videos.map((video, index) => (
              <VideoRow
                key={index}
                video={video}
                index={index}
                total={videos.length}
                onChange={(patch) => setVideo(index, patch)}
                onMove={(delta) => setVideos((prev) => move(prev, index, delta))}
                onRemove={() => setVideos((prev) => prev.filter((_, k) => k !== index))}
              />
            ))}
          </ul>
        )}
      </section>

      {/* ===== Opslaan ===== */}
      <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-xl border border-white/10 bg-neutral-950/80 p-3 backdrop-blur">
        {message && (
          <span className={`text-sm ${message.type === "ok" ? "text-emerald-300" : "text-red-300"}`}>
            {message.text}
          </span>
        )}
        {dirty && !message && <span className="text-xs text-amber-300">Niet-opgeslagen wijzigingen</span>}
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Opslaan..." : "Opslaan"}
        </button>
      </div>
    </div>
  );
}

function PhotoRow({
  photo,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  photo: DronePhoto;
  index: number;
  total: number;
  onChange: (patch: Partial<DronePhoto>) => void;
  onMove: (delta: -1 | 1) => void;
  onRemove: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("scope", "drone");
      body.append("key", `dronefoto-${index + 1}`);
      // Trailing slash matches next.config trailingSlash so the POST body survives.
      const res = await fetch("/api/admin/upload/", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload mislukt.");
      onChange({ src: data.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er ging iets mis.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:flex-row">
      <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/5 sm:w-40">
        {photo.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.src} alt={photo.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[11px] text-white/30">Geen foto</div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10 disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" /> {photo.src ? "Vervangen" : "Uploaden"}
          </button>
          <span className="ml-auto flex items-center gap-1">
            <button type="button" onClick={() => onMove(-1)} disabled={index === 0} title="Omhoog" className={iconBtn}>
              <ChevronUp className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} title="Omlaag" className={iconBtn}>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              title="Verwijderen"
              className={`${iconBtn} hover:border-red-400/40 hover:text-red-300`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </span>
        </div>
        <input
          type="text"
          value={photo.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Titel (in de lightbox), bv. Dronefotografie villa"
          className={inputClasses}
        />
        <input
          type="text"
          value={photo.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Korte label op de foto, bv. Luchtfoto"
          className={inputClasses}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/webp,image/png,image/jpeg,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />
    </li>
  );
}

function VideoRow({
  video,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  video: DroneVideo;
  index: number;
  total: number;
  onChange: (patch: Partial<DroneVideo>) => void;
  onMove: (delta: -1 | 1) => void;
  onRemove: () => void;
}) {
  const id = ytId(video.yt);

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:flex-row">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/5 sm:w-40">
        {id ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} alt={video.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-2 text-center text-[11px] text-white/30">
            Plak een geldige YouTube-link
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={video.yt}
            onChange={(e) => onChange({ yt: e.target.value })}
            placeholder="YouTube-link of -id"
            className={inputClasses}
          />
          <span className="flex items-center gap-1">
            <button type="button" onClick={() => onMove(-1)} disabled={index === 0} title="Omhoog" className={iconBtn}>
              <ChevronUp className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} title="Omlaag" className={iconBtn}>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              title="Verwijderen"
              className={`${iconBtn} hover:border-red-400/40 hover:text-red-300`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </span>
        </div>
        <input
          type="text"
          value={video.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Titel (in de lightbox), bv. Drone-reel: luchtbeelden"
          className={inputClasses}
        />
        <input
          type="text"
          value={video.tag}
          onChange={(e) => onChange({ tag: e.target.value })}
          placeholder="Korte tag op de kaart, bv. Dronevideo of FPV"
          className={inputClasses}
        />
      </div>
    </li>
  );
}
