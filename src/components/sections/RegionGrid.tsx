import type { Region } from "@/types";
import { RegionCard } from "@/components/cards";

export function RegionGrid({ regions, showIntro = true }: { regions: Region[]; showIntro?: boolean }) {
  if (regions.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {regions.map((region) => (
        <RegionCard key={region.slug} region={region} showIntro={showIntro} />
      ))}
    </div>
  );
}
