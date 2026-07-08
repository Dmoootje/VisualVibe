import { Link } from "@/i18n/navigation";
import type { Sector } from "@/types";

export function SectorChip({ sector }: { sector: Sector }) {
  return (
    <Link
      href={`/sectoren/${sector.slug}`}
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
    >
      {sector.title}
    </Link>
  );
}
