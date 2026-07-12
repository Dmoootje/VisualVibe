import type { Metadata } from "next";
import { businessConfig } from "@/config/business.config";
import { localizedPath } from "@/lib/kennisbank/posts";

// One builder for complete per-page metadata so every indexable page emits a
// self-referencing canonical, a page-specific OpenGraph + Twitter card (never
// the inherited homepage OG), and an optional noindex - without repeating the
// same object shape in each generateMetadata.

const DEFAULT_OG_IMAGE = "/image.jpg";

export type PageMetadataInput = {
  /** Absolute title (rendered as-is, not run through the "%s | VisualVibe" template). */
  title: string;
  description: string;
  keywords?: string[];
  /** Canonical path with a leading and trailing slash, e.g. "/diensten/webdesign/". */
  path: string;
  /** OG/Twitter image URL (absolute or root-relative); defaults to the site image. */
  ogImage?: string;
  /** Keep the page reachable but out of the index (e.g. an empty realisatie category). */
  noindex?: boolean;
};

export function pageMetadata({
  title,
  description,
  keywords,
  path,
  ogImage,
  noindex,
}: PageMetadataInput): Metadata {
  // Marketing pages exist in Dutch only: the /fr and /en routes render the
  // same Dutch content, and the locale-less URL 308-redirects to /be. So the
  // canonical (and OG url) always points at the real published nl URL under
  // /be, for every locale.
  const url = `${businessConfig.url}${localizedPath("nl", path)}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: businessConfig.displayName,
      locale: "nl_BE",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
