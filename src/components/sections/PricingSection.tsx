"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Section, Container, NeonButton } from "@/components/ui";

export type PricingPlan = {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  cta: string;
  ctaHref: string;
  features: string[];
};

type PricingSectionProps = {
  plans: PricingPlan[];
  title?: string;
  subtitle?: string;
  trialInfo?: string;
  showToggle?: boolean;
  annualDiscountLabel?: string;
};

/** Preserved from the original template's Pricing feature — generalized with
 * real props instead of a fixed config, not yet wired to any page (the
 * quote-based "Offerte aanvragen" model may replace fixed tiers, or this may
 * become a service-package page — decide before using). */
export function PricingSection({
  plans,
  title = "Tarieven",
  subtitle,
  trialInfo,
  showToggle = true,
  annualDiscountLabel = "Bespaar 20%",
}: PricingSectionProps) {
  const [annual, setAnnual] = useState(true);

  return (
    <Section orbs="tl-br">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{title}</h2>
          {subtitle && <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">{subtitle}</p>}

          {showToggle && <BillingToggle annual={annual} setAnnual={setAnnual} discountLabel={annualDiscountLabel} />}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} annual={annual} />
          ))}
        </div>

        {trialInfo && (
          <div className="mt-10 sm:mt-16 text-center">
            <p className="text-white/70 text-sm sm:text-base">{trialInfo}</p>
          </div>
        )}
      </Container>
    </Section>
  );
}

function BillingToggle({
  annual,
  setAnnual,
  discountLabel,
}: {
  annual: boolean;
  setAnnual: (value: boolean) => void;
  discountLabel: string;
}) {
  return (
    <div className="relative flex items-center justify-center mt-6 sm:mt-8">
      <fieldset className="bg-white/5 backdrop-blur-sm border border-white/10 p-1 rounded-full">
        <legend className="sr-only">Facturatiefrequentie</legend>
        <div className="relative flex">
          <button
            onClick={() => setAnnual(true)}
            className={`relative z-10 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
              annual ? "text-white" : "text-white/70"
            }`}
            aria-pressed={annual}
          >
            Jaarlijks
          </button>
          <button
            onClick={() => setAnnual(false)}
            className={`relative z-10 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
              !annual ? "text-white" : "text-white/70"
            }`}
            aria-pressed={!annual}
          >
            Maandelijks
          </button>
          <div
            className={`absolute top-1 left-1 ${
              annual ? "w-[calc(50%-12px)]" : "w-[calc(50%-3px)]"
            } h-[calc(100%-8px)] bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-transform duration-300 ${
              annual ? "transform translate-x-0" : "transform translate-x-full"
            }`}
          />
        </div>
      </fieldset>

      {annual && (
        <div className="absolute sm:relative -bottom-8 sm:bottom-auto ml-3 bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {discountLabel}
        </div>
      )}
    </div>
  );
}

function PricingCard({ plan, index, annual }: { plan: PricingPlan; index: number; annual: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
      role="listitem"
    >
      {plan.popular && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <div className="bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full z-50">
            Populairste keuze
          </div>
        </div>
      )}

      <div
        className={`h-full bg-white/5 backdrop-blur-sm border rounded-2xl overflow-hidden transition-transform ${
          plan.popular ? "border-amber-500" : "border-white/10"
        }`}
      >
        <div className="p-5 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
          <p className="text-white/70 text-sm mb-5 sm:mb-6">{plan.description}</p>

          <div className="flex items-baseline mb-5 sm:mb-6">
            <span className="text-2xl sm:text-4xl font-bold">
              &euro;{annual ? plan.annualPrice : plan.monthlyPrice}
            </span>
            <span className="text-white/70 ml-2 text-sm">/{annual ? "jaar" : "maand"}</span>
          </div>

          <NeonButton
            href={plan.ctaHref}
            variant={plan.popular ? "primary" : "outline"}
            className="w-full mb-6 sm:mb-8 justify-center"
          >
            {plan.cta}
          </NeonButton>

          <ul className="space-y-3 sm:space-y-4">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 sm:gap-3">
                <div className="flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </div>
                <span className="text-white/80 text-sm sm:text-base">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
