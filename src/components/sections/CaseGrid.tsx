import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import type { CaseItem } from "@/types";

export function CaseGrid({ cases }: { cases: CaseItem[] }) {
  if (cases.length === 0) {
    return <p className="text-center text-sm text-white/40">Realisaties volgen binnenkort.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cases.map((item) => (
        <Link
          key={item.slug}
          href={`/realisaties/${item.slug}`}
          className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10"
        >
          <span className="text-xs uppercase tracking-wide text-white/50">{item.category}</span>
          <span className="font-semibold group-hover:text-amber-400 transition-colors flex items-center justify-between">
            {item.title}
            <ArrowRight className="h-4 w-4 text-white/50" />
          </span>
          <span className="text-sm text-white/70">{item.excerpt}</span>
        </Link>
      ))}
    </div>
  );
}
