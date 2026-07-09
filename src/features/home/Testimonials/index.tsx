"use client";

import {
  TestimonialsBackground,
  TestimonialsHeader,
  TestimonialCard,
  TestimonialsControls,
  QuoteIcon,
} from "./components";
import {
  useTestimonialsCarousel,
  type CarouselTestimonial,
} from "./hooks/useTestimonialsCarousel";
import { testimonialsConfig } from "./config/testimonials.config";

type TestimonialsProps = {
  /** Live Google reviews (server-fetched). Falls back to curated quotes when empty. */
  testimonials?: CarouselTestimonial[];
  /** Link to the Google Maps profile, shown as attribution when reviews are live. */
  sourceUrl?: string;
};

export default function Testimonials({ testimonials, sourceUrl }: TestimonialsProps) {
  const isGoogle = Boolean(testimonials && testimonials.length > 0);
  const items = isGoogle ? testimonials! : testimonialsConfig.testimonials;

  const { current, total, testimonial, next, prev, goTo } =
    useTestimonialsCarousel(items);

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-20 md:py-24 bg-black relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <TestimonialsBackground />

      <div className="container mx-auto px-5 sm:px-6 md:px-8 relative z-10">
        <TestimonialsHeader />

        <div className="relative max-w-6xl mx-auto">
          <QuoteIcon />

          <div
            className="min-h-[400px] flex items-center"
            role="region"
            aria-roledescription="testimonial carousel"
            aria-label="Klantenreviews"
          >
            <TestimonialCard
              testimonial={testimonial}
              current={current}
              total={total}
            />
          </div>

          <TestimonialsControls
            onPrev={prev}
            onNext={next}
            current={current}
            total={total}
            onDotClick={goTo}
          />

          {isGoogle && (
            <p className="mt-6 text-center text-sm text-white/50">
              Reviews via{" "}
              <a
                href={sourceUrl ?? "https://www.google.com/maps"}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-amber-400 hover:underline"
              >
                Google
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
