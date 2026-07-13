import "./weddingvibe.css";
import type { WeddingVibeContent } from "@/lib/firestore/weddingvibe";
import { resolveWeddingVibeImages } from "./config/imageSlots";
import {
  WvModalProvider,
  WvReveal,
  WeddingNav,
  WeddingHero,
  IntroSection,
  PortfolioSection,
  VideoSection,
  ServicesSection,
  WhySection,
  WerkwijzeSection,
  JensSection,
  InvesteringSection,
  AlbumSection,
  ReviewsSection,
  FaqSection,
  ContactSection,
  WeddingFooter,
  DateModal,
} from "./components";

/**
 * De volledige WeddingVibe one-pager (eigen nav en footer, wit/crème merk).
 * Copy komt uit weddingvibe.config.ts; beelden en prijzen zijn admin-beheerd
 * via Firestore (site_content/weddingvibe) met de config als fallback. De
 * secties zijn server-gerenderd; alleen nav, hero, carrousel, FAQ, formulieren
 * en de datum-popup zijn client-eilanden.
 */
export default function WeddingVibeOnePager({ content }: { content: WeddingVibeContent }) {
  const images = resolveWeddingVibeImages(content.images);

  return (
    <div className="wv-root">
      <WvModalProvider>
        <WeddingNav />
        <main>
          <WeddingHero fallbackImage={images.hero} />
          <IntroSection imageLarge={images.introLarge} imageDetail={images.introDetail} />
          <PortfolioSection gallery={images.gallery} featured={images.featured} />
          <VideoSection poster={images.videoPoster} />
          <ServicesSection images={images.services} />
          <WhySection image={images.why} />
          <WerkwijzeSection />
          <JensSection image={images.jens} />
          <InvesteringSection pricing={content.pricing} prijzenTonen={content.prijzenTonen} />
          <AlbumSection image1={images.album1} image2={images.album2} />
          <ReviewsSection />
          <FaqSection />
          <ContactSection background={images.contact} />
        </main>
        <WeddingFooter />
        <DateModal />
      </WvModalProvider>
      <WvReveal />
    </div>
  );
}
