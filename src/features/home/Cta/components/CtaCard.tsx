import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { QuoteButton } from "@/components/quote";
import { ctaConfig, ctaConfigEn } from "../config/cta.config";

export function CtaCard({ locale = "nl" }: { locale?: string }) {
  return (
    <div className="home-reveal-up max-w-4xl mx-auto">
      <div className="relative">
        <div className="home-mobile-glow absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 opacity-70 blur-lg"></div>
        <div className="relative rounded-xl border border-white/10 bg-black/80 p-5 text-center backdrop-blur-sm max-sm:backdrop-blur-none sm:p-8 md:p-12">
          <CtaContent locale={locale} />
        </div>
      </div>
    </div>
  );
}

function CtaContent({ locale = "nl" }: { locale?: string }) {
  const copy = locale === "en" ? ctaConfigEn : ctaConfig;
  return (
    <>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
        {copy.title}
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto">
        {copy.description}
      </p>

      <CtaButtons locale={locale} />

      <p className="mt-4 sm:mt-6 text-white/50 text-xs sm:text-sm">
        {copy.note}
      </p>
    </>
  );
}

function CtaButtons({ locale = "nl" }: { locale?: string }) {
  const copy = locale === "en" ? ctaConfigEn : ctaConfig;
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <QuoteButton className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-gradient-to-r from-red-500 to-amber-500 font-medium text-white transition-colors hover:from-red-600 hover:to-amber-600 border-0 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base">
        {copy.primaryCta}
        <ArrowRight className="ml-2 h-4 w-4" />
      </QuoteButton>
      <Button
        asChild
        variant="outline"
        className="border-white/20 text-white hover:bg-white/10 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
      >
        <Link href="/realisaties">{copy.secondaryCta}</Link>
      </Button>
    </div>
  );
}
