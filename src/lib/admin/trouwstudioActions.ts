"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import {
  createWeddingProject,
  deleteWeddingPhotos,
  deleteWeddingProject,
  getWeddingAlbum,
  getWeddingPhoto,
  getWeddingProject,
  getTrouwstudioSettings,
  listWeddingPhotos,
  refreshProjectCounters,
  saveWeddingAlbum,
  setTrouwstudioSettings,
  updateWeddingPhoto,
  updateWeddingPhotosBulk,
  updateWeddingProject,
} from "@/lib/firestore/trouwstudio";
import { resolveAnalysisProvider } from "@/features/trouwstudio/services/analysis";
import { imageProcessingProvider } from "@/features/trouwstudio/services/imageProcessing";
import { buildAlbumLayout } from "@/features/trouwstudio/lib/autoLayout";
import { getAlbumTemplate } from "@/features/trouwstudio/templates/ivoryEditorial";
import {
  NEUTRAL_ADJUSTMENTS,
  WEDDING_EDITING_STYLES,
  type CropConfiguration,
  type PhotoAdjustments,
  type TrouwstudioSettings,
  type WeddingAlbum,
  type WeddingAlbumChapter,
  type WeddingEditingStyle,
  type WeddingPhoto,
  type WeddingProject,
  type WeddingProjectStatus,
} from "@/features/trouwstudio/types";

export type TrouwstudioActionResult<T = undefined> = { ok: boolean; error?: string; data?: T };

const OVERVIEW_PATH = "/admin/trouwstudio";

function revalidateProject(projectId?: string): void {
  revalidatePath(OVERVIEW_PATH);
  if (projectId) revalidatePath(`${OVERVIEW_PATH}/projecten/${projectId}`);
}

async function requireAdmin(): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = await getCurrentAdmin();
  return admin ? { ok: true } : { ok: false, error: "Niet ingelogd." };
}

const str = (value: unknown, max = 200): string => String(value ?? "").trim().slice(0, max);

function cleanAdjustments(raw: Partial<PhotoAdjustments> | undefined): PhotoAdjustments {
  const out = { ...NEUTRAL_ADJUSTMENTS };
  if (!raw) return out;
  for (const key of Object.keys(out) as (keyof PhotoAdjustments)[]) {
    const value = Number(raw[key]);
    if (!Number.isFinite(value)) continue;
    out[key] = key === "straighten" ? Math.max(-15, Math.min(15, value)) : Math.max(-100, Math.min(100, value));
  }
  return out;
}

/* ========================= Projecten ========================= */

export type CreateProjectInput = {
  partnerOneName: string;
  partnerTwoName: string;
  weddingDate: string;
  ceremonyLocation?: string;
  receptionLocation?: string;
  city?: string;
  photographerName?: string;
  internalName?: string;
  language?: string;
  editingStyle?: string;
  notes?: string;
};

export async function createProjectAction(input: CreateProjectInput): Promise<TrouwstudioActionResult<{ id: string }>> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const partnerOneName = str(input.partnerOneName, 80);
  const partnerTwoName = str(input.partnerTwoName, 80);
  const weddingDate = str(input.weddingDate, 20);
  if (!partnerOneName || !partnerTwoName) return { ok: false, error: "Vul beide namen van het koppel in." };
  if (!weddingDate) return { ok: false, error: "Vul de trouwdatum in." };

  const settings = await getTrouwstudioSettings();
  const editingStyle = (WEDDING_EDITING_STYLES as readonly string[]).includes(str(input.editingStyle))
    ? (str(input.editingStyle) as WeddingEditingStyle)
    : settings.defaultEditingStyle;

  try {
    const project = await createWeddingProject({
      partnerOneName,
      partnerTwoName,
      weddingDate,
      ceremonyLocation: str(input.ceremonyLocation) || undefined,
      receptionLocation: str(input.receptionLocation) || undefined,
      city: str(input.city, 80) || undefined,
      photographerName: str(input.photographerName, 80) || undefined,
      internalName: str(input.internalName, 120) || `${partnerOneName} & ${partnerTwoName} - ${weddingDate}`,
      language: str(input.language, 5) || settings.defaultLanguage,
      editingStyle,
      notes: str(input.notes, 2000) || undefined,
    });
    revalidateProject(project.id);
    return { ok: true, data: { id: project.id } };
  } catch {
    return { ok: false, error: "Project aanmaken mislukt." };
  }
}

