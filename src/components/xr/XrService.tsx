"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Service } from "@/types";
import { serviceHref } from "@/data/services";
import { PageAmbient } from "@/components/ui";
import { CTASection } from "@/components/sections";
import { matterportTours, matterportEmbedSrc, MATTERPORT_IFRAME_ALLOW } from "@/data/matterportTours";
import { XrIcon, ArrowRight, ArrowDown, PlayGlyph, Close } from "./icons";

const VIDEO_ID = "wGjOGVpZunI";

// Immersion mode (design default: "vol"). Drives hero depth + cursor intensity.
const MODE = "vol" as const;
const MODE_CFG = {
  subtle: { persp: "1900px", grid: 0.24, mult: 0.4 },
  immersief: { persp: "1200px", grid: 0.5, mult: 1 },
  vol: { persp: "820px", grid: 0.8, mult: 1.7 },
}[MODE];

// Diensten-overzicht rows (icon · title · description).
const OVERZICHT = [
  {
    icon: "cube",
    title: "3D-visualisatie",
    desc: "Fotorealistische 3D-renders van een ruimte, product of ontwerp, nog voor het bestaat.",
  },
  {
    icon: "tour",
    title: "Virtual tours (Matterport)",
    desc: "Navigeerbare 360°-tours waarin je klant zelf door de ruimte wandelt.",
  },
  {
    icon: "ar",
    title: "AR-ervaringen",
    desc: "Plaats een 3D-object via augmented reality live in de echte omgeving.",
  },
  {
    icon: "config",
    title: "Productconfigurators",
    desc: "Interactieve 3D-configurator waarin klanten materialen en opties kiezen.",
  },
];

// Werkproces steps.
const STEPS = [
  { n: "01", t: "Scan & briefing", d: "We leggen de ruimte vast met een 3D-scan of vertrekken van je ontwerp." },
  { n: "02", t: "Modelleren", d: "Verwerking tot een nauwkeurig 3D-model of navigeerbare tour." },
  { n: "03", t: "Afwerking", d: "Materialen, belichting en HUD-navigatie tot alles klopt." },
  { n: "04", t: "Publicatie", d: "Embed op je site, VR-headset of AR op smartphone." },
];

// Related-service glyphs keyed by slug (chip row).
const RELATED_ICON: Record<string, string> = {
  fotografie: "foto",
  videografie: "video",
  "drone-fpv": "layers",
};

/**
 * Bespoke 3D, VR & AR service page (design_handoff_3d_vr_ar): one continuous
 * PageAmbient background with transparent, equally-wide `.container` sections.
 * An immersive cursor-driven 3D hero stage (floor grid, virtual-tour viewport,
 * wireframe cube + AR phone panels), a diensten-overzicht, a video showreel
 * (lightbox), the two most recent Matterport tours embedded live in-page
 * (click-to-activate), the werkproces, gerelateerde diensten, and a CTA.
 */
