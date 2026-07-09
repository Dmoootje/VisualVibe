import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type FaqItem = {
  question: string;
  answer: React.ReactNode;
  /** Plain-text answer for FAQPage JSON-LD (falls back to `answer` when it's a string). */
  plainAnswer?: string;
};

/**
 * Question-phrased FAQ accordion - a core GEO/AEO pattern. Emits FAQPage
 * JSON-LD by default so answer engines can parse the Q&A directly.
 */
export function FaqAccordion({
  items,
  withSchema = true,
  className,
}: {
  items: FaqItem[];
  withSchema?: boolean;
  className?: string;
}) {
  const schemaItems = items
    .map((item) => {
      const text = item.plainAnswer ?? (typeof item.answer === "string" ? item.answer : null);
      return text ? { question: item.question, answer: text } : null;
    })
    .filter((x): x is { question: string; answer: string } => x !== null);

  return (
    <div className={cn("my-6", className)}>
      {withSchema && schemaItems.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: schemaItems.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
      )}

      <Accordion type="single" collapsible className="space-y-3">
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 backdrop-blur-sm transition-colors data-[state=open]:border-amber-500/30 data-[state=open]:bg-amber-500/[0.04]"
          >
            <AccordionTrigger className="py-4 text-left text-base font-semibold text-white hover:no-underline [&>svg]:text-amber-400">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm leading-relaxed text-white/75 [&_a]:text-amber-400 [&_a:hover]:underline [&_strong]:text-white">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
