"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  APPLICATION_CASE_IMAGE_SLOTS,
  applicationCaseImageKey,
  type ApplicationCase,
} from "@/data/applicationCases";
import type { ApplicationCaseImages } from "@/lib/firestore/applicationCases";
import { saveApplicationCases } from "@/lib/admin/applicationCaseActions";
import { ApplicationCaseImageField } from "./ApplicationCaseImageField";

const inputClass =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-amber-400/50 focus:outline-none";

const newId = () =>
  `app-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : Date.now()}`;

function emptyCase(): ApplicationCase {
  return {
    id: newId(),
    slug: "",
    title: "",
    client: "",
    websiteUrl: "",
    status: "in-development",
    published: false,
    featured: false,
    tags: [],
    tagline: "",
    excerpt: "",
    challenge: "",
    solution: "",
    capabilities: [],
    technology: [],
    results: [],
    ssr: { title: "", description: "", points: [] },
    seoTitle: "",
    seoDescription: "",
  };
}

function cleanLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function LinesField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-white/60">
        {label} {hint && <span className="text-white/30">{hint}</span>}
      </span>
      <textarea
        className={`${inputClass} min-h-[112px] resize-y`}
        value={value.join("\n")}
        onChange={(event) => {
          // Tijdens het typen bewaren we ook lege regels en spaties. Daardoor
          // blijft de textarea exact gelijk aan wat de gebruiker invoert en
          // verliest de cursor zijn positie niet na iedere React-render.
          onChange(event.currentTarget.value.split("\n"));
        }}
        onBlur={(event) => {
          // Pas na het verlaten van het veld ruimen we lege regels en
          // overbodige spaties op voor de opgeslagen lijst.
          onChange(cleanLines(event.currentTarget.value));
        }}
      />
    </label>
  );
}

