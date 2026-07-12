import { CalendarDays, ChevronDown, Clock, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { TocItem } from "./BlogToc";
import { BlogHeroImage } from "./BlogHeroImage";
import { ShareButtons } from "./ShareButtons";

const GRID_BG =
  "linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px)";
const GRID_MASK = "radial-gradient(ellipse 80% 90% at 40% 20%,#000,transparent 74%)";

export type BlogHeroProps = {
  category?: string;
  title: string;
  titleAccent?: string;
  excerpt?: string;
  author?: string;
  authorUrl?: string;
  authorRole?: string;
  publishedAt?: string;
  readingTime?: string;
  image?: string;
  imageAlt?: string;
  imageTitle?: string;
  imageCaption?: string;
  /** Absolute URL of the article, for the share buttons. */
  shareUrl?: string;
  /** H2 headings, rendered as "in dit artikel" quick-jump chips. */
  toc?: TocItem[];
  /** Target for the "Begin met lezen" button (an in-page hash). */
  readMoreHref?: string;
  className?: string;
};

export function BlogHero({
  category,
  title,
  titleAccent,
  excerpt,
  author,
  authorUrl,
  authorRole,
  publishedAt,
  readingTime,
  image,
  imageAlt,
  imageTitle,
  imageCaption,
  shareUrl,
  toc = [],
  readMoreHref = "#artikel",
  className,
}: BlogHeroProps) {
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString("nl-BE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;

  const authorName = author && (
    <span className="text-sm font-bold text-white">
      {authorUrl ? (
        authorUrl.startsWith("/") ? (
          <Link href={authorUrl} className="transition-colors hover:text-[#ff9a45]">
            {author}
          </Link>
        ) : (
          <a href={authorUrl} target="_blank" rel="external noopener noreferrer" className="transition-colors hover:text-[#ff9a45]">
            {author}
          </a>
        )
      ) : (
        author
      )}
    </span>
  );

  return (
    <header className={cn("relative", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-28 z-0 h-[560px] w-[760px]"
        style={{ background: "radial-gradient(ellipse 50% 50% at 30% 40%,rgba(255,90,0,.16),transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: GRID_BG,
          backgroundSize: "54px 54px",
          WebkitMaskImage: GRID_MASK,
          maskImage: GRID_MASK,
        }}
      />

      <div className="relative z-[2]">
        <div
          className={cn(
            "grid items-center gap-10 lg:gap-12",
            image ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-1"
          )}
        >
          {/* Left: copy */}
          <div>
            {category && (
              <span
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ff7500]/35 bg-[#ff7500]/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#ff9a45]"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                {category}
              </span>
            )}
            <h1
              className="text-[clamp(34px,7vw,52px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-white"
              style={{ fontFamily: "var(--font-sora), sans-serif" }}
            >
              {title}
              {titleAccent && <span className="mt-1 block text-[#ff7500]">{titleAccent}</span>}
            </h1>

            {excerpt && (
              <p className="mt-6 max-w-[560px] text-lg leading-relaxed text-white/66">{excerpt}</p>
            )}

            {(author || date || readingTime) && (
              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
                {author && (
                  <div className="flex items-center gap-2.5 border-white/12 pr-4 sm:border-r">
                    <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#ff7500]/40 bg-gradient-to-br from-[#ff7500]/30 to-[#ff7500]/[0.08] text-[#ff9a45]">
                      <User className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="leading-tight">
                      {authorName}
                      {authorRole && <div className="text-xs text-white/50">{authorRole}</div>}
                    </div>
                  </div>
                )}
                {date && (
                  <span className="inline-flex items-center gap-1.5 text-[13.5px] text-white/62">
                    <CalendarDays className="h-4 w-4 text-[#ff9a45]" aria-hidden="true" />
                    {date}
                  </span>
                )}
                {readingTime && (
                  <span className="inline-flex items-center gap-1.5 text-[13.5px] text-white/62">
                    <Clock className="h-4 w-4 text-[#ff9a45]" aria-hidden="true" />
                    {readingTime}
                  </span>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={readMoreHref}
                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-red-500 to-[#ff7500] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Begin met lezen
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </a>
              {shareUrl && <ShareButtons url={shareUrl} title={title} />}
            </div>
          </div>

          {/* Right: portrait cover card */}
          {image && (
            <BlogHeroImage
              src={image}
              alt={imageAlt ?? title}
              title={imageTitle}
              caption={imageCaption}
              category={category ?? ""}
              readingTime={readingTime}
            />
          )}
        </div>

        {toc.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-3.5 border-t border-white/[0.08] pt-6">
            <span
              className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              In dit artikel
            </span>
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.02] px-4 py-2 text-[13px] font-semibold text-white/66 transition-all hover:-translate-y-px hover:border-[#ff7500]/45 hover:text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff7500]" />
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
