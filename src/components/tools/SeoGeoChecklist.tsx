"use client";

import { useMemo, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { SeoGeoChecklistCategory } from "@/data/tools";

type SeoGeoChecklistProps = {
  categories: SeoGeoChecklistCategory[];
};

type DownloadState = "idle" | "loading" | "error";

export function SeoGeoChecklist({ categories }: SeoGeoChecklistProps) {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");

  const total = useMemo(
    () => categories.reduce((sum, category) => sum + category.items.length, 0),
    [categories],
  );
  const progress = total === 0 ? 0 : Math.round((checkedIds.length / total) * 100);

  function toggleItem(id: string) {
    setCheckedIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
    );
  }

  async function downloadPdf() {
    setDownloadState("loading");
    try {
      const response = await fetch("/api/tools/seo-geo-checklist/pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ checkedItemIds: checkedIds }),
      });
      if (!response.ok) throw new Error("PDF kon niet worden gemaakt");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "visualvibe-seo-geo-checklist.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setDownloadState("idle");
    } catch {
      setDownloadState("error");
    }
  }

  return (
    <section className="rounded-[30px] border border-white/[0.1] bg-white/[0.025] p-4 shadow-[0_30px_110px_-70px_rgba(255,117,0,0.9)] sm:p-6 lg:p-8">
      <div className="mb-7 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#ff8a2a]">
            Interactieve checklist
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Vink af wat klaar is
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/62">
            Gebruik deze lijst als snelle SEO/GEO-controle voor een belangrijke pagina. Vink je
            punten aan en download daarna je eigen VisualVibe PDF.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.09] bg-black/25 p-4">
          <div className="mb-2 flex items-end justify-between gap-4">
            <span className="text-sm font-semibold text-white/70">Voortgang</span>
            <span className="text-3xl font-extrabold text-green-400">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-green-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/45">
            {checkedIds.length} van {total} punten aangevinkt
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-[22px] border border-white/[0.09] bg-black/18 p-5"
          >
            <h3 className="text-lg font-bold text-white">{category.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{category.intro}</p>

            <div className="mt-5 space-y-3">
              {category.items.map((item) => {
                const checked = checkedIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className="group flex cursor-pointer gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition-colors hover:border-[rgba(255,117,0,0.35)] hover:bg-white/[0.04]"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleItem(item.id)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#ff7500]"
                    />
                    <span>
                      <span className="block text-sm font-bold leading-snug text-white/88">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-white/52">
                        {item.help}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-7 flex flex-col gap-3 rounded-[22px] border border-[rgba(255,117,0,0.24)] bg-[radial-gradient(circle_at_top_left,rgba(255,117,0,0.14),rgba(255,255,255,0.025)_55%,rgba(0,0,0,0.18)_100%)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-white">Download als VisualVibe PDF</h3>
          <p className="mt-1 text-sm text-white/58">
            Met branding, datum, gekozen actiepunten en VisualVibe-links.
          </p>
          {downloadState === "error" && (
            <p className="mt-2 text-sm font-semibold text-red-300">
              De PDF kon niet worden gemaakt. Probeer het opnieuw.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={downloadPdf}
          disabled={downloadState === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-amber-500 px-5 py-3 text-sm font-bold text-white shadow-[0_16px_38px_-18px_rgba(255,90,0,0.9)] transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
        >
          {downloadState === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          Download als VisualVibe PDF
        </button>
      </div>
    </section>
  );
}
