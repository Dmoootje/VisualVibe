import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BookOpen } from "lucide-react";
import {
  getAllPosts,
  getPostBySlug,
  getClusterPosts,
  slugFromPath,
  postHref,
  categoryHref,
} from "@/lib/kennisbank/posts";
import { extractToc } from "@/lib/kennisbank/toc";
import { getCategoryBySlug } from "@/data/kennisbankCategories";
import { getServiceBySlug } from "@/data/services";
import { getRegionBySlug } from "@/data/regions";
import { businessConfig } from "@/config/business.config";
import { Section, Container } from "@/components/ui";
import { Breadcrumbs, CTASection, ServiceGrid, RegionGrid, BlogGrid } from "@/components/sections";
import { BreadcrumbJsonLd, BlogPostingJsonLd } from "@/components/seo";
import { BlogHero, MdxContent, StickyBlogSidebar } from "@/components/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    category: post.categorySlug,
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return {};
  }

  const canonical = `${businessConfig.url}${postHref(post)}`;

  return {
    title: { absolute: post.seoTitle },
    description: post.seoDescription,
    alternates: { canonical },
    openGraph: {
      title: post.ogTitle ?? post.seoTitle,
      description: post.ogDescription ?? post.seoDescription,
      images: post.ogImage ? [{ url: post.ogImage }] : undefined,
      url: canonical,
      type: "article",
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
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Canonicalise: if the article is requested under the wrong category segment,
  // 308 to its real nested URL rather than serving duplicate content.
  if (post.categorySlug !== category) {
    permanentRedirect(postHref(post));
  }

  const categoryDef = getCategoryBySlug(post.categorySlug);
  const categoryName = categoryDef?.name ?? post.category;

  const relatedServices = (post.relatedServices ?? [])
    .map((servicePath) => getServiceBySlug(slugFromPath(servicePath)))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  const relatedRegions = (post.relatedRegions ?? [])
    .map((regionPath) => getRegionBySlug(slugFromPath(regionPath)))
    .filter((region): region is NonNullable<typeof region> => Boolean(region));

  const clusterPosts = post.pillar ? getClusterPosts(post.slug) : [];

  const relatedPosts = (post.relatedPosts ?? [])
    .map((postPath) => getPostBySlug(slugFromPath(postPath)))
    .filter((related): related is NonNullable<typeof related> => related != null && related.slug !== post.slug);

  const toc = extractToc(post.content, [2]);
  const { title: heroTitle, titleAccent } = splitTitle(post.title);
  const sidebarService = relatedServices[0];

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Kennisbank", path: "/kennisbank/" },
          { name: categoryName, path: categoryHref(post.categorySlug) },
          { name: post.title, path: postHref(post) },
        ]}
      />
      <BlogPostingJsonLd
        post={{
          title: post.title,
          description: post.excerpt,
          url: `${businessConfig.url}${postHref(post)}`,
          coverImageUrl: post.ogImage,
          authorName: post.author,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt ?? post.publishedAt,
        }}
      />

      <Section variant="pageHero" orbs="tl-br">
        <Container className="max-w-5xl">
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
            publishedAt={post.publishedAt}
            readingTime={post.readingTime}
            image={post.ogImage}
            imageAlt={post.heroImageAlt ?? post.title}
          />
        </Container>
      </Section>

      <Section orbs="none">
        <Container className="max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <article>
              <MdxContent source={post.content} />
            </article>

            {toc.length > 0 && (
              <aside className="hidden lg:block">
                <StickyBlogSidebar
                  toc={toc}
                  cta={{
                    title: "Zin in een sterke website?",
                    description: "Vraag vrijblijvend een offerte aan.",
                    label: "Offerte aanvragen",
                    href: "/offerte-aanvragen",
                  }}
                  service={
                    sidebarService
                      ? {
                          title: sidebarService.title,
                          description: sidebarService.excerpt,
                          href: `/diensten/${sidebarService.slug}/`,
                          icon: <BookOpen className="h-5 w-5" aria-hidden="true" />,
                          linkLabel: "Bekijk dienst",
                        }
                      : undefined
                  }
                />
              </aside>
            )}
          </div>
        </Container>
      </Section>

      {(relatedServices.length > 0 || relatedRegions.length > 0) && (
        <Section orbs="tl-br">
          <Container className="max-w-5xl flex flex-col gap-10">
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
        <Section orbs="tr-bl">
          <Container className="max-w-5xl">
            <h2 className="text-2xl font-bold mb-4">Artikels in deze reeks</h2>
            <BlogGrid posts={clusterPosts} />
          </Container>
        </Section>
      )}

      {clusterPosts.length === 0 && relatedPosts.length > 0 && (
        <Section orbs="tr-bl">
          <Container className="max-w-5xl">
            <h2 className="text-2xl font-bold mb-4">Gerelateerde artikels</h2>
            <BlogGrid posts={relatedPosts} />
          </Container>
        </Section>
      )}

      <CTASection
        title="Klaar om je project te bespreken?"
        description="Vraag een vrijblijvende offerte aan en ontdek wat VisualVibe voor jouw website kan doen."
      />
    </div>
  );
}
