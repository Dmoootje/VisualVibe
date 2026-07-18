"use client";

import { QuoteIcon } from "./QuoteIcon";
import { TestimonialCard } from "./TestimonialCard";
import { TestimonialsControls } from "./TestimonialsControls";
import {
  useTestimonialsCarousel,
  type CarouselTestimonial,
} from "../hooks/useTestimonialsCarousel";
import { testimonialsConfig } from "../config/testimonials.config";

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials?: CarouselTestimonial[];
}) {
  const items = testimonials && testimonials.length > 0
    ? testimonials
    : testimonialsConfig.testimonials;
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
        aria-label="Klantenreviews"
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
