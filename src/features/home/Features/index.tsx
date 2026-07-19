import {
  FeaturesInteractive,
  FeaturesHeader,
  ServiceTrustRow,
  ExtraServiceChips,
} from "./components";

export default function Features({ locale = "nl" }: { locale?: string }) {
  return (
    <section
      id="features"
      className="home-deferred-section relative py-12 sm:py-16 md:py-24"
    >
      <div className="container mx-auto relative z-10">
        <FeaturesHeader locale={locale} />

        <FeaturesInteractive locale={locale} />

        {/* Shared trust badges + supporting-service chips (under active content) */}
        <ServiceTrustRow locale={locale} />
        <ExtraServiceChips locale={locale} />
      </div>
    </section>
  );
}
