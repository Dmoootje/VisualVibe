"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
// Admin lives outside the [locale] tree, so its links must NOT get the locale
// prefix (the intl Link would turn "/admin/login" into "/be/admin/login" -> 404).
import NextLink from "next/link";
import dynamic from "next/dynamic";
import { SectorIcon } from "@/components/sectors/SectorIcon";
import { WeddingVibeLogo } from "@/components/fotografie/WeddingVibeLogo";
import { toolCards as toolPreviewCards } from "@/data/toolCards";
import { NavIcon } from "./nav-icons";
import type { NavCard, NavPillar } from "./navData";
import { useTranslations } from "next-intl";

const RegionMiniMap = dynamic(
  () => import("@/features/home/RegionIntro/components/RegionMiniMap").then((module) => module.RegionMiniMap),
  { ssr: false },
);

const MobileNavDrawer = dynamic(() => import("./MobileNavDrawer").then((module) => module.MobileNavDrawer), { ssr: false });

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

type DesktopMenu = "diensten" | "regio" | "realisaties" | "sectoren" | "tools" | "kennisbank" | null;

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
  toolsCards,
  kennisbankItems,
  kennisbankPostCount = 0,
  googleRating = null,
}: {
  pillars: NavPillar[];
  regions: NavRegion[];
  sectorCards: NavCard[];
  realisatieCards: NavCard[];
  toolsCards: NavCard[];
  kennisbankItems: NavCard[];
  kennisbankPostCount?: number;
  googleRating?: NavGoogleRating | null;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  // Desktop
  const [menu, setMenu] = useState<DesktopMenu>(null);
  const [active, setActive] = useState<number | null>(null);
  const [fade, setFade] = useState(false);

  // Mobile drawer (app-first push navigation)
  const [drawer, setDrawer] = useState(false);

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
  const closeDrawer = () => setDrawer(false);
  const openDrawer = () => setDrawer(true);

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
          <Link href="/" aria-label={t("home")} className="vvnav-link" style={{ display: "inline-flex" }}>
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
              {t("services")} <ChevDown className="vvnav-navChev" />
            </Link>

            {menu === "diensten" && (
            <div className="vvnav-mega is-open">
              <div style={{ display: "flex", borderRadius: 18, border: "1px solid rgba(255,255,255,.1)", background: "rgba(16,14,13,.96)", backdropFilter: "blur(16px)", boxShadow: "0 40px 90px -30px rgba(0,0,0,.9),0 0 0 1px rgba(255,122,0,.05)", overflow: "hidden" }}>
                {/* left rail */}
                <div style={{ width: 322, flex: "none", padding: 16, borderRight: "1px solid rgba(255,255,255,.07)" }}>
                  <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", padding: "6px 12px 12px" }}>
                    {t("ourServices")}
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
                            {t("overview")} <ArrowRight />
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
          <ToolsMega items={toolsCards} open={menu === "tools"} onOpen={() => setMenu("tools")} onClose={closeMenu} />
          {kennisbankItems.length > 0 && (
            <DesktopDropdown label="Kennisbank" allHref="/kennisbank" items={kennisbankItems} open={menu === "kennisbank"} onOpen={() => setMenu("kennisbank")} onClose={closeMenu} />
          )}
          <Link href="/over-ons" className="vvnav-link">{t("about")}</Link>
          <Link href="/contact" className="vvnav-link">{t("contact")}</Link>
        </div>

        {/* ===== desktop right ===== */}
        <div className="vvnav-right" style={{ alignItems: "center", gap: 18 }}>
          {googleRating && <GoogleRatingBadge {...googleRating} />}
          <NextLink href="/admin/login" prefetch={false} aria-label={t("login")} style={{ display: "inline-flex" }}>
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

      {drawer && <MobileNavDrawer
        pillars={pillars}
        regions={regions}
        sectorCards={sectorCards}
        realisatieCards={realisatieCards}
        toolsCards={toolsCards}
        kennisbankItems={kennisbankItems}
        kennisbankPostCount={kennisbankPostCount}
        onClose={closeDrawer}
      />}
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

function ToolsMega({
  items,
  open,
  onOpen,
  onClose,
}: {
  items: NavCard[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "/website-analyse");
  const active = items.find((item) => item.href === activeHref) ?? items[0];
  const preview = toolPreviewCards.find((tool) => tool.href === active?.href) ?? toolPreviewCards[0];

  return (
    <div className={`vvnav-wrap ${open ? "is-on" : ""}`} style={{ position: "relative" }} onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Link href="/tools" style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer", color: "inherit" }}>
        Tools <ChevDown className="vvnav-navChev" color="currentColor" />
      </Link>
      {open && (
        <div className="vvnav-mega is-open">
          <div style={{ display: "grid", gridTemplateColumns: "330px 430px", borderRadius: 18, border: "1px solid rgba(255,255,255,.1)", background: "rgba(16,14,13,.96)", backdropFilter: "blur(16px)", boxShadow: "0 40px 90px -30px rgba(0,0,0,.9),0 0 0 1px rgba(255,122,0,.05)", overflow: "hidden" }}>
            <div style={{ padding: 16, borderRight: "1px solid rgba(255,255,255,.07)" }}>
              <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", padding: "6px 12px 12px" }}>
                Gratis tools
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map((item) => {
                  const on = item.href === active?.href;
                  const itemPreview = toolPreviewCards.find((tool) => tool.href === item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onMouseEnter={() => setActiveHref(item.href)}
                      className="vvnav-railItem"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 13,
                        padding: "12px",
                        borderRadius: 13,
                        border: `1px solid ${on ? "rgba(255,122,0,.3)" : "rgba(255,255,255,.07)"}`,
                        background: on ? "rgba(255,122,0,.09)" : "rgba(255,255,255,.02)",
                      }}
                    >
                      <span style={{ flex: "none", width: 40, height: 40, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", color: on ? "#FF7A00" : "rgba(255,255,255,.75)", background: on ? "rgba(255,122,0,.16)" : "rgba(255,255,255,.04)", border: `1px solid ${on ? "rgba(255,122,0,.3)" : "rgba(255,255,255,.08)"}` }}>
                        <CardIcon icon={item.icon} iconKind={item.iconKind} size={20} />
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontFamily: SORA, fontWeight: 750, fontSize: 15, color: "#fff" }}>{item.name}</span>
                        <span style={{ display: "block", fontSize: 11.5, color: "rgba(255,255,255,.48)", marginTop: 1 }}>{itemPreview?.tag ?? "Tool"}</span>
                      </span>
                      <ChevRight color={on ? "#FF7A00" : "rgba(255,255,255,.28)"} size={14} />
                    </Link>
                  );
                })}
              </div>
              <Link href="/tools" onClick={onClose} style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 12.5, color: "#FF9A45" }}>
                Alle tools <ArrowRight />
              </Link>
            </div>

            {preview && (
              <div style={{ padding: 22, background: "radial-gradient(120% 120% at 100% 0%,rgba(255,122,0,.16),transparent 58%),rgba(255,255,255,.012)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                  <span style={{ flex: "none", width: 54, height: 54, borderRadius: 16, background: "rgba(255,122,0,.11)", border: "1px solid rgba(255,122,0,.28)", color: "#FF9A45", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 45px -28px rgba(255,122,0,.9)" }}>
                    <CardIcon icon={preview.icon} size={27} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontFamily: MONO, fontSize: 10.5, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#FF9A45" }}>
                      {preview.tag}
                    </span>
                    <span style={{ display: "block", marginTop: 4, fontFamily: SORA, fontSize: 20, lineHeight: 1.12, fontWeight: 850, color: "#fff" }}>
                      {preview.previewTitle}
                    </span>
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: "rgba(255,255,255,.66)" }}>
                  {preview.previewText}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, marginTop: 18 }}>
                  {preview.previewPoints.map((point) => (
                    <span key={point} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 11, border: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,.18)", fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,.82)" }}>
                      <span style={{ width: 7, height: 7, borderRadius: 99, background: "#34D399", boxShadow: "0 0 18px rgba(52,211,153,.75)" }} />
                      {point}
                    </span>
                  ))}
                </div>
                <Link href={preview.href} onClick={onClose} style={{ marginTop: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 800, fontSize: 13, color: "#fff", padding: "11px 16px", borderRadius: 11, background: GRADIENT, boxShadow: "0 14px 30px -14px rgba(255,90,0,.85)" }}>
                  {preview.cta} <ArrowRight />
                </Link>
              </div>
            )}
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
