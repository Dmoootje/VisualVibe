import { businessConfig } from "@/config/business.config";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";
import { AnalyseFlow } from "@/components/analyse/AnalyseFlow";

export const metadata = pageMetadata({
  title: `Website analyse | ${businessConfig.displayName}`,
  description:
    "Analyseer gratis de SEO van je website. Ontdek direct wat er beter kan aan snelheid, vindbaarheid en techniek.",
  path: "/website-analyse/",
  // Testfase: pagina bereikbaar maar buiten de index houden tot ze gestyled
  // en definitief is. Daarna deze regel verwijderen + toevoegen aan de sitemap.
  noindex: true,
});

const HOW_IT_WORKS = [
  "Vul je website-URL en je gegevens in.",
  "Bevestig je e-mailadres met de 6-cijferige code die je van ons ontvangt.",
  "Ontvang meteen je score en een rapport met concrete verbeterpunten.",
];

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

        <AnalyseFlow />

        {/* Hoe werkt het: drie korte stappen onder de flow. */}
        <section className="mt-12 max-w-2xl" aria-labelledby="hoe-werkt-het">
          <h2 id="hoe-werkt-het" className="mb-5 text-xl font-bold">
            Hoe werkt het?
          </h2>
          <ol className="flex flex-col gap-4">
            {HOW_IT_WORKS.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] text-sm font-bold text-[#FF9A45]"
                >
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-white/70">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
