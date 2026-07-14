import { ArrowRight, CalendarDays, Clock, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { BlogCardPost } from "@/lib/kennisbank/blogCard";
import { postHref } from "@/lib/kennisbank/urls";

interface BlogCardProps {
  post: BlogCardPost;
  index: number;
  /** Profielfoto van de auteur (admin-profiel); valt terug op het User-icoon. */
  authorImage?: string;
}

// The overlaid title mirrors the mockup: the part up to (and including) the
// first colon stays white, the remainder is the orange "hook" line. Titles
// without a colon simply render as one white line.
function splitTitle(title: string): { lead: string; accent: string } {
  const colon = title.indexOf(":");
  if (colon === -1) {
    return { lead: title, accent: "" };
  }
  const lead = title.slice(0, colon + 1).trim();
  const rest = title.slice(colon + 1).trim();
  const accent = rest.charAt(0).toUpperCase() + rest.slice(1);
  return { lead, accent };
}

export function BlogCard({ post, index, authorImage }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const { lead, accent } = splitTitle(post.title);
  // Uitgelichte afbeelding zonder tekst; de kaart legt zelf badge/titel/logo erop.
  const cardImage = post.featuredImage ?? post.ogImage;

  return (
    <div
      className="home-reveal-up group h-full"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link
        href={postHref(post)}
        aria-label={`Lees het volledige artikel: ${post.title}`}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#ff7500]/20 bg-neutral-950 transition-all duration-300 hover:border-[#ff7500]/40 hover:shadow-[0_0_35px_-10px_rgba(255,117,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        {/* Hero image + (optional) overlaid badge, logo and title */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {cardImage ? (
            <Image
              src={cardImage}
              alt={post.heroImageAlt ?? `Uitgelichte afbeelding voor artikel: ${post.title}`}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="h-full w-full bg-gradient-to-br from-[#ff7500]/25 to-orange-600/10"
              aria-hidden="true"
            />
          )}

          {!post.heroComposed && (
            <>
              {/* Legibility gradient so overlaid text stays readable on any artwork */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-neutral-950/10"
                aria-hidden="true"
              />

              <span
                className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff7500] to-orange-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-orange-950/40"
                aria-hidden="true"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                {post.category}
              </span>

              <Image
                src="/logo.svg"
                alt="VisualVibe"
                width={120}
                height={24}
                className="absolute right-4 top-4 h-4 w-auto opacity-90 sm:h-[18px]"
                aria-hidden="true"
              />

              <div className="absolute inset-x-4 bottom-4">
                <h3 className="text-lg font-bold leading-tight text-white sm:text-xl">
                  <span className="block">{lead}</span>
                  {accent && (
                    <span className="block bg-gradient-to-r from-[#ff7500] to-orange-500 bg-clip-text text-transparent">
                      {accent}
                    </span>
                  )}
                </h3>
                <span
                  className="mt-2.5 block h-0.5 w-10 rounded-full bg-gradient-to-r from-[#ff7500] to-orange-500"
                  aria-hidden="true"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer: meta row, excerpt and call-to-action */}
        <div className="flex flex-1 flex-col p-5">
          {/* When the artwork already carries the title, keep an accessible heading */}
          {post.heroComposed && <h3 className="sr-only">{post.title}</h3>}

          <div className="grid grid-cols-3 gap-3">
            <Meta icon={Clock} label="Leestijd" value={post.readingTime} />
            <Meta icon={CalendarDays} label="Gepubliceerd" value={formattedDate} />
            <Meta icon={User} imageUrl={authorImage} label="Auteur" value={post.author} />
          </div>

          <div className="my-4 h-px bg-white/10" />

          <p className="mb-5 flex-1 text-sm leading-relaxed text-white/70 line-clamp-3">
            {post.excerpt}
          </p>

          <span className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#ff7500]/40 px-4 py-2.5 text-sm font-medium text-[#ff7500] transition-colors group-hover:border-[#ff7500] group-hover:bg-[#ff7500]/10 group-hover:text-[#ff9a45]">
            Lees het volledige artikel
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </div>
  );
}

function Meta({
  icon: Icon,
  imageUrl,
  label,
  value,
}: {
  icon: LucideIcon;
  /** Rond avatarfotootje in plaats van het icoon (auteursfoto). */
  imageUrl?: string;
  label: string;
  value?: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex items-center gap-2" aria-label={`${label}: ${value}`}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          width={32}
          height={32}
          className="h-5 w-5 shrink-0 rounded-full border border-[#ff7500]/40 object-cover"
          aria-hidden="true"
        />
      ) : (
        <Icon className="h-4 w-4 shrink-0 text-[#ff7500]" aria-hidden="true" />
      )}
      <div className="min-w-0 leading-tight">
        <div className="text-[10px] uppercase tracking-wide text-white/60">{label}</div>
        <div className="truncate text-xs font-medium text-white">{value}</div>
      </div>
    </div>
  );
}
