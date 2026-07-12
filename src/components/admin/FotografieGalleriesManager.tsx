"use client";

import { useRef, useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Loader2, Save, Star, Upload, X } from "lucide-react";
import type { FotoGallery, FotoGalleryImage } from "@/data/fotografieGalleries";
import { FOTO_GALLERY_ICONS } from "@/data/fotografieGalleries";
import { FiIcon } from "@/components/fotografie";
import { saveFotografieGalleries } from "@/lib/admin/fotografieActions";

const inputCls =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-amber-400/50 focus:outline-none";
const captionCls =
  "w-full rounded border border-white/10 bg-white/[0.03] px-1.5 py-1 text-[11px] text-white placeholder:text-white/25 focus:border-amber-400/50 focus:outline-none";

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

/** The per-gallery photo grid: multi-upload + caption/remove/reorder + cover pick. */
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
  // Cover = images[0]. Selecting a photo as cover moves it to the front.
  const setCover = (i: number) => {
    if (i === 0) return;
    const next = [...images];
    const [pick] = next.splice(i, 1);
    next.unshift(pick);
    onChange(next);
  };

  const overlayBtn =
    "flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur transition-opacity hover:text-white";

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
        Meerdere tegelijk mogelijk. Elke foto wordt automatisch naar WebP omgezet. Klik het sterretje om de cover te kiezen.
      </p>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {images.map((img, i) => {
            const isCover = i === 0;
            return (
              <div key={img.src} className="group flex flex-col gap-1">
                <div className="relative aspect-square overflow-hidden rounded-md border border-white/10 bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt="" className="h-full w-full object-cover" />

                  {/* cover star (top-left) */}
                  <button
                    type="button"
                    onClick={() => setCover(i)}
                    title={isCover ? "Coverfoto" : "Als cover instellen"}
                    aria-label={isCover ? "Coverfoto" : "Als cover instellen"}
                    className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full backdrop-blur transition ${
                      isCover
                        ? "bg-amber-500 text-black"
                        : "bg-black/60 text-white/80 opacity-0 hover:text-amber-300 group-hover:opacity-100"
                    }`}
                  >
                    <Star className="h-3.5 w-3.5" fill={isCover ? "currentColor" : "none"} />
                  </button>

                  {/* remove (top-right) */}
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    title="Verwijderen"
                    aria-label="Verwijderen"
                    className={`${overlayBtn} absolute right-1 top-1 opacity-0 hover:text-red-300 group-hover:opacity-100`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* reorder (bottom, on hover) */}
                  <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className={`${overlayBtn} disabled:opacity-20`}
                      aria-label="Naar links"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === images.length - 1}
                      className={`${overlayBtn} disabled:opacity-20`}
                      aria-label="Naar rechts"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <input
                  className={captionCls}
                  value={img.caption ?? ""}
                  placeholder="Caption"
                  onChange={(e) => setCaption(i, e.target.value)}
                />
              </div>
            );
          })}
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
  open,
  onToggle,
  onChange,
  onMove,
  onDelete,
}: {
  gallery: FotoGallery;
  index: number;
  total: number;
  open: boolean;
  onToggle: () => void;
  onChange: (next: FotoGallery) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
}) {
  const set = <K extends keyof FotoGallery>(key: K, value: FotoGallery[K]) =>
    onChange({ ...gallery, [key]: value });

  const cover = gallery.images[0]?.src;

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <header className={`flex items-center justify-between gap-3 ${open ? "mb-4 border-b border-white/10 pb-3" : ""}`}>
        <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-expanded={open}>
          <ChevronDown className={`h-4 w-4 flex-none text-white/50 transition-transform ${open ? "" : "-rotate-90"}`} />
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="h-8 w-8 flex-none rounded-md object-cover" />
          ) : (
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/40">
              <FiIcon id={gallery.icon} size={16} />
            </span>
          )}
          <span className="min-w-0 truncate text-lg font-semibold">
            <span className="mr-2 font-mono text-amber-400">{String(index + 1).padStart(2, "0")}</span>
            {gallery.title || <span className="text-white/40">Nieuwe galerij</span>}
          </span>
          <span className="flex-none text-xs text-white/40">{gallery.images.length} foto&apos;s</span>
        </button>
        <div className="flex flex-none items-center gap-1.5">
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

      {open && (
        <>
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
              <span className="text-xs font-medium text-white/60">Categorie</span>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-amber-400/25 bg-amber-400/10 text-amber-300">
                  <FiIcon id={gallery.icon} size={18} />
                </span>
                <select className={`${inputCls} flex-1`} value={gallery.icon} onChange={(e) => set("icon", e.target.value)}>
                  {FOTO_GALLERY_ICONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          <GalleryImages galleryId={gallery.id} images={gallery.images} onChange={(next) => set("images", next)} />
        </>
      )}
    </section>
  );
}

export function FotografieGalleriesManager({ initialGalleries }: { initialGalleries: FotoGallery[] }) {
  const [galleries, setGalleries] = useState<FotoGallery[]>(initialGalleries);
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const toggleOpen = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

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
    const gallery = emptyGallery();
    update([...galleries, gallery]);
    setOpenIds((prev) => new Set(prev).add(gallery.id)); // open the new one
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

  const allOpen = galleries.length > 0 && galleries.every((g) => openIds.has(g.id));

  return (
    <div className="flex flex-col gap-4">
      {galleries.length > 1 && (
        <button
          type="button"
          onClick={() => setOpenIds(allOpen ? new Set() : new Set(galleries.map((g) => g.id)))}
          className="inline-flex w-fit items-center gap-1.5 text-xs text-white/50 hover:text-white"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${allOpen ? "" : "-rotate-90"}`} />
          {allOpen ? "Alles inklappen" : "Alles uitklappen"}
        </button>
      )}

      {galleries.map((g, i) => (
        <GalleryCard
          key={g.id}
          gallery={g}
          index={i}
          total={galleries.length}
          open={openIds.has(g.id)}
          onToggle={() => toggleOpen(g.id)}
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
