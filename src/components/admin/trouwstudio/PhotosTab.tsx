"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  BookHeart,
  Loader2,
  RotateCcw,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  PHOTO_ISSUES,
  PHOTO_ISSUE_LABELS,
  PHOTO_STATUS_LABELS,
  SCENE_LABELS,
  WEDDING_SCENES,
  type PhotoIssue,
  type PhotoOrientation,
  type TrouwstudioSettings,
  type WeddingPhoto,
  type WeddingScene,
} from "@/features/trouwstudio/types";
import {
  analyzePhotosAction,
  bulkPhotoAction,
  updatePhotoAction,
  type BulkPhotoAction,
} from "@/lib/admin/trouwstudioActions";
import { PHOTO_STATUS_BADGE, inputClasses, type ProjectTabProps } from "./shared";

/* ========================= Uploadwachtrij ========================= */

type QueueStatus = "wachtend" | "bezig" | "klaar" | "fout" | "duplicaat";

type QueueItem = {
  id: string;
  file: File;
  status: QueueStatus;
  message?: string;
};

const QUEUE_STATUS_LABELS: Record<QueueStatus, string> = {
  wachtend: "Wachtend",
  bezig: "Bezig...",
  klaar: "Klaar",
  fout: "Fout",
  duplicaat: "Duplicaat (overgeslagen)",
};

const QUEUE_STATUS_COLORS: Record<QueueStatus, string> = {
  wachtend: "text-white/45",
  bezig: "text-sky-300",
  klaar: "text-emerald-300",
  fout: "text-red-300",
  duplicaat: "text-amber-300",
};

/* ========================= Filters ========================= */

type StatusChipId =
  | "alles"
  | "nog_niet"
  | "bezig"
  | "voorstel"
  | "goedgekeurd"
  | "handmatig"
  | "afgekeurd"
  | "favorieten"
  | "trouwboek"
  | "controle";

const STATUS_CHIPS: { id: StatusChipId; label: string; match: (p: WeddingPhoto) => boolean }[] = [
  { id: "alles", label: "Alles", match: () => true },
  {
    id: "nog_niet",
    label: "Nog niet geanalyseerd",
    match: (p) => p.status === "geupload" || p.status === "wacht_op_analyse",
  },
  { id: "bezig", label: "Analyse bezig", match: (p) => p.status === "wordt_geanalyseerd" },
  { id: "voorstel", label: "Voorstel beschikbaar", match: (p) => p.status === "voorstel_beschikbaar" },
  { id: "goedgekeurd", label: "Goedgekeurd", match: (p) => p.status === "goedgekeurd" },
  { id: "handmatig", label: "Handmatig aangepast", match: (p) => p.status === "handmatig_aangepast" },
  { id: "afgekeurd", label: "Afgekeurd", match: (p) => p.status === "afgekeurd" },
  { id: "favorieten", label: "Favorieten", match: (p) => p.favorite },
  { id: "trouwboek", label: "In trouwboek", match: (p) => p.selectedForAlbum },
  {
    id: "controle",
    label: "Controle nodig",
    match: (p) => Boolean(p.analysis?.reviewRequired) && p.status === "voorstel_beschikbaar",
  },
];

type IssueFilter = "alle" | PhotoIssue | "hoge_kwaliteit" | "lage_kwaliteit";

const ORIENTATION_LABELS: Record<PhotoOrientation, string> = {
  portrait: "Staand",
  landscape: "Liggend",
  square: "Vierkant",
};

const secondaryBtn =
  "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50";

