"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestimonialsControlsProps {
  onPrev: () => void;
  onNext: () => void;
  current: number;
  total: number;
  onDotClick: (index: number) => void;
}

export function TestimonialsControls({
  onPrev,
  onNext,
  current,
  total,
  onDotClick,
}: TestimonialsControlsProps) {
  return (
    <>
      <div
        className="flex justify-center mt-6 sm:mt-8 gap-3 sm:gap-4"
        aria-label="Testimonial navigation"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={onPrev}
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-white/10 hover:bg-white/10 focus:ring-2 focus:ring-white focus:outline-none"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-white/10 hover:bg-white/10 focus:ring-2 focus:ring-white focus:outline-none"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </Button>
      </div>

      <TestimonialsDots
        current={current}
        total={total}
        onDotClick={onDotClick}
      />
    </>
  );
}

function TestimonialsDots({
  current,
  total,
  onDotClick,
}: {
  current: number;
  total: number;
  onDotClick: (index: number) => void;
}) {
  return (
    <div className="flex justify-center mt-4 sm:mt-6">
      {[...Array(total)].map((_, idx) => (
        <button
          key={idx}
          onClick={() => onDotClick(idx)}
          className="group flex h-6 w-6 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={`Go to testimonial ${idx + 1}`}
          aria-current={current === idx ? "true" : "false"}
        >
          <span
            className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-colors ${
              current === idx
                ? "bg-gradient-to-r from-red-500 to-amber-500"
                : "bg-white/20 group-hover:bg-white/40"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
