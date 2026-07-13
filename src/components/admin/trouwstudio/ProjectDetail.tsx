"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Image as ImageIcon,
  MapPin,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PHOTO_STATUS_LABELS,
  PROJECT_STATUS_LABELS,
  coupleName,
  type TrouwstudioSettings,
  type WeddingAlbum,
  type WeddingPhoto,
  type WeddingProject,
  type WeddingProjectStatus,
} from "@/features/trouwstudio/types";
import { PHOTO_STATUS_BADGE, formatDate, type ProjectTabProps } from "./shared";
import { PhotosTab } from "./PhotosTab";
import { SelectionTab } from "./SelectionTab";
import { EditorTab } from "./EditorTab";
import { AlbumTab } from "./AlbumTab";
import { ExportTab } from "./ExportTab";

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

const ALBUM_STATUS_LABELS: Record<WeddingAlbum["status"], string> = {
  draft: "Concept",
  review: "In review",
  ready: "Klaar voor export",
  exported: "Geëxporteerd",
};

const WORKFLOW_STEPS = [
  "Foto's toevoegen",
  "Analyseren",
  "Optimaliseren",
  "Selecteren",
  "Trouwboek maken",
  "Exporteren",
] as const;

const STATUS_TO_STEP: Record<WeddingProjectStatus, number> = {
  concept: 0,
  fotos_toegevoegd: 1,
  analyse_bezig: 1,
  controle_nodig: 2,
  fotos_afgewerkt: 3,
  album_in_opmaak: 4,
  klaar_voor_export: 5,
  afgerond: 5,
};

const TAB_ITEMS = [
  { value: "overzicht", label: "Overzicht" },
  { value: "fotos", label: "Foto's" },
  { value: "ai-selectie", label: "AI-selectie" },
  { value: "bewerken", label: "Bewerken" },
  { value: "trouwboek", label: "Trouwboek" },
  { value: "export", label: "Export" },
] as const;

