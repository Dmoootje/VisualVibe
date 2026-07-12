import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Service } from "@/types";
import { serviceHref } from "@/data/services";
import { dronePhotos } from "@/data/droneShowcase";
import { PageAmbient } from "@/components/ui";
import { CTASection, ServiceFaqCombine } from "@/components/sections";
import { DroneShowcase } from "./DroneShowcase";
import { CursorDrone } from "./CursorDrone";
import { Quad } from "./Quad";
import { ArrowDown, ArrowRight, Check, DrIcon } from "./icons";

// Subservice slug -> overzicht glyph.
const OV_ICON: Record<string, string> = {
  dronefotografie: "foto",
  dronevideo: "video",
  "fpv-video": "fpv",
  "vastgoed-dronebeelden": "building",
  "realisatie-dronebeelden": "layers",
  "event-dronebeelden": "cal",
};

// GEO direct-answer checklist (what a drone & FPV opdracht includes).
const INCLUDED = [
  "Dronefotografie in hoge resolutie (RAW, 48MP)",
  "Dronevideo in 4K",
  "Dynamische FPV-vluchten door en rond je project",
  "Vastgoed-, bouw- en eventbeelden",
  "Gecertificeerde en verzekerde dronepiloot",
  "Montage, kleurcorrectie en oplevering",
];

/**
 * Bespoke Drone & FPV service page (design_handoff_drone_fpv_service): one
 * continuous PageAmbient background with transparent, equally-wide `.container`
 * sections (no seams). Quadcopter + FPV-feed hero, a GEO direct-answer block, the
 * dronefoto/dronevideo realisaties split with a combined lightbox, the diensten-
 * overzicht, werkproces, FAQ, gerelateerde diensten, CTA, and a cursor-following
 * drone over the whole page (desktop only).
 */
