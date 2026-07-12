import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /**
   * Kept for API compatibility. Sections are now transparent so the single
   * site-wide flowing background (SiteBackground, in the layout) shows through
   * without per-section seams; this prop no longer paints anything.
   */
  orbs?: "tr-bl" | "tl-br" | "radial" | "none";
  /**
   * "pageHero" swaps the symmetric py-* scale for asymmetric top padding that
   * clears the fixed header, for use as the first section on a page.
   */
  variant?: "default" | "pageHero";
};

const paddingByVariant = {
  default: "py-12 sm:py-16 md:py-24",
  pageHero: "pt-28 pb-8 sm:pt-32 sm:pb-10 md:pt-36 md:pb-12",
} as const;

export function Section({ children, className, id, variant = "default" }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("px-4 relative overflow-hidden", paddingByVariant[variant], className)}
    >
      {children}
    </section>
  );
}
