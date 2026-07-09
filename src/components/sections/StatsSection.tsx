"use client";

import { motion } from "framer-motion";
import { Section, Container } from "@/components/ui";

export type Stat = {
  value: string;
  label: string;
};

type StatsSectionProps = {
  stats: Stat[];
  title?: string;
  subtitle?: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/** Preserved from the original template's SocialProof/StatsGrid - generalized
 * with real props instead of a fixed config, not yet wired to any page. */
export function StatsSection({ stats, title, subtitle }: StatsSectionProps) {
  return (
    <Section orbs="tl-br">
      <Container>
        {(title || subtitle) && (
          <div className="text-center mb-10 sm:mb-12">
            {title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">{title}</h2>}
            {subtitle && <p className="text-white/70 max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}

        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 auto-rows-fr"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          aria-label="Statistieken"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <motion.div className="text-center h-full" variants={itemVariants}>
      <div className="relative group h-full">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-amber-500 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300" />
        <div className="relative bg-black/70 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/10 h-full flex flex-col justify-center">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent mb-1 sm:mb-2 truncate">
            {stat.value}
          </div>
          <p className="text-white/70 text-sm sm:text-base truncate">{stat.label}</p>
        </div>
      </div>
    </motion.div>
  );
}
