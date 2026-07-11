import { getLocale } from "next-intl/server";
import { getAllPosts, getPostsByCategory, isBlogLocale } from "@/lib/kennisbank/posts";
import { kennisbankCategories } from "@/data/kennisbankCategories";
import { Nav } from "@/components/nav/Nav";
import { kennisbankCard, type NavCard } from "@/components/nav/navData";

// Server component: builds the Kennisbank dropdown (only the categories that
// actually have posts - never article links, with an icon + description per
// card) and hands it to the client Nav. Pillars/regio/sectoren/realisaties are
// pure data the client Nav imports itself.
export async function Header() {
  const locale = await getLocale();
  const blogLocale = isBlogLocale(locale) ? locale : null;
  const localizedPosts = blogLocale ? getAllPosts({ locale: blogLocale }) : [];
  const kennisbankItems: NavCard[] = blogLocale
    ? kennisbankCategories
        .filter((category) => getPostsByCategory(category.slug, blogLocale).length > 0)
        .map(kennisbankCard)
    : [];

  return <Nav kennisbankItems={kennisbankItems} kennisbankPostCount={localizedPosts.length} />;
}

export default Header;
