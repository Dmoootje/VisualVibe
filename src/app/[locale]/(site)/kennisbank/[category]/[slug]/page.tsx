import type { Metadata } from "next";
import "@/components/kennisbank/kennisbank.css";
import { notFound, permanentRedirect } from "next/navigation";
import { BookOpen } from "lucide-react";
import {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
  getClusterPosts,
  getPostTranslations,
  isBlogLocale,
  localizedPath,
  slugFromPath,
  postHref,
  categoryHref,
} from "@/lib/kennisbank/posts";
import { toBlogCardPost } from "@/lib/kennisbank/blogCard";
import { extractToc } from "@/lib/kennisbank/toc";
import { getCategoryBySlug } from "@/data/kennisbankCategories";
import { getServiceBySlug, serviceHref } from "@/data/services";
import { getRegionBySlug } from "@/data/regions";
import { getAuthorPhotoMap } from "@/lib/firestore/profiles";
import { businessConfig } from "@/config/business.config";
import { Section, Container } from "@/components/ui";
import { Breadcrumbs, CTASection, ServiceGrid, RegionGrid, BlogGrid } from "@/components/sections";
import { BreadcrumbJsonLd, BlogPostingJsonLd } from "@/components/seo";
import { BlogHero, MdxContent, StickyBlogSidebar } from "@/components/blog";
import type { BlogCta, BlogLocale, BlogPost } from "@/types/blog";

const HREFLANG: Record<BlogLocale, string> = {
  nl: "nl-BE",
  fr: "fr-BE",
  en: "en-BE",
};

const OPEN_GRAPH_LOCALE: Record<BlogLocale, string> = {
  nl: "nl_BE",
  fr: "fr_BE",
  en: "en_BE",
};

const CATEGORY_CTAS: Record<string, BlogCta> = {
  webdesign: {
    title: "Klaar voor een website die voor je bedrijf werkt?",
    description: "Bespreek je websiteplannen vrijblijvend met VisualVibe.",
    label: "Bespreek je website",
    href: "/offerte-aanvragen/",
  },
  "seo-geo": {
    title: "Wil je beter gevonden worden in Google en AI?",
    description: "We bekijken waar je grootste kansen voor duurzame vindbaarheid liggen.",
    label: "Bespreek je vindbaarheid",
    href: "/offerte-aanvragen/",
  },
  fotografie: {
    title: "Klaar om je bedrijf sterk in beeld te brengen?",
    description: "Vertel ons welke beelden je nodig hebt en waarvoor je ze wilt inzetten.",
    label: "Bespreek je fotoshoot",
    href: "/offerte-aanvragen/",
  },
  videografie: {
    title: "Een videoverhaal dat blijft hangen?",
    description: "We vertalen je doel en verhaal naar een concreet videoconcept.",
    label: "Bespreek je video",
    href: "/offerte-aanvragen/",
  },
  drone: {
    title: "Je project vanuit een nieuw perspectief tonen?",
    description: "Bespreek je locatie, doel en gewenste drone- of FPV-beelden.",
    label: "Bespreek je dronebeelden",
    href: "/offerte-aanvragen/",
  },
  "3d-vr": {
    title: "Je locatie digitaal beleefbaar maken?",
    description: "Ontdek hoe een 3D-tour past bij je ruimte, website en klantreis.",
    label: "Bespreek je 3D-tour",
    href: "/offerte-aanvragen/",
  },
  podcasting: {
    title: "Klaar om je expertise een stem te geven?",
    description: "We helpen je van podcastidee tot een professioneel opgenomen format.",
    label: "Bespreek je podcast",
    href: "/offerte-aanvragen/",
  },
  masterclasses: {
    title: "Je kennis professioneel opnemen en delen?",
    description: "Bespreek je opleiding, workshop of masterclass met ons productieteam.",
    label: "Bespreek je opname",
    href: "/offerte-aanvragen/",
  },
};

const GENERIC_CTAS: Record<BlogLocale, BlogCta> = {
  nl: {
    title: "Klaar om je project te bespreken?",
    description: "Vertel ons wat je wilt bereiken en ontdek wat VisualVibe voor je kan doen.",
    label: "Plan een kennismaking",
    href: "/offerte-aanvragen/",
  },
  fr: {
    title: "Prêt à discuter de votre projet ?",
    description: "Expliquez-nous votre objectif et découvrez comment VisualVibe peut vous aider.",
    label: "Planifier une rencontre",
    href: "/offerte-aanvragen/",
  },
  en: {
    title: "Ready to discuss your project?",
    description: "Tell us what you want to achieve and discover how VisualVibe can help.",
    label: "Plan an introduction",
    href: "/offerte-aanvragen/",
  },
};

function resolvePostCta(post: BlogPost): BlogCta {
  const fallback =
    (post.locale === "nl" ? CATEGORY_CTAS[post.categorySlug] : undefined) ??
    GENERIC_CTAS[post.locale];
  return {
    title: post.cta?.title ?? fallback.title,
    description: post.cta?.description ?? fallback.description,
    label: post.cta?.label ?? fallback.label,
    href: post.cta?.href ?? fallback.href,
  };
}

