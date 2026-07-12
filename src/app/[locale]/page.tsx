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
import { getGoogleReviews, GOOGLE_MAPS_PROFILE_URL } from "@/lib/reviews/google";

export default async function Home() {
  const reviews = await getGoogleReviews();

  return (
    <div className="relative min-h-screen text-white">
      {/* Background comes from the site-wide SiteBackground in the layout. */}
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
