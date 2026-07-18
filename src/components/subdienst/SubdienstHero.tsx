import { Link } from "@/i18n/navigation";
import type { ServiceCategory } from "@/types";
import { SvcGlyph } from "@/components/subdiensten";
import { iconForSubdienst, tagForSubdienst, type ResolvedIcon } from "./subdienstMeta";
import type { SupportedLocale } from "@/i18n/locales";
import "./subdienst-hero.css";

export type SubHeroItem = {
  slug: string;
  name: string;
  category: ServiceCategory;
  tag?: string;
  desc?: string;
};

/** Icon inside the animated centerpiece (24-unit glyph placed at 96px). */
function CenterIcon({ icon }: { icon: ResolvedIcon }) {
  if (icon.kind === "glyph") {
    return (
      <svg
        x={52}
        y={52}
        width={96}
        height={96}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <SvcGlyph id={icon.id} />
      </svg>
    );
  }
  const Icon = icon.Icon;
  return <Icon x={52} y={52} width={96} height={96} strokeWidth={1.5} />;
}

/** Small icon inside a marquee pill chip. */
function PillIcon({ icon }: { icon: ResolvedIcon }) {
  if (icon.kind === "glyph") {
    return (
      <svg
        width={19}
        height={19}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <SvcGlyph id={icon.id} />
      </svg>
    );
  }
  const Icon = icon.Icon;
  return <Icon size={19} strokeWidth={1.7} />;
}

function Pills({
  items,
  cls,
  pillarSlug,
  interactive,
  uniqueItemCount,
}: {
  items: SubHeroItem[];
  cls: string;
  pillarSlug: string;
  interactive: boolean;
  uniqueItemCount: number;
}) {
  return (
    <div className="vvsh-mqMask">
      <div className={`vvsh-mqTrack ${cls}`}>
        {items.map((s, j) => {
          const isFocusable = interactive && j < uniqueItemCount;
          const contents = (
            <>
              <span className="vvsh-pillIcon">
                <PillIcon icon={iconForSubdienst(s.slug, s.category)} />
              </span>
              <span className="vvsh-pillName">{s.name}</span>
            </>
          );

          return isFocusable ? (
            <Link
              href={`/diensten/${pillarSlug}/${s.slug}`}
              key={`${s.slug}-${j}`}
              className="vvsh-pill"
            >
              {contents}
            </Link>
          ) : (
            <span key={`${s.slug}-${j}`} className="vvsh-pill" aria-hidden="true">
              {contents}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Sub-service detail-page hero (design handoff "Subdienst hero"): breadcrumb,
 * live-dot tag pill, title + intro, two CTAs, an animated revolving icon
 * centerpiece, and a two-row marquee of the sibling sub-services. All motion is
 * pure CSS (see globals.css); safe as a Server Component.
 */
export function SubdienstHero({
  pillar,
  pillarHref,
  pillarSlug,
  hero,
  siblings,
  locale = "nl",
  primaryCta,
}: {
  pillar: string;
  pillarHref: string;
  pillarSlug: string;
  hero: SubHeroItem;
  siblings: SubHeroItem[];
  locale?: SupportedLocale;
  primaryCta?: { label: string; href: string };
}) {
  const en = locale === "en";
  const icon = iconForSubdienst(hero.slug, hero.category);
  const tag = hero.tag ?? (en ? pillar : tagForSubdienst(hero.slug, pillar));

  const top = [...siblings, ...siblings];
  const reversed = [...siblings].reverse();
  const bottom = [...reversed, ...reversed];

  return (
    <section className="vvsh-hero">
      <div className="vvsh-glow" aria-hidden="true" />
      <div className="vvsh-grid" aria-hidden="true" />

      <div className="vvsh-inner">
        <div className="vvsh-left">
          <Link href={pillarHref} className="vvsh-crumb">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            {en ? `Part of ${pillar}` : `Onderdeel van ${pillar}`}
          </Link>

          <span className="vvsh-tag">
            <span className="vvsh-dot" />
            {tag}
          </span>

          <h1 className="vvsh-title">{hero.name}</h1>
          {hero.desc && <p className="vvsh-desc">{hero.desc}</p>}

          <div className="vvsh-btns">
            <Link
              href={primaryCta?.href ?? "/offerte-aanvragen"}
              className="vvsh-btn vvsh-btnPrimary"
            >
              {primaryCta?.label ?? "Offerte aanvragen"}
              <svg className="vvsh-ar" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link href="/realisaties" className="vvsh-btn vvsh-btnGhost">
              {en ? "View case studies" : "Bekijk realisaties"}
            </Link>
          </div>
        </div>

        <div className="vvsh-iconWrap">
          <div className="vvsh-conic" aria-hidden="true" />
          <svg viewBox="0 0 200 200" className="vvsh-iconSvg" aria-hidden="true">
            <defs>
              <radialGradient id="vvHeroGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,122,0,0.30)" />
                <stop offset="55%" stopColor="rgba(255,122,0,0.07)" />
                <stop offset="100%" stopColor="rgba(255,122,0,0)" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="99" fill="url(#vvHeroGlow)" />
            <circle className="vvsh-ring1" cx="100" cy="100" r="94" fill="none" stroke="rgba(255,122,0,0.32)" strokeWidth="1" strokeDasharray="2 9" strokeLinecap="round" />
            <circle className="vvsh-ring2" cx="100" cy="100" r="79" fill="none" stroke="rgba(255,122,0,0.20)" strokeWidth="1" strokeDasharray="1 11" strokeLinecap="round" />
            <circle cx="100" cy="100" r="66" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <g className="vvsh-hicon" style={{ color: "#FF7A00" }}>
              <CenterIcon icon={icon} />
            </g>
          </svg>
        </div>
      </div>

      {siblings.length > 0 && (
        <div className="vvsh-mq">
          <p className="vvsh-mqLabel">
            {en ? `Other services within ${pillar}` : `Andere diensten binnen ${pillar}`}
          </p>
          <Pills
            items={top}
            cls="vvsh-mqL"
            pillarSlug={pillarSlug}
            interactive
            uniqueItemCount={siblings.length}
          />
          <Pills
            items={bottom}
            cls="vvsh-mqR"
            pillarSlug={pillarSlug}
            interactive={false}
            uniqueItemCount={siblings.length}
          />
        </div>
      )}
    </section>
  );
}
