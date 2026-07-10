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
        "border-l-2 border-[#ff7500]/60 pl-5 text-lg leading-relaxed text-white/80 sm:text-xl [&_strong]:font-semibold [&_strong]:text-white",
        className
      )}
    >
      {children}
    </div>
  );
}
