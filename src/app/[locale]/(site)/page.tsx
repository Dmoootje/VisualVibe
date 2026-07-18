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
import { Link } from "@/i18n/navigation";

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

function EnglishHomepageBody() {
  const services = [
    ["Web design", "Fast, accessible websites and online shops built around SEO and clear conversion paths."],
    ["SEO and GEO", "A sound technical base, useful content and stronger visibility in search and AI-generated answers."],
    ["Business photography", "Natural, professional images for your team, products, locations and events."],
    ["Video production", "Company films, campaign content and event videos shaped around a clear story."],
    ["Drone and FPV", "Aerial perspectives, inspections and dynamic FPV footage for business and campaign content."],
    ["3D, VR and AR", "Immersive applications that help audiences explore places, products and ideas."],
    ["Podcast production", "Support with recording, production and delivery of professional podcast episodes."],
  ];
  return <>
    <section className="container mx-auto px-2.5 pb-20 pt-32 sm:px-4"><p className="font-mono text-xs font-bold uppercase tracking-[.15em] text-amber-400">Creative media agency in Limburg, Belgium</p><h1 className="mt-5 max-w-5xl text-5xl font-extrabold leading-tight sm:text-7xl">Creative media agency in Limburg</h1><p className="mt-7 max-w-3xl text-xl leading-relaxed text-white/65">VisualVibe combines web design, SEO and GEO, photography, video production and digital applications for businesses. One team gives your strategy, technology and visual content a consistent direction.</p><div className="mt-9 flex flex-wrap gap-4"><Link href="/en/request-a-quotation/" className="rounded-xl bg-gradient-to-r from-red-500 to-amber-500 px-7 py-4 font-bold">Request a quotation</Link><Link href="/en/services/" className="rounded-xl border border-white/15 px-7 py-4 font-bold">Explore our services</Link></div></section>
    <section className="container mx-auto px-2.5 py-16 sm:px-4"><h2 className="text-3xl font-bold sm:text-4xl">Web design, photography and video for businesses</h2><p className="mt-4 max-w-3xl text-lg text-white/65">From a new website to a complete image library, you work with one point of contact and a team that understands how every element supports the next.</p><div className="mt-8 grid gap-4 md:grid-cols-2">{services.map(([title,body]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[.03] p-7"><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 leading-relaxed text-white/60">{body}</p></article>)}</div></section>
    <section className="container mx-auto px-2.5 py-16 sm:px-4"><h2 className="text-3xl font-bold sm:text-4xl">Based in Limburg, working across the region</h2><p className="mt-4 max-w-3xl text-lg text-white/65">VisualVibe is based in Tongeren-Borgloon and works with businesses throughout Limburg, Flanders, Antwerp province and Dutch Limburg. We also travel further for larger projects.</p><Link href="/en/regions/" className="mt-6 inline-block font-semibold text-amber-400">View all regions</Link></section>
    <section className="container mx-auto px-2.5 py-16 sm:px-4"><h2 className="text-3xl font-bold sm:text-4xl">Who we work with</h2><p className="mt-4 max-w-3xl text-lg text-white/65">We adapt the strategy, production and delivery to your market, audience and sales journey.</p><div className="mt-8 flex flex-wrap gap-3">{["Construction and renovation", "Hospitality", "Property", "Retail", "Events", "Sport", "Education", "Wellness", "Industry"].map((sector) => <span key={sector} className="rounded-full border border-white/10 bg-white/[.03] px-5 py-3 font-semibold">{sector}</span>)}</div><Link href="/en/sectors/" className="mt-6 inline-block font-semibold text-amber-400">Explore the sectors we serve</Link></section>
    <section className="container mx-auto px-2.5 py-16 sm:px-4"><h2 className="text-3xl font-bold sm:text-4xl">A process built around your goals</h2><ol className="mt-8 grid gap-4 md:grid-cols-4">{[["01","Conversation and briefing"],["02","Strategy and structure"],["03","Design and production"],["04","Launch and growth"]].map(([number,title]) => <li key={number} className="rounded-2xl border border-white/10 p-6"><span className="font-mono text-amber-400">{number}</span><h3 className="mt-3 font-bold">{title}</h3></li>)}</ol><p className="mt-7 max-w-3xl text-white/65">You have one point of contact, clear communication and personal guidance from the first conversation to final delivery.</p></section>
    <HomepageReviewSignal locale="en" />
    <section className="container mx-auto px-2.5 py-16 sm:px-4"><h2 className="text-3xl font-bold sm:text-4xl">What our customers say</h2><p className="mt-4 max-w-3xl text-lg text-white/65">Customers value the personal guidance, clear communication and single point of contact throughout their projects.</p><a href={GOOGLE_MAPS_PROFILE_URL} className="mt-6 inline-block font-semibold text-amber-400" rel="nofollow noopener noreferrer" target="_blank">Read our Google reviews</a></section>
    <section className="container mx-auto px-2.5 py-16 sm:px-4"><h2 className="text-3xl font-bold sm:text-4xl">From our knowledge base</h2><p className="mt-4 max-w-3xl text-lg text-white/65">Practical guidance on web design, online visibility and visual content helps you make better decisions before your next project.</p><div className="mt-8 grid gap-4 md:grid-cols-3">{[["Web design", "Plan a website around clear goals, useful content and a strong technical foundation."],["SEO and GEO", "Understand how search engines and AI systems interpret your business and content."],["Photo and video", "Prepare visual production that supports your brand across every channel."]].map(([title, body]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-white/60">{body}</p></article>)}</div></section>
    <section className="container mx-auto px-2.5 py-16 text-center sm:px-4"><h2 className="text-3xl font-bold sm:text-4xl">Ready to discuss your project?</h2><p className="mx-auto mt-4 max-w-2xl text-white/65">Tell us what you need and we will explore the right combination of web design, search, photography, video or digital development.</p><Link href="/en/request-a-quotation/" className="mt-7 inline-block rounded-xl bg-gradient-to-r from-red-500 to-amber-500 px-7 py-4 font-bold">Request a quotation</Link></section>
  </>;
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const en = locale === "en";
  const faq = en ? [...HOME_EN.faq] : HOME_FAQ;
  const reviews = await getGoogleReviews();

  return (
    <div className="relative min-h-screen text-white">
      <WebPageJsonLd
        url={en ? `${businessConfig.url}/en/` : HOME_URL}
        name={en ? HOME_EN.title : HOME_TITLE}
        description={en ? HOME_EN.description : HOME_DESCRIPTION}
      />
      <FaqPageJsonLd items={faq} />
      {en ? <><EnglishHomepageBody /><SectorFaq title="Frequently asked questions about VisualVibe" items={faq} /></> : <>
      {/* Background comes from the site-wide SiteBackground in the layout. */}
      <Hero />
      <Features />
      <RegionIntro />
      <SectorIntro />
      <HowItWorks />
      <HomepageReviewSignal locale={locale} />
      <Testimonials testimonials={reviews} sourceUrl={GOOGLE_MAPS_PROFILE_URL} />
      <SectorFaq title={en ? "Frequently asked questions about VisualVibe" : "Veelgestelde vragen over VisualVibe"} items={faq} />
      <BlogPreview />
      <Cta />
      </>}
    </div>
  );
}
