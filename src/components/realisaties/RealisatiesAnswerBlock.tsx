/**
 * Compact answer-first blok (AEO/GEO) direct onder de hero: zichtbaar op de
 * pagina, in natuurlijke taal, geen keyword stuffing.
 */
import type { SupportedLocale } from "@/i18n/locales";
export function RealisatiesAnswerBlock({ locale = "nl" }: { locale?: SupportedLocale }) {
  const en = locale === "en";
  return (
    <section className="relative py-8 sm:py-10">
      <div className="container mx-auto px-2.5 sm:px-4">
        <div className="max-w-3xl">
          <h2 className="mb-3 text-xl font-bold sm:text-2xl">
            {en ? "What kind of work does VisualVibe create?" : "Welke realisaties vind je bij VisualVibe?"}
          </h2>
          <p className="text-[16px] leading-relaxed text-white/70">
            {en ? "VisualVibe creates projects in web design, SEO, photography, videography, drone and FPV, 3D, VR and AR, podcasting and creative content. Many projects combine several disciplines in one coherent visual programme." : "VisualVibe realiseert projecten in webdesign, SEO, fotografie, videografie, drone en FPV, 3D, VR en AR, podcasting en creatieve content. Veel projecten combineren meerdere disciplines binnen één visueel traject."}
          </p>
        </div>
      </div>
    </section>
  );
}
