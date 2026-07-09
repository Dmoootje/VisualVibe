import { ArrowRight, FolderOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { categoryHref } from "@/lib/kennisbank/urls";

export type CategoryCard = {
  slug: string;
  name: string;
  description: string;
  count: number;
};

/** Grid of kennisbank category cards linking to each category hub. */
export function CategoryGrid({ items }: { items: CategoryCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((category) => (
        <Link
          key={category.slug}
          href={categoryHref(category.slug)}
          className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_35px_-12px_rgba(255,117,0,0.45)]"
        >
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20">
            <FolderOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="flex items-center gap-1.5 text-lg font-bold text-white">
            {category.name}
            <ArrowRight
              className="h-4 w-4 text-amber-400 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">
            {category.description}
          </p>
          <span className="mt-4 text-xs uppercase tracking-wide text-white/40">
            {category.count} {category.count === 1 ? "artikel" : "artikels"}
          </span>
        </Link>
      ))}
    </div>
  );
}
