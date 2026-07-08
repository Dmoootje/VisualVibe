import { businessConfig } from "@/config/business.config";
import { JsonLd } from "./JsonLd";

export type BlogPostingData = {
  title: string;
  description: string;
  url: string;
  coverImageUrl?: string | null;
  authorName: string;
  publishedAt: string;
  updatedAt: string;
};

export function BlogPostingJsonLd({ post }: { post: BlogPostingData }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        mainEntityOfPage: post.url,
        image: post.coverImageUrl ?? undefined,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
          "@type": "Person",
          name: post.authorName,
        },
        publisher: {
          "@type": "Organization",
          name: businessConfig.displayName,
          logo: {
            "@type": "ImageObject",
            url: `${businessConfig.url}/logo.png`,
          },
        },
      }}
    />
  );
}
