import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD } from "./styles";

/**
 * A pull-quote card with an oversized amber quote mark and optional attribution.
 */
export function QuoteBlock({
  children,
  author,
  role,
  className,
}: {
  children: React.ReactNode;
  author?: string;
  role?: string;
  className?: string;
}) {
  return (
    <figure className={cn("relative my-8 overflow-hidden p-6 sm:p-8", CARD, className)}>
      <Quote
        className="absolute -right-2 -top-2 h-24 w-24 text-amber-500/10"
        aria-hidden="true"
      />
      <blockquote className="relative text-xl font-medium leading-relaxed text-white/90 sm:text-2xl">
        {children}
      </blockquote>
      {(author || role) && (
        <figcaption className="relative mt-5 flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-amber-400 to-red-500" aria-hidden="true" />
          <span className="text-sm text-white/70">
            {author && <span className="font-semibold text-white">{author}</span>}
            {author && role && <span className="text-white/40"> - </span>}
            {role}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