/**
 * AI-invulhulp: haalt uit een (ingesproken of getypte) Nederlandse beschrijving
 * de gestructureerde velden voor een nieuw trouwproject. Vult nooit zelf een
 * project aan; de admin controleert en maakt het project aan.
 */
export async function parseWeddingProjectAction(
  transcript: string,
): Promise<TrouwstudioActionResult<import("@/lib/ai/parseWeddingProject").ParsedWeddingProject>> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const text = str(transcript, 6000);
  if (text.length < 3) {
    return { ok: false, error: "Vertel of typ eerst wat gegevens die de AI kan invullen." };
  }

  const { hasAnthropic, parseWeddingProject } = await import("@/lib/ai/parseWeddingProject");
  if (!hasAnthropic()) {
    return {
      ok: false,
      error: "De AI-invulhulp is niet beschikbaar: er is geen ANTHROPIC_API_KEY geconfigureerd.",
    };
  }

  try {
    const data = await parseWeddingProject(text);
    return { ok: true, data };
  } catch {
    return { ok: false, error: "De AI kon de gegevens niet verwerken. Probeer het opnieuw of vul handmatig in." };
  }
}

export async function updateProjectAction(
  projectId: string,
  patch: Partial<Pick<WeddingProject, "internalName" | "status" | "archived" | "notes" | "coverPhotoUrl" | "editingStyle">>,
): Promise<TrouwstudioActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  try {
    await updateWeddingProject(projectId, patch);
    revalidateProject(projectId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Opslaan mislukt." };
  }
}

export async function duplicateProjectAction(projectId: string): Promise<TrouwstudioActionResult<{ id: string }>> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  const source = await getWeddingProject(projectId);
  if (!source) return { ok: false, error: "Project niet gevonden." };
  try {
    const copy = await createWeddingProject({
      partnerOneName: source.partnerOneName,
      partnerTwoName: source.partnerTwoName,
      weddingDate: source.weddingDate,
      ceremonyLocation: source.ceremonyLocation,
      receptionLocation: source.receptionLocation,
      city: source.city,
      photographerName: source.photographerName,
      internalName: `${source.internalName} (kopie)`,
      language: source.language,
      editingStyle: source.editingStyle,
      notes: source.notes,
    });
    revalidateProject(copy.id);
    return { ok: true, data: { id: copy.id } };
  } catch {
    return { ok: false, error: "Dupliceren mislukt." };
  }
}

/** Definitief verwijderen; de UI vraagt eerst bevestiging en biedt archiveren aan als alternatief. */
export async function deleteProjectAction(projectId: string): Promise<TrouwstudioActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  try {
    await deleteWeddingProject(projectId);
    revalidateProject();
    return { ok: true };
  } catch {
    return { ok: false, error: "Verwijderen mislukt." };
  }
}

/* ========================= Foto's ========================= */

export async function updatePhotoAction(
  projectId: string,
  photoId: string,
  patch: Partial<Pick<WeddingPhoto, "favorite" | "selectedForAlbum" | "status">>,
): Promise<TrouwstudioActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  try {
    await updateWeddingPhoto(projectId, photoId, patch);
    await refreshProjectCounters(projectId);
    revalidateProject(projectId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Opslaan mislukt." };
  }
}

export type BulkPhotoAction =
  | "favoriet"
  | "favoriet_uit"
  | "album_toevoegen"
  | "album_verwijderen"
  | "goedkeuren"
  | "afkeuren"
  | "voorstel_accepteren"
  | "voorstel_weigeren"
  | "verwijderen";

