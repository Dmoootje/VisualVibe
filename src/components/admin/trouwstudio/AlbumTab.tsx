"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  FileDown,
  ImageOff,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  WEDDING_ALBUM_TEMPLATES,
  getAlbumTemplate,
  getLayoutDefinition,
} from "@/features/trouwstudio/templates/ivoryEditorial";
import { DEFAULT_CHAPTERS } from "@/features/trouwstudio/lib/autoLayout";
import { generateAlbumAction, saveAlbumAction } from "@/lib/admin/trouwstudioActions";
import {
  coupleName,
  type AlbumTextBlock,
  type WeddingAlbum,
  type WeddingAlbumChapter,
  type WeddingAlbumPage,
  type WeddingAlbumTemplate,
  type WeddingPhoto,
} from "@/features/trouwstudio/types";
import { inputClasses, type ProjectTabProps } from "./shared";

// Trouwboek-tab: zonder album een wizard in vijf stappen die het album laat
// genereren; met album een volwaardige builder (paginalijst, paginapreview,
// kader- en tekstbewerking) die via saveAlbumAction bewaart.

const ROLE_LABELS: Record<AlbumTextBlock["role"], string> = {
  title: "Titel",
  subtitle: "Ondertitel",
  body: "Tekst",
  quote: "Quote",
  caption: "Bijschrift",
  meta: "Kleine regel (meta)",
};

const STATUS_OPTIONS: { value: WeddingAlbum["status"]; label: string }[] = [
  { value: "draft", label: "Concept" },
  { value: "review", label: "Controle" },
  { value: "ready", label: "Klaar" },
];

const iconButtonClasses =
  "inline-flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-white/5 text-white/60 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

export function AlbumTab(props: ProjectTabProps) {
  if (!props.album) return <AlbumWizard {...props} />;
  return <AlbumBuilder {...props} album={props.album} />;
}

/* ========================= Wizard ========================= */

const WIZARD_STEPS = [
  { step: 1, label: "Gegevens" },
  { step: 2, label: "Template" },
  { step: 3, label: "Verhaal" },
  { step: 4, label: "Foto's" },
  { step: 5, label: "Genereren" },
] as const;

