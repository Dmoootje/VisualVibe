"use client";

import { sectors } from "@/data/sectors";

/**
 * Toggleable sector-slug chips for admin forms. Tagged content surfaces on the
 * matching /sectoren/[slug] pages (cases / realisaties sections).
 */
export function SectorPicker({
  label = "Sectoren",
  hint,
  value,
  onChange,
}: {
  label?: string;
  hint?: string;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (slug: string) =>
    onChange(value.includes(slug) ? value.filter((s) => s !== slug) : [...value, slug]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-white/60">
        {label}
        {hint && <span className="ml-1 text-white/30">{hint}</span>}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {sectors.map((sector) => {
          const active = value.includes(sector.slug);
          return (
            <button
              key={sector.slug}
              type="button"
              onClick={() => toggle(sector.slug)}
              aria-pressed={active}
              className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                active
                  ? "border-amber-400/60 bg-amber-400/15 font-medium text-amber-200"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white"
              }`}
            >
              {sector.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
