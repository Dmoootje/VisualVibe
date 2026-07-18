"use client";

import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { WeddingVibeLogo } from "@/components/fotografie/WeddingVibeLogo";
import { SectorIcon } from "@/components/sectors/SectorIcon";
import { Link } from "@/i18n/navigation";
import { NavIcon } from "./nav-icons";
import type { NavCard, NavPillar } from "./navData";
import { useTranslations } from "next-intl";

const RegionMiniMap = dynamic(
  () =>
    import("@/features/home/RegionIntro/components/RegionMiniMap").then(
      (module) => module.RegionMiniMap,
    ),
  { ssr: false },
);

type NavRegion = {
  slug: string;
  title: string;
  type: string;
};

type DrawerView =
  | "root"
  | "diensten"
  | "service"
  | "regio"
  | "realisaties"
  | "sectoren"
  | "tools"
  | "kennisbank";

const DRAWER_PARENT: Record<DrawerView, DrawerView | null> = {
  root: null,
  diensten: "root",
  service: "diensten",
  regio: "root",
  realisaties: "root",
  sectoren: "root",
  tools: "root",
  kennisbank: "root",
};

const DRAWER_DEPTH: Record<DrawerView, number> = {
  root: 0,
  diensten: 1,
  service: 2,
  regio: 1,
  realisaties: 1,
  sectoren: 1,
  tools: 1,
  kennisbank: 1,
};

const SORA = "var(--font-sora), sans-serif";
const MONO = "var(--font-jetbrains-mono), monospace";
const CORM = "var(--font-cormorant), Georgia, serif";
const GRADIENT = "linear-gradient(90deg,#FF3B2E,#FF7A00)";
const CLAMP2: CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
};

function CardIcon({
  icon,
  iconKind,
  size = 20,
}: {
  icon: string;
  iconKind?: "nav" | "sector";
  size?: number;
}) {
  return iconKind === "sector" ? (
    <SectorIcon id={icon} size={size} animate={false} />
  ) : (
    <NavIcon id={icon} size={size} />
  );
}

