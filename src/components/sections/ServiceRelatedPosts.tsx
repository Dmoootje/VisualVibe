import Image from "next/image";
import { ArrowRight, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getAllPosts, getPostsByCategory } from "@/lib/kennisbank/posts";
import { postHref } from "@/lib/kennisbank/urls";
import { getAuthorPhotoMap } from "@/lib/firestore/profiles";
import { getServiceBySlug, serviceHref } from "@/data/services";
import type { BlogPost } from "@/types/blog";

// Which kennisbank pillar feeds each service's "Uit de kennisbank" section.
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

/** Auteursvermelding (foto uit admin-profiel, anders User-icoon) + leestijd. */
export type AuthorMetaProps = {
  author?: string;
  authorImage?: string;
  readingTime?: string;
  className?: string;
};

export function AuthorMeta({
  author,
  authorImage,
  readingTime,
  className = "",
}: AuthorMetaProps) {
  if (!author && !readingTime) return null;
  return (
    <span className={`flex min-w-0 items-center gap-1.5 font-mono font-semibold text-white/65 ${className}`}>
      {author && (
        <>
          {authorImage ? (
            <Image
              src={authorImage}
              alt={`Profielfoto van ${author}`}
              width={28}
              height={28}
              className="h-4 w-4 shrink-0 rounded-full border border-[#ff7500]/40 object-cover"
              aria-hidden="true"
            />
          ) : (
            <User className="h-3 w-3 shrink-0 text-[#ff7500]" aria-hidden="true" />
          )}
          <span className="truncate" aria-label={`Auteur: ${author}`}>
            {author}
          </span>
        </>
      )}
      {readingTime && <span className="shrink-0">{author ? `· ${readingTime}` : readingTime}</span>}
    </span>
  );
}

