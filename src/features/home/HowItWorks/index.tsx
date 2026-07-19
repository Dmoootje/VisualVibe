import { ArrowRight, HeartHandshake } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ActiveProcessLink } from "./components/ActiveProcessLink";
import { ProcessExplorer } from "./components/ProcessExplorer";
import { processConfig, processConfigEn } from "./config/process.config";

export default function HowItWorks({ locale = "nl" }: { locale?: string }) {
  const en = locale === "en";
  const copy = en ? processConfigEn : processConfig;
  return (
    <section className="home-deferred-section relative overflow-hidden py-12 sm:py-16 md:py-24">
      <div className="container relative z-10 mx-auto px-2.5 sm:px-4">
        <div className="home-reveal-up mb-8 text-center sm:mb-10">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl">{copy.title}</h2>
          <p className="mx-auto max-w-2xl text-sm text-white/70 sm:text-base md:text-lg">
            {copy.subtitle}
          </p>
        </div>

        <ProcessExplorer locale={locale} />

        <div className="mt-10 flex flex-col items-center gap-5">
          <p className="flex items-center gap-2 text-center text-sm text-white/60">
            <HeartHandshake className="h-4 w-4 shrink-0 text-amber-400" />
            {en
              ? "We keep every project personal: one point of contact, clear communication and guidance from start to finish."
              : "Bij elk traject houden we het persoonlijk: één aanspreekpunt, duidelijke communicatie en begeleiding van begin tot eind."}
          </p>

          <p className="max-w-2xl text-center text-sm leading-relaxed text-white/65 sm:text-base">
            <em className="text-white/85">
              {en
                ? "As a Limburg media agency, we combine web design, photography and video for businesses in one clear approach."
                : "Als Limburgs mediabureau combineren we webdesign, foto en video voor bedrijven in één heldere aanpak."}
            </em>
          </p>

          <p className="max-w-2xl text-center text-sm leading-relaxed text-white/60">
            {en ? (
              <>
                Want to find out where your current site is leaving opportunities on the table? Use our free{" "}
                <a
                  href="https://seowebsites.be/nl/seo-website-analyse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-400 underline underline-offset-4 transition-colors hover:text-amber-300"
                >
                  website analysis tool
                </a>
                .
              </>
            ) : (
              <>
                Wil je eerst ontdekken waar jouw huidige site kansen laat liggen? Gebruik dan de gratis{" "}
                <a
                  href="https://seowebsites.be/nl/seo-website-analyse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-400 underline underline-offset-4 transition-colors hover:text-amber-300"
                >
                  website analyse tool
                </a>
                .
              </>
            )}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              className="gap-2 border-0 bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg shadow-amber-500/20 hover:from-red-600 hover:to-amber-600"
            >
              <Link href={copy.projectCtaHref}>
                {copy.projectCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <ActiveProcessLink locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
