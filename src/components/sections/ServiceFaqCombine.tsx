import type { ComponentType } from "react";
import {
  ArrowRight,
  Monitor,
  Search,
  Camera,
  Video,
  Plane,
  Box,
  Mic,
  GraduationCap,
  type LucideProps,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Service, ServiceFaq } from "@/types";
import { serviceHrefBySlug } from "@/data/services";
import { serviceCategories } from "@/data/serviceCategories";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const ICONS: Record<string, ComponentType<LucideProps>> = {
  Monitor,
  Search,
  Camera,
  Video,
  Plane,
  Box,
  Mic,
  GraduationCap,
};

function iconForSlug(slug: string): ComponentType<LucideProps> {
  const category = serviceCategories.find((c) => c.slug === slug);
  return (category && ICONS[category.iconName]) || Monitor;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
      <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#FF9A45]" />
      {children}
    </p>
  );
}

const H2 = "font-sora text-[28px] font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[34px]";

/** The "Combineer <x> met" column: related services as iconed hover-cards. */
function CombineColumn({ combineWith, relatedServices }: { combineWith: string; relatedServices: Service[] }) {
  return (
    <div>
      <Eyebrow>Meer diensten</Eyebrow>
      <h2 className={H2}>Combineer {combineWith} met</h2>
      <div className="mt-7 flex flex-col gap-3.5">
        {relatedServices.map((related, i) => {
          const Icon = iconForSlug(related.slug);
          return (
            <Link
              key={related.slug}
              href={serviceHrefBySlug(related.slug)}
              style={{ ["--i" as string]: i } as React.CSSProperties}
              className="vvw-caseRow vg-ovrow flex items-center gap-4 rounded-[14px] border border-white/[0.08] bg-white/[0.02] px-[22px] py-5"
            >
              <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[11px] border border-[rgba(255,122,0,0.22)] bg-[rgba(255,122,0,0.1)] text-[#FF9A45]">
                <Icon className="h-[21px] w-[21px]" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-sora block text-base font-bold text-white">{related.title}</span>
                <span className="mt-1 block text-[13.5px] leading-[1.5] text-white/55">{related.excerpt}</span>
              </span>
              <span className="vg-ovar flex-none text-white/40">
                <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/** The FAQ column: eyebrow + heading + accordion. */
function FaqColumn({ faqs, faqHeading }: { faqs: ServiceFaq[]; faqHeading: string }) {
  return (
    <div>
      <Eyebrow>FAQ</Eyebrow>
      <h2 className={`${H2} mb-7`}>{faqHeading}</h2>
      <Accordion type="single" collapsible>
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent className="text-white/70">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

/**
 * Combined FAQ + "Combineer <x> met" section: the FAQ accordion on the left and
 * the related services as iconed hover-cards on the right, so the two fill one
 * equally-wide `.container` row (no more empty space beside a short FAQ). Falls
 * back to a single column when only one side has content.
 */
export function ServiceFaqCombine({
  faqs,
  faqHeading = "Veelgestelde vragen",
  combineWith,
  relatedServices,
}: {
  faqs: ServiceFaq[];
  faqHeading?: string;
  combineWith: string;
  relatedServices: Service[];
}) {
  const hasFaqs = faqs.length > 0;
  const hasRelated = relatedServices.length > 0;
  if (!hasFaqs && !hasRelated) return null;

  return (
    <section className="relative py-14 sm:py-16">
      {hasFaqs && hasRelated ? (
        <div className="container mx-auto grid items-start gap-10 px-2.5 sm:px-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <FaqColumn faqs={faqs} faqHeading={faqHeading} />
          <CombineColumn combineWith={combineWith} relatedServices={relatedServices} />
        </div>
      ) : (
        <div className="container mx-auto max-w-[720px] px-2.5 sm:px-4">
          {hasFaqs ? (
            <FaqColumn faqs={faqs} faqHeading={faqHeading} />
          ) : (
            <CombineColumn combineWith={combineWith} relatedServices={relatedServices} />
          )}
        </div>
      )}
    </section>
  );
}
