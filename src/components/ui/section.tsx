import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Ambient background per the visual style guide. "radial" matches the homepage Cta band. Default "tr-bl". */
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

export function Section({ children, className, id, orbs = "tr-bl", variant = "default" }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("px-4 bg-black relative overflow-hidden", paddingByVariant[variant], className)}
    >
      {orbs !== "none" && (
        <div className="absolute inset-0 z-0">
          {orbs === "tr-bl" && (
            <>
              <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-red-500/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-amber-500/10 rounded-full blur-[100px]" />
            </>
          )}
          {orbs === "tl-br" && (
            <>
              <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-red-500/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-amber-500/10 rounded-full blur-[100px]" />
            </>
          )}
          {orbs === "radial" && (
            <>
              <div className="absolute inset-0 bg-gradient-radial from-red-500/20 via-transparent to-transparent opacity-30" />
              <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-repeat opacity-10" />
            </>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
