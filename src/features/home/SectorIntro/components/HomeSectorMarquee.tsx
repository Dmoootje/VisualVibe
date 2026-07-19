import { SectorMarquee } from "@/components/sectors";
import { sectors, getLocalizedSectorById } from "@/data/sectors";

export function HomeSectorMarquee({ locale = "nl" }: { locale?: string }) {
  const items =
    locale === "en"
      ? sectors.map((sector) => getLocalizedSectorById(sector.slug, "en"))
      : sectors;
  return (
    <div className="home-sector-marquee is-running">
      <SectorMarquee items={items} />
    </div>
  );
}
