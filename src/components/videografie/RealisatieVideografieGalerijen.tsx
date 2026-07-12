"use client";

import { useState } from "react";
import { youtubeChannelUrl } from "@/config/videografie.config";
import type { VideoItem } from "@/lib/youtube";
import { ArrowRight, PlayGlyph, YouTubeGlyph } from "./icons";
import { VideoCard, VideoLightbox, VideoThumb } from "./videoUi";

type Category = { name: string; description: string };

const DEFAULT_DESC = "Een greep uit ons videowerk, van bedrijfsvideo en promo tot aftermovie en wervingsvideo.";

/**
 * Public videografie realisaties (design_handoff_realisaties_videografie): a
 * featured video highlight, then a category filter (Alle + the 8 videografie
 * categories with live counts + empty state) above a grid of video cards. Every
 * tile opens the shared YouTube popup player, which cycles through all videos.
 * Featured = videos[0]; the grid shows the rest. Videos come from YouTube.
 */
export function RealisatieVideografieGalerijen({
  videos,
  categories,
}: {
  videos: VideoItem[];
  categories: Category[];
}) {
  const [idx, setIdx] = useState<number | null>(null);
  const [cat, setCat] = useState("Alle");

  const featured = videos[0];
  const pool = videos.slice(1);
  const filtered = cat === "Alle" ? pool : pool.filter((v) => v.category === cat);
  const countFor = (name: string) => pool.filter((v) => v.category === name).length;
  const activeDesc = cat === "Alle" ? DEFAULT_DESC : categories.find((c) => c.name === cat)?.description ?? DEFAULT_DESC;
  const showEmpty = cat !== "Alle" && filtered.length === 0;

  return (
    <>
      {/* ===== FEATURED - uitgelichte video ===== */}
      <section className="relative overflow-hidden pb-14 pt-8 sm:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-120px] top-10 z-0 h-[620px] w-[760px] max-w-full bg-[radial-gradient(circle_at_60%_45%,rgba(255,90,0,0.12),transparent_64%)]"
        />

        <div className="container relative z-[2] mx-auto grid items-center gap-9 px-2.5 sm:px-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* LINKS: video-preview */}
          <button
            type="button"
            onClick={() => setIdx(0)}
            aria-label={`Speel ${featured.title} af`}
            className="vg-playring group relative block aspect-video w-full overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#141210] text-left"
          >
            <VideoThumb id={featured.id} alt={featured.title} className="vg-jit absolute inset-0 h-full w-full object-cover" />
            <div aria-hidden="true" className="vg-scan pointer-events-none absolute left-0 right-0 top-0 z-[1] h-[26px]" style={{ background: "linear-gradient(180deg,transparent,rgba(255,200,150,.35),rgba(255,255,255,.55),rgba(255,140,60,.3),transparent)", mixBlendMode: "screen" }} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.1),transparent 40%,rgba(10,10,10,.55))" }} />
            <span className="absolute left-4 top-4 z-[2] inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,7,6,.62)] px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-[0.08em] text-[#FF9A45] backdrop-blur">
              UITGELICHT
            </span>
            {featured.duration && (
              <span className="absolute bottom-4 right-4 z-[2] rounded-md bg-[rgba(8,7,6,.72)] px-2.5 py-1 font-mono text-[11px] font-bold text-white">
                {featured.duration}
              </span>
            )}
            <span className="vg-playbox pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[74px] w-[74px]" style={{ transform: "translate(-50%,-50%)" }}>
              <span className="vg-ring r1" />
              <span className="vg-ring r2" />
              <span className="vg-ring r3" />
              <span className="vg-play absolute inset-0 flex items-center justify-center rounded-full shadow-[0_18px_42px_-14px_rgba(255,90,0,0.9)]" style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}>
                <PlayGlyph size={30} className="text-white" />
              </span>
            </span>
          </button>

          {/* RECHTS: copy */}
          <div>
            <div className="mb-[22px] inline-flex items-center gap-2.5 rounded-full border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.1)] px-[15px] py-2 font-mono text-xs font-bold tracking-[0.1em] text-[#FF9A45]">
              <span className="vvw-liveDot h-[7px] w-[7px] rounded-full bg-[#FF7A00]" />
              UITGELICHTE VIDEO
            </div>
            <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.12em] text-white/40">
              <YouTubeGlyph size={13} />
              {featured.client ?? "VisualVibe"}
            </div>
            <h2 className="font-sora mb-5 text-[clamp(30px,9vw,42px)] font-extrabold leading-[1.03] tracking-[-0.025em] text-white sm:text-[44px]">
              {featured.title}
            </h2>
            {featured.description && (
              <p className="mb-[26px] text-[16.5px] leading-[1.65] text-white/[0.68]">{featured.description}</p>
            )}
            {featured.tags && featured.tags.length > 0 && (
              <div className="mb-[30px] flex flex-wrap gap-[7px]">
                {featured.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/[0.09] bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white/60">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => setIdx(0)}
              className="vvw-visitLink inline-flex items-center gap-2 rounded-xl border border-[rgba(255,122,0,0.35)] bg-[rgba(255,122,0,0.12)] px-[26px] py-3.5 text-[15px] font-bold text-white"
            >
              Bekijk video
              <PlayGlyph size={15} className="text-[#FF9A45]" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== MEER VIDEO'S ===== */}
      <section className="container relative z-[2] mx-auto px-2.5 sm:px-4 pb-24">
        <div className="mb-7">
          <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">Meer video&apos;s</p>
          <h2 className="font-sora text-[28px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-[34px]">
            Ons werk in beweging
          </h2>
          <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-white/60">{activeDesc}</p>
        </div>

        {/* filter chips */}
        <div className="mb-7 flex flex-wrap gap-2">
          {[{ name: "Alle", count: pool.length }, ...categories.map((c) => ({ name: c.name, count: countFor(c.name) }))].map((chip) => {
            const on = chip.name === cat;
            return (
              <button
                key={chip.name}
                type="button"
                onClick={() => setCat(chip.name)}
                className={`vg-seg inline-flex items-center gap-2 rounded-[10px] border px-[15px] py-[9px] text-[13px] font-bold ${
                  on
                    ? "border-transparent text-white shadow-[0_10px_24px_-12px_rgba(255,90,0,0.8)]"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                }`}
                style={on ? { background: "linear-gradient(90deg,#FF3B2E,#FF7A00)" } : undefined}
              >
                {chip.name}
                <span className={`font-mono text-[11px] ${on ? "text-white/80" : "text-white/35"}`}>{chip.count}</span>
              </button>
            );
          })}
        </div>

        {showEmpty ? (
          <div className="flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.1)] text-[#FF9A45]">
              <PlayGlyph size={20} />
            </span>
            <h3 className="font-sora text-xl font-bold text-white">Binnenkort video&apos;s in deze categorie</h3>
            <p className="max-w-md text-sm leading-relaxed text-white/55">{activeDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v, k) => {
              const globalIndex = videos.indexOf(v);
              return <VideoCard key={v.id} video={v} index={k} onOpen={() => setIdx(globalIndex)} />;
            })}

            {/* Meer op YouTube tile */}
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="vg-vcard group relative flex min-h-[220px] flex-col items-start justify-between overflow-hidden rounded-[18px] border border-[rgba(255,122,0,0.28)] p-6"
              style={{ background: "radial-gradient(120% 160% at 100% 0%,rgba(255,90,0,.16),transparent 60%),rgba(255,255,255,.02)" }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)]">
                <YouTubeGlyph size={22} />
              </span>
              <div>
                <div className="font-sora text-[20px] font-extrabold tracking-[-0.01em] text-white">Meer op YouTube</div>
                <div className="mt-1.5 max-w-[240px] text-[13.5px] leading-relaxed text-white/60">
                  Bekijk het volledige kanaal met al ons videowerk.
                </div>
                <span className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.05em] text-[#FF9A45]">
                  NAAR HET KANAAL <ArrowRight size={13} strokeWidth={2.4} />
                </span>
              </div>
            </a>
          </div>
        )}
      </section>

      <VideoLightbox videos={videos} index={idx} onIndex={setIdx} onClose={() => setIdx(null)} />
    </>
  );
}
