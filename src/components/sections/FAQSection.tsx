"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Section, Container, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui";

export type FaqEntry = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  title?: string;
  subtitle?: string;
  items: FaqEntry[];
  contactText?: string;
  contactLabel?: string;
  contactHref?: string;
};

/** Preserved from the original template's Faq feature — generalized with real
 * props instead of a fixed config, not yet wired to any page. */
export function FAQSection({
  title = "Veelgestelde vragen",
  subtitle,
  items,
  contactText = "Nog vragen?",
  contactLabel = "Neem contact op",
  contactHref = "/contact",
}: FAQSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Section orbs="tr-bl">
      <Container>
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">{title}</h2>
          {subtitle && <p className="text-white/70 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg font-medium hover:no-underline hover:bg-white/5 text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-white/70">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-8 sm:mt-10 md:mt-12"
        >
          <p className="text-sm sm:text-base text-white/70">
            {contactText}{" "}
            <Link href={contactHref} className="text-amber-400 hover:text-amber-300 underline underline-offset-2">
              {contactLabel}
            </Link>
          </p>
        </motion.div>
      </Container>
    </Section>
  );
}