export async function bulkPhotoAction(
  projectId: string,
  photoIds: string[],
  action: BulkPhotoAction,
): Promise<TrouwstudioActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  if (photoIds.length === 0) return { ok: false, error: "Geen foto's geselecteerd." };

  try {
    switch (action) {
      case "favoriet":
        await updateWeddingPhotosBulk(projectId, photoIds, { favorite: true });
        break;
      case "favoriet_uit":
        await updateWeddingPhotosBulk(projectId, photoIds, { favorite: false });
        break;
      case "album_toevoegen":
        await updateWeddingPhotosBulk(projectId, photoIds, { selectedForAlbum: true });
        break;
      case "album_verwijderen":
        await updateWeddingPhotosBulk(projectId, photoIds, { selectedForAlbum: false });
        break;
      case "goedkeuren":
        await updateWeddingPhotosBulk(projectId, photoIds, { status: "goedgekeurd" });
        break;
      case "afkeuren":
        await updateWeddingPhotosBulk(projectId, photoIds, { status: "afgekeurd" });
        break;
      case "voorstel_accepteren": {
        // Per foto: voorstel -> toegepaste instellingen (niet-destructief).
        for (const photoId of photoIds) {
          const photo = await getWeddingPhoto(projectId, photoId);
          if (!photo?.adjustmentProposal) continue;
          await updateWeddingPhoto(projectId, photoId, {
            appliedAdjustments: photo.adjustmentProposal,
            adjustmentProposal: undefined,
            status: "goedgekeurd",
          });
        }
        break;
      }
      case "voorstel_weigeren":
        await updateWeddingPhotosBulk(projectId, photoIds, {
          adjustmentProposal: undefined,
          status: "geupload",
        });
        break;
      case "verwijderen":
        await deleteWeddingPhotos(projectId, photoIds);
        break;
    }
    await refreshProjectCounters(projectId);
    revalidateProject(projectId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Bulkactie mislukt." };
  }
}

/* ========================= Analyse ========================= */

/**
 * Analyseert een batch foto's met de geconfigureerde provider (Claude vision
 * of, zonder API-key, de duidelijk gelabelde Demonstratiemodus). Verwerkt de
 * batch sequentieel binnen de action; de client stuurt batches van
 * settings.batchSize en toont per foto de voortgang.
 */
export async function analyzePhotosAction(
  projectId: string,
  photoIds: string[],
): Promise<TrouwstudioActionResult<{ analyzed: number; failed: number; provider: string }>> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const project = await getWeddingProject(projectId);
  if (!project) return { ok: false, error: "Project niet gevonden." };
  const settings = await getTrouwstudioSettings();
  const provider = resolveAnalysisProvider(settings);

  const ids = photoIds.slice(0, Math.max(1, settings.batchSize));
  await updateWeddingPhotosBulk(projectId, ids, { status: "wordt_geanalyseerd" });
  await updateWeddingProject(projectId, { status: "analyse_bezig" });

  let analyzed = 0;
  let failed = 0;
  for (const photoId of ids) {
    const photo = await getWeddingPhoto(projectId, photoId);
    if (!photo) continue;
    try {
      const analysis = await provider.analyzePhoto({ photo, editingStyle: project.editingStyle });
      const lowConfidence = analysis.confidence < settings.confidenceThreshold;
      const reviewRequired = analysis.reviewRequired || lowConfidence;
      const autoApplied = settings.autoOptimize && !reviewRequired && provider.id !== "mock";
      await updateWeddingPhoto(projectId, photoId, {
        analysis: { ...analysis, reviewRequired },
        adjustmentProposal: autoApplied ? undefined : analysis.adjustmentProposal,
        appliedAdjustments: autoApplied ? analysis.adjustmentProposal : photo.appliedAdjustments,
        status: autoApplied ? "goedgekeurd" : "voorstel_beschikbaar",
      });
      analyzed += 1;
    } catch (err) {
      failed += 1;
      await updateWeddingPhoto(projectId, photoId, {
        status: "fout",
        errorMessage: err instanceof Error ? err.message : "Analyse mislukt.",
      });
    }
  }

  const remaining = (await listWeddingPhotos(projectId)).some((p) =>
    ["wacht_op_analyse", "wordt_geanalyseerd"].includes(p.status),
  );
  const needsReview = (await listWeddingPhotos(projectId)).some((p) => p.analysis?.reviewRequired && p.status === "voorstel_beschikbaar");
  await updateWeddingProject(projectId, {
    status: remaining ? "analyse_bezig" : needsReview ? "controle_nodig" : "fotos_toegevoegd",
  });
  await refreshProjectCounters(projectId);
  revalidateProject(projectId);
  return { ok: true, data: { analyzed, failed, provider: provider.id } };
}

