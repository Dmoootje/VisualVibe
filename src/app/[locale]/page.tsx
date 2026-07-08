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

export default function Home() {
  return (
    <div className="min-h-screen bg-black px-0 sm:px-4 text-white">
      <Hero />
      <Features />
      <RegionIntro />
      <SectorIntro />
      <HowItWorks />
      <Testimonials />
      <BlogPreview />
      <Cta />
    </div>
  );
}
