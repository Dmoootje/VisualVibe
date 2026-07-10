import { businessConfig } from "@/config/business.config";
import { JsonLd } from "./JsonLd";

export type BlogPostingData = {
  title: string;
  description: string;
  url: string;
  coverImageUrl?: string | null;
  author: {
    name: string;
    url?: string;
    jobTitle?: string;
  };
  publishedAt: string;
  updatedAt: string;
  inLanguage: string;
  articleSection?: string;
  keywords?: string[];
  citations?: Array<{
    name: string;
    url: string;
    publisher?: string;
  }>;
};

function absoluteUrl(url: string): string {
  return new URL(url, businessConfig.url).toString();
}

export function BlogPostingJsonLd({ post }: { post: BlogPostingData }) {
  const organizationId = `${businessConfig.url}/#organization`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${post.url}#blogposting`,
        headline: post.title,
        description: post.description,
        url: post.url,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": post.url,
        },
        image: post.coverImageUrl ? absoluteUrl(post.coverImageUrl) : undefined,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        inLanguage: post.inLanguage,
        articleSection: post.articleSection,
        keywords: post.keywords?.join(", "),
        citation: post.citations?.map((citation) => ({
          "@type": "CreativeWork",
          name: citation.name,
          url: citation.url,
          publisher: citation.publisher
            ? {
                "@type": "Organization",
                name: citation.publisher,
              }
            : undefined,
        })),
        author: {
          "@type": "Person",
          name: post.author.name,
          url: post.author.url ? absoluteUrl(post.author.url) : undefined,
          jobTitle: post.author.jobTitle,
        },
        publisher: {
          "@type": "Organization",
          "@id": organizationId,
          name: businessConfig.displayName,
          url: businessConfig.url,
          logo: {
            "@type": "ImageObject",
            url: `${businessConfig.url}/logo.svg`,
          },
        },
      }}
    />
  );
}
