import { ChevronDown } from "lucide-react";
import { Section, Container } from "@/components/ui";
import type { ServiceFaq } from "@/types";
import { SectorSectionHeader } from "./SectorSectionHeader";

/**
 * Server-rendered FAQ using native <details>/<summary>: every answer is present
 * in the HTML without JavaScript (AEO requirement), keyboard-accessible by
 * default. The same items array feeds FaqPageJsonLd on the page, so structured
 * data always matches the visible content. Centered narrow reading column
 * (allowed exception to the shared left edge).
 */
export function SectorFaq({ title, items, locale = "nl" }: { title?: string; items: ServiceFaq[]; locale?: "nl" | "en" }) {
  if (items.length === 0) return null;
  return (
    <Section className="py-10 sm:py-14 md:py-16">
      <Container>
        <div className="mx-auto max-w-[840px]">
          <SectorSectionHeader eyebrow="FAQ" title={title ?? (locale === "en" ? "Frequently asked questions" : "Veelgestelde vragen")} />
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <details
                key={item.question}
                className="group rounded-[15px] border border-white/[0.09] bg-white/[0.02] transition-colors open:border-[rgba(255,122,0,0.25)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[15px] font-bold text-white">{item.question}</h3>
                  <ChevronDown
                    aria-hidden="true"
                    className="h-4 w-4 flex-none text-[#FF9A45] transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-white/65">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
