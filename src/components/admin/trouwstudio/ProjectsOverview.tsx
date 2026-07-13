"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArchiveRestore,
  Copy,
  Heart,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  EDITING_STYLE_LABELS,
  PROJECT_STATUS_LABELS,
  WEDDING_PROJECT_STATUSES,
  coupleName,
  type WeddingEditingStyle,
  type WeddingProject,
  type WeddingProjectStatus,
} from "@/features/trouwstudio/types";
import {
  createProjectAction,
  deleteProjectAction,
  duplicateProjectAction,
  updateProjectAction,
} from "@/lib/admin/trouwstudioActions";
import { formatDate, inputClasses } from "./shared";

const PROJECT_STATUS_BADGE: Record<WeddingProjectStatus, string> = {
  concept: "bg-white/10 text-white/60",
  fotos_toegevoegd: "bg-sky-500/15 text-sky-300",
  analyse_bezig: "bg-sky-500/25 text-sky-200",
  controle_nodig: "bg-amber-500/20 text-amber-300",
  fotos_afgewerkt: "bg-emerald-500/15 text-emerald-300",
  album_in_opmaak: "bg-violet-500/15 text-violet-300",
  klaar_voor_export: "bg-emerald-500/25 text-emerald-200",
  afgerond: "bg-emerald-500/30 text-emerald-200",
};

type SortKey = "gewijzigd" | "datum" | "naam";

type NewProjectForm = {
  partnerOneName: string;
  partnerTwoName: string;
  weddingDate: string;
  ceremonyLocation: string;
  receptionLocation: string;
  city: string;
  photographerName: string;
  internalName: string;
  language: string;
  editingStyle: WeddingEditingStyle;
  notes: string;
};

const EMPTY_FORM: NewProjectForm = {
  partnerOneName: "",
  partnerTwoName: "",
  weddingDate: "",
  ceremonyLocation: "",
  receptionLocation: "",
  city: "",
  photographerName: "",
  internalName: "",
  language: "nl",
  editingStyle: "warm-romantisch",
  notes: "",
};

const primaryBtn =
  "inline-flex items-center gap-2 rounded-md bg-amber-500/90 px-4 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryBtn =
  "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50";

