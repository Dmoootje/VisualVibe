import { Section, Container } from "@/components/ui";
import type { Sector } from "@/types";

/**
 * Answer-first intro (AEO/GEO): a direct-answer paragraph right under the
 * marquee, followed by the sector's highlight blocks. Fully server-rendered.
 */
export function SectorAnswerIntro({ answer }: { answer: NonNullable<Sector["answerIntro"]> }) {
  return (
    <Section className="py-10 sm:py-14 md:py-16">
      <Container>
        <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
          <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
          In het kort
        </p>
        <h2 className="text-2xl font-bold sm:text-3xl">{answer.title}</h2>
        <p className="mt-5 max-w-3xl text-[16.5px] leading-[1.7] text-white/70">{answer.text}</p>

        {answer.highlights.length > 0 && (
          <div className="mt-10 grid gap-[18px] md:grid-cols-3">
            {answer.highlights.map((highlight, i) => (
              <div
                key={highlight.title}
                className="rounded-[17px] border border-white/[0.09] bg-white/[0.02] p-6"
              >
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] font-mono text-xs font-bold text-[#FF9A45]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-2 text-[16px] font-bold text-white">{highlight.title}</h3>
                <p className="text-[14px] leading-relaxed text-white/60">{highlight.text}</p>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
