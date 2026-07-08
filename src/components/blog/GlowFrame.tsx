import { cn } from "@/lib/utils";

/**
 * A gradient "glow border" frame — a 1px amber→transparent gradient edge around
 * a solid dark surface. Used by the premium blocks (CTA, sidebar service card,
 * stat highlights) to get the VisualVibe glow-border look without box-shadow.
 */
export function GlowFrame({
  children,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-amber-500/50 via-white/10 to-transparent p-px",
        className
      )}
    >
      <div className={cn("h-full rounded-2xl bg-neutral-950/90", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
