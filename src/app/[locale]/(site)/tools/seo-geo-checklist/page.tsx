import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo";
import { PageAmbient } from "@/components/ui/PageAmbient";
import { SeoGeoChecklist } from "@/components/tools/SeoGeoChecklist";
import { businessConfig } from "@/config/business.config";
import { getSeoGeoChecklistItemCount, seoGeoChecklistCategories } from "@/data/tools";
import { TOOL_PAGE_IMAGES } from "@/data/toolPageImages";
import { localizedPath } from "@/lib/kennisbank/urls";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { englishSeoGeoChecklistCategories } from "@/data/toolsEnglish";
import type { SupportedLocale } from "@/i18n/locales";

const PAGE_PATH = "/tools/seo-geo-checklist/";
const PAGE_URL = `${businessConfig.url}${localizedPath("nl", PAGE_PATH)}`;

const nlMetadata = pageMetadata({
  title: `SEO/GEO checklist: Google en AI-vindbaarheid | ${businessConfig.displayName}`,
  description:
    "Gebruik de gratis SEO/GEO checklist van VisualVibe om je pagina te controleren op technische SEO, content, structured data, snelheid en AI-vindbaarheid.",
  keywords: [
    "SEO/GEO checklist",
    "SEO checklist",
    "GEO checklist",
    "AI vindbaarheid",
    "AEO checklist",
    "technische SEO checklist",
  ],
  path: PAGE_PATH,
  ogImage: TOOL_PAGE_IMAGES.seoGeoChecklist.url,
  ogImageAlt: TOOL_PAGE_IMAGES.seoGeoChecklist.alt,
});

export async function generateMetadata({ params }: { params: Promise<{ locale: SupportedLocale }> }) {
  const { locale } = await params;
  return locale === "en" ? pageMetadata({ locale, title: `SEO/GEO checklist for Google and AI search | ${businessConfig.displayName}`, description: "Review technical SEO, content, structured data, speed, images and local visibility with VisualVibe's practical SEO/GEO checklist for AI search.", path: PAGE_PATH, ogImage: TOOL_PAGE_IMAGES.seoGeoChecklist.url, ogImageAlt: "VisualVibe SEO/GEO checklist for Google and AI search visibility" }) : nlMetadata;
}

export default async function SeoGeoChecklistPage({ params }: { params?: Promise<{ locale: SupportedLocale }> }) {
  const locale = params ? (await params).locale : "nl";
  const en = locale === "en";
  const categories = en ? englishSeoGeoChecklistCategories : seoGeoChecklistCategories;
  const itemCount = getSeoGeoChecklistItemCount();

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <BreadcrumbJsonLd
        locale={en ? "en" : "nl"}
        items={[
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "SEO/GEO checklist", path: "/tools/seo-geo-checklist" },
        ]}
      />
      <WebPageJsonLd
        url={en ? `${businessConfig.url}/en/tools/seo-geo-checklist/` : PAGE_URL}
        name="SEO/GEO checklist"
        description={en ? "A practical checklist for SEO, GEO, AEO, structured data, performance and local search visibility." : "Gratis checklist voor SEO, GEO, AEO, structured data, snelheid en lokale vindbaarheid."}
        primaryImage={TOOL_PAGE_IMAGES.seoGeoChecklist.url}
      />
      <PageAmbient />

      <main className="relative z-10">
        <section className="pb-10 pt-28 sm:pt-32 md:pt-36">
          <div className="container mx-auto px-2.5 sm:px-4">
            <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
              <div>
                <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8a2a]">
                  SEO, GEO & AEO
                </p>
                <h1 className="text-4xl font-extrabold leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl md:text-[62px]">
                  SEO/GEO checklist
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
                  {en ? "Review your page for conventional SEO and modern AI search visibility. This checklist helps you uncover technical errors, weak content, missing structured data and incomplete local signals." : "Controleer je pagina op klassieke SEO én moderne AI-vindbaarheid. Deze checklist helpt je technische fouten, zwakke content, ontbrekende structured data en lokale signalen snel boven water halen."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative aspect-[1200/630] overflow-hidden rounded-[24px] border border-white/[0.1] bg-white/[0.025] shadow-[0_28px_90px_-44px_rgba(255,117,0,0.72)]">
                  <Image
                    src={TOOL_PAGE_IMAGES.seoGeoChecklist.url}
                    alt={en ? "VisualVibe SEO/GEO checklist for Google and AI search visibility" : TOOL_PAGE_IMAGES.seoGeoChecklist.alt}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 420px"
                    className="object-cover"
                  />
                </div>
                <div className="rounded-[24px] border border-[rgba(255,117,0,0.28)] bg-[rgba(255,117,0,0.08)] p-5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(255,117,0,0.28)] bg-black/25 text-[#ff8a2a]">
                      <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-3xl font-extrabold text-white">{itemCount}</p>
                      <p className="text-sm font-semibold text-white/56">{en ? "checkpoints" : "controlepunten"}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/62">
                    {en ? "Select completed work and download a branded PDF for your planning, client or team." : "Vink af wat klaar is en download een branded PDF voor je planning, klant of team."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto px-2.5 sm:px-4">
            <SeoGeoChecklist categories={categories} locale={en ? "en" : "nl"} />
          </div>
        </section>
      </main>
    </div>
  );
}
