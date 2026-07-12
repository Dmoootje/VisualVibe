import { Section, Container } from "@/components/ui";
import type { FotoGallery } from "@/data/fotografieGalleries";
import { SectorSectionHeader } from "./SectorSectionHeader";
import { SectorGalleryCards } from "./SectorGalleryCards";

/** Real fotogalerijen for this sector; tiles open the shared Lightbox popup. */
export function SectorRealisations({
  title,
  intro,
  galleries,
}: {
  title?: string;
  intro?: string;
  galleries: FotoGallery[];
}) {
  if (galleries.length === 0) return null;
  return (
    <Section className="py-10 sm:py-14 md:py-16">
      <Container>
        <SectorSectionHeader eyebrow="Fotografie" title={title ?? "Realisaties in beeld"} intro={intro} />
        <SectorGalleryCards galleries={galleries} />
      </Container>
    </Section>
  );
}
