"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
// Admin lives outside the [locale] tree, so its links must NOT get the locale
// prefix (the intl Link would turn "/admin/login" into "/be/admin/login" -> 404).
import NextLink from "next/link";
import dynamic from "next/dynamic";
import { SectorIcon } from "@/components/sectors";
import { WeddingVibeLogo } from "@/components/fotografie/WeddingVibeLogo";
import { NavIcon } from "./nav-icons";
import type { NavCard, NavPillar } from "./navData";

const RegionMiniMap = dynamic(
  () => import("@/features/home/RegionIntro/components/RegionMiniMap").then((module) => module.RegionMiniMap),
  { ssr: false },
);

export type NavRegion = {
  slug: string;
  title: string;
  type: string;
};

// Renders a nav glyph from either the nav-icon set or the sector sprite.
function CardIcon({ icon, iconKind, size = 20 }: { icon: string; iconKind?: "nav" | "sector"; size?: number }) {
  return iconKind === "sector" ? (
    <SectorIcon id={icon} size={size} animate={false} />
  ) : (
    <NavIcon id={icon} size={size} />
  );
}

/**
 * Witte WeddingVibe-CTA (zusterlabel) voor de Fotografie- en Realisaties-menu's,
 * in de stijl van de bestaande cross-promo cards op /over-ons en /diensten/fotografie.
 */
function WeddingCtaCard({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/trouwfotograaf-limburg"
      onClick={onClick}
      className="vvnav-wedCard"
      style={{ position: "relative", marginTop: 10, display: "flex", alignItems: "center", gap: 13, padding: "13px 15px", borderRadius: 14, background: "#FFFFFF", boxShadow: "0 18px 42px -20px rgba(201,162,75,.6)" }}
    >
      <WeddingVibeLogo style={{ height: 20, width: "auto", flex: "none" }} />
      <span style={{ flex: "none", width: 1, alignSelf: "stretch", background: "linear-gradient(180deg,transparent,rgba(201,162,75,.55),transparent)" }} />
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#B8860B" }}>Ook voor je mooiste dag</span>
        <span style={{ fontFamily: CORM, fontWeight: 600, fontSize: 19, lineHeight: 1.1, color: "#2A2320", paddingRight: 44 }}>Trouwfotografie &amp; huwelijksvideo</span>
      </span>
      <span style={{ position: "absolute", right: 15, bottom: 13, display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 9999, background: "linear-gradient(135deg,#EED89A,#C9A24B)", color: "#fff", boxShadow: "0 5px 14px -5px rgba(201,162,75,.8)" }}>
        <ArrowRight />
      </span>
    </Link>
  );
}

const SORA = "var(--font-sora), sans-serif";
const MONO = "var(--font-jetbrains-mono), monospace";
const CORM = "var(--font-cormorant), Georgia, serif";
const GRADIENT = "linear-gradient(90deg,#FF3B2E,#FF7A00)";
// Two-line ellipsis for the card sublines in the dropdowns/submenus.
const CLAMP2: CSSProperties = { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" };

type DesktopMenu = "diensten" | "regio" | "realisaties" | "sectoren" | "kennisbank" | null;

// Mobile push-navigation drawer: the current level + its parent chain drive the
// iOS-style slide/dim transforms.
type DrawerView = "root" | "diensten" | "service" | "regio" | "realisaties" | "sectoren" | "kennisbank";
const DRAWER_PARENT: Record<DrawerView, DrawerView | null> = {
  root: null,
  diensten: "root",
  service: "diensten",
  regio: "root",
  realisaties: "root",
  sectoren: "root",
  kennisbank: "root",
};
const DRAWER_DEPTH: Record<DrawerView, number> = {
  root: 0,
  diensten: 1,
  service: 2,
  regio: 1,
  realisaties: 1,
  sectoren: 1,
  kennisbank: 1,
};

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
function StarIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6.06 6.6.79-4.86 4.55 1.29 6.6L12 17.9l-5.93 3.6 1.29-6.6L2.5 9.35l6.6-.79L12 2.5z" />
    </svg>
  );
}

export type NavGoogleRating = { rating: number; count: number; url: string };