/* ========================= Editor ========================= */

export async function saveAdjustmentsAction(
  projectId: string,
  photoId: string,
  adjustments: Partial<PhotoAdjustments>,
  crop?: CropConfiguration | null,
): Promise<TrouwstudioActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  try {
    await updateWeddingPhoto(projectId, photoId, {
      appliedAdjustments: cleanAdjustments(adjustments),
      crop: crop ?? undefined,
      status: "handmatig_aangepast",
    });
    await refreshProjectCounters(projectId);
    revalidateProject(projectId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Opslaan mislukt." };
  }
}

/** Terug naar origineel: verwijdert alle niet-destructieve instellingen. */
export async function resetPhotoAction(projectId: string, photoId: string): Promise<TrouwstudioActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  try {
    await updateWeddingPhoto(projectId, photoId, {
      appliedAdjustments: undefined,
      adjustmentProposal: undefined,
      crop: undefined,
      processedUrl: undefined,
      status: "geupload",
    });
    await refreshProjectCounters(projectId);
    revalidateProject(projectId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Terugzetten mislukt." };
  }
}

/**
 * Rendert de toegepaste instellingen server-side (sharp) naar een definitief
 * beeld naast het origineel; het origineel blijft altijd bewaard.
 */
export async function renderPhotoAction(
  projectId: string,
  photoId: string,
): Promise<TrouwstudioActionResult<{ processedUrl: string }>> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  const photo = await getWeddingPhoto(projectId, photoId);
  if (!photo) return { ok: false, error: "Foto niet gevonden." };
  const settings = await getTrouwstudioSettings();
  try {
    const result = await imageProcessingProvider.exportImage({
      originalUrl: photo.originalUrl,
      adjustments: photo.appliedAdjustments ?? NEUTRAL_ADJUSTMENTS,
      crop: photo.crop,
      jpegQuality: settings.exportJpegQuality,
      storagePathPrefix: `trouwstudio/${projectId}/processed`,
    });
    await updateWeddingPhoto(projectId, photoId, { processedUrl: result.url, status: "afgewerkt" });
    await refreshProjectCounters(projectId);
    revalidateProject(projectId);
    return { ok: true, data: { processedUrl: result.url } };
  } catch (err) {
    await updateWeddingPhoto(projectId, photoId, {
      status: "fout",
      errorMessage: err instanceof Error ? err.message : "Renderen mislukt.",
    });
    return { ok: false, error: "Renderen mislukt. Probeer het opnieuw." };
  }
}

/* ========================= Album ========================= */

