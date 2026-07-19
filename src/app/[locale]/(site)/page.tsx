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

const HOME_TITLE = "Mediabureau Limburg: webdesign, foto & video | VisualVibe";
const HOME_DESCRIPTION =
  "VisualVibe is het creatieve mediabureau in Limburg voor webdesign, SEO, fotografie, video, drone en apps. Eén team voor strategie, productie en groei.";
const HOME_URL = `${businessConfig.url}/be/`;
const HOME_EN = {
  title: "Creative media agency in Limburg | VisualVibe",
  description: "VisualVibe is a creative media agency in Limburg for web design, SEO, photography, video, drone and apps. One team for strategy and production.",
  faq: [
    { question: "What does VisualVibe do?", answer: "VisualVibe is a creative media agency in Tongeren-Borgloon, Limburg, Belgium. We help businesses with web design, SEO and GEO, photography, video production, drone and FPV, 3D, VR and AR, podcast production and custom applications." },
    { question: "Where is VisualVibe based and which regions do you serve?", answer: "VisualVibe is based at Ziegelsmeer 14, 3700 Tongeren-Borgloon. We mainly work across Limburg, Flanders, Antwerp province and Dutch Limburg, and travel further for larger projects." },
    { question: "What types of business does VisualVibe work with?", answer: "We work with SMEs, self-employed professionals and organisations in construction and renovation, hospitality, property, retail, events, sport, education, wellness and industry. We tailor the approach to each sector, audience and commercial objective." },
    { question: "Can VisualVibe combine web design, photography, video and SEO?", answer: "Yes. VisualVibe brings strategy, web design, content production and online visibility together in one team, so your website, photography, video, campaigns and SEO share one clear direction." },
    { question: "How do I request a quotation from VisualVibe?", answer: "Use the request a quotation page and briefly describe your project, timing and required services. VisualVibe will contact you to discuss your objectives and prepare a tailored quotation." },
  ],
} as const;

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
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    title: locale === "en" ? HOME_EN.title : HOME_TITLE,
    description: locale === "en" ? HOME_EN.description : HOME_DESCRIPTION,
    keywords: locale === "en" ? [
      "creative media agency Limburg", "creative agency Limburg Belgium", "web design Limburg",
      "SEO Limburg", "business photography Limburg", "video production Limburg", "custom applications Limburg",
    ] : [
      "creatief mediabureau Limburg",
      "mediabureau Limburg",
      "webdesign Limburg",
      "SEO Limburg",
      "bedrijfsfotografie Limburg",
      "videografie Limburg",
      "applicaties op maat Limburg",
    ],
    path: "/", locale: locale === "en" ? "en" : "nl",
    languagePaths: { nl: "/", en: "/" },
    ogImageAlt: locale === "en"
      ? "VisualVibe, a creative media agency in Limburg for web design, SEO, photography and video production"
      : "VisualVibe, creatief mediabureau in Limburg voor webdesign, SEO, fotografie en video",
  });
}

/**
 * Staat rechtstreeks in de servergerenderde homepage-HTML. De eerste zin geeft
 * zoekmachines en antwoordmodellen een ondubbelzinnige entiteitsomschrijving;
 * de reviewcontext blijft ook zonder client-JavaScript beschikbaar.
 */
function HomepageReviewSignal({ locale }: { locale: string }) {
  const en = locale === "en";
  return (
    <section className="relative py-6 sm:py-8" aria-labelledby="review-signal-title">
      <div className="container mx-auto px-2.5 sm:px-4">
        <div className="mx-auto grid max-w-5xl gap-5 rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-amber-400">
              {en ? "Creative media agency in Limburg" : "Creatief mediabureau in Limburg"}
            </p>
            <h2 id="review-signal-title" className="text-xl font-bold sm:text-2xl">
              {en ? "What is VisualVibe?" : "Wat is VisualVibe?"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
              <strong className="font-semibold text-white/95">
                {en ? "VisualVibe is a creative media agency in Tongeren-Borgloon, Limburg, Belgium." : "VisualVibe is een creatief mediabureau in Tongeren-Borgloon, Limburg."}
              </strong>{" "}
              {en ? "We combine web design, SEO and GEO, photography, video production and digital applications for businesses that want to grow with a consistent identity." : "We combineren webdesign, SEO en GEO, fotografie, videografie en digitale toepassingen voor bedrijven die herkenbaar willen groeien."}
            </p>
          </div>

          <blockquote
            cite={GOOGLE_MAPS_PROFILE_URL}
            className="rounded-xl border border-amber-400/20 bg-amber-400/[0.045] px-5 py-5 sm:px-6"
          >
            <p className="text-base font-medium leading-relaxed text-white/90 sm:text-lg">
              {en ? "Personal guidance, clear communication and one point of contact from briefing to delivery." : "Persoonlijke begeleiding, duidelijke communicatie en één aanspreekpunt van briefing tot oplevering."}
            </p>
            <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
              {en ? "Summary of our customer reviews" : "Samenvatting van onze klantenreviews"}
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const en = locale === "en";
  const faq = en ? [...HOME_EN.faq] : HOME_FAQ;
  const reviews = await getGoogleReviews(en ? "en" : "nl");

  return (
    <div className="relative min-h-screen text-white">
      <WebPageJsonLd
        url={en ? `${businessConfig.url}/en/` : HOME_URL}
        name={en ? HOME_EN.title : HOME_TITLE}
        description={en ? HOME_EN.description : HOME_DESCRIPTION}
        inLanguage={en ? "en-BE" : "nl-BE"}
      />
      <FaqPageJsonLd items={faq} />
      {/* Background comes from the site-wide SiteBackground in the layout. */}
      <Hero locale={locale} />
      <Features locale={locale} />
      <RegionIntro locale={en ? "en" : "nl"} />
      <SectorIntro locale={locale} />
      <HowItWorks locale={locale} />
      <HomepageReviewSignal locale={locale} />
      <Testimonials testimonials={reviews} sourceUrl={GOOGLE_MAPS_PROFILE_URL} locale={locale} />
      <SectorFaq title={en ? "Frequently asked questions about VisualVibe" : "Veelgestelde vragen over VisualVibe"} items={faq} />
      <BlogPreview />
      <Cta locale={locale} />
    </div>
  );
}
