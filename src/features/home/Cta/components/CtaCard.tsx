import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { ctaConfig } from "../config/cta.config";
import { siteConfig } from "@/config";

export function CtaCard() {
  return (
    <div className="home-reveal-up max-w-4xl mx-auto">
      <div className="relative">
        <div className="home-mobile-glow absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 opacity-70 blur-lg"></div>
        <div className="relative rounded-xl border border-white/10 bg-black/80 p-5 text-center backdrop-blur-sm max-sm:backdrop-blur-none sm:p-8 md:p-12">
          <CtaContent />
        </div>
      </div>
    </div>
  );
}

function CtaContent() {
  return (
    <>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
        {ctaConfig.title}
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto">
        {ctaConfig.description}
      </p>

      <CtaButtons />

      <p className="mt-4 sm:mt-6 text-white/50 text-xs sm:text-sm">
        {ctaConfig.note}
      </p>
    </>
  );
}

function CtaButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        asChild
        className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white border-0 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
      >
        <Link href={siteConfig.ctaHref}>
          {ctaConfig.primaryCta}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="border-white/20 text-white hover:bg-white/10 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
      >
        <Link href="/realisaties">{ctaConfig.secondaryCta}</Link>
      </Button>
    </div>
  );
}