const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export async function generateAlbumAction(
  projectId: string,
  input: {
    title: string;
    subtitle?: string;
    quote?: string;
    foreword?: string;
    personalMessage?: string;
    templateId: string;
    accentColor?: string;
    chapters?: WeddingAlbumChapter[];
  },
): Promise<TrouwstudioActionResult<{ albumId: string }>> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  const project = await getWeddingProject(projectId);
  if (!project) return { ok: false, error: "Project niet gevonden." };
  const template = getAlbumTemplate(input.templateId);
  if (!template.available) return { ok: false, error: "Deze template is nog niet beschikbaar." };
  const accentColor =
    typeof input.accentColor === "string" && HEX_COLOR.test(input.accentColor.trim())
      ? input.accentColor.trim()
      : undefined;

  const photos = await listWeddingPhotos(projectId);
  if (!photos.some((p) => p.selectedForAlbum)) {
    return { ok: false, error: "Selecteer eerst foto's voor het trouwboek (tab AI-selectie of Foto's)." };
  }

  try {
    const layout = buildAlbumLayout({
      project,
      photos,
      template,
      chapters: input.chapters,
      title: str(input.title, 120),
      subtitle: str(input.subtitle, 160) || undefined,
      quote: str(input.quote, 400) || undefined,
      foreword: str(input.foreword, 3000) || undefined,
    });
    const existing = await getWeddingAlbum(projectId);
    const album: WeddingAlbum = {
      id: existing?.id ?? `album-${projectId}`,
      projectId,
      title: str(input.title, 120) || `${project.partnerOneName} & ${project.partnerTwoName}`,
      subtitle: str(input.subtitle, 160) || undefined,
      templateId: template.id,
      accentColor,
      language: project.language,
      quote: str(input.quote, 400) || undefined,
      personalMessage: str(input.personalMessage, 1000) || undefined,
      foreword: str(input.foreword, 3000) || undefined,
      photographerName: project.photographerName,
      chapters: layout.chapters,
      pages: layout.pages,
      status: "draft",
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveWeddingAlbum(album);
    await updateWeddingProject(projectId, { status: "album_in_opmaak" });
    revalidateProject(projectId);
    return { ok: true, data: { albumId: album.id } };
  } catch {
    return { ok: false, error: "Album genereren mislukt." };
  }
}

export async function saveAlbumAction(album: WeddingAlbum): Promise<TrouwstudioActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  if (!album?.projectId || !album?.id) return { ok: false, error: "Ongeldig album." };
  try {
    await saveWeddingAlbum(album);
    if (album.status === "ready") {
      await updateWeddingProject(album.projectId, { status: "klaar_voor_export" });
    }
    revalidateProject(album.projectId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Album opslaan mislukt." };
  }
}

export async function markAlbumExportedAction(projectId: string): Promise<TrouwstudioActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  try {
    const album = await getWeddingAlbum(projectId);
    if (album) await saveWeddingAlbum({ ...album, status: "exported" });
    await updateWeddingProject(projectId, { status: "afgerond" });
    revalidateProject(projectId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Status bijwerken mislukt." };
  }
}

/* ========================= Instellingen ========================= */

export async function saveTrouwstudioSettingsAction(
  patch: Partial<TrouwstudioSettings>,
): Promise<TrouwstudioActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  try {
    const clean: Partial<TrouwstudioSettings> = {
      defaultLanguage: str(patch.defaultLanguage, 5) || "nl",
      defaultEditingStyle: (WEDDING_EDITING_STYLES as readonly string[]).includes(str(patch.defaultEditingStyle))
        ? (str(patch.defaultEditingStyle) as WeddingEditingStyle)
        : "warm-romantisch",
      defaultTemplateId: str(patch.defaultTemplateId, 60) || "ivory-editorial",
      confirmBulkActions: Boolean(patch.confirmBulkActions),
      aiProvider: patch.aiProvider === "mock" ? "mock" : "claude",
      analysisModel: str(patch.analysisModel, 60) || "claude-opus-4-8",
      confidenceThreshold: Math.min(1, Math.max(0, Number(patch.confidenceThreshold) || 0.75)),
      autoOptimize: Boolean(patch.autoOptimize),
      generativeEnabled: false, // nog geen generatief model aangesloten
      batchSize: Math.min(10, Math.max(1, Math.round(Number(patch.batchSize) || 4))),
      maxConcurrent: Math.min(4, Math.max(1, Math.round(Number(patch.maxConcurrent) || 2))),
      exportJpegQuality: Math.min(100, Math.max(50, Math.round(Number(patch.exportJpegQuality) || 90))),
      exportFilenameTemplate: str(patch.exportFilenameTemplate, 80) || "{project}-{nummer}",
    };
    await setTrouwstudioSettings(clean);
    revalidatePath("/admin/trouwstudio/instellingen");
    return { ok: true };
  } catch {
    return { ok: false, error: "Instellingen opslaan mislukt." };
  }
}

/* ========================= Status helper ========================= */

export async function setProjectStatusAction(
  projectId: string,
  status: WeddingProjectStatus,
): Promise<TrouwstudioActionResult> {
  return updateProjectAction(projectId, { status });
}