export function ProjectsOverview({ initialProjects }: { initialProjects: WeddingProject[] }) {
  const router = useRouter();

  // Server actions revalideren de route; sync de verse serverdata naar de lokale state.
  const [projects, setProjects] = useState<WeddingProject[]>(initialProjects);
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"alle" | WeddingProjectStatus>("alle");
  const [sort, setSort] = useState<SortKey>("gewijzigd");
  const [showArchived, setShowArchived] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<NewProjectForm>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ id: string; value: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WeddingProject | null>(null);
  const [busyAction, setBusyAction] = useState<{ id: string; kind: "rename" | "duplicate" | "archive" | "delete" } | null>(null);
  const [cardError, setCardError] = useState<{ id: string; text: string } | null>(null);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = projects.filter((p) => showArchived || !p.archived);
    if (statusFilter !== "alle") list = list.filter((p) => p.status === statusFilter);
    if (q) {
      list = list.filter((p) =>
        [p.partnerOneName, p.partnerTwoName, p.internalName, p.city ?? ""].join(" ").toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sort === "datum") sorted.sort((a, b) => a.weddingDate.localeCompare(b.weddingDate));
    else if (sort === "naam") sorted.sort((a, b) => coupleName(a).localeCompare(coupleName(b), "nl"));
    else sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return sorted;
  }, [projects, search, statusFilter, sort, showArchived]);

  const setField = (key: keyof NewProjectForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const submitNewProject = async () => {
    const errors: Record<string, string> = {};
    if (!form.partnerOneName.trim()) errors.partnerOneName = "Vul de naam van partner 1 in.";
    if (!form.partnerTwoName.trim()) errors.partnerTwoName = "Vul de naam van partner 2 in.";
    if (!form.weddingDate) errors.weddingDate = "Kies de trouwdatum.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setCreating(true);
    setFormError(null);
    const result = await createProjectAction({
      partnerOneName: form.partnerOneName.trim(),
      partnerTwoName: form.partnerTwoName.trim(),
      weddingDate: form.weddingDate,
      ceremonyLocation: form.ceremonyLocation.trim() || undefined,
      receptionLocation: form.receptionLocation.trim() || undefined,
      city: form.city.trim() || undefined,
      photographerName: form.photographerName.trim() || undefined,
      internalName: form.internalName.trim() || undefined,
      language: form.language,
      editingStyle: form.editingStyle,
      notes: form.notes.trim() || undefined,
    });
    if (result.ok && result.data) {
      router.push(`/admin/trouwstudio/projecten/${result.data.id}`);
      return; // knop blijft in bezig-status tijdens de navigatie
    }
    setFormError(result.error ?? "Project aanmaken mislukt.");
    setCreating(false);
  };

  const startRename = (project: WeddingProject) => {
    setMenuOpenId(null);
    setCardError(null);
    setRenameTarget({ id: project.id, value: project.internalName });
  };

  const saveRename = async () => {
    if (!renameTarget) return;
    const value = renameTarget.value.trim();
    if (!value) {
      setCardError({ id: renameTarget.id, text: "Geef een interne projectnaam op." });
      return;
    }
    setBusyAction({ id: renameTarget.id, kind: "rename" });
    setCardError(null);
    const result = await updateProjectAction(renameTarget.id, { internalName: value });
    if (result.ok) {
      setProjects((prev) => prev.map((p) => (p.id === renameTarget.id ? { ...p, internalName: value } : p)));
      setRenameTarget(null);
    } else {
      setCardError({ id: renameTarget.id, text: result.error ?? "Hernoemen mislukt." });
    }
    setBusyAction(null);
  };

  const duplicateProject = async (project: WeddingProject) => {
    setMenuOpenId(null);
    setBusyAction({ id: project.id, kind: "duplicate" });
    setCardError(null);
    const result = await duplicateProjectAction(project.id);
    if (result.ok && result.data) {
      router.push(`/admin/trouwstudio/projecten/${result.data.id}`);
      return;
    }
    setCardError({ id: project.id, text: result.error ?? "Dupliceren mislukt." });
    setBusyAction(null);
  };

  const setArchived = async (project: WeddingProject, archived: boolean) => {
    setMenuOpenId(null);
    setBusyAction({ id: project.id, kind: "archive" });
    setCardError(null);
    const result = await updateProjectAction(project.id, { archived });
    if (result.ok) {
      setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, archived } : p)));
    } else {
      setCardError({ id: project.id, text: result.error ?? "Opslaan mislukt." });
    }
    setBusyAction(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusyAction({ id: deleteTarget.id, kind: "delete" });
    const result = await deleteProjectAction(deleteTarget.id);
    if (result.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } else {
      setCardError({ id: deleteTarget.id, text: result.error ?? "Verwijderen mislukt." });
      setDeleteTarget(null);
    }
    setBusyAction(null);
  };

  const archiveInsteadOfDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    await setArchived(target, true);
  };

  const archivedCount = projects.filter((p) => p.archived).length;

  return (
    <div className="flex flex-col gap-6">
      {/* ===== Bovenbalk ===== */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setFormOpen((v) => !v);
            setFormError(null);
          }}
          className={primaryBtn}
        >
          <Plus className="h-4 w-4" />
          Nieuw trouwproject
        </button>
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek op namen, projectnaam of stad..."
            className={`${inputClasses} pl-9`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "alle" | WeddingProjectStatus)}
          className={`${inputClasses} w-auto`}
          aria-label="Filter op status"
        >
          <option value="alle">Alle statussen</option>
          {WEDDING_PROJECT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {PROJECT_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className={`${inputClasses} w-auto`}
          aria-label="Sorteren"
        >
          <option value="gewijzigd">Laatst gewijzigd</option>
          <option value="datum">Trouwdatum</option>
          <option value="naam">Naam</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="h-4 w-4 accent-amber-500"
          />
          Toon gearchiveerde{archivedCount > 0 ? ` (${archivedCount})` : ""}
        </label>
      </div>

      {/* ===== Nieuw-projectformulier ===== */}
      {formOpen && (
        <div className="rounded-lg border border-amber-500/25 bg-white/[0.03] p-6">
          <h2 className="text-lg font-semibold">Nieuw trouwproject</h2>
          <p className="mb-5 text-sm text-white/50">
            Velden met een * zijn verplicht. De rest kan je later nog aanvullen.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm text-white/70">
              Partner 1 *
              <input
                type="text"
                value={form.partnerOneName}
                onChange={(e) => setField("partnerOneName", e.target.value)}
                placeholder="bv. Lien"
                className={inputClasses}
              />
              {fieldErrors.partnerOneName && <span className="text-xs text-red-400">{fieldErrors.partnerOneName}</span>}
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-white/70">
              Partner 2 *
              <input
                type="text"
                value={form.partnerTwoName}
                onChange={(e) => setField("partnerTwoName", e.target.value)}
                placeholder="bv. Thomas"
                className={inputClasses}
              />
              {fieldErrors.partnerTwoName && <span className="text-xs text-red-400">{fieldErrors.partnerTwoName}</span>}
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-white/70">
              Trouwdatum *
              <input
                type="date"
                value={form.weddingDate}
                onChange={(e) => setField("weddingDate", e.target.value)}
                className={inputClasses}
              />
              {fieldErrors.weddingDate && <span className="text-xs text-red-400">{fieldErrors.weddingDate}</span>}
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-white/70">
              Stad/regio
              <input
                type="text"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="bv. Hasselt"
                className={inputClasses}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-white/70">
              Locatie ceremonie
              <input
                type="text"
                value={form.ceremonyLocation}
                onChange={(e) => setField("ceremonyLocation", e.target.value)}
                placeholder="bv. Stadhuis Hasselt"
                className={inputClasses}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-white/70">
              Locatie receptie
              <input
                type="text"
                value={form.receptionLocation}
                onChange={(e) => setField("receptionLocation", e.target.value)}
                placeholder="bv. Kasteel van Ordingen"
                className={inputClasses}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-white/70">
              Fotograaf
              <input
                type="text"
                value={form.photographerName}
                onChange={(e) => setField("photographerName", e.target.value)}
                placeholder="bv. VisualVibe"
                className={inputClasses}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-white/70">
              Interne projectnaam
              <input
                type="text"
                value={form.internalName}
                onChange={(e) => setField("internalName", e.target.value)}
                placeholder="Leeg = namen + trouwdatum"
                className={inputClasses}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-white/70">
              Taal
              <select value={form.language} onChange={(e) => setField("language", e.target.value)} className={inputClasses}>
                <option value="nl">Nederlands</option>
                <option value="fr">Frans</option>
                <option value="en">Engels</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-white/70">
              Fotostijl
              <select
                value={form.editingStyle}
                onChange={(e) => setField("editingStyle", e.target.value)}
                className={inputClasses}
              >
                {(Object.keys(EDITING_STYLE_LABELS) as WeddingEditingStyle[]).map((style) => (
                  <option key={style} value={style}>
                    {EDITING_STYLE_LABELS[style]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-white/70 sm:col-span-2">
              Interne notitie
              <textarea
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                rows={3}
                placeholder="Afspraken, wensen van het koppel, aandachtspunten..."
                className={inputClasses}
              />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={submitNewProject} disabled={creating} className={primaryBtn}>
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              {creating ? "Aanmaken..." : "Project aanmaken"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setForm(EMPTY_FORM);
                setFieldErrors({});
                setFormError(null);
              }}
              disabled={creating}
              className={secondaryBtn}
            >
              Annuleren
            </button>
            {formError && <span className="text-sm text-red-400">{formError}</span>}
          </div>
        </div>
      )}

      {/* ===== Lege staat ===== */}
      {projects.length === 0 && !formOpen && (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <Heart className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Nog geen trouwprojecten</h2>
            <p className="mt-1 max-w-md text-sm text-white/50">
              Maak je eerste trouwproject aan en voeg daarna foto&apos;s toe voor AI-analyse, optimalisatie en het
              trouwboek.
            </p>
          </div>
          <button type="button" onClick={() => setFormOpen(true)} className={primaryBtn}>
            <Plus className="h-4 w-4" />
            Nieuw trouwproject
          </button>
        </div>
      )}

      {projects.length > 0 && visible.length === 0 && (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-white/50">
          Geen projecten gevonden met deze filters.
        </div>
      )}

      {/* ===== Projectkaarten ===== */}
      {visible.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => {
            const busy = busyAction?.id === project.id;
            const isRenaming = renameTarget?.id === project.id;
            return (
              <div
                key={project.id}
                className={`relative flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] ${
                  project.archived ? "opacity-60" : ""
                }`}
              >
                <Link
                  href={`/admin/trouwstudio/projecten/${project.id}`}
                  className="relative block aspect-[16/9] w-full overflow-hidden bg-white/5"
                >
                  {project.coverPhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.coverPhotoUrl}
                      alt={coupleName(project)}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/25">
                      <Heart className="h-7 w-7" />
                      <span className="text-xs tracking-wide">
                        {[project.partnerOneName.charAt(0), project.partnerTwoName.charAt(0)]
                          .filter(Boolean)
                          .join(" & ")
                          .toUpperCase()}
                      </span>
                    </span>
                  )}
                  <span className="absolute left-2 top-2 flex gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${PROJECT_STATUS_BADGE[project.status]}`}
                    >
                      {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                    {project.archived && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/55">
                        Gearchiveerd
                      </span>
                    )}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div>
                    <h3 className="text-base font-semibold leading-snug">{coupleName(project)}</h3>
                    <p className="truncate text-xs text-white/40">{project.internalName}</p>
                  </div>
                  <p className="text-sm text-white/60">
                    {formatDate(project.weddingDate)}
                    {project.city ? ` · ${project.city}` : ""}
                  </p>
                  <p className="text-xs text-white/50">
                    {project.photoCount} foto&apos;s · {project.optimizedPhotoCount} geoptimaliseerd ·{" "}
                    {project.albumPhotoCount} in trouwboek
                  </p>

                  {isRenaming && renameTarget && (
                    <div className="mt-1 flex flex-col gap-2 rounded-md border border-amber-500/25 bg-white/[0.03] p-3">
                      <label className="flex flex-col gap-1.5 text-xs text-white/60">
                        Interne projectnaam
                        <input
                          type="text"
                          value={renameTarget.value}
                          onChange={(e) => setRenameTarget({ id: project.id, value: e.target.value })}
                          className={inputClasses}
                          autoFocus
                        />
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={saveRename}
                          disabled={busy}
                          className="rounded-md bg-amber-500/90 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
                        >
                          {busy && busyAction?.kind === "rename" ? "Opslaan..." : "Opslaan"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setRenameTarget(null)}
                          disabled={busy}
                          className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 disabled:opacity-50"
                        >
                          Annuleren
                        </button>
                      </div>
                    </div>
                  )}

                  {cardError?.id === project.id && <p className="text-xs text-red-400">{cardError.text}</p>}

                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <span className="text-[11px] text-white/40">Laatst gewijzigd: {formatDate(project.updatedAt)}</span>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/admin/trouwstudio/projecten/${project.id}`}
                        className="rounded-md bg-amber-500/90 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400"
                      >
                        Openen
                      </Link>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setMenuOpenId((cur) => (cur === project.id ? null : project.id))}
                          disabled={busy}
                          aria-label="Meer acties"
                          title="Meer acties"
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-50"
                        >
                          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                        </button>
                        {menuOpenId === project.id && (
                          <>
                            <button
                              type="button"
                              aria-hidden="true"
                              tabIndex={-1}
                              onClick={() => setMenuOpenId(null)}
                              className="fixed inset-0 z-20 cursor-default"
                            />
                            <div className="absolute right-0 top-8 z-30 w-52 rounded-md border border-white/10 bg-neutral-950 p-1 shadow-2xl">
                              <button
                                type="button"
                                onClick={() => startRename(project)}
                                className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-sm text-white/80 hover:bg-white/10"
                              >
                                <Pencil className="h-3.5 w-3.5" /> Hernoemen
                              </button>
                              <button
                                type="button"
                                onClick={() => duplicateProject(project)}
                                className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-sm text-white/80 hover:bg-white/10"
                              >
                                <Copy className="h-3.5 w-3.5" /> Dupliceren
                              </button>
                              <button
                                type="button"
                                onClick={() => setArchived(project, !project.archived)}
                                className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-sm text-white/80 hover:bg-white/10"
                              >
                                {project.archived ? (
                                  <>
                                    <ArchiveRestore className="h-3.5 w-3.5" /> Herstellen
                                  </>
                                ) : (
                                  <>
                                    <Archive className="h-3.5 w-3.5" /> Archiveren
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMenuOpenId(null);
                                  setDeleteTarget(project);
                                }}
                                className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-sm text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Verwijderen
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== Verwijder-dialoog ===== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-neutral-950 p-6">
            <h2 className="text-lg font-semibold">Project definitief verwijderen?</h2>
            <p className="mt-2 text-sm text-white/60">
              Je staat op het punt <strong className="text-white/85">{coupleName(deleteTarget)}</strong> definitief te
              verwijderen. Alle foto&apos;s, analyses en het trouwboek van dit project gaan permanent verloren. Dit kan
              niet ongedaan worden gemaakt.
            </p>
            <p className="mt-2 text-sm text-white/60">
              Wil je het project bewaren maar uit het overzicht halen? Archiveer het dan in plaats van te verwijderen.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={confirmDelete}
                disabled={busyAction?.kind === "delete"}
                className="inline-flex items-center gap-1.5 rounded-md bg-red-500/90 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-50"
              >
                {busyAction?.kind === "delete" && <Loader2 className="h-4 w-4 animate-spin" />}
                {busyAction?.kind === "delete" ? "Verwijderen..." : "Definitief verwijderen"}
              </button>
              <button
                type="button"
                onClick={archiveInsteadOfDelete}
                disabled={busyAction?.kind === "delete"}
                className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 hover:bg-amber-500/20 disabled:opacity-50"
              >
                <Archive className="h-4 w-4" /> Archiveer in plaats daarvan
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={busyAction?.kind === "delete"}
                className={secondaryBtn}
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
