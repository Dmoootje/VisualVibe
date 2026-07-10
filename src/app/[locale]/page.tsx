import {
  HomeBackground,
  Hero,
  Features,
  RegionIntro,
  SectorIntro,
  HowItWorks,
  Testimonials,
  BlogPreview,
  Cta,
} from "@/features/home";
import { getGoogleReviews, GOOGLE_MAPS_PROFILE_URL } from "@/lib/reviews/google";

export default async function Home() {
  const reviews = await getGoogleReviews();

  return (
    <div className="relative isolate min-h-screen text-white">
      {/* Single continuous background behind all sections (no per-section seams). */}
      <HomeBackground />
      <Hero />
      <Features />
      <RegionIntro />
      <SectorIntro />
      <HowItWorks />
      <Testimonials testimonials={reviews} sourceUrl={GOOGLE_MAPS_PROFILE_URL} />
      <BlogPreview />
      <Cta />
    </div>
  );
}
