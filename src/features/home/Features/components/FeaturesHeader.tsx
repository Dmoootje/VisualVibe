import { featuresConfig, featuresConfigEn } from "../config/features.config";

export function FeaturesHeader({ locale = "nl" }: { locale?: string }) {
  const copy = locale === "en" ? featuresConfigEn : featuresConfig;
  return (
    <div className="home-reveal-up text-center mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
        {copy.title}
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto">
        {copy.subtitle}
      </p>
    </div>
  );
}
