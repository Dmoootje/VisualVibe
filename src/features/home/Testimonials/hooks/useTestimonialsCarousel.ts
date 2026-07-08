import { useState, useEffect } from "react";

export type CarouselTestimonial = {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
};

export function useTestimonialsCarousel(items: CarouselTestimonial[]) {
    const [current, setCurrent] = useState(0);
    const [autoplay, setAutoplay] = useState(true);
    const total = items.length;

    useEffect(() => {
        if (!autoplay || total === 0) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % total);
        }, 5000);

        return () => clearInterval(interval);
    }, [autoplay, total]);

    const next = () => {
        setAutoplay(false);
        setCurrent((prev) => (prev + 1) % total);
    };

    const prev = () => {
        setAutoplay(false);
        setCurrent((prev) => (prev - 1 + total) % total);
    };

    const goTo = (index: number) => {
        setAutoplay(false);
        setCurrent(index);
    };

    const testimonial = items[current];

    return {
        current,
        total,
        testimonial,
        next,
        prev,
        goTo,
    };
}
