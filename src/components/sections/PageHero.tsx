import { Link } from "@/i18n/navigation";
import { Section, Container, Badge } from "@/components/ui";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  backLink?: { label: string; href: string };
};

export function PageHero({ title, subtitle, eyebrow, backLink }: PageHeroProps) {
  return (
    <Section variant="pageHero">
      <Container>
        {backLink && (
          <Link
            href={backLink.href}
            className="inline-block mb-4 text-sm text-white/50 hover:text-white transition-colors"
          >
            &larr; {backLink.label}
          </Link>
        )}
        {eyebrow && <Badge className="mb-4">{eyebrow}</Badge>}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 max-w-3xl">{title}</h1>
        {subtitle && <p className="text-lg text-white/70 max-w-2xl">{subtitle}</p>}
      </Container>
    </Section>
  );
}
