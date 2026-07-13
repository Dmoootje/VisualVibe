import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { businessConfig } from "@/config/business.config";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";
import { WeddingVibeLogo } from "@/components/over-ons/WeddingVibeLogo";
import { OvIcon } from "@/components/over-ons/ov-icons";
import { QuoteButton } from "@/components/quote";

export const metadata = pageMetadata({
  title: `Over ons | ${businessConfig.displayName}`,
  description:
    "Maak kennis met VisualVibe en oprichter Jens Hardy: het creatief mediabureau uit Limburg voor webdesign, SEO, foto, video, drone, 3D/VR/AR en podcasting.",
  path: "/over-ons/",
});

const SORA = "var(--font-sora), sans-serif";
const MONO = "var(--font-jetbrains-mono), monospace";
const CORM = "var(--font-cormorant), serif";
const GRAD = "linear-gradient(90deg,#FF3B2E,#FF7A00)";

const IMG = {
  portrait:
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FFotografie%20-%20Jens%20Hardy%20fotograaf%20Limburg.webp?alt=media&token=1ecd395c-f1aa-4458-a4db-bb3ad7e62fa3",
  g1: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FDrone%20Nacht%20fotografie.webp?alt=media&token=a607907f-b11e-42d8-b576-d64cbde39c8f",
  g2: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FAlpen-drone-fotos-scaled.webp?alt=media&token=fe09068a-ff73-4ec8-8a70-382681272bd5",
  g3: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FBedrijfssfotos-drone.webp?alt=media&token=105ae204-ca42-48e3-9d5f-ec9ed86c8c43",
  g4: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FBedrijfssfotos-met-drone.webp?alt=media&token=c0d95d8b-b352-41b3-8f9d-330a77549cb1",
  g5: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FDrone%20woonplaats%20luchtfoto.webp?alt=media&token=6c6e1b31-b0a0-48e2-bac0-42bfaab5c35b",
  g6: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FDrone-zonnepanelen.webp?alt=media&token=419485d3-1c72-49b0-8ef0-020b58afce51",
};

const facts = [
  { big: "Sinds 2020", label: "Creatief mediabureau in Limburg" },
  { big: "7 disciplines", label: "Onder één dak" },
  { big: "1 aanspreekpunt", label: "Van idee tot oplevering" },
  { big: "3 partners", label: "Google · Meta · Leadinfo" },
];
const roles = ["Fotograaf", "Cameraman", "Marketeer", "Dronepiloot", "Webdesigner", "Adviseur"];
const disciplines = [
  { id: "website", name: "Webdesign", desc: "Snelle websites & webshops die bezoekers omzetten in klanten." },
  { id: "seo", name: "SEO", desc: "Vindbaar in Google én de nieuwe AI-zoekmachines." },
  { id: "foto", name: "Fotografie", desc: "Professionele bedrijfs- en productfotografie." },
  { id: "video", name: "Videografie", desc: "Pakkende bedrijfsvideo die jouw verhaal vertelt." },
  { id: "drone", name: "Drone & FPV", desc: "Luchtbeelden en dynamische FPV-shots." },
  { id: "cube", name: "3D, VR & AR", desc: "Immersieve 3D-, VR- en AR-ervaringen." },
  { id: "mic", name: "Podcasting", desc: "Van opname tot afgewerkte podcast." },
];
const values = [
  { id: "website", title: "Alles onder één dak", body: "Webdesign, SEO, fotografie, videografie, drone, 3D/VR/AR en podcasting bij één partner. Geen schakelen tussen losse bureaus." },
  { id: "pin", title: "Lokaal verankerd", body: "Vanuit Limburg werken we voor KMO's in Vlaanderen, Antwerpen en Nederlands-Limburg - dichtbij en betrokken." },
  { id: "heart", title: "Van kennismaking tot oplevering", body: "We denken mee vanaf de eerste kennismaking en blijven betrokken tot het project live staat." },
];
const regionPills = ["Hasselt", "Tongeren", "Bilzen", "Borgloon", "Genk", "Sint-Truiden", "Antwerpen", "Maastricht", "Vlaanderen", "Nederlands-Limburg"];

