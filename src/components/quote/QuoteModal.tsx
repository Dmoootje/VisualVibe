"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { OvIcon } from "@/components/over-ons/ov-icons";

type Mode = "offerte" | "kennis";

const SORA = "var(--font-sora), sans-serif";
const MONO = "var(--font-jetbrains-mono), monospace";
const GRADIENT = "linear-gradient(90deg,#FF3B2E,#FF7A00)";

const SERVICES = [
  { id: "webdesign", icon: "website", name: "Webdesign", desc: "Website of webshop" },
  { id: "seo", icon: "seo", name: "SEO & Marketing", desc: "Gevonden worden" },
  { id: "fotografie", icon: "foto", name: "Fotografie", desc: "Bedrijfs- & productfoto's" },
  { id: "videografie", icon: "video", name: "Videografie", desc: "Video & montage" },
  { id: "drone-fpv", icon: "drone", name: "Drone & FPV", desc: "Lucht- & FPV-beelden" },
  { id: "3d-vr-ar", icon: "cube", name: "3D, VR & AR", desc: "Tours en immersieve media" },
  { id: "podcasting", icon: "mic", name: "Podcasting", desc: "Opname tot afgewerkt" },
  { id: "masterclasses", icon: "video", name: "Masterclasses", desc: "Opleiding professioneel vastleggen" },
] as const;

