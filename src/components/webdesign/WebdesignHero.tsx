import { Link } from "@/i18n/navigation";
import { ShowcaseImage } from "./ShowcaseImage";

/** Product-vibe hero for the Webdesign service: copy + a live browser mock-up
 * (scan line, drifting cursor, floating PageSpeed / SEO chips). The preview
 * image is admin-managed. All motion is CSS. */
export function WebdesignHero({ heroImage }: { heroImage?: string }) {
  return (
    <section className="relative overflow-hidden pt-24 text-white">
      {/* ambient glow */}
      {/* Geen max-w-full: het gradientvak moet volledig kunnen uitfaden; de
          section clipt met overflow-hidden, anders ontstaat een harde naad. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-160px] top-[-140px] z-0 h-[760px] w-[760px]"
        style={{ background: "radial-gradient(circle at center,rgba(255,90,0,.14),transparent 66%)" }}
      />
      {/* Extra pb op mobiel: de mockup-gloed (inset -30px + blur) moet volledig
          binnen de section uitfaden, anders kapt overflow-hidden een harde lijn af. */}
      <div className="container relative z-[2] mx-auto grid items-center gap-10 px-2.5 sm:px-4 pt-10 pb-20 lg:grid-cols-[1fr_560px] lg:gap-14 lg:pb-12">
        {/* copy */}
        <div>
          <div className="vvw-mono mb-5 flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.04em] text-white/45">
            <span>Diensten</span>
            <span className="text-white/25">/</span>
            <span className="text-[#FF9A45]">Webdesign</span>
          </div>
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.1)] px-4 py-2 text-[13px] font-bold text-[#FF9A45]">
            <span className="vvw-liveDot h-[7px] w-[7px] rounded-full bg-[#FF7A00]" />
            Websites & webshops
          </div>
          <h1 className="mb-5 text-5xl font-extrabold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-[66px]">
            Webdesign
          </h1>
          <p className="mb-8 max-w-[500px] text-lg leading-relaxed text-white/60 sm:text-[19px]">
            VisualVibe bouwt snelle, gebruiksvriendelijke websites en webshops voor KMO's in Limburg.
            Van een strakke onepager tot een volledige webshop: elke website wordt opgebouwd rond
            snelheid, vindbaarheid en een duidelijk pad naar contact.
          </p>
          <div className="flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
            <Link
              href="/offerte-aanvragen"
              className="vvw-btn inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-base font-bold text-white sm:w-auto"
              style={{
                background: "linear-gradient(90deg,#FF3B2E,#FF7A00)",
                boxShadow: "0 16px 40px -14px rgba(255,90,0,.85)",
              }}
            >
              Offerte aanvragen
              <svg className="vvw-ar" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            <a
              href="#showcase"
              className="vvw-btn inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.14] bg-white/5 px-7 py-3.5 text-base font-bold text-white sm:w-auto"
            >
              Bekijk realisaties
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14" /><path d="m5 12 7 7 7-7" /></svg>
            </a>
          </div>
        </div>

        {/* live mini-mockup */}
        <div className="relative mx-auto w-full max-w-[560px]">
          <div
            className="vvw-glowB pointer-events-none absolute inset-[-30px] z-0"
            style={{ background: "radial-gradient(circle at 60% 45%,rgba(255,100,0,.4),transparent 68%)", filter: "blur(30px)" }}
          />
          <div
            className="relative z-[1] rounded-[18px] p-[1.5px]"
            style={{
              background: "linear-gradient(150deg,rgba(255,150,60,.7),rgba(255,90,0,.25) 55%,rgba(255,255,255,.05))",
              boxShadow: "0 40px 90px -34px rgba(255,80,0,.6)",
            }}
          >
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0e0d0c]">
              <div className="flex items-center gap-2 border-b border-white/[0.07] bg-[#100e0d] px-3.5 py-3">
                <span className="h-[9px] w-[9px] rounded-full bg-[#FF3B2E]" />
                <span className="h-[9px] w-[9px] rounded-full bg-[#FF7A00]" />
                <span className="h-[9px] w-[9px] rounded-full bg-[#FFA23A]" />
                <span className="vvw-mono ml-2 flex h-[22px] flex-1 items-center gap-1.5 rounded-md bg-white/5 px-2.5 font-mono text-[11px] text-white/50">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5ac47d" strokeWidth={2.4} aria-hidden="true"><path d="M7 11V7a5 5 0 0 1 10 0v4" /><rect x="4" y="11" width="16" height="10" rx="2" /></svg>
                  klant-website.be
                </span>
              </div>
              <div className="relative h-[340px]">
                <ShowcaseImage
                  src={heroImage}
                  alt="Website-realisatie van VisualVibe, webdesign voor KMO's in Limburg"
                  placeholder="Sleep hier een website-screenshot"
                  sizes="(max-width: 1024px) 100vw, 560px"
                  eager
                />
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="vvw-scan absolute left-0 right-0 top-0 h-[34px]" style={{ background: "linear-gradient(180deg,transparent,rgba(255,122,0,.35),transparent)" }} />
                </div>
                <div className="vvw-cursor pointer-events-none absolute left-0 top-0 h-[18px] w-[18px]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" stroke="#000" strokeWidth={1} aria-hidden="true"><path d="M4 2l16 9-7 2-3 7z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* floating chips */}
          <div className="vvw-bob absolute right-[-16px] top-6 z-[2] flex items-center gap-2.5 rounded-xl border border-[rgba(255,122,0,0.22)] bg-[rgba(20,17,14,0.9)] px-3.5 py-2.5 backdrop-blur-md" style={{ boxShadow: "0 16px 34px -16px rgba(0,0,0,.8)" }}>
            <svg width="26" height="26" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={4} /><circle cx="18" cy="18" r="15" fill="none" stroke="#5ac47d" strokeWidth={4} strokeLinecap="round" strokeDasharray="94" strokeDashoffset="6" transform="rotate(-90 18 18)" /></svg>
            <div>
              <div className="text-base font-extrabold leading-none text-white">98</div>
              <div className="mt-0.5 text-[10px] text-white/50">PageSpeed</div>
            </div>
          </div>
          <div className="vvw-bob2 absolute bottom-5 left-[-16px] z-[2] flex items-center gap-2 rounded-xl border border-[rgba(255,122,0,0.22)] bg-[rgba(20,17,14,0.9)] px-3.5 py-2.5 backdrop-blur-md" style={{ boxShadow: "0 16px 34px -16px rgba(0,0,0,.8)" }}>
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-[rgba(90,196,125,0.16)]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5ac47d" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
            </span>
            <span className="text-[13px] font-bold text-white">SEO-ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
