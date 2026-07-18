import type { ComponentType } from "react";
import {
  Monitor,
  AppWindow,
  Camera,
  Video,
  Radar,
  Box,
  Mic,
  Building2,
  HardHat,
  CalendarDays,
  Trophy,
  Globe,
  type LucideProps,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { RealisatieCategory, RealisatieStat } from "@/data/realisatieCategories";
import type { SupportedLocale } from "@/i18n/locales";

// Per-category glyph for the header icon badge. Falls back to a monitor.
const ICON_BY_SLUG: Record<string, ComponentType<LucideProps>> = {
  webdesign: Monitor,
  applicaties: AppWindow,
  fotografie: Camera,
  videografie: Video,
  drone: Radar,
  "3d-vr": Box,
  podcasting: Mic,
  bedrijven: Building2,
  projecten: HardHat,
  events: CalendarDays,
  sport: Trophy,
  buitenland: Globe,
};

/**
 * Herbruikbare realisatie-header: kruimelpad, icoon-badge, eyebrow
 * "REALISATIES", H1, subtitel en een optionele stat-rail.
 */
export function RealisatieHeader({
  category,
  stats: statsOverride,
  locale = "nl",
}: {
  category: RealisatieCategory;
  /** Overrides `category.stats` for content-driven categories (e.g. fotografie). */
  stats?: RealisatieStat[];
  locale?: SupportedLocale;
}) {
  const Icon = ICON_BY_SLUG[category.slug] ?? Monitor;
  const stats = statsOverride ?? category.stats ?? [];

  return (
    <header className="relative overflow-hidden pb-10 pt-28 sm:pt-32 md:pb-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          WebkitMaskImage:
            "radial-gradient(ellipse 66% 120% at 18% 30%, #000, transparent 72%)",
          maskImage:
            "radial-gradient(ellipse 66% 120% at 18% 30%, #000, transparent 72%)",
        }}
      />

      <div className="container relative z-[2] mx-auto flex flex-col items-start justify-between gap-8 px-2.5 sm:px-4 lg:flex-row lg:items-center lg:gap-10">
        <div className="max-w-[640px]">
          <nav className="mb-6 flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.03em] text-white/40">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/realisaties" className="transition-colors hover:text-white">
              {locale === "en" ? "Case studies" : "Realisaties"}
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-[#FF9A45]">{category.name}</span>
          </nav>

          <div className="mb-5 flex items-center gap-[18px]">
            <span className="relative flex h-[54px] w-[54px] flex-none items-center justify-center rounded-[17px] border border-[rgba(255,122,0,0.3)] bg-[linear-gradient(150deg,rgba(255,122,0,0.18),rgba(255,122,0,0.05))] shadow-[0_18px_40px_-20px_rgba(255,90,0,0.7)] sm:h-[66px] sm:w-[66px]">
              <Icon className="h-7 w-7 text-[#FF9A45] sm:h-8 sm:w-8" strokeWidth={1.8} />
            </span>
            <div>
              <div className="mb-2 font-mono text-xs font-bold tracking-[0.2em] text-[#FF9A45]">
                {locale === "en" ? "CASE STUDIES" : "REALISATIES"}
              </div>
              <h1 className="text-[clamp(38px,12vw,52px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-white sm:text-[58px]">
                {category.name}
              </h1>
            </div>
          </div>

          <p className="max-w-[520px] text-[17px] leading-relaxed text-white/[0.62] sm:text-lg">
            {category.description}
          </p>
        </div>

        {stats.length > 0 && (
          <div className="flex flex-none flex-row flex-wrap gap-3.5 lg:flex-col">
            {stats.map((stat) => (
              <div
                key={stat.value + stat.label}
                className="flex min-w-[200px] flex-1 items-center gap-3.5 rounded-[15px] border border-white/[0.08] bg-white/[0.03] px-[22px] py-4 lg:min-w-[230px]"
              >
                <span
                  className={`font-sora text-[30px] font-extrabold leading-none ${
                    stat.accent ? "text-[#FF9A45]" : "text-white"
                  }`}
                >
                  {stat.value}
                </span>
                <span className="text-[13.5px] leading-[1.4] text-white/55">
                  {stat.label.split("\n").map((line, index, lines) => (
                    <span key={`${line}-${index}`}>
                      {line}
                      {index < lines.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
