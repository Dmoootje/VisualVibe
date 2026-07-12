import { AlertCircle } from "lucide-react";
import { Section, Container } from "@/components/ui";
import type { SectorHighlight } from "@/types";
import { SectorSectionHeader } from "./SectorSectionHeader";

/**
 * "Herkenbare uitdagingen": expanded title+text cards when the sector provides
 * them; otherwise the original compact checklist from the plain painPoints, so
 * every sector keeps a working section without invented copy.
 */
export function SectorChallenges({
  intro,
  expanded,
  simple,
}: {
  intro?: string;
  expanded?: SectorHighlight[];
  simple: string[];
}) {
  const hasExpanded = Boolean(expanded && expanded.length > 0);
  if (!hasExpanded && simple.length === 0) return null;

  return (
    <Section className="py-10 sm:py-14 md:py-16">
      <Container>
        <SectorSectionHeader eyebrow="Uitdagingen" title="Herkenbare uitdagingen" intro={intro} />

        {hasExpanded ? (
          <div className="grid gap-[18px] sm:grid-cols-2">
            {expanded!.map((point) => (
              <div
                key={point.title}
                className="flex items-start gap-4 rounded-[17px] border border-white/[0.09] bg-white/[0.02] p-5"
              >
                <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-[9px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)]">
                  <AlertCircle className="h-4 w-4 text-[#FF9A45]" />
                </span>
                <div>
                  <h3 className="text-[15px] font-bold text-white">{point.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/60">{point.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {simple.map((point) => (
              <li key={point} className="flex items-start gap-2 text-white/80">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                {point}
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
