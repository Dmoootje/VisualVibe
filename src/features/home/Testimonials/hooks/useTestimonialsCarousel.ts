import { useEffect, useRef, useState } from "react";

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
    const [inView, setInView] = useState(false);
    const [pageVisible, setPageVisible] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(true);
    const rootRef = useRef<HTMLElement>(null);
    const total = items.length;

    useEffect(() => {
        const root = rootRef.current;
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        const updatePageVisibility = () => setPageVisible(document.visibilityState === "visible");
        const updateMotionPreference = () => setReduceMotion(motionQuery.matches);

        updatePageVisibility();
        updateMotionPreference();

        const observer = root && "IntersectionObserver" in window
            ? new IntersectionObserver(
                ([entry]) => setInView(entry.isIntersecting),
                { threshold: 0.15 }
            )
            : null;

        if (root && observer) observer.observe(root);
        if (!observer) setInView(true);
        document.addEventListener("visibilitychange", updatePageVisibility);
        motionQuery.addEventListener("change", updateMotionPreference);

        return () => {
            observer?.disconnect();
            document.removeEventListener("visibilitychange", updatePageVisibility);
            motionQuery.removeEventListener("change", updateMotionPreference);
        };
    }, []);

    useEffect(() => {
        if (!autoplay || !inView || !pageVisible || reduceMotion || total <= 1) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % total);
        }, 5000);

        return () => clearInterval(interval);
    }, [autoplay, inView, pageVisible, reduceMotion, total]);

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
        rootRef,
    };
}
