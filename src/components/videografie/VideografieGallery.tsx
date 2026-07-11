"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ytThumb, type VideoItem } from "@/lib/youtube";
import {
  ArrowRight,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Close,
  Fullscreen,
  PlayGlyph,
  Volume,
  YouTubeGlyph,
} from "./icons";

/** YouTube thumbnail that falls back to hqdefault when maxres is missing. */
function Thumb({ id, alt, className }: { id: string; alt: string; className?: string }) {
  const [src, setSrc] = useState(ytThumb(id));
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setSrc(`https://img.youtube.com/vi/${id}/hqdefault.jpg`)}
      className={className}
    />
  );
}

/**
 * Videografie hero player + video gallery + popup lightbox (design_handoff_
 * videografie_service). One client island so the hero player and the gallery
 * cards share the lightbox state. The hero copy is server-rendered and passed
 * in as `children`. Videos come from YouTube (playlists -> filter tabs).
 */
export function VideografieGallery({
  videos,
  filters,
  channelUrl,
  children,
}: {
  videos: VideoItem[];
  filters: string[];
  channelUrl: string;
  children: ReactNode;
}) {
  const [cat, setCat] = useState("Alle");
  const [idx, setIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const filtered = cat === "Alle" ? videos : videos.filter((v) => v.category === cat);
  const open = idx !== null;
  const safeIdx = idx === null ? 0 : Math.min(idx, Math.max(0, filtered.length - 1));
  const current = filtered[safeIdx] ?? videos[0];
  const hero = videos[0];

  useEffect(() => setMounted(true), []);

  const step = (d: number) =>
    setIdx((i) => {
      const len = filtered.length;
      if (i === null || len === 0) return i;
      return (i + d + len) % len;
    });

  // Keyboard nav + scroll lock while the lightbox is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Escape") setIdx(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered.length]);

  const openHero = () => {
    setCat("Alle");
    setIdx(0);
  };

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative z-[2] px-4 pb-12 pt-8 sm:px-8 sm:pb-14 sm:pt-12">
        <div className="mx-auto grid max-w-[1300px] items-center gap-8 lg:grid-cols-[1fr_560px] lg:gap-14">
          <div>{children}</div>

          {/* video-player visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative h-[300px] w-full max-w-[560px] flex-none sm:h-[400px]">
              <div
                aria-hidden="true"
                className="vg-spin pointer-events-none absolute left-1/2 top-[48%] z-0 h-[440px] w-[540px] max-w-full rounded-full blur-[52px]"
                style={{
                  transform: "translate(-50%,-50%)",
                  background:
                    "conic-gradient(from 0deg,transparent 0deg,rgba(255,122,0,.28) 80deg,transparent 190deg,rgba(255,90,0,.18) 290deg,transparent 360deg)",
                }}
              />

              <button
                type="button"
                onClick={openHero}
                aria-label={`Speel ${hero.title} af`}
                className="vg-playring absolute left-2 top-3 z-[1] block w-full max-w-[544px] rounded-[20px] p-[1.5px] text-left sm:top-[26px]"
                style={{
                  background:
                    "linear-gradient(150deg,rgba(255,150,60,.7),rgba(255,90,0,.25) 55%,rgba(255,255,255,.05))",
                  boxShadow: "0 44px 90px -34px rgba(255,80,0,.6)",
                }}
              >
                <div className="relative aspect-video overflow-hidden rounded-[19px] border border-white/5 bg-[#0e0d0c]">
                  <Thumb id={hero.id} alt={hero.title} className="vg-jit absolute inset-0 h-full w-full object-cover" />
                  <div
                    aria-hidden="true"
                    className="vg-scan pointer-events-none absolute left-0 right-0 top-0 z-[1] h-[26px]"
                    style={{
                      background:
                        "linear-gradient(180deg,transparent,rgba(255,200,150,.35),rgba(255,255,255,.55),rgba(255,140,60,.3),transparent)",
                      mixBlendMode: "screen",
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "radial-gradient(120% 90% at 50% 42%,transparent 45%,rgba(6,6,6,.72))" }}
                  />
                  {/* top chips */}
                  <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-[7px] rounded-lg bg-[rgba(8,7,6,.62)] px-[11px] py-1.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-white backdrop-blur">
                    <span className="vvw-liveDot h-2 w-2 rounded-full bg-[#FF3B2E]" />4K · OPNAME
                  </span>
                  <span className="absolute right-3.5 top-3.5 rounded-lg bg-[rgba(8,7,6,.62)] px-2.5 py-1.5 font-mono text-[10.5px] font-bold text-[#FF9A45] backdrop-blur">
                    {current.duration ?? hero.duration ?? "0:30"}
                  </span>
                  {/* center play */}
                  <span className="vg-playbox pointer-events-none absolute left-1/2 top-[44%] z-[2] h-[74px] w-[74px]" style={{ transform: "translate(-50%,-50%)" }}>
                    <span className="vg-ring r1" />
                    <span className="vg-ring r2" />
                    <span className="vg-ring r3" />
                    <span className="vg-play absolute inset-0 flex items-center justify-center rounded-full shadow-[0_18px_42px_-14px_rgba(255,90,0,0.9)]" style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}>
                      <PlayGlyph size={30} className="text-white" />
                    </span>
                  </span>
                  {/* control bar */}
                  <div className="absolute bottom-3 left-3.5 right-3.5">
                    <div className="relative mb-[11px] h-[5px] rounded-full bg-white/20">
                      <span className="absolute left-0 top-0 bottom-0 w-[40%] rounded-full" style={{ background: "linear-gradient(90deg,#FF3B2E,#FF7A00)" }}>
                        <span className="absolute -right-[5px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,.6)]" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2.5 text-white">
                      <div className="flex items-center gap-3">
                        <PlayGlyph size={15} className="text-white" />
                        <Volume size={16} className="text-white" />
                        <span className="font-mono text-[11px] text-white/85">00:12 / {current.duration ?? "00:30"}</span>
                      </div>
                      <Fullscreen size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              </button>

              {/* floating chips */}
              <div className="vvw-bob pointer-events-none absolute right-[-8px] top-1.5 z-[3] flex items-center gap-2.5 rounded-[13px] border border-[rgba(255,122,0,0.22)] bg-[rgba(20,17,14,.92)] px-[15px] py-[11px] shadow-[0_18px_36px_-16px_rgba(0,0,0,0.85)] backdrop-blur">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.14)] text-[#FF9A45]">
                  <Camera size={19} />
                </span>
                <div>
                  <div className="font-sora text-[15px] font-extrabold leading-none text-white">4K · 60fps</div>
                  <div className="mt-0.5 text-[10px] text-white/50">cinema-kwaliteit</div>
                </div>
              </div>
              <div className="vvw-bob2 pointer-events-none absolute bottom-1.5 left-[-14px] z-[3] flex items-center gap-2.5 rounded-[13px] border border-[rgba(255,122,0,0.22)] bg-[rgba(20,17,14,.92)] px-[15px] py-[11px] shadow-[0_18px_36px_-16px_rgba(0,0,0,0.85)] backdrop-blur">
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-[rgba(90,196,125,0.16)]">
                  <Check size={13} className="text-[#5ac47d]" />
                </span>
                <span className="text-[13px] font-bold text-white">Concept tot montage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VIDEO GALLERY ===== */}
      <section id="video-gallery" className="relative z-[2] mx-auto max-w-[1300px] scroll-mt-24 px-4 pb-8 pt-6 sm:px-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#FF9A45]">Onze video&apos;s</p>
            <h2 className="font-sora text-[30px] font-extrabold leading-[1.06] tracking-[-0.025em] text-white sm:text-[38px]">
              Bekijk ons werk in beweging
            </h2>
          </div>
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="heroBtn inline-flex items-center gap-2.5 rounded-[11px] border border-white/[0.14] bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            <YouTubeGlyph size={17} />
            Alle video&apos;s op YouTube
          </a>
        </div>

        {/* filter tabs */}
        {filters.length > 2 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {filters.map((f) => {
              const on = f === cat;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setCat(f)}
                  className={`vg-seg inline-flex items-center rounded-[10px] border px-[17px] py-[9px] text-[13.5px] font-bold ${
                    on
                      ? "border-transparent text-white shadow-[0_10px_24px_-12px_rgba(255,90,0,0.8)]"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                  }`}
                  style={on ? { background: "linear-gradient(90deg,#FF3B2E,#FF7A00)" } : undefined}
                >
                  {f}
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Speel ${v.title} af`}
              style={{ ["--i" as string]: i } as React.CSSProperties}
              className="vvw-caseRow vg-vcard group relative flex flex-col overflow-hidden rounded-[18px] border border-white/[0.09] bg-white/[0.02] text-left"
            >
              <div className="relative aspect-video overflow-hidden bg-[#141210]">
                <Thumb id={v.id} alt={v.title} className="vg-vthumb absolute inset-0 h-full w-full object-cover" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.15),transparent 40%,rgba(10,10,10,.72))" }} />
                <span className="absolute left-3.5 top-3.5 z-[2] inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,7,6,.62)] px-[11px] py-1.5 font-mono text-[10px] font-bold tracking-[0.06em] text-[#FF9A45] backdrop-blur">
                  {v.category}
                </span>
                {v.duration && (
                  <span className="absolute bottom-3 right-3 z-[2] rounded-md bg-[rgba(8,7,6,.72)] px-2 py-1 font-mono text-[10.5px] font-bold text-white">
                    {v.duration}
                  </span>
                )}
                <span className="absolute left-1/2 top-1/2 z-[2] h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2">
                  <span className="vg-play absolute inset-0 flex items-center justify-center rounded-full shadow-[0_16px_36px_-12px_rgba(255,90,0,0.9)]" style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}>
                    <PlayGlyph size={24} className="text-white" />
                  </span>
                </span>
                <div className="absolute bottom-0 left-3 right-3 z-[2] h-1">
                  <span className="vg-vprog block h-full w-[28%] rounded-full" style={{ background: "linear-gradient(90deg,#FF3B2E,#FF7A00)" }} />
                </div>
              </div>
              <div className="px-[18px] pb-[18px] pt-4">
                <div className="font-sora text-[17px] font-bold leading-[1.25] text-white">{v.title}</div>
                <div className="mt-2 inline-flex items-center gap-[7px] font-mono text-[11px] font-semibold text-white/50">
                  <YouTubeGlyph size={12} />
                  {v.client ?? "VisualVibe"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ===== LIGHTBOX ===== */}
      {mounted && open && createPortal(
        <div className="fixed inset-0 z-[90] flex flex-col text-white" role="dialog" aria-modal="true" aria-label={`Video ${current.title}`}>
          <div className="vg-lbbg absolute inset-0 backdrop-blur-[10px]" style={{ background: "radial-gradient(120% 90% at 50% 0%,rgba(255,90,0,.1),transparent 55%),rgba(4,4,4,.95)" }} onClick={() => setIdx(null)} />

          <div className="vg-lbcard relative z-[1] mx-auto flex h-full w-[min(1080px,100%)] max-w-full flex-col justify-center px-4 pb-[22px] pt-5 sm:px-[clamp(16px,3vw,40px)]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3.5 flex flex-none flex-col items-start justify-between gap-2.5 sm:flex-row">
              <div className="min-w-0">
                <span className="mb-[11px] inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-[#FF9A45]">
                  {current.category}
                </span>
                <h3 className="font-sora text-[24px] font-extrabold tracking-[-0.02em] text-white">{current.title}</h3>
                <p className="mt-1.5 font-mono text-[13.5px] text-white/55">{current.client ?? "VisualVibe"}</p>
              </div>
              <button type="button" onClick={() => setIdx(null)} aria-label="Sluiten" className="vg-lbx flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-white/[0.14] bg-white/[0.04] text-white/75">
                <Close size={18} />
              </button>
            </div>

            <div className="relative aspect-video max-h-[64vh] flex-none overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_40px_90px_-30px_rgba(255,80,0,0.4)]">
              <iframe
                key={current.id}
                src={`https://www.youtube.com/embed/${current.id}?autoplay=1&rel=0&modestbranding=1`}
                title={current.title}
                allow="accelerated-sensors; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>

            {filtered.length > 1 && (
              <>
                <div className="mt-4 flex flex-none items-center justify-between gap-3.5">
                  <button type="button" onClick={() => step(-1)} className="vg-lbarrow inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.04] px-[18px] text-sm font-bold text-white">
                    <ChevronLeft size={18} />Vorige
                  </button>
                  <span className="font-mono text-xs font-bold text-white/60">{safeIdx + 1} / {filtered.length}</span>
                  <button type="button" onClick={() => step(1)} className="vg-lbarrow inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.04] px-[18px] text-sm font-bold text-white">
                    Volgende<ChevronRight size={18} />
                  </button>
                </div>

                <div className="mt-3.5 flex flex-none justify-center gap-2.5 overflow-x-auto p-0.5">
                  {filtered.map((v, k) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setIdx(k)}
                      aria-label={`Ga naar ${v.title}`}
                      className={`vg-lbmini relative h-[59px] w-[104px] flex-none overflow-hidden rounded-[9px] border-2 border-white/[0.12] bg-[#0b0a09] ${k === safeIdx ? "on" : ""}`}
                    >
                      <Thumb id={v.id} alt={v.title} className="h-full w-full object-cover" />
                      <span className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(255,90,0,0.9)]">
                        <PlayGlyph size={11} className="text-white" />
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