export function PhotosTab(props: ProjectTabProps & { settings: TrouwstudioSettings }) {
  const { project, photos, setPhotos, openTab, settings } = props;
  const router = useRouter();

  /* ----- Uploadwachtrij (beperkte gelijktijdigheid + annuleren via AbortController) ----- */
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const queueRef = useRef<QueueItem[]>([]);
  const activeCountRef = useRef(0);
  const controllersRef = useRef<Map<string, AbortController>>(new Map());
  const idCounterRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const setQueueBoth = (updater: (prev: QueueItem[]) => QueueItem[]) => {
    queueRef.current = updater(queueRef.current);
    setQueue(queueRef.current);
  };

  const patchQueueItem = (id: string, patch: Partial<QueueItem>) => {
    setQueueBoth((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const startUpload = async (id: string) => {
    const item = queueRef.current.find((i) => i.id === id);
    if (!item || item.status !== "wachtend") return;
    activeCountRef.current += 1;
    const controller = new AbortController();
    controllersRef.current.set(id, controller);
    patchQueueItem(id, { status: "bezig", message: undefined });
    try {
      const body = new FormData();
      body.append("file", item.file);
      body.append("projectId", project.id);
      const res = await fetch("/api/admin/trouwstudio/upload/", {
        method: "POST",
        body,
        signal: controller.signal,
      });
      const data = (await res.json().catch(() => ({}))) as {
        photo?: WeddingPhoto;
        error?: string;
        duplicateOf?: string;
      };
      if (res.status === 409) {
        patchQueueItem(id, {
          status: "duplicaat",
          message: data.error ?? "Duplicaat: deze foto staat al in het project.",
        });
      } else if (!res.ok || !data.photo) {
        patchQueueItem(id, { status: "fout", message: data.error ?? "Upload mislukt." });
      } else {
        const photo = data.photo;
        setPhotos((prev) => [...prev, photo]);
        patchQueueItem(id, { status: "klaar", message: undefined });
      }
    } catch {
      if (controller.signal.aborted) {
        setQueueBoth((prev) => prev.filter((i) => i.id !== id));
      } else {
        patchQueueItem(id, { status: "fout", message: "Netwerkfout bij uploaden. Probeer opnieuw." });
      }
    } finally {
      controllersRef.current.delete(id);
      activeCountRef.current -= 1;
      pump();
    }
  };

  const pump = () => {
    const maxConcurrent = Math.max(1, settings.maxConcurrent || 2);
    while (activeCountRef.current < maxConcurrent) {
      const next = queueRef.current.find((i) => i.status === "wachtend");
      if (!next) break;
      void startUpload(next.id);
    }
    // Wachtrij klaar: serverdata (tellers, projectstatus) opnieuw ophalen.
    if (activeCountRef.current === 0 && !queueRef.current.some((i) => i.status === "wachtend")) {
      router.refresh();
    }
  };

  const addFiles = (files: FileList | File[]) => {
    const items: QueueItem[] = Array.from(files).map((file) => {
      idCounterRef.current += 1;
      return { id: `upl-${Date.now()}-${idCounterRef.current}`, file, status: "wachtend" as const };
    });
    if (items.length === 0) return;
    setQueueBoth((prev) => [...prev, ...items]);
    pump();
  };

  const cancelQueueItem = (item: QueueItem) => {
    if (item.status === "bezig") {
      controllersRef.current.get(item.id)?.abort();
    } else {
      setQueueBoth((prev) => prev.filter((i) => i.id !== item.id));
    }
  };

  const retryQueueItem = (item: QueueItem) => {
    patchQueueItem(item.id, { status: "wachtend", message: undefined });
    pump();
  };

  const clearFinished = () => {
    setQueueBoth((prev) => prev.filter((i) => i.status === "wachtend" || i.status === "bezig"));
  };

  /* ----- Filters ----- */
  const [statusChip, setStatusChip] = useState<StatusChipId>("alles");
  const [sceneFilter, setSceneFilter] = useState<"alle" | WeddingScene>("alle");
  const [orientationFilter, setOrientationFilter] = useState<"alle" | PhotoOrientation>("alle");
  const [issueFilter, setIssueFilter] = useState<IssueFilter>("alle");

  const filtered = useMemo(() => {
    const chip = STATUS_CHIPS.find((c) => c.id === statusChip) ?? STATUS_CHIPS[0];
    return photos.filter((p) => {
      if (!chip.match(p)) return false;
      if (sceneFilter !== "alle" && p.analysis?.scene !== sceneFilter) return false;
      if (orientationFilter !== "alle" && p.orientation !== orientationFilter) return false;
      if (issueFilter !== "alle") {
        if (issueFilter === "hoge_kwaliteit") {
          if (!p.analysis || p.analysis.qualityScore < 80) return false;
        } else if (issueFilter === "lage_kwaliteit") {
          if (!p.analysis || p.analysis.qualityScore >= 50) return false;
        } else if (!p.analysis?.detectedIssues.includes(issueFilter)) {
          return false;
        }
      }
      return true;
    });
  }, [photos, statusChip, sceneFilter, orientationFilter, issueFilter]);

  /* ----- Selectie + acties ----- */
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const selectedIds = useMemo(() => photos.filter((p) => selected.has(p.id)).map((p) => p.id), [photos, selected]);

  const [photoBusyId, setPhotoBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<{ done: number; total: number } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const anyBusy = bulkBusy !== null;

  const toggleSelect = (photoId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  };

  const togglePhotoFlag = async (photo: WeddingPhoto, patch: { favorite?: boolean; selectedForAlbum?: boolean }) => {
    setPhotoBusyId(photo.id);
    setActionError(null);
    setPhotos((prev) =>
      prev.map((p) => (p.id === photo.id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
    );
    const result = await updatePhotoAction(project.id, photo.id, patch);
    if (!result.ok) {
      // Terugdraaien bij fout.
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id ? { ...p, favorite: photo.favorite, selectedForAlbum: photo.selectedForAlbum } : p,
        ),
      );
      setActionError(result.error ?? "Opslaan mislukt.");
    }
    setPhotoBusyId(null);
  };

  const runBulk = async (action: BulkPhotoAction, applyLocal: (p: WeddingPhoto) => WeddingPhoto) => {
    if (selectedIds.length === 0) return;
    setBulkBusy(action);
    setActionError(null);
    const ids = new Set(selectedIds);
    const result = await bulkPhotoAction(project.id, selectedIds, action);
    if (result.ok) {
      if (action === "verwijderen") {
        setPhotos((prev) => prev.filter((p) => !ids.has(p.id)));
        setSelected(new Set());
      } else {
        setPhotos((prev) =>
          prev.map((p) => (ids.has(p.id) ? { ...applyLocal(p), updatedAt: new Date().toISOString() } : p)),
        );
      }
    } else {
      setActionError(result.error ?? "Bulkactie mislukt.");
    }
    setBulkBusy(null);
  };

  const startAnalysis = async () => {
    const ids = selectedIds;
    if (ids.length === 0) return;
    setBulkBusy("analyse");
    setActionError(null);
    setAnalysisProgress({ done: 0, total: ids.length });
    const batchSize = Math.max(1, settings.batchSize || 4);
    const allIds = new Set(ids);
    // Optimistisch: direct de analyse-status tonen.
    setPhotos((prev) => prev.map((p) => (allIds.has(p.id) ? { ...p, status: "wordt_geanalyseerd" } : p)));
    let failed = 0;
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const result = await analyzePhotosAction(project.id, batch);
      if (!result.ok) {
        setActionError(result.error ?? "Analyse mislukt.");
        break;
      }
      failed += result.data?.failed ?? 0;
      // Noot: we zetten de batch hier optimistisch op "voorstel_beschikbaar" zodat de
      // UI live aanvoelt; de router.refresh() hieronder haalt daarna de echte
      // analyse-resultaten (scores, scenes, voorstellen) van de server op en die
      // vervangen deze tijdelijke status via de props-sync in ProjectDetail.
      const batchSet = new Set(batch);
      setPhotos((prev) =>
        prev.map((p) =>
          batchSet.has(p.id) && p.status === "wordt_geanalyseerd" ? { ...p, status: "voorstel_beschikbaar" } : p,
        ),
      );
      setAnalysisProgress({ done: Math.min(i + batch.length, ids.length), total: ids.length });
    }
    router.refresh();
    if (failed > 0) setActionError(`Analyse afgerond, maar ${failed} foto('s) mislukt. Zie status "Fout".`);
    setAnalysisProgress(null);
    setBulkBusy(null);
  };

  const requestDelete = () => {
    if (settings.confirmBulkActions) setDeleteConfirmOpen(true);
    else void runBulk("verwijderen", (p) => p);
  };

  const chipCounts = useMemo(() => {
    const counts = new Map<StatusChipId, number>();
    for (const chip of STATUS_CHIPS) counts.set(chip.id, photos.filter(chip.match).length);
    return counts;
  }, [photos]);

  const queueActive = queue.filter((i) => i.status === "wachtend" || i.status === "bezig").length;

  return (
    <div className="flex flex-col gap-5">
      {/* ===== Uploadzone ===== */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-10 text-center transition-colors ${
          dragActive ? "border-amber-500/70 bg-amber-500/5" : "border-white/15 bg-white/[0.02] hover:bg-white/[0.04]"
        }`}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
          <Upload className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium text-white/80">Sleep foto&apos;s hierheen of klik om te selecteren</p>
        <p className="text-xs text-white/40">
          JPEG, PNG, WebP of HEIC/HEIF. RAW (CR2/CR3/NEF/ARW) volgt later; max 25 MB per foto.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* ===== Wachtrij ===== */}
      {queue.length > 0 && (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-white/60">
              Uploadwachtrij{queueActive > 0 ? ` (${queueActive} bezig/wachtend)` : ""}
            </span>
            <button type="button" onClick={clearFinished} className={secondaryBtn}>
              Wis afgehandelde
            </button>
          </div>
          <ul className="flex flex-col divide-y divide-white/5">
            {queue.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-1.5 text-sm">
                {item.status === "bezig" && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-sky-300" />}
                <span className="min-w-0 max-w-[45%] flex-1 truncate text-white/75">{item.file.name}</span>
                <span className={`shrink-0 text-xs font-medium ${QUEUE_STATUS_COLORS[item.status]}`}>
                  {QUEUE_STATUS_LABELS[item.status]}
                </span>
                {item.message && (
                  <span className={`text-xs ${item.status === "duplicaat" ? "text-amber-300/80" : "text-red-300/80"}`}>
                    {item.message}
                  </span>
                )}
                <span className="ml-auto flex shrink-0 gap-1.5">
                  {item.status === "fout" && (
                    <button type="button" onClick={() => retryQueueItem(item)} className={secondaryBtn}>
                      <RotateCcw className="h-3 w-3" /> Opnieuw
                    </button>
                  )}
                  {(item.status === "wachtend" || item.status === "bezig") && (
                    <button type="button" onClick={() => cancelQueueItem(item)} className={secondaryBtn}>
                      <X className="h-3 w-3" /> Annuleren
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ===== Filterbalk ===== */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setStatusChip(chip.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                statusChip === chip.id
                  ? "bg-amber-500/90 text-black"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {chip.label} ({chipCounts.get(chip.id) ?? 0})
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={sceneFilter}
            onChange={(e) => setSceneFilter(e.target.value as "alle" | WeddingScene)}
            className={`${inputClasses} w-auto`}
            aria-label="Filter op scène"
          >
            <option value="alle">Alle scènes</option>
            {WEDDING_SCENES.map((scene) => (
              <option key={scene} value={scene}>
                {SCENE_LABELS[scene]}
              </option>
            ))}
          </select>
          <select
            value={orientationFilter}
            onChange={(e) => setOrientationFilter(e.target.value as "alle" | PhotoOrientation)}
            className={`${inputClasses} w-auto`}
            aria-label="Filter op oriëntatie"
          >
            <option value="alle">Alle oriëntaties</option>
            {(Object.keys(ORIENTATION_LABELS) as PhotoOrientation[]).map((o) => (
              <option key={o} value={o}>
                {ORIENTATION_LABELS[o]}
              </option>
            ))}
          </select>
          <select
            value={issueFilter}
            onChange={(e) => setIssueFilter(e.target.value as IssueFilter)}
            className={`${inputClasses} w-auto`}
            aria-label="Filter op aandachtspunt"
          >
            <option value="alle">Alle aandachtspunten</option>
            {PHOTO_ISSUES.map((issue) => (
              <option key={issue} value={issue}>
                {PHOTO_ISSUE_LABELS[issue]}
              </option>
            ))}
            <option value="hoge_kwaliteit">Hoge kwaliteit (score 80+)</option>
            <option value="lage_kwaliteit">Lage kwaliteit (score onder 50)</option>
          </select>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => setSelected(new Set(filtered.map((p) => p.id)))}
              disabled={filtered.length === 0}
              className={secondaryBtn}
            >
              Selecteer alles (gefilterd)
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              disabled={selected.size === 0}
              className={secondaryBtn}
            >
              Deselecteer
            </button>
          </div>
        </div>
      </div>

      {actionError && <p className="text-sm text-red-400">{actionError}</p>}

      {/* ===== Fotoraster ===== */}
      {photos.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-white/50">
          Nog geen foto&apos;s in dit project. Upload hierboven de eerste foto&apos;s.
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-white/50">
          Geen foto&apos;s binnen deze filters.
        </div>
      ) : (
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))]">
          {filtered.map((photo) => {
            const checked = selected.has(photo.id);
            const flagBusy = photoBusyId === photo.id;
            const issues = photo.analysis?.detectedIssues ?? [];
            return (
              <div
                key={photo.id}
                className={`group relative flex flex-col overflow-hidden rounded-lg border bg-white/[0.03] ${
                  checked ? "border-amber-500/60" : "border-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => openTab("bewerken", photo.id)}
                  title="Openen in de editor"
                  className="relative block aspect-square w-full overflow-hidden bg-white/5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.thumbUrl}
                    alt={photo.filename}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                  />
                </button>

                {/* Selectie (linksboven) */}
                <label className="absolute left-1.5 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-black/60 backdrop-blur">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSelect(photo.id)}
                    aria-label="Selecteer foto"
                    className="h-3.5 w-3.5 accent-amber-500"
                  />
                </label>

                {/* Favoriet + trouwboek (rechtsboven) */}
                <div className="absolute right-1.5 top-1.5 flex gap-1">
                  <button
                    type="button"
                    onClick={() => togglePhotoFlag(photo, { favorite: !photo.favorite })}
                    disabled={flagBusy}
                    title={photo.favorite ? "Favoriet verwijderen" : "Als favoriet markeren"}
                    aria-label={photo.favorite ? "Favoriet verwijderen" : "Als favoriet markeren"}
                    className={`flex h-6 w-6 items-center justify-center rounded-full backdrop-blur disabled:opacity-50 ${
                      photo.favorite ? "bg-amber-500 text-black" : "bg-black/60 text-white/75 hover:text-amber-300"
                    }`}
                  >
                    <Star className="h-3.5 w-3.5" fill={photo.favorite ? "currentColor" : "none"} />
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePhotoFlag(photo, { selectedForAlbum: !photo.selectedForAlbum })}
                    disabled={flagBusy}
                    title={photo.selectedForAlbum ? "Uit trouwboek verwijderen" : "Aan trouwboek toevoegen"}
                    aria-label={photo.selectedForAlbum ? "Uit trouwboek verwijderen" : "Aan trouwboek toevoegen"}
                    className={`flex h-6 w-6 items-center justify-center rounded-full backdrop-blur disabled:opacity-50 ${
                      photo.selectedForAlbum
                        ? "bg-emerald-500 text-black"
                        : "bg-black/60 text-white/75 hover:text-emerald-300"
                    }`}
                  >
                    <BookHeart className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 p-2">
                  <div className="flex flex-wrap items-center gap-1">
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${PHOTO_STATUS_BADGE[photo.status]}`}
                    >
                      {PHOTO_STATUS_LABELS[photo.status]}
                    </span>
                    {photo.analysis && (
                      <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-white/60">
                        {SCENE_LABELS[photo.analysis.scene]}
                      </span>
                    )}
                    {photo.analysis && (
                      <span
                        title={`Kwaliteitsscore: ${Math.round(photo.analysis.qualityScore)}/100`}
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                          photo.analysis.qualityScore >= 80
                            ? "bg-emerald-500/15 text-emerald-300"
                            : photo.analysis.qualityScore < 50
                              ? "bg-red-500/15 text-red-300"
                              : "bg-white/10 text-white/60"
                        }`}
                      >
                        {Math.round(photo.analysis.qualityScore)}
                      </span>
                    )}
                    {issues.length > 0 && (
                      <span
                        title={issues.map((issue) => PHOTO_ISSUE_LABELS[issue]).join(", ")}
                        className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300"
                      >
                        <AlertTriangle className="h-2.5 w-2.5" />
                        {issues.length}
                      </span>
                    )}
                    {photo.adjustmentProposal && (
                      <span
                        title="AI-voorstel beschikbaar"
                        className="rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-bold text-violet-300"
                      >
                        AI
                      </span>
                    )}
                  </div>
                  <span className="truncate text-[11px] text-white/45" title={photo.filename}>
                    {photo.filename}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== Bulkbalk ===== */}
      {selectedIds.length > 0 && (
        <div className="sticky bottom-4 z-20 rounded-lg border border-white/15 bg-neutral-950/95 p-3 shadow-2xl backdrop-blur">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-semibold text-white/80">
              {selectedIds.length} geselecteerd
            </span>
            <button
              type="button"
              onClick={startAnalysis}
              disabled={anyBusy}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/90 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bulkBusy === "analyse" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {analysisProgress ? `Analyseren... ${analysisProgress.done}/${analysisProgress.total}` : "Analyse starten"}
            </button>
            <button
              type="button"
              onClick={() =>
                runBulk("voorstel_accepteren", (p) =>
                  p.adjustmentProposal
                    ? { ...p, appliedAdjustments: p.adjustmentProposal, adjustmentProposal: undefined, status: "goedgekeurd" }
                    : p,
                )
              }
              disabled={anyBusy}
              className={secondaryBtn}
            >
              {bulkBusy === "voorstel_accepteren" && <Loader2 className="h-3 w-3 animate-spin" />}
              Voorstellen accepteren
            </button>
            <button
              type="button"
              onClick={() =>
                runBulk("voorstel_weigeren", (p) => ({ ...p, adjustmentProposal: undefined, status: "geupload" }))
              }
              disabled={anyBusy}
              className={secondaryBtn}
            >
              {bulkBusy === "voorstel_weigeren" && <Loader2 className="h-3 w-3 animate-spin" />}
              Voorstellen weigeren
            </button>
            <button
              type="button"
              onClick={() => runBulk("favoriet", (p) => ({ ...p, favorite: true }))}
              disabled={anyBusy}
              className={secondaryBtn}
            >
              {bulkBusy === "favoriet" && <Loader2 className="h-3 w-3 animate-spin" />}
              <Star className="h-3 w-3" /> Favoriet maken
            </button>
            <button
              type="button"
              onClick={() => runBulk("album_toevoegen", (p) => ({ ...p, selectedForAlbum: true }))}
              disabled={anyBusy}
              className={secondaryBtn}
            >
              {bulkBusy === "album_toevoegen" && <Loader2 className="h-3 w-3 animate-spin" />}
              Aan trouwboek toevoegen
            </button>
            <button
              type="button"
              onClick={() => runBulk("album_verwijderen", (p) => ({ ...p, selectedForAlbum: false }))}
              disabled={anyBusy}
              className={secondaryBtn}
            >
              {bulkBusy === "album_verwijderen" && <Loader2 className="h-3 w-3 animate-spin" />}
              Uit trouwboek verwijderen
            </button>
            <button
              type="button"
              onClick={() => runBulk("goedkeuren", (p) => ({ ...p, status: "goedgekeurd" }))}
              disabled={anyBusy}
              className={secondaryBtn}
            >
              {bulkBusy === "goedkeuren" && <Loader2 className="h-3 w-3 animate-spin" />}
              Goedkeuren
            </button>
            <button
              type="button"
              onClick={() => runBulk("afkeuren", (p) => ({ ...p, status: "afgekeurd" }))}
              disabled={anyBusy}
              className={secondaryBtn}
            >
              {bulkBusy === "afkeuren" && <Loader2 className="h-3 w-3 animate-spin" />}
              Afkeuren
            </button>
            <button
              type="button"
              onClick={requestDelete}
              disabled={anyBusy}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bulkBusy === "verwijderen" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              Verwijderen
            </button>
          </div>
        </div>
      )}

      {/* ===== Bevestiging verwijderen ===== */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-neutral-950 p-6">
            <h2 className="text-lg font-semibold">Foto&apos;s definitief verwijderen?</h2>
            <p className="mt-2 text-sm text-white/60">
              Je verwijdert {selectedIds.length} foto(&apos;s) definitief uit dit project, inclusief originelen,
              analyses en bewerkingen. Dit kan niet ongedaan worden gemaakt.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  void runBulk("verwijderen", (p) => p);
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-red-500/90 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
              >
                <Trash2 className="h-4 w-4" /> Definitief verwijderen
              </button>
              <button type="button" onClick={() => setDeleteConfirmOpen(false)} className={secondaryBtn}>
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
