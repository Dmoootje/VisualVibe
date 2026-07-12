import { businessConfig } from "@/config/business.config";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";
import { WebsiteAnalyseWidget } from "@/components/analyse/WebsiteAnalyseWidget";

export const metadata = pageMetadata({
  title: `Website analyse | ${businessConfig.displayName}`,
  description:
    "Analyseer gratis de SEO van je website. Ontdek direct wat er beter kan aan snelheid, vindbaarheid en techniek.",
  path: "/website-analyse/",
  // Testfase: pagina bereikbaar maar buiten de index houden tot ze gestyled
  // en definitief is. Daarna deze regel verwijderen + toevoegen aan de sitemap.
  noindex: true,
});

export default function WebsiteAnalysePage() {
  return (
    <div className="min-h-screen text-white pt-24 pb-16">
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Website analyse", path: "/website-analyse" }]}
      />

      <div className="container mx-auto px-2.5 sm:px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Website analyse</h1>
        <p className="text-lg text-white/70 mb-10 max-w-2xl">
          Vul je website in en ontvang direct een analyse van je vindbaarheid, snelheid en techniek.
        </p>

        {/* Testfase: widget kaal embedden; styling volgt in een tweede stap. */}
        <WebsiteAnalyseWidget />
      </div>
    </div>
  );
}
