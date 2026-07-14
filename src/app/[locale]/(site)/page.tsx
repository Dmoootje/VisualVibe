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
import { FaqPageJsonLd, WebPageJsonLd } from "@/components/seo";
import { getGoogleReviews, GOOGLE_MAPS_PROFILE_URL } from "@/lib/reviews/google";
import { businessConfig } from "@/config/business.config";
import { pageMetadata } from "@/lib/seo/pageMetadata";

const HOME_TITLE = "Creatief mediabureau Limburg | Webdesign, foto & video";
const HOME_DESCRIPTION =
  "VisualVibe is het creatieve mediabureau in Limburg voor webdesign, SEO, fotografie, video, drone en apps. Eén team voor strategie, productie en groei.";
const HOME_URL = `${businessConfig.url}/be/`;

// Zichtbare FAQ en FAQ-schema gebruiken exact dezelfde, antwoordgerichte inhoud.
const HOME_FAQ = [
  {
    question: "Wat doet VisualVibe?",
    answer:
      "VisualVibe is een creatief mediabureau in Tongeren-Borgloon, Limburg. We helpen bedrijven met webdesign, SEO en GEO, fotografie, videografie, drone en FPV, 3D/VR/AR, podcastproductie en applicaties op maat.",
  },
  {
    question: "Waar is VisualVibe gevestigd en in welke regio werken jullie?",
    answer:
      "VisualVibe is gevestigd aan Ziegelsmeer 14 in 3700 Tongeren-Borgloon. We werken vooral voor bedrijven in Limburg, heel Vlaanderen, de provincie Antwerpen en Nederlands-Limburg, en verplaatsen ons ook voor grotere projecten.",
  },
  {
    question: "Voor welke bedrijven werkt VisualVibe?",
    answer:
      "We werken voor kmo's, zelfstandigen en organisaties in onder meer bouw en renovatie, horeca, vastgoed, retail, events, sport, opleidingen, wellness en industrie. De aanpak wordt afgestemd op de sector, doelgroep en commerciële doelen.",
  },
  {
    question: "Kan VisualVibe webdesign, foto, video en SEO combineren?",
    answer:
      "Ja. VisualVibe combineert strategie, webdesign, contentproductie en vindbaarheid binnen één team. Daardoor sluiten website, fotografie, video, campagnes en SEO inhoudelijk en visueel op elkaar aan.",
  },
  {
    question: "Hoe vraag ik een offerte aan bij VisualVibe?",
    answer:
      "Gebruik de pagina Offerte aanvragen en beschrijf kort je project, timing en gewenste diensten. VisualVibe neemt daarna contact op om de doelen te bespreken en een concreet voorstel op maat op te stellen.",
  },
];

// Rebuild public homepage data in the background at most once per hour.
export const revalidate = 3600;

// Alleen de homepage target de bedrijfspositionering. Diensten- en regiopagina's
// behouden hun eigen commerciële zoekrichting en metadata.
export function generateMetadata(): Metadata {
  return pageMetadata({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    keywords: [
      "creatief mediabureau Limburg",
      "mediabureau Limburg",
      "webdesign Limburg",
      "SEO Limburg",
      "bedrijfsfotografie Limburg",
      "videografie Limburg",
      "applicaties op maat Limburg",
    ],
    path: "/",
    ogImageAlt:
      "VisualVibe, creatief mediabureau in Limburg voor webdesign, SEO, fotografie en video",
  });
}

/**
 * Staat rechtstreeks in de servergerenderde homepage-HTML. De eerste zin geeft
 * zoekmachines en antwoordmodellen een ondubbelzinnige entiteitsomschrijving;
 * de reviewcontext blijft ook zonder client-JavaScript beschikbaar.
 */
function HomepageReviewSignal() {
  return (
    <section className="relative py-6 sm:py-8" aria-labelledby="review-signal-title">
      <div className="container mx-auto px-2.5 sm:px-4">
        <div className="mx-auto grid max-w-5xl gap-5 rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-amber-400">
              Creatief mediabureau in Limburg
            </p>
            <h2 id="review-signal-title" className="text-xl font-bold sm:text-2xl">
              Wat is VisualVibe?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
              <strong className="font-semibold text-white/90">
                VisualVibe is een creatief mediabureau in Tongeren-Borgloon, Limburg.
              </strong>{" "}
              We combineren webdesign, SEO en GEO, fotografie, videografie en digitale toepassingen
              voor bedrijven die herkenbaar willen groeien.
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
      <WebPageJsonLd
        url={HOME_URL}
        name={HOME_TITLE}
        description={HOME_DESCRIPTION}
      />
      <FaqPageJsonLd items={HOME_FAQ} />
      {/* Background comes from the site-wide SiteBackground in the layout. */}
      <Hero />
      <Features />
      <RegionIntro />
      <SectorIntro />
      <HowItWorks />
      <HomepageReviewSignal />
      <Testimonials testimonials={reviews} sourceUrl={GOOGLE_MAPS_PROFILE_URL} />
      <SectorFaq title="Veelgestelde vragen over VisualVibe" items={HOME_FAQ} />
      <BlogPreview />
      <Cta />
    </div>
  );
}