/** Small, real (never fabricated) Google-rating pill for the desktop nav bar. */
function GoogleRatingBadge({ rating, count, url }: NavGoogleRating) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={`VisualVibe op Google: ${rating.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} van 5 sterren, ${count} reviews`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        borderRadius: 9999,
        border: "1px solid rgba(255,122,0,.28)",
        background: "rgba(255,122,0,.08)",
        fontSize: 12,
        fontWeight: 700,
        color: "rgba(255,255,255,.85)",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ display: "inline-flex", gap: 1, color: "#FF9A45" }}>
        {Array.from({ length: 5 }, (_, i) => <StarIcon key={i} />)}
      </span>
      {rating.toLocaleString("nl-BE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
      <span style={{ color: "rgba(255,255,255,.45)", fontWeight: 600 }}>({count})</span>
    </a>
  );
}

function ChevLeft({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}
function GridGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function PinGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

/* Het echte VisualVibe-wordmark (wit + oranje, /logo.svg); size = hoogte in px. */
function Logo({ size = 24 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt="VisualVibe"
      height={size}
      width={Math.round(size * (498.47 / 96.68))}
      style={{ height: size, width: "auto", display: "block" }}
    />
  );
}

export function Nav({
  pillars,
  regions,
  sectorCards,
  realisatieCards,
  kennisbankItems,
  kennisbankPostCount = 0,
  googleRating = null,
}: {
  pillars: NavPillar[];
  regions: NavRegion[];
  sectorCards: NavCard[];
  realisatieCards: NavCard[];
  kennisbankItems: NavCard[];
  kennisbankPostCount?: number;
  googleRating?: NavGoogleRating | null;
}) {
  const pathname = usePathname();

  // Desktop
  const [menu, setMenu] = useState<DesktopMenu>(null);
  const [active, setActive] = useState<number | null>(null);
  const [fade, setFade] = useState(false);

  // Mobile drawer (app-first push navigation)
  const [drawer, setDrawer] = useState(false);
  const [view, setView] = useState<DrawerView>("root");
  const [svc, setSvc] = useState<number | null>(null);

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

  // ===== mobile drawer helpers =====
  const closeDrawer = () => setDrawer(false);
  const back = () => setView(view === "service" ? "diensten" : "root");
  const openDrawer = () => {
    setView("root");
    setSvc(null);
    setDrawer(true);
  };
  const curPillar = svc != null ? pillars[svc] : null;

  // Slide/dim transform for a push panel: active at 0, its parent chain 26% left
  // and dimmed, everything else parked off-screen right.
  const panelStyle = (name: DrawerView): CSSProperties => {
    const ancestors: DrawerView[] = [];
    let c = DRAWER_PARENT[view];
    while (c) {
      ancestors.push(c);
      c = DRAWER_PARENT[c];
    }
    let x = "100%";
    let op = 1;
    if (name === view) {
      x = "0";
    } else if (ancestors.includes(name)) {
      x = "-26%";
      op = 0.35;
    }
    return {
      transform: `translateX(${x})`,
      opacity: op,
      zIndex: DRAWER_DEPTH[name] + 1,
      pointerEvents: name === view ? "auto" : "none",
    };
  };

  const chipStyle = (px: number): CSSProperties => ({
    flex: "none",
    width: px,
    height: px,
    borderRadius: px >= 44 ? 12 : 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FF9A45",
    background: "rgba(255,122,0,.12)",
    border: "1px solid rgba(255,122,0,.24)",
  });
  const cardBase: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    textAlign: "left",
    padding: "12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.07)",
    background: "rgba(255,255,255,.02)",
    color: "#fff",
    font: "inherit",
    cursor: "pointer",
  };
  const eyebrowStyle: CSSProperties = {
    fontFamily: MONO,
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: ".18em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,.4)",
    padding: "8px 8px 12px",
  };

  const pushHead = (title: string, allHref?: string) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
      <button
        type="button"
        onClick={back}
        className="vvnav-mrow"
        style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "8px 12px 8px 6px", borderRadius: 10, background: "none", border: 0, color: "#fff", font: "inherit", cursor: "pointer" }}
      >
        <ChevLeft />
        <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 16 }}>{title}</span>
      </button>
      {allHref && (
        <Link href={allHref} onClick={closeDrawer} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 700, fontSize: 12.5, color: "#FF9A45", whiteSpace: "nowrap" }}>
          Alle <ArrowRight />
        </Link>
      )}
    </div>
  );

  // App-style root rows.
  const appRow = (chip: ReactNode, label: string, sub: string, onClick: () => void) => (
    <button type="button" onClick={onClick} className="vvnav-mrow" style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", padding: "13px 12px", borderRadius: 13, background: "none", border: 0, color: "#fff", font: "inherit", cursor: "pointer" }}>
      <span style={chipStyle(40)}>{chip}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: SORA, fontWeight: 700, fontSize: 16 }}>{label}</span>
        <span style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,.42)", marginTop: 1 }}>{sub}</span>
      </span>
      <ChevRight color="rgba(255,255,255,.3)" />
    </button>
  );
  const linkRow = (href: string, label: string) => (
    <Link href={href} onClick={closeDrawer} className="vvnav-mrow" style={{ display: "flex", alignItems: "center", padding: "15px 12px", borderRadius: 12, fontFamily: SORA, fontWeight: 700, fontSize: 16, color: "#fff" }}>
      {label}
    </Link>
  );

  const cardPanel = (name: DrawerView, title: string, allHref: string, items: NavCard[], footer?: ReactNode) => (
    <div className="vvnav-mvPanel" style={panelStyle(name)}>
      {pushHead(title, allHref)}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it) => (
          <Link key={it.href} href={it.href} onClick={closeDrawer} className="vvnav-mCard" style={cardBase}>
            <span style={chipStyle(40)}>
              <CardIcon icon={it.icon} iconKind={it.iconKind} size={20} />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontFamily: SORA, fontWeight: 700, fontSize: 15, color: "#fff" }}>{it.name}</span>
              {it.desc && <span style={{ display: "block", fontSize: 12, lineHeight: 1.35, color: "rgba(255,255,255,.45)", marginTop: 2, ...CLAMP2 }}>{it.desc}</span>}
            </span>
            <ChevRight color="rgba(255,255,255,.28)" size={14} />
          </Link>
        ))}
        {footer}
      </div>
    </div>
  );

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
            <Link
              href="/diensten"
              style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer", color: "#fff", padding: "8px 0" }}
              aria-expanded={menu === "diensten"}
            >
              Diensten <ChevDown className="vvnav-navChev" />
            </Link>

            {menu === "diensten" && (
            <div className="vvnav-mega is-open">
              <div style={{ display: "flex", borderRadius: 18, border: "1px solid rgba(255,255,255,.1)", background: "rgba(16,14,13,.96)", backdropFilter: "blur(16px)", boxShadow: "0 40px 90px -30px rgba(0,0,0,.9),0 0 0 1px rgba(255,122,0,.05)", overflow: "hidden" }}>
                {/* left rail */}
                <div style={{ width: 322, flex: "none", padding: 16, borderRight: "1px solid rgba(255,255,255,.07)" }}>
                  <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", padding: "6px 12px 12px" }}>
                    Onze diensten
                  </div>
                  {pillars.map((p, i) => {
                    const on = i === active;
                    return (
                      <Link
                        key={p.id}
                        href={p.href}
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
                      </Link>
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

                        {ap.id === "fotografie" && <WeddingCtaCard onClick={closeMenu} />}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Regio mega-menu with region map cards */}
          <RegioMega regions={regions} open={menu === "regio"} onOpen={() => setMenu("regio")} onClose={closeMenu} />
          <DesktopDropdown label="Realisaties" allHref="/realisaties" items={realisatieCards} open={menu === "realisaties"} onOpen={() => setMenu("realisaties")} onClose={closeMenu} cta={<WeddingCtaCard onClick={closeMenu} />} />
          <DesktopDropdown label="Sectoren" allHref="/sectoren" items={sectorCards} open={menu === "sectoren"} onOpen={() => setMenu("sectoren")} onClose={closeMenu} />
          {kennisbankItems.length > 0 && (
            <DesktopDropdown label="Kennisbank" allHref="/kennisbank" items={kennisbankItems} open={menu === "kennisbank"} onOpen={() => setMenu("kennisbank")} onClose={closeMenu} />
          )}
          <Link href="/over-ons" className="vvnav-link">Over ons</Link>
          <Link href="/contact" className="vvnav-link">Contact</Link>
        </div>

        {/* ===== desktop right ===== */}
        <div className="vvnav-right" style={{ alignItems: "center", gap: 18 }}>
          {googleRating && <GoogleRatingBadge {...googleRating} />}
          <NextLink href="/admin/login" prefetch={false} aria-label="Inloggen" style={{ display: "inline-flex" }}>
            <UserIcon />
          </NextLink>
          <Link href="/offerte-aanvragen" className="vvnav-navBtn" style={{ fontWeight: 700, fontSize: 14, color: "#fff", padding: "11px 20px", borderRadius: 10, background: GRADIENT, boxShadow: "0 12px 30px -12px rgba(255,90,0,.8)" }}>
            Offerte aanvragen
          </Link>
        </div>

        {/* ===== mobile hamburger ===== */}
        <button
          type="button"
          className="vvnav-mbBtn"
          onClick={openDrawer}
          aria-label="Menu openen"
          style={{ alignItems: "center", justifyContent: "center", width: 46, height: 46, borderRadius: 12, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.03)", cursor: "pointer", padding: 0 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" />
          </svg>
        </button>
      </nav>

      {/* ===== mobile drawer (app-first push navigation) ===== */}
      {drawer && (
      <div className="vvnav-drawerRoot is-open">
        <div className="vvnav-backdrop" onClick={closeDrawer} />
        <aside className="vvnav-drawerPanel" aria-hidden={!drawer}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,.07)", flex: "none" }}>
            <Logo size={20} />
            <button type="button" onClick={closeDrawer} aria-label="Sluiten" style={{ width: 42, height: 42, borderRadius: 11, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.03)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="vvnav-mvView">
            {/* ROOT */}
            <div className="vvnav-mvPanel" style={panelStyle("root")}>
              <div style={eyebrowStyle}>Menu</div>
              {linkRow("/", "Home")}
              {appRow(<GridGlyph />, "Diensten", `${pillars.length} disciplines`, () => setView("diensten"))}
              {appRow(<PinGlyph />, "Regio", `${regions.length} werkgebieden`, () => setView("regio"))}
              {appRow(<NavIcon id="layers" size={20} />, "Realisaties", `${realisatieCards.length} categorieën`, () => setView("realisaties"))}
              {appRow(<NavIcon id="briefcase" size={20} />, "Sectoren", `${sectorCards.length} sectoren`, () => setView("sectoren"))}
              {kennisbankItems.length > 0 &&
                appRow(
                  <NavIcon id="book" size={20} />,
                  "Kennisbank",
                  kennisbankPostCount > 0
                    ? `${kennisbankItems.length} categorieën · ${kennisbankPostCount} artikels`
                    : `${kennisbankItems.length} categorieën`,
                  () => setView("kennisbank"),
                )}
              {linkRow("/over-ons", "Over ons")}
              {linkRow("/contact", "Contact")}
            </div>

            {/* DIENSTEN (service cards) */}
            <div className="vvnav-mvPanel" style={panelStyle("diensten")}>
              {pushHead("Diensten", "/diensten")}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {pillars.map((p, i) => (
                  // Split row: the label/icon navigates to the service page; the
                  // caret (divided by a line) opens the sub-services push panel.
                  <div
                    key={p.id}
                    style={{ display: "flex", alignItems: "stretch", width: "100%", borderRadius: 14, border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)", overflow: "hidden" }}
                  >
                    <Link
                      href={p.href}
                      onClick={closeDrawer}
                      className="vvnav-mrow"
                      style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, padding: "12px", color: "#fff" }}
                    >
                      <span style={chipStyle(44)}>
                        <NavIcon id={p.icon} size={22} />
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontFamily: SORA, fontWeight: 700, fontSize: 15.5, color: "#fff" }}>{p.name}</span>
                        <span style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 1 }}>{p.tag}</span>
                      </span>
                    </Link>
                    {p.subs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSvc(i);
                          setView("service");
                        }}
                        aria-label={`Toon onderdelen van ${p.name}`}
                        className="vvnav-mSubBtn"
                        style={{ flex: "none", width: 54, display: "flex", alignItems: "center", justifyContent: "center", borderWidth: "0 0 0 1px", borderStyle: "solid", borderColor: "rgba(255,255,255,.09)", background: "none", color: "rgba(255,255,255,.45)", cursor: "pointer", padding: 0 }}
                      >
                        <ChevRight size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SERVICE (sub-services) */}
            <div className="vvnav-mvPanel" style={panelStyle("service")}>
              {curPillar && (
                <>
                  {pushHead(curPillar.name, curPillar.href)}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {curPillar.subs.map((s) => (
                      <Link key={s.href} href={s.href} onClick={closeDrawer} className="vvnav-mCard" style={cardBase}>
                        <span style={chipStyle(36)}>
                          <NavIcon id={s.icon} size={18} strokeWidth={1.8} />
                        </span>
                        <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.88)" }}>{s.name}</span>
                        <ChevRight color="rgba(255,255,255,.28)" size={14} />
                      </Link>
                    ))}
                    <Link
                      href="/offerte-aanvragen"
                      onClick={closeDrawer}
                      style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", borderRadius: 14, border: "1px solid rgba(255,122,0,.25)", background: "radial-gradient(120% 160% at 100% 0%,rgba(255,90,0,.16),transparent 62%),rgba(255,255,255,.02)" }}
                    >
                      <span style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: "radial-gradient(circle at 35% 30%,rgba(255,122,0,.2),rgba(255,122,0,.05))", border: "1px solid rgba(255,122,0,.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF7A00" }}>
                        <NavIcon id={curPillar.icon} size={24} strokeWidth={1.6} />
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontFamily: SORA, fontWeight: 700, fontSize: 14.5, color: "#fff" }}>Klaar voor {curPillar.name.toLowerCase()}?</span>
                        <span style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,.55)", marginTop: 2 }}>Vraag vrijblijvend een voorstel aan.</span>
                      </span>
                      <span style={{ flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 10, background: GRADIENT, color: "#fff" }}>
                        <ArrowRight />
                      </span>
                    </Link>
                    {curPillar.id === "fotografie" && <WeddingCtaCard onClick={closeDrawer} />}
                  </div>
                </>
              )}
            </div>

            {/* REGIO (map cards) */}
            <div className="vvnav-mvPanel" style={panelStyle("regio")}>
              {pushHead("Regio", "/regio")}
              <div style={eyebrowStyle}>Onze regio&apos;s</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {regions.map((region) => {
                  const isHome = region.type === "province";
                  return (
                    <Link
                      key={region.slug}
                      href={`/regio/${region.slug}`}
                      onClick={closeDrawer}
                      className="vvnav-mCard"
                      style={{ display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 15, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.02)", color: "#fff" }}
                    >
                      <div style={{ position: "relative", height: 100, overflow: "hidden", background: "linear-gradient(to bottom,#171717,#0a0a0a)" }}>
                        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 60% 45%,rgba(255,117,0,.16),transparent 60%)" }} />
                        <RegionMiniMap slug={region.slug} />
                        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 28, background: "linear-gradient(to top,#0a0a0a,transparent)" }} />
                      </div>
                      <div style={{ padding: "10px 11px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                        <span
                          style={
                            isHome
                              ? { alignSelf: "flex-start", borderRadius: 9999, border: "1px solid rgba(255,122,0,.3)", background: "rgba(255,122,0,.1)", padding: "2px 9px", fontSize: 9.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#FF9A45" }
                              : { alignSelf: "flex-start", borderRadius: 9999, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", padding: "2px 9px", fontSize: 9.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.6)" }
                          }
                        >
                          {isHome ? "Thuisregio" : "Regio"}
                        </span>
                        <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 14, color: "#fff", lineHeight: 1.15 }}>{region.title}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: "#FF9A45" }}>
                          Ontdek <ArrowRight />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* REALISATIES / SECTOREN / KENNISBANK (iconed card panels) */}
            {cardPanel("realisaties", "Realisaties", "/realisaties", realisatieCards, <WeddingCtaCard onClick={closeDrawer} />)}
            {cardPanel("sectoren", "Sectoren", "/sectoren", sectorCards)}
            {kennisbankItems.length > 0 && cardPanel("kennisbank", "Kennisbank", "/kennisbank", kennisbankItems)}
          </div>

          <div style={{ flex: "none", padding: "16px 18px", borderTop: "1px solid rgba(255,255,255,.07)", display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/offerte-aanvragen" onClick={closeDrawer} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, fontWeight: 700, fontSize: 15, color: "#fff", padding: 15, borderRadius: 12, background: GRADIENT, boxShadow: "0 14px 34px -14px rgba(255,90,0,.85)" }}>
              Offerte aanvragen <ArrowRight size={16} />
            </Link>
            <NextLink href="/admin/login" prefetch={false} onClick={closeDrawer} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, fontWeight: 700, fontSize: 15, color: "#fff", padding: 14, borderRadius: 12, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)" }}>
              <UserIcon size={17} color="currentColor" /> Inloggen
            </NextLink>
          </div>
        </aside>
      </div>
      )}
    </header>
  );
}

