import { Link } from "@/i18n/navigation";

/**
 * Bespoke hero voor de SEO-dienstpagina (design_handoff_seo_service): copy links,
 * rechts een geanimeerd rankings-dashboard (organisch verkeer-grafiek die
 * zichzelf tekent, groeiende keyword-balken, zwevende "Positie #1" en "Zichtbaar
 * in AI"-chips). Puur inline SVG + CSS-keyframes (.vvseo-* / .vvw-* in
 * globals.css), dus server-side en instant.
 */
export function SeoHero() {
  return (
    <section className="relative z-[2] overflow-hidden pt-24 text-white">
      <div className="container relative z-[2] mx-auto grid items-center gap-8 px-2.5 sm:px-4 py-10 lg:grid-cols-[1fr_540px] lg:gap-14">
        {/* copy - centered when stacked (tablet/mobile), left-aligned on desktop */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-[22px] flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.04em] text-white/45">
            <Link href="/diensten" className="transition-colors hover:text-white">
              Diensten
            </Link>
            <span className="text-white/25">/</span>
            <span className="text-[#FF9A45]">SEO</span>
          </div>
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.1)] px-4 py-2 text-[13px] font-bold text-[#FF9A45]">
            <span className="vvw-liveDot h-[7px] w-[7px] rounded-full bg-[#FF7A00]" />
            SEO &amp; GEO
          </div>
          <h1 className="mb-5 text-[clamp(40px,11vw,64px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white sm:text-[64px]">
            SEO diensten
          </h1>
          <p className="mb-8 max-w-[520px] text-lg leading-relaxed text-white/[0.62] sm:text-[19px]">
            Onze SEO diensten laten je website ranken in Google én zichtbaar zijn in AI-zoekmachines
            zoals ChatGPT, Perplexity en Gemini. Technische SEO, lokale vindbaarheid en content die je
            doelgroep écht bereikt.
          </p>
          <div className="flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              href="/offerte-aanvragen"
              className="vvw-btn inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-base font-bold text-white sm:w-auto"
              style={{ background: "linear-gradient(90deg,#FF3B2E,#FF7A00)", boxShadow: "0 16px 40px -14px rgba(255,90,0,.85)" }}
            >
              Offerte aanvragen
              <svg className="vvw-ar" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            <a
              href="#seo-cases"
              className="vvw-btn inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.14] bg-white/5 px-7 py-3.5 text-base font-bold text-white sm:w-auto"
            >
              Bekijk realisaties
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14" /><path d="m5 12 7 7 7-7" /></svg>
            </a>
          </div>
        </div>

        {/* live rankings-dashboard */}
        <div className="vvseo-col w-full lg:justify-end">
          <div className="vvseo-stage">
            {/* roterende conische gloed - op mobiel kleiner zodat niets buiten
                de viewport valt en er geen harde cliplijnen ontstaan */}
            <div
              aria-hidden="true"
              className="vvseo-spin pointer-events-none absolute left-1/2 top-[46%] z-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[34px] sm:h-[520px] sm:w-[520px] sm:blur-[50px]"
              style={{
                background:
                  "conic-gradient(from 0deg,transparent 0deg,rgba(255,122,0,.28) 80deg,transparent 190deg,rgba(255,90,0,.18) 290deg,transparent 360deg)",
              }}
            />

            {/* dashboard-kaart: mobiel in de flow op volle breedte, vanaf sm het
                absolute stage-ontwerp */}
            <div
              className="relative z-[1] mx-auto w-full max-w-[452px] rounded-[20px] p-[1.5px] sm:absolute sm:left-2 sm:top-[34px] sm:mx-0 sm:w-[452px]"
              style={{
                background: "linear-gradient(150deg,rgba(255,150,60,.7),rgba(255,90,0,.25) 55%,rgba(255,255,255,.05))",
                boxShadow: "0 44px 90px -34px rgba(255,80,0,.6)",
              }}
            >
              <div className="overflow-hidden rounded-[19px] border border-white/5 bg-[#0e0d0c]">
                {/* head */}
                <div className="flex items-center justify-between border-b border-white/[0.07] bg-[#100e0d] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="vvw-liveDot h-2 w-2 rounded-full bg-[#5ac47d]" />
                    <span className="font-sora text-[15px] font-bold text-white">Organisch verkeer</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[13px] font-bold text-[#5ac47d]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5ac47d" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 17 9 11l4 4 8-8" /><path d="M17 4h4v4" /></svg>
                    +240%
                  </span>
                </div>
                {/* chart */}
                <div className="px-[18px] pb-2 pt-[18px]">
                  <svg viewBox="0 0 416 172" className="block h-auto w-full" aria-hidden="true">
                    <defs>
                      <linearGradient id="seoFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,122,0,.42)" />
                        <stop offset="100%" stopColor="rgba(255,122,0,0)" />
                      </linearGradient>
                      <linearGradient id="seoStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FF7A00" />
                        <stop offset="100%" stopColor="#FFA23A" />
                      </linearGradient>
                    </defs>
                    <line x1="8" y1="40" x2="408" y2="40" stroke="rgba(255,255,255,.06)" strokeWidth="1" />
                    <line x1="8" y1="86" x2="408" y2="86" stroke="rgba(255,255,255,.06)" strokeWidth="1" />
                    <line x1="8" y1="132" x2="408" y2="132" stroke="rgba(255,255,255,.06)" strokeWidth="1" />
                    <path className="vvseo-area" d="M12 148 C 78 144 108 126 162 118 S 272 90 326 62 S 396 26 404 16 L404 168 L12 168 Z" fill="url(#seoFill)" />
                    <path className="vvseo-line" d="M12 148 C 78 144 108 126 162 118 S 272 90 326 62 S 396 26 404 16" fill="none" stroke="url(#seoStroke)" strokeWidth="3" strokeLinecap="round" />
                    <circle className="vvseo-dot" cx="404" cy="16" r="5.5" fill="#FFB566" />
                  </svg>
                </div>
                {/* keyword-rijen */}
                <div className="flex flex-col gap-[13px] px-5 pb-5 pt-1.5">
                  {[
                    { kw: "gordijnen hasselt", w: "94%", d: "0.1s", rank: "#1" },
                    { kw: "gordijnen op maat", w: "80%", d: "0.3s", rank: "#2" },
                    { kw: "raamdecoratie limburg", w: "88%", d: "0.5s", rank: "#1" },
                  ].map((row) => (
                    <div key={row.kw} className="flex items-center gap-3">
                      <span className="w-[150px] flex-none overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs text-white/[0.72]">
                        {row.kw}
                      </span>
                      <span className="h-[7px] flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <span
                          className="vvseo-bar block h-full rounded-full"
                          style={{ width: row.w, animationDelay: row.d, background: "linear-gradient(90deg,#FF3B2E,#FF7A00)" }}
                        />
                      </span>
                      <span className="inline-flex flex-none items-center gap-[3px] font-mono text-[11px] font-bold text-[#5ac47d]">
                        {row.rank}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5ac47d" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* zwevend: positie #1 - mobiel binnen de viewport over de kaartrand */}
            <div className="vvw-bob absolute right-1 top-0 z-[3] flex items-center gap-2.5 rounded-[14px] border border-[rgba(255,122,0,0.24)] bg-[rgba(20,17,14,0.92)] px-4 py-3 backdrop-blur-md shadow-[0_18px_36px_-16px_rgba(0,0,0,0.85)] sm:right-[-4px] sm:top-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[rgba(90,196,125,0.16)]">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5ac47d" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
              </span>
              <div>
                <div className="font-sora text-[17px] font-extrabold leading-none text-white">Positie #1</div>
                <div className="mt-[3px] text-[10.5px] text-white/50">in Google</div>
              </div>
            </div>

            {/* zwevend: GEO / AI - mobiel binnen de viewport over de kaartrand */}
            <div className="vvw-bob2 absolute bottom-0 left-1 z-[3] rounded-[14px] border border-[rgba(255,122,0,0.24)] bg-[rgba(20,17,14,0.92)] px-4 py-[13px] backdrop-blur-md shadow-[0_18px_36px_-16px_rgba(0,0,0,0.85)] sm:bottom-2 sm:left-[-14px]">
              <div className="mb-[9px] flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /><circle cx="12" cy="12" r="4" /></svg>
                <span className="font-sora text-[13.5px] font-bold text-white">Zichtbaar in AI</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["ChatGPT", "Perplexity", "Gemini"].map((ai) => (
                  <span key={ai} className="rounded-[7px] border border-white/10 bg-white/[0.05] px-2 py-1 font-mono text-[10px] font-semibold text-white/[0.72]">
                    {ai}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
