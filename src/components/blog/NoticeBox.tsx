import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Info,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NoticeVariant = "info" | "success" | "warning" | "danger" | "tip";

const VARIANTS: Record<
  NoticeVariant,
  { icon: LucideIcon; ring: string; iconWrap: string; bar: string; defaultTitle: string }
> = {
  info: {
    icon: Info,
    ring: "border-sky-400/25 bg-sky-400/[0.06]",
    iconWrap: "bg-sky-400/15 text-sky-300",
    bar: "bg-sky-400",
    defaultTitle: "Goed om te weten",
  },
  success: {
    icon: CheckCircle2,
    ring: "border-emerald-400/25 bg-emerald-400/[0.06]",
    iconWrap: "bg-emerald-400/15 text-emerald-300",
    bar: "bg-emerald-400",
    defaultTitle: "Gelukt",
  },
  warning: {
    icon: AlertTriangle,
    ring: "border-amber-400/30 bg-amber-400/[0.07]",
    iconWrap: "bg-amber-400/15 text-amber-300",
    bar: "bg-amber-400",
    defaultTitle: "Let op",
  },
  danger: {
    icon: AlertOctagon,
    ring: "border-rose-500/30 bg-rose-500/[0.07]",
    iconWrap: "bg-rose-500/15 text-rose-300",
    bar: "bg-rose-500",
    defaultTitle: "Belangrijk",
  },
  tip: {
    icon: Lightbulb,
    ring: "border-violet-400/25 bg-violet-400/[0.06]",
    iconWrap: "bg-violet-400/15 text-violet-300",
    bar: "bg-violet-400",
    defaultTitle: "Tip van VisualVibe",
  },
};

export function NoticeBox({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: NoticeVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const v = VARIANTS[variant];
  const Icon = v.icon;

  return (
    <div
      className={cn(
        "relative my-6 overflow-hidden rounded-xl border p-4 pl-5 backdrop-blur-sm sm:p-5 sm:pl-6",
        v.ring,
        className
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", v.bar)} aria-hidden="true" />
      <div className="flex gap-3.5">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            v.iconWrap
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="mb-1 font-semibold text-white">{title ?? v.defaultTitle}</p>
          <div className="text-sm leading-relaxed text-white/75 [&_a]:text-amber-400 [&_a:hover]:underline [&_strong]:text-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
