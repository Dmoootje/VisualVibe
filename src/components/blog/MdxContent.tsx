import type { AnchorHTMLAttributes, ComponentType } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { BlogProse } from "./BlogProse";
import { BlogCTA } from "./BlogCTA";
import { BlogImage } from "./BlogImage";
import { ChecklistBlock } from "./ChecklistBlock";
import { ComparisonTable } from "./ComparisonTable";
import { ContentSection } from "./ContentSection";
import { DoDontGrid } from "./DoDontGrid";
import { FaqAccordion } from "./FaqAccordion";
import { FeatureCard, FeatureGrid } from "./FeatureGrid";
import { LeadIntro } from "./LeadIntro";
import { NoticeBox } from "./NoticeBox";
import { QuoteBlock } from "./QuoteBlock";
import { RelatedArticles } from "./RelatedArticles";
import { RelatedRegions } from "./RelatedRegions";
import { RelatedServices } from "./RelatedServices";
import { RoadmapBlock } from "./RoadmapBlock";
import { StatGrid } from "./StatGrid";

const configuredLocalePrefixes =
  routing.localePrefix &&
  typeof routing.localePrefix === "object" &&
  "prefixes" in routing.localePrefix &&
  routing.localePrefix.prefixes
    ? Object.values(routing.localePrefix.prefixes).filter(
        (prefix): prefix is string => typeof prefix === "string"
      )
    : [];

const localePrefixes: string[] = Array.from(
  new Set([
    ...routing.locales.map((locale) => `/${locale}`),
    ...configuredLocalePrefixes,
  ])
).sort((a, b) => b.length - a.length);

/**
 * MDX links are authored without a locale prefix. Strip one when it is present
 * anyway, so next-intl never turns `/be/...` into `/be/be/...`.
 */
function withoutLocalePrefix(href: string) {
  const suffixStart = href.search(/[?#]/);
  const pathname = suffixStart === -1 ? href : href.slice(0, suffixStart);
  const suffix = suffixStart === -1 ? "" : href.slice(suffixStart);

  for (const prefix of localePrefixes) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return `${pathname.slice(prefix.length) || "/"}${suffix}`;
    }
  }

  return href;
}

function safeExternalRel(rel: string | undefined, opensNewWindow: boolean) {
  const values = new Set((rel ?? "").split(/\s+/).filter(Boolean));
  values.add("external");

  if (opensNewWindow) {
    values.add("noopener");
    values.add("noreferrer");
  }

  return Array.from(values).join(" ");
}

/** Keep article routes locale-aware while retaining native anchor semantics. */
function MdxLink({
  href,
  children,
  className,
  rel,
  target,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const linkClassName = cn(
    "text-[#ff7500] underline-offset-[3px] transition-colors hover:text-[#ff9440] hover:underline",
    className
  );

  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("?") ||
    /^(?:mailto|tel):/i.test(href)
  ) {
    return (
      <a
        className={linkClassName}
        href={href}
        rel={rel}
        target={target}
        {...props}
      >
        {children}
      </a>
    );
  }

  const isInternalRoute = href.startsWith("/") && !href.startsWith("//");
  if (isInternalRoute) {
    return (
      <Link
        className={linkClassName}
        href={withoutLocalePrefix(href)}
        rel={rel}
        target={target}
        {...props}
      >
        {children}
      </Link>
    );
  }

  const isExternal = /^(?:https?:)?\/\//i.test(href);
  if (isExternal) {
    const externalTarget = target ?? "_blank";
    return (
      <a
        className={linkClassName}
        href={href}
        rel={safeExternalRel(rel, externalTarget === "_blank")}
        target={externalTarget}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      className={linkClassName}
      href={href}
      rel={rel}
      target={target}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * This boundary lets prose CSS distinguish authored Markdown from a block's
 * own semantic markup. It intentionally adds no visual styling.
 */
function withProseBoundary<Props extends object>(Component: ComponentType<Props>) {
  return function MdxBlogBlock(props: Props) {
    return (
      <div data-blog-block="">
        <Component {...props} />
      </div>
    );
  };
}

// Blog blocks made available as JSX tags inside .mdx article bodies. Headings
// deliberately stay native so rehype-slug can provide stable TOC anchors.
const components = {
  a: MdxLink,
  BlogCTA: withProseBoundary(BlogCTA),
  BlogImage: withProseBoundary(BlogImage),
  ChecklistBlock: withProseBoundary(ChecklistBlock),
  ComparisonTable: withProseBoundary(ComparisonTable),
  ContentSection: withProseBoundary(ContentSection),
  DoDontGrid: withProseBoundary(DoDontGrid),
  FaqAccordion: withProseBoundary(FaqAccordion),
  FeatureCard,
  FeatureGrid: withProseBoundary(FeatureGrid),
  LeadIntro: withProseBoundary(LeadIntro),
  NoticeBox: withProseBoundary(NoticeBox),
  QuoteBlock: withProseBoundary(QuoteBlock),
  RelatedArticles: withProseBoundary(RelatedArticles),
  RelatedRegions: withProseBoundary(RelatedRegions),
  RelatedServices: withProseBoundary(RelatedServices),
  RoadmapBlock: withProseBoundary(RoadmapBlock),
  StatGrid: withProseBoundary(StatGrid),
};

/**
 * Renders an article body (markdown or MDX-with-blocks) inside the VisualVibe
 * prose styling. Authors can drop any of the blocks above straight into the
 * .mdx file, e.g. `<NoticeBox variant="tip">…</NoticeBox>`.
 */
export function MdxContent({ source }: { source: string }) {
  return (
    <BlogProse>
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </BlogProse>
  );
}
