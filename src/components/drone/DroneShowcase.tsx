"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { dronePhotos, droneVideos, type DronePhoto, type DroneVideo } from "@/data/droneShowcase";
import { ChevronLeft, ChevronRight, Close, DrIcon, Expand, PlayGlyph } from "./icons";

const ytThumb = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

/** YouTube thumbnail (next/image fill) that falls back to hqdefault when maxres
 * is missing. The parent must be positioned with a fixed aspect. */
function YtThumb({ id, alt, sizes, className }: { id: string; alt: string; sizes: string; className?: string }) {
  const [src, setSrc] = useState(ytThumb(id));
  return (
    <Image src={src} alt={alt} fill sizes={sizes} onError={() => setSrc(`https://img.youtube.com/vi/${id}/hqdefault.jpg`)} className={className} />
  );
}

const sprocket = { background: "repeating-linear-gradient(90deg,#0b0a09 0 13px,rgba(255,255,255,.14) 13px 24px)" };

type Selection = { grp: "foto" | "video"; idx: number };

/**
 * Drone realisaties split (design_handoff_drone_fpv_service): a Dronefotografie
 * film contact-sheet + a Dronevideografie FPV-monitor band, both opening one
 * combined photo/video lightbox (prev/next within the active group, thumbnails,
 * keyboard). The lightbox mounts the media only while open so videos play on
 * open + each nav and stop on close.
 */
