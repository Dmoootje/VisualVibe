"use client";

import { QuoteIcon } from "./QuoteIcon";
import { TestimonialCard } from "./TestimonialCard";
import { TestimonialsControls } from "./TestimonialsControls";
import {
  useTestimonialsCarousel,
  type CarouselTestimonial,
} from "../hooks/useTestimonialsCarousel";
import { testimonialsConfig, testimonialsConfigEn } from "../config/testimonials.config";

export function TestimonialsCarousel({
  testimonials,
  locale = "nl",
}: {
  testimonials?: CarouselTestimonial[];
  locale?: string;
}) {
  const fallback = locale === "en" ? testimonialsConfigEn : testimonialsConfig;
  const items = testimonials && testimonials.length > 0
    ? testimonials
    : fallback.testimonials;
  const { current, total, testimonial, next, prev, goTo, rootRef } =
    useTestimonialsCarousel(items);

  return (
    <>
      <QuoteIcon />
      <div
        ref={rootRef}
        className="min-h-[400px] flex items-center"
        role="region"
        aria-roledescription="testimonial carousel"
        aria-label={locale === "en" ? "Customer reviews" : "Klantenreviews"}
      >
        <TestimonialCard testimonial={testimonial} current={current} total={total} />
      </div>
      <TestimonialsControls
        onPrev={prev}
        onNext={next}
        current={current}
        total={total}
        onDotClick={goTo}
      />
    </>
  );
}
