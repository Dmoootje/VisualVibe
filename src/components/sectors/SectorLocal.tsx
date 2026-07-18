import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section, Container } from "@/components/ui";
import type { Region, Sector } from "@/types";
import { SectorSectionHeader } from "./SectorSectionHeader";

/**
 * "Lokale dienstverlening": short local-SEO paragraph plus links to existing
 * regio pages only (resolved Regions are passed in; unknown slugs never reach
 * this component). Deliberately no long list of place names.
 */
export function SectorLocal({
  local,
  regions,
  locale = "nl",
}: {
  local: NonNullable<Sector["localSection"]>;
  regions: Region[];
  locale?: "nl" | "en";
}) {
  return (
    <Section className="py-10 sm:py-14 md:py-16">
      <Container>
        <SectorSectionHeader eyebrow={locale === "en" ? "Regions" : "Regio"} title={local.title} intro={local.text} />
        {regions.length > 0 && (
          <div className="flex flex-wrap gap-2.5">
            {regions.map((region) => (
              <Link
                key={region.slug}
                href={`/regio/${region.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white"
              >
                <MapPin className="h-4 w-4 text-[#FF9A45]" />
                {region.title}
                <ArrowRight className="h-3.5 w-3.5 text-white/40" />
              </Link>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
