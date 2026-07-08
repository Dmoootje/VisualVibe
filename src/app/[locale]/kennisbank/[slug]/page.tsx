import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getAllPosts, getPostBySlug, slugFromPath } from "@/lib/kennisbank/posts";
import { getServiceBySlug } from "@/data/services";
import { getRegionBySlug } from "@/data/regions";
import { businessConfig } from "@/config/business.config";
import { Section, Container } from "@/components/ui";
import { PageHero, CTASection, ServiceGrid, RegionGrid } from "@/components/sections";
import { BreadcrumbJsonLd, BlogPostingJsonLd } from "@/components/seo";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: { absolute: post.seoTitle },
    description: post.seoDescription,
    openGraph: {
      title: post.ogTitle ?? post.seoTitle,
      description: post.ogDescription ?? post.seoDescription,
      images: post.ogImage ? [{ url: post.ogImage }] : undefined,
      type: "article",
    },
    robots: post.robots,
  };
}

export default async function KennisbankPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedServices = (post.relatedServices ?? [])
    .map((servicePath) => getServiceBySlug(slugFromPath(servicePath)))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  const relatedRegions = (post.relatedRegions ?? [])
    .map((regionPath) => getRegionBySlug(slugFromPath(regionPath)))
    .filter((region): region is NonNullable<typeof region> => Boolean(region));

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Kennisbank", path: "/kennisbank" },
          { name: post.title, path: `/kennisbank/${post.slug}` },
        ]}
      />
      <BlogPostingJsonLd
        post={{
          title: post.title,
          description: post.excerpt,
          url: `${businessConfig.url}/kennisbank/${post.slug}`,
          coverImageUrl: post.ogImage,
          authorName: post.author,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt ?? post.publishedAt,
        }}
      />

      <PageHero
        title={post.title}
        subtitle={post.excerpt}
        eyebrow={[post.category, post.readingTime].filter(Boolean).join(" · ")}
        backLink={{ label: "Kennisbank", href: "/kennisbank" }}
      />

      <Section orbs="none">
        <Container className="max-w-3xl">
          <div className="mb-8 flex items-center gap-3 text-sm text-white/50">
            <span>{post.author}</span>
            <span>&middot;</span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString("nl-BE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-blockquote:border-amber-500 prose-blockquote:text-white/80 prose-code:text-amber-300 prose-hr:border-white/10">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </Container>
      </Section>

      {(relatedServices.length > 0 || relatedRegions.length > 0) && (
        <Section orbs="tl-br">
          <Container className="max-w-3xl flex flex-col gap-10">
            {relatedServices.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Gerelateerde diensten</h2>
                <ServiceGrid services={relatedServices} />
              </div>
            )}
            {relatedRegions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Gerelateerde regio's</h2>
                <RegionGrid regions={relatedRegions} showIntro={false} />
              </div>
            )}
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
