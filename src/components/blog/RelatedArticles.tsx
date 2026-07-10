import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { CARD_INTERACTIVE } from "./styles";

export type RelatedArticle = {
  title: string;
  href: string;
  category?: string;
  readingTime?: string;
  image?: string;
};

export function RelatedArticles({
  items,
  title = "Lees ook",
  className,
}: {
  items: RelatedArticle[];
  title?: string;
  className?: string;
}) {
  return (
    <section className={cn("my-8", className)}>
      <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("group flex flex-col overflow-hidden", CARD_INTERACTIVE)}
          >
            {item.image && (
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 90vw, 30vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-4">
              {(item.category || item.readingTime) && (
                <div className="mb-2 flex items-center gap-2 text-xs text-white/50">
                  {item.category && <span className="text-[#ff7500]">{item.category}</span>}
                  {item.category && item.readingTime && <span>·</span>}
                  {item.readingTime && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {item.readingTime}
                    </span>
                  )}
                </div>
              )}
              <h3 className="font-semibold leading-snug text-white line-clamp-2">
                {item.title}
              </h3>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-[#ff7500]">
                Lees meer
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
