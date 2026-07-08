import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "content", "kennisbank");

// The page template renders `title` as the page's H1 (via PageHero); MDX
// authors typically repeat it as a leading "# ..." line for readability in
// an editor/preview, so strip that one line here to avoid a duplicate H1.
function stripLeadingH1(content: string, title: string): string {
  const trimmed = content.trimStart();
  const firstLineMatch = trimmed.match(/^#\s+(.+)\n+/);
  if (firstLineMatch && firstLineMatch[1].trim() === title.trim()) {
    return trimmed.slice(firstLineMatch[0].length);
  }
  return content;
}

// Content briefs often reference an og/cover image before it's actually been
// shot/uploaded. Only expose the path if the file genuinely exists under
// /public, so consumers (BlogPreview, BlogPostingJsonLd) never point at a
// 404'ing image and can fall back cleanly instead.
function resolveLocalImage(imagePath: string | undefined): string | undefined {
  if (!imagePath || !imagePath.startsWith("/")) {
    return undefined;
  }
  const absolutePath = path.join(process.cwd(), "public", imagePath);
  return fs.existsSync(absolutePath) ? imagePath : undefined;
}

function readPostFile(filename: string): BlogPost {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  return {
    title: data.title,
    slug: data.slug,
    category: data.category,
    pillar: Boolean(data.pillar),
    author: data.author,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    readingTime: data.readingTime,
    excerpt: data.excerpt,
    content: stripLeadingH1(content, data.title),
    focusKeyword: data.focusKeyword,
    secondaryKeywords: data.secondaryKeywords,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    ogTitle: data.ogTitle,
    ogDescription: data.ogDescription,
    ogImage: resolveLocalImage(data.ogImage),
    robots: data.robots,
    clusterType: data.clusterType,
    parentPillar: data.parentPillar,
    relatedServices: data.relatedServices,
    relatedRegions: data.relatedRegions,
    relatedPosts: data.relatedPosts,
  };
}

let cachedPosts: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (cachedPosts) {
    return cachedPosts;
  }

  if (!fs.existsSync(CONTENT_DIR)) {
    cachedPosts = [];
    return cachedPosts;
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".mdx"));
  cachedPosts = files
    .map(readPostFile)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return cachedPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

/** Extracts the last non-empty path segment from an absolute site path, e.g. "/diensten/webdesign/" -> "webdesign". */
export function slugFromPath(sitePath: string): string {
  const segments = sitePath.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}

/** Sub-articles whose parentPillar resolves to the given pillar post's slug. */
export function getClusterPosts(pillarSlug: string): BlogPost[] {
  return getAllPosts().filter(
    (post) => post.parentPillar && slugFromPath(post.parentPillar) === pillarSlug
  );
}
