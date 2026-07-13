"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BookOpen, Check, Download, FileDown, Loader2, RefreshCw } from "lucide-react";
import {
  getLayoutDefinition,
  resolveAlbumTemplate,
} from "@/features/trouwstudio/templates/ivoryEditorial";
import { markAlbumExportedAction } from "@/lib/admin/trouwstudioActions";
import type { WeddingPhoto } from "@/features/trouwstudio/types";
import type { ProjectTabProps } from "./shared";

// Export-tab: controleert het album (lege kaders, ontbrekende foto's,
// resolutie), toont de PDF-grootte en rendert de PDF client-side. Bij de hoge
// kwaliteit kan het bestand optioneel worden verkleind (50-100%) met een
// live grootteschatting. @react-pdf/renderer wordt pas bij het exporteren
// dynamisch geladen zodat de adminbundel licht blijft.

type PdfQuality = "preview" | "hoog";

type CheckRow = {
  id: string;
  ok: boolean;
  label: string;
  details?: string[];
};

const EXPORT_DPI = 200;
/** Kwaliteit van de server-side gereduceerde beelden bij export < 100%. */
const REDUCE_JPEG_QUALITY = 85;

function sanitizeFilename(name: string): string {
  const clean = name
    .replace(/[\\/:*?"<>|#%&{}]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s/g, "-");
  return clean || "trouwboek";
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ExportTab({ project, photos, album, setAlbum, openTab }: ProjectTabProps) {
  const [busyQuality, setBusyQuality] = useState<PdfQuality | null>(null);
  const [lastQuality, setLastQuality] = useState<PdfQuality | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState<number | null>(null);
  /** Reductiepercentage voor de hoge-kwaliteitexport (50-100). */
  const [reduction, setReduction] = useState(100);

  // Vorige blob-URL vrijgeven bij vervanging en bij unmount.
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const photosById = useMemo(() => {
    const map: Record<string, WeddingPhoto> = {};
    for (const photo of photos) map[photo.id] = photo;
    return map;
  }, [photos]);

  const usedPhotoIds = useMemo(() => {
    if (!album) return [];
    const ids = new Set<string>();
    for (const page of album.pages) {
      for (const frame of page.frames) {
        if (frame.photoId && photosById[frame.photoId]) ids.add(frame.photoId);
      }
    }
    return [...ids];
  }, [album, photosById]);

  // Basisgrootte voor de schatting: som van de originele bestandsgroottes van
  // de gebruikte foto's (+ overhead). De hoge-kwaliteit-PDF embeddt die beelden.
  const baseHoogBytes = useMemo(() => {
    const sum = usedPhotoIds.reduce((total, id) => total + (photosById[id]?.sizeBytes ?? 0), 0);
    return sum * 1.04 + 40 * 1024;
  }, [usedPhotoIds, photosById]);

  const scale = reduction / 100;
  // JPEG-bestandsgrootte schaalt bij benadering met het pixeloppervlak (schaal²).
  const estimatedHoogBytes = reduction >= 100 ? baseHoogBytes : baseHoogBytes * scale * scale;

  const checks = useMemo<CheckRow[]>(() => {
    if (!album) return [];
    const template = resolveAlbumTemplate(album.templateId, album.accentColor);

    let emptyFrames = 0;
    let missingPhotos = 0;
    const lowRes: string[] = [];

    album.pages.forEach((page, pageIndex) => {
      for (const frame of page.frames) {
        if (!frame.photoId) {
          emptyFrames += 1;
          continue;
        }
        const photo = photosById[frame.photoId];
        if (!photo) {
          missingPhotos += 1;
          continue;
        }
        // Benodigde breedte in pixels bij EXPORT_DPI voor dit kader (na reductie).
        const neededPx = Math.round(((frame.width / 100) * template.pageWidth * EXPORT_DPI) / 25.4);
        if (photo.width * scale < neededPx) {
          lowRes.push(`${photo.filename} (pagina ${pageIndex + 1}): ${Math.round(photo.width * scale)}px breed, ${neededPx}px nodig`);
        }
      }
    });

    const coverPage = album.pages.find((page) => getLayoutDefinition(template, page.layoutId)?.kind === "cover") ?? album.pages[0];
    const coverTitle = coverPage?.textBlocks.find((block) => block.role === "title")?.text.trim() ?? "";

    const lowResDetails = lowRes.slice(0, 10);
    if (lowRes.length > 10) lowResDetails.push(`en ${lowRes.length - 10} meer`);

    return [
      {
        id: "paginas",
        ok: album.pages.length > 0,
        label:
          album.pages.length > 0
            ? `${album.pages.length} pagina's in het album`
            : "Het album heeft nog geen pagina's",
      },
      {
        id: "lege-kaders",
        ok: emptyFrames === 0,
        label: emptyFrames === 0 ? "Alle fotokaders zijn gevuld" : `${emptyFrames} lege fotokaders`,
      },
      {
        id: "ontbrekende-fotos",
        ok: missingPhotos === 0,
        label:
          missingPhotos === 0
            ? "Alle gekoppelde foto's bestaan nog"
            : `${missingPhotos} kaders verwijzen naar verwijderde foto's`,
      },
      {
        id: "covertitel",
        ok: coverTitle.length > 0,
        label: coverTitle.length > 0 ? "Covertitel is ingevuld" : "De covertitel op de cover ontbreekt",
      },
      {
        id: "resolutie",
        ok: lowRes.length === 0,
        label:
          lowRes.length === 0
            ? `Resolutie is voldoende voor ${EXPORT_DPI} dpi${reduction < 100 ? ` bij ${reduction}%` : ""}`
            : `${lowRes.length} kaders hebben mogelijk te weinig resolutie (${EXPORT_DPI} dpi${reduction < 100 ? ` bij ${reduction}%` : ""})`,
        details: lowRes.length > 0 ? lowResDetails : undefined,
      },
    ];
  }, [album, photosById, scale, reduction]);

  if (!album) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-10 text-center">
        <BookOpen className="mx-auto h-8 w-8 text-white/30" />
        <h2 className="mt-3 text-lg font-semibold text-white">Nog geen trouwboek</h2>
        <p className="mt-1 text-sm text-white/50">
          Genereer eerst een album in de tab Trouwboek; daarna kan je het hier exporteren als PDF.
        </p>
        <button
          type="button"
          onClick={() => openTab("trouwboek")}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
        >
          <BookOpen className="h-4 w-4" />
          Naar de albumbuilder
        </button>
      </div>
    );
  }

  const runExport = async (quality: PdfQuality) => {
    setBusyQuality(quality);
    setLastQuality(quality);
    setError(null);
    try {
      const mod = await import("@/features/trouwstudio/pdf/AlbumPdfDocument");
      const template = resolveAlbumTemplate(album.templateId, album.accentColor);

      // Alle beelden via het same-origin reduce-endpoint, dat altijd JPEG
      // teruggeeft: @react-pdf/renderer kan geen webp embedden (preview- en
      // thumb-URL's zijn webp), en zo hoeft de renderer ook niet cross-origin
      // naar Storage te fetchen. Preview vraagt een lichte 1600px-JPEG; de hoge
      // kwaliteit gebruikt het volledige (of via de schuif gereduceerde) beeld.
      const base = (id: string) =>
        `/api/admin/trouwstudio/reduce?projectId=${encodeURIComponent(project.id)}&photoId=${encodeURIComponent(id)}`;
      const photoUrlOverride: Record<string, string> = {};
      for (const id of usedPhotoIds) {
        if (quality === "preview") {
          photoUrlOverride[id] = `${base(id)}&w=1600&q=72`;
        } else if (reduction < 100) {
          photoUrlOverride[id] = `${base(id)}&scale=${scale.toFixed(3)}&q=${REDUCE_JPEG_QUALITY}`;
        } else {
          photoUrlOverride[id] = `${base(id)}&scale=1&q=92`;
        }
      }

      const blob = await mod.generateAlbumPdf({ album, template, photosById, quality, photoUrlOverride });
      const url = URL.createObjectURL(blob);
      setPdfSize(blob.size);

      const suffix = quality === "hoog" && reduction < 100 ? `-${reduction}pct` : "";
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitizeFilename(album.title)}${suffix}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setPdfUrl(url);
      if (quality === "hoog" && reduction >= 100) {
        await markAlbumExportedAction(project.id);
        setAlbum((prev) => (prev ? { ...prev, status: "exported" } : prev));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF genereren mislukt.");
    } finally {
      setBusyQuality(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Controles */}
      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold text-white">Controle voor export</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {checks.map((check) => (
            <li key={check.id} className="text-sm">
              <div className="flex items-start gap-2.5">
                {check.ok ? (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                )}
                <span className={check.ok ? "text-white/70" : "text-amber-200"}>{check.label}</span>
              </div>
              {check.details && (
                <ul className="ml-6 mt-1 list-disc pl-4 text-xs text-white/45">
                  {check.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Exportknoppen */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-sm font-semibold text-white">Digitale preview-PDF</h3>
          <p className="mt-1 flex-1 text-xs leading-relaxed text-white/50">
            Snelle PDF met previewbeelden, ideaal om digitaal door te bladeren of met het koppel te delen.
          </p>
          <button
            type="button"
            onClick={() => runExport("preview")}
            disabled={busyQuality !== null}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busyQuality === "preview" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Preview-PDF genereren
          </button>
        </div>
        <div className="flex flex-col rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-sm font-semibold text-white">Hoge kwaliteit (drukvoorbereiding)</h3>
          <p className="mt-1 text-xs leading-relaxed text-white/50">
            Gebruikt de afgewerkte beelden (of het origineel als er geen bewerking is) in de kwaliteit en het
            type van de fotograaf.
          </p>

          {/* Reductie */}
          <div className="mt-3 rounded-md border border-white/10 bg-white/[0.02] p-3">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="reduction" className="font-medium text-white/80">
                PDF verkleinen
              </label>
              <span className="text-white/60">{reduction}%</span>
            </div>
            <input
              id="reduction"
              type="range"
              min={50}
              max={100}
              step={5}
              value={reduction}
              onChange={(e) => setReduction(Number(e.target.value))}
              className="mt-2 w-full accent-amber-500"
            />
            <div className="mt-1 flex items-center justify-between text-[11px] text-white/45">
              <span>50% (kleiner bestand)</span>
              <span>100% (volledige kwaliteit)</span>
            </div>
            <p className="mt-2 text-xs text-white/60">
              Geschatte bestandsgrootte: <span className="font-semibold text-white/80">≈ {formatBytes(estimatedHoogBytes)}</span>
              {reduction < 100 && <span className="text-white/45"> (beelden worden server-side herschaald)</span>}
            </p>
          </div>

          <p className="mt-3 rounded-md border border-sky-500/25 bg-sky-500/10 p-3 text-xs leading-relaxed text-sky-200">
            Dit is een voorbereidend drukbestand: bleed, CMYK-kleurprofielen, rugbreedte en drukkersspecificaties zijn
            nog niet inbegrepen. Gebruik dit nog niet als definitief print-ready bestand.
          </p>
          <button
            type="button"
            onClick={() => runExport("hoog")}
            disabled={busyQuality !== null}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busyQuality === "hoog" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            Hoge kwaliteit genereren{reduction < 100 ? ` (${reduction}%)` : ""}
          </button>
        </div>
      </section>

      {/* Voortgang / fout / voorbeeld */}
      {busyQuality !== null && (
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm text-white/70">
          <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
          PDF wordt opgebouwd... Grote albums en reductie kunnen even duren.
        </div>
      )}
      {error && busyQuality === null && (
        <div className="rounded-lg border border-red-500/25 bg-red-500/10 p-5">
          <p className="flex items-center gap-2 text-sm text-red-200">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </p>
          <button
            type="button"
            onClick={() => runExport(lastQuality ?? "preview")}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Opnieuw proberen
          </button>
        </div>
      )}
      {pdfUrl && busyQuality === null && (
        <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white">Voorbeeld van de laatste export</h3>
            {pdfSize !== null && (
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                Bestandsgrootte: <span className="font-semibold text-white">{formatBytes(pdfSize)}</span>
              </span>
            )}
          </div>
          <iframe title="PDF-voorbeeld" src={pdfUrl} className="h-[70vh] w-full rounded-lg border border-white/10" />
        </section>
      )}
    </div>
  );
}
