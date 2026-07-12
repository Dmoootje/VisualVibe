import Image from "next/image";
import { ArrowRight, CalendarDays, Clock, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { ArticleCardData } from "./data";

const CARD_BASE =
  "group relative overflow-hidden rounded-2xl border border-[#ff7500]/20 bg-neutral-950 transition-all duration-300 hover:border-[#ff7500]/45 hover:shadow-[0_0_45px_-14px_rgba(255,117,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

/** Category pill + logo watermark + overlaid two-tone title over the image. */
function ImageOverlay({ article, compact }: { article: ArticleCardData; compact?: boolean }) {
  if (article.heroComposed) {
    return null;
  }
  return (
    <>
      <div
        className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-neutral-950/10"
        aria-hidden="true"
      />
      <span
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff7500] to-orange-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-orange-950/40"
        aria-hidden="true"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
        {article.categoryName}
      </span>
      <Image
        src="/logo.svg"
        alt=""
        width={120}
        height={24}
        className="absolute right-4 top-4 z-10 h-4 w-auto opacity-90"
        aria-hidden="true"
      />
      <div className="absolute inset-x-4 bottom-4 z-10">
        <h3
          className={cn("font-bold leading-tight text-white", compact ? "text-base sm:text-lg" : "text-lg sm:text-xl")}
          style={{ fontFamily: "var(--font-sora), sans-serif" }}
        >
          <span className="block">{article.title}</span>
          {article.titleAccent && (
            <span className="block bg-gradient-to-r from-[#ff7500] to-orange-500 bg-clip-text text-transparent">
              {article.titleAccent}
            </span>
          )}
        </h3>
        <span
          className="mt-2.5 block h-0.5 w-10 rounded-full bg-gradient-to-r from-[#ff7500] to-orange-500"
          aria-hidden="true"
        />
      </div>
    </>
  );
}

function Meta({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2" aria-label={`${label}: ${value}`}>
      <Icon className="h-4 w-4 shrink-0 text-[#ff7500]" aria-hidden="true" />
      <div className="min-w-0 leading-tight">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-white/40" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
          {label}
        </div>
        <div className="truncate text-xs font-medium text-white">{value}</div>
      </div>
    </div>
  );
}

function Cta({ label = "Lees het volledige artikel" }: { label?: string }) {
  return (
    <span className="mt-auto inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-[#ff7500]/40 px-4 py-2.5 text-sm font-medium text-[#ff7500] transition-colors group-hover:border-[#ff7500] group-hover:bg-[#ff7500]/10 group-hover:text-[#ff9a45]">
      {label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </span>
  );
}

function CoverImage({ article, sizes }: { article: ArticleCardData; sizes: string }) {
  if (!article.image) {
    return (
      <div
        className="h-full w-full bg-gradient-to-br from-[#ff7500]/25 to-orange-600/10"
        aria-hidden="true"
      />
    );
  }
  return (
    <Image
      src={article.image}
      alt={article.imageAlt ?? article.fullTitle}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export type ArticleCardProps = {
  article: ArticleCardData;
  /** Layout: vertical card (grid) or horizontal image-left card (list). */
  variant?: "grid" | "list";
  /** Stagger index for the entrance animation (--i). */
  index?: number;
  /** CTA label override (e.g. "Lees de gids"). */
  ctaLabel?: string;
  className?: string;
};

export function ArticleCard({
  article,
  variant = "grid",
  index = 0,
  ctaLabel,
  className,
}: ArticleCardProps) {
  const style = { "--i": index } as React.CSSProperties;

  if (variant === "list") {
    return (
      <Link
        href={article.href}
        aria-label={`Lees het volledige artikel: ${article.fullTitle}`}
        style={style}
        className={cn(CARD_BASE, "kb-rise grid grid-cols-1 sm:grid-cols-[300px_1fr]", className)}
      >
        <div className="relative min-h-[200px] overflow-hidden bg-[#161412] sm:min-h-[230px]">
          <CoverImage article={article} sizes="(max-width: 640px) 90vw, 300px" />
          <ImageOverlay article={article} compact />
        </div>
        <div className="flex flex-col p-6 sm:p-7">
          {article.heroComposed && <h3 className="sr-only">{article.fullTitle}</h3>}
          {!article.heroComposed && (
            <>
              <div
                className="mb-3 inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/45"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff7500]" />
                {article.categoryName}
              </div>
              <h3 className="text-xl font-bold leading-tight tracking-tight text-white sm:text-[23px]" style={{ fontFamily: "var(--font-sora), sans-serif" }}>
                <span className="block">{article.title}</span>
                {article.titleAccent && (
                  <span className="block text-[#ff9a45]">{article.titleAccent}</span>
                )}
              </h3>
              <span className="mt-3.5 mb-4 block h-[3px] w-11 rounded-full bg-gradient-to-r from-[#ff7500] to-orange-500" aria-hidden="true" />
            </>
          )}
          <p className="mb-5 text-sm leading-relaxed text-white/64 line-clamp-3">{article.excerpt}</p>
          <div className="mb-5 mt-auto flex flex-wrap gap-x-6 gap-y-3">
            <Meta icon={Clock} label="Leestijd" value={article.readingTime} />
            <Meta icon={CalendarDays} label="Gepubliceerd" value={article.date} />
            <Meta icon={User} label="Auteur" value={article.author} />
          </div>
          <Cta label={ctaLabel} />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={article.href}
      aria-label={`Lees het volledige artikel: ${article.fullTitle}`}
      style={style}
      className={cn(CARD_BASE, "kb-rise flex h-full flex-col", className)}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#161412]">
        <CoverImage article={article} sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" />
        <ImageOverlay article={article} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {article.heroComposed && <h3 className="sr-only">{article.fullTitle}</h3>}
        <div className="grid grid-cols-2 gap-3">
          <Meta icon={Clock} label="Leestijd" value={article.readingTime} />
          <Meta icon={User} label="Auteur" value={article.author} />
        </div>
        <div className="my-4 h-px bg-white/10" />
        <p className="mb-5 flex-1 text-sm leading-relaxed text-white/64 line-clamp-3">{article.excerpt}</p>
        <Cta label={ctaLabel} />
      </div>
    </Link>
  );
}
