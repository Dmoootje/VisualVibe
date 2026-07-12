import { Section, Container } from "@/components/ui";
import type { WebdesignProject } from "@/data/webdesignShowcase";
import type { WebdesignImages } from "@/lib/firestore/webdesignImages";
import { SectorSectionHeader } from "./SectorSectionHeader";
import { SectorWebdesignCards } from "./SectorWebdesignCards";

/** Real webdesign cases for this sector; cards open the RealisatieModal popup. */
export function SectorCases({
  title,
  intro,
  projects,
  images,
}: {
  title?: string;
  intro?: string;
  projects: WebdesignProject[];
  images: WebdesignImages;
}) {
  if (projects.length === 0) return null;
  return (
    <Section className="py-10 sm:py-14 md:py-16">
      <Container>
        <SectorSectionHeader eyebrow="Webdesign" title={title ?? "Uitgelichte webdesignprojecten"} intro={intro} />
        <SectorWebdesignCards projects={projects} images={images} />
      </Container>
    </Section>
  );
}
