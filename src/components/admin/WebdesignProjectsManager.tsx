"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Loader2, Save, X, Sparkles } from "lucide-react";
import type { WebdesignProject } from "@/data/webdesignShowcase";
import { WEBDESIGN_IMAGE_SLOTS, imageKey } from "@/data/webdesignShowcase";
import type { WebdesignImages } from "@/lib/firestore/webdesignImages";
import { saveWebdesignProjects } from "@/lib/admin/webdesignActions";
import { ImageUploadField } from "./ImageUploadField";
import { SectorPicker } from "./SectorPicker";

const aspectForSlot: Record<string, string> = {
  thumb: "aspect-video",
  "1": "aspect-video",
  "2": "aspect-video",
  "3": "aspect-[3/4]",
  "4": "aspect-[1/2]",
};

type GeneratedCopy = {
  title: string;
  subtitle: string;
  tagline: string;
  text: string;
  tags: string[];
  terms: string[];
  features: string[];
};

function newId() {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : String(Math.floor(Math.random() * 1e9));
  return `p-${rand}`;
}

function emptyProject(): WebdesignProject {
  return {
    id: newId(),
    name: "",
    client: "",
    url: "",
    tags: [],
    teaser: "",
    text: "",
    features: [],
    terms: [],
    sectors: [],
  };
}

const inputCls =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-amber-400/50 focus:outline-none";

