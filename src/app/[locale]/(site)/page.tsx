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

// Canonical only: every locale canonicalizes to the real Dutch homepage under
// /be (fr/en render the same Dutch content). Title, description and OG stay
// inherited from the locale layout defaults.
export function generateMetadata(): Metadata {
  return {
    alternates: { canonical: `${businessConfig.url}${localizedPath("nl", "/")}` },
  };
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
      <Testimonials testimonials={reviews} sourceUrl={GOOGLE_MAPS_PROFILE_URL} />
      <SectorFaq title="Snel je weg vinden op onze website" items={HOME_FAQ} />
      <BlogPreview />
      <Cta />
    </div>
  );
}
