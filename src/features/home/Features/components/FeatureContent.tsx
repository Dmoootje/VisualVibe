"use client";

import { motion } from "framer-motion";
import { ArrowRight, Route, HeartHandshake } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { featuresConfig, type Feature } from "../config/features.config";
import { ServiceFeatureList } from "./ServiceFeatureList";
import { ServiceMiniBlock } from "./ServiceMiniBlock";
import { ServiceImageCard } from "./ServiceImageCard";

interface FeatureContentProps {
  contentStyle: React.CSSProperties;
}

export function FeatureContent({ contentStyle }: FeatureContentProps) {
  return (
    <div style={contentStyle} className="relative">
      {featuresConfig.features.map((feature) => (
        <TabsContent
          key={feature.id}
          value={feature.id}
          id={`${feature.id}-content`}
          className="scroll-mt-20 focus-visible:outline-none focus-visible:ring-0"
        >
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
            <FeatureDescription feature={feature} />
            <ServiceImageCard
              image={feature.image}
              title={feature.title}
              badge={feature.imageBadge}
              highlight={feature.highlight}
            />
          </div>
        </TabsContent>
      ))}
    </div>
  );
}

function FeatureDescription({ feature }: { feature: Feature }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image first on mobile */}
      <div className="mb-6 md:hidden">
        <ServiceImageCard
          image={feature.image}
          title={feature.title}
          badge={feature.imageBadge}
          highlight={feature.highlight}
          mobile
        />
      </div>

      {/* Eyebrow badge */}
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-amber-300">
        {feature.eyebrow}
      </span>

      <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">{feature.headline}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">{feature.description}</p>

      <div className="mt-5">
        <ServiceFeatureList items={feature.benefits} />
      </div>

      {/* Approach + human-touch mini blocks */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ServiceMiniBlock
          icon={<Route className="h-3.5 w-3.5" />}
          label="Onze aanpak"
          text={feature.approach}
        />
        <ServiceMiniBlock
          icon={<HeartHandshake className="h-3.5 w-3.5" />}
          label="Menselijke aanpak"
          text={feature.human}
          accent
        />
      </div>

      {/* CTAs */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          asChild
          className="gap-2 border-0 bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg shadow-amber-500/20 hover:from-red-600 hover:to-amber-600"
        >
          <Link href="/contact">
            Bespreek je project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="gap-2 border-white/15 bg-white/[0.03] text-white hover:border-amber-500/40 hover:bg-amber-500/[0.06] hover:text-white"
        >
          <Link href={feature.href}>Bekijk dienst</Link>
        </Button>
      </div>
    </motion.div>
  );
}