export function DroneFpvService({
  service,
  subServices,
  relatedServices,
}: {
  service: Service;
  subServices: Service[];
  relatedServices: Service[];
}) {
  return (
    <div className="relative overflow-hidden">
      <PageAmbient />
      <CursorDrone />

      <div className="relative z-10">
        {/* ===== HERO ===== */}
        <section className="relative z-[2] pb-12 pt-24 sm:pb-14">
          <div className="container mx-auto grid items-center gap-8 px-4 lg:grid-cols-[1fr_560px] lg:gap-14">
            <div>
              <nav className="mb-[22px] flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.04em] text-white/45">
                <Link href="/diensten" className="transition-colors hover:text-white">
                  Diensten
                </Link>
                <span className="text-white/25">/</span>
                <span className="text-[#FF9A45]">Drone &amp; FPV</span>
              </nav>
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.1)] px-[15px] py-2 font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#FF9A45]">
                <span className="vvw-liveDot h-[7px] w-[7px] rounded-full bg-[#FF7A00]" />
                Vanuit de lucht
              </div>
              <h1 className="font-sora mb-[22px] text-[clamp(44px,13vw,62px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white lg:text-[62px]">
                Drone &amp; FPV
              </h1>
              <p className="mb-[34px] max-w-[500px] text-[19px] leading-[1.6] text-white/65">{service.intro}</p>
              <div className="flex flex-wrap gap-3.5">
                <Link
                  href="/offerte-aanvragen"
                  className="heroBtn inline-flex items-center gap-2.5 rounded-xl px-7 py-[15px] text-base font-bold text-white shadow-[0_16px_40px_-14px_rgba(255,90,0,0.85)] transition-transform hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(90deg,#FF3B2E,#FF7A00)" }}
                >
                  Offerte aanvragen <ArrowRight size={17} />
                </Link>
                <a
                  href="#dr-werk"
                  className="heroBtn inline-flex items-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.05] px-7 py-[15px] text-base font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  Bekijk realisaties <ArrowDown size={16} />
                </a>
              </div>
            </div>

            {/* HERO VISUAL: FPV feed + hovering drone */}
            <div className="dr-visual-col flex justify-center lg:justify-end">
              <div className="dr-visual relative">
                <div
                  aria-hidden="true"
                  className="vg-spin pointer-events-none absolute left-1/2 top-[56%] z-0 h-[420px] w-[520px] max-w-full rounded-full blur-[54px]"
                  style={{
                    transform: "translate(-50%,-50%)",
                    background:
                      "conic-gradient(from 0deg,transparent 0deg,rgba(255,122,0,.26) 80deg,transparent 190deg,rgba(255,90,0,.18) 290deg,transparent 360deg)",
                  }}
                />

                {/* FPV screen card (drone's-eye view) */}
                <div
                  className="absolute bottom-2 left-3.5 z-[1] w-[530px] rounded-[20px] p-[1.5px]"
                  style={{
                    background: "linear-gradient(150deg,rgba(255,150,60,.6),rgba(255,90,0,.2) 55%,rgba(255,255,255,.05))",
                    boxShadow: "0 44px 90px -34px rgba(255,80,0,.55)",
                  }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[19px] border border-white/5 bg-[#0e0d0c]">
                    <Image
                      src={dronePhotos[2].src}
                      alt="Luchtbeeld vanuit de drone, gefilmd door VisualVibe"
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, 530px"
                      className="object-cover"
                    />
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(130% 100% at 50% 40%,transparent 55%,rgba(6,10,8,.6))" }} />
                    {/* HUD */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-3.5">
                      <div className="absolute left-0 top-0 h-[22px] w-[22px] border-l-2 border-t-2 border-white/80" />
                      <div className="absolute right-0 top-0 h-[22px] w-[22px] border-r-2 border-t-2 border-white/80" />
                      <div className="absolute bottom-0 left-0 h-[22px] w-[22px] border-b-2 border-l-2 border-white/80" />
                      <div className="absolute bottom-0 right-0 h-[22px] w-[22px] border-b-2 border-r-2 border-white/80" />
                      <div className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2">
                        <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] -translate-x-1/2 bg-[rgba(255,122,0,0.85)]" />
                        <div className="absolute top-1/2 left-0 right-0 h-[1.5px] -translate-y-1/2 bg-[rgba(255,122,0,0.85)]" />
                        <div className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[rgba(255,122,0,0.85)]" />
                      </div>
                    </div>
                    <div className="absolute left-3.5 top-3 inline-flex items-center gap-[7px] rounded-[7px] bg-[rgba(6,8,6,.6)] px-2.5 py-[5px] font-mono text-[10px] font-bold tracking-[0.06em] text-white backdrop-blur">
                      <span className="dr-recdot h-[7px] w-[7px] rounded-full bg-[#FF3B2E]" />REC
                    </div>
                    <div className="absolute right-3.5 top-3 rounded-[7px] bg-[rgba(6,8,6,.6)] px-[9px] py-[5px] font-mono text-[10px] font-bold text-[#5ac47d] backdrop-blur">GPS 14</div>
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between font-mono text-[10px] font-bold text-white/90">
                      <span className="inline-flex gap-2.5"><span className="text-[#FF9A45]">ALT 82m</span><span>SPD 34km/h</span></span>
                      <span className="inline-flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5ac47d" strokeWidth={2} aria-hidden="true"><rect x="2" y="7" width="17" height="10" rx="2" /><path d="M22 10v4" /></svg>96%
                      </span>
                    </div>
                    <div className="dr-hudscan pointer-events-none absolute left-0 right-0 top-0 h-[30px]" style={{ background: "linear-gradient(180deg,transparent,rgba(122,220,160,.22),transparent)" }} />
                  </div>
                </div>

                {/* hovering drone + signal arcs */}
                <svg viewBox="0 0 200 150" className="pointer-events-none absolute left-1/2 top-[-6px] z-[3] w-[300px] -translate-x-1/2 overflow-visible" aria-hidden="true">
                  <g className="dr-sig s1"><path d="M70 118 Q100 138 130 118" fill="none" stroke="rgba(255,122,0,.6)" strokeWidth="2" strokeLinecap="round" /></g>
                  <g className="dr-sig s2"><path d="M60 122 Q100 150 140 122" fill="none" stroke="rgba(255,122,0,.45)" strokeWidth="2" strokeLinecap="round" /></g>
                  <g className="dr-sig s3"><path d="M50 126 Q100 162 150 126" fill="none" stroke="rgba(255,122,0,.3)" strokeWidth="2" strokeLinecap="round" /></g>
                  <g className="dr-rig"><g transform="translate(40 6)"><Quad /></g></g>
                </svg>

                {/* floating chips */}
                <div className="absolute right-[-8px] top-0.5 z-[4] flex items-center gap-2.5 rounded-[13px] border border-[rgba(255,122,0,0.22)] bg-[rgba(20,17,14,.92)] px-[15px] py-[11px] shadow-[0_18px_36px_-16px_rgba(0,0,0,0.85)] backdrop-blur">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.14)] text-[#FF9A45]">
                    <DrIcon id="drone" size={19} strokeWidth={1.9} />
                  </span>
                  <div>
                    <div className="font-sora text-[15px] font-extrabold leading-none text-white">4K · HDR</div>
                    <div className="mt-0.5 text-[10px] text-white/50">luchtbeelden</div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-[-14px] z-[4] flex items-center gap-2.5 rounded-[13px] border border-[rgba(255,122,0,0.22)] bg-[rgba(20,17,14,.92)] px-[15px] py-[11px] shadow-[0_18px_36px_-16px_rgba(0,0,0,0.85)] backdrop-blur">
                  <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-[rgba(90,196,125,0.16)]">
                    <Check size={13} className="text-[#5ac47d]" />
                  </span>
                  <span className="text-[13px] font-bold text-white">Gecertificeerd piloot</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== GEO direct-answer block ===== */}
        <section className="relative py-14 sm:py-16">
          <div className="container mx-auto grid items-start gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
                <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#FF9A45]" />
                Drone &amp; FPV uitgelegd
              </p>
              <h2 className="font-sora text-[28px] font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[34px]">
                Wat is drone- en FPV-video?
              </h2>
              <p className="mt-4 text-[16.5px] leading-[1.7] text-white/70">
                <strong className="font-semibold text-white">
                  Drone- en FPV-video zijn luchtopnames gemaakt met een op afstand bestuurde drone
                </strong>
                , die je project, gebouw of event vanuit een uniek perspectief in beeld brengen. Klassieke
                dronebeelden zijn rustig en overzichtelijk; FPV-beelden vliegen dynamisch door en rond je
                locatie.
              </p>
              <p className="mt-4 text-[16.5px] leading-[1.7] text-white/60">
                FPV staat voor First Person View: de piloot vliegt alsof hij in de drone zit, wat een
                meeslepend, filmisch effect geeft. Ideaal om een bouwproject, bedrijfspand of event echt tot
                leven te brengen.
              </p>
              <p className="mt-4 text-[16.5px] leading-[1.7] text-white/60">
                VisualVibe vliegt met een gecertificeerde en verzekerde dronepiloot in heel Limburg en
                daarbuiten. We regelen de vluchtplanning en waar nodig de vergunningen, zodat elke opname
                veilig en volgens de regels verloopt.
              </p>
            </div>

            <div className="rounded-[20px] border border-white/[0.09] bg-white/[0.02] p-7 sm:p-8">
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
                Wat we leveren
              </div>
              <ul className="mt-5 flex flex-col gap-3.5">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.14)] text-[#FF9A45]">
                      <Check size={12} />
                    </span>
                    <span className="text-[14.5px] font-medium leading-snug text-white/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== REALISATIES SPLIT ===== */}
        <DroneShowcase />

        {/* ===== DIENSTEN OVERZICHT ===== */}
        {subServices.length > 0 && (
          <section className="relative py-8">
            <div className="container mx-auto px-4">
              <h2 className="font-sora mb-7 text-[28px] font-extrabold tracking-[-0.025em] text-white sm:text-[34px]">
                Drone &amp; FPV diensten overzicht
              </h2>
              <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
                {subServices.map((sub, i) => (
                  <Link
                    key={sub.slug}
                    href={serviceHref(sub)}
                    style={{ ["--i" as string]: i } as React.CSSProperties}
                    className="vvw-caseRow vg-ovrow flex items-center gap-4 rounded-[14px] border border-white/[0.08] bg-white/[0.02] px-[22px] py-5"
                  >
                    <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] border border-[rgba(255,122,0,0.22)] bg-[rgba(255,122,0,0.1)] text-[#FF9A45]">
                      <DrIcon id={OV_ICON[sub.slug] ?? "drone"} size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-sora block text-base font-bold text-white">{sub.title}</span>
                      <span className="mt-1 block text-[13.5px] leading-[1.5] text-white/55">{sub.excerpt}</span>
                    </span>
                    <span className="vg-ovar flex-none text-white/40">
                      <ArrowRight size={18} strokeWidth={2.2} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== HOE WE WERKEN ===== */}
        {service.process.length > 0 && (
          <section className="relative py-8">
            <div className="container mx-auto px-4">
              <h2 className="font-sora mb-7 text-[28px] font-extrabold tracking-[-0.025em] text-white sm:text-[34px]">
                Hoe we werken
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {service.process.map((stepItem, i) => {
                  const n = String(i + 1).padStart(2, "0");
                  return (
                    <div
                      key={stepItem.title}
                      style={{ ["--i" as string]: i } as React.CSSProperties}
                      className="vvw-caseRow vg-step relative flex min-h-[190px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-[22px]"
                    >
                      <span aria-hidden="true" className="font-sora pointer-events-none absolute right-3.5 top-2.5 text-[60px] font-extrabold leading-none text-white/[0.04]">
                        {n}
                      </span>
                      <span
                        className="font-mono flex h-[42px] w-[42px] items-center justify-center rounded-[11px] text-[15px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(255,90,0,0.8)]"
                        style={{ background: "linear-gradient(135deg,#FF3B2E,#FF7A00)" }}
                      >
                        {n}
                      </span>
                      <div className="mt-auto pt-[22px]">
                        <div className="font-sora mb-[7px] text-[18px] font-bold text-white">{stepItem.title}</div>
                        <div className="text-[13.5px] leading-[1.55] text-white/55">{stepItem.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Veelgestelde vragen (links) + Combineer drone & FPV met (rechts). */}
        <ServiceFaqCombine faqs={service.faqs} combineWith="drone & FPV" relatedServices={relatedServices} />

        <CTASection
          className="bg-transparent"
          title="Interesse in drone & FPV?"
          description="Vraag een vrijblijvende offerte aan en ontvang binnen de 2 werkdagen een reactie."
        />
      </div>
    </div>
  );
}
