import Image from "next/image";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  current: number;
  total: number;
}

export function TestimonialCard({
  testimonial,
  current,
  total,
}: TestimonialCardProps) {
  return (
    <div
      key={current}
      className="home-testimonial-swap rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm max-sm:backdrop-blur-none sm:p-8 md:p-12"
      aria-live="polite"
      role="group"
      aria-roledescription="slide"
      aria-label={`Testimonial ${current + 1} of ${total}`}
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
        <TestimonialAuthor testimonial={testimonial} />
        <TestimonialQuote quote={testimonial.quote} />
      </div>
    </div>
  );
}

function TestimonialAuthor({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="md:w-1/3 w-full">
      <div className="relative max-w-[160px] mx-auto">
        <div
          className="home-mobile-glow absolute -inset-1 rounded-full bg-gradient-to-r from-red-500 to-amber-500 blur-sm"
          aria-hidden="true"
        ></div>
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 mx-auto">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={`Foto van ${testimonial.author}`}
              fill
              sizes="96px"
              className="object-cover rounded-full"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-amber-500 text-2xl font-bold text-white"
              aria-hidden="true"
            >
              {testimonial.author.trim().charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="font-bold">{testimonial.author}</p>
        <p className="text-white/70 text-sm">{testimonial.role}</p>
        <StarRating rating={testimonial.rating} />
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex justify-center mt-2"
      role="img"
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      {[...Array(rating)].map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-current"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

/** Keeps at most `max` sentences and appends an ellipsis when the quote is cut. */
function truncateSentences(text: string, max = 3): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length <= max) return text.trim();
  return sentences.slice(0, max).join("").replace(/[.!?\s]+$/, "").trim() + "...";
}

function TestimonialQuote({ quote }: { quote: string }) {
  return (
    <div className="md:w-2/3 w-full">
      <p className="text-base sm:text-lg md:text-xl italic mb-4 sm:mb-6 text-center md:text-left">
        "{truncateSentences(quote)}"
      </p>
      <div
        className="h-px w-16 bg-gradient-to-r from-red-500 to-amber-500 mx-auto md:mx-0"
        aria-hidden="true"
      ></div>
    </div>
  );
}
