import { Section, Container } from "@/components/ui";
import { ProcessSteps } from "@/components/sections";
import type { ServiceProcessStep } from "@/types";
import { SectorSectionHeader } from "./SectorSectionHeader";

/** "Werkwijze": the homepage/service step-card design, 4-across on desktop. */
export function SectorProcess({
  title,
  steps,
}: {
  title?: string;
  steps: ServiceProcessStep[];
}) {
  if (steps.length === 0) return null;
  return (
    <Section className="py-10 sm:py-14 md:py-16">
      <Container>
        <SectorSectionHeader eyebrow="Werkwijze" title={title ?? "Zo werken we"} />
        <ProcessSteps steps={steps} />
      </Container>
    </Section>
  );
}
