"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ClipboardPaste,
  Contrast,
  Copy,
  ExternalLink,
  Eye,
  FlipHorizontal2,
  ImageOff,
  Loader2,
  Redo2,
  RotateCcw,
  RotateCw,
  Save,
  Undo2,
  Wand2,
} from "lucide-react";
import {
  CROP_RATIOS,
  NEUTRAL_ADJUSTMENTS,
  PHOTO_ISSUE_LABELS,
  PHOTO_STATUS_LABELS,
  SCENE_LABELS,
  type CropConfiguration,
  type CropRatioId,
  type PhotoAdjustments,
  type TrouwstudioSettings,
  type WeddingPhoto,
  type WeddingPhotoStatus,
} from "@/features/trouwstudio/types";
import {
  adjustmentsToCssFilter,
  compositionTransform,
  vignetteShadow,
} from "@/features/trouwstudio/lib/cssPreview";
import {
  bulkPhotoAction,
  renderPhotoAction,
  resetPhotoAction,
  saveAdjustmentsAction,
} from "@/lib/admin/trouwstudioActions";
import { PHOTO_STATUS_BADGE, type ProjectTabProps } from "./shared";

// Niet-destructieve foto-editor: live CSS-preview van de instellingen,
// opslaan/renderen via de server actions. Het origineel blijft altijd bewaard.

/* ========================= Helpers en constanten ========================= */

type EditorSnapshot = {
  adjustments: PhotoAdjustments;
  crop: CropConfiguration | null;
};

const MAX_HISTORY = 50;

/** Module-scope klembord: blijft bestaan bij wisselen van foto of project. */
let editClipboard: EditorSnapshot | null = null;

/** Zelfde uitleg als GenerativeNotConfiguredProvider.unavailableReason (server-only module). */
const GENERATIVE_UNAVAILABLE =
  "Generatieve beeldbewerking (achtergrond uitbreiden, objecten verwijderen) is nog niet aangesloten. Zodra een beeldmodel is geconfigureerd in de Trouwstudio-instellingen wordt deze functie actief.";

const GENERATIVE_TOOLS = [
  "Slim uitsnijden",
  "Achtergrond uitbreiden",
  "Storend object verwijderen",
  "Horizon corrigeren",
  "Ruimte voor tekst maken",
  "Albumcovervoorstel",
] as const;

const ADJUSTMENT_KEYS = Object.keys(NEUTRAL_ADJUSTMENTS) as (keyof PhotoAdjustments)[];

type SliderDef = { key: keyof PhotoAdjustments; label: string };

const LIGHT_SLIDERS: SliderDef[] = [
  { key: "exposure", label: "Belichting" },
  { key: "contrast", label: "Contrast" },
  { key: "highlights", label: "Hooglichten" },
  { key: "shadows", label: "Schaduwen" },
  { key: "whites", label: "Witte tinten" },
  { key: "blacks", label: "Zwarte tinten" },
  { key: "gamma", label: "Gamma" },
];

const COLOR_SLIDERS: SliderDef[] = [
  { key: "temperature", label: "Temperatuur" },
  { key: "tint", label: "Tint" },
  { key: "vibrance", label: "Levendigheid" },
  { key: "saturation", label: "Verzadiging" },
];

const DETAIL_SLIDERS: SliderDef[] = [
  { key: "clarity", label: "Helderheid (clarity)" },
  { key: "texture", label: "Textuur" },
  { key: "sharpness", label: "Scherpte" },
  { key: "noiseReduction", label: "Ruisonderdrukking" },
  { key: "vignette", label: "Vignettering" },
  { key: "grain", label: "Korrel" },
];

const STATUS_DOT: Record<WeddingPhotoStatus, string> = {
  geupload: "bg-white/50",
  wacht_op_analyse: "bg-sky-400",
  wordt_geanalyseerd: "bg-sky-300",
  voorstel_beschikbaar: "bg-amber-400",
  goedgekeurd: "bg-emerald-400",
  handmatig_aangepast: "bg-violet-400",
  afgekeurd: "bg-red-400",
  afgewerkt: "bg-emerald-300",
  export_klaar: "bg-emerald-200",
  fout: "bg-red-500",
};

const toolbarBtn =
  "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/5";

const round4 = (value: number): number => Math.round(value * 10000) / 10000;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

function adjustmentsEqual(a: PhotoAdjustments, b: PhotoAdjustments): boolean {
  return ADJUSTMENT_KEYS.every((key) => a[key] === b[key]);
}

