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
import { getGoogleReviews, GOOGLE_MAPS_PROFILE_URL } from "@/lib/reviews/google";
import { businessConfig } from "@/config/business.config";
import { localizedPath } from "@/lib/kennisbank/posts";

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
