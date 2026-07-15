import Image from "next/image";
import { User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ArticleCardData } from "./data";

/** Compact horizontal "artikel per vraag" card: thumbnail + title + snippet. */
export function QuestionCard({ article, index = 0 }: { article: ArticleCardData; index?: number }) {
  const style = { "--i": index } as React.CSSProperties;
  return (
    <Link
      href={article.href}
      aria-label={`Lees het volledige artikel: ${article.fullTitle}`}
      style={style}
      className="kb-rise group flex gap-4 rounded-[18px] border border-white/[0.09] bg-neutral-950 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff7500]/35 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[13px] bg-[#161412]">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.imageAlt ?? article.fullTitle}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#ff7500]/25 to-orange-600/10" aria-hidden="true" />
        )}
      </div>
      <div className="flex min-w-0 flex-col">
        <div
          className="mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#ff9a45]"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          {article.categoryName}
          {article.readingTime ? ` · ${article.readingTime}` : ""}
        </div>
        <div
          className="text-[15px] font-bold leading-snug tracking-tight text-white"
          style={{ fontFamily: "var(--font-sora), sans-serif" }}
        >
          {article.title}
          {article.titleAccent && <span className="text-[#ff9a45]"> {article.titleAccent}</span>}
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-white/55 line-clamp-2">{article.excerpt}</p>
        <div
          className="mt-2 flex items-center gap-1.5 text-[11px] text-white/50"
          aria-label={`Auteur: ${article.author}`}
        >
          {article.authorImage ? (
            <Image
              src={article.authorImage}
              alt={`Profielfoto van ${article.author}`}
              width={28}
              height={28}
              className="h-4 w-4 shrink-0 rounded-full border border-[#ff7500]/40 object-cover"
            />
          ) : (
            <User className="h-3 w-3 shrink-0 text-[#ff7500]" aria-hidden="true" />
          )}
          <span className="truncate">{article.author}</span>
        </div>
      </div>
    </Link>
  );
}