function absoluteAuthorUrl(post: BlogPost): string | undefined {
  const authorUrl = post.authorProfile.url;
  if (!authorUrl) return undefined;
  return authorUrl.startsWith("/")
    ? `${businessConfig.url}${localizedPath(post.locale, authorUrl)}`
    : authorUrl;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    locale: post.locale,
    category: post.categorySlug,
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isBlogLocale(locale)) {
    return {};
  }

  const post = getPostBySlug(slug, { locale });
  if (!post) return {};

  const canonical = `${businessConfig.url}${localizedPath(locale, postHref(post))}`;
  const translations = Object.values(getPostTranslations(post.translationKey)).filter(
    (translation): translation is BlogPost => Boolean(translation),
  );
  const languageAlternates =
    translations.length > 1
      ? Object.fromEntries(
          translations.map((translation) => [
            HREFLANG[translation.locale],
            `${businessConfig.url}${localizedPath(translation.locale, postHref(translation))}`,
          ])
        )
      : undefined;
  const alternateLocales = translations
    .filter((translation) => translation.locale !== post.locale)
    .map((translation) => OPEN_GRAPH_LOCALE[translation.locale]);
  const socialImage = post.ogImage ?? `${businessConfig.url}/image.jpg`;
  const authorUrl = absoluteAuthorUrl(post);
  const keywords = [post.focusKeyword, ...(post.secondaryKeywords ?? [])].filter(
    (keyword): keyword is string => Boolean(keyword)
  );

  return {
    title: { absolute: post.seoTitle },
    description: post.seoDescription,
    keywords,
    authors: [{ name: post.authorProfile.name, url: authorUrl }],
    creator: post.authorProfile.name,
    publisher: businessConfig.displayName,
    alternates: { canonical, languages: languageAlternates },
    openGraph: {
      title: post.ogTitle ?? post.seoTitle,
      description: post.ogDescription ?? post.seoDescription,
      images: [{ url: socialImage, alt: post.heroImageAlt ?? post.title }],
      url: canonical,
      type: "article",
      siteName: businessConfig.displayName,
      locale: OPEN_GRAPH_LOCALE[post.locale],
      alternateLocale: alternateLocales.length > 0 ? alternateLocales : undefined,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: authorUrl ? [authorUrl] : undefined,
      section: post.category,
      tags: keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: post.ogTitle ?? post.seoTitle,
      description: post.ogDescription ?? post.seoDescription,
      images: [socialImage],
    },
    robots: post.robots,
  };
}

/** Splits "Lead: hook" into a white lead line and an amber accent line. */
function splitTitle(title: string): { title: string; titleAccent?: string } {
  const colon = title.indexOf(":");
  if (colon === -1) return { title };
  return {
    title: title.slice(0, colon + 1).trim(),
    titleAccent: title.slice(colon + 1).trim(),
  };
}