export function ProjectDetail({
  project,
  initialPhotos,
  initialAlbum,
  aiProviderId,
  aiProviderModel,
  settings,
}: {
  project: WeddingProject;
  initialPhotos: WeddingPhoto[];
  initialAlbum: WeddingAlbum | null;
  aiProviderId: string;
  aiProviderModel: string;
  settings: TrouwstudioSettings;
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [album, setAlbum] = useState(initialAlbum);
  const [tab, setTab] = useState("overzicht");
  const [editorPhotoId, setEditorPhotoId] = useState<string | null>(null);

  // Server actions revalideren de route; sync de verse serverdata (analyses,
  // bulkacties, tellers) naar de lokale state zodat de UI zonder harde reload klopt.
  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);
  useEffect(() => {
    setAlbum(initialAlbum);
  }, [initialAlbum]);

  const openTab = useCallback((nextTab: string, photoId?: string) => {
    if (photoId !== undefined) setEditorPhotoId(photoId);
    setTab(nextTab);
  }, []);

  const tabProps: ProjectTabProps = {
    project,
    photos,
    setPhotos,
    album,
    setAlbum,
    aiProviderId,
    aiProviderModel,
    openTab,
    editorPhotoId,
  };

  const stats = useMemo(() => {
    const count = (fn: (p: WeddingPhoto) => boolean) => photos.filter(fn).length;
    return [
      { label: "Totaal foto's", value: String(photos.length) },
      {
        label: "Nog te analyseren",
        value: String(count((p) => p.status === "geupload" || p.status === "wacht_op_analyse")),
      },
      { label: "Voorstellen beschikbaar", value: String(count((p) => p.status === "voorstel_beschikbaar")) },
      { label: "Goedgekeurd", value: String(count((p) => p.status === "goedgekeurd")) },
      { label: "Afgekeurd", value: String(count((p) => p.status === "afgekeurd")) },
      { label: "Favorieten", value: String(count((p) => p.favorite)) },
      { label: "In trouwboek", value: String(count((p) => p.selectedForAlbum)) },
      { label: "Albumpagina's", value: String(album?.pages.length ?? 0) },
      { label: "Exportstatus", value: album ? ALBUM_STATUS_LABELS[album.status] : "Nog geen album" },
    ];
  }, [photos, album]);

  const recentPhotos = useMemo(
    () => [...photos].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6),
    [photos],
  );

  const currentStep = STATUS_TO_STEP[project.status];
  const allDone = project.status === "afgerond";
  const locationText = [project.ceremonyLocation, project.city].filter(Boolean).join(", ");

  return (
    <div>
      {/* ===== Header ===== */}
      <Link
        href="/admin/trouwstudio"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Terug naar Trouwstudio
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{coupleName(project)}</h1>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${PROJECT_STATUS_BADGE[project.status]}`}>
          {PROJECT_STATUS_LABELS[project.status]}
        </span>
        {project.archived && (
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/55">
            Gearchiveerd
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/55">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(project.weddingDate)}
        </span>
        {locationText && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {locationText}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5" />
          {photos.length} foto&apos;s
        </span>
        <span>Laatst gewijzigd: {formatDate(project.updatedAt)}</span>
      </div>

      {aiProviderId === "mock" && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Demonstratiemodus: de actieve AI-provider heeft geen bruikbare API-sleutel. Analyses zijn placeholders. Beheer dit onder Instellingen &gt; AI-providers.
          </span>
        </div>
      )}

      {/* ===== Tabs ===== */}
      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1 text-white/55">
          {TAB_ITEMS.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="rounded-md px-3 py-1.5 text-sm data-[state=active]:bg-amber-500/90 data-[state=active]:text-black data-[state=active]:shadow-none"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ===== Overzicht ===== */}
        <TabsContent value="overzicht" className="mt-6 flex flex-col gap-6">
          {/* Workflow */}
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <h2 className="mb-3 text-sm font-semibold text-white/70">Workflow</h2>
            <div className="flex flex-wrap items-center gap-y-2">
              {WORKFLOW_STEPS.map((step, index) => {
                const done = allDone || index < currentStep;
                const active = !allDone && index === currentStep;
                return (
                  <span key={step} className="flex items-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        active
                          ? "bg-amber-500/90 text-black"
                          : done
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-white/5 text-white/40"
                      }`}
                    >
                      {done && <Check className="h-3 w-3" />}
                      {step}
                    </span>
                    {index < WORKFLOW_STEPS.length - 1 && (
                      <ChevronRight className="mx-1 h-3.5 w-3.5 text-white/25" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Statistieken */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="text-xl font-semibold leading-tight">{stat.value}</div>
                <div className="mt-1 text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Recente activiteit */}
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <h2 className="mb-3 text-sm font-semibold text-white/70">Recente activiteit</h2>
            {recentPhotos.length === 0 ? (
              <div className="flex flex-col items-start gap-3 text-sm text-white/50">
                <p>Nog geen foto&apos;s in dit project. Voeg foto&apos;s toe om te starten.</p>
                <button
                  type="button"
                  onClick={() => openTab("fotos")}
                  className="rounded-md bg-amber-500/90 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400"
                >
                  Foto&apos;s toevoegen
                </button>
              </div>
            ) : (
              <ul className="flex flex-col divide-y divide-white/5">
                {recentPhotos.map((photo) => (
                  <li key={photo.id} className="flex items-center gap-3 py-2">
                    <button
                      type="button"
                      onClick={() => openTab("bewerken", photo.id)}
                      title="Openen in de editor"
                      className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.thumbUrl} alt={photo.filename} loading="lazy" className="h-full w-full object-cover" />
                    </button>
                    <span className="min-w-0 flex-1 truncate text-sm text-white/75">{photo.filename}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${PHOTO_STATUS_BADGE[photo.status]}`}
                    >
                      {PHOTO_STATUS_LABELS[photo.status]}
                    </span>
                    <span className="hidden shrink-0 text-[11px] text-white/35 sm:block">
                      {formatDate(photo.updatedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        {/* ===== Overige tabs ===== */}
        <TabsContent value="fotos" className="mt-6">
          <PhotosTab {...tabProps} settings={settings} />
        </TabsContent>
        <TabsContent value="ai-selectie" className="mt-6">
          <SelectionTab {...tabProps} />
        </TabsContent>
        <TabsContent value="bewerken" className="mt-6">
          <EditorTab {...tabProps} />
        </TabsContent>
        <TabsContent value="trouwboek" className="mt-6">
          <AlbumTab {...tabProps} />
        </TabsContent>
        <TabsContent value="export" className="mt-6">
          <ExportTab {...tabProps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