function Ar({ size = 17 }: { size?: number }) {
  return (
    <svg className="vvqm-ar" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function Check({ size = 14, stroke = "#fff", w = 3 }: { size?: number; stroke?: string; w?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const fieldLabel = { display: "block", fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,.6)", marginBottom: 7 } as const;

export function QuoteModalContent({ mode, onClose }: { mode: Mode; onClose: () => void }) {
  const open = true;
  const close = onClose;
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [adres, setAdres] = useState("");
  const [bericht, setBericht] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [sentServices, setSentServices] = useState<string[]>([]);
  const idempotencyKeyRef = useRef<string | null>(null);

  // Lock body scroll + Escape to close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [close, open]);

  const isKennis = mode === "kennis";
  const showStepper = open && !done && !isKennis;
  const showServices = open && !done && !isKennis && step === 1;
  const showForm = open && !done && (isKennis || step === 2);
  const selectedNames = SERVICES.filter((s) => selected.includes(s.id)).map((s) => s.name);

  function toggle(id: string) {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.concat(id)));
  }

  async function submit() {
    setError(null);
    if (naam.trim().length < 2) {
      setError("Vul je naam in.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Vul een geldig e-mailadres in.");
      return;
    }
    if (!privacyAccepted) {
      setError("Bevestig dat we je gegevens mogen verwerken voor deze aanvraag.");
      return;
    }

    const parts = [
      selectedNames.length ? `Aanvraag voor: ${selectedNames.join(", ")}` : "",
      adres.trim() ? `Adres: ${adres.trim()}` : "",
      bericht.trim(),
    ].filter(Boolean);
    const message =
      parts.join("\n\n") ||
      (isKennis
        ? "Kennismaking aangevraagd via de website."
        : "Offerteaanvraag via de website.");

    setBusy(true);
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const localeSegment = window.location.pathname.split("/").filter(Boolean)[0];
      const locale = localeSegment === "fr" || localeSegment === "en" ? localeSegment : "nl";
      idempotencyKeyRef.current ??= window.crypto.randomUUID();
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: naam.trim(),
          email: email.trim(),
          phone: tel.trim() || undefined,
          selectedServices: selected,
          serviceInterest: selected[0] || undefined,
          formType: isKennis ? "quote_modal_kennis" : "quote_modal_offerte",
          locale,
          idempotencyKey: idempotencyKeyRef.current,
          message,
          privacyAccepted,
          sourcePage: window.location.pathname,
          sourceUrl: window.location.href,
          utmSource: searchParams.get("utm_source") || undefined,
          utmMedium: searchParams.get("utm_medium") || undefined,
          utmCampaign: searchParams.get("utm_campaign") || undefined,
          website: "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Er ging iets mis. Probeer opnieuw.");
      }
      setSentServices(selectedNames);
      idempotencyKeyRef.current = null;
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er ging iets mis. Probeer opnieuw.");
    } finally {
      setBusy(false);
    }
  }

  const doneFirstName = naam.trim() ? ` ${naam.trim().split(" ")[0]}` : "";

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isKennis ? "Kennismaken" : "Offerte aanvragen"}
          style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
        >
          <div
            className="vvqm-bg"
            onClick={close}
            style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 100%,rgba(255,90,0,.14),transparent 55%),rgba(4,4,4,.88)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          />
          <div
            className="vvqm-card"
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", zIndex: 1, width: "min(920px,100%)", maxHeight: "94vh", overflow: "auto", background: "linear-gradient(180deg,#17130f,#0b0a09)", border: "1px solid rgba(255,255,255,.1)", borderTop: "2px solid rgba(255,122,0,.45)", borderRadius: "28px 28px 0 0", boxShadow: "0 -30px 130px -30px rgba(255,90,0,.4),0 -12px 60px -20px rgba(0,0,0,.92)", padding: "16px 44px 40px" }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 300, pointerEvents: "none", background: "radial-gradient(90% 120% at 85% 0%,rgba(255,90,0,.12),transparent 60%)" }} />
            <div style={{ position: "relative" }}>
              <div className="vvqm-handle" />

              {/* top bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 11 }}>
                  <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 18, color: "#fff" }}>Visual<span style={{ color: "#FF7A00" }}>Vibe</span></span>
                  <span style={{ width: 5, height: 5, borderRadius: 9999, background: "rgba(255,255,255,.22)" }} />
                  <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#FF9A45" }}>{isKennis ? "Kennismaken" : "Offerte aanvragen"}</span>
                </div>
                <button type="button" onClick={close} aria-label="Sluiten" className="vvqm-x" style={{ width: 38, height: 38, borderRadius: 9999, border: "1px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.03)", color: "rgba(255,255,255,.7)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>

              {/* stepper */}
              {showStepper && (
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30, maxWidth: 430 }}>
                  <span className="vvqm-stepItem" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <span className="vvqm-stepC on">{step > 1 ? <Check size={13} /> : "1"}</span>
                    <span className="vvqm-stepL on">Diensten</span>
                  </span>
                  <span className={`vvqm-stepBar ${step === 2 ? "on" : ""}`} />
                  <span className="vvqm-stepItem" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <span className={`vvqm-stepC ${step === 2 ? "on" : ""}`}>2</span>
                    <span className={`vvqm-stepL ${step === 2 ? "on" : ""}`}>Gegevens</span>
                  </span>
                </div>
              )}

              {/* STEP 1: service picker */}
              {showServices && (
                <div className="vvqm-stepBody">
                  <h3 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 30, letterSpacing: "-.02em", color: "#fff", margin: "0 0 8px", textWrap: "balance" }}>Waarvoor wil je een offerte?</h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.5, color: "rgba(255,255,255,.6)", margin: "0 0 26px" }}>Kies één of meerdere diensten - tik aan wat voor jou van toepassing is.</p>
                  <div className="vvqm-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                    {SERVICES.map((s) => {
                      const on = selected.includes(s.id);
                      return (
                        <button key={s.id} type="button" onClick={() => toggle(s.id)} className={`vvqm-sel ${on ? "on" : ""}`} style={{ position: "relative", overflow: "hidden", textAlign: "left", cursor: "pointer", borderRadius: 16, padding: "20px 18px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" }}>
                          <OvIcon id={s.icon} className="vvqm-wmC" size={118} strokeWidth={1} style={{ position: "absolute", right: -18, bottom: -22, color: "rgba(255,122,0,.05)", pointerEvents: "none" }} aria-hidden="true" />
                          <span style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 13 }}>
                            <span className="vvqm-selIcon" style={{ display: "flex", width: 44, height: 44, borderRadius: 12, background: "rgba(255,122,0,.1)", border: "1px solid rgba(255,122,0,.24)", alignItems: "center", justifyContent: "center", color: "#FF9A45", transition: "background .25s ease,border-color .25s ease" }}>
                              <OvIcon id={s.icon} size={22} />
                            </span>
                            <span style={{ display: "block" }}>
                              <span style={{ display: "block", fontFamily: SORA, fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: "-.01em" }}>{s.name}</span>
                              <span style={{ display: "block", fontSize: 12.5, color: "rgba(255,255,255,.5)", marginTop: 3 }}>{s.desc}</span>
                            </span>
                          </span>
                          <span className="vvqm-chk" style={{ position: "absolute", right: 12, top: 12, zIndex: 3, width: 24, height: 24, borderRadius: 9999, background: "#FF7A00", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px -4px rgba(255,90,0,.9)" }}><Check /></span>
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 28 }}>
                    <span style={{ fontSize: 13.5, color: "rgba(255,255,255,.5)" }}><strong style={{ color: "#fff", fontWeight: 700 }}>{selected.length}</strong> geselecteerd</span>
                    {selected.length > 0 ? (
                      <button type="button" onClick={() => setStep(2)} className="vvqm-btn" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 16, color: "#fff", padding: "14px 26px", borderRadius: 12, background: GRADIENT, boxShadow: "0 16px 40px -14px rgba(255,90,0,.85)", cursor: "pointer", border: 0 }}>
                        Volgende <Ar />
                      </button>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontWeight: 700, fontSize: 15, color: "rgba(255,255,255,.4)", padding: "14px 24px", borderRadius: 12, border: "1px dashed rgba(255,255,255,.16)" }}>Kies minstens één dienst</span>
                    )}
                  </div>
                </div>
              )}

              {/* FORM: offerte step 2 / kennismaken */}
              {showForm && (
                <div className="vvqm-stepBody">
                  {!isKennis && (
                    <>
                      <button type="button" onClick={() => setStep(1)} className="vvqm-back" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: ".04em", color: "rgba(255,255,255,.55)", marginBottom: 16, background: "none", border: 0, cursor: "pointer" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>Terug naar diensten
                      </button>
                      <h3 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 30, letterSpacing: "-.02em", color: "#fff", margin: "0 0 8px" }}>Bijna klaar - je gegevens</h3>
                      <p style={{ fontSize: 15.5, lineHeight: 1.5, color: "rgba(255,255,255,.6)", margin: "0 0 18px" }}>Vul je gegevens aan, dan sturen we een voorstel op maat. De rest bespreken we samen.</p>
                      {selectedNames.length > 0 && (
                        <div style={{ borderRadius: 14, border: "1px solid rgba(255,122,0,.22)", background: "rgba(255,122,0,.05)", padding: "14px 16px", marginBottom: 22 }}>
                          <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#FF9A45", marginBottom: 10 }}>Aanvraag voor</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {selectedNames.map((n) => (
                              <span key={n} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 9999, background: "rgba(255,122,0,.12)", border: "1px solid rgba(255,122,0,.3)", fontSize: 13, fontWeight: 600, color: "#fff" }}><Check size={12} stroke="#FF9A45" />{n}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {isKennis && (
                    <>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 9999, background: "rgba(255,122,0,.1)", border: "1px solid rgba(255,122,0,.25)", fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#FF9A45", marginBottom: 16 }}><span style={{ width: 6, height: 6, borderRadius: 9999, background: "#FF7A00" }} />Vrijblijvend gesprek</span>
                      <h3 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 30, letterSpacing: "-.02em", color: "#fff", margin: "0 0 8px" }}>Leuk - laten we kennismaken</h3>
                      <p style={{ fontSize: 15.5, lineHeight: 1.5, color: "rgba(255,255,255,.6)", margin: "0 0 24px" }}>Laat je gegevens achter, dan neem ik - Jens - snel persoonlijk contact op. Geen verplichtingen.</p>
                    </>
                  )}

                  <div className="vvqm-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
                    <label className="vvqm-fldWrap" style={{ display: "block", gridColumn: "1 / -1" }}>
                      <span style={fieldLabel}>Naam</span>
                      <span className="vvqm-fldIco"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg></span>
                      <input className="vvqm-inp pad" type="text" placeholder="Voor- en achternaam" value={naam} onChange={(e) => setNaam(e.target.value)} />
                    </label>
                    <label className="vvqm-fldWrap" style={{ display: "block" }}>
                      <span style={fieldLabel}>E-mailadres</span>
                      <span className="vvqm-fldIco"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg></span>
                      <input className="vvqm-inp pad" type="email" placeholder="jij@bedrijf.be" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label className="vvqm-fldWrap" style={{ display: "block" }}>
                      <span style={fieldLabel}>Telefoonnummer</span>
                      <span className="vvqm-fldIco"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg></span>
                      <input className="vvqm-inp pad" type="tel" placeholder="+32 ..." value={tel} onChange={(e) => setTel(e.target.value)} />
                    </label>
                    <label className="vvqm-fldWrap" style={{ display: "block", gridColumn: "1 / -1" }}>
                      <span style={fieldLabel}>Adres</span>
                      <span className="vvqm-fldIco"><OvIcon id="pin" size={16} strokeWidth={1.9} /></span>
                      <input className="vvqm-inp pad" type="text" placeholder="Straat, nr, gemeente" value={adres} onChange={(e) => setAdres(e.target.value)} />
                    </label>
                    <label style={{ display: "block", gridColumn: "1 / -1" }}>
                      <span style={fieldLabel}>Korte beschrijving <span style={{ color: "rgba(255,255,255,.35)", fontWeight: 400 }}>(optioneel - de rest bespreken we samen)</span></span>
                      <textarea className="vvqm-inp" rows={4} placeholder="Vertel kort waar je aan denkt..." value={bericht} onChange={(e) => setBericht(e.target.value)} style={{ resize: "vertical", minHeight: 96 }} />
                    </label>
                  </div>

                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 18, color: "rgba(255,255,255,.62)", fontSize: 13.5, lineHeight: 1.5 }}>
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(event) => setPrivacyAccepted(event.target.checked)}
                      style={{ marginTop: 3, accentColor: "#FF7A00" }}
                    />
                    <span>Ik ga akkoord met de verwerking van mijn gegevens voor de opvolging van deze aanvraag.</span>
                  </label>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 20 }}>
                    {["Veilig opgeslagen", "Volledig vrijblijvend", "Rechtstreeks van Jens"].map((t) => (
                      <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "rgba(255,255,255,.5)" }}><Check size={15} stroke="#FF9A45" w={2.4} />{t}</span>
                    ))}
                  </div>

                  {error && <p style={{ marginTop: 16, color: "#ff8a6b", fontSize: 14 }} role="alert">{error}</p>}

                  <button type="button" onClick={submit} disabled={busy} className="vvqm-btn" style={{ marginTop: 24, display: "inline-flex", width: "100%", boxSizing: "border-box", alignItems: "center", justifyContent: "center", gap: 10, fontWeight: 700, fontSize: 16.5, color: "#fff", padding: "16px 28px", borderRadius: 13, background: GRADIENT, boxShadow: "0 16px 40px -14px rgba(255,90,0,.85)", cursor: busy ? "default" : "pointer", border: 0, opacity: busy ? 0.7 : 1 }}>
                    {busy ? "Bezig met verzenden..." : isKennis ? "Verstuur" : "Offerte aanvragen"} {!busy && <Ar size={18} />}
                  </button>
                </div>
              )}

              {/* DONE */}
              {done && (
                <div className="vvqm-stepBody" style={{ textAlign: "center", padding: "24px 0 14px" }}>
                  <span className="vvqm-doneWrap" style={{ display: "inline-flex", width: 82, height: 82, borderRadius: 9999, background: "radial-gradient(circle,rgba(255,122,0,.2),rgba(255,122,0,.05))", border: "1px solid rgba(255,122,0,.35)", alignItems: "center", justifyContent: "center", color: "#FF9A45", marginBottom: 24, boxShadow: "0 22px 54px -20px rgba(255,90,0,.75)" }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path className="vvqm-doneChk" d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <h3 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 31, letterSpacing: "-.02em", color: "#fff", margin: "0 0 12px" }}>Bedankt{doneFirstName}!</h3>
                  <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,.62)", margin: "0 auto 20px", maxWidth: 460 }}>We hebben je aanvraag goed ontvangen en nemen zo snel mogelijk persoonlijk contact met je op.</p>
                  {sentServices.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, margin: "0 auto 20px", maxWidth: 520 }}>
                      {sentServices.map((n) => (
                        <span key={n} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 9999, background: "rgba(255,122,0,.1)", border: "1px solid rgba(255,122,0,.28)", fontSize: 13, fontWeight: 600, color: "#fff" }}><Check size={12} stroke="#FF9A45" />{n}</span>
                      ))}
                    </div>
                  )}
                  {email.trim() && <p style={{ fontSize: 14, color: "rgba(255,255,255,.5)", margin: "0 0 26px" }}>Je aanvraag voor <span style={{ color: "#FF9A45", fontWeight: 600 }}>{email.trim()}</span> is veilig opgeslagen.</p>}
                  <button type="button" onClick={close} style={{ display: "inline-flex", alignItems: "center", gap: 9, fontWeight: 700, fontSize: 16, color: "#fff", padding: "14px 30px", borderRadius: 12, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.16)", cursor: "pointer" }}>Sluiten</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
