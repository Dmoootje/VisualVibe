"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ProcessStep } from "../config/process.config";

/**
 * A single process step: a neon/gradient visual header (no image file, per the
 * "no content images in repo" rule) carrying the number badge, ghost number and
 * a small icon, with the title + text below. Cards stretch to equal height.
 */
export function ProcessCard({ step, index }: { step: ProcessStep; index: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.4, delay: reduce ? 0 : index * 0.08, ease: "easeOut" }}
      className="group relative h-full"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-[0_18px_50px_-18px_rgba(255,117,0,0.55)]">
        {/* Neon visual header */}
        <div className="relative h-28 overflow-hidden sm:h-32">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_30%,rgba(255,117,0,0.24),transparent_62%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
          {/* Faint grid */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          {/* Ghost number */}
          <span className="pointer-events-none absolute -top-3 right-1 text-7xl font-black leading-none text-white/[0.06]">
            {step.number}
          </span>
          {/* Number badge */}
          <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-amber-500 text-base font-bold text-white shadow-lg shadow-amber-500/30">
            {step.number}
          </span>
          {/* Step icon */}
          <span className="absolute bottom-3 right-4 text-amber-300/80 transition-transform duration-300 group-hover:scale-110">
            {step.icon}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-base font-semibold text-white sm:text-lg">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/65">{step.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
