import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { CARD_INTERACTIVE } from "./styles";

export type RelatedService = {
  title: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
};

export function RelatedServices({
  items,
  title = "Gerelateerde diensten",
  className,
}: {
  items: RelatedService[];
  title?: string;
  className?: string;
}) {
  return (
    <section className={cn("my-8", className)}>
      <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("group flex items-start gap-4 p-5", CARD_INTERACTIVE)}
            >
              {Icon && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-red-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <span className="flex items-center gap-1 font-semibold text-white">
                  {item.title}
                  <ArrowUpRight
                    className="h-4 w-4 text-amber-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
                {item.description && (
                  <p className="mt-1 text-sm leading-relaxed text-white/70">
                    {item.description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
