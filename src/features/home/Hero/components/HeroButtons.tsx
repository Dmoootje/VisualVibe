"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { heroConfig } from "../config/hero.config";
import { siteConfig } from "@/config";

export function HeroButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col max-w-[80%] mx-auto sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
    >
      <Button
        asChild
        className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white border-0 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
      >
        <Link href={siteConfig.ctaHref}>
          {heroConfig.primaryCta}
          <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="border-white/20 text-white hover:bg-white/10 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
      >
        <Link href="/diensten">{heroConfig.secondaryCta}</Link>
      </Button>
    </motion.div>
  );
}
