import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import "./sitemap.css";
import {
  Home,
  FileText,
  LayoutGrid,
  MapPin,
  Images,
  Building2,
  BookOpen,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";
import { services, serviceHref } from "@/data/services";
import { getSubservicesByParent } from "@/data/subservices";
import { regions } from "@/data/regions";
import { sectors } from "@/data/sectors";
import { realisatieCategories } from "@/data/realisatieCategories";
import { kennisbankCategories } from "@/data/kennisbankCategories";
import { getPostsByCategory, postHref, categoryHref } from "@/lib/kennisbank/posts";
import { businessConfig } from "@/config/business.config";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { PageAmbient } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo";

// pageMetadata wires canonical, og:url, twitter tags and the mapped OG image
// for /sitemap/ (src/data/ogImages.ts), which a hand-rolled object left out.
export const metadata: Metadata = pageMetadata({
  title: `Sitemap | ${businessConfig.displayName}`,
  description:
    "Volledige sitemap van VisualVibe: alle diensten, regio's, realisaties, sectoren en kennisbank-artikels overzichtelijk onder elkaar.",
  path: "/sitemap/",
});

type SmNode = { title: string; href: string; children?: SmNode[] };
type SmSection = {
  icon: ComponentType<LucideProps>;
  title: string;
  href: string;
  intro: string;
  nodes: SmNode[];
};

// A branch of the tree: nested <ul> with guide lines, each node clickable.
function TreeList({ nodes }: { nodes: SmNode[] }) {
  return (
    <ul className="vvsm-branch">
      {nodes.map((node) => (
        <li key={node.href}>
          <Link href={node.href} className="vvsm-node">
            <span className="vvsm-title">{node.title}</span>
            <span className="vvsm-path">{node.href}</span>
          </Link>
          {node.children && node.children.length > 0 && <TreeList nodes={node.children} />}
        </li>
      ))}
    </ul>
  );
}

export default function SitemapPage() {
  // Build the tree from the same data the site + XML sitemap use.
  const dienstenNodes: SmNode[] = services.map((service) => ({
    title: service.title,
    href: serviceHref(service),
    children: getSubservicesByParent(service.slug).map((sub) => ({
      title: sub.title,
      href: serviceHref(sub),
    })),
  }));

  const kennisbankNodes: SmNode[] = kennisbankCategories
    .map((category): SmNode | null => {
      const posts = getPostsByCategory(category.slug, "nl");
      if (posts.length === 0) return null;
      return {
        title: category.name,
        href: categoryHref(category.slug),
        children: posts.map((post) => ({ title: post.title, href: postHref(post) })),
      };
    })
    .filter((node): node is SmNode => node !== null);

  const sections: SmSection[] = [
    {
      icon: FileText,
      title: "Algemene pagina's",
      href: "/over-ons",
      intro: "De hoofd- en utility-pagina's van de site.",
      nodes: [
        { title: "Over ons", href: "/over-ons" },
        { title: "Contact", href: "/contact" },
        { title: "Offerte aanvragen", href: "/offerte-aanvragen" },
        { title: "Trouwfotograaf Limburg (WeddingVibe)", href: "/trouwfotograaf-limburg" },
        { title: "Privacybeleid", href: "/privacy" },
        { title: "Cookiebeleid", href: "/cookies" },
        { title: "Sitemap", href: "/sitemap" },
      ],
    },
    {
      icon: LayoutGrid,
      title: "Diensten",
      href: "/diensten",
      intro: "Alle hoofddiensten met hun subdiensten.",
      nodes: dienstenNodes,
    },
    {
      icon: MapPin,
      title: "Regio",
      href: "/regio",
      intro: "De werkgebieden waar VisualVibe actief is.",
      nodes: regions.map((region) => ({ title: region.title, href: `/regio/${region.slug}` })),
    },
    {
      icon: Images,
      title: "Realisaties",
      href: "/realisaties",
      intro: "Ons portfolio, opgedeeld per categorie.",
      nodes: realisatieCategories.map((category) => ({
        title: category.name,
        href: `/realisaties/${category.slug}`,
      })),
    },
    {
      icon: Building2,
      title: "Sectoren",
      href: "/sectoren",
      intro: "De sectoren waarvoor we werken.",
      nodes: sectors.map((sector) => ({ title: sector.title, href: `/sectoren/${sector.slug}` })),
    },
    {
      icon: BookOpen,
      title: "Kennisbank",
      href: "/kennisbank",
      intro: "Artikels en gidsen, gegroepeerd per categorie.",
      nodes: kennisbankNodes,
    },
  ];

  const countNodes = (nodes: SmNode[]): number =>
    nodes.reduce((sum, node) => sum + 1 + (node.children ? countNodes(node.children) : 0), 0);
  const totalPages = 1 + sections.reduce((sum, section) => sum + countNodes(section.nodes), 0);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Sitemap", path: "/sitemap" },
        ]}
      />
      <PageAmbient />

      <div className="relative z-10 mx-auto max-w-[980px] px-4 pb-24 pt-28 sm:px-8 sm:pt-32">
        {/* Header */}
        <header className="mb-12 max-w-2xl">
          <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
            <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#FF9A45]" />
            Sitemap
          </p>
          <h1 className="font-sora text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Alle pagina&apos;s op een rij
          </h1>
          <p className="mt-4 text-[15.5px] leading-relaxed text-white/60">
            De volledige structuur van de VisualVibe-website, van boven naar onder. Elke titel is
            klikbaar; het pad eronder toont waar de pagina zich bevindt. In totaal {totalPages}{" "}
            pagina&apos;s.
          </p>
        </header>

        {/* Home (top of the tree) */}
        <Link
          href="/"
          className="group mb-3 flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:border-[rgba(255,122,0,0.28)] hover:bg-[rgba(255,122,0,0.05)]"
        >
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-[rgba(255,122,0,0.24)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
            <Home className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <span className="min-w-0">
            <span className="block font-sora text-lg font-extrabold text-white">Home</span>
            <span className="block font-mono text-xs text-white/45 transition-colors group-hover:text-[#FF9A45]">
              /
            </span>
          </span>
        </Link>

        {/* Sections */}
        <div className="flex flex-col">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.href} className="border-t border-white/[0.06] py-8">
                <div className="mb-4 flex items-center gap-4">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-[rgba(255,122,0,0.24)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
                    <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={section.href} className="group inline-flex flex-col">
                      <span className="font-sora text-xl font-extrabold text-white transition-colors group-hover:text-[#FF9A45]">
                        {section.title}
                      </span>
                      <span className="font-mono text-xs text-white/45">{section.href}</span>
                    </Link>
                    <p className="mt-1 text-[13.5px] text-white/45">{section.intro}</p>
                  </div>
                  <span className="flex-none rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 font-mono text-[11px] font-semibold text-white/55">
                    {countNodes(section.nodes)}
                  </span>
                </div>
                <TreeList nodes={section.nodes} />
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
