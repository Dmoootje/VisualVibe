import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Side-by-side "wel doen / niet doen" comparison - a strong scannable pattern
 * for practical SEO/AEO guidance.
 */
export function DoDontGrid({
  dos,
  donts,
  doTitle = "Wel doen",
  dontTitle = "Niet doen",
  className,
}: {
  dos: React.ReactNode[];
  donts: React.ReactNode[];
  doTitle?: string;
  dontTitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("my-6 grid gap-4 sm:grid-cols-2", className)}>
      <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.05] p-5">
        <p className="mb-4 flex items-center gap-2 font-semibold text-emerald-300">
          <Check className="h-5 w-5" aria-hidden="true" />
          {doTitle}
        </p>
        <ul className="space-y-3">
          {dos.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-rose-500/25 bg-rose-500/[0.05] p-5">
        <p className="mb-4 flex items-center gap-2 font-semibold text-rose-300">
          <X className="h-5 w-5" aria-hidden="true" />
          {dontTitle}
        </p>
        <ul className="space-y-3">
          {donts.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