function AlbumWizard({ project, photos, openTab }: ProjectTabProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(() => coupleName(project));
  const [subtitle, setSubtitle] = useState("");
  const [quote, setQuote] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [foreword, setForeword] = useState("");
  const [templateId, setTemplateId] = useState("ivory-editorial");
  const [chapters, setChapters] = useState<WeddingAlbumChapter[]>(() =>
    DEFAULT_CHAPTERS.map((entry) => ({
      id: crypto.randomUUID(),
      title: entry.title,
      scene: entry.scene,
      hidden: false,
    })),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const selection = photos.filter((photo) => photo.selectedForAlbum);
  const selectedTemplate = getAlbumTemplate(templateId);

  const stepValid = (value: number): boolean => {
    if (value === 1) return title.trim().length > 0;
    if (value === 2) return selectedTemplate.available;
    if (value === 3) return chapters.some((chapter) => !chapter.hidden);
    return true;
  };

  const stepHint = (value: number): string | null => {
    if (value === 1 && !stepValid(1)) return "Vul minstens de albumtitel in.";
    if (value === 3 && !stepValid(3)) return "Houd minstens een zichtbaar hoofdstuk over.";
    return null;
  };

  const moveChapter = (index: number, delta: -1 | 1) => {
    setChapters((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const generate = async () => {
    setBusy(true);
    setError(null);
    const result = await generateAlbumAction(project.id, {
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      quote: quote.trim() || undefined,
      foreword: foreword.trim() || undefined,
      personalMessage: personalMessage.trim() || undefined,
      templateId,
      chapters,
    });
    setBusy(false);
    if (result.ok) {
      setGenerated(true);
      router.refresh();
    } else {
      setError(result.error ?? "Album genereren mislukt.");
    }
  };

  if (generated) {
    return (
      <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-8 text-center">
        <Check className="mx-auto h-8 w-8 text-emerald-300" />
        <h2 className="mt-3 text-lg font-semibold text-white">Album gegenereerd</h2>
        <p className="mt-1 text-sm text-white/60">
          Het trouwboek is opgebouwd uit de AI-selectie. Herlaad de albumbuilder om verder te werken.
        </p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
        >
          <RefreshCw className="h-4 w-4" />
          Herlaad de albumbuilder
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
      {/* Stepper */}
      <ol className="mb-8 flex flex-wrap items-center gap-2">
        {WIZARD_STEPS.map((entry, index) => {
          const active = entry.step === step;
          const done = entry.step < step;
          return (
            <li key={entry.step} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => entry.step < step && setStep(entry.step)}
                disabled={entry.step > step}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-amber-500/60 bg-amber-500/15 text-amber-300"
                    : done
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/50"
                      : "cursor-not-allowed border-white/10 bg-white/5 text-white/40"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    active ? "bg-amber-500 text-black" : done ? "bg-emerald-500/80 text-black" : "bg-white/10"
                  }`}
                >
                  {done ? <Check className="h-3 w-3" /> : entry.step}
                </span>
                {entry.label}
              </button>
              {index < WIZARD_STEPS.length - 1 && <span className="h-px w-4 bg-white/15" aria-hidden />}
            </li>
          );
        })}
      </ol>

      {/* Stap 1: Gegevens */}
      {step === 1 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-white/70">
            Albumtitel *
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="bv. Emma & Lucas"
              className={inputClasses}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-white/70">
            Ondertitel
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="bv. Ons trouwalbum"
              className={inputClasses}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-white/70 lg:col-span-2">
            Quote (openingspagina)
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              rows={2}
              placeholder="Een korte quote of dichtregel voor vooraan in het album"
              className={inputClasses}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-white/70">
            Korte persoonlijke boodschap
            <textarea
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              rows={4}
              placeholder="Een persoonlijke boodschap van het koppel"
              className={inputClasses}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-white/70">
            Woord vooraf van de fotograaf
            <textarea
              value={foreword}
              onChange={(e) => setForeword(e.target.value)}
              rows={4}
              placeholder="Wordt als tekstpagina vooraan in het album gezet"
              className={inputClasses}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-white/70">
            Naam fotograaf
            <input type="text" value={project.photographerName ?? ""} disabled className={inputClasses} />
            <span className="text-xs text-white/40">Wordt overgenomen uit de projectgegevens.</span>
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-white/70">
            Taal
            <input type="text" value={project.language.toUpperCase()} disabled className={inputClasses} />
            <span className="text-xs text-white/40">Vastgelegd bij het aanmaken van het project.</span>
          </label>
        </div>
      )}

      {/* Stap 2: Template */}
      {step === 2 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {WEDDING_ALBUM_TEMPLATES.map((template) => {
            const selected = template.id === templateId;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => template.available && setTemplateId(template.id)}
                disabled={!template.available}
                className={`relative rounded-lg border p-4 text-left transition ${
                  selected
                    ? "border-amber-500/70 bg-amber-500/10"
                    : template.available
                      ? "border-white/10 bg-white/[0.03] hover:border-white/25"
                      : "cursor-not-allowed border-white/5 bg-white/[0.02] opacity-60"
                }`}
              >
                {!template.available && (
                  <span className="absolute right-3 top-3 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/50">
                    Binnenkort beschikbaar
                  </span>
                )}
                {selected && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-black">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <div
                  className="mb-3 flex h-16 items-center justify-center gap-1.5 rounded-md"
                  style={{ backgroundColor: template.colors.background }}
                >
                  {[template.colors.surface, template.colors.text, template.colors.mutedText, template.colors.accent].map(
                    (color, index) => (
                      <span
                        key={index}
                        className="h-6 w-6 rounded-full border border-black/10"
                        style={{ backgroundColor: color }}
                      />
                    ),
                  )}
                </div>
                <h3 className="text-sm font-semibold text-white">{template.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{template.description}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Stap 3: Verhaalstructuur */}
      {step === 3 && (
        <div className="max-w-2xl">
          <p className="mb-4 text-sm text-white/50">
            De cover, de quote-pagina en het slotwoord worden automatisch toegevoegd; hieronder bepaal je enkel de
            hoofdstukken van het verhaal.
          </p>
          <ul className="flex flex-col gap-2">
            {chapters.map((chapter, index) => (
              <li
                key={chapter.id}
                className={`flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] p-2 ${
                  chapter.hidden ? "opacity-50" : ""
                }`}
              >
                <span className="w-6 text-center text-xs text-white/40">{index + 1}</span>
                <input
                  type="text"
                  value={chapter.title}
                  onChange={(e) =>
                    setChapters((prev) => prev.map((c) => (c.id === chapter.id ? { ...c, title: e.target.value } : c)))
                  }
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => moveChapter(index, -1)}
                  disabled={index === 0}
                  title="Omhoog"
                  className={iconButtonClasses}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveChapter(index, 1)}
                  disabled={index === chapters.length - 1}
                  title="Omlaag"
                  className={iconButtonClasses}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setChapters((prev) => prev.map((c) => (c.id === chapter.id ? { ...c, hidden: !c.hidden } : c)))
                  }
                  title={chapter.hidden ? "Hoofdstuk tonen" : "Hoofdstuk verbergen"}
                  className={iconButtonClasses}
                >
                  {chapter.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setChapters((prev) => prev.filter((c) => c.id !== chapter.id))}
                  title="Hoofdstuk verwijderen"
                  className={`${iconButtonClasses} hover:border-red-400/40 hover:text-red-300`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() =>
              setChapters((prev) => [...prev, { id: crypto.randomUUID(), title: "Nieuw hoofdstuk", hidden: false }])
            }
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Hoofdstuk toevoegen
          </button>
        </div>
      )}

      {/* Stap 4: Foto's */}
      {step === 4 && (
        <div className="max-w-2xl">
          <p className="text-sm text-white/70">
            <span className="font-semibold text-white">{selection.length}</span> foto&apos;s geselecteerd voor het
            trouwboek.
          </p>
          {selection.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selection.slice(0, 14).map((photo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={photo.id}
                  src={photo.thumbUrl}
                  alt={photo.filename}
                  className="h-14 w-14 rounded object-cover"
                />
              ))}
              {selection.length > 14 && (
                <span className="flex h-14 w-14 items-center justify-center rounded bg-white/5 text-xs text-white/50">
                  +{selection.length - 14}
                </span>
              )}
            </div>
          )}
          {selection.length < 10 && (
            <p className="mt-3 flex items-center gap-2 text-sm text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Weinig foto&apos;s geselecteerd: het album wordt erg kort.
            </p>
          )}
          {selection.length > 200 && (
            <p className="mt-3 flex items-center gap-2 text-sm text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Erg veel foto&apos;s: het genereren en het PDF-bestand worden zwaar.
            </p>
          )}
          <fieldset className="mt-5 rounded-md border border-white/10 bg-white/[0.03] p-4">
            <legend className="px-1 text-xs uppercase tracking-wide text-white/40">Selectiemethode</legend>
            <label className="flex items-start gap-2.5 text-sm text-white/70">
              <input type="radio" checked readOnly className="mt-0.5 h-4 w-4 accent-amber-500" />
              <span>
                AI-voorselectie gebruiken zoals die nu is
                <span className="mt-0.5 block text-xs text-white/40">
                  De selectie zelf beheer je in de tab AI-selectie; hier wordt ze enkel gebruikt.
                </span>
              </span>
            </label>
          </fieldset>
          <button
            type="button"
            onClick={() => openTab("selectie")}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            <Sparkles className="h-4 w-4" />
            Selectie aanpassen
          </button>
        </div>
      )}

      {/* Stap 5: Genereren */}
      {step === 5 && (
        <div className="max-w-2xl">
          <dl className="grid gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-white/40">Titel</dt>
              <dd className="mt-0.5 text-white">{title.trim() || coupleName(project)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-white/40">Template</dt>
              <dd className="mt-0.5 text-white">{selectedTemplate.name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-white/40">Hoofdstukken</dt>
              <dd className="mt-0.5 text-white">
                {chapters.filter((c) => !c.hidden).length} zichtbaar
                {chapters.some((c) => c.hidden) ? `, ${chapters.filter((c) => c.hidden).length} verborgen` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-white/40">Foto&apos;s</dt>
              <dd className="mt-0.5 text-white">{selection.length} geselecteerd</dd>
            </div>
            {subtitle.trim() && (
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-white/40">Ondertitel</dt>
                <dd className="mt-0.5 text-white">{subtitle}</dd>
              </div>
            )}
            {quote.trim() && (
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-white/40">Quote</dt>
                <dd className="mt-0.5 text-white/80">{quote}</dd>
              </div>
            )}
          </dl>
          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          <button
            type="button"
            onClick={generate}
            disabled={busy || selection.length === 0}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
            {busy ? "Album wordt gegenereerd..." : "Trouwboek genereren"}
          </button>
          {selection.length === 0 && (
            <p className="mt-2 text-xs text-amber-300">Selecteer eerst foto&apos;s in de tab AI-selectie.</p>
          )}
        </div>
      )}

      {/* Navigatie */}
      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1 || busy}
          className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug
        </button>
        <div className="flex items-center gap-3">
          {stepHint(step) && <span className="text-xs text-amber-300">{stepHint(step)}</span>}
          {step < 5 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(5, s + 1))}
              disabled={!stepValid(step)}
              className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Volgende
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================= Builder ========================= */

function previewTextStyle(
  role: AlbumTextBlock["role"],
  template: WeddingAlbumTemplate,
  zoomFactor: number,
): React.CSSProperties {
  const serif = "'Cormorant Garamond', Georgia, serif";
  switch (role) {
    case "title":
      return { fontFamily: serif, fontSize: 24 * zoomFactor, fontWeight: 600, color: template.colors.text };
    case "subtitle":
      return {
        fontFamily: serif,
        fontSize: 10 * zoomFactor,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: template.colors.mutedText,
      };
    case "body":
      return { fontSize: 8 * zoomFactor, lineHeight: 1.6, color: template.colors.text };
    case "quote":
      return { fontFamily: serif, fontSize: 14 * zoomFactor, lineHeight: 1.4, color: template.colors.text };
    case "caption":
    case "meta":
      return {
        fontSize: 7 * zoomFactor,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        color: template.colors.mutedText,
      };
  }
}

function AlbumBuilder({
  project,
  photos,
  album,
  setAlbum,
  openTab,
}: ProjectTabProps & { album: WeddingAlbum }) {
  const template = getAlbumTemplate(album.templateId);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(album.pages[0]?.id ?? null);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number | null>(null);
  const [showGuides, setShowGuides] = useState(false);
  const [zoom, setZoom] = useState<75 | 100 | 125>(100);
  const [addLayoutId, setAddLayoutId] = useState(template.galleryLayouts[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const lastSavedRef = useRef<string>(JSON.stringify(album));

  const serialized = JSON.stringify(album);
  const dirty = serialized !== lastSavedRef.current;

  const photosById = useMemo(() => {
    const map: Record<string, WeddingPhoto> = {};
    for (const photo of photos) map[photo.id] = photo;
    return map;
  }, [photos]);

  const albumPhotos = useMemo(() => photos.filter((photo) => photo.selectedForAlbum), [photos]);

  const update = (fn: (a: WeddingAlbum) => WeddingAlbum) => setAlbum((prev) => (prev ? fn(prev) : prev));

  const selectedPage = album.pages.find((page) => page.id === selectedPageId) ?? album.pages[0];
  const selectedLayout = selectedPage ? getLayoutDefinition(template, selectedPage.layoutId) : undefined;

  const groups = useMemo(() => {
    const known = new Set(album.chapters.map((chapter) => chapter.id));
    const general = album.pages.filter((page) => !page.chapterId || !known.has(page.chapterId));
    const list: { id: string; title: string; pages: WeddingAlbumPage[] }[] = [];
    if (general.length > 0) list.push({ id: "algemeen", title: "Algemeen", pages: general });
    for (const chapter of album.chapters) {
      const pages = album.pages.filter((page) => page.chapterId === chapter.id);
      if (pages.length > 0) list.push({ id: chapter.id, title: chapter.title, pages });
    }
    return list;
  }, [album.pages, album.chapters]);

  const switchableLayouts = [...template.galleryLayouts, ...template.textLayouts];

  /* ----- pagina-acties ----- */

  const selectPage = (id: string) => {
    setSelectedPageId(id);
    setSelectedFrameIndex(null);
  };

  const duplicatePage = (id: string) => {
    update((a) => {
      const index = a.pages.findIndex((page) => page.id === id);
      if (index === -1) return a;
      const source = a.pages[index];
      const copy: WeddingAlbumPage = {
        ...source,
        id: crypto.randomUUID(),
        frames: source.frames.map((frame) => ({ ...frame })),
        textBlocks: source.textBlocks.map((block) => ({ ...block })),
      };
      const pages = [...a.pages];
      pages.splice(index + 1, 0, copy);
      return { ...a, pages };
    });
  };

  const deletePage = (id: string) => {
    if (!window.confirm("Deze pagina verwijderen uit het album?")) return;
    update((a) => {
      const pages = a.pages.filter((page) => page.id !== id);
      return { ...a, pages };
    });
    if (selectedPageId === id) {
      const index = album.pages.findIndex((page) => page.id === id);
      const fallback = album.pages[index + 1] ?? album.pages[index - 1];
      setSelectedPageId(fallback?.id ?? null);
      setSelectedFrameIndex(null);
    }
  };

  const movePage = (id: string, delta: -1 | 1) => {
    update((a) => {
      const index = a.pages.findIndex((page) => page.id === id);
      const target = index + delta;
      if (index === -1 || target < 0 || target >= a.pages.length) return a;
      const pages = [...a.pages];
      [pages[index], pages[target]] = [pages[target], pages[index]];
      return { ...a, pages };
    });
  };

  const addPage = () => {
    const layout = getLayoutDefinition(template, addLayoutId);
    if (!layout) return;
    const newPage: WeddingAlbumPage = {
      id: crypto.randomUUID(),
      chapterId: selectedPage?.chapterId,
      layoutId: layout.id,
      frames: layout.frames.map((frame) => ({ ...frame })),
      textBlocks: layout.textBlocks.map((block) => ({ ...block })),
    };
    update((a) => {
      const index = selectedPage ? a.pages.findIndex((page) => page.id === selectedPage.id) : a.pages.length - 1;
      const pages = [...a.pages];
      pages.splice(index + 1, 0, newPage);
      return { ...a, pages };
    });
    setSelectedPageId(newPage.id);
    setSelectedFrameIndex(null);
  };

  /* ----- kader- en tekstacties ----- */

  const updateSelectedPage = (fn: (page: WeddingAlbumPage) => WeddingAlbumPage) => {
    if (!selectedPage) return;
    update((a) => ({
      ...a,
      pages: a.pages.map((page) => (page.id === selectedPage.id ? fn(page) : page)),
    }));
  };

  const switchLayout = (layoutId: string) => {
    const layout = getLayoutDefinition(template, layoutId);
    if (!layout || !selectedPage) return;
    updateSelectedPage((page) => ({
      ...page,
      layoutId: layout.id,
      // Foto's op index behouden; teksten op rol behouden.
      frames: layout.frames.map((frame, index) => ({ ...frame, photoId: page.frames[index]?.photoId })),
      textBlocks: layout.textBlocks.map((block) => {
        const existing = page.textBlocks.find((b) => b.role === block.role);
        return { ...block, text: existing?.text ?? block.text };
      }),
    }));
    setSelectedFrameIndex((prev) => (prev !== null && prev < layout.frames.length ? prev : null));
  };

  const assignPhoto = (photoId: string) => {
    if (selectedFrameIndex === null) return;
    updateSelectedPage((page) => ({
      ...page,
      frames: page.frames.map((frame, index) => (index === selectedFrameIndex ? { ...frame, photoId } : frame)),
    }));
  };

  const clearFrame = () => {
    if (selectedFrameIndex === null) return;
    updateSelectedPage((page) => ({
      ...page,
      frames: page.frames.map((frame, index) =>
        index === selectedFrameIndex ? { ...frame, photoId: undefined } : frame,
      ),
    }));
  };

  const setBlockText = (blockIndex: number, text: string) => {
    updateSelectedPage((page) => ({
      ...page,
      textBlocks: page.textBlocks.map((block, index) => (index === blockIndex ? { ...block, text } : block)),
    }));
  };

  const isUsedElsewhere = (photoId: string): boolean =>
    album.pages.some((page) =>
      page.frames.some(
        (frame, index) =>
          frame.photoId === photoId && !(selectedPage && page.id === selectedPage.id && index === selectedFrameIndex),
      ),
    );

  const save = async () => {
    setSaving(true);
    setSaveMessage(null);
    const snapshot = album;
    const result = await saveAlbumAction(snapshot);
    setSaving(false);
    if (result.ok) {
      lastSavedRef.current = JSON.stringify(snapshot);
      setSaveMessage({ type: "ok", text: "Album opgeslagen." });
    } else {
      setSaveMessage({ type: "error", text: result.error ?? "Opslaan mislukt." });
    }
  };

  const zoomFactor = zoom / 100;
  const previewWidth = 460 * zoomFactor;
  const marginX = (template.margins / template.pageWidth) * 100;
  const marginY = (template.margins / template.pageHeight) * 100;
  const selectedFrame =
    selectedPage && selectedFrameIndex !== null ? selectedPage.frames[selectedFrameIndex] : undefined;
  const assignedPhoto = selectedFrame?.photoId ? photosById[selectedFrame.photoId] : undefined;

  return (
    <div className="flex flex-col gap-4">
      {/* Topbalk */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <input
          type="text"
          value={album.title}
          onChange={(e) => update((a) => ({ ...a, title: e.target.value }))}
          aria-label="Albumtitel"
          className={`${inputClasses} max-w-[16rem]`}
        />
        <select
          value={album.status}
          onChange={(e) => update((a) => ({ ...a, status: e.target.value as WeddingAlbum["status"] }))}
          aria-label="Albumstatus"
          className={`${inputClasses} w-auto`}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-neutral-900">
              {option.label}
            </option>
          ))}
          {album.status === "exported" && (
            <option value="exported" className="bg-neutral-900">
              Geëxporteerd
            </option>
          )}
        </select>
        <div className="ml-auto flex items-center gap-3">
          {dirty && <span className="text-xs text-amber-300">Niet-opgeslagen wijzigingen</span>}
          {saveMessage && (
            <span className={`text-xs ${saveMessage.type === "ok" ? "text-emerald-300" : "text-red-300"}`}>
              {saveMessage.text}
            </span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Opslaan..." : "Opslaan"}
          </button>
          <button
            type="button"
            onClick={() => openTab("export")}
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            <FileDown className="h-4 w-4" />
            Naar export
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row">
        {/* Links: paginalijst */}
        <aside className="w-full shrink-0 rounded-lg border border-white/10 bg-white/[0.03] p-3 xl:w-64">
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            {groups.map((group) => (
              <div key={group.id} className="mb-3">
                <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {group.pages.map((page) => {
                    const pageNumber = album.pages.findIndex((p) => p.id === page.id) + 1;
                    const layout = getLayoutDefinition(template, page.layoutId);
                    const firstPhotoId = page.frames.find((frame) => frame.photoId)?.photoId;
                    const firstPhoto = firstPhotoId ? photosById[firstPhotoId] : undefined;
                    const selected = selectedPage?.id === page.id;
                    return (
                      <li
                        key={page.id}
                        className={`rounded-md border p-1.5 transition ${
                          selected ? "border-amber-500/60 bg-amber-500/10" : "border-white/10 bg-white/[0.02]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => selectPage(page.id)}
                          className="flex w-full items-center gap-2 text-left"
                        >
                          {firstPhoto ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={firstPhoto.thumbUrl}
                              alt=""
                              className="h-10 w-8 shrink-0 rounded-sm object-cover"
                            />
                          ) : (
                            <span className="flex h-10 w-8 shrink-0 items-center justify-center rounded-sm bg-white/5 text-white/30">
                              <ImageOff className="h-3.5 w-3.5" />
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="block text-xs font-medium text-white">Pagina {pageNumber}</span>
                            <span className="block truncate text-[11px] text-white/45">
                              {layout?.name ?? page.layoutId}
                            </span>
                          </span>
                        </button>
                        <div className="mt-1.5 flex gap-1">
                          <button
                            type="button"
                            onClick={() => movePage(page.id, -1)}
                            disabled={pageNumber === 1}
                            title="Omhoog"
                            className={iconButtonClasses}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => movePage(page.id, 1)}
                            disabled={pageNumber === album.pages.length}
                            title="Omlaag"
                            className={iconButtonClasses}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => duplicatePage(page.id)}
                            title="Pagina dupliceren"
                            className={iconButtonClasses}
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deletePage(page.id)}
                            title="Pagina verwijderen"
                            className={`${iconButtonClasses} hover:border-red-400/40 hover:text-red-300`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-2 border-t border-white/10 pt-3">
            <label className="flex flex-col gap-1.5 text-xs text-white/50">
              Nieuwe pagina (lay-out)
              <select value={addLayoutId} onChange={(e) => setAddLayoutId(e.target.value)} className={inputClasses}>
                {switchableLayouts.map((layout) => (
                  <option key={layout.id} value={layout.id} className="bg-neutral-900">
                    {layout.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={addPage}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Pagina toevoegen
            </button>
          </div>
        </aside>

        {/* Midden: paginapreview */}
        <section className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          {selectedPage ? (
            <>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-white/60">
                  <input
                    type="checkbox"
                    checked={showGuides}
                    onChange={(e) => setShowGuides(e.target.checked)}
                    className="h-3.5 w-3.5 accent-amber-500"
                  />
                  Hulplijnen
                </label>
                <div className="ml-auto flex items-center gap-1">
                  {([75, 100, 125] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setZoom(level)}
                      className={`rounded px-2 py-1 text-xs transition ${
                        zoom === level
                          ? "bg-amber-500/20 text-amber-300"
                          : "text-white/50 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {level}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-center overflow-auto pb-2">
                <div
                  className="relative shrink-0 shadow-lg shadow-black/40"
                  style={{
                    width: previewWidth,
                    aspectRatio: `${template.pageWidth} / ${template.pageHeight}`,
                    backgroundColor: template.colors.background,
                  }}
                >
                  {selectedPage.frames.map((frame, index) => {
                    const photo = frame.photoId ? photosById[frame.photoId] : undefined;
                    const frameSelected = selectedFrameIndex === index;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedFrameIndex(index)}
                        title={photo ? photo.filename : "Leeg kader: klik om een foto te kiezen"}
                        className={`absolute overflow-hidden transition ${
                          frameSelected ? "ring-2 ring-amber-400 ring-offset-1 ring-offset-black/20" : ""
                        } ${photo ? "" : "border border-dashed"}`}
                        style={{
                          left: `${frame.x}%`,
                          top: `${frame.y}%`,
                          width: `${frame.width}%`,
                          height: `${frame.height}%`,
                          borderColor: photo ? undefined : template.colors.accent,
                          backgroundColor: photo ? undefined : template.colors.surface,
                        }}
                      >
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photo.previewUrl} alt={photo.filename} className="h-full w-full object-cover" />
                        ) : (
                          <span
                            className="flex h-full w-full items-center justify-center text-[10px]"
                            style={{ color: template.colors.mutedText }}
                          >
                            Leeg kader
                          </span>
                        )}
                      </button>
                    );
                  })}
                  {selectedPage.textBlocks.map((block, index) => (
                    <div
                      key={`text-${index}`}
                      className="pointer-events-none absolute whitespace-pre-wrap"
                      style={{
                        left: `${block.x}%`,
                        top: `${block.y}%`,
                        width: `${block.width}%`,
                        textAlign: block.align,
                        ...previewTextStyle(block.role, template, zoomFactor),
                      }}
                    >
                      {block.text || " "}
                    </div>
                  ))}
                  {showGuides && (
                    <>
                      <div
                        className="pointer-events-none absolute border border-sky-400/60"
                        style={{
                          left: `${marginX}%`,
                          right: `${marginX}%`,
                          top: `${marginY}%`,
                          bottom: `${marginY}%`,
                        }}
                      />
                      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-sky-400/50" />
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="p-6 text-center text-sm text-white/50">
              Geen pagina&apos;s in dit album. Voeg links een pagina toe.
            </p>
          )}
        </section>

        {/* Rechts: eigenschappen */}
        <aside className="w-full shrink-0 rounded-lg border border-white/10 bg-white/[0.03] p-3 xl:w-80">
          {selectedPage ? (
            <div className="flex max-h-[75vh] flex-col gap-5 overflow-y-auto pr-1">
              {/* Lay-out */}
              <div>
                <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">Lay-out</h3>
                <select
                  value={selectedPage.layoutId}
                  onChange={(e) => switchLayout(e.target.value)}
                  className={inputClasses}
                >
                  {selectedLayout && !switchableLayouts.some((layout) => layout.id === selectedLayout.id) && (
                    <option value={selectedLayout.id} className="bg-neutral-900">
                      {selectedLayout.name} (vaste pagina)
                    </option>
                  )}
                  {switchableLayouts.map((layout) => (
                    <option key={layout.id} value={layout.id} className="bg-neutral-900">
                      {layout.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-[11px] text-white/40">
                  Bij het wisselen blijven foto&apos;s per kaderpositie en teksten per rol behouden.
                </p>
              </div>

              {/* Kader */}
              <div>
                <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">Fotokader</h3>
                {selectedPage.frames.length === 0 ? (
                  <p className="text-xs text-white/45">Deze pagina heeft geen fotokaders.</p>
                ) : selectedFrame ? (
                  <>
                    {assignedPhoto && isUsedElsewhere(assignedPhoto.id) && (
                      <p className="mb-2 flex items-center gap-1.5 text-xs text-amber-300">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        Deze foto wordt ook elders in het album gebruikt.
                      </p>
                    )}
                    {albumPhotos.length === 0 ? (
                      <p className="text-xs text-white/45">Geen albumfoto&apos;s beschikbaar.</p>
                    ) : (
                      <div className="grid max-h-56 grid-cols-4 gap-1 overflow-y-auto">
                        {albumPhotos.map((photo) => {
                          const assigned = selectedFrame.photoId === photo.id;
                          const used = isUsedElsewhere(photo.id);
                          return (
                            <button
                              key={photo.id}
                              type="button"
                              onClick={() => assignPhoto(photo.id)}
                              title={used ? `${photo.filename} (al gebruikt in het album)` : photo.filename}
                              className={`relative aspect-square overflow-hidden rounded transition ${
                                assigned ? "ring-2 ring-amber-400" : used ? "ring-1 ring-amber-500/40" : "hover:ring-1 hover:ring-white/40"
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={photo.thumbUrl} alt={photo.filename} className="h-full w-full object-cover" />
                              {used && !assigned && (
                                <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={clearFrame}
                      disabled={!selectedFrame.photoId}
                      className="mt-2 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ImageOff className="h-3.5 w-3.5" />
                      Kader leegmaken
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-white/45">
                    Klik op een kader in het paginavoorbeeld om er een foto aan te koppelen.
                  </p>
                )}
              </div>

              {/* Teksten */}
              <div>
                <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">Teksten</h3>
                {selectedPage.textBlocks.length === 0 ? (
                  <p className="text-xs text-white/45">Deze pagina heeft geen tekstblokken.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {selectedPage.textBlocks.map((block, index) => (
                      <label key={index} className="flex flex-col gap-1 text-xs text-white/60">
                        {ROLE_LABELS[block.role]}
                        {block.role === "body" || block.role === "quote" ? (
                          <textarea
                            value={block.text}
                            onChange={(e) => setBlockText(index, e.target.value)}
                            rows={block.role === "body" ? 5 : 3}
                            className={inputClasses}
                          />
                        ) : (
                          <input
                            type="text"
                            value={block.text}
                            onChange={(e) => setBlockText(index, e.target.value)}
                            className={inputClasses}
                          />
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <p className="border-t border-white/10 pt-3 text-[11px] leading-relaxed text-white/35">
                Project: {project.internalName}. Opnieuw automatisch indelen kan door een nieuw album te genereren; dit
                album blijft bewaard tot je het overschrijft.
              </p>
            </div>
          ) : (
            <p className="text-sm text-white/50">Selecteer een pagina.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
