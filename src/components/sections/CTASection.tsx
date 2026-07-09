import { ArrowRight } from "lucide-react";
import { Section, Container, GlowCard, NeonButton } from "@/components/ui";

type CTASectionProps = {
  title: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function CTASection({
  title,
  description,
  primaryLabel = "Offerte aanvragen",
  primaryHref = "/offerte-aanvragen",
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <Section orbs="radial" className="py-10 sm:py-12 md:py-16">
      <Container>
        <GlowCard size="lg" className="p-6 sm:p-10 md:p-12 text-center flex flex-col items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
          {description && <p className="max-w-xl text-white/70">{description}</p>}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <NeonButton href={primaryHref}>
              <span className="inline-flex items-center">
                {primaryLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </NeonButton>
            {secondaryLabel && secondaryHref && (
              <NeonButton href={secondaryHref} variant="outline">
                {secondaryLabel}
              </NeonButton>
            )}
          </div>
        </GlowCard>
      </Container>
    </Section>
  );
}
