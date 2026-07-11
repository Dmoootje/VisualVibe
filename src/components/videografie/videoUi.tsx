"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ytThumb, type VideoItem } from "@/lib/youtube";
import { ChevronLeft, ChevronRight, Close, PlayGlyph, YouTubeGlyph } from "./icons";

/** YouTube thumbnail that falls back to hqdefault when maxres is missing. */
export function VideoThumb({ id, alt, className }: { id: string; alt: string; className?: string }) {
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

/** A 16:9 video card: thumbnail, category badge, duration, play button, progress bar, title + client. */
export function VideoCard({
  video,
  index,
  onOpen,
}: {
  video: VideoItem;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Speel ${video.title} af`}
      style={{ ["--i" as string]: index } as React.CSSProperties}
      className="vvw-caseRow vg-vcard group relative flex flex-col overflow-hidden rounded-[18px] border border-white/[0.09] bg-white/[0.02] text-left"
    >
      <div className="relative aspect-video overflow-hidden bg-[#141210]">
        <VideoThumb id={video.id} alt={video.title} className="vg-vthumb absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.15),transparent 40%,rgba(10,10,10,.72))" }} />
        <span className="absolute left-3.5 top-3.5 z-[2] inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,7,6,.62)] px-[11px] py-1.5 font-mono text-[10px] font-bold tracking-[0.06em] text-[#FF9A45] backdrop-blur">
          {video.category}
        </span>
        {video.duration && (
          <span className="absolute bottom-3 right-3 z-[2] rounded-md bg-[rgba(8,7,6,.72)] px-2 py-1 font-mono text-[10.5px] font-bold text-white">
            {video.duration}
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
        <div className="font-sora text-[17px] font-bold leading-[1.25] text-white">{video.title}</div>
        <div className="mt-2 inline-flex items-center gap-[7px] font-mono text-[11px] font-semibold text-white/50">
          <YouTubeGlyph size={12} />
          {video.client ?? "VisualVibe"}
        </div>
      </div>
    </button>
  );
}

/**
 * Fullscreen YouTube popup player. Renders when `index` is a number; cycles
 * through `videos` with prev/next, a thumbnail rail and keyboard (arrows/Esc).
 * The iframe only mounts while open and remounts per video so playback starts
 * on open and each navigation, and stops on close. Portaled to document.body.
 */
export function VideoLightbox({
  videos,
  index,
  onIndex,
  onClose,
}: {
  videos: VideoItem[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const open = index !== null;
  const len = videos.length;
  const safeIdx = index === null ? 0 : Math.min(index, Math.max(0, len - 1));
  const current = videos[safeIdx];
  const step = (d: number) => {
    if (len === 0) return;
    onIndex((safeIdx + d + len) % len);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, len, safeIdx]);

  if (!mounted || !open || !current) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col text-white" role="dialog" aria-modal="true" aria-label={`Video ${current.title}`}>
      <div className="vg-lbbg absolute inset-0 backdrop-blur-[10px]" style={{ background: "radial-gradient(120% 90% at 50% 0%,rgba(255,90,0,.1),transparent 55%),rgba(4,4,4,.95)" }} onClick={onClose} />

      <div className="vg-lbcard relative z-[1] mx-auto flex h-full w-[min(1080px,100%)] max-w-full flex-col justify-center px-4 pb-[22px] pt-5 sm:px-[clamp(16px,3vw,40px)]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3.5 flex flex-none flex-col items-start justify-between gap-2.5 sm:flex-row">
          <div className="min-w-0">
            <span className="mb-[11px] inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-[#FF9A45]">
              {current.category}
            </span>
            <h3 className="font-sora text-[24px] font-extrabold tracking-[-0.02em] text-white">{current.title}</h3>
            <p className="mt-1.5 font-mono text-[13.5px] text-white/55">{current.client ?? "VisualVibe"}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Sluiten" className="vg-lbx flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-white/[0.14] bg-white/[0.04] text-white/75">
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

        {len > 1 && (
          <>
            <div className="mt-4 flex flex-none items-center justify-between gap-3.5">
              <button type="button" onClick={() => step(-1)} className="vg-lbarrow inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.04] px-[18px] text-sm font-bold text-white">
                <ChevronLeft size={18} />Vorige
              </button>
              <span className="font-mono text-xs font-bold text-white/60">{safeIdx + 1} / {len}</span>
              <button type="button" onClick={() => step(1)} className="vg-lbarrow inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.04] px-[18px] text-sm font-bold text-white">
                Volgende<ChevronRight size={18} />
              </button>
            </div>

            <div className="mt-3.5 flex flex-none justify-center gap-2.5 overflow-x-auto p-0.5">
              {videos.map((v, k) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onIndex(k)}
                  aria-label={`Ga naar ${v.title}`}
                  className={`vg-lbmini relative h-[59px] w-[104px] flex-none overflow-hidden rounded-[9px] border-2 border-white/[0.12] bg-[#0b0a09] ${k === safeIdx ? "on" : ""}`}
                >
                  <VideoThumb id={v.id} alt={v.title} className="h-full w-full object-cover" />
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
  );
}
