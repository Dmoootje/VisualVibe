"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { HowItWorksBackground } from "./components";
import { ProcessTabs } from "./components/ProcessTabs";
import { ProcessCard } from "./components/ProcessCard";
import { ProcessPathLine } from "./components/ProcessPathLine";
import { processConfig, processTracks } from "./config/process.config";

export default function HowItWorks() {
  const [activeId, setActiveId] = useState(processTracks[0].id);
  const reduce = useReducedMotion();
  const activeTrack = processTracks.find((t) => t.id === activeId) ?? processTracks[0];

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-24">
      <HowItWorksBackground />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center sm:mb-10"
        >
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl">{processConfig.title}</h2>
          <p className="mx-auto max-w-2xl text-sm text-white/70 sm:text-base md:text-lg">
            {processConfig.subtitle}
          </p>
        </motion.div>

        {/* Track tabs */}
        <ProcessTabs activeId={activeId} onSelect={setActiveId} />

        {/* Animated step cards */}
        <div className="relative">
          <ProcessPathLine />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {activeTrack.steps.map((step, index) => (
                <ProcessCard key={step.number} step={step} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Human-approach reassurance + CTAs */}
        <div className="mt-10 flex flex-col items-center gap-5">
          <p className="flex items-center gap-2 text-center text-sm text-white/60">
            <HeartHandshake className="h-4 w-4 shrink-0 text-amber-400" />
            Bij elk traject houden we het persoonlijk: één aanspreekpunt, duidelijke communicatie en
            begeleiding van begin tot eind.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              className="gap-2 border-0 bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg shadow-amber-500/20 hover:from-red-600 hover:to-amber-600"
            >
              <Link href={processConfig.projectCtaHref}>
                {processConfig.projectCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="gap-2 border-white/15 bg-white/[0.03] text-white hover:border-amber-500/40 hover:bg-amber-500/[0.06] hover:text-white"
            >
              <Link href={activeTrack.href}>Bekijk deze dienst</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
