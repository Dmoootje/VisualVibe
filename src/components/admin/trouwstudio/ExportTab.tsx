"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BookOpen, Check, Download, FileDown, Loader2, RefreshCw } from "lucide-react";
import { getAlbumTemplate, getLayoutDefinition } from "@/features/trouwstudio/templates/ivoryEditorial";
import { markAlbumExportedAction } from "@/lib/admin/trouwstudioActions";
import type { WeddingPhoto } from "@/features/trouwstudio/types";
import type { ProjectTabProps } from "./shared";

// Export-tab: controleert het album (lege kaders, ontbrekende foto's,
// resolutie) en rendert de PDF client-side. @react-pdf/renderer wordt pas
// bij het exporteren dynamisch geladen zodat de adminbundel licht blijft.

type PdfQuality = "preview" | "hoog";

type CheckRow = {
  id: string;
  ok: boolean;
  label: string;
  details?: string[];
};

const EXPORT_DPI = 200;

function sanitizeFilename(name: string): string {
  const clean = name
    .replace(/[\\/:*?"<>|#%&{}]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s/g, "-");
  return clean || "trouwboek";
}

export function ExportTab({ project, photos, album, setAlbum, openTab }: ProjectTabProps) {
  const [busyQuality, setBusyQuality] = useState<PdfQuality | null>(null);
  const [lastQuality, setLastQuality] = useState<PdfQuality | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

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

  const checks = useMemo<CheckRow[]>(() => {
    if (!album) return [];
    const template = getAlbumTemplate(album.templateId);

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
        // Benodigde breedte in pixels bij EXPORT_DPI voor dit kader.
        const neededPx = Math.round(((frame.width / 100) * template.pageWidth * EXPORT_DPI) / 25.4);
        if (photo.width < neededPx) {
          lowRes.push(`${photo.filename} (pagina ${pageIndex + 1}): ${photo.width}px breed, ${neededPx}px nodig`);
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
            ? `Resolutie is voldoende voor ${EXPORT_DPI} dpi`
            : `${lowRes.length} kaders hebben mogelijk te weinig resolutie (${EXPORT_DPI} dpi)`,
        details: lowRes.length > 0 ? lowResDetails : undefined,
      },
    ];
  }, [album, photosById]);

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
      const template = getAlbumTemplate(album.templateId);
      const blob = await mod.generateAlbumPdf({ album, template, photosById, quality });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitizeFilename(album.title)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setPdfUrl(url);
      if (quality === "hoog") {
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
            Gebruikt de afgewerkte beelden (of het origineel als er geen bewerking is) op volle resolutie.
          </p>
          <p className="mt-3 flex-1 rounded-md border border-sky-500/25 bg-sky-500/10 p-3 text-xs leading-relaxed text-sky-200">
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
            Hoge kwaliteit genereren
          </button>
        </div>
      </section>

      {/* Voortgang / fout / voorbeeld */}
      {busyQuality !== null && (
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm text-white/70">
          <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
          PDF wordt opgebouwd... Grote albums kunnen even duren.
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
          <h3 className="mb-3 text-sm font-semibold text-white">Voorbeeld van de laatste export</h3>
          <iframe title="PDF-voorbeeld" src={pdfUrl} className="h-[70vh] w-full rounded-lg border border-white/10" />
        </section>
      )}
    </div>
  );
}