export function DroneShowcase({
  photos = dronePhotos,
  videos = droneVideos,
}: {
  photos?: DronePhoto[];
  videos?: DroneVideo[];
} = {}) {
  const [sel, setSel] = useState<Selection | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const open = sel !== null;
  const isVideo = sel?.grp === "video";
  const list = isVideo ? videos : photos;
  const safeIdx = sel ? Math.min(sel.idx, list.length - 1) : 0;

  const step = (d: number) =>
    setSel((s) => (s ? { ...s, idx: (s.idx + d + list.length) % list.length } : s));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Escape") setSel(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isVideo, list.length]);

  return (
    <section id="dr-werk" className="container relative z-[2] mx-auto scroll-mt-24 px-2.5 sm:px-4 pb-14 pt-6">
      <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#FF9A45]">Realisaties</p>
          <h2 className="font-sora text-[30px] font-extrabold leading-[1.06] tracking-[-0.025em] text-white sm:text-[38px]">
            Foto én video, vanuit de lucht
          </h2>
        </div>
        <p className="max-w-[330px] text-[15px] leading-relaxed text-white/55">
          Links onze dronefotografie, rechts onze dronevideografie. Klik om te openen.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* FOTO band: film contact-sheet */}
        <div className="relative rounded-[22px] border border-white/[0.09] bg-white/[0.02] p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-[46px] w-[46px] items-center justify-center rounded-xl border border-[rgba(255,122,0,0.24)] bg-[rgba(255,122,0,0.1)] text-[#FF9A45]">
                <DrIcon id="foto" size={23} />
              </span>
              <div>
                <div className="font-sora text-[20px] font-bold text-white">Dronefotografie</div>
                <div className="mt-0.5 text-[13px] text-white/50">Luchtfoto&apos;s met een uniek perspectief</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,122,0,0.22)] bg-[rgba(255,122,0,0.08)] px-3 py-[7px] font-mono text-[11px] font-bold tracking-[0.06em] text-[#FF9A45]">
              RAW · 48MP · HOGE RESOLUTIE
            </span>
          </div>
          <div className="overflow-hidden rounded-[14px] border border-white/[0.07] bg-[#0b0a09]">
            <div aria-hidden="true" className="h-4" style={sprocket} />
            <div className="grid grid-cols-2 gap-2.5 p-2.5 sm:grid-cols-3 sm:gap-3 sm:p-3">
              {photos.map((p, k) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => setSel({ grp: "foto", idx: k })}
                  aria-label={`Open ${p.title}`}
                  className="dr-mcard group relative aspect-[3/2] overflow-hidden rounded-[9px] border border-white/10 bg-[#141210] text-left"
                >
                  <Image
                    className="dr-mimg object-cover"
                    src={p.src}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1400px) 33vw, 440px"
                  />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,transparent 52%,rgba(10,10,10,.75))" }} />
                  <span className="absolute left-2 top-2 z-[2] rounded-[5px] bg-[rgba(8,7,6,.6)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/85">
                    FRAME {String(k + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute left-1/2 top-1/2 z-[2] h-[42px] w-[42px] -translate-x-1/2 -translate-y-1/2">
                    <span className="dr-play absolute inset-0 flex items-center justify-center rounded-full border border-[rgba(255,122,0,0.5)] bg-[rgba(8,7,6,.55)] text-[#FF9A45] backdrop-blur">
                      <Expand size={19} />
                    </span>
                  </span>
                  <span className="absolute bottom-2 left-2.5 z-[2] font-mono text-[10.5px] font-bold text-white">{p.label}</span>
                </button>
              ))}
            </div>
            <div aria-hidden="true" className="h-4" style={sprocket} />
          </div>
        </div>

        {/* VIDEO band: FPV monitor */}
        <div className="relative rounded-[22px] border border-[rgba(255,122,0,0.2)] p-6" style={{ background: "radial-gradient(130% 130% at 100% 0%,rgba(255,90,0,.08),transparent 60%),rgba(255,255,255,.02)" }}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-[46px] w-[46px] items-center justify-center rounded-xl border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.14)] text-[#FF9A45]">
                <DrIcon id="video" size={23} />
              </span>
              <div>
                <div className="font-sora text-[20px] font-bold text-white">Dronevideografie</div>
                <div className="mt-0.5 text-[13px] text-white/50">Vloeiende luchtbeelden &amp; FPV</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,122,0,0.22)] bg-[rgba(255,122,0,0.08)] px-3 py-[7px] font-mono text-[11px] font-bold tracking-[0.06em] text-[#FF9A45]">
              <span className="dr-recdot h-[7px] w-[7px] rounded-full bg-[#FF3B2E]" />FPV · 4K · LIVE FEED
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {videos.map((v, k) => (
              <button
                key={v.yt}
                type="button"
                onClick={() => setSel({ grp: "video", idx: k })}
                aria-label={`Speel ${v.title} af`}
                className="dr-mcard group relative aspect-video overflow-hidden rounded-[14px] border border-white/[0.09] bg-[#141210] text-left"
              >
                <YtThumb id={v.yt} alt={v.title} sizes="(max-width: 640px) 100vw, (max-width: 1400px) 50vw, 660px" className="dr-mimg object-cover" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(130% 100% at 50% 45%,transparent 52%,rgba(6,8,6,.72))" }} />
                {/* FPV HUD corners */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-3 z-[2]">
                  <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-white/75" />
                  <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-white/75" />
                  <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-white/75" />
                  <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-white/75" />
                </div>
                <span className="absolute left-3.5 top-3.5 z-[3] inline-flex items-center rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,7,6,.62)] px-[11px] py-1.5 font-mono text-[10px] font-bold tracking-[0.06em] text-[#FF9A45] backdrop-blur">
                  {v.tag}
                </span>
                <span className="absolute right-3.5 top-3.5 z-[3] inline-flex items-center gap-1.5 rounded-md bg-[rgba(8,7,6,.6)] px-2 py-1 font-mono text-[9.5px] font-bold text-white backdrop-blur">
                  <span className="dr-recdot h-1.5 w-1.5 rounded-full bg-[#FF3B2E]" />REC
                </span>
                <span className="absolute left-1/2 top-1/2 z-[3] h-14 w-14 -translate-x-1/2 -translate-y-1/2">
                  <span className="dr-play absolute inset-0 flex items-center justify-center rounded-full text-white shadow-[0_16px_36px_-12px_rgba(255,90,0,0.9)]" style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}>
                    <PlayGlyph size={24} />
                  </span>
                </span>
                <div className="absolute bottom-3 left-3.5 right-3.5 z-[3]">
                  <div className="font-sora text-base font-bold text-white">{v.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== COMBINED LIGHTBOX ===== */}
      {mounted && open && sel && createPortal(
        <div className="fixed inset-0 z-[90] flex flex-col text-white" role="dialog" aria-modal="true">
          <div className="vg-lbbg absolute inset-0 backdrop-blur-[10px]" style={{ background: "radial-gradient(120% 90% at 50% 0%,rgba(255,90,0,.1),transparent 55%),rgba(4,4,4,.95)" }} onClick={() => setSel(null)} />

          <div className="vg-lbcard relative z-[1] mx-auto flex h-full w-[min(1080px,100%)] max-w-full flex-col justify-center px-4 pb-[22px] pt-5 sm:px-[clamp(16px,3vw,40px)]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3.5 flex flex-none flex-col items-start justify-between gap-2.5 sm:flex-row">
              <div className="min-w-0">
                <span className="mb-[11px] inline-flex items-center rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-[#FF9A45]">
                  {isVideo ? videos[safeIdx].tag : photos[safeIdx].label}
                </span>
                <h3 className="font-sora text-[24px] font-extrabold tracking-[-0.02em] text-white">
                  {isVideo ? videos[safeIdx].title : photos[safeIdx].title}
                </h3>
              </div>
              <button type="button" onClick={() => setSel(null)} aria-label="Sluiten" className="vg-lbx flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-white/[0.14] bg-white/[0.04] text-white/75">
                <Close size={18} />
              </button>
            </div>

            <div className="relative flex aspect-video max-h-[64vh] flex-none items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_40px_90px_-30px_rgba(255,80,0,0.4)]">
              {isVideo ? (
                <iframe
                  key={videos[safeIdx].yt}
                  src={`https://www.youtube.com/embed/${videos[safeIdx].yt}?autoplay=1&rel=0&modestbranding=1`}
                  title={videos[safeIdx].title}
                  allow="accelerated-sensors; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photos[safeIdx].src} alt={photos[safeIdx].title} className="h-full w-full object-contain" />
              )}
            </div>

            <div className="mt-4 flex flex-none items-center justify-between gap-3.5">
              <button type="button" onClick={() => step(-1)} className="vg-lbarrow inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.04] px-[18px] text-sm font-bold text-white">
                <ChevronLeft size={18} />Vorige
              </button>
              <span className="font-mono text-xs font-bold text-white/60">{safeIdx + 1} / {list.length}</span>
              <button type="button" onClick={() => step(1)} className="vg-lbarrow inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.04] px-[18px] text-sm font-bold text-white">
                Volgende<ChevronRight size={18} />
              </button>
            </div>

            <div className="mt-3.5 flex flex-none justify-center gap-2.5 overflow-x-auto p-0.5">
              {list.map((it, k) => {
                const vid = "yt" in it;
                return (
                  <button
                    key={vid ? it.yt : it.src}
                    type="button"
                    onClick={() => setSel({ grp: sel.grp, idx: k })}
                    aria-label={`Ga naar ${it.title}`}
                    className={`vg-lbmini relative h-[59px] w-[104px] flex-none overflow-hidden rounded-[9px] border-2 border-white/[0.12] bg-[#0b0a09] ${k === safeIdx ? "on" : ""}`}
                  >
                    {vid ? (
                      <YtThumb id={it.yt} alt="" sizes="104px" className="object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.src} alt="" className="h-full w-full object-cover" />
                    )}
                    {vid && (
                      <span className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(255,90,0,0.9)]">
                        <PlayGlyph size={11} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}