export default async function KennisbankPostPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;

  if (!isBlogLocale(locale)) {
    notFound();
  }

  const post = getPostBySlug(slug, { locale });

  if (!post) {
    notFound();
  }

  // Canonicalise: if the article is requested under the wrong category segment,
  // 308 to its real nested URL rather than serving duplicate content.
  if (post.categorySlug !== category) {
    permanentRedirect(localizedPath(post.locale, postHref(post)));
  }

  const categoryDef = getCategoryBySlug(post.categorySlug);
  const categoryName = categoryDef?.name ?? post.category;

  const relatedServices = (post.relatedServices ?? [])
    .map((servicePath) => getServiceBySlug(slugFromPath(servicePath)))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  const relatedRegions = (post.relatedRegions ?? [])
    .map((regionPath) => getRegionBySlug(slugFromPath(regionPath)))
    .filter((region): region is NonNullable<typeof region> => Boolean(region));

  const clusterPosts = post.pillar ? getClusterPosts(post.slug, post.locale) : [];

  const relatedPosts = (post.relatedPosts ?? [])
    .map((postPath) => getPostBySlug(slugFromPath(postPath), { locale: post.locale }))
    .filter((related): related is NonNullable<typeof related> => related != null && related.slug !== post.slug);

  // Op een pillar-pagina tonen de clusterartikels al hun eigen reeks; de
  // "Gerelateerde artikels" houden dan alleen cross-cluster verwijzingen over.
  const relatedOutsideCluster = relatedPosts.filter(
    (related) => !clusterPosts.some((cluster) => cluster.slug === related.slug)
  );

  // Fallback zonder frontmatter-relaties: andere artikels uit dezelfde categorie,
  // zodat elk artikel altijd een "Gerelateerde artikels"-blok heeft.
  const fallbackRelated =
    clusterPosts.length === 0 && relatedPosts.length === 0
      ? getPostsByCategory(post.categorySlug, post.locale)
          .filter((related) => related.slug !== post.slug)
          .slice(0, 3)
      : [];

  const toc = extractToc(post.content, [2]);
  const { title: heroTitle, titleAccent } = splitTitle(post.title);
  const sidebarService = relatedServices[0];
  const cta = resolvePostCta(post);
  const canonical = `${businessConfig.url}${localizedPath(post.locale, postHref(post))}`;
  const authorUrl = absoluteAuthorUrl(post);
  const authorImage = (await getAuthorPhotoMap())[post.author];
  const keywords = [post.focusKeyword, ...(post.secondaryKeywords ?? [])].filter(
    (keyword): keyword is string => Boolean(keyword)
  );

  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-[1]">
      <BreadcrumbJsonLd
        locale={post.locale}
        items={[
          { name: "Home", path: "/" },
          { name: "Kennisbank", path: "/kennisbank/" },
          {
            name: categoryName,
            path: categoryHref(post.categorySlug),
          },
          { name: post.title, path: postHref(post) },
        ]}
      />
      <BlogPostingJsonLd
        post={{
          title: post.title,
          description: post.seoDescription,
          url: canonical,
          coverImageUrl: post.ogImage,
          author: {
            name: post.authorProfile.name,
            url: authorUrl,
            jobTitle: post.authorProfile.jobTitle,
            image: authorImage,
          },
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt ?? post.publishedAt,
          inLanguage: HREFLANG[post.locale],
          articleSection: post.category,
          keywords,
          citations: post.sources?.map((source) => ({
            name: source.title,
            url: source.url,
            publisher: source.publisher,
          })),
        }}
      />

      <Section variant="pageHero" orbs="none" className="!bg-transparent">
        <Container>
          <Breadcrumbs
            className="mb-6"
            items={[
              { name: "Home", href: "/" },
              { name: "Kennisbank", href: "/kennisbank/" },
              { name: categoryName, href: categoryHref(post.categorySlug) },
              { name: post.title },
            ]}
          />
          <BlogHero
            category={categoryName}
            title={heroTitle}
            titleAccent={titleAccent}
            excerpt={post.excerpt}
            author={post.author}
            authorUrl={post.authorProfile.url}
            authorRole={post.authorProfile.jobTitle}
            authorImage={authorImage}
            publishedAt={post.publishedAt}
            readingTime={post.readingTime}
            image={post.featuredImage ?? post.ogImage}
            imageAlt={post.heroImageAlt ?? post.title}
            imageTitle={post.heroImageTitle}
            imageCaption={post.heroImageCaption}
            shareUrl={canonical}
            toc={toc}
          />
        </Container>
      </Section>

      <Section
        orbs="none"
        className="!overflow-visible !bg-transparent !pt-6 sm:!pt-8 md:!pt-10"
      >
        <Container>
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-14">
            <article id="artikel" className="min-w-0 scroll-mt-24">
              <MdxContent source={post.content} />
            </article>

            <aside className="hidden min-w-0 self-stretch xl:block">
              <StickyBlogSidebar
                className="hidden xl:flex"
                toc={toc}
                cta={{
                  title: cta.title,
                  description: cta.description,
                  label: cta.label,
                  href: cta.href,
                }}
                service={
                  sidebarService
                    ? {
                        title: sidebarService.title,
                        description: sidebarService.excerpt,
                        href: `${serviceHref(sidebarService)}/`,
                        icon: <BookOpen className="h-5 w-5" aria-hidden="true" />,
                        linkLabel: "Bekijk dienst",
                      }
                    : undefined
                }
              />
            </aside>
          </div>
        </Container>
      </Section>

      {(relatedServices.length > 0 || relatedRegions.length > 0) && (
        <Section orbs="none" className="!bg-transparent">
          <Container className="flex flex-col gap-10">
            {relatedServices.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Gerelateerde diensten</h2>
                <ServiceGrid services={relatedServices} />
              </div>
            )}
            {relatedRegions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Gerelateerde regio&apos;s</h2>
                <RegionGrid regions={relatedRegions} showIntro={false} />
              </div>
            )}
          </Container>
        </Section>
      )}

      {clusterPosts.length > 0 && (
        <Section orbs="none" className="!bg-transparent">
          <Container>
            <h2 className="text-2xl font-bold mb-4">Artikels in deze reeks</h2>
            <BlogGrid posts={clusterPosts.map(toBlogCardPost)} />
          </Container>
        </Section>
      )}

      {(relatedOutsideCluster.length > 0 || fallbackRelated.length > 0) && (
        <Section orbs="none" className="!bg-transparent">
          <Container>
            <h2 className="text-2xl font-bold mb-4">Gerelateerde artikels</h2>
            <BlogGrid posts={(relatedOutsideCluster.length > 0 ? relatedOutsideCluster : fallbackRelated).map(toBlogCardPost)} />
          </Container>
        </Section>
      )}

      <CTASection
        title={cta.title}
        description={cta.description}
        primaryLabel={cta.label}
        primaryHref={cta.href}
        className="!bg-transparent"
      />
      </div>
    </div>
  );
}
