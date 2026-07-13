"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BookHeart, Loader2, Sparkles, Star } from "lucide-react";
import {
  SCENE_LABELS,
  type WeddingPhoto,
} from "@/features/trouwstudio/types";
import { bulkPhotoAction, updatePhotoAction } from "@/lib/admin/trouwstudioActions";
import { type ProjectTabProps } from "./shared";

type GroupId = "zeker" | "goed" | "alternatief" | "overslaan" | "controle";

type Group = {
  id: GroupId;
  title: string;
  description: string;
  photos: WeddingPhoto[];
};

const secondaryBtn =
  "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50";

const RECOMMENDED_MIN = 40;
const RECOMMENDED_MAX = 120;

export function SelectionTab(props: ProjectTabProps) {
  const { project, photos, setPhotos, openTab } = props;

  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [photoBusyId, setPhotoBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzed = useMemo(() => photos.filter((p) => p.analysis), [photos]);
  const unanalyzedCount = photos.length - analyzed.length;
  const mockUsed = useMemo(() => photos.some((p) => p.analysis?.provider === "mock"), [photos]);
  const albumCount = useMemo(() => photos.filter((p) => p.selectedForAlbum).length, [photos]);

  const groups = useMemo<Group[]>(() => {
    const byScore = (min: number, max: number) =>
      analyzed.filter((p) => {
        const a = p.analysis;
        if (!a || a.reviewRequired) return false;
        return a.albumSuitabilityScore >= min && a.albumSuitabilityScore <= max;
      });
    return [
      {
        id: "zeker",
        title: "Zeker opnemen",
        description: "Albumscore 80 of hoger, zonder twijfels van de AI.",
        photos: byScore(80, 100),
      },
      {
        id: "goed",
        title: "Goede opties",
        description: "Albumscore 60 tot 79: sterke kandidaten voor het trouwboek.",
        photos: byScore(60, 79),
      },
      {
        id: "alternatief",
        title: "Mogelijke alternatieven",
        description: "Albumscore 40 tot 59: bruikbaar als aanvulling of variatie.",
        photos: byScore(40, 59),
      },
      {
        id: "overslaan",
        title: "Waarschijnlijk overslaan",
        description: "Albumscore onder 40: meestal niet geschikt voor het trouwboek.",
        photos: byScore(0, 39),
      },
      {
        id: "controle",
        title: "Controle nodig",
        description: "De AI is hier niet zeker van; beoordeel deze foto's zelf.",
        photos: analyzed.filter((p) => p.analysis?.reviewRequired),
      },
    ];
  }, [analyzed]);

  const runGroupAction = async (group: Group, action: "album_toevoegen" | "album_verwijderen") => {
    const ids = group.photos.map((p) => p.id);
    if (ids.length === 0) return;
    const key = `${group.id}:${action}`;
    setBusyKey(key);
    setError(null);
    const result = await bulkPhotoAction(project.id, ids, action);
    if (result.ok) {
      const value = action === "album_toevoegen";
      const idSet = new Set(ids);
      setPhotos((prev) =>
        prev.map((p) =>
          idSet.has(p.id) ? { ...p, selectedForAlbum: value, updatedAt: new Date().toISOString() } : p,
        ),
      );
    } else {
      setError(result.error ?? "Bulkactie mislukt.");
    }
    setBusyKey(null);
  };

  const togglePhotoFlag = async (photo: WeddingPhoto, patch: { favorite?: boolean; selectedForAlbum?: boolean }) => {
    setPhotoBusyId(photo.id);
    setError(null);
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
      setError(result.error ?? "Opslaan mislukt.");
    }
    setPhotoBusyId(null);
  };

  if (analyzed.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
          <Sparkles className="h-7 w-7" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Nog geen AI-analyse</h2>
          <p className="mt-1 max-w-md text-sm text-white/50">
            Analyseer eerst foto&apos;s in het tabblad Foto&apos;s. Daarna groepeert de AI ze hier op geschiktheid voor
            het trouwboek.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openTab("fotos")}
          className="rounded-md bg-amber-500/90 px-4 py-2.5 text-sm font-semibold text-black hover:bg-amber-400"
        >
          Naar Foto&apos;s
        </button>
      </div>
    );
  }

  const outsideRange = albumCount > 0 && (albumCount < RECOMMENDED_MIN || albumCount > RECOMMENDED_MAX);

  return (
    <div className="flex flex-col gap-6">
      {mockUsed && (
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Demonstratiemodus: er is geen AI-provider geconfigureerd (ANTHROPIC_API_KEY). Analyses zijn placeholders.
          </span>
        </div>
      )}

      {/* ===== Samenvatting ===== */}
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <p className="text-base font-semibold">
          {albumCount} foto{albumCount === 1 ? "" : "'s"} geselecteerd voor het trouwboek
        </p>
        <p className="mt-1 text-sm text-white/50">
          Aanbevolen: {RECOMMENDED_MIN} tot {RECOMMENDED_MAX} foto&apos;s voor een mooi gevuld album.
        </p>
        {outsideRange && (
          <p className="mt-2 inline-flex items-start gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {albumCount < RECOMMENDED_MIN
              ? `Je zit onder de aanbevolen ${RECOMMENDED_MIN} foto's; het album kan dun aanvoelen.`
              : `Je zit boven de aanbevolen ${RECOMMENDED_MAX} foto's; overweeg strenger te selecteren.`}
          </p>
        )}
        {unanalyzedCount > 0 && (
          <p className="mt-2 text-xs text-white/45">
            Nog {unanalyzedCount} foto{unanalyzedCount === 1 ? "" : "'s"} zonder analyse.{" "}
            <button type="button" onClick={() => openTab("fotos")} className="text-amber-400 underline hover:text-amber-300">
              Analyseer ze in het tabblad Foto&apos;s
            </button>
            .
          </p>
        )}
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>

      {/* ===== Groepen ===== */}
      {groups.map((group) => (
        <section key={group.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-1 flex flex-wrap items-center gap-3">
            <h2 className="text-base font-semibold">
              {group.title} <span className="text-sm font-normal text-white/40">({group.photos.length})</span>
            </h2>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => runGroupAction(group, "album_toevoegen")}
                disabled={busyKey !== null || group.photos.length === 0}
                className={secondaryBtn}
              >
                {busyKey === `${group.id}:album_toevoegen` && <Loader2 className="h-3 w-3 animate-spin" />}
                Alles selecteren voor album
              </button>
              <button
                type="button"
                onClick={() => runGroupAction(group, "album_verwijderen")}
                disabled={busyKey !== null || group.photos.length === 0}
                className={secondaryBtn}
              >
                {busyKey === `${group.id}:album_verwijderen` && <Loader2 className="h-3 w-3 animate-spin" />}
                Alles verwijderen uit album
              </button>
            </div>
          </div>
          <p className="mb-3 text-xs text-white/45">{group.description}</p>

          {group.photos.length === 0 ? (
            <p className="rounded-md border border-white/5 bg-white/[0.02] px-4 py-5 text-center text-xs text-white/35">
              Geen foto&apos;s in deze groep.
            </p>
          ) : (
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))]">
              {group.photos.map((photo) => {
                const flagBusy = photoBusyId === photo.id;
                const analysis = photo.analysis;
                return (
                  <div
                    key={photo.id}
                    className={`group relative flex flex-col overflow-hidden rounded-lg border bg-white/[0.03] ${
                      photo.selectedForAlbum ? "border-emerald-500/50" : "border-white/10"
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
                        {analysis && (
                          <span
                            title={`Albumscore: ${Math.round(analysis.albumSuitabilityScore)}/100`}
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                              analysis.albumSuitabilityScore >= 80
                                ? "bg-emerald-500/15 text-emerald-300"
                                : analysis.albumSuitabilityScore < 40
                                  ? "bg-red-500/15 text-red-300"
                                  : "bg-white/10 text-white/60"
                            }`}
                          >
                            {Math.round(analysis.albumSuitabilityScore)}
                          </span>
                        )}
                        {analysis && (
                          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-white/60">
                            {SCENE_LABELS[analysis.scene]}
                          </span>
                        )}
                        {analysis?.suggestedAlbumSection && (
                          <span
                            title="Voorgesteld albumhoofdstuk"
                            className="rounded-full bg-violet-500/15 px-1.5 py-0.5 text-[10px] text-violet-300"
                          >
                            Hoofdstuk: {SCENE_LABELS[analysis.suggestedAlbumSection]}
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
        </section>
      ))}
    </div>
  );
}
