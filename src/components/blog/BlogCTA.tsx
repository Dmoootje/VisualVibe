import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { GlowFrame } from "./GlowFrame";
import { normalizeKnowledgeBaseHref } from "@/lib/kennisbank/publicLinks";
import type { BlogLocale } from "@/types/blog";

/**
 * An in-article call-to-action band. Smaller than the page-level CTASection,
 * built on the glow-border frame so it reads as a premium highlight.
 */
export function BlogCTA({
  title,
  description,
  buttonLabel,
  href,
  secondaryLabel,
  secondaryHref,
  className,
  locale = "nl",
}: {
  title: string;
  description?: string;
  buttonLabel: string;
  href: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
  locale?: BlogLocale;
}) {
  const primaryHref = normalizeKnowledgeBaseHref(href, locale);
  const normalizedSecondaryHref = secondaryHref
    ? normalizeKnowledgeBaseHref(secondaryHref, locale)
    : null;

  return (
    <GlowFrame className={cn("my-8", className)}>
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#ff7500]/15 blur-3xl" />
        <div className="relative">
          <h3 className="text-xl font-bold text-white sm:text-2xl">{title}</h3>
          {description && (
            <p className="mt-2 max-w-xl text-white/70">{description}</p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            {primaryHref && (
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-[#ff7500] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                {buttonLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
            {secondaryLabel && normalizedSecondaryHref && (
              <Link
                href={normalizedSecondaryHref}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </GlowFrame>
  );
}
