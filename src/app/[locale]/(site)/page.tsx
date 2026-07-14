import type { Metadata } from "next";
import {
  Hero,
  Features,
  RegionIntro,
  SectorIntro,
  HowItWorks,
  Testimonials,
  BlogPreview,
  Cta,
} from "@/features/home";
import { SectorFaq } from "@/components/sectors";
import { FaqPageJsonLd } from "@/components/seo";
import { getGoogleReviews, GOOGLE_MAPS_PROFILE_URL } from "@/lib/reviews/google";
import { businessConfig } from "@/config/business.config";
import { localizedPath } from "@/lib/kennisbank/posts";

// Zichtbare FAQ en FAQ-schema gebruiken exact dezelfde inhoud.
const HOME_FAQ = [
  {
    question: "Hoe vind ik snel de juiste dienst op de website?",
    answer:
      "Open het menu Diensten en kies de categorie die bij je project past, zoals webdesign, apps en software, SEO, fotografie of videografie. Op elke dienstenpagina vind je de aanpak, mogelijkheden en een duidelijke volgende stap.",
  },
  {
    question: "Waar kan ik voorbeelden van eerdere projecten bekijken?",
    answer:
      "Via Realisaties navigeer je naar voorbeelden per discipline. Je vindt er websites, applicaties, fotografie, video, drone en andere projecten met uitleg over de gekozen oplossing.",
  },
  {
    question: "Hoe kan ik contact opnemen met VisualVibe?",
    answer:
      "Gebruik de pagina Contact voor een rechtstreekse vraag. Daar vind je de beschikbare contactmogelijkheden en kun je eenvoudig toelichten waarmee we je kunnen helpen.",
  },
  {
    question: "Hoe vraag ik een offerte aan?",
    answer:
      "Klik op Offerte aanvragen in het hoofdmenu of bij een dienst. Vul kort je wensen, planning en contactgegevens in. Daarna nemen we contact op om het project en een passende aanpak te bespreken.",
  },
];

// Rebuild public homepage data in the background at most once per hour.
export const revalidate = 3600;

// Alleen de homepage target de bedrijfspositionering. Diensten- en regiopagina's
// behouden hun eigen commerciële zoekrichting en metadata.
export function generateMetadata(): Metadata {
  return {
    title: "Creatief mediabureau Limburg | Webdesign, foto & video",
    description:
      "VisualVibe is een creatief mediabureau in Limburg voor webdesign, fotografie, videografie en digitale toepassingen voor bedrijven.",
    alternates: { canonical: `${businessConfig.url}${localizedPath("nl", "/")}` },
  };
}

/**
 * Staat rechtstreeks in de servergerenderde homepage-HTML. Daardoor zijn zowel
 * het echte <i>-element als het <blockquote>-element altijd zichtbaar voor
 * crawlers en analysetools, ook wanneer client-JavaScript of Google Reviews
 * tijdelijk niet beschikbaar zijn.
 */
function HomepageReviewSignal() {
  return (
    <section className="relative py-6 sm:py-8" aria-labelledby="review-signal-title">
      <div className="container mx-auto px-2.5 sm:px-4">
        <div className="mx-auto grid max-w-5xl gap-5 rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-amber-400">
              Persoonlijke aanpak
            </p>
            <h2 id="review-signal-title" className="text-xl font-bold sm:text-2xl">
              Eén creatief team voor je volledige online uitstraling
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
              <i className="text-white/85">
                Als Limburgs mediabureau combineren we webdesign, fotografie en videografie voor
                bedrijven in één doordachte aanpak.
              </i>
            </p>
          </div>

          <blockquote
            cite={GOOGLE_MAPS_PROFILE_URL}
            className="rounded-xl border border-amber-400/20 bg-amber-400/[0.045] px-5 py-5 sm:px-6"
          >
            <p className="text-base font-medium leading-relaxed text-white/85 sm:text-lg">
              “Persoonlijke begeleiding, duidelijke communicatie en één aanspreekpunt van briefing
              tot oplevering.”
            </p>
            <footer className="mt-3 text-xs font-medium uppercase tracking-[0.1em] text-white/45">
              Samenvatting van onze klantenreviews
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const reviews = await getGoogleReviews();

  return (
    <div className="relative min-h-screen text-white">
      <FaqPageJsonLd items={HOME_FAQ} />
      {/* Background comes from the site-wide SiteBackground in the layout. */}
      <Hero />
      <Features />
      <RegionIntro />
      <SectorIntro />
      <HowItWorks />
      <HomepageReviewSignal />
      <Testimonials testimonials={reviews} sourceUrl={GOOGLE_MAPS_PROFILE_URL} />
      <SectorFaq title="Snel je weg vinden op onze website" items={HOME_FAQ} />
      <BlogPreview />
      <Cta />
    </div>
  );
}
