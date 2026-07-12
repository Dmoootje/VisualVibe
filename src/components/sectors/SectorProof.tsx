import { Check } from "lucide-react";
import { Section, Container } from "@/components/ui";
import type { SectorHighlight } from "@/types";
import { SectorSectionHeader } from "./SectorSectionHeader";

/**
 * "Waarom VisualVibe": compact check-rows (no wall of identical icon cards).
 * Copy comes from the sector data only - no invented numbers or quotes.
 */
export function SectorProof({
  title,
  points,
}: {
  title?: string;
  points: SectorHighlight[];
}) {
  if (points.length === 0) return null;
  return (
    <Section className="py-10 sm:py-14 md:py-16">
      <Container>
        <SectorSectionHeader eyebrow="Waarom VisualVibe" title={title ?? "Waarom kiezen voor VisualVibe"} />
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {points.map((point) => (
            <div key={point.title} className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-[26px] w-[26px] flex-none items-center justify-center rounded-[8px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.14)]">
                <Check className="h-3.5 w-3.5 text-[#FF9A45]" strokeWidth={3} />
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-white">{point.title}</h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-white/60">{point.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
