"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FiIcon } from "@/components/fotografie";
import type { DroneCategory, DroneMedia } from "@/config/drone.config";

const ALL = "Alle";

function ytThumb(id: string): string {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}
function thumbOf(m: DroneMedia): string {
  return m.kind === "video" && m.youtubeId ? ytThumb(m.youtubeId) : m.src ?? "";
}

function PlayIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}
function ExpandIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

/**
 * Realisaties > Drone & FPV: a featured item, category filter, and a grid of
 * drone photos + videos. Every tile opens a lightbox that embeds the YouTube
 * player for videos or shows the image for photos. Keyboard + thumbnail nav.
 */
export function RealisatieDroneMedia({
  media,
  categories,
}: {
  media: DroneMedia[];
  categories: DroneCategory[];
}) {
  const [cat, setCat] = useState<string>(ALL);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const len = media.length;
  const step = (d: number) => setIdx((i) => (i + d + len) % len);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % len);
      else if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + len) % len);
      else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, len]);

  const openAt = (i: number) => {
    setIdx(i);
    setOpen(true);
  };

  const filters = useMemo(() => {
    return [ALL, ...categories.map((c) => c.name)].map((name) => ({
      name,
      count: name === ALL ? media.length : media.filter((m) => m.category === name).length,
    }));
  }, [categories, media]);

  const filtered = useMemo(
    () => media.map((m, gi) => ({ m, gi })).filter((x) => cat === ALL || x.m.category === cat),
    [media, cat]
  );

  const catDesc =
    categories.find((c) => c.name === cat)?.description ??
    "Filter op categorie of bekijk alle beelden - klik om te openen.";

  const featured = media[0];
  const current = media[idx];

  return (
    <>
      {/* ===== FEATURED ===== */}
      <section className="relative px-4 pb-16 pt-14">
        <div className="container relative z-[2] mx-auto grid items-center gap-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <button
            type="button"
            onClick={() => openAt(0)}
            aria-label={`Open ${featured.title}`}
            className="fg-gcard group relative block aspect-video w-full overflow-hidden rounded-[20px] border border-[rgba(255,122,0,0.22)] bg-[#141210] shadow-[0_40px_90px_-34px_rgba(255,80,0,0.5)]"
          >
            <Image
              className="fg-gimg object-cover"
              src={thumbOf(featured)}
              alt={featured.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 780px"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 100% at 50% 42%,transparent 48%,rgba(6,8,6,.7))" }} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-3.5">
              <span className="absolute left-0 top-0 h-[18px] w-[18px] border-l-2 border-t-2 border-white/75" />
              <span className="absolute right-0 top-0 h-[18px] w-[18px] border-r-2 border-t-2 border-white/75" />
              <span className="absolute bottom-0 left-0 h-[18px] w-[18px] border-b-2 border-l-2 border-white/75" />
              <span className="absolute bottom-0 right-0 h-[18px] w-[18px] border-b-2 border-r-2 border-white/75" />
            </div>
            <span className="absolute left-4 top-3.5 z-[2] inline-flex items-center gap-[7px] rounded-lg bg-[rgba(6,8,6,.6)] px-[11px] py-1.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-white backdrop-blur">
              <span className="fg-rec h-[7px] w-[7px] rounded-full bg-[#FF3B2E]" />UITGELICHT
            </span>
            <span className="fg-giris absolute left-1/2 top-1/2 z-[2] flex h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_18px_42px_-14px_rgba(255,90,0,0.9)]" style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}>
              <PlayIcon size={30} />
            </span>
          </button>

          <div>
            <div className="mb-[22px] inline-flex items-center gap-2.5 rounded-full border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.1)] px-[15px] py-2 font-mono text-xs font-bold tracking-[0.1em] text-[#FF9A45]">
              <span className="vvw-liveDot h-[7px] w-[7px] rounded-full bg-[#FF7A00]" />UITGELICHTE REALISATIE
            </div>
            <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.12em] text-white/40">
              <FiIcon id="video" size={14} className="text-[#FF9A45]" />
              {featured.category}
            </div>
            <h2 className="font-sora mb-5 text-[clamp(30px,9vw,42px)] font-extrabold leading-[1.05] tracking-[-0.025em] text-white sm:text-[42px]">
              {featured.title}
            </h2>
            <p className="mb-[30px] max-w-[460px] text-[16.5px] leading-[1.65] text-white/[0.68]">
              Vloeiende luchtbeelden die de schaal en context van het project tonen - gedraaid met een gecertificeerde drone in 4K.
            </p>
            <button
              type="button"
              onClick={() => openAt(0)}
              className="vvw-visitLink inline-flex items-center gap-[9px] rounded-xl border border-[rgba(255,122,0,0.35)] bg-[rgba(255,122,0,0.12)] px-[26px] py-3.5 text-[15px] font-bold text-white"
            >
              Bekijk realisatie <PlayIcon size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* ===== GRID + FILTER ===== */}
      <section className="container relative z-[2] mx-auto px-4 pb-28">
        <div className="mb-7 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">Alle realisaties</p>
            <h2 className="font-sora text-[28px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-[34px]">
              Foto én video, vanuit de lucht
            </h2>
          </div>
          <p className="max-w-[340px] text-[15px] leading-relaxed text-white/55">{catDesc}</p>
        </div>

        <div className="mb-7 flex flex-wrap gap-2">
          {filters.map((f) => {
            const on = f.name === cat;
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => setCat(f.name)}
                className={
                  on
                    ? "inline-flex items-center rounded-[10px] border border-transparent bg-gradient-to-r from-red-500 to-[#FF7A00] px-[15px] py-[9px] text-[13px] font-bold text-white shadow-[0_10px_24px_-12px_rgba(255,90,0,0.8)]"
                    : "inline-flex items-center rounded-[10px] border border-white/10 bg-white/[0.03] px-[15px] py-[9px] text-[13px] font-bold text-white/[0.62] transition-colors hover:border-[rgba(255,122,0,0.4)] hover:text-white"
                }
              >
                {f.name}
                <span className="ml-1.5 font-mono text-[11px] font-bold opacity-55">{f.count}</span>
              </button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((x, k) => {
              const video = x.m.kind === "video";
              return (
                <button
                  key={`${x.m.title}-${x.gi}`}
                  type="button"
                  onClick={() => openAt(x.gi)}
                  aria-label={`Open ${x.m.title}`}
                  style={{ ["--i" as string]: k } as React.CSSProperties}
                  className="vvw-caseRow fg-gcard group relative aspect-[16/11] overflow-hidden rounded-[18px] border border-white/[0.09] bg-[#141210] text-left"
                >
                  <Image
                    className="fg-gimg object-cover"
                    src={thumbOf(x.m)}
                    alt={x.m.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.12),transparent 38%,rgba(10,10,10,.78))" }} />
                  <span className="absolute left-3.5 top-3.5 z-[2] inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,7,6,.62)] px-[11px] py-1.5 font-mono text-[10px] font-bold tracking-[0.05em] text-[#FF9A45] backdrop-blur">
                    <FiIcon id={x.m.kind} size={12} />{x.m.category}
                  </span>
                  <span
                    className="fg-giris absolute left-1/2 top-1/2 z-[2] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_16px_36px_-12px_rgba(255,90,0,0.7)] backdrop-blur"
                    style={{
                      background: video ? "linear-gradient(135deg,#FF3B2E,#FF7A00)" : "rgba(8,7,6,.55)",
                      border: video ? "none" : "1px solid rgba(255,122,0,.5)",
                    }}
                  >
                    {video ? <PlayIcon /> : <ExpandIcon />}
                  </span>
                  <div className="absolute inset-x-4 bottom-3.5 z-[2]">
                    <div className="font-sora text-[17px] font-bold text-white">{x.m.title}</div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[18px] border border-dashed border-white/[0.14] bg-white/[0.02] px-8 py-[52px] text-center">
            <span className="mb-[18px] inline-flex h-14 w-14 items-center justify-center rounded-[15px] border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.1)] text-[#FF9A45]">
              <FiIcon id="drone" size={26} strokeWidth={1.7} />
            </span>
            <h3 className="font-sora mb-2.5 text-[22px] font-bold text-white">Binnenkort werk in deze categorie</h3>
            <p className="mx-auto max-w-[420px] text-[15px] leading-relaxed text-white/55">
              {catDesc} We voegen hier binnenkort beelden aan toe.
            </p>
          </div>
        )}
      </section>

      {/* ===== LIGHTBOX ===== */}
      {mounted && open && current && createPortal(
        <div className="fixed inset-0 z-[90] flex flex-col text-white" role="dialog" aria-modal="true" aria-label={current.title}>
          <div className="fg-lbbg absolute inset-0 backdrop-blur-[10px]" style={{ background: "radial-gradient(120% 90% at 50% 0%,rgba(255,90,0,.1),transparent 55%),rgba(4,4,4,.95)" }} onClick={() => setOpen(false)} />
          <div className="fg-lbcard relative z-[1] mx-auto flex h-full w-[min(1080px,100%)] max-w-full flex-col justify-center px-4 pb-[22px] pt-5 sm:px-[clamp(16px,3vw,40px)]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3.5 flex flex-none flex-col items-start justify-between gap-2.5 sm:flex-row">
              <div className="min-w-0">
                <span className="mb-[11px] inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-[#FF9A45]">
                  {current.category}
                </span>
                <h3 className="font-sora text-2xl font-extrabold tracking-[-0.02em] text-white">{current.title}</h3>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Sluiten" className="fg-lbx flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-white/[0.14] bg-white/[0.04] text-white/75">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="relative flex max-h-[64vh] flex-none items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_40px_90px_-30px_rgba(255,80,0,0.4)]" style={{ aspectRatio: "16 / 9" }}>
              {current.kind === "video" && current.youtubeId ? (
                <iframe
                  key={current.youtubeId}
                  src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={current.title}
                  allow="accelerated-sensors; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.src} alt={current.title} className="h-full w-full object-contain" />
              )}
            </div>

            <div className="mt-4 flex flex-none items-center justify-between gap-3.5">
              <button type="button" onClick={() => step(-1)} className="fg-lbarrow inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.04] px-[18px] text-sm font-bold text-white">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>Vorige
              </button>
              <span className="font-mono text-xs font-bold text-white/60">{idx + 1} / {len}</span>
              <button type="button" onClick={() => step(1)} className="fg-lbarrow inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.04] px-[18px] text-sm font-bold text-white">
                Volgende<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>

            <div className="mt-3.5 flex flex-none justify-center gap-2.5 overflow-x-auto p-0.5">
              {media.map((m, k) => (
                <button
                  key={`${m.title}-${k}`}
                  type="button"
                  onClick={() => setIdx(k)}
                  aria-label={`Ga naar ${m.title}`}
                  className={`fg-lbthumb relative h-[59px] w-[104px] flex-none overflow-hidden rounded-[9px] border-2 bg-[#0b0a09] ${k === idx ? "on border-[#FF7A00]" : "border-white/[0.12]"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbOf(m)} alt="" className="h-full w-full object-cover" />
                  {m.kind === "video" && (
                    <span className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(255,90,0,0.9)]">
                      <PlayIcon size={11} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
