import Image from "next/image";
import { CalendarDays, Clock, History, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { EYEBROW, GLOW_SHADOW, GRADIENT_TEXT } from "./styles";

export type BlogHeroProps = {
  /** Small category / topic pill above the title. */
  category?: string;
  title: string;
  /** Optional second line rendered in the amber gradient (the "hook"). */
  titleAccent?: string;
  excerpt?: string;
  author?: string;
  authorUrl?: string;
  authorRole?: string;
  /** ISO date string; formatted nl-BE. */
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: string;
  image?: string;
  imageAlt?: string;
  imageTitle?: string;
  imageCaption?: string;
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
  updatedAt,
  readingTime,
  image,
  imageAlt,
  imageTitle,
  imageCaption,
  className,
}: BlogHeroProps) {
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString("nl-BE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;
  const updatedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString("nl-BE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;
  const showUpdatedDate = Boolean(updatedDate && updatedDate !== date);

  const authorLabel = author && (
    <span>
      {author}
      {authorRole && <span className="text-white/40"> · {authorRole}</span>}
    </span>
  );

  return (
    <header className={cn("relative", className)}>
      {category && <span className={EYEBROW}>{category}</span>}

      <h1
        className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
        style={{ fontFamily: "var(--font-sora), sans-serif" }}
      >
        {title}
        {titleAccent && (
          <span className={cn("mt-1 block", GRADIENT_TEXT)}>{titleAccent}</span>
        )}
      </h1>

      {excerpt && (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{excerpt}</p>
      )}

      {(author || date || readingTime) && (
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
          {author && (
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#ff7500]" aria-hidden="true" />
              {authorUrl ? (
                authorUrl.startsWith("/") ? (
                  <Link href={authorUrl} className="transition-colors hover:text-white">
                    {authorLabel}
                  </Link>
                ) : (
                  <a
                    href={authorUrl}
                    className="transition-colors hover:text-white"
                    target="_blank"
                    rel="external noopener noreferrer"
                  >
                    {authorLabel}
                  </a>
                )
              ) : (
                authorLabel
              )}
            </span>
          )}
          {date && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-[#ff7500]" aria-hidden="true" />
              {date}
            </span>
          )}
          {showUpdatedDate && (
            <span className="inline-flex items-center gap-1.5">
              <History className="h-4 w-4 text-[#ff7500]" aria-hidden="true" />
              Bijgewerkt {updatedDate}
            </span>
          )}
          {readingTime && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#ff7500]" aria-hidden="true" />
              {readingTime}
            </span>
          )}
        </div>
      )}

      {image && (
        <figure className="mt-8">
          <div
            className={cn(
              "relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10",
              GLOW_SHADOW
            )}
          >
            <Image
              src={image}
              alt={imageAlt ?? title}
              title={imageTitle}
              fill
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
          {imageCaption && (
            <figcaption className="mt-3 text-center text-sm italic text-white/50">
              {imageCaption}
            </figcaption>
          )}
        </figure>
      )}
    </header>
  );
}
