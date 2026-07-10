"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { regions } from "@/data/regions";
import { RegionMiniMap } from "@/features/home/RegionIntro/components/RegionMiniMap";
import { NavIcon } from "./nav-icons";
import {
  pillars,
  regioItems,
  sectorItems,
  realisatieItems,
  kennisbankItems as defaultKennisbankItems,
  type NavLink,
} from "./navData";

const SORA = "var(--font-sora), sans-serif";
const MONO = "var(--font-jetbrains-mono), monospace";
const GRADIENT = "linear-gradient(90deg,#FF3B2E,#FF7A00)";

type DesktopMenu = "diensten" | "regio" | "realisaties" | "sectoren" | "kennisbank" | null;
type DrawerSection = "regio" | "realisaties" | "sectoren" | "kennisbank" | null;

function ChevDown({ className, color = "#FF7A00" }: { className?: string; color?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function ChevRight({ className, color = "currentColor", size = 16 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function UserIcon({ size = 20, color = "rgba(255,255,255,.8)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function Logo({ size = 24 }: { size?: number }) {
  return (
    <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: size, letterSpacing: "-.01em", color: "#fff" }}>
      Visual<span style={{ color: "#FF7A00" }}>Vibe</span>
    </span>
  );
}

const rowLink = "flex items-center gap-2";

export function Nav({
  kennisbankItems = defaultKennisbankItems,
}: {
  kennisbankItems?: NavLink[];
}) {
  const pathname = usePathname();

  // Desktop
  const [menu, setMenu] = useState<DesktopMenu>(null);
  const [active, setActive] = useState<number | null>(null);
  const [fade, setFade] = useState(false);

  // Mobile drawer
  const [drawer, setDrawer] = useState(false);
  const [mNav, setMNav] = useState(true);
  const [mExp, setMExp] = useState<number | null>(0);
  const [mSection, setMSection] = useState<DrawerSection>(null);

  function pick(i: number) {
    setActive(i);
    setFade(false);
    const id = setTimeout(() => setFade(true), 24);
    return () => clearTimeout(id);
  }
  function openMega() {
    setMenu("diensten");
  }
  function closeMenu() {
    setMenu(null);
    setActive(null);
    setFade(false);
  }

  // Close everything on route change.
  useEffect(() => {
    setDrawer(false);
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  // Escape closes drawer + any open menu.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDrawer(false);
        closeMenu();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ap = active != null ? pillars[active] : null;

  return (
    <header className="vvnav-bar">
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          padding: "18px clamp(20px,4vw,56px)",
        }}
      >
        <Link href="/" aria-label="VisualVibe home">
          <Logo />
        </Link>

        {/* ===== desktop center ===== */}
        <div className="vvnav-center" style={{ alignItems: "center", gap: 26, fontWeight: 600, fontSize: 15, color: "rgba(255,255,255,.85)" }}>
          <Link href="/" aria-label="Home" className="vvnav-link" style={{ display: "inline-flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" />
            </svg>
          </Link>

          {/* Diensten mega */}
          <div
            className={`vvnav-wrap ${menu === "diensten" ? "is-on" : ""}`}
            style={{ position: "relative" }}
            onMouseEnter={openMega}
            onMouseLeave={closeMenu}
          >
            <button
              type="button"
              onClick={() => (menu === "diensten" ? closeMenu() : openMega())}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer", color: "#fff", padding: "8px 0", background: "none", border: 0, font: "inherit" }}
              aria-expanded={menu === "diensten"}
            >
              Diensten <ChevDown className="vvnav-navChev" />
            </button>

            <div className={`vvnav-mega ${menu === "diensten" ? "is-open" : ""}`}>
              <div style={{ display: "flex", borderRadius: 18, border: "1px solid rgba(255,255,255,.1)", background: "rgba(16,14,13,.96)", backdropFilter: "blur(16px)", boxShadow: "0 40px 90px -30px rgba(0,0,0,.9),0 0 0 1px rgba(255,122,0,.05)", overflow: "hidden" }}>
                {/* left rail */}
                <div style={{ width: 322, flex: "none", padding: 16, borderRight: "1px solid rgba(255,255,255,.07)" }}>
                  <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", padding: "6px 12px 12px" }}>
                    Onze diensten
                  </div>
                  {pillars.map((p, i) => {
                    const on = i === active;
                    return (
                      <div
                        key={p.id}
                        className="vvnav-railItem"
                        onMouseEnter={() => pick(i)}
                        style={{
                          display: "flex", alignItems: "center", gap: 13, padding: "11px 12px", borderRadius: 12, cursor: "pointer",
                          border: `1px solid ${on ? "rgba(255,122,0,.28)" : "transparent"}`,
                          background: on ? "rgba(255,122,0,.08)" : "transparent",
                        }}
                      >
                        <span style={{ flex: "none", width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: on ? "#FF7A00" : "rgba(255,255,255,.75)", background: on ? "rgba(255,122,0,.16)" : "rgba(255,255,255,.04)", border: `1px solid ${on ? "rgba(255,122,0,.3)" : "rgba(255,255,255,.08)"}`, transition: "all .22s ease" }}>
                          <NavIcon id={p.icon} size={20} />
                        </span>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: "block", fontFamily: SORA, fontWeight: 700, fontSize: 15, color: on ? "#fff" : "rgba(255,255,255,.9)" }}>{p.name}</span>
                          <span style={{ display: "block", fontSize: 11.5, color: "rgba(255,255,255,.42)", marginTop: 1 }}>{p.tag}</span>
                        </span>
                        <ChevRight className="vvnav-rchev" color={on ? "#FF7A00" : "rgba(255,255,255,.28)"} />
                      </div>
                    );
                  })}
                </div>

                {/* right sub-panel */}
                <div className={`vvnav-sub ${ap ? "is-show" : ""}`}>
                  <div className={`vvnav-subInner ${fade ? "is-on" : ""}`} style={{ width: 560, padding: "20px 22px", display: "flex", flexDirection: "column", height: "100%" }}>
                    {ap && (
                      <>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
                          <div>
                            <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 19, letterSpacing: "-.01em" }}>{ap.name}</div>
                            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.5)", marginTop: 2 }}>{ap.tag}</div>
                          </div>
                          <Link href={ap.href} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 12.5, color: "#FF9A45", whiteSpace: "nowrap" }}>
                            Overzicht <ArrowRight />
                          </Link>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {ap.subs.map((s) => (
                            <Link key={s.href} href={s.href} className="vvnav-subItem" style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 11, border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)" }}>
                              <span style={{ flex: "none", width: 30, height: 30, borderRadius: 8, background: "rgba(255,122,0,.1)", border: "1px solid rgba(255,122,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9A45" }}>
                                <NavIcon id={s.icon} size={16} />
                              </span>
                              <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,.86)" }}>{s.name}</span>
                              <ChevRight className="vvnav-schev" color="rgba(255,255,255,.3)" size={14} />
                            </Link>
                          ))}
                        </div>

                        <Link href="/offerte-aanvragen" className="vvnav-featCard" style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", borderRadius: 14, border: "1px solid rgba(255,122,0,.25)", background: "radial-gradient(120% 160% at 100% 0%,rgba(255,90,0,.16),transparent 62%),rgba(255,255,255,.02)" }}>
                          <span style={{ flex: "none", width: 48, height: 48, borderRadius: 12, background: "radial-gradient(circle at 35% 30%,rgba(255,122,0,.2),rgba(255,122,0,.05))", border: "1px solid rgba(255,122,0,.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF7A00" }}>
                            <NavIcon id={ap.icon} size={26} strokeWidth={1.6} />
                          </span>
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ display: "block", fontFamily: SORA, fontWeight: 700, fontSize: 15 }}>Klaar voor {ap.name.toLowerCase()}?</span>
                            <span style={{ display: "block", fontSize: 12.5, color: "rgba(255,255,255,.55)", marginTop: 2 }}>Vraag vrijblijvend een voorstel en vaste prijs aan.</span>
                          </span>
                          <span style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, color: "#fff", padding: "10px 16px", borderRadius: 10, background: GRADIENT, boxShadow: "0 12px 28px -12px rgba(255,90,0,.8)", whiteSpace: "nowrap" }}>
                            Offerte <ArrowRight />
                          </span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regio mega-menu with region map cards */}
          <RegioMega open={menu === "regio"} onOpen={() => setMenu("regio")} onClose={closeMenu} />
          <DesktopDropdown label="Realisaties" items={realisatieItems} open={menu === "realisaties"} onOpen={() => setMenu("realisaties")} onClose={closeMenu} />
          <DesktopDropdown label="Sectoren" items={sectorItems} open={menu === "sectoren"} onOpen={() => setMenu("sectoren")} onClose={closeMenu} />
          {kennisbankItems.length > 0 && (
            <DesktopDropdown label="Kennisbank" items={kennisbankItems} open={menu === "kennisbank"} onOpen={() => setMenu("kennisbank")} onClose={closeMenu} />
          )}
          <Link href="/over-ons" className="vvnav-link">Over ons</Link>
          <Link href="/contact" className="vvnav-link">Contact</Link>
        </div>

        {/* ===== desktop right ===== */}
        <div className="vvnav-right" style={{ alignItems: "center", gap: 18 }}>
          <Link href="/admin/login" aria-label="Inloggen" style={{ display: "inline-flex" }}>
            <UserIcon />
          </Link>
          <Link href="/offerte-aanvragen" className="vvnav-navBtn" style={{ fontWeight: 700, fontSize: 14, color: "#fff", padding: "11px 20px", borderRadius: 10, background: GRADIENT, boxShadow: "0 12px 30px -12px rgba(255,90,0,.8)" }}>
            Offerte aanvragen
          </Link>
        </div>

        {/* ===== mobile hamburger ===== */}
        <button
          type="button"
          className="vvnav-mbBtn"
          onClick={() => setDrawer(true)}
          aria-label="Menu openen"
          style={{ alignItems: "center", justifyContent: "center", width: 46, height: 46, borderRadius: 12, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.03)", cursor: "pointer", padding: 0 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" />
          </svg>
        </button>
      </nav>

      {/* ===== mobile drawer ===== */}
      <div className={`vvnav-drawerRoot ${drawer ? "is-open" : ""}`}>
        <div className="vvnav-backdrop" onClick={() => setDrawer(false)} />
        <aside className="vvnav-drawerPanel" aria-hidden={!drawer}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,.07)", flex: "none" }}>
            <Logo size={20} />
            <button type="button" onClick={() => setDrawer(false)} aria-label="Sluiten" style={{ width: 42, height: 42, borderRadius: 11, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.03)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px 20px" }}>
            <DrawerLink href="/" onNavigate={() => setDrawer(false)}>Home</DrawerLink>

            {/* Diensten accordion */}
            <div style={{ borderRadius: 12, overflow: "hidden" }}>
              <div className="vvnav-mrow" onClick={() => setMNav((v) => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "15px 12px", cursor: "pointer" }}>
                <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 17, color: "#fff" }}>Diensten</span>
                <ChevDown className="vvnav-mchev" />
              </div>
              <div className="vvnav-macc" style={{ gridTemplateRows: mNav ? "1fr" : "0fr" }}>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ padding: "2px 2px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
                    {pillars.map((p, i) => {
                      const ex = i === mExp;
                      return (
                        <div key={p.id} style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,.06)", background: "rgba(255,255,255,.02)", overflow: "hidden" }}>
                          <div className="vvnav-mrow" onClick={() => setMExp((x) => (x === i ? null : i))} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 12px", cursor: "pointer", background: ex ? "rgba(255,122,0,.06)" : "transparent" }}>
                            <span style={{ flex: "none", width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: ex ? "#FF7A00" : "rgba(255,255,255,.75)", background: ex ? "rgba(255,122,0,.16)" : "rgba(255,255,255,.04)", border: `1px solid ${ex ? "rgba(255,122,0,.3)" : "rgba(255,255,255,.08)"}` }}>
                              <NavIcon id={p.icon} size={18} />
                            </span>
                            <span style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ display: "block", fontFamily: SORA, fontWeight: 700, fontSize: 15, color: "#fff" }}>{p.name}</span>
                              <span style={{ display: "block", fontSize: 11.5, color: "rgba(255,255,255,.42)" }}>{p.tag}</span>
                            </span>
                            <ChevDown className="vvnav-mchev" color={ex ? "#FF7A00" : "rgba(255,255,255,.3)"} />
                          </div>
                          <div className="vvnav-macc" style={{ gridTemplateRows: ex ? "1fr" : "0fr" }}>
                            <div style={{ overflow: "hidden" }}>
                              <div style={{ padding: "4px 10px 12px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                                {p.subs.map((s) => (
                                  <Link key={s.href} href={s.href} onClick={() => setDrawer(false)} className="vvnav-mrow" style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 10px", borderRadius: 10 }}>
                                    <span style={{ flex: "none", width: 26, height: 26, borderRadius: 7, background: "rgba(255,122,0,.1)", border: "1px solid rgba(255,122,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9A45" }}>
                                      <NavIcon id={s.icon} size={14} strokeWidth={1.8} />
                                    </span>
                                    <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,.82)" }}>{s.name}</span>
                                    <ChevRight color="rgba(255,255,255,.28)" size={13} />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Regio / Realisaties / Sectoren / Kennisbank accordions */}
            <DrawerAccordion label="Regio" items={regioItems} open={mSection === "regio"} onToggle={() => setMSection((s) => (s === "regio" ? null : "regio"))} onNavigate={() => setDrawer(false)} />
            <DrawerAccordion label="Realisaties" items={realisatieItems} open={mSection === "realisaties"} onToggle={() => setMSection((s) => (s === "realisaties" ? null : "realisaties"))} onNavigate={() => setDrawer(false)} />
            <DrawerAccordion label="Sectoren" items={sectorItems} open={mSection === "sectoren"} onToggle={() => setMSection((s) => (s === "sectoren" ? null : "sectoren"))} onNavigate={() => setDrawer(false)} />
            {kennisbankItems.length > 0 && (
              <DrawerAccordion label="Kennisbank" items={kennisbankItems} open={mSection === "kennisbank"} onToggle={() => setMSection((s) => (s === "kennisbank" ? null : "kennisbank"))} onNavigate={() => setDrawer(false)} />
            )}
            <DrawerLink href="/over-ons" onNavigate={() => setDrawer(false)}>Over ons</DrawerLink>
            <DrawerLink href="/contact" onNavigate={() => setDrawer(false)}>Contact</DrawerLink>
          </div>

          <div style={{ flex: "none", padding: "16px 18px", borderTop: "1px solid rgba(255,255,255,.07)", display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/offerte-aanvragen" onClick={() => setDrawer(false)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, fontWeight: 700, fontSize: 15, color: "#fff", padding: 15, borderRadius: 12, background: GRADIENT, boxShadow: "0 14px 34px -14px rgba(255,90,0,.85)" }}>
              Offerte aanvragen <ArrowRight size={16} />
            </Link>
            <Link href="/admin/login" onClick={() => setDrawer(false)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, fontWeight: 700, fontSize: 15, color: "#fff", padding: 14, borderRadius: 12, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)" }}>
              <UserIcon size={17} color="currentColor" /> Inloggen
            </Link>
          </div>
        </aside>
      </div>
    </header>
  );
}

function DesktopDropdown({ label, items, open, onOpen, onClose }: { label: string; items: NavLink[]; open: boolean; onOpen: () => void; onClose: () => void }) {
  return (
    <div className={`vvnav-wrap ${open ? "is-on" : ""}`} style={{ position: "relative" }} onMouseEnter={onOpen} onMouseLeave={onClose}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
        {label} <ChevDown className="vvnav-navChev" color="currentColor" />
      </span>
      <div className={`vvnav-dd ${open ? "is-open" : ""}`}>
        <div style={{ minWidth: 240, padding: 8, borderRadius: 14, border: "1px solid rgba(255,255,255,.1)", background: "rgba(16,14,13,.96)", backdropFilter: "blur(16px)", boxShadow: "0 40px 90px -30px rgba(0,0,0,.9),0 0 0 1px rgba(255,122,0,.05)" }}>
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="vvnav-ddItem" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.82)" }}>
              {it.name} <ChevRight color="rgba(255,255,255,.3)" size={14} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function RegioMega({ open, onOpen, onClose }: { open: boolean; onOpen: () => void; onClose: () => void }) {
  return (
    <div className={`vvnav-wrap ${open ? "is-on" : ""}`} style={{ position: "relative" }} onMouseEnter={onOpen} onMouseLeave={onClose}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
        Regio <ChevDown className="vvnav-navChev" color="currentColor" />
      </span>
      <div className={`vvnav-mega vvnav-megaC ${open ? "is-open" : ""}`}>
        <div style={{ width: "min(760px, calc(100vw - 32px))", padding: 16, borderRadius: 18, border: "1px solid rgba(255,255,255,.1)", background: "rgba(16,14,13,.96)", backdropFilter: "blur(16px)", boxShadow: "0 40px 90px -30px rgba(0,0,0,.9),0 0 0 1px rgba(255,122,0,.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "2px 6px 12px" }}>
            <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,.4)" }}>
              Onze regio&apos;s
            </span>
            <Link href="/regio" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 12.5, color: "#FF9A45", whiteSpace: "nowrap" }}>
              Alle regio&apos;s <ArrowRight />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {regions.map((region) => {
              const isHome = region.type === "province";
              return (
                <Link
                  key={region.slug}
                  href={`/regio/${region.slug}`}
                  className="vvnav-regionCard group"
                  style={{ display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 14, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.02)" }}
                >
                  <div style={{ position: "relative", height: 96, overflow: "hidden", background: "linear-gradient(to bottom,#171717,#0a0a0a)" }}>
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 60% 45%,rgba(255,117,0,.16),transparent 60%)" }} />
                    <RegionMiniMap slug={region.slug} />
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 28, background: "linear-gradient(to top,#0a0a0a,transparent)" }} />
                  </div>
                  <div style={{ padding: "11px 12px 13px", display: "flex", flexDirection: "column", gap: 6 }}>
                    <span
                      style={
                        isHome
                          ? { alignSelf: "flex-start", borderRadius: 9999, border: "1px solid rgba(255,122,0,.3)", background: "rgba(255,122,0,.1)", padding: "2px 9px", fontSize: 9.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#FF9A45" }
                          : { alignSelf: "flex-start", borderRadius: 9999, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", padding: "2px 9px", fontSize: 9.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.6)" }
                      }
                    >
                      {isHome ? "Thuisregio" : "Regio"}
                    </span>
                    <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 14.5, color: "#fff", lineHeight: 1.15 }}>{region.title}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function DrawerLink({ href, onNavigate, children }: { href: string; onNavigate: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onNavigate} className={`vvnav-mrow ${rowLink}`} style={{ padding: "15px 12px", borderRadius: 12, fontFamily: SORA, fontWeight: 700, fontSize: 17, color: "#fff" }}>
      {children}
    </Link>
  );
}

function DrawerAccordion({ label, items, open, onToggle, onNavigate }: { label: string; items: NavLink[]; open: boolean; onToggle: () => void; onNavigate: () => void }) {
  const rowStyle: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 12px", borderRadius: 12, fontFamily: SORA, fontWeight: 700, fontSize: 17, color: "#fff", cursor: "pointer" };
  return (
    <div style={{ borderRadius: 12, overflow: "hidden" }}>
      <div className="vvnav-mrow" onClick={onToggle} style={rowStyle}>
        <span>{label}</span>
        <ChevDown className="vvnav-mchev" color={open ? "#FF7A00" : "rgba(255,255,255,.4)"} />
      </div>
      <div className="vvnav-macc" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ padding: "2px 6px 12px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
            {items.map((it) => (
              <Link key={it.href} href={it.href} onClick={onNavigate} className="vvnav-mrow" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 10px", borderRadius: 10, fontSize: 14.5, fontWeight: 600, color: "rgba(255,255,255,.82)" }}>
                {it.name} <ChevRight color="rgba(255,255,255,.28)" size={14} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
