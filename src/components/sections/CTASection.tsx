import { Section, Container } from "@/components/ui";
import { CTABlock } from "./CTABlock";

type CTASectionProps = {
  title: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
};

/**
 * Page-level call-to-action. Renders the animated CTABlock, which surprises the
 * visitor with one of 4 random variants on each load.
 */
export function CTASection({
  title,
  description,
  primaryLabel = "Offerte aanvragen",
  primaryHref = "/offerte-aanvragen",
}: CTASectionProps) {
  return (
    <Section orbs="none" className="py-10 sm:py-12 md:py-16">
      <Container>
        <CTABlock heading={title} description={description} ctaLabel={primaryLabel} href={primaryHref} />
      </Container>
    </Section>
  );
}
