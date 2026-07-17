import type { ReactNode } from "react";

/**
 * Reusable glass mini-card used for the "Onze aanpak" and "Menselijke aanpak"
 * blocks under a service panel. Keeps the warm, personal tone visually distinct
 * from the plain description text.
 */
export function ServiceMiniBlock({
  icon,
  label,
  text,
  accent = false,
}: {
  icon: ReactNode;
  label: string;
  text: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/[0.08] to-red-500/[0.04] p-4 backdrop-blur-sm"
          : "rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
      }
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className={
            accent
              ? "flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300"
              : "flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white/80"
          }
        >
          {icon}
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{label}</p>
      </div>
      <p className="text-sm leading-relaxed text-white/70">{text}</p>
    </div>
  );
}
