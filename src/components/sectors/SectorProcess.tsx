import { Section, Container } from "@/components/ui";
import { ProcessSteps } from "@/components/sections";
import type { ServiceProcessStep } from "@/types";
import { SectorSectionHeader } from "./SectorSectionHeader";

/** "Werkwijze": the homepage/service step-card design, 4-across on desktop. */
export function SectorProcess({
  title,
  steps,
  locale = "nl",
}: {
  title?: string;
  steps: ServiceProcessStep[];
  locale?: "nl" | "en";
}) {
  if (steps.length === 0) return null;
  return (
    <Section className="py-10 sm:py-14 md:py-16">
      <Container>
        <SectorSectionHeader eyebrow={locale === "en" ? "Our approach" : "Werkwijze"} title={title ?? (locale === "en" ? "How we work" : "Zo werken we")} />
        <ProcessSteps steps={steps} />
      </Container>
    </Section>
  );
}