function DesktopDropdown({ label, allHref, items, open, onOpen, onClose, cta }: { label: string; allHref: string; items: NavCard[]; open: boolean; onOpen: () => void; onClose: () => void; cta?: ReactNode }) {
  return (
    <div className={`vvnav-wrap ${open ? "is-on" : ""}`} style={{ position: "relative" }} onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Link href={allHref} style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer", color: "inherit" }}>
        {label} <ChevDown className="vvnav-navChev" color="currentColor" />
      </Link>
      {open && (
      <div className="vvnav-dd is-open">
        <div style={{ width: 360, maxWidth: "calc(100vw - 32px)", padding: 8, borderRadius: 16, border: "1px solid rgba(255,255,255,.1)", background: "rgba(16,14,13,.96)", backdropFilter: "blur(16px)", boxShadow: "0 40px 90px -30px rgba(0,0,0,.9),0 0 0 1px rgba(255,122,0,.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "6px 10px 10px" }}>
            <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,.4)" }}>{label}</span>
            <Link href={allHref} onClick={onClose} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 12, color: "#FF9A45", whiteSpace: "nowrap" }}>
              Alle <ArrowRight />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: "min(66vh, 520px)", overflowY: "auto" }}>
            {items.map((it) => (
              <Link key={it.href} href={it.href} onClick={onClose} className="vvnav-ddItem" style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 10px", borderRadius: 11 }}>
                <span style={{ flex: "none", width: 34, height: 34, borderRadius: 9, background: "rgba(255,122,0,.1)", border: "1px solid rgba(255,122,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9A45" }}>
                  <CardIcon icon={it.icon} iconKind={it.iconKind} size={17} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: SORA, fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,.9)" }}>{it.name}</span>
                  {it.desc && <span style={{ display: "block", fontSize: 11.5, lineHeight: 1.35, color: "rgba(255,255,255,.45)", marginTop: 1, ...CLAMP2 }}>{it.desc}</span>}
                </span>
                <ChevRight className="vvnav-schev" color="rgba(255,255,255,.3)" size={14} />
              </Link>
            ))}
          </div>
          {cta}
        </div>
      </div>
      )}
    </div>
  );
}

function RegioMega({
  regions,
  open,
  onOpen,
  onClose,
}: {
  regions: NavRegion[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <div className={`vvnav-wrap ${open ? "is-on" : ""}`} style={{ position: "relative" }} onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Link href="/regio" style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer", color: "inherit" }}>
        Regio <ChevDown className="vvnav-navChev" color="currentColor" />
      </Link>
      {open && (
      <div className="vvnav-mega vvnav-megaC is-open">
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
      )}
    </div>
  );
}
