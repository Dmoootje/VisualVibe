import { ArrowRight, Sparkles } from "lucide-react";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo";
import { PageAmbient } from "@/components/ui/PageAmbient";
import { businessConfig } from "@/config/business.config";
import { toolCards } from "@/data/tools";
import { englishToolCards } from "@/data/toolsEnglish";
import type { SupportedLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import Link from "next/link";

const PAGE_PATH = "/tools/";
const PAGE_URL = `${businessConfig.url}/be/tools/`;
const nlMetadata = pageMetadata({ title: `Gratis tools voor je website | ${businessConfig.displayName}`, description: "Gebruik gratis VisualVibe tools zoals een website analyse en SEO/GEO checklist om je website, vindbaarheid en AI-vindbaarheid te verbeteren.", keywords: ["gratis tools website", "website analyse", "SEO/GEO checklist"], path: PAGE_PATH });

export async function generateMetadata({ params }: { params: Promise<{ locale: SupportedLocale }> }) {
  const { locale } = await params;
  return locale === "en" ? pageMetadata({ locale, title: `Free website SEO and GEO tools | ${businessConfig.displayName}`, description: "Use VisualVibe's free website analysis and SEO/GEO checklist to review technical SEO, content, performance and visibility in AI search.", keywords: ["free website SEO tools", "website analysis", "SEO GEO checklist"], path: PAGE_PATH }) : nlMetadata;
}

export default async function ToolsPage({ params }: { params?: Promise<{ locale: SupportedLocale }> }) {
  const locale = params ? (await params).locale : "nl";
  const en = locale === "en";
  const cards = en ? englishToolCards : toolCards;
  const title = en ? "Free tools for your website" : "Gratis tools voor je website";
  const intro = en ? "Analyse, review and improve your website with practical VisualVibe tools. Start with a free website analysis or work through the SEO/GEO checklist for Google and AI search." : "Analyseer, controleer en verbeter je website met praktische tools van VisualVibe. Begin met een gratis website analyse of werk stap voor stap door de SEO/GEO checklist voor Google en AI-zoekmachines.";
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <BreadcrumbJsonLd locale={en ? "en" : "nl"} items={[{ name: "Home", path: "/" }, { name: "Tools", path: "/tools" }]} />
      <WebPageJsonLd url={en ? `${businessConfig.url}/en/tools/` : PAGE_URL} name={title} description={en ? "Free VisualVibe tools for website analysis, SEO, GEO and practical improvements." : "Gratis VisualVibe tools voor website analyse, SEO, GEO en praktische websiteverbetering."} />
      <PageAmbient />
      <main className="relative z-10"><section className="pb-12 pt-28 sm:pt-32 md:pb-16 md:pt-36"><div className="container mx-auto px-2.5 sm:px-4">
        <div className="max-w-3xl"><p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8a2a]"><Sparkles className="h-4 w-4" aria-hidden="true" />VisualVibe tools</p><h1 className="text-4xl font-extrabold leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl md:text-[62px]">{title}</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68 sm:text-lg">{intro}</p></div>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">{cards.map((tool) => <Link key={tool.id} href={tool.href} className="group relative overflow-hidden rounded-[28px] border border-white/[0.1] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,117,0,0.42)] hover:bg-white/[0.045] sm:p-8"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,117,0,0.16),transparent_48%)] opacity-70" /><div className="relative z-10"><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#ff8a2a]">{tool.tag}</p><h2 className="text-2xl font-bold text-white">{tool.name}</h2><p className="mt-3 text-sm leading-relaxed text-white/62">{tool.desc}</p><ul className="mt-6 grid gap-2">{tool.previewPoints.map((point) => <li key={point} className="flex items-center gap-2 text-sm font-semibold text-white/72"><span className="h-2 w-2 rounded-full bg-green-400" aria-hidden="true" />{point}</li>)}</ul><span className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-amber-500 px-5 py-3 text-sm font-bold text-white">{tool.cta}<ArrowRight className="h-4 w-4" aria-hidden="true" /></span></div></Link>)}</div>
      </div></section></main>
    </div>
  );
}
