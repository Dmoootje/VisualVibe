import { businessConfig } from "@/config/business.config";
import { services, serviceHref } from "@/data/services";
import { subservices } from "@/data/subservices";
import { regions } from "@/data/regions";
import { sectors } from "@/data/sectors";
import { kennisbankCategories } from "@/data/kennisbankCategories";
import { blogPosts } from "@/data/blog";
import { categoryHref, localizedPath, postHref } from "@/lib/kennisbank/posts";

// Served at /llms.txt (llmstxt.org). A concise, machine-readable map of the
// site for AI answer engines (AEO/GEO): title, one-line summary, then curated
// link sections. Data-driven so it stays in sync with diensten, subdiensten,
// regio's, sectoren en kennisbank - exactly like sitemap.ts/robots.ts.
export const dynamic = "force-static";

const { url } = businessConfig;

/** Absolute canonical Dutch URL for a site-relative path (published under /be). */
function abs(path: string): string {
  const withSlash = path.endsWith("/") ? path : `${path}/`;
  return `${url}${localizedPath("nl", withSlash)}`;
}

function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](\s|$)/);
  return (match ? match[0] : text).trim();
}

function line(name: string, path: string, description?: string): string {
  return description
    ? `- [${name}](${abs(path)}): ${description}`
    : `- [${name}](${abs(path)})`;
}

function build(): string {
  const out: string[] = [];

  const areas = businessConfig.serviceArea;
  const areaText =
    areas.length > 1
      ? `${areas.slice(0, -1).join(", ")} en ${areas[areas.length - 1]}`
      : areas[0];

  out.push("# VisualVibe");
  out.push("");
  out.push(`> ${businessConfig.description} Eén Belgisch aanspreekpunt voor je volledige online uitstraling.`);
  out.push("");
  out.push(
    `VisualVibe helpt KMO's en organisaties in ${areaText} groeien met een snelle, vindbare website en sterk beeldmateriaal. Oprichter: ${businessConfig.founder}. Gevestigd in ${businessConfig.address.addressLocality} (${businessConfig.address.addressRegion}). De site is Nederlandstalig en gepubliceerd onder /be; alle onderstaande links verwijzen naar de canonieke Nederlandse pagina's.`
  );
  out.push("");

  // Diensten: elke hoofddienst met zijn subdiensten eronder.
  out.push("## Diensten");
  out.push("");
  for (const service of services) {
    const children = subservices.filter((sub) => sub.parentSlug === service.slug);
    out.push(`### ${service.title}`);
    if (service.excerpt) out.push(service.excerpt);
    out.push(line(`${service.title} (overzicht)`, serviceHref(service)));
    for (const sub of children) {
      out.push(line(sub.title, serviceHref(sub), sub.excerpt));
    }
    out.push("");
  }

  out.push("## Regio's");
  for (const region of regions) {
    out.push(line(region.title, `/regio/${region.slug}`, firstSentence(region.intro)));
  }
  out.push("");

  out.push("## Sectoren");
  for (const sector of sectors) {
    out.push(line(sector.title, `/sectoren/${sector.slug}`, firstSentence(sector.intro)));
  }
  out.push("");

  out.push("## Realisaties");
  out.push(line("Realisaties", "/realisaties", "Portfolio van websites, fotografie, video, drone en 3D-projecten."));
  out.push("");

  // Kennisbank: overzicht + categorieën die effectief content hebben.
  const nlPosts = blogPosts.filter(
    (post) => post.locale === "nl" && !post.robots?.includes("noindex")
  );
  const activeCategorySlugs = new Set(nlPosts.map((post) => post.categorySlug));
  out.push("## Kennisbank");
  out.push(line("Kennisbank (overzicht)", "/kennisbank", "Gidsen en artikels over webdesign, SEO, GEO/AEO, fotografie, video en meer."));
  for (const category of kennisbankCategories) {
    if (!activeCategorySlugs.has(category.slug)) continue;
    out.push(line(category.name, categoryHref(category.slug), category.description));
  }
  out.push("");

  // Pillar-gidsen: de diepgaande, citeerbare hoofdartikels (sterk voor GEO/AEO).
  const pillars = nlPosts.filter((post) => post.pillar);
  if (pillars.length > 0) {
    out.push("## Kennisbank: pillar-gidsen");
    for (const post of pillars) {
      out.push(line(post.title, postHref(post), post.excerpt));
    }
    out.push("");
  }

  out.push("## Contact & bedrijf");
  out.push(line("Over ons", "/over-ons"));
  out.push(line("Contact", "/contact"));
  out.push(line("Offerte aanvragen", "/offerte-aanvragen"));
  out.push("");

  out.push("## Optioneel");
  out.push(line("WeddingVibe - trouwfotografie & huwelijksvideo", "/trouwfotograaf-limburg"));
  out.push(line("Privacybeleid", "/privacy"));
  out.push(line("Cookiebeleid", "/cookies"));
  out.push(line("Sitemap", "/sitemap"));
  out.push("");

  return out.join("\n");
}

export function GET(): Response {
  return new Response(build(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