/** Compact article card for the 6-up grid beside the pillar. */
function ArticleTile({ post, authorImage }: { post: BlogPost; authorImage?: string }) {
  return (
    <Link
      href={postHref(post)}
      locale="nl"
      className="group flex flex-col overflow-hidden rounded-[16px] border border-white/[0.09] bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,122,0,0.34)] hover:shadow-[0_24px_50px_-24px_rgba(255,90,0,0.5)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#141210]">
        {post.featuredImage ?? post.ogImage ? (
          <Image src={(post.featuredImage ?? post.ogImage) as string} alt={post.heroImageAlt ?? post.title} fill sizes="(max-width:1024px) 45vw, 320px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,rgba(255,90,0,0.16),transparent_60%)]" />
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.1),transparent 50%,rgba(10,10,10,.6))" }} />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-sora text-[15px] font-bold leading-[1.3] text-white transition-colors line-clamp-2 group-hover:text-[#FF9A45]">
          {post.title}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <AuthorMeta
            author={post.author}
            authorImage={authorImage}
            readingTime={post.readingTime}
            className="text-[10.5px]"
          />
          <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10.5px] font-bold tracking-[0.04em] text-white/60 transition-colors group-hover:text-[#FF9A45]">
            LEES MEER
            <ArrowRight aria-hidden="true" className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * "Uit de kennisbank": the service's pillar guide as one large block with up to
 * six supporting articles in a grid beside it. Strong internal linking from a
 * service to its cluster content, and extra GEO surface. Renders on every
 * service page; returns nothing when the pillar has no live posts yet.
 */
export async function ServiceRelatedPosts({
  serviceSlug,
  fallbackServiceSlug,
  heading = "Uit de kennisbank",
  intro,
}: {
  serviceSlug: string;
  fallbackServiceSlug?: string;
  heading?: string;
  intro?: string;
}) {
  const service = getServiceBySlug(serviceSlug);
  const categorySource = fallbackServiceSlug ?? service?.parentSlug ?? serviceSlug;
  const categorySlug = SERVICE_TO_CATEGORY[categorySource];
  if (!categorySlug) return null;

  const categoryPosts = getPostsByCategory(categorySlug, "nl");

  const normalizePath = (path: string) => `/${path.split("/").filter(Boolean).join("/")}`;
  const canonicalServicePath = service ? normalizePath(serviceHref(service)) : undefined;
  const directlyRelated = canonicalServicePath
    ? getAllPosts({ locale: "nl" }).filter((post) =>
        post.relatedServices?.some((path) => normalizePath(path) === canonicalServicePath),
      )
    : [];
  if (directlyRelated.length === 0 && categoryPosts.length === 0) return null;

  // A direct sub-service relation wins. If none exists, the parent category's
  // pillar is the useful fallback. Remaining direct articles stay ahead of the
  // broader category articles in the supporting grid.
  const lead = directlyRelated[0] ?? categoryPosts.find((post) => post.pillar) ?? categoryPosts[0];
  if (!lead) return null;
  const directSlugs = new Set(directlyRelated.map((post) => post.slug));
  const others = [
    ...directlyRelated.filter((post) => post.slug !== lead.slug),
    ...categoryPosts.filter((post) => post.slug !== lead.slug && !directSlugs.has(post.slug)),
  ].slice(0, 6);

  // Na de early-returns, zodat pagina's zonder sectie geen Firestore-read doen.
  const authorImages = await getAuthorPhotoMap();

  return (
    <section className="relative py-14 sm:py-16">
      <div className="container mx-auto px-2.5 sm:px-4">
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
            locale="nl"
            className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-xl border border-white/[0.14] px-[22px] py-3 text-sm font-bold text-white/85 transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white"
          >
            Alle artikels
            <ArrowRight aria-hidden="true" className="h-[15px] w-[15px]" />
          </Link>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {/* Pillar: large lead block */}
          <Link
            href={postHref(lead)}
            locale="nl"
            className={`group relative flex flex-col overflow-hidden rounded-[20px] border border-white/[0.09] bg-white/[0.02] transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(255,122,0,0.34)] hover:shadow-[0_34px_70px_-30px_rgba(255,90,0,0.5)] ${
              others.length > 0 ? "lg:w-[38%] lg:flex-none" : "w-full"
            }`}
          >
            <div className="relative min-h-[220px] flex-1 overflow-hidden bg-[#141210]">
              {lead.featuredImage ?? lead.ogImage ? (
                <Image src={(lead.featuredImage ?? lead.ogImage) as string} alt={lead.heroImageAlt ?? lead.title} fill sizes="(max-width:1024px) 100vw, 480px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,rgba(255,90,0,0.18),transparent_62%)]" />
              )}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,10,10,.14),transparent 44%,rgba(10,10,10,.72))" }} />
              <span className="absolute left-4 top-4 z-[2] inline-flex items-center rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,7,6,.62)] px-[11px] py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#FF9A45] backdrop-blur">
                {lead.pillar ? "Complete gids" : "Uitgelicht"}
              </span>
            </div>
            <div className="flex flex-col p-6">
              <h3 className="font-sora text-[21px] font-extrabold leading-[1.16] tracking-[-0.01em] text-white transition-colors group-hover:text-[#FF9A45]">
                {lead.title}
              </h3>
              <p className="mt-2.5 line-clamp-3 text-[14px] leading-relaxed text-white/60">{lead.excerpt}</p>
              <div className="mt-4 flex items-center justify-between gap-2 pt-1">
                <AuthorMeta
                  author={lead.author}
                  authorImage={authorImages[lead.author]}
                  readingTime={lead.readingTime}
                  className="text-[11px]"
                />
                <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] font-bold tracking-[0.04em] text-white/70 transition-colors group-hover:text-[#FF9A45]">
                  {lead.pillar ? "LEES DE GIDS" : "LEES MEER"}
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Supporting articles: up to six in a 2-column grid */}
          {others.length > 0 && (
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              {others.map((post) => (
                <ArticleTile key={post.slug} post={post} authorImage={authorImages[post.author]} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
