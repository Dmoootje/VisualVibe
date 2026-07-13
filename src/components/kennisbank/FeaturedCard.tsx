import Image from "next/image";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ArticleCardData } from "./data";

/** The large "Uitgelicht" hero card: image left, content right. */
export function FeaturedCard({ article }: { article: ArticleCardData }) {
  return (
    <Link
      href={article.href}
      aria-label={`Lees het volledige artikel: ${article.fullTitle}`}
      className="group grid grid-cols-1 overflow-hidden rounded-[22px] border border-[#ff7500]/25 bg-neutral-950 transition-all duration-300 hover:border-[#ff7500]/45 hover:shadow-[0_0_55px_-16px_rgba(255,117,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500] focus-visible:ring-offset-2 focus-visible:ring-offset-black md:grid-cols-[1.05fr_0.95fr]"
    >
      <div className="relative min-h-[260px] overflow-hidden bg-[#161412] md:min-h-[340px]">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.imageAlt ?? article.fullTitle}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#ff7500]/25 to-orange-600/10" aria-hidden="true" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent md:bg-gradient-to-l" aria-hidden="true" />
        <span
          className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff7500] to-orange-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-orange-950/40"
          aria-hidden="true"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
          {article.categoryName}
        </span>
        <Image
          src="/logo.svg"
          alt="VisualVibe"
          width={140}
          height={28}
          className="absolute right-4 top-4 z-10 h-[18px] w-auto opacity-90"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col p-8 sm:p-9">
        <div
          className="mb-3.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff7500]" />
          {article.pillar ? "Complete gids" : "Uitgelicht artikel"}
        </div>
        <h3
          className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-[32px]"
          style={{ fontFamily: "var(--font-sora), sans-serif" }}
        >
          <span className="block">{article.title}</span>
          {article.titleAccent && <span className="block text-[#ff7500]">{article.titleAccent}</span>}
        </h3>
        <span className="mt-4 mb-4 block h-[3px] w-[52px] rounded-full bg-gradient-to-r from-[#ff7500] to-orange-500" aria-hidden="true" />
        <p className="mb-6 text-[15px] leading-relaxed text-white/66 line-clamp-3">{article.excerpt}</p>

        <div className="mb-6 mt-auto flex flex-wrap gap-x-6 gap-y-3">
          {article.readingTime && (
            <MetaBlock icon={Clock} label="Leestijd" value={article.readingTime} />
          )}
          <MetaBlock icon={CalendarDays} label="Gepubliceerd" value={article.date} />
        </div>

        <span className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition-colors group-hover:border-[#ff7500]/50 group-hover:bg-[#ff7500]/10 group-hover:text-[#ff9a45]">
          Lees het volledige artikel
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function MetaBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-[18px] w-[18px] shrink-0 text-[#ff7500]" aria-hidden="true" />
      <div className="leading-tight">
        <div
          className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-white/40"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          {label}
        </div>
        <div className="text-[13.5px] font-bold text-white">{value}</div>
      </div>
    </div>
  );
}
