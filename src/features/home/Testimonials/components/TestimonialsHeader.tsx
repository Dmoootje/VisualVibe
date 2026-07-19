import { testimonialsConfig, testimonialsConfigEn } from "../config/testimonials.config";

export function TestimonialsHeader({ locale = "nl" }: { locale?: string }) {
  const copy = locale === "en" ? testimonialsConfigEn : testimonialsConfig;
  return (
    <div className="home-reveal-up text-center mb-8 sm:mb-12 md:mb-16">
      <h2
        id="testimonials-heading"
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
      >
        {copy.title}
      </h2>
      <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
        {copy.subtitle}
      </p>
    </div>
  );
}
