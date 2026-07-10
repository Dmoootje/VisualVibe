import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD_INTERACTIVE } from "./styles";

const COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function FeatureGrid({
  children,
  columns = 3,
  className,
}: {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  return (
    <div className={cn("my-6 grid gap-4", COLS[columns], className)}>{children}</div>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group p-5", CARD_INTERACTIVE, className)}>
      {Icon && (
        <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff7500]/20 to-red-500/10 text-[#ff9a45] ring-1 ring-inset ring-[#ff7500]/20 transition-colors group-hover:text-[#ffc489]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <h3 className="mb-1.5 font-semibold text-white">{title}</h3>
      {children && <p className="text-sm leading-relaxed text-white/70">{children}</p>}
    </div>
  );
}
