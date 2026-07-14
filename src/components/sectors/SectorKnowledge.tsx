import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section, Container } from "@/components/ui";
import { BlogCard } from "@/features/home/BlogPreview/components/BlogCard";
import { toBlogCardPost } from "@/lib/kennisbank/blogCard";
import type { BlogPost } from "@/types";

/**
 * "Uit de kennisbank": relevance-scored articles (see scoreSectorPosts) in the
 * homepage BlogPreview card style. Hidden entirely when nothing relevant
 * exists; never padded with random posts.
 */
export function SectorKnowledge({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <Section className="py-10 sm:py-14 md:py-16">
      <Container>
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
              <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
              Kennisbank
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Lees meer over online groeien in jouw sector
            </h2>
          </div>
          <Link
            href="/kennisbank"
            className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-xl border border-white/[0.14] px-[22px] py-3 text-sm font-bold text-white/85 transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white sm:self-end"
          >
            Alle artikels
            <ArrowRight className="h-[15px] w-[15px]" />
          </Link>
        </div>
        {/* Same grid + card as the homepage BlogPreview. BlogCard is a client
            component; project to the slim BlogCardPost so the full MDX `content`
            and frontmatter arrays never ship in the RSC payload (the card only
            renders meta/excerpt/image). */}
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <BlogCard key={post.slug} post={toBlogCardPost(post)} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
