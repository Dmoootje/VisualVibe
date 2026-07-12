"use client";

import { useState, type ReactNode } from "react";
import type { VideoItem } from "@/lib/youtube";
import {
  Camera,
  Check,
  Fullscreen,
  PlayGlyph,
  Volume,
  YouTubeGlyph,
} from "./icons";
import { VideoCard, VideoLightbox, VideoThumb } from "./videoUi";

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

  const filtered = cat === "Alle" ? videos : videos.filter((v) => v.category === cat);
  const hero = videos[0];

  const openHero = () => {
    setCat("Alle");
    setIdx(0);
  };

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative z-[2] pb-12 pt-24 sm:pb-14">
        <div className="container mx-auto grid items-center gap-8 px-2.5 sm:px-4 lg:grid-cols-[1fr_560px] lg:gap-14">
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
                  <VideoThumb id={hero.id} alt={hero.title} className="vg-jit absolute inset-0 h-full w-full object-cover" />
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
                    {hero.duration ?? "0:30"}
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
                        <span className="font-mono text-[11px] text-white/85">00:12 / {hero.duration ?? "00:30"}</span>
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
      <section id="video-gallery" className="container relative z-[2] mx-auto scroll-mt-24 px-2.5 sm:px-4 pb-8 pt-6">
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
            <VideoCard key={v.id} video={v} index={i} onOpen={() => setIdx(i)} />
          ))}
        </div>
      </section>

      <VideoLightbox videos={filtered} index={idx} onIndex={setIdx} onClose={() => setIdx(null)} />
    </>
  );
}