function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ChevRight({
  color = "currentColor",
  size = 16,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function ChevLeft({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

function UserIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function GridGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function PinGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function Logo({ size = 20 }: { size?: number }) {
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

function WeddingCtaCard({ onClick }: { onClick: () => void }) {
  const t = useTranslations("nav");
  return (
    <Link
      href="/trouwfotograaf-limburg"
      onClick={onClick}
      className="vvnav-wedCard"
      style={{
        position: "relative",
        marginTop: 10,
        display: "flex",
        alignItems: "center",
        gap: 13,
        padding: "13px 15px",
        borderRadius: 14,
        background: "#FFFFFF",
        boxShadow: "0 18px 42px -20px rgba(201,162,75,.6)",
      }}
    >
      <WeddingVibeLogo style={{ height: 20, width: "auto", flex: "none" }} />
      <span
        style={{
          flex: "none",
          width: 1,
          alignSelf: "stretch",
          background:
            "linear-gradient(180deg,transparent,rgba(201,162,75,.55),transparent)",
        }}
      />
      <span
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "#B8860B",
          }}
        >
          {t("weddingEyebrow")}
        </span>
        <span
          style={{
            fontFamily: CORM,
            fontWeight: 600,
            fontSize: 19,
            lineHeight: 1.1,
            color: "#2A2320",
            paddingRight: 44,
          }}
        >
          {t("weddingTitle")}
        </span>
      </span>
      <span
        style={{
          position: "absolute",
          right: 15,
          bottom: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 9999,
          background: "linear-gradient(135deg,#EED89A,#C9A24B)",
          color: "#fff",
          boxShadow: "0 5px 14px -5px rgba(201,162,75,.8)",
        }}
      >
        <ArrowRight />
      </span>
    </Link>
  );
}

type MobileNavDrawerProps = {
  pillars: NavPillar[];
  regions: NavRegion[];
  sectorCards: NavCard[];
  realisatieCards: NavCard[];
  toolsCards: NavCard[];
  kennisbankItems: NavCard[];
  kennisbankPostCount: number;
  onClose: () => void;
};

export function MobileNavDrawer({
  pillars,
  regions,
  sectorCards,
  realisatieCards,
  toolsCards,
  kennisbankItems,
  kennisbankPostCount,
  onClose,
}: MobileNavDrawerProps) {
  const t = useTranslations("nav");
  const [view, setView] = useState<DrawerView>("root");
  const [serviceIndex, setServiceIndex] = useState<number | null>(null);
  const currentPillar =
    serviceIndex === null ? null : pillars[serviceIndex] ?? null;

  const back = () => setView(view === "service" ? "diensten" : "root");

  const panelStyle = (name: DrawerView): CSSProperties => {
    const ancestors: DrawerView[] = [];
    let current = DRAWER_PARENT[view];
    while (current) {
      ancestors.push(current);
      current = DRAWER_PARENT[current];
    }

    let translate = "100%";
    let opacity = 1;
    if (name === view) {
      translate = "0";
    } else if (ancestors.includes(name)) {
      translate = "-26%";
      opacity = 0.35;
    }

    return {
      transform: `translateX(${translate})`,
      opacity,
      zIndex: DRAWER_DEPTH[name] + 1,
      pointerEvents: name === view ? "auto" : "none",
    };
  };

  const chipStyle = (size: number): CSSProperties => ({
    flex: "none",
    width: size,
    height: size,
    borderRadius: size >= 44 ? 12 : 9,
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 8,
      }}
    >
      <button
        type="button"
        onClick={back}
        className="vvnav-mrow"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "8px 12px 8px 6px",
          borderRadius: 10,
          background: "none",
          border: 0,
          color: "#fff",
          font: "inherit",
          cursor: "pointer",
        }}
      >
        <ChevLeft />
        <span style={{ fontFamily: SORA, fontWeight: 700, fontSize: 16 }}>
          {title}
        </span>
      </button>
      {allHref && (
        <Link
          href={allHref}
          onClick={onClose}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontWeight: 700,
            fontSize: 12.5,
            color: "#FF9A45",
            whiteSpace: "nowrap",
          }}
        >
          {t("all")} <ArrowRight />
        </Link>
      )}
    </div>
  );

  const appRow = (
    chip: ReactNode,
    label: string,
    sub: string,
    onClick: () => void,
  ) => (
    <button
      type="button"
      onClick={onClick}
      className="vvnav-mrow"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        textAlign: "left",
        padding: "13px 12px",
        borderRadius: 13,
        background: "none",
        border: 0,
        color: "#fff",
        font: "inherit",
        cursor: "pointer",
      }}
    >
      <span style={chipStyle(40)}>{chip}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontFamily: SORA,
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          {label}
        </span>
        <span
          style={{
            display: "block",
            fontSize: 12,
            color: "rgba(255,255,255,.42)",
            marginTop: 1,
          }}
        >
          {sub}
        </span>
      </span>
      <ChevRight color="rgba(255,255,255,.3)" />
    </button>
  );

  const linkRow = (href: string, label: string) => (
    <Link
      href={href}
      onClick={onClose}
      className="vvnav-mrow"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "15px 12px",
        borderRadius: 12,
        fontFamily: SORA,
        fontWeight: 700,
        fontSize: 16,
        color: "#fff",
      }}
    >
      {label}
    </Link>
  );

  const cardPanel = (
    name: DrawerView,
    title: string,
    allHref: string,
    items: NavCard[],
    footer?: ReactNode,
  ) => (
    <div className="vvnav-mvPanel" style={panelStyle(name)}>
      {pushHead(title, allHref)}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="vvnav-mCard"
            style={cardBase}
          >
            <span style={chipStyle(40)}>
              <CardIcon
                icon={item.icon}
                iconKind={item.iconKind}
                size={20}
              />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: SORA,
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#fff",
                }}
              >
                {item.name}
              </span>
              {item.desc && (
                <span
                  style={{
                    display: "block",
                    fontSize: 12,
                    lineHeight: 1.35,
                    color: "rgba(255,255,255,.45)",
                    marginTop: 2,
                    ...CLAMP2,
                  }}
                >
                  {item.desc}
                </span>
              )}
            </span>
            <ChevRight color="rgba(255,255,255,.28)" size={14} />
          </Link>
        ))}
        {footer}
      </div>
    </div>
  );

  return (
    <div className="vvnav-drawerRoot is-open">
      <div className="vvnav-backdrop" onClick={onClose} />
      <aside className="vvnav-drawerPanel">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            borderBottom: "1px solid rgba(255,255,255,.07)",
            flex: "none",
          }}
        >
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeMenu")}
            style={{
              width: 42,
              height: 42,
              borderRadius: 11,
              border: "1px solid rgba(255,255,255,.12)",
              background: "rgba(255,255,255,.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="vvnav-mvView">
          <div className="vvnav-mvPanel" style={panelStyle("root")}>
            <div style={eyebrowStyle}>{t("menu")}</div>
            {linkRow("/", t("home"))}
            {appRow(
              <GridGlyph />,
              t("services"),
              t("disciplineCount", { count: pillars.length }),
              () => setView("diensten"),
            )}
            {appRow(
              <PinGlyph />,
            t("regions"),
            t("workAreas", { count: regions.length }),
              () => setView("regio"),
            )}
            {appRow(
              <NavIcon id="layers" size={20} />,
              t("caseStudies"),
              t("categoryCount", { count: realisatieCards.length }),
              () => setView("realisaties"),
            )}
            {appRow(
              <NavIcon id="briefcase" size={20} />,
              t("sectors"),
              t("sectorCount", { count: sectorCards.length }),
              () => setView("sectoren"),
            )}
            {appRow(
              <NavIcon id="tools" size={20} />,
              t("tools"),
              t("freeToolCount", { count: toolsCards.length }),
              () => setView("tools"),
            )}
            {kennisbankItems.length > 0 &&
              appRow(
                <NavIcon id="book" size={20} />,
                t("knowledgeBase"),
                kennisbankPostCount > 0
                  ? t("knowledgeCounts", { categories: kennisbankItems.length, articles: kennisbankPostCount })
                  : t("categoryCount", { count: kennisbankItems.length }),
                () => setView("kennisbank"),
              )}
            {linkRow("/over-ons", t("about"))}
            {linkRow("/contact", t("contact"))}
          </div>

          <div className="vvnav-mvPanel" style={panelStyle("diensten")}>
            {pushHead(t("services"), "/diensten")}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pillars.map((pillar, index) => (
                <div
                  key={pillar.id}
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,.07)",
                    background: "rgba(255,255,255,.02)",
                    overflow: "hidden",
                  }}
                >
                  <Link
                    href={pillar.href}
                    onClick={onClose}
                    className="vvnav-mrow"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px",
                      color: "#fff",
                    }}
                  >
                    <span style={chipStyle(44)}>
                      <NavIcon id={pillar.icon} size={22} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          fontFamily: SORA,
                          fontWeight: 700,
                          fontSize: 15.5,
                          color: "#fff",
                        }}
                      >
                        {pillar.name}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: 12,
                          color: "rgba(255,255,255,.45)",
                          marginTop: 1,
                        }}
                      >
                        {pillar.tag}
                      </span>
                    </span>
                  </Link>
                  {pillar.subs.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setServiceIndex(index);
                        setView("service");
                      }}
                      aria-label={t("showServiceParts", { service: pillar.name })}
                      className="vvnav-mSubBtn"
                      style={{
                        flex: "none",
                        width: 54,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: "0 0 0 1px",
                        borderStyle: "solid",
                        borderColor: "rgba(255,255,255,.09)",
                        background: "none",
                        color: "rgba(255,255,255,.45)",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <ChevRight size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="vvnav-mvPanel" style={panelStyle("service")}>
            {currentPillar && (
              <>
                {pushHead(currentPillar.name, currentPillar.href)}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {currentPillar.subs.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={onClose}
                      className="vvnav-mCard"
                      style={cardBase}
                    >
                      <span style={chipStyle(36)}>
                        <NavIcon
                          id={service.icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                      </span>
                      <span
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: 14,
                          fontWeight: 600,
                          color: "rgba(255,255,255,.88)",
                        }}
                      >
                        {service.name}
                      </span>
                      <ChevRight color="rgba(255,255,255,.28)" size={14} />
                    </Link>
                  ))}
                  <Link
                    href="/offerte-aanvragen"
                    onClick={onClose}
                    style={{
                      marginTop: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "15px 16px",
                      borderRadius: 14,
                      border: "1px solid rgba(255,122,0,.25)",
                      background:
                        "radial-gradient(120% 160% at 100% 0%,rgba(255,90,0,.16),transparent 62%),rgba(255,255,255,.02)",
                    }}
                  >
                    <span
                      style={{
                        flex: "none",
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background:
                          "radial-gradient(circle at 35% 30%,rgba(255,122,0,.2),rgba(255,122,0,.05))",
                        border: "1px solid rgba(255,122,0,.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FF7A00",
                      }}
                    >
                      <NavIcon
                        id={currentPillar.icon}
                        size={24}
                        strokeWidth={1.6}
                      />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          fontFamily: SORA,
                          fontWeight: 700,
                          fontSize: 14.5,
                          color: "#fff",
                        }}
                      >
                         {t("readyFor", { service: currentPillar.name.toLowerCase() })}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: 12,
                          color: "rgba(255,255,255,.55)",
                          marginTop: 2,
                        }}
                      >
                         {t("mobileProposal")}
                      </span>
                    </span>
                    <span
                      style={{
                        flex: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: GRADIENT,
                        color: "#fff",
                      }}
                    >
                      <ArrowRight />
                    </span>
                  </Link>
                  {currentPillar.id === "fotografie" && (
                    <WeddingCtaCard onClick={onClose} />
                  )}
                </div>
              </>
            )}
          </div>

          <div className="vvnav-mvPanel" style={panelStyle("regio")}>
            {pushHead(t("regions"), "/regio")}
            <div style={eyebrowStyle}>{t("ourRegions")}</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {regions.map((region) => {
                const isHome = region.type === "province";
                return (
                  <Link
                    key={region.slug}
                    href={`/regio/${region.slug}`}
                    onClick={onClose}
                    className="vvnav-mCard"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      borderRadius: 15,
                      border: "1px solid rgba(255,255,255,.1)",
                      background: "rgba(255,255,255,.02)",
                      color: "#fff",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        height: 100,
                        overflow: "hidden",
                        background: "linear-gradient(to bottom,#171717,#0a0a0a)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "radial-gradient(circle at 60% 45%,rgba(255,117,0,.16),transparent 60%)",
                        }}
                      />
                      <RegionMiniMap slug={region.slug} />
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: 28,
                          background: "linear-gradient(to top,#0a0a0a,transparent)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        padding: "10px 11px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          alignSelf: "flex-start",
                          borderRadius: 9999,
                          border: isHome
                            ? "1px solid rgba(255,122,0,.3)"
                            : "1px solid rgba(255,255,255,.12)",
                          background: isHome
                            ? "rgba(255,122,0,.1)"
                            : "rgba(255,255,255,.05)",
                          padding: "2px 9px",
                          fontSize: 9.5,
                          fontWeight: 700,
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          color: isHome
                            ? "#FF9A45"
                            : "rgba(255,255,255,.6)",
                        }}
                      >
                         {isHome ? t("homeRegion") : t("region")}
                      </span>
                      <span
                        style={{
                          fontFamily: SORA,
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#fff",
                          lineHeight: 1.15,
                        }}
                      >
                        {region.title}
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: "#FF9A45",
                        }}
                      >
                        {t("discover")} <ArrowRight />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {cardPanel(
            "realisaties",
            t("caseStudies"),
            "/realisaties",
            realisatieCards,
            <WeddingCtaCard onClick={onClose} />,
          )}
          {cardPanel("sectoren", t("sectors"), "/sectoren", sectorCards)}
          {cardPanel("tools", t("tools"), "/tools", toolsCards)}
          {kennisbankItems.length > 0 &&
            cardPanel(
              "kennisbank",
              t("knowledgeBase"),
              "/kennisbank",
              kennisbankItems,
            )}
        </div>

        <div
          style={{
            flex: "none",
            padding: "16px 18px",
            borderTop: "1px solid rgba(255,255,255,.07)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Link
            href="/offerte-aanvragen"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              fontWeight: 700,
              fontSize: 15,
              color: "#fff",
              padding: 15,
              borderRadius: 12,
              background: GRADIENT,
              boxShadow: "0 14px 34px -14px rgba(255,90,0,.85)",
            }}
          >
             {t("quotation")} <ArrowRight size={16} />
          </Link>
          <NextLink
            href="/admin/login"
            prefetch={false}
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              fontWeight: 700,
              fontSize: 15,
              color: "#fff",
              padding: 14,
              borderRadius: 12,
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.12)",
            }}
          >
            <UserIcon size={17} /> {t("login")}
          </NextLink>
        </div>
      </aside>
    </div>
  );
}
