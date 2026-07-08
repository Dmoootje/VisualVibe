import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD } from "./styles";

/**
 * A checklist of takeaways / requirements. Pass plain strings or rich nodes.
 */
export function ChecklistBlock({
  title,
  items,
  className,
}: {
  title?: string;
  items: React.ReactNode[];
  className?: string;
}) {
  return (
    <div className={cn("my-6 p-5 sm:p-6", CARD, className)}>
      {title && <p className="mb-4 font-semibold text-white">{title}</p>}
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-red-500">
              <Check className="h-3 w-3 text-black" strokeWidth={3} aria-hidden="true" />
            </span>
            <span className="text-sm leading-relaxed text-white/80 [&_a]:text-amber-400 [&_a:hover]:underline [&_strong]:text-white">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
