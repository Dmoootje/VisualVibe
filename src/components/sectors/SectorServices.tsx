import { Section, Container } from "@/components/ui";
import { ServiceGrid } from "@/components/sections";
import type { Service } from "@/types";
import { SectorSectionHeader } from "./SectorSectionHeader";

/** "Aanbevolen diensten" via the existing ServiceGrid (real localized links). */
export function SectorServices({
  title,
  intro,
  services,
}: {
  title?: string;
  intro?: string;
  services: Service[];
}) {
  if (services.length === 0) return null;
  return (
    <Section className="py-10 sm:py-14 md:py-16">
      <Container>
        <SectorSectionHeader eyebrow="Diensten" title={title ?? "Aanbevolen diensten"} intro={intro} />
        <ServiceGrid services={services} />
      </Container>
    </Section>
  );
}