// Match the site-wide standard width (home/contact use the same .container).
const SECTION = "container mx-auto px-2.5 sm:px-4";
const eyebrow: CSSProperties = { fontFamily: MONO, fontSize: 11.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#FF9A45", margin: 0 };
const h2: CSSProperties = { fontFamily: SORA, fontWeight: 800, fontSize: "clamp(28px,4.4vw,38px)", letterSpacing: "-.025em", color: "#fff", margin: 0, textWrap: "balance" };

function Arrow({ size = 17, cls = "vvov-ar" }: { size?: number; cls?: string }) {
  return (
    <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconChip({ id, size = 46 }: { id: string; size?: number }) {
  return (
    <span style={{ display: "flex", width: size, height: size, borderRadius: 12, background: "rgba(255,122,0,.1)", border: "1px solid rgba(255,122,0,.24)", alignItems: "center", justifyContent: "center", color: "#FF9A45" }}>
      <OvIcon id={id} size={Math.round(size / 2)} />
    </span>
  );
}

function GalTile({ src, alt, sizes, className, children }: { src: string; alt: string; sizes: string; className?: string; children: ReactNode }) {
  return (
    <div className={`vvov-gal ${className ?? ""}`} style={{ position: "relative", overflow: "hidden", borderRadius: 20, border: "1px solid rgba(255,255,255,.08)" }}>
      <div className="vvov-gimg" style={{ position: "absolute", inset: 0 }}>
        <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg,transparent 48%,rgba(10,10,10,.86))" }} />
      {children}
    </div>
  );
}

export default function OverOnsPage() {
  return (
    <div className="vvov-anim" style={{ position: "relative", overflow: "hidden", color: "#fff", fontFamily: "var(--font-manrope), sans-serif" }}>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Over ons", path: "/over-ons" }]} />

      {/* ===== HERO ===== */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(96px,11vw,120px) 0 46px" }}>
        <div className="vvov-glowpulse" style={{ position: "absolute", top: -180, right: -80, width: 820, height: 820, background: "radial-gradient(circle at center,rgba(255,90,0,.18),transparent 62%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px)", backgroundSize: "54px 54px", WebkitMaskImage: "radial-gradient(ellipse at 74% 40%,#000,transparent 68%)", maskImage: "radial-gradient(ellipse at 74% 40%,#000,transparent 68%)" }} />

        <div className={`relative z-[2] ${SECTION}`}>
          <div className="grid items-center gap-10 lg:gap-14 lg:grid-cols-[1.05fr_.95fr]">
            {/* left */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 15px", borderRadius: 9999, background: "rgba(255,122,0,.1)", border: "1px solid rgba(255,122,0,.25)", fontFamily: MONO, fontWeight: 700, fontSize: 12, letterSpacing: ".08em", color: "#FF9A45", marginBottom: 24, textTransform: "uppercase" }}>
                <span className="vvov-liveDot" style={{ width: 7, height: 7, borderRadius: 9999, background: "#FF7A00" }} />
                Het gezicht achter VisualVibe
              </div>
              <h1 style={{ fontFamily: SORA, fontWeight: 800, fontSize: "clamp(40px,7vw,64px)", lineHeight: 1.0, letterSpacing: "-.03em", color: "#fff", margin: "0 0 24px", textWrap: "balance" }}>
                Over <span style={{ color: "#FF7A00" }}>VisualVibe</span>
              </h1>
              <p style={{ fontSize: 19, lineHeight: 1.62, color: "rgba(255,255,255,.68)", margin: "0 0 20px", maxWidth: 520, textWrap: "pretty" }}>
                VisualVibe is het creatief mediabureau uit Limburg. We brengen webdesign, SEO, fotografie, videografie, drone/FPV, 3D/VR/AR en podcasting onder één dak - zodat KMO&apos;s niet met verschillende bureaus hoeven te schakelen voor hun online uitstraling.
              </p>
              <p style={{ fontSize: 16.5, lineHeight: 1.62, color: "rgba(255,255,255,.55)", margin: "0 0 34px", maxWidth: 520, textWrap: "pretty" }}>
                Eén partner, van de eerste kennismaking tot de oplevering.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <QuoteButton mode="kennis" className="vvov-btn" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 16, color: "#fff", padding: "15px 28px", borderRadius: 12, background: GRAD, boxShadow: "0 16px 40px -14px rgba(255,90,0,.85)", border: 0, cursor: "pointer" }}>
                  Laten we kennismaken <Arrow />
                </QuoteButton>
                <Link href="/realisaties" className="vvov-btn" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontWeight: 700, fontSize: 16, color: "#fff", padding: "15px 28px", borderRadius: 12, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.14)" }}>
                  Bekijk realisaties
                </Link>
              </div>
            </div>

            {/* right visual */}
            <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 480 }}>
              <div className="vvov-conic" style={{ position: "absolute", width: "min(560px,100%)", aspectRatio: "1", borderRadius: 9999, background: "conic-gradient(from 0deg,transparent 0deg,rgba(255,122,0,.30) 80deg,transparent 180deg,rgba(255,90,0,.22) 280deg,transparent 360deg)", filter: "blur(50px)", pointerEvents: "none" }} />
              <svg viewBox="0 0 200 200" style={{ position: "absolute", width: "min(520px,96%)", height: "auto", pointerEvents: "none" }}>
                <circle className="vvov-ring1" cx="100" cy="100" r="96" fill="none" stroke="rgba(255,122,0,.30)" strokeWidth="1" strokeDasharray="2 9" strokeLinecap="round" />
                <circle className="vvov-ring2" cx="100" cy="100" r="82" fill="none" stroke="rgba(255,122,0,.18)" strokeWidth="1" strokeDasharray="1 11" strokeLinecap="round" />
              </svg>
              <div style={{ position: "relative", zIndex: 2 }}>
                {/* Jens card */}
                <div style={{ position: "relative", width: "min(368px,80vw)", aspectRatio: "368 / 492", borderRadius: 28, overflow: "hidden", border: "1px solid rgba(255,122,0,.28)", boxShadow: "0 46px 100px -32px rgba(255,90,0,.5),inset 0 0 0 1px rgba(255,255,255,.04)" }}>
                  <Image src={IMG.portrait} alt="Jens Hardy, fotograaf en oprichter van VisualVibe" fill priority sizes="(max-width: 640px) 80vw, 368px" style={{ objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg,transparent 46%,rgba(10,10,10,.9))" }} />
                  <div style={{ position: "absolute", left: 15, top: 15, display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 12px", borderRadius: 9999, background: "rgba(12,10,14,.8)", border: "1px solid rgba(255,122,0,.3)", backdropFilter: "blur(6px)", color: "#FF9A45", fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: ".08em" }}>
                    <span className="vvov-liveDot" style={{ width: 6, height: 6, borderRadius: 9999, background: "#FF7A00" }} />IN BEELD
                  </div>
                  <div style={{ position: "absolute", left: 22, bottom: 20, right: 22 }}>
                    <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 25, color: "#fff" }}>Jens Hardy</div>
                    <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".03em", color: "#FF9A45", marginTop: 5 }}>Fotograaf · Cameraman · Marketeer</div>
                  </div>
                </div>
                {/* secret card */}
                <div className="vvov-secret" style={{ position: "absolute", right: -26, bottom: -24, zIndex: 3, width: 134, height: 178, borderRadius: 18, overflow: "hidden", border: "1px dashed rgba(255,122,0,.45)", background: "radial-gradient(120% 85% at 50% 24%,rgba(72,46,108,.6),transparent 62%),linear-gradient(180deg,#151019,#0b0a0e)", boxShadow: "0 30px 70px -26px rgba(0,0,0,.9),inset 0 0 0 1px rgba(255,255,255,.03)", cursor: "pointer" }}>
                  <div className="vvov-twiglow" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(62% 46% at 50% 38%,rgba(255,122,0,.22),transparent 66%)", opacity: 0.5 }} />
                  <svg className="vvov-silho" viewBox="0 0 100 120" style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)", width: 106, height: "auto", opacity: 0.55 }}>
                    <defs><linearGradient id="ov-silg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(255,255,255,.16)" /><stop offset="1" stopColor="rgba(255,255,255,.015)" /></linearGradient></defs>
                    <circle cx="50" cy="33" r="17" fill="url(#ov-silg)" />
                    <path d="M20 120 C20 86 33 69 50 69 C67 69 80 86 80 120 Z" fill="url(#ov-silg)" />
                  </svg>
                  <div className="vvov-qwrap" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 34, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <span className="vvov-qmark" style={{ fontFamily: SORA, fontWeight: 800, fontSize: 58, lineHeight: 1, color: "#FF7A00", textShadow: "0 8px 26px rgba(255,90,0,.55)" }}>?</span>
                    <svg className="vvov-smiley" viewBox="0 0 24 24" style={{ position: "absolute", width: 46, height: 46, filter: "drop-shadow(0 6px 18px rgba(255,90,0,.5))" }} fill="none" stroke="#FF7A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9.5" /><path d="M8 14.5s1.4 2 4 2 4-2 4-2" /><path d="M9 9.5h.01M15 9.5h.01" />
                    </svg>
                  </div>
                  <div style={{ position: "absolute", right: 9, top: 9, color: "#FF9A45", opacity: 0.85 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></svg>
                  </div>
                  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg,transparent 56%,rgba(10,10,10,.94))" }} />
                  <div style={{ position: "absolute", left: 11, bottom: 10, right: 11 }}>
                    <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 14, color: "#fff", letterSpacing: ".16em" }}>???</div>
                    <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: ".02em", color: "#FF9A45", marginTop: 2 }}>Secret webdesigner</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* fact strip */}
          <div className="mt-[52px] grid grid-cols-2 gap-6 border-t border-white/[0.08] pt-[30px] lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.big}>
                <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 30, letterSpacing: "-.02em", color: "#fff" }}>{f.big}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,.55)", marginTop: 5 }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOUNDER STORY ===== */}
      <section className={`relative z-[2] ${SECTION}`} style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="grid items-start gap-10 lg:gap-14 lg:grid-cols-[.42fr_.58fr]">
          <div>
            <p style={{ ...eyebrow, marginBottom: 14 }}>Ontmoet Jens Hardy</p>
            <h2 style={{ ...h2, fontSize: "clamp(30px,4.6vw,40px)", lineHeight: 1.06, marginBottom: 22 }}>Eén gezicht, van eerste idee tot oplevering</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {roles.map((r) => (
                <span key={r} className="vvov-role" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 15px", borderRadius: 9999, border: "1px solid rgba(255,122,0,.25)", background: "rgba(255,122,0,.07)", fontSize: 13.5, fontWeight: 600, color: "#fff" }}>
                  <span style={{ width: 6, height: 6, borderRadius: 9999, background: "#FF7A00" }} />{r}
                </span>
              ))}
            </div>
            <a href="https://weddingvibe.be/" rel="dofollow" target="_blank" className="vvov-wed" style={{ marginTop: 26, position: "relative", display: "inline-flex", alignItems: "center", gap: 16, padding: "15px 18px 15px 22px", borderRadius: 16, background: "#FFFFFF", width: "fit-content", maxWidth: "100%", overflow: "hidden", boxShadow: "0 18px 42px -20px rgba(201,162,75,.6),0 4px 14px -8px rgba(0,0,0,.5)" }}>
              <span style={{ position: "relative", zIndex: 1, flex: "none" }}><WeddingVibeLogo height={34} /></span>
              <span style={{ position: "relative", zIndex: 1, width: 1, alignSelf: "stretch", background: "linear-gradient(180deg,transparent,rgba(201,162,75,.55),transparent)" }} />
              <span style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                <span style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#B8860B" }}>Ook voor je mooiste dag</span>
                <span style={{ fontFamily: CORM, fontWeight: 600, fontSize: 23, lineHeight: 1.05, color: "#2A2320", letterSpacing: ".01em" }}>Huwelijks- &amp; bruidsfotografie</span>
              </span>
              <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 9999, background: "linear-gradient(135deg,#EED89A,#C9A24B)", flex: "none", boxShadow: "0 5px 14px -5px rgba(201,162,75,.8)" }}>
                <svg className="vvov-ar" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </span>
            </a>
          </div>
          <div style={{ position: "relative", paddingLeft: 30 }}>
            <span style={{ position: "absolute", left: 0, top: 2, fontFamily: SORA, fontWeight: 800, fontSize: 64, lineHeight: 0.6, color: "rgba(255,122,0,.28)" }}>&#8220;</span>
            <p style={{ fontSize: 22, lineHeight: 1.55, fontWeight: 600, color: "#fff", margin: "0 0 22px", textWrap: "pretty" }}>Welkom bij VisualVibe. Ik ben Jens Hardy - gepassioneerd fotograaf, cameraman en ervaren marketeer, en de drijvende kracht achter alles wat we maken.</p>
            <p style={{ fontSize: 16.5, lineHeight: 1.68, color: "rgba(255,255,255,.62)", margin: "0 0 16px", textWrap: "pretty" }}>VisualVibe is gespecialiseerd in foto-, video- en websiteprojecten. Of het nu gaat om een nieuwe website, professionele bedrijfsfotografie, een pakkende bedrijfsvideo of een sterke lokale SEO-strategie: ik denk met je mee vanaf de eerste kennismaking.</p>
            <p style={{ fontSize: 16.5, lineHeight: 1.68, color: "rgba(255,255,255,.62)", margin: 0, textWrap: "pretty" }}>Door beeld, verhaal en techniek in één hand te houden, zorg ik dat alles klopt - en dat jouw merk online precies de vibe uitstraalt die het verdient.</p>
            <div style={{ marginTop: 26, fontFamily: SORA, fontWeight: 700, fontSize: 20, color: "rgba(255,255,255,.85)", fontStyle: "italic" }}>Jens Hardy</div>
          </div>
        </div>
      </section>

      {/* ===== PHOTO GALLERY ===== */}
      <section className={`relative z-[2] ${SECTION}`} style={{ paddingTop: 24, paddingBottom: 64 }}>
        <div className="mb-[26px] flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p style={{ ...eyebrow, marginBottom: 12 }}>Achter de lens</p>
            <h2 style={h2}>Beeld dat vanuit de lucht vertelt</h2>
          </div>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "rgba(255,255,255,.55)", maxWidth: 360, margin: 0, textWrap: "pretty" }}>Een greep uit ons drone-, lucht- en bedrijfsfotografiewerk - van bedrijfspand tot bergtop.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 auto-rows-[220px] sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[230px]">
          <GalTile src={IMG.g1} alt="Drone nachtfotografie" sizes="(max-width: 1024px) 100vw, 684px" className="sm:col-span-2 lg:[grid-column:1/span_2] lg:[grid-row:1/span_2]">
            <div style={{ position: "absolute", left: 20, top: 18, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 13px", borderRadius: 9999, background: "rgba(12,10,14,.82)", border: "1px solid rgba(255,122,0,.3)", backdropFilter: "blur(6px)", color: "#FF9A45", fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: ".06em" }}>
              <OvIcon id="drone" size={14} strokeWidth={1.8} />DRONE · NACHT
            </div>
            <div style={{ position: "absolute", left: 22, bottom: 22, right: 22 }}>
              <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 23, color: "#fff" }}>Nachtfotografie vanuit de lucht</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.72)", marginTop: 5 }}>Sfeervolle luchtbeelden wanneer de stad oplicht.</div>
            </div>
          </GalTile>

          <GalTile src={IMG.g2} alt="De Alpen vanuit de lucht" sizes="(max-width: 1024px) 100vw, 684px" className="sm:col-span-2 lg:[grid-column:3/span_2] lg:[grid-row:1]">
            <div style={{ position: "absolute", left: 16, top: 14, display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 12px", borderRadius: 9999, background: "rgba(12,10,14,.82)", border: "1px solid rgba(255,122,0,.3)", backdropFilter: "blur(6px)", color: "#FF9A45", fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em" }}>
              <OvIcon id="drone" size={13} strokeWidth={1.8} />DRONE &amp; FPV
            </div>
            <div style={{ position: "absolute", left: 18, bottom: 16, right: 18 }}>
              <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 18, color: "#fff" }}>De Alpen vanuit de lucht</div>
            </div>
          </GalTile>

          <GalTile src={IMG.g3} alt="Bedrijfsfotografie met drone" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 342px" className="lg:[grid-column:3] lg:[grid-row:2]">
            <div style={{ position: "absolute", left: 15, bottom: 14, right: 15 }}>
              <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 15.5, color: "#fff" }}>Bedrijfsfotografie</div>
            </div>
          </GalTile>

          <GalTile src={IMG.g4} alt="Bedrijfsbeeld op locatie met drone" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 342px" className="lg:[grid-column:4] lg:[grid-row:2]">
            <div style={{ position: "absolute", left: 15, bottom: 14, right: 15 }}>
              <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 15.5, color: "#fff" }}>Bedrijfsbeeld op locatie</div>
            </div>
          </GalTile>

          <GalTile src={IMG.g5} alt="Luchtfoto van je woonplaats" sizes="(max-width: 1024px) 100vw, 684px" className="sm:col-span-2 lg:[grid-column:1/span_2] lg:[grid-row:3]">
            <div style={{ position: "absolute", left: 18, bottom: 16, right: 18 }}>
              <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 18, color: "#fff" }}>Luchtfoto van je woonplaats</div>
            </div>
          </GalTile>

          <GalTile src={IMG.g6} alt="Drone-inspectie van zonnepanelen" sizes="(max-width: 1024px) 100vw, 684px" className="sm:col-span-2 lg:[grid-column:3/span_2] lg:[grid-row:3]">
            <div style={{ position: "absolute", left: 18, bottom: 16, right: 18 }}>
              <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 18, color: "#fff" }}>Inspectie van zonnepanelen</div>
            </div>
          </GalTile>
        </div>
      </section>

      {/* ===== DISCIPLINES ===== */}
      <section className={`relative z-[2] ${SECTION}`} style={{ paddingTop: 20, paddingBottom: 30 }}>
        <div className="mb-[30px] flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p style={{ ...eyebrow, marginBottom: 12 }}>Alles onder één dak</p>
            <h2 style={h2}>Zeven disciplines, één aanspreekpunt</h2>
          </div>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "rgba(255,255,255,.55)", maxWidth: 340, margin: 0, textWrap: "pretty" }}>Geen versnippering over losse leveranciers. Alles wat je online nodig hebt, in één samenhangend geheel.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {disciplines.map((d) => (
            <div key={d.id} className="vvov-svc" style={{ position: "relative", overflow: "hidden", borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)", padding: "22px 22px 24px" }}>
              <OvIcon id={d.id} className="vvov-wm" size={150} strokeWidth={1} style={{ position: "absolute", right: -24, bottom: -28, color: "rgba(255,122,0,.055)", pointerEvents: "none" }} aria-hidden="true" />
              <div style={{ position: "relative" }}>
                <div style={{ marginBottom: 16 }}><IconChip id={d.id} /></div>
                <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 6 }}>{d.name}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.5, color: "rgba(255,255,255,.52)", textWrap: "pretty" }}>{d.desc}</div>
              </div>
            </div>
          ))}
          <Link href="/diensten" className="vvov-disc" style={{ padding: "22px 20px", borderRadius: 16, border: "1px solid rgba(255,122,0,.3)", background: "radial-gradient(120% 140% at 100% 0%,rgba(255,90,0,.16),transparent 65%),rgba(255,255,255,.02)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16 }}>
            <span style={{ display: "flex", width: 46, height: 46, borderRadius: 12, background: GRAD, alignItems: "center", justifyContent: "center", color: "#fff" }}><Arrow size={22} /></span>
            <div>
              <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 6 }}>Ontdek alle diensten</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.5, color: "rgba(255,255,255,.6)" }}>Bekijk wat we voor jouw KMO kunnen betekenen.</div>
            </div>
          </Link>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className={`relative z-[2] ${SECTION}`} style={{ paddingTop: 44, paddingBottom: 20 }}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="vvov-val" style={{ padding: "30px 26px", borderRadius: 18, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)" }}>
              <div style={{ marginBottom: 18 }}><IconChip id={v.id} size={44} /></div>
              <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 10 }}>{v.title}</div>
              <div style={{ fontSize: 15, lineHeight: 1.62, color: "rgba(255,255,255,.58)", textWrap: "pretty" }}>{v.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== REGION MARQUEE ===== */}
      <section className={`relative z-[2] ${SECTION}`} style={{ paddingTop: 44, paddingBottom: 20 }}>
        <p style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.45)", margin: "0 0 18px", textAlign: "center" }}>Voor KMO&apos;s in Limburg, Vlaanderen, Antwerpen &amp; Nederlands-Limburg</p>
        <div className="vvov-mq">
          <div className="vvov-mqTrack vvov-mqL">
            {[...regionPills, ...regionPills].map((r, i) => (
              <span key={`${r}-${i}`} style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 11, padding: "12px 22px", borderRadius: 9999, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.02)" }}>
                <span style={{ color: "#FF9A45", display: "inline-flex" }}><OvIcon id="pin" size={16} strokeWidth={1.8} /></span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,.82)", whiteSpace: "nowrap" }}>{r}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BAND ===== */}
      <section className={`relative z-[2] ${SECTION}`} style={{ margin: "44px auto 80px" }}>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 24, border: "1px solid rgba(255,122,0,.25)", background: "radial-gradient(120% 160% at 100% 0%,rgba(255,90,0,.18),transparent 60%),rgba(255,255,255,.02)", padding: "clamp(36px,5vw,52px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 28 }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "44px 44px", WebkitMaskImage: "radial-gradient(ellipse at 90% 10%,#000,transparent 70%)", maskImage: "radial-gradient(ellipse at 90% 10%,#000,transparent 70%)" }} />
          <div style={{ position: "relative" }}>
            <h3 style={{ fontFamily: SORA, fontWeight: 800, fontSize: "clamp(26px,4vw,34px)", letterSpacing: "-.025em", color: "#fff", margin: "0 0 10px" }}>Laten we kennismaken</h3>
            <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "rgba(255,255,255,.65)", margin: 0, maxWidth: 560, textWrap: "pretty" }}>Vertel kort over je project - je krijgt snel een helder voorstel, rechtstreeks van Jens.</p>
          </div>
          <Link href="/offerte-aanvragen" className="vvov-btn" style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 16.5, color: "#fff", padding: "17px 32px", borderRadius: 12, background: GRAD, boxShadow: "0 16px 40px -14px rgba(255,90,0,.85)" }}>
            Offerte aanvragen <Arrow size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
