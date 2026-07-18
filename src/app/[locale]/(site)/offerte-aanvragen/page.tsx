import { businessConfig } from "@/config/business.config";
import { LeadForm } from "@/components/forms/LeadForm";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";
import type { SupportedLocale } from "@/i18n/locales";
import { getCommercialCopy } from "../commercialCopy";

export async function generateMetadata({ params }: { params: Promise<{ locale: SupportedLocale }> }) {
  const { locale } = await params;
  const copy = getCommercialCopy(locale).quotation;
  return pageMetadata({ locale, title: `${copy.title} | ${businessConfig.displayName}`, description: copy.description, path: locale === "en" ? "/request-a-quotation/" : "/offerte-aanvragen/", languagePaths: { nl: "/offerte-aanvragen/", en: "/request-a-quotation/" } });
}

export default async function OfferteAanvragenPage({ params }: { params: Promise<{ locale: SupportedLocale }> }) {
  const { locale } = await params;
  const copy = getCommercialCopy(locale).quotation;
  return (
    <div className="min-h-screen text-white pt-24 pb-16">
      <BreadcrumbJsonLd
        locale={locale === "en" ? "en" : "nl"}
        items={[{ name: "Home", path: "/" }, { name: copy.h1, path: locale === "en" ? "/request-a-quotation" : "/offerte-aanvragen" }]}
      />

      <div className="container mx-auto px-2.5 sm:px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{copy.h1}</h1>
        <p className="text-lg text-white/70 mb-10 max-w-2xl">
          {copy.intro}
        </p>

        <div className="max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <LeadForm variant="offerte" locale={locale} />
        </div>
      </div>
    </div>
  );
}