function cropEqual(a: CropConfiguration | null, b: CropConfiguration | null): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.ratioId === b.ratioId &&
    a.x === b.x &&
    a.y === b.y &&
    a.width === b.width &&
    a.height === b.height &&
    a.rotate === b.rotate &&
    a.flipHorizontal === b.flipHorizontal
  );
}

function fullFrameCrop(): CropConfiguration {
  return { ratioId: "vrij", x: 0, y: 0, width: 1, height: 1, rotate: 0, flipHorizontal: false };
}

/** Grootst mogelijke gecentreerde uitsnede voor een doelverhouding. */
function centeredCropFor(
  ratioId: CropRatioId,
  ratio: number,
  photo: Pick<WeddingPhoto, "width" | "height">,
  rotate: CropConfiguration["rotate"],
  flipHorizontal: boolean,
): CropConfiguration {
  const baseAspect = photo.width > 0 && photo.height > 0 ? photo.width / photo.height : 1;
  const aspect = rotate % 180 === 0 ? baseAspect : 1 / baseAspect;
  let width = 1;
  let height = 1;
  if (ratio >= aspect) {
    height = round4(aspect / ratio);
  } else {
    width = round4(ratio / aspect);
  }
  return {
    ratioId,
    x: round4((1 - width) / 2),
    y: round4((1 - height) / 2),
    width,
    height,
    rotate,
    flipHorizontal,
  };
}

/* ========================= Kleine componenten ========================= */

function AdjustmentSlider({
  label,
  value,
  min = -100,
  max = 100,
  unit = "",
  onChange,
  onPointerDown,
  onPointerUp,
  onReset,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  onChange: (value: number) => void;
  onPointerDown: () => void;
  onPointerUp: () => void;
  onReset: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onDoubleClick={onReset}
          title="Dubbelklik om deze waarde terug te zetten naar 0"
          className="cursor-default select-none text-left text-white/65"
        >
          {label}
        </button>
        <span className={`tabular-nums ${value !== 0 ? "text-amber-300" : "text-white/40"}`}>
          {value > 0 ? `+${value}` : value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label={label}
        className="mt-1 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-amber-500"
      />
    </div>
  );
}

function PanelSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-white/85 hover:text-white"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 text-white/40 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="flex flex-col gap-3 px-4 pb-4">{children}</div>}
    </section>
  );
}

/* ========================= EditorTab ========================= */

type SectionId = "licht" | "kleur" | "details" | "compositie" | "ai";