/** A small editor for a list of short strings (badges, SEO terms, deliverables). */
function StringListEditor({
  label,
  hint,
  items,
  onChange,
  placeholder,
  max,
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  max?: number;
}) {
  const atMax = typeof max === "number" && items.length >= max;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-white/60">
        {label}
        {hint && <span className="ml-1 text-white/30">{hint}</span>}
      </span>
      <div className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              className={inputCls}
              value={item}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="flex h-8 w-8 flex-none items-center justify-center rounded-md border border-white/10 text-white/40 hover:bg-red-500/10 hover:text-red-300"
              aria-label="Verwijderen"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      {!atMax && (
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex w-fit items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/70 hover:bg-white/10"
        >
          <Plus className="h-3.5 w-3.5" />
          Toevoegen
        </button>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  index,
  total,
  images,
  open,
  onToggle,
  onChange,
  onMove,
  onDelete,
  onImagesMerge,
}: {
  project: WebdesignProject;
  index: number;
  total: number;
  images: WebdesignImages;
  open: boolean;
  onToggle: () => void;
  onChange: (next: WebdesignProject) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
  onImagesMerge: (partial: WebdesignImages) => void;
}) {
  const set = <K extends keyof WebdesignProject>(key: K, value: WebdesignProject[K]) =>
    onChange({ ...project, [key]: value });

  const [genBusy, setGenBusy] = useState(false);
  const [genStatus, setGenStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  async function autoGenerate() {
    if (!project.url.trim()) {
      setGenStatus({ ok: false, msg: "Vul eerst de knop-link (URL) onderaan in." });
      return;
    }
    setGenBusy(true);
    setGenStatus(null);
    try {
      const res = await fetch("/api/admin/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: project.url.trim(), projectId: project.id, siteName: project.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Genereren mislukt.");

      if (data.images && typeof data.images === "object") {
        onImagesMerge(data.images as WebdesignImages);
      }
      const copy = data.copy as GeneratedCopy | null;
      if (copy) {
        onChange({
          ...project,
          name: copy.title || project.name,
          client: copy.subtitle || project.client,
          teaser: copy.tagline || project.teaser,
          text: copy.text,
          tags: copy.tags.slice(0, 3),
          terms: copy.terms,
          features: copy.features,
        });
      }
      setGenStatus({
        ok: !data.copyError,
        msg: data.copyError
          ? `Screenshots klaar. Tekst niet gelukt: ${data.copyError}`
          : "Screenshots en tekst gegenereerd. Controleer en sla op.",
      });
    } catch (e) {
      setGenStatus({ ok: false, msg: e instanceof Error ? e.message : "Er ging iets mis." });
    } finally {
      setGenBusy(false);
    }
  }

  const thumb = images[imageKey(project.id, "thumb")];

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <header className={`flex items-center justify-between gap-3 ${open ? "mb-4 border-b border-white/10 pb-3" : ""}`}>
        <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-expanded={open}>
          <ChevronDown className={`h-4 w-4 flex-none text-white/50 transition-transform ${open ? "" : "-rotate-90"}`} />
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt="" className="h-8 w-12 flex-none rounded object-cover" />
          ) : (
            <span className="h-8 w-12 flex-none rounded border border-white/10 bg-white/[0.03]" />
          )}
          <span className="min-w-0 truncate text-lg font-semibold">
            <span className="mr-2 font-mono text-amber-400">{String(index + 1).padStart(2, "0")}</span>
            {project.name || <span className="text-white/40">Nieuwe realisatie</span>}
          </span>
        </button>
        <div className="flex flex-none items-center gap-1.5">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-30"
            aria-label="Omhoog"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-30"
            aria-label="Omlaag"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="ml-1 flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-2.5 text-xs text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Verwijderen
          </button>
        </div>
      </header>

      {open && (
        <>
      {/* AI auto-generate: screenshots + copy from the site URL. */}
      <div className="mb-5 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
              <Sparkles className="h-4 w-4" />
              Automatisch invullen
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-white/55">
              Maakt een desktop- en mobiel-screenshot van de knop-link en schrijft de beschrijving,
              badges, SEO-termen en checklist. Controleer alles voor je opslaat.
            </p>
          </div>
          <button
            type="button"
            onClick={autoGenerate}
            disabled={genBusy}
            className="inline-flex flex-none items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
          >
            {genBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {genBusy ? "Bezig..." : "Auto-genereer uit URL"}
          </button>
        </div>
        {genStatus && (
          <p className={`mt-2 text-xs ${genStatus.ok ? "text-emerald-400" : "text-red-400"}`}>
            {genStatus.msg}
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-white/60">Titel</span>
          <input
            className={inputCls}
            value={project.name}
            placeholder="Bijv. Gordijnen Myriam"
            onChange={(e) => set("name", e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-white/60">
            Subtitel <span className="text-white/30">(klantregel, bovenaan info)</span>
          </span>
          <input
            className={inputCls}
            value={project.client}
            placeholder="GORDIJNEN MYRIAM · GORDIJNEN & MEER"
            onChange={(e) => set("client", e.target.value)}
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <StringListEditor
          label="Badges"
          hint="(max 3)"
          max={3}
          placeholder="Horeca"
          items={project.tags}
          onChange={(next) => set("tags", next)}
        />
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-white/60">Tagline</span>
          <input
            className={inputCls}
            value={project.teaser}
            placeholder="Korte zin onder de titel."
            onChange={(e) => set("teaser", e.target.value)}
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1.5">
        <span className="text-xs font-medium text-white/60">Beschrijving</span>
        <textarea
          className={`${inputCls} min-h-[96px] resize-y`}
          value={project.text}
          placeholder="Volledige paragraaf die opengeklapt wordt getoond."
          onChange={(e) => set("text", e.target.value)}
        />
      </label>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <StringListEditor
          label="SEO-focus"
          hint="(zoektermen)"
          placeholder="lokale SEO"
          items={project.terms}
          onChange={(next) => set("terms", next)}
        />
        <StringListEditor
          label="Wat we leverden"
          placeholder="Eigen huisstijl & webdesign"
          items={project.features}
          onChange={(next) => set("features", next)}
        />
      </div>

      <div className="mt-4">
        <SectorPicker
          hint="(toont dit project op de gekozen sectorpagina's)"
          value={project.sectors ?? []}
          onChange={(next) => set("sectors", next)}
        />
      </div>

      <label className="mt-4 flex flex-col gap-1.5">
        <span className="text-xs font-medium text-white/60">
          Knop-link <span className="text-white/30">(Bekijk site, ook bron voor AI)</span>
        </span>
        <input
          className={inputCls}
          value={project.url}
          placeholder="https://voorbeeld.be"
          onChange={(e) => set("url", e.target.value)}
        />
      </label>

      <div className="mt-5">
        <span className="text-xs font-medium text-white/60">Afbeeldingen</span>
        <div className="mt-2 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {WEBDESIGN_IMAGE_SLOTS.map(({ slot, label }) => {
            const key = imageKey(project.id, slot);
            return (
              <ImageUploadField
                key={`${key}:${images[key] ?? ""}`}
                imageKey={key}
                label={label}
                initialUrl={images[key]}
                aspect={aspectForSlot[slot]}
              />
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-white/30">
          Afbeeldingen worden meteen opgeslagen. Sla de realisatie op zodat ze publiek verschijnt.
        </p>
      </div>
        </>
      )}
    </section>
  );
}

export function WebdesignProjectsManager({
  initialProjects,
  images: initialImages,
}: {
  initialProjects: WebdesignProject[];
  images: WebdesignImages;
}) {
  const [projects, setProjects] = useState<WebdesignProject[]>(initialProjects);
  const [images, setImages] = useState<WebdesignImages>(initialImages);
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

  const update = (next: WebdesignProject[]) => {
    setProjects(next);
    setDirty(true);
    setStatus(null);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  const add = () => {
    const project = emptyProject();
    update([...projects, project]);
    setOpenIds((prev) => new Set(prev).add(project.id)); // open the new one
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }));
    }
  };

  const allOpen = projects.length > 0 && projects.every((p) => openIds.has(p.id));

  async function save() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await saveWebdesignProjects(projects);
      if (!res.ok) throw new Error(res.error ?? "Opslaan mislukt.");
      setDirty(false);
      setStatus({ ok: true, msg: "Realisaties opgeslagen." });
    } catch (e) {
      setStatus({ ok: false, msg: e instanceof Error ? e.message : "Er ging iets mis." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {projects.length > 1 && (
        <button
          type="button"
          onClick={() => setOpenIds(allOpen ? new Set() : new Set(projects.map((p) => p.id)))}
          className="inline-flex w-fit items-center gap-1.5 text-xs text-white/50 hover:text-white"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${allOpen ? "" : "-rotate-90"}`} />
          {allOpen ? "Alles inklappen" : "Alles uitklappen"}
        </button>
      )}

      {projects.map((p, i) => (
        <ProjectCard
          key={p.id}
          project={p}
          index={i}
          total={projects.length}
          images={images}
          open={openIds.has(p.id)}
          onToggle={() => toggleOpen(p.id)}
          onChange={(next) => update(projects.map((x, j) => (j === i ? next : x)))}
          onMove={(dir) => move(i, dir)}
          onDelete={() => update(projects.filter((_, j) => j !== i))}
          onImagesMerge={(partial) => setImages((prev) => ({ ...prev, ...partial }))}
        />
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-white/20 px-4 py-2.5 text-sm text-white/70 hover:border-amber-400/50 hover:text-white"
      >
        <Plus className="h-4 w-4" />
        Realisatie toevoegen
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
