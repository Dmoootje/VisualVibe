"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { imageKey, type WebdesignProject } from "@/data/webdesignShowcase";
import type { WebdesignImages } from "@/lib/firestore/webdesignImages";
import { ShowcaseImage } from "@/components/webdesign/ShowcaseImage";
import { RealisatieModal } from "@/components/webdesign/RealisatieModal";

const ArrowUpRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);
const MonitorIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M3 8h18" />
  </svg>
);
const CartIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={size > 20 ? 1.8 : 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="20" r="1" />
    <circle cx="18" cy="20" r="1" />
    <path d="M2 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L23 6H5.2" />
  </svg>
);

/**
 * Grid met Websites/Webshops-toggle (design_handoff_realisaties_webdesign). De
 * kaarten linken naar de live site; thumbnails komen uit de admin-beelden en
 * tonen een nette placeholder tot ze ingevuld zijn. Webshops toont voorlopig
 * een lege staat. Client-side enkel voor de toggle-state.
 */
export function RealisatieWebdesignGrid({
  projects,
  images,
}: {
  projects: WebdesignProject[];
  images: WebdesignImages;
}) {
  const [soort, setSoort] = useState<"website" | "webshop">("website");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = openId ? projects.find((p) => p.id === openId) ?? null : null;
  const thumb = (c: WebdesignProject) => images[imageKey(c.id, "thumb")] ?? images[imageKey(c.id, "1")];

  const segBase =
    "inline-flex items-center gap-2 rounded-[9px] px-[18px] py-2.5 text-sm font-bold transition-colors";
  const activeSeg = "bg-[linear-gradient(90deg,#FF3B2E,#FF7A00)] text-white shadow-[0_10px_24px_-12px_rgba(255,90,0,0.8)]";
  const idleSeg = "text-white/60 hover:text-white/85";

  return (
    <section className="container relative z-[2] mx-auto px-4 pb-24 pt-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 font-mono text-xs font-bold tracking-[0.18em] text-[#FF9A45]">
            MEER REALISATIES
          </div>
          <h2 className="font-sora text-[34px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
            Websites die we voor KMO&apos;s bouwden
          </h2>
        </div>

        {/* Segmented toggle */}
        <div className="inline-flex rounded-[13px] border border-white/[0.09] bg-white/[0.04] p-[5px]">
          <button
            type="button"
            onClick={() => setSoort("website")}
            className={`${segBase} ${soort === "website" ? activeSeg : idleSeg}`}
          >
            <MonitorIcon />
            Websites
          </button>
          <button
            type="button"
            onClick={() => setSoort("webshop")}
            className={`${segBase} ${soort === "webshop" ? activeSeg : idleSeg}`}
          >
            <CartIcon />
            Webshops
          </button>
        </div>
      </div>

      {soort === "website" ? (
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setOpenId(c.id)}
              aria-label={`${c.name} openen`}
              className="rwcard vvw-caseRow relative flex flex-col overflow-hidden rounded-[17px] border border-white/[0.09] bg-white/[0.02] text-left"
              style={{ ["--i" as string]: i } as React.CSSProperties}
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.06] bg-[#141210]">
                <div className="rwcard-img absolute inset-0">
                  <ShowcaseImage src={thumb(c)} alt={`${c.name} website`} placeholder="Screenshot" />
                </div>
                <span className="rwcard-open absolute right-3 top-3 z-[3] flex h-8 w-8 items-center justify-center rounded-[9px] border border-white/[0.14] bg-[rgba(10,10,10,0.6)] backdrop-blur">
                  <ArrowUpRight />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                {c.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/[0.09] bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-semibold text-white/60">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="font-sora mb-[7px] text-[19px] font-bold text-white">{c.name}</div>
                <p className="mb-[18px] text-[13.5px] leading-[1.55] text-white/55">{c.teaser}</p>
                <span className="rwcard-go mt-auto inline-flex items-center gap-[7px] font-mono text-[11.5px] font-bold tracking-[0.08em] text-white/75">
                  BEKIJK REALISATIE
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] border border-white/[0.09] bg-white/[0.02] px-10 py-16 text-center">
          <span className="mb-[22px] inline-flex h-[60px] w-[60px] items-center justify-center rounded-2xl border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.1)] text-[#FF9A45]">
            <CartIcon size={28} />
          </span>
          <h3 className="font-sora mb-3 text-[26px] font-bold text-white">Binnenkort webshops in de kijker</h3>
          <p className="mx-auto mb-[26px] max-w-[440px] text-[15.5px] leading-[1.6] text-white/55">
            We voegen hier binnenkort onze webshop-realisaties toe. Zin om zelf een webshop te laten bouwen?
          </p>
          <Link
            href="/offerte-aanvragen"
            className="vvw-btn inline-flex items-center gap-2.5 rounded-xl px-[26px] py-3.5 text-[15px] font-bold text-white"
            style={{
              background: "linear-gradient(90deg,#FF3B2E,#FF7A00)",
              boxShadow: "0 16px 40px -14px rgba(255,90,0,.85)",
            }}
          >
            Offerte aanvragen
            <svg className="vvw-ar" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

      {open && <RealisatieModal project={open} images={images} onClose={() => setOpenId(null)} />}
    </section>
  );
}
