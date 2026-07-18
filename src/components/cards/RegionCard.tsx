import { Link } from "@/i18n/navigation";
import { MapPin } from "lucide-react";
import type { Region } from "@/types";

export function RegionCard({
  region,
  showIntro = false,
  locale = "nl",
}: {
  region: Region;
  showIntro?: boolean;
  locale?: string;
}) {
  return (
    <Link
      href={`/regio/${region.slug}`}
      className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10"
    >
      <span className="flex items-center gap-2 text-white/60">
        <MapPin className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wide">
          {locale === "en"
            ? region.type === "province" ? "Home region" : "Region"
            : region.type === "province" ? "Thuisregio" : "Regio"}
        </span>
      </span>
      <span className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
        {region.title}
      </span>
      {showIntro && <span className="text-sm text-white/70">{region.intro}</span>}
    </Link>
  );
}
