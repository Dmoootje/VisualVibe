import { Section, Container } from "@/components/ui";
import { cn } from "@/lib/utils";
import { CTABlock } from "./CTABlock";

type CTASectionProps = {
  title: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  className?: string;
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
  className,
}: CTASectionProps) {
  return (
    <Section orbs="none" className={cn("py-10 sm:py-12 md:py-16", className)}>
      <Container>
        <CTABlock heading={title} description={description} ctaLabel={primaryLabel} href={primaryHref} />
      </Container>
    </Section>
  );
}
