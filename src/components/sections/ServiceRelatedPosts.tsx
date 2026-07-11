import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getPostsByCategory } from "@/lib/kennisbank/posts";
import { postHref } from "@/lib/kennisbank/urls";

// Which kennisbank pillar feeds each service's "Uit de kennisbank" carousel.
const SERVICE_TO_CATEGORY: Record<string, string> = {
  webdesign: "webdesign",
  seo: "seo-geo",
  fotografie: "fotografie",
  videografie: "videografie",
  "drone-fpv": "drone",
  "3d-vr-ar": "3d-vr",
  podcasting: "podcasting",
  masterclasses: "masterclasses",
};

/**
 * "Uit de kennisbank": a horizontally-scrollable (CSS scroll-snap, no JS) row of
 * the service's related kennisbank articles. Strong internal linking from a
 * service to its pillar/cluster content, and extra GEO surface. Renders nothing
 * when the pillar has no live posts yet.
 */
export function ServiceRelatedPosts({
  serviceSlug,
  heading = "Uit de kennisbank",
  intro,
}: {
  serviceSlug: string;
  heading?: string;
  intro?: string;
}) {
  const categorySlug = SERVICE_TO_CATEGORY[serviceSlug];
  if (!categorySlug) return null;

  const posts = getPostsByCategory(categorySlug, "nl")
    .slice()
    .sort((a, b) => (a.pillar === b.pillar ? 0 : a.pillar ? -1 : 1))
    .slice(0, 6);
  if (posts.length === 0) return null;

  return (
    <section className="relative py-14 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
              <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#FF9A45]" />
              Kennisbank
            </p>
            <h2 className="font-sora text-[28px] font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[34px]">
              {heading}
            </h2>
            {intro && <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-white/60">{intro}</p>}
          </div>
          <Link
            href={`/kennisbank/${categorySlug}`}
            className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-xl border border-white/[0.14] px-[22px] py-3 text-sm font-bold text-white/85 transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white"
          >
            Alle artikels
            <ArrowRight className="h-[15px] w-[15px]" />
          </Link>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={postHref(post)}
              className="vg-vcard group flex w-[300px] flex-none snap-start flex-col overflow-hidden rounded-[18px] border border-white/[0.09] bg-white/[0.02] sm:w-[340px]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#141210]">
                {post.ogImage ? (
                  <Image
                    src={post.ogImage}
                    alt={post.heroImageAlt ?? post.title}
                    fill
                    sizes="340px"
                    className="vg-vthumb object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,rgba(255,90,0,0.16),transparent_60%)]" />
                )}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.12),transparent 42%,rgba(10,10,10,.72))" }} />
                <span className="absolute left-3.5 top-3.5 z-[2] inline-flex items-center rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,7,6,.62)] px-[11px] py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#FF9A45] backdrop-blur">
                  {post.pillar ? "Pillar" : post.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-sora text-[17px] font-bold leading-[1.28] text-white transition-colors group-hover:text-[#FF9A45]">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-white/60">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between pt-1">
                  {post.readingTime && (
                    <span className="font-mono text-[11px] font-semibold text-white/40">{post.readingTime}</span>
                  )}
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-[0.04em] text-white/70 transition-colors group-hover:text-[#FF9A45]">
                    LEES MEER
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