function CaseEditor({
  project,
  images,
  index,
  total,
  open,
  onToggle,
  onChange,
  onMove,
  onDelete,
}: {
  project: ApplicationCase;
  images: ApplicationCaseImages;
  index: number;
  total: number;
  open: boolean;
  onToggle: () => void;
  onChange: (project: ApplicationCase) => void;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
}) {
  const set = <K extends keyof ApplicationCase>(key: K, value: ApplicationCase[K]) =>
    onChange({ ...project, [key]: value });
  const cover = images[applicationCaseImageKey(project.id, "cover")];

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <header className={`flex items-center gap-3 ${open ? "mb-5 border-b border-white/10 pb-4" : ""}`}>
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${open ? "" : "-rotate-90"}`} />
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="h-10 w-16 rounded object-cover" />
          ) : (
            <span className="h-10 w-16 rounded border border-white/10 bg-white/[0.03]" />
          )}
          <span className="min-w-0 flex-1 truncate font-semibold">
            <span className="mr-2 font-mono text-amber-400">{String(index + 1).padStart(2, "0")}</span>
            {project.title || <span className="text-white/40">Nieuwe applicatiecase</span>}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
              project.status === "live"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-300"
            }`}
          >
            {project.status === "live" ? "Live" : "In ontwikkeling"}
          </span>
        </button>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/60 hover:bg-white/10 disabled:opacity-30"
            aria-label="Omhoog"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/60 hover:bg-white/10 disabled:opacity-30"
            aria-label="Omlaag"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-2.5 text-xs text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Verwijderen
          </button>
        </div>
      </header>

      {open && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">Titel</span>
              <input className={inputClass} value={project.title} onChange={(e) => set("title", e.target.value)} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">Klantregel</span>
              <input className={inputClass} value={project.client} onChange={(e) => set("client", e.target.value)} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">URL-slug</span>
              <input className={inputClass} value={project.slug} onChange={(e) => set("slug", e.target.value)} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">Website-URL</span>
              <input className={inputClass} value={project.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">Status</span>
              <select
                className={inputClass}
                value={project.status}
                onChange={(e) => set("status", e.target.value === "live" ? "live" : "in-development")}
              >
                <option value="live">Live</option>
                <option value="in-development">In ontwikkeling</option>
              </select>
            </label>
            <label className="flex items-center gap-2 pt-6 text-sm text-white/70">
              <input
                type="checkbox"
                checked={project.published}
                onChange={(e) => set("published", e.target.checked)}
              />
              Publiek tonen
            </label>
            <label className="flex items-center gap-2 pt-6 text-sm text-white/70">
              <input
                type="checkbox"
                checked={project.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Uitgelicht
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">Tags</span>
              <input
                className={inputClass}
                value={project.tags.join(", ")}
                onChange={(e) => set("tags", e.target.value.split(",").map((item) => item.trim()).filter(Boolean))}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-white/60">Tagline</span>
            <input className={inputClass} value={project.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-white/60">Korte samenvatting</span>
            <textarea className={`${inputClass} min-h-[80px]`} value={project.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
          </label>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">Uitdaging</span>
              <textarea className={`${inputClass} min-h-[170px]`} value={project.challenge} onChange={(e) => set("challenge", e.target.value)} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">Oplossing</span>
              <textarea className={`${inputClass} min-h-[170px]`} value={project.solution} onChange={(e) => set("solution", e.target.value)} />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <LinesField label="Functies" value={project.capabilities} onChange={(value) => set("capabilities", value)} />
            <LinesField label="Technologie" value={project.technology} onChange={(value) => set("technology", value)} />
            <LinesField label="Resultaten" value={project.results} onChange={(value) => set("results", value)} />
          </div>

          <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.04] p-4">
            <h3 className="mb-4 font-semibold text-amber-200">SSR en technische SEO</h3>
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-white/60">Titel</span>
                <input
                  className={inputClass}
                  value={project.ssr.title}
                  onChange={(e) => set("ssr", { ...project.ssr, title: e.target.value })}
                />
              </label>
              <LinesField
                label="Technische punten"
                value={project.ssr.points}
                onChange={(value) => set("ssr", { ...project.ssr, points: value })}
              />
            </div>
            <label className="mt-4 flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">Uitleg</span>
              <textarea
                className={`${inputClass} min-h-[100px]`}
                value={project.ssr.description}
                onChange={(e) => set("ssr", { ...project.ssr, description: e.target.value })}
              />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">SEO-titel</span>
              <input className={inputClass} value={project.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-white/60">SEO-beschrijving</span>
              <textarea className={`${inputClass} min-h-[84px]`} value={project.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
            </label>
          </div>

          <div>
            <div className="mb-3">
              <h3 className="font-semibold">Screenshots</h3>
              <p className="mt-1 text-xs text-white/40">
                Uploads worden onmiddellijk in Firebase Storage en Firestore opgeslagen. De tekstvelden bewaar je onderaan met “Wijzigingen opslaan”.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {APPLICATION_CASE_IMAGE_SLOTS.map(({ slot, label, aspect }) => {
                const key = applicationCaseImageKey(project.id, slot);
                return (
                  <ApplicationCaseImageField
                    key={`${key}:${images[key] ?? ""}`}
                    imageKey={key}
                    label={label}
                    aspect={aspect}
                    initialUrl={images[key]}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function ApplicationCasesManager({
  initialProjects,
  images,
}: {
  initialProjects: ApplicationCase[];
  images: ApplicationCaseImages;
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(initialProjects.map((p) => p.id)));
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  const allOpen = useMemo(
    () => projects.length > 0 && projects.every((project) => openIds.has(project.id)),
    [openIds, projects],
  );

  const update = (next: ApplicationCase[]) => {
    setProjects(next);
    setDirty(true);
    setStatus(null);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  const add = () => {
    const project = emptyCase();
    update([...projects, project]);
    setOpenIds((previous) => new Set(previous).add(project.id));
  };

  async function save() {
    setBusy(true);
    setStatus(null);
    try {
      const result = await saveApplicationCases(projects);
      if (!result.ok) throw new Error(result.error ?? "Opslaan mislukt.");
      setDirty(false);
      setStatus({ ok: true, message: "Applicatiecases opgeslagen." });
    } catch (cause) {
      setStatus({ ok: false, message: cause instanceof Error ? cause.message : "Er ging iets mis." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setOpenIds(allOpen ? new Set() : new Set(projects.map((project) => project.id)))}
        className="inline-flex w-fit items-center gap-1.5 text-xs text-white/50 hover:text-white"
      >
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${allOpen ? "" : "-rotate-90"}`} />
        {allOpen ? "Alles inklappen" : "Alles uitklappen"}
      </button>

      {projects.map((project, index) => (
        <CaseEditor
          key={project.id}
          project={project}
          images={images}
          index={index}
          total={projects.length}
          open={openIds.has(project.id)}
          onToggle={() =>
            setOpenIds((previous) => {
              const next = new Set(previous);
              if (next.has(project.id)) next.delete(project.id);
              else next.add(project.id);
              return next;
            })
          }
          onChange={(next) => update(projects.map((item, itemIndex) => (itemIndex === index ? next : item)))}
          onMove={(direction) => move(index, direction)}
          onDelete={() => update(projects.filter((_, itemIndex) => itemIndex !== index))}
        />
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-white/20 px-4 py-2.5 text-sm text-white/70 hover:border-amber-400/50 hover:text-white"
      >
        <Plus className="h-4 w-4" />
        Applicatiecase toevoegen
      </button>

      <div className="sticky bottom-0 -mx-1 mt-2 flex items-center justify-between gap-4 border-t border-white/10 bg-[#0a0a0a]/95 px-1 py-3 backdrop-blur">
        <span className={`text-sm ${status ? (status.ok ? "text-emerald-400" : "text-red-400") : dirty ? "text-amber-400/80" : "text-white/30"}`}>
          {status?.message ?? (dirty ? "Niet-opgeslagen wijzigingen" : "Alles opgeslagen")}
        </span>
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
