import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
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

// Blog blocks made available as JSX tags inside .mdx article bodies. Base
// elements (h1…hr) are styled via the .blog-prose wrapper, so only the custom
// components need mapping here.
const components = {
  BlogCTA,
  BlogImage,
  ChecklistBlock,
  ComparisonTable,
  ContentSection,
  DoDontGrid,
  FaqAccordion,
  FeatureCard,
  FeatureGrid,
  LeadIntro,
  NoticeBox,
  QuoteBlock,
  RelatedArticles,
  RelatedRegions,
  RelatedServices,
  RoadmapBlock,
  StatGrid,
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
