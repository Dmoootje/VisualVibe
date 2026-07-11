"use client";

import { useRef, useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Loader2, Save, Upload, X } from "lucide-react";
import type { FotoGallery, FotoGalleryImage } from "@/data/fotografieGalleries";
import { FOTO_GALLERY_ICONS } from "@/data/fotografieGalleries";
import { saveFotografieGalleries } from "@/lib/admin/fotografieActions";

const inputCls =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-amber-400/50 focus:outline-none";

function newId() {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : String(Math.floor(Math.random() * 1e9));
  return `g-${rand}`;
}

function emptyGallery(): FotoGallery {
  return { id: newId(), title: "", description: "", icon: "foto", images: [] };
}

/** Upload one file to Firebase Storage (auto-WebP) and return the public URL. */
async function uploadOne(file: File, key: string): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("key", key);
  body.append("scope", "fotografie");
  // Trailing slash matches next.config `trailingSlash: true` so the POST isn't
  // 308-redirected (which drops the multipart body).
  const res = await fetch("/api/admin/upload/", { method: "POST", body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Upload mislukt.");
  return data.url as string;
}

/** The per-gallery photo grid: multi-upload + caption/remove/reorder. */
function GalleryImages({
  galleryId,
  images,
  onChange,
}: {
  galleryId: string;
  images: FotoGalleryImage[];
  onChange: (next: FotoGalleryImage[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setBusy(true);
    setError(null);
    const added: FotoGalleryImage[] = [];
    try {
      let i = images.length;
      for (const file of Array.from(files)) {
        const url = await uploadOne(file, `${galleryId}-${i}`);
        added.push({ src: url });
        i++;
      }
      onChange([...images, ...added]);
    } catch (e) {
      if (added.length) onChange([...images, ...added]);
      setError(e instanceof Error ? e.message : "Uploaden mislukt.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const setCaption = (i: number, caption: string) =>
    onChange(images.map((img, j) => (j === i ? { ...img, caption } : img)));
  const remove = (i: number) => onChange(images.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const t = i + dir;
    if (t < 0 || t >= images.length) return;
    const next = [...images];
    [next[i], next[t]] = [next[t], next[i]];
    onChange(next);
  };

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-white/60">Foto&apos;s {images.length > 0 && `(${images.length})`}</span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {busy ? "Uploaden..." : "Foto's uploaden"}
        </button>
      </div>
      <p className="mt-1 text-[11px] text-white/30">
        Meerdere tegelijk mogelijk. Elke foto wordt automatisch naar WebP omgezet. De eerste foto is de cover.
      </p>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      {images.length > 0 && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <div key={img.src} className="flex flex-col gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-black">COVER</span>
                )}
              </div>
              <input
                className={`${inputCls} py-1 text-xs`}
                value={img.caption ?? ""}
                placeholder="Caption (optioneel)"
                onChange={(e) => setCaption(i, e.target.value)}
              />
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-white/60 hover:bg-white/10 disabled:opacity-30" aria-label="Naar links">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-white/60 hover:bg-white/10 disabled:opacity-30" aria-label="Naar rechts">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => remove(i)} className="ml-auto flex h-7 items-center gap-1 rounded-md border border-white/10 px-2 text-[11px] text-red-300 hover:bg-red-500/10" aria-label="Verwijderen">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/webp,image/png,image/jpeg,image/avif"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length) handleFiles(e.target.files);
        }}
      />
    </div>
  );
}

function GalleryCard({
  gallery,
  index,
  total,
  onChange,
  onMove,
  onDelete,
}: {
  gallery: FotoGallery;
  index: number;
  total: number;
  onChange: (next: FotoGallery) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
}) {
  const set = <K extends keyof FotoGallery>(key: K, value: FotoGallery[K]) =>
    onChange({ ...gallery, [key]: value });

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <header className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <h2 className="text-lg font-semibold">
          <span className="mr-2 font-mono text-amber-400">{String(index + 1).padStart(2, "0")}</span>
          {gallery.title || <span className="text-white/40">Nieuwe galerij</span>}
        </h2>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-30" aria-label="Omhoog">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-30" aria-label="Omlaag">
            <ChevronDown className="h-4 w-4" />
          </button>
          <button type="button" onClick={onDelete} className="ml-1 flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-2.5 text-xs text-red-300 hover:bg-red-500/10">
            <Trash2 className="h-3.5 w-3.5" />
            Verwijderen
          </button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_180px]">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-white/60">Titel</span>
          <input className={inputCls} value={gallery.title} placeholder="Bijv. Bedrijfsfotografie" onChange={(e) => set("title", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-white/60">Omschrijving</span>
          <input className={inputCls} value={gallery.description} placeholder="Korte zin onder de titel." onChange={(e) => set("description", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-white/60">Categorie-icoon</span>
          <select className={inputCls} value={gallery.icon} onChange={(e) => set("icon", e.target.value)}>
            {FOTO_GALLERY_ICONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </label>
      </div>

      <GalleryImages galleryId={gallery.id} images={gallery.images} onChange={(next) => set("images", next)} />
    </section>
  );
}

export function FotografieGalleriesManager({ initialGalleries }: { initialGalleries: FotoGallery[] }) {
  const [galleries, setGalleries] = useState<FotoGallery[]>(initialGalleries);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const update = (next: FotoGallery[]) => {
    setGalleries(next);
    setDirty(true);
    setStatus(null);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= galleries.length) return;
    const next = [...galleries];
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  const add = () => {
    update([...galleries, emptyGallery()]);
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }));
    }
  };

  async function save() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await saveFotografieGalleries(galleries);
      if (!res.ok) throw new Error(res.error ?? "Opslaan mislukt.");
      setDirty(false);
      setStatus({ ok: true, msg: "Galerijen opgeslagen." });
    } catch (e) {
      setStatus({ ok: false, msg: e instanceof Error ? e.message : "Er ging iets mis." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {galleries.map((g, i) => (
        <GalleryCard
          key={g.id}
          gallery={g}
          index={i}
          total={galleries.length}
          onChange={(next) => update(galleries.map((x, j) => (j === i ? next : x)))}
          onMove={(dir) => move(i, dir)}
          onDelete={() => update(galleries.filter((_, j) => j !== i))}
        />
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-white/20 px-4 py-2.5 text-sm text-white/70 hover:border-amber-400/50 hover:text-white"
      >
        <Plus className="h-4 w-4" />
        Galerij toevoegen
      </button>

      <div className="sticky bottom-0 -mx-1 mt-2 flex items-center justify-between gap-4 border-t border-white/10 bg-[#0a0a0a]/95 px-1 py-3 backdrop-blur">
        <div className="text-sm">
          {status ? (
            <span className={status.ok ? "text-emerald-400" : "text-red-400"}>{status.msg}</span>
          ) : dirty ? (
            <span className="text-amber-400/80">Niet-opgeslagen wijzigingen</span>
          ) : (
            <span className="text-white/30">Alles opgeslagen</span>
          )}
        </div>
        <button
          type="button"
          onClick={save}
          disabled={busy || !dirty}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-40"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Wijzigingen opslaan
        </button>
      </div>
    </div>
  );
}
