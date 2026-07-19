import { CtaCard } from "./components";

export default function Cta({ locale = "nl" }: { locale?: string }) {
  return (
    <section className="home-deferred-section relative overflow-hidden py-16 pb-20 sm:py-16 md:py-24">
      <div className="container mx-auto px-2.5 sm:px-4 relative z-10">
        <CtaCard locale={locale} />
      </div>
    </section>
  );
}
