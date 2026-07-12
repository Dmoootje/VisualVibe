import { Section, Container } from "@/components/ui";
import type { VideoItem } from "@/lib/youtube";
import { SectorSectionHeader } from "./SectorSectionHeader";
import { SectorVideoCards } from "./SectorVideoCards";

/** Curated video/drone projects; cards open the VideoLightbox popup player. */
export function SectorMediaProjects({
  title,
  intro,
  videos,
}: {
  title?: string;
  intro?: string;
  videos: VideoItem[];
}) {
  if (videos.length === 0) return null;
  return (
    <Section className="py-10 sm:py-14 md:py-16">
      <Container>
        <SectorSectionHeader eyebrow="Video & drone" title={title ?? "Video en dronebeelden"} intro={intro} />
        <SectorVideoCards videos={videos} />
      </Container>
    </Section>
  );
}
