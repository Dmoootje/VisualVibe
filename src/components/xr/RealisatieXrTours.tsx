"use client";

import "./xr.css";
import { useCallback, useEffect, useState } from "react";
import { Section, Container } from "@/components/ui";
import { matterportEmbedSrc, MATTERPORT_IFRAME_ALLOW, type MatterportTour } from "@/data/matterportTours";
import { XrIcon, ChevronLeft, ChevronRight, Close } from "./icons";

/**
 * Realisatie-grid voor 3D, VR & AR (design_handoff_3d_vr_ar): alle Matterport-
 * tours als CSS-poster-kaarten (fijn oranje raster, HUD-brackets, scanline).
 * Klikken opent een lightbox met de live, navigeerbare 360°-tour en prev/next
 * (toetsenbord: pijltjes navigeren, Esc sluit). De iframe remount per project
 * (key=id) zodat elke tour vers laadt.
 */
export function RealisatieXrTours({ tours }: { tours: MatterportTour[] }) {
  const [lbOpen, setLbOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const step = useCallback(
    (d: number) => setIdx((i) => (i + d + tours.length) % tours.length),
    [tours.length],
  );

  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Escape") setLbOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lbOpen, step]);

  const open = (k: number) => () => {
    setIdx(k);
    setLbOpen(true);
  };

  const cur = tours[idx];

  return (
    <Section orbs="tl-br">
      <Container>
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((t, k) => (
            <button
              key={t.id}
              type="button"
              onClick={open(k)}
              style={{ ["--i" as string]: k } as React.CSSProperties}
              className="xr-tcard block overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#0e0d0c] text-left"
              aria-label={`Open 3D-tour: ${t.title}`}
            >
              <div
                className="xr-tscene relative aspect-[4/3]"
                style={{
                  background:
                    "radial-gradient(120% 120% at 30% 12%,rgba(255,90,0,.16),transparent 55%),#100e0d",
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(rgba(255,122,0,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(255,122,0,.16) 1px,transparent 1px)",
                    backgroundSize: "34px 34px",
                    maskImage: "radial-gradient(70% 80% at 50% 45%,#000,transparent 82%)",
                    WebkitMaskImage: "radial-gradient(70% 80% at 50% 45%,#000,transparent 82%)",
                  }}
                />
                <div aria-hidden="true" className="pointer-events-none absolute inset-4">
                  <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-white/40" />
                  <span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-white/40" />
                  <span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-white/40" />
                  <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-white/40" />
                </div>
                <span className="absolute left-3.5 top-3 z-[3] inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,8,10,.62)] px-2.5 py-[5px] font-mono text-[10px] font-bold tracking-[0.06em] text-[#FF9A45] backdrop-blur">
                  MATTERPORT
                </span>
                <span className="absolute right-3.5 top-3 z-[3] rounded-[7px] bg-[rgba(8,8,10,.6)] px-[9px] py-[5px] font-mono text-[10px] font-bold text-[#5ac47d] backdrop-blur">
                  360°
                </span>
                <span className="absolute left-1/2 top-1/2 z-[3] h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2">
                  <span
                    className="xr-tplay flex h-full w-full items-center justify-center rounded-full text-white shadow-[0_16px_40px_-12px_rgba(255,90,0,0.9)]"
                    style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}
                  >
                    <XrIcon id="tour" size={24} strokeWidth={2} />
                  </span>
                </span>
                <div
                  className="xr-scan pointer-events-none absolute left-0 right-0 top-0 z-[2] h-7"
                  style={{ background: "linear-gradient(180deg,transparent,rgba(255,150,80,.2),transparent)" }}
                />
              </div>
              <div className="flex items-center justify-between gap-3.5 px-5 py-[17px]">
                <div className="min-w-0">
                  <div className="font-sora text-[16.5px] font-bold text-white">{t.title}</div>
                  <div className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] text-white/50">
                    <XrIcon id="pin" size={13} strokeWidth={1.8} />
                    {t.location}
                  </div>
                </div>
                <span className="inline-flex flex-none items-center gap-1.5 rounded-full border border-[rgba(255,122,0,0.22)] bg-[rgba(255,122,0,0.08)] px-[11px] py-1.5 font-mono text-[10px] font-bold text-[#FF9A45]">
                  <span className="vvw-liveDot h-1.5 w-1.5 rounded-full bg-[#FF7A00]" />
                  LIVE
                </span>
              </div>
            </button>
          ))}
        </div>
      </Container>

      {/* ===== LIGHTBOX (live matterport) ===== */}
      {lbOpen && cur && (
        <div className="fixed inset-0 z-[90] flex flex-col">
          <button
            type="button"
            aria-label="Sluiten"
            onClick={() => setLbOpen(false)}
            className="vg-lbbg absolute inset-0 cursor-default"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 0%,rgba(255,90,0,.1),transparent 55%),rgba(4,4,4,.95)",
              backdropFilter: "blur(10px)",
            }}
          />
          <div className="vg-lbcard relative z-[1] mx-auto flex h-full w-[min(1180px,100%)] flex-col justify-center px-[clamp(16px,3vw,40px)] pb-[22px] pt-5">
            <div className="mb-3.5 flex flex-none items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="mb-2.5 inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-[#FF9A45]">
                  MATTERPORT · 360° VIRTUAL TOUR
                </span>
                <h3 className="font-sora text-2xl font-extrabold tracking-[-0.02em] text-white">{cur.title}</h3>
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] text-white/50">
                  <XrIcon id="pin" size={14} strokeWidth={1.8} />
                  {cur.location}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLbOpen(false)}
                aria-label="Sluiten"
                className="vg-lbx flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-white/[0.14] bg-white/[0.04] text-white/75"
              >
                <Close size={18} strokeWidth={2.2} />
              </button>
            </div>
            <div className="relative aspect-video max-h-[68vh] flex-none overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_40px_90px_-30px_rgba(255,80,0,0.4)]">
              <iframe
                key={cur.id}
                src={matterportEmbedSrc(cur.id)}
                title={cur.title}
                allow={MATTERPORT_IFRAME_ALLOW}
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <div className="mt-4 flex flex-none items-center justify-between gap-3.5">
              <button
                type="button"
                onClick={() => step(-1)}
                className="vg-lbarrow inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.04] px-[18px] text-sm font-bold text-white"
              >
                <ChevronLeft size={18} strokeWidth={2.2} />
                Vorige
              </button>
              <span className="font-mono text-xs font-bold text-white/60">
                {idx + 1} / {tours.length}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                className="vg-lbarrow inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.04] px-[18px] text-sm font-bold text-white"
              >
                Volgende
                <ChevronRight size={18} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