export function XrService({
  service,
  relatedServices,
  crossLinks,
}: {
  service: Service;
  relatedServices: Service[];
  /** Gedeelde cross-link-secties (kennisbank, realisaties, regio's), server-side gerenderd. */
  crossLinks?: React.ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const [lbOpen, setLbOpen] = useState(false);
  const [activeTours, setActiveTours] = useState<Record<string, boolean>>({});

  // Last two of the five tours are shown live in-page.
  const tours = matterportTours.slice(-2);

  // Cursor-driven world tilt (respects prefers-reduced-motion via the CSS class).
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const st = stageRef.current;
      const w = worldRef.current;
      if (!st || !w) return;
      const r = st.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      w.style.setProperty("--ry", (nx * 9 * MODE_CFG.mult).toFixed(2) + "deg");
      w.style.setProperty("--rx", (-4 - ny * 5 * MODE_CFG.mult).toFixed(2) + "deg");
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Esc closes the video lightbox.
  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLbOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lbOpen]);

  const activate = useCallback(
    (id: string) => () => setActiveTours((s) => ({ ...s, [id]: true })),
    [],
  );

  return (
    <div className="relative overflow-hidden">
      <PageAmbient />

      <div className="relative z-10">
        {/* ===== HERO ===== */}
        <section className="relative z-[2] pb-12 pt-14 sm:pt-16">
          <div className="container mx-auto grid items-center gap-12 px-2.5 sm:px-4 lg:grid-cols-[1fr_600px]">
            <div>
              <nav className="mb-[22px] flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.04em] text-white/45">
                <Link href="/diensten" className="transition-colors hover:text-white">
                  Diensten
                </Link>
                <span className="text-white/25">/</span>
                <span className="text-[#FF9A45]">3D, VR &amp; AR</span>
              </nav>
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.1)] px-[15px] py-2 font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#FF9A45]">
                <span className="vvw-liveDot h-[7px] w-[7px] rounded-full bg-[#FF7A00]" />
                Immersieve ervaringen
              </div>
              <h1 className="font-sora mb-[22px] text-[clamp(44px,13vw,62px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white lg:text-[62px]">
                3D, VR &amp; AR
              </h1>
              <p className="mb-[34px] max-w-[520px] text-[19px] leading-[1.6] text-white/65">
                Stap letterlijk in je project. VisualVibe maakt 3D-visualisaties, navigeerbare virtual
                tours en AR-ervaringen die je klant laten rondlopen door een ruimte die er nog niet, of
                niet meer, is.
              </p>
              <div className="flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
                <Link
                  href="/offerte-aanvragen"
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-7 py-[15px] text-base font-bold text-white shadow-[0_16px_40px_-14px_rgba(255,90,0,0.85)] transition-transform hover:-translate-y-0.5 sm:w-auto"
                  style={{ background: "linear-gradient(90deg,#FF3B2E,#FF7A00)" }}
                >
                  Offerte aanvragen
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#xr-tours"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.05] px-7 py-[15px] text-base font-bold text-white transition-transform hover:-translate-y-0.5 sm:w-auto"
                >
                  Bekijk virtual tours <ArrowDown size={16} />
                </a>
              </div>
            </div>

            {/* HERO VISUAL: immersive 3D stage */}
            <div className="xr-visual-col flex justify-center lg:justify-end">
              <div className="xr-stagewrap relative">
                {/* rotating conic halo */}
                <div
                  aria-hidden="true"
                  className="xr-halo pointer-events-none absolute left-1/2 top-[52%] z-0 h-[440px] w-[540px] max-w-full rounded-full blur-[56px]"
                  style={{
                    transform: "translate(-50%,-50%)",
                    background:
                      "conic-gradient(from 0deg,transparent 0deg,rgba(255,122,0,.26) 80deg,transparent 190deg,rgba(255,90,0,.18) 290deg,transparent 360deg)",
                  }}
                />

                <div
                  ref={stageRef}
                  className={`xr-stage xr-${MODE} absolute inset-0 z-[1]`}
                  style={{ ["--xr-persp" as string]: MODE_CFG.persp }}
                >
                  <div ref={worldRef} className="xr-world">
                    {/* floor grid, receding */}
                    <div
                      aria-hidden="true"
                      className="xr-grid-scroll absolute bottom-4 left-1/2 h-[420px] w-[900px]"
                      style={{
                        transform: "translateX(-50%) translateZ(-160px) rotateX(74deg)",
                        transformOrigin: "bottom center",
                        opacity: MODE_CFG.grid,
                        background:
                          "linear-gradient(rgba(255,122,0,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,122,0,.5) 1px,transparent 1px)",
                        backgroundSize: "52px 52px",
                        maskImage: "radial-gradient(60% 70% at 50% 40%,#000,transparent 80%)",
                        WebkitMaskImage: "radial-gradient(60% 70% at 50% 40%,#000,transparent 80%)",
                      }}
                    />

                    {/* CENTER: virtual-tour viewport */}
                    <div
                      className="absolute left-1/2 top-1/2 w-[400px]"
                      style={{ transform: "translate(-50%,-50%) translateZ(40px)" }}
                    >
                      <div
                        className="relative rounded-[20px] p-[1.5px]"
                        style={{
                          background:
                            "linear-gradient(150deg,rgba(255,150,60,.6),rgba(255,90,0,.2) 55%,rgba(255,255,255,.05))",
                          boxShadow: "0 44px 90px -34px rgba(255,80,0,.6)",
                        }}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[19px] border border-white/5 bg-[#0e0d0c]">
                          <div
                            aria-hidden="true"
                            className="absolute inset-0"
                            style={{
                              background:
                                "radial-gradient(120% 100% at 50% 30%,rgba(255,122,0,.1),transparent 55%),radial-gradient(130% 100% at 50% 40%,transparent 52%,rgba(6,8,10,.66))",
                            }}
                          />
                          {/* reticle */}
                          <div className="absolute left-1/2 top-1/2 h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2">
                            <div
                              className="xr-retspin absolute inset-0 rounded-full"
                              style={{
                                border: "1.5px solid rgba(255,122,0,.85)",
                                borderRightColor: "transparent",
                                borderLeftColor: "transparent",
                              }}
                            />
                            <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-white/90" />
                          </div>
                          {/* corner brackets */}
                          <div aria-hidden="true" className="pointer-events-none absolute inset-3.5">
                            <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-white/80" />
                            <span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-white/80" />
                            <span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-white/80" />
                            <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-white/80" />
                          </div>
                          <div className="absolute left-3.5 top-3 inline-flex items-center gap-[7px] rounded-[7px] bg-[rgba(6,8,10,.6)] px-2.5 py-[5px] font-mono text-[10px] font-bold tracking-[0.06em] text-[#FF9A45] backdrop-blur">
                            <span className="vvw-liveDot h-1.5 w-1.5 rounded-full bg-[#FF7A00]" />
                            VIRTUAL TOUR
                          </div>
                          <div className="absolute right-3.5 top-3 rounded-[7px] bg-[rgba(6,8,10,.6)] px-[9px] py-[5px] font-mono text-[10px] font-bold text-[#5ac47d] backdrop-blur">
                            360°
                          </div>
                          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between font-mono text-[10px] font-bold text-white/90">
                            <span className="text-[#FF9A45]">DOLLHOUSE · FLOORPLAN</span>
                            <span>WebGL 60 FPS</span>
                          </div>
                          <div
                            className="xr-scan pointer-events-none absolute left-0 right-0 top-0 h-[30px]"
                            style={{
                              background:
                                "linear-gradient(180deg,transparent,rgba(255,150,80,.22),transparent)",
                            }}
                          />
                        </div>
                      </div>
                      {/* matterport-style nav dots (vol mode only) */}
                      <div className="xr-hud-extra absolute bottom-[-30px] left-1/2 flex -translate-x-1/2 gap-2.5">
                        <span className="h-[9px] w-[9px] rounded-full bg-[#FF7A00]" />
                        <span className="h-[9px] w-[9px] rounded-full bg-white/25" />
                        <span className="h-[9px] w-[9px] rounded-full bg-white/25" />
                        <span className="h-[9px] w-[9px] rounded-full bg-white/25" />
                      </div>
                    </div>

                    {/* LEFT: 3D wireframe cube panel */}
                    <div
                      className="absolute left-[-6px] top-[52px] h-[150px] w-[132px]"
                      style={{ transform: "translateZ(120px)" }}
                    >
                      <div className="xr-floatB relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-[rgba(255,122,0,0.24)] bg-[rgba(16,14,13,0.92)] shadow-[0_24px_50px_-22px_rgba(0,0,0,0.85)] backdrop-blur">
                        <div className="absolute left-3 top-[11px] font-mono text-[9px] font-bold tracking-[0.06em] text-[#FF9A45]">
                          3D · RENDER
                        </div>
                        <div style={{ perspective: "420px" }}>
                          <div
                            className="xr-cube-spin relative h-[62px] w-[62px]"
                            style={{ transformStyle: "preserve-3d" }}
                          >
                            <div className="absolute inset-0 border-[1.5px] border-[rgba(255,150,80,.75)]" style={{ transform: "translateZ(31px)" }} />
                            <div className="absolute inset-0 border-[1.5px] border-[rgba(255,150,80,.4)]" style={{ transform: "translateZ(-31px)" }} />
                            <div className="absolute inset-0 border-[1.5px] border-[rgba(255,150,80,.55)]" style={{ transform: "rotateY(90deg) translateZ(31px)" }} />
                            <div className="absolute inset-0 border-[1.5px] border-[rgba(255,150,80,.55)]" style={{ transform: "rotateY(90deg) translateZ(-31px)" }} />
                            <div className="absolute inset-0 border-[1.5px] border-[rgba(255,150,80,.5)]" style={{ transform: "rotateX(90deg) translateZ(31px)" }} />
                            <div className="absolute inset-0 border-[1.5px] border-[rgba(255,150,80,.5)]" style={{ transform: "rotateX(90deg) translateZ(-31px)" }} />
                          </div>
                        </div>
                        <div className="absolute bottom-[11px] left-3 right-3 font-mono text-[9px] font-bold text-white/50">
                          POLY 128k
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: AR phone panel */}
                    <div
                      className="absolute right-[-10px] top-10 h-[186px] w-[118px]"
                      style={{ transform: "translateZ(150px)" }}
                    >
                      <div className="xr-floatA relative h-full w-full overflow-hidden rounded-[22px] border border-white/[0.14] bg-[rgba(16,14,13,0.94)] shadow-[0_28px_56px_-22px_rgba(0,0,0,0.9)]">
                        <div className="absolute left-1/2 top-2 z-[3] h-[5px] w-[38px] -translate-x-1/2 rounded-full bg-white/[0.18]" />
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "radial-gradient(120% 90% at 50% 20%,rgba(255,122,0,.14),transparent 60%),#0d0c0b",
                          }}
                        />
                        {/* AR object */}
                        <div className="absolute left-1/2 top-[52%] h-[66px] w-[66px] -translate-x-1/2 -translate-y-1/2">
                          <div className="flex h-full items-center justify-center" style={{ perspective: "340px" }}>
                            <div
                              className="h-10 w-10 rounded-lg shadow-[0_14px_26px_-8px_rgba(255,90,0,0.9)]"
                              style={{
                                transform: "rotateX(-18deg) rotateY(30deg)",
                                background: "linear-gradient(135deg,#FF7A00,#FF3B2E)",
                              }}
                            />
                          </div>
                          <div className="absolute bottom-[-6px] left-1/2 h-2.5 w-[52px] -translate-x-1/2 rounded-full bg-[rgba(255,90,0,.28)] blur-[5px]" />
                        </div>
                        {/* AR reticle */}
                        <div className="absolute left-1/2 top-[52%] h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2">
                          <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l-[1.5px] border-t-[1.5px] border-[rgba(255,150,80,.8)]" />
                          <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r-[1.5px] border-t-[1.5px] border-[rgba(255,150,80,.8)]" />
                          <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b-[1.5px] border-l-[1.5px] border-[rgba(255,150,80,.8)]" />
                          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b-[1.5px] border-r-[1.5px] border-[rgba(255,150,80,.8)]" />
                        </div>
                        <div className="absolute left-0 right-0 top-[22px] text-center font-mono text-[8.5px] font-bold tracking-[0.08em] text-[#FF9A45]">
                          AR PLACEMENT
                        </div>
                        <div className="absolute bottom-3.5 left-1/2 h-[34px] w-[34px] -translate-x-1/2 rounded-full border-2 border-white/85" />
                      </div>
                    </div>

                    {/* floating chip: VR-ready (vol mode only) */}
                    <div
                      className="xr-hud-extra absolute bottom-6 left-[34px]"
                      style={{ transform: "translateZ(190px)" }}
                    >
                      <div className="flex items-center gap-2.5 rounded-[13px] border border-[rgba(255,122,0,0.22)] bg-[rgba(20,17,14,0.92)] px-3.5 py-2.5 shadow-[0_18px_36px_-16px_rgba(0,0,0,0.85)] backdrop-blur">
                        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.14)] text-[#FF9A45]">
                          <XrIcon id="vr" size={17} strokeWidth={1.8} />
                        </span>
                        <span className="text-[12.5px] font-bold text-white">VR-ready</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* static chip top-right (outside the rotating world) */}
                <div className="absolute right-[-6px] top-0 z-[5] flex items-center gap-2.5 rounded-[13px] border border-[rgba(255,122,0,0.22)] bg-[rgba(20,17,14,0.92)] px-3.5 py-[11px] shadow-[0_18px_36px_-16px_rgba(0,0,0,0.85)] backdrop-blur">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.14)] text-[#FF9A45]">
                    <XrIcon id="tour" size={19} strokeWidth={1.8} />
                  </span>
                  <div>
                    <div className="font-sora text-[15px] font-extrabold leading-none text-white">Matterport</div>
                    <div className="mt-0.5 text-[10px] text-white/50">gecertificeerd</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DIENSTEN OVERZICHT ===== */}
        <section className="relative py-5">
          <div className="container mx-auto px-2.5 sm:px-4">
            <h2 className="font-sora mb-7 text-[28px] font-extrabold tracking-[-0.025em] text-white sm:text-[34px]">
              3D, VR &amp; AR diensten overzicht
            </h2>
            <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
              {OVERZICHT.map((o, i) => (
                <div
                  key={o.title}
                  style={{ ["--i" as string]: i } as React.CSSProperties}
                  className="vvw-caseRow vg-ovrow flex items-center gap-4 rounded-[14px] border border-white/[0.08] bg-white/[0.02] px-[22px] py-5"
                >
                  <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] border border-[rgba(255,122,0,0.22)] bg-[rgba(255,122,0,0.1)] text-[#FF9A45]">
                    <XrIcon id={o.icon} size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-sora block text-base font-bold text-white">{o.title}</span>
                    <span className="mt-1 block text-[13.5px] leading-[1.5] text-white/55">{o.desc}</span>
                  </span>
                  <span className="vg-ovar flex-none text-white/40">
                    <ArrowRight size={18} strokeWidth={2.2} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== VIDEO SECTION ===== */}
        <section className="relative py-11">
          <div className="container mx-auto px-2.5 sm:px-4">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#FF9A45]">
                  In beeld
                </div>
                <h2 className="font-sora text-[30px] font-extrabold leading-[1.06] tracking-[-0.025em] text-white sm:text-[38px]">
                  Zie hoe immersief werkt
                </h2>
              </div>
              <p className="mb-1.5 max-w-[340px] text-[15px] leading-[1.6] text-white/55">
                Van scan tot navigeerbare tour: bekijk het proces en resultaat in bewegend beeld.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLbOpen(true)}
              className="dr-mcard group relative block aspect-[21/9] w-full overflow-hidden rounded-[22px] border border-[rgba(255,122,0,0.2)] bg-[#0e0d0c] text-left"
            >
              <Image
                src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                alt="VisualVibe 3D, VR & AR showreel"
                fill
                sizes="(max-width: 1400px) 100vw, 1368px"
                className="dr-mimg object-cover"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(130% 100% at 50% 45%,transparent 42%,rgba(6,8,10,.72))" }}
              />
              <span aria-hidden="true" className="pointer-events-none absolute inset-4 z-[2]">
                <span className="absolute left-0 top-0 h-[22px] w-[22px] border-l-2 border-t-2 border-white/70" />
                <span className="absolute right-0 top-0 h-[22px] w-[22px] border-r-2 border-t-2 border-white/70" />
                <span className="absolute bottom-0 left-0 h-[22px] w-[22px] border-b-2 border-l-2 border-white/70" />
                <span className="absolute bottom-0 right-0 h-[22px] w-[22px] border-b-2 border-r-2 border-white/70" />
              </span>
              <span className="absolute left-5 top-[18px] z-[3] inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,8,10,.62)] px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.06em] text-[#FF9A45] backdrop-blur">
                3D · VR · AR SHOWREEL
              </span>
              <span className="absolute left-1/2 top-1/2 z-[3] h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2">
                <span
                  className="dr-play flex h-full w-full items-center justify-center rounded-full text-white shadow-[0_18px_44px_-12px_rgba(255,90,0,0.9)]"
                  style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}
                >
                  <PlayGlyph size={30} />
                </span>
              </span>
              <span className="font-sora absolute bottom-[18px] left-5 right-5 z-[3] text-[19px] font-bold text-white">
                VisualVibe - 3D, VR &amp; AR in de praktijk
              </span>
            </button>
          </div>
        </section>

        {/* ===== MATTERPORT TOURS (last 2, live) ===== */}
        <section id="xr-tours" className="relative py-9">
          <div className="container mx-auto px-2.5 sm:px-4">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#FF9A45]">
                  Recente realisaties
                </div>
                <h2 className="font-sora text-[30px] font-extrabold leading-[1.06] tracking-[-0.025em] text-white sm:text-[38px]">
                  Navigeerbare virtual tours
                </h2>
              </div>
              <Link
                href="/realisaties/3d-vr"
                className="group mb-1 inline-flex items-center gap-2.5 rounded-xl border border-white/[0.14] bg-white/[0.05] px-[22px] py-3.5 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Bekijk alle realisaties
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-2">
              {tours.map((t) => {
                const active = !!activeTours[t.id];
                return (
                  <div
                    key={t.id}
                    className="xr-tourcard overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#0e0d0c]"
                  >
                    <div
                      className="relative aspect-[16/10]"
                      style={{
                        background:
                          "radial-gradient(120% 120% at 30% 10%,rgba(255,90,0,.14),transparent 55%),#100e0d",
                      }}
                    >
                      {active ? (
                        <iframe
                          src={matterportEmbedSrc(t.id)}
                          title={`Matterport tour: ${t.title}`}
                          allow={MATTERPORT_IFRAME_ALLOW}
                          allowFullScreen
                          className="absolute inset-0 h-full w-full border-0"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={activate(t.id)}
                          className="absolute inset-0 flex cursor-pointer items-center justify-center"
                          aria-label={`Start 3D-tour: ${t.title}`}
                        >
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                            style={{ background: "linear-gradient(160deg,rgba(255,122,0,.05),transparent 60%)" }}
                          />
                          <span aria-hidden="true" className="pointer-events-none absolute inset-[18px]">
                            <span className="absolute left-0 top-0 h-[22px] w-[22px] border-l-2 border-t-2 border-white/35" />
                            <span className="absolute right-0 top-0 h-[22px] w-[22px] border-r-2 border-t-2 border-white/35" />
                            <span className="absolute bottom-0 left-0 h-[22px] w-[22px] border-b-2 border-l-2 border-white/35" />
                            <span className="absolute bottom-0 right-0 h-[22px] w-[22px] border-b-2 border-r-2 border-white/35" />
                          </span>
                          <span className="relative text-center">
                            <span
                              className="xr-start inline-flex h-[66px] w-[66px] items-center justify-center rounded-full text-white shadow-[0_16px_40px_-12px_rgba(255,90,0,0.9)]"
                              style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}
                            >
                              <XrIcon id="tour" size={26} strokeWidth={2} />
                            </span>
                            <span className="mt-3.5 block font-mono text-xs font-bold tracking-[0.08em] text-white/80">
                              START 3D-TOUR
                            </span>
                          </span>
                          <span className="absolute left-4 top-3.5 inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,8,10,.62)] px-[11px] py-1.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-[#FF9A45] backdrop-blur">
                            MATTERPORT · 360°
                          </span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-4 px-[22px] py-[18px]">
                      <div className="min-w-0">
                        <div className="font-sora text-[18px] font-bold text-white">{t.title}</div>
                        <div className="mt-[3px] text-[13px] text-white/50">{t.location}</div>
                      </div>
                      <span className="inline-flex flex-none items-center gap-1.5 rounded-full border border-[rgba(255,122,0,0.22)] bg-[rgba(255,122,0,0.08)] px-3 py-[7px] font-mono text-[10.5px] font-bold text-[#FF9A45]">
                        <span className="vvw-liveDot h-1.5 w-1.5 rounded-full bg-[#FF7A00]" />
                        LIVE
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== HOE WE WERKEN ===== */}
        <section className="relative py-8">
          <div className="container mx-auto px-2.5 sm:px-4">
            <h2 className="font-sora mb-7 text-[28px] font-extrabold tracking-[-0.025em] text-white sm:text-[34px]">
              Hoe we werken
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <div
                  key={s.n}
                  style={{ ["--i" as string]: i } as React.CSSProperties}
                  className="vvw-caseRow vg-step relative flex min-h-[190px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-[22px]"
                >
                  <span aria-hidden="true" className="font-sora pointer-events-none absolute right-3.5 top-2.5 text-[60px] font-extrabold leading-none text-white/[0.04]">
                    {s.n}
                  </span>
                  <span
                    className="font-mono flex h-[42px] w-[42px] items-center justify-center rounded-[11px] text-[15px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(255,90,0,0.8)]"
                    style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}
                  >
                    {s.n}
                  </span>
                  <div className="mt-auto pt-[22px]">
                    <div className="font-sora mb-[7px] text-[17px] font-bold text-white">{s.t}</div>
                    <div className="text-[13.5px] leading-[1.55] text-white/55">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CROSS-LINKS (kennisbank, realisaties, regio's) ===== */}
        {crossLinks}

        {/* ===== GERELATEERDE DIENSTEN ===== */}
        {relatedServices.length > 0 && (
          <section className="relative py-8">
            <div className="container mx-auto px-2.5 sm:px-4">
              <h2 className="font-sora mb-5 text-[24px] font-extrabold tracking-[-0.02em] text-white sm:text-[26px]">
                Gerelateerde diensten
              </h2>
              <div className="flex flex-wrap gap-3">
                {relatedServices.map((r) => (
                  <Link
                    key={r.slug}
                    href={serviceHref(r)}
                    className="xr-chip inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-[15px] font-semibold text-white"
                  >
                    <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-[rgba(255,122,0,0.22)] bg-[rgba(255,122,0,0.1)] text-[#FF9A45]">
                      <XrIcon id={RELATED_ICON[r.slug] ?? "cube"} size={16} />
                    </span>
                    {r.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CTASection
          className="bg-transparent"
          title="Klaar voor een immersieve ervaring?"
          description="Vraag een vrijblijvende offerte aan en ontvang binnen de 2 werkdagen een reactie."
        />
      </div>

      {/* ===== VIDEO LIGHTBOX ===== */}
      {lbOpen && (
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
          <div className="vg-lbcard relative z-[1] mx-auto flex h-full w-[min(1080px,100%)] flex-col justify-center px-[clamp(16px,3vw,40px)] pb-[22px] pt-5">
            <div className="mb-3.5 flex flex-none items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="mb-2.5 inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-[#FF9A45]">
                  3D · VR · AR SHOWREEL
                </span>
                <h3 className="font-sora text-2xl font-extrabold tracking-[-0.02em] text-white">
                  VisualVibe - 3D, VR &amp; AR in de praktijk
                </h3>
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
            <div className="relative aspect-video max-h-[70vh] flex-none overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_40px_90px_-30px_rgba(255,80,0,0.4)]">
              <iframe
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                title="VisualVibe 3D, VR & AR showreel"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
