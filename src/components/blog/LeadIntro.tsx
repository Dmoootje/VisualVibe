import { cn } from "@/lib/utils";

/**
 * The lead / direct-answer paragraph at the top of an article - larger, lighter
 * weight, with a subtle amber left accent. Great for the GEO "answer up front"
 * pattern the content blueprint calls for.
 */
export function LeadIntro({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 rounded-r-xl border-l border-[#ff7500]/55 bg-gradient-to-r from-[#ff7500]/[0.065] via-white/[0.018] to-transparent px-5 py-4 text-lg leading-[1.75] text-white/[0.78] sm:mb-10 sm:px-7 sm:py-5 [&_strong]:font-medium [&_strong]:text-white/95",
        className
      )}
    >
      {children}
    </div>
  );
}
