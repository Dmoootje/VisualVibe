import { TestimonialsCarousel } from "./components/TestimonialsCarousel";
import { TestimonialsHeader } from "./components/TestimonialsHeader";
import type { CarouselTestimonial } from "./hooks/useTestimonialsCarousel";

type TestimonialsProps = {
  testimonials?: CarouselTestimonial[];
  sourceUrl?: string;
};

export default function Testimonials({ testimonials, sourceUrl }: TestimonialsProps) {
  const isGoogle = Boolean(testimonials && testimonials.length > 0);

  return (
    <section
      id="testimonials"
      className="home-deferred-section relative overflow-hidden py-16 sm:py-20 md:py-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-2.5 sm:px-4 relative z-10">
        <TestimonialsHeader />
        <div className="relative max-w-6xl mx-auto">
          <TestimonialsCarousel testimonials={testimonials} />
          {isGoogle && (
            <p className="mt-6 text-center text-sm text-white/65">
              Reviews via{" "}
              <a
                href={sourceUrl ?? "https://www.google.com/maps"}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
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
