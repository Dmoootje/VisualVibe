import { cn } from "@/lib/utils";

type GlowCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Blur/radius scale per the visual style guide - "lg" for hero/CTA-scale cards, "sm" for small elements. */
  size?: "sm" | "md" | "lg";
};

const glowBlur = { sm: "blur-sm", md: "blur-md", lg: "blur-lg" } as const;
const outerRadius = { sm: "rounded-xl", md: "rounded-2xl", lg: "rounded-2xl" } as const;
const innerRadius = { sm: "rounded-lg", md: "rounded-xl", lg: "rounded-xl" } as const;

export function GlowCard({ children, className, size = "lg" }: GlowCardProps) {
  return (
    <div className="relative">
      <div
        className={cn(
          "absolute -inset-1 bg-gradient-to-r from-red-500 to-amber-500 opacity-70",
          outerRadius[size],
          glowBlur[size]
        )}
      />
      <div
        className={cn(
          "relative bg-black/80 backdrop-blur-sm border border-white/10",
          innerRadius[size],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
