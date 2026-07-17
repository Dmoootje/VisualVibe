import { Check } from "lucide-react";

/** Compact kernbullets list with orange check markers. */
export function ServiceFeatureList({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-5">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2.5 text-sm text-white/80">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-amber-500 text-white shadow-sm shadow-amber-500/30">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