export function EditorTab({
  project,
  photos,
  setPhotos,
  openTab,
  editorPhotoId,
  settings,
}: ProjectTabProps & { settings: TrouwstudioSettings }) {
  const [selectedId, setSelectedId] = useState<string | null>(editorPhotoId);
  const [showRejected, setShowRejected] = useState(false);
  const [adjustments, setAdjustments] = useState<PhotoAdjustments>({ ...NEUTRAL_ADJUSTMENTS });
  const [crop, setCrop] = useState<CropConfiguration | null>(null);
  const [undoStack, setUndoStack] = useState<EditorSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<EditorSnapshot[]>([]);
  const [zoom, setZoom] = useState<number>(100);
  const [showOriginal, setShowOriginal] = useState(false);
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    licht: true,
    kleur: true,
    details: true,
    compositie: true,
    ai: true,
  });
  const [busy, setBusy] = useState<"opslaan" | "afwerken" | "voorstel" | "origineel" | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [, setClipboardTick] = useState(0);

  const pendingSnapshot = useRef<EditorSnapshot | null>(null);
  const flashTimer = useRef<number | null>(null);
  const photosRef = useRef(photos);
  photosRef.current = photos;

  const visiblePhotos = showRejected ? photos : photos.filter((p) => p.status !== "afgekeurd");
  const selectedPhoto: WeddingPhoto | null =
    photos.find((p) => p.id === selectedId) ?? visiblePhotos[0] ?? photos[0] ?? null;
  const selectedPhotoId = selectedPhoto?.id ?? null;

  /* ----- Effects ----- */

  useEffect(() => {
    if (editorPhotoId) setSelectedId(editorPhotoId);
  }, [editorPhotoId]);

  useEffect(() => {
    if (!selectedPhotoId) return;
    const photo = photosRef.current.find((p) => p.id === selectedPhotoId);
    if (!photo) return;
    setAdjustments(
      photo.appliedAdjustments
        ? { ...NEUTRAL_ADJUSTMENTS, ...photo.appliedAdjustments }
        : { ...NEUTRAL_ADJUSTMENTS },
    );
    setCrop(photo.crop ? { ...photo.crop } : null);
    setUndoStack([]);
    setRedoStack([]);
    setActionError(null);
    setRenderError(null);
    setConfirmReset(false);
    setSavedFlash(false);
    setShowOriginal(false);
    pendingSnapshot.current = null;
  }, [selectedPhotoId]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const target = event.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable) {
          return;
        }
      }
      const list = showRejected
        ? photosRef.current
        : photosRef.current.filter((p) => p.status !== "afgekeurd");
      if (list.length === 0) return;
      const currentIndex = list.findIndex((p) => p.id === selectedPhotoId);
      const delta = event.key === "ArrowLeft" ? -1 : 1;
      const nextIndex =
        currentIndex === -1 ? 0 : clamp(currentIndex + delta, 0, list.length - 1);
      const next = list[nextIndex];
      if (next && next.id !== selectedPhotoId) {
        event.preventDefault();
        setSelectedId(next.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedPhotoId, showRejected]);

  useEffect(
    () => () => {
      if (flashTimer.current !== null) window.clearTimeout(flashTimer.current);
    },
    [],
  );

  /* ----- Afgeleide waarden ----- */

  const savedAdjustments: PhotoAdjustments = selectedPhoto?.appliedAdjustments
    ? { ...NEUTRAL_ADJUSTMENTS, ...selectedPhoto.appliedAdjustments }
    : { ...NEUTRAL_ADJUSTMENTS };
  const savedCrop: CropConfiguration | null = selectedPhoto?.crop ?? null;
  const dirty =
    selectedPhoto !== null &&
    (!adjustmentsEqual(adjustments, savedAdjustments) || !cropEqual(crop, savedCrop));

  const proposalSource: PhotoAdjustments | null =
    selectedPhoto?.analysis?.adjustmentProposal ?? selectedPhoto?.adjustmentProposal ?? null;

  /* ----- Undo/redo ----- */

  const snapshot = (): EditorSnapshot => ({
    adjustments: { ...adjustments },
    crop: crop ? { ...crop } : null,
  });

  const capStack = (stack: EditorSnapshot[]): EditorSnapshot[] =>
    stack.length > MAX_HISTORY ? stack.slice(stack.length - MAX_HISTORY) : stack;

  const pushUndo = () => {
    const snap = snapshot();
    setUndoStack((prev) => capStack([...prev, snap]));
    setRedoStack([]);
  };

  /** Zet een gecommitteerde wijziging: eerst huidige staat naar de undo-stapel. */
  const applyCommitted = (next: { adjustments?: PhotoAdjustments; crop?: CropConfiguration | null }) => {
    pushUndo();
    if (next.adjustments !== undefined) setAdjustments(next.adjustments);
    if (next.crop !== undefined) setCrop(next.crop);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const snap = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, -1));
    setRedoStack(capStack([...redoStack, snapshot()]));
    setAdjustments(snap.adjustments);
    setCrop(snap.crop);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const snap = redoStack[redoStack.length - 1];
    setRedoStack(redoStack.slice(0, -1));
    setUndoStack(capStack([...undoStack, snapshot()]));
    setAdjustments(snap.adjustments);
    setCrop(snap.crop);
  };

  /* ----- Sliders ----- */

  const beginSlider = () => {
    pendingSnapshot.current = snapshot();
  };

  const endSlider = () => {
    const before = pendingSnapshot.current;
    pendingSnapshot.current = null;
    if (!before) return;
    if (adjustmentsEqual(before.adjustments, adjustments) && cropEqual(before.crop, crop)) return;
    setUndoStack((prev) => capStack([...prev, before]));
    setRedoStack([]);
  };

  const setParam = (key: keyof PhotoAdjustments, value: number) =>
    setAdjustments((prev) => ({ ...prev, [key]: value }));

  const resetParam = (key: keyof PhotoAdjustments) => {
    if (adjustments[key] === 0) return;
    applyCommitted({ adjustments: { ...adjustments, [key]: 0 } });
  };

  /* ----- Compositie ----- */

  const rotateBy = (delta: 90 | 270) => {
    if (!selectedPhoto) return;
    const current = crop ?? fullFrameCrop();
    const nextRotate = ((current.rotate + delta) % 360) as CropConfiguration["rotate"];
    const def = CROP_RATIOS.find((r) => r.id === current.ratioId);
    const next: CropConfiguration =
      def && def.ratio !== null
        ? centeredCropFor(current.ratioId, def.ratio, selectedPhoto, nextRotate, current.flipHorizontal)
        : { ...current, rotate: nextRotate };
    applyCommitted({ crop: next });
  };

  const toggleFlip = () => {
    const current = crop ?? fullFrameCrop();
    applyCommitted({ crop: { ...current, flipHorizontal: !current.flipHorizontal } });
  };

  const selectRatio = (ratioId: CropRatioId) => {
    if (!selectedPhoto) return;
    const def = CROP_RATIOS.find((r) => r.id === ratioId);
    if (!def) return;
    if (def.ratio === null) {
      applyCommitted({ crop: null });
      return;
    }
    applyCommitted({
      crop: centeredCropFor(
        ratioId,
        def.ratio,
        selectedPhoto,
        crop?.rotate ?? 0,
        crop?.flipHorizontal ?? false,
      ),
    });
  };

  const canNudge = crop !== null && (crop.width < 0.999 || crop.height < 0.999);

  const nudgeCrop = (dx: number, dy: number) => {
    if (!crop) return;
    const x = round4(clamp(crop.x + dx, 0, Math.max(0, 1 - crop.width)));
    const y = round4(clamp(crop.y + dy, 0, Math.max(0, 1 - crop.height)));
    if (x === crop.x && y === crop.y) return;
    applyCommitted({ crop: { ...crop, x, y } });
  };

  /* ----- AI-tools ----- */

  const applyProposal = () => {
    if (!proposalSource) return;
    applyCommitted({ adjustments: { ...NEUTRAL_ADJUSTMENTS, ...proposalSource } });
  };

  const applyBlackWhite = () => {
    applyCommitted({ adjustments: { ...adjustments, saturation: -100, contrast: 12, clarity: 10 } });
  };

  /* ----- Kopiëren / plakken ----- */

  const copyEdit = () => {
    editClipboard = snapshot();
    setClipboardTick((tick) => tick + 1);
  };

  const pasteEdit = () => {
    if (!editClipboard) return;
    applyCommitted({
      adjustments: { ...editClipboard.adjustments },
      crop: editClipboard.crop ? { ...editClipboard.crop } : null,
    });
  };

  /* ----- Server acties ----- */

  const patchPhoto = (photoId: string, patch: Partial<WeddingPhoto>) => {
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, ...patch } : p)));
  };

  const handleSave = async (): Promise<boolean> => {
    if (!selectedPhoto) return false;
    setBusy("opslaan");
    setActionError(null);
    const result = await saveAdjustmentsAction(project.id, selectedPhoto.id, adjustments, crop);
    setBusy(null);
    if (!result.ok) {
      setActionError(result.error ?? "Opslaan mislukt.");
      return false;
    }
    patchPhoto(selectedPhoto.id, {
      appliedAdjustments: { ...adjustments },
      crop: crop ? { ...crop } : undefined,
      status: "handmatig_aangepast",
    });
    setSavedFlash(true);
    if (flashTimer.current !== null) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setSavedFlash(false), 2500);
    return true;
  };

  const handleRender = async () => {
    if (!selectedPhoto) return;
    setRenderError(null);
    if (dirty) {
      const saved = await handleSave();
      if (!saved) return;
    }
    setBusy("afwerken");
    const result = await renderPhotoAction(project.id, selectedPhoto.id);
    setBusy(null);
    if (!result.ok || !result.data) {
      setRenderError(result.error ?? "Renderen mislukt. Probeer het opnieuw.");
      return;
    }
    patchPhoto(selectedPhoto.id, { processedUrl: result.data.processedUrl, status: "afgewerkt" });
  };

  const handleResetOriginal = async () => {
    if (!selectedPhoto) return;
    setBusy("origineel");
    setActionError(null);
    const result = await resetPhotoAction(project.id, selectedPhoto.id);
    setBusy(null);
    setConfirmReset(false);
    if (!result.ok) {
      setActionError(result.error ?? "Terugzetten mislukt.");
      return;
    }
    patchPhoto(selectedPhoto.id, {
      appliedAdjustments: undefined,
      adjustmentProposal: undefined,
      crop: undefined,
      processedUrl: undefined,
      status: "geupload",
    });
    setAdjustments({ ...NEUTRAL_ADJUSTMENTS });
    setCrop(null);
    setUndoStack([]);
    setRedoStack([]);
  };

  const handleAcceptProposal = async () => {
    if (!selectedPhoto?.adjustmentProposal) return;
    const proposal: PhotoAdjustments = { ...NEUTRAL_ADJUSTMENTS, ...selectedPhoto.adjustmentProposal };
    setBusy("voorstel");
    setActionError(null);
    const result = await bulkPhotoAction(project.id, [selectedPhoto.id], "voorstel_accepteren");
    setBusy(null);
    if (!result.ok) {
      setActionError(result.error ?? "Voorstel accepteren mislukt.");
      return;
    }
    pushUndo();
    setAdjustments(proposal);
    patchPhoto(selectedPhoto.id, {
      appliedAdjustments: proposal,
      adjustmentProposal: undefined,
      status: "goedgekeurd",
    });
  };

  const handleRejectProposal = async () => {
    if (!selectedPhoto?.adjustmentProposal) return;
    setBusy("voorstel");
    setActionError(null);
    const result = await bulkPhotoAction(project.id, [selectedPhoto.id], "voorstel_weigeren");
    setBusy(null);
    if (!result.ok) {
      setActionError(result.error ?? "Voorstel weigeren mislukt.");
      return;
    }
    patchPhoto(selectedPhoto.id, { adjustmentProposal: undefined, status: "geupload" });
  };

  const resetToSaved = () => {
    if (!dirty) return;
    applyCommitted({
      adjustments: savedAdjustments,
      crop: savedCrop ? { ...savedCrop } : null,
    });
  };

  const toggleSection = (id: SectionId) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  /* ----- Lege staat ----- */

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <ImageOff className="h-8 w-8 text-white/25" />
        <div>
          <p className="text-sm font-semibold text-white/85">Voeg eerst foto&apos;s toe</p>
          <p className="mt-1 text-sm text-white/50">
            Dit project bevat nog geen foto&apos;s om te bewerken.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openTab("fotos")}
          className="rounded-md bg-amber-500/90 px-5 py-2.5 text-sm font-semibold text-black hover:bg-amber-400"
        >
          Naar Foto&apos;s
        </button>
      </div>
    );
  }

  if (!selectedPhoto) return null;

  const vignette = showOriginal ? undefined : vignetteShadow(adjustments);
  const showCropOverlay =
    !showOriginal && crop !== null && (crop.width < 0.999 || crop.height < 0.999);
  const activeRatioId: CropRatioId = crop?.ratioId ?? "vrij";
  const holdHandlers = {
    onPointerDown: () => setShowOriginal(true),
    onPointerUp: () => setShowOriginal(false),
    onPointerLeave: () => setShowOriginal(false),
    onPointerCancel: () => setShowOriginal(false),
    onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      {/* ===== Fotostrip ===== */}
      <aside className="w-full shrink-0 lg:w-56">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/40">
            Foto&apos;s ({visiblePhotos.length})
          </span>
          <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-white/50">
            <input
              type="checkbox"
              checked={showRejected}
              onChange={(event) => setShowRejected(event.target.checked)}
              className="h-3.5 w-3.5 accent-amber-500"
            />
            Afgekeurde tonen
          </label>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:max-h-[70vh] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 lg:pr-1">
          {visiblePhotos.map((photo) => {
            const active = photo.id === selectedPhoto.id;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedId(photo.id)}
                title={`${photo.filename} (${PHOTO_STATUS_LABELS[photo.status]})`}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border transition-colors lg:h-24 lg:w-full ${
                  active
                    ? "border-amber-500 ring-1 ring-amber-500/60"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.thumbUrl}
                  alt={photo.filename}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span
                  className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-1 ring-black/50 ${STATUS_DOT[photo.status]}`}
                  title={PHOTO_STATUS_LABELS[photo.status]}
                />
              </button>
            );
          })}
          {visiblePhotos.length === 0 && (
            <p className="py-2 text-xs text-white/40">
              Alle foto&apos;s zijn afgekeurd. Zet &quot;Afgekeurde tonen&quot; aan om ze te bekijken.
            </p>
          )}
        </div>
      </aside>

      {/* ===== Preview ===== */}
      <div className="min-w-0 flex-1">
        {/* Toolbar */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={undoStack.length === 0}
            title={undoStack.length === 0 ? "Niets om ongedaan te maken" : "Ongedaan maken"}
            className={toolbarBtn}
          >
            <Undo2 className="h-3.5 w-3.5" />
            Ongedaan maken
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={redoStack.length === 0}
            title={redoStack.length === 0 ? "Niets om opnieuw uit te voeren" : "Opnieuw"}
            className={toolbarBtn}
          >
            <Redo2 className="h-3.5 w-3.5" />
            Opnieuw
          </button>
          <span className="h-5 w-px bg-white/10" />
          <button
            type="button"
            onClick={copyEdit}
            title="Kopieer de huidige bewerking (instellingen en uitsnede)"
            className={toolbarBtn}
          >
            <Copy className="h-3.5 w-3.5" />
            Bewerking kopiëren
          </button>
          <button
            type="button"
            onClick={pasteEdit}
            disabled={editClipboard === null}
            title={
              editClipboard === null
                ? "Nog geen bewerking gekopieerd"
                : "Plak de gekopieerde bewerking op deze foto"
            }
            className={toolbarBtn}
          >
            <ClipboardPaste className="h-3.5 w-3.5" />
            Plakken
          </button>
          <span className="h-5 w-px bg-white/10" />
          <button
            type="button"
            onClick={resetToSaved}
            disabled={!dirty}
            title={
              dirty
                ? "Zet de schuifregelaars terug naar de laatst opgeslagen waarden"
                : "Geen niet-opgeslagen wijzigingen"
            }
            className={toolbarBtn}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            disabled={busy !== null}
            title="Verwijder alle bewerkingen van deze foto (het origineel blijft bewaard)"
            className={toolbarBtn}
          >
            <ImageOff className="h-3.5 w-3.5" />
            Terug naar origineel
          </button>
          <div className="ml-auto flex items-center gap-2">
            {savedFlash && <span className="text-xs font-medium text-emerald-400">Opgeslagen</span>}
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={!dirty || busy !== null}
              title={dirty ? "Bewerking opslaan" : "Geen niet-opgeslagen wijzigingen"}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/90 px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy === "opslaan" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Opslaan
            </button>
            <button
              type="button"
              onClick={() => void handleRender()}
              disabled={busy !== null}
              title="Slaat eerst op indien nodig en rendert daarna het definitieve beeld server-side"
              className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy === "afwerken" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Afwerken
            </button>
          </div>
        </div>

        {/* Meldingen */}
        {confirmReset && (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            <span>
              Alle bewerkingen, het AI-voorstel en de afgewerkte versie van deze foto worden
              verwijderd. Het origineel blijft altijd bewaard. Doorgaan?
            </span>
            <button
              type="button"
              onClick={() => void handleResetOriginal()}
              disabled={busy !== null}
              className="rounded border border-red-400/40 px-2.5 py-1 font-semibold hover:bg-red-500/15 disabled:opacity-50"
            >
              {busy === "origineel" ? "Bezig..." : "Ja, terugzetten"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded border border-white/15 px-2.5 py-1 text-white/70 hover:bg-white/5"
            >
              Annuleren
            </button>
          </div>
        )}
        {actionError && (
          <p className="mb-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {actionError}
          </p>
        )}
        {renderError && (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            <span>{renderError}</span>
            <button
              type="button"
              onClick={() => void handleRender()}
              disabled={busy !== null}
              className="rounded border border-red-400/40 px-2.5 py-1 font-semibold hover:bg-red-500/15 disabled:opacity-50"
            >
              Opnieuw proberen
            </button>
          </div>
        )}

        {/* AI-voorstel banner */}
        {selectedPhoto.adjustmentProposal && (
          <div className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-amber-300">AI-voorstel beschikbaar</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={applyProposal}
                  title="Laad het voorstel in de schuifregelaars zonder het te accepteren"
                  className={toolbarBtn}
                >
                  Bekijk voorstel
                </button>
                <button
                  type="button"
                  onClick={() => void handleAcceptProposal()}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/90 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy === "voorstel" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  Accepteren
                </button>
                <button
                  type="button"
                  onClick={() => void handleRejectProposal()}
                  disabled={busy !== null}
                  className={toolbarBtn}
                >
                  Weigeren
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fotokop */}
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-white/50">
          <span className="max-w-[280px] truncate font-medium text-white/80" title={selectedPhoto.filename}>
            {selectedPhoto.filename}
          </span>
          <span>
            {selectedPhoto.width} × {selectedPhoto.height} px
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${PHOTO_STATUS_BADGE[selectedPhoto.status]}`}
          >
            {PHOTO_STATUS_LABELS[selectedPhoto.status]}
          </span>
          {dirty && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
              Niet opgeslagen
            </span>
          )}
        </div>

        {/* Previewvak */}
        <div className="relative flex h-[380px] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] lg:h-[520px]">
          <div className="max-w-full transition-transform" style={{ transform: `scale(${zoom / 100})` }}>
            <div className="relative inline-block max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.previewUrl}
                alt={selectedPhoto.filename}
                draggable={false}
                className="block max-h-[340px] max-w-full select-none lg:max-h-[480px]"
                style={
                  showOriginal
                    ? undefined
                    : {
                        filter: adjustmentsToCssFilter(adjustments),
                        transform: compositionTransform(adjustments, crop ?? undefined),
                      }
                }
              />
              {vignette && (
                <div className="pointer-events-none absolute inset-0" style={{ boxShadow: vignette }} />
              )}
              {showCropOverlay && crop && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div
                    className="absolute border-2 border-amber-400/90"
                    style={{
                      left: `${crop.x * 100}%`,
                      top: `${crop.y * 100}%`,
                      width: `${crop.width * 100}%`,
                      height: `${crop.height * 100}%`,
                      boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                    }}
                  />
                </div>
              )}
              {showOriginal && (
                <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/80">
                  Origineel
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Previewbediening */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            {...holdHandlers}
            title="Houd ingedrukt om het onbewerkte origineel te zien"
            className={`${toolbarBtn} touch-none select-none ${showOriginal ? "border-amber-500/50 bg-amber-500/10 text-amber-300" : ""}`}
          >
            <Eye className="h-3.5 w-3.5" />
            Voor/na (ingedrukt houden)
          </button>
          <div className="flex items-center gap-1" role="group" aria-label="Zoomniveau">
            {[50, 100, 200].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setZoom(level)}
                title={`Zoom ${level}%`}
                className={`rounded-md border px-2 py-1 text-[11px] font-medium ${
                  zoom === level
                    ? "border-amber-500/60 bg-amber-500/15 text-amber-300"
                    : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {level}%
              </button>
            ))}
          </div>
          {selectedPhoto.processedUrl && (
            <a
              href={selectedPhoto.processedUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 underline-offset-2 hover:underline"
            >
              Bekijk afgewerkte versie
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <p className="mt-2 text-[11px] text-white/40">
          {"Preview is een benadering; 'Afwerken' rendert het definitieve beeld server-side."}
        </p>
      </div>

      {/* ===== Bedieningspaneel ===== */}
      <aside className="flex w-full shrink-0 flex-col gap-3 lg:max-h-[80vh] lg:w-80 lg:overflow-y-auto lg:pr-1">
        {/* Analysekaart */}
        {selectedPhoto.analysis && (
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-white/85">AI-analyse</span>
              <div className="flex items-center gap-1.5">
                {selectedPhoto.analysis.provider === "mock" && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                    Demonstratiemodus
                  </span>
                )}
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/70">
                  {selectedPhoto.analysis.qualityScore}/100
                </span>
              </div>
            </div>
            <p className="mt-1 text-[11px] text-white/45">
              Scène: {SCENE_LABELS[selectedPhoto.analysis.scene]}
            </p>
            {selectedPhoto.analysis.detectedIssues.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedPhoto.analysis.detectedIssues.map((issue) => (
                  <span
                    key={issue}
                    className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-medium text-red-300"
                  >
                    {PHOTO_ISSUE_LABELS[issue]}
                  </span>
                ))}
              </div>
            )}
            {selectedPhoto.analysis.strengths.length > 0 && (
              <ul className="mt-2 list-disc pl-4 text-[11px] text-white/55">
                {selectedPhoto.analysis.strengths.map((strength) => (
                  <li key={strength}>{strength}</li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-[11px] leading-relaxed text-white/55">
              {selectedPhoto.analysis.provider === "mock" ? "Demonstratiemodus: " : ""}
              {selectedPhoto.analysis.summary}
            </p>
          </div>
        )}

        {/* Licht */}
        <PanelSection title="Licht" open={openSections.licht} onToggle={() => toggleSection("licht")}>
          {LIGHT_SLIDERS.map((def) => (
            <AdjustmentSlider
              key={def.key}
              label={def.label}
              value={adjustments[def.key]}
              onChange={(value) => setParam(def.key, value)}
              onPointerDown={beginSlider}
              onPointerUp={endSlider}
              onReset={() => resetParam(def.key)}
            />
          ))}
        </PanelSection>

        {/* Kleur */}
        <PanelSection title="Kleur" open={openSections.kleur} onToggle={() => toggleSection("kleur")}>
          {COLOR_SLIDERS.map((def) => (
            <AdjustmentSlider
              key={def.key}
              label={def.label}
              value={adjustments[def.key]}
              onChange={(value) => setParam(def.key, value)}
              onPointerDown={beginSlider}
              onPointerUp={endSlider}
              onReset={() => resetParam(def.key)}
            />
          ))}
        </PanelSection>

        {/* Details */}
        <PanelSection title="Details" open={openSections.details} onToggle={() => toggleSection("details")}>
          {DETAIL_SLIDERS.map((def) => (
            <AdjustmentSlider
              key={def.key}
              label={def.label}
              value={adjustments[def.key]}
              onChange={(value) => setParam(def.key, value)}
              onPointerDown={beginSlider}
              onPointerUp={endSlider}
              onReset={() => resetParam(def.key)}
            />
          ))}
        </PanelSection>

        {/* Compositie */}
        <PanelSection
          title="Compositie"
          open={openSections.compositie}
          onToggle={() => toggleSection("compositie")}
        >
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => rotateBy(270)}
              title="90 graden linksom draaien"
              className={toolbarBtn}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Roteren links
            </button>
            <button
              type="button"
              onClick={() => rotateBy(90)}
              title="90 graden rechtsom draaien"
              className={toolbarBtn}
            >
              <RotateCw className="h-3.5 w-3.5" />
              Roteren rechts
            </button>
            <button
              type="button"
              onClick={toggleFlip}
              title="Horizontaal spiegelen"
              aria-pressed={crop?.flipHorizontal ?? false}
              className={`${toolbarBtn} ${crop?.flipHorizontal ? "border-amber-500/50 bg-amber-500/10 text-amber-300" : ""}`}
            >
              <FlipHorizontal2 className="h-3.5 w-3.5" />
              Spiegelen
            </button>
          </div>
          <AdjustmentSlider
            label="Rechtzetten"
            value={adjustments.straighten}
            min={-15}
            max={15}
            unit="°"
            onChange={(value) => setParam("straighten", value)}
            onPointerDown={beginSlider}
            onPointerUp={endSlider}
            onReset={() => resetParam("straighten")}
          />
          <div>
            <p className="mb-1.5 text-xs text-white/65">Uitsnedeverhouding</p>
            <div className="flex flex-wrap gap-1.5">
              {CROP_RATIOS.map((ratioDef) => (
                <button
                  key={ratioDef.id}
                  type="button"
                  onClick={() => selectRatio(ratioDef.id)}
                  className={`rounded-md border px-2 py-1 text-[11px] font-medium ${
                    activeRatioId === ratioDef.id
                      ? "border-amber-500/60 bg-amber-500/15 text-amber-300"
                      : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10"
                  }`}
                >
                  {ratioDef.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs text-white/65">Uitsnede verschuiven</p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => nudgeCrop(-0.02, 0)}
                disabled={!canNudge}
                title={canNudge ? "Uitsnede naar links" : "Kies eerst een uitsnedeverhouding"}
                className={toolbarBtn}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => nudgeCrop(0, -0.02)}
                disabled={!canNudge}
                title={canNudge ? "Uitsnede omhoog" : "Kies eerst een uitsnedeverhouding"}
                className={toolbarBtn}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => nudgeCrop(0, 0.02)}
                disabled={!canNudge}
                title={canNudge ? "Uitsnede omlaag" : "Kies eerst een uitsnedeverhouding"}
                className={toolbarBtn}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => nudgeCrop(0.02, 0)}
                disabled={!canNudge}
                title={canNudge ? "Uitsnede naar rechts" : "Kies eerst een uitsnedeverhouding"}
                className={toolbarBtn}
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </PanelSection>

        {/* AI-tools */}
        <PanelSection title="AI-tools" open={openSections.ai} onToggle={() => toggleSection("ai")}>
          <button
            type="button"
            onClick={applyProposal}
            disabled={!proposalSource}
            title={
              proposalSource
                ? "Laad het AI-voorstel in de schuifregelaars"
                : "Analyseer deze foto eerst"
            }
            className={toolbarBtn}
          >
            <Wand2 className="h-3.5 w-3.5" />
            Slim optimaliseren
          </button>
          <button
            type="button"
            onClick={applyBlackWhite}
            title="Zet een zwart-witbewerking klaar (verzadiging -100, contrast +12, helderheid +10)"
            className={toolbarBtn}
          >
            <Contrast className="h-3.5 w-3.5" />
            Zwart-witvoorstel
          </button>
          <p className="text-[11px] text-white/40">
            AI-provider:{" "}
            {settings.aiProvider === "mock"
              ? "Demonstratiemodus (mock)"
              : `Claude (${settings.analysisModel})`}
          </p>
          <div className="border-t border-white/10 pt-3">
            <p className="text-[11px] leading-relaxed text-amber-300/90">
              Generatieve bewerkingen kunnen nieuwe beeldinhoud creëren en vereisen altijd
              expliciete goedkeuring.
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              {GENERATIVE_TOOLS.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  disabled
                  title={GENERATIVE_UNAVAILABLE}
                  className="cursor-not-allowed rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-left text-xs font-medium text-white/80 opacity-50"
                >
                  {tool}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-white/40">{GENERATIVE_UNAVAILABLE}</p>
          </div>
        </PanelSection>
      </aside>
    </div>
  );
}
