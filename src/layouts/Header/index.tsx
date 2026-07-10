import { getLocale } from "next-intl/server";
import { getAllPosts, getPostsByCategory, isBlogLocale } from "@/lib/kennisbank/posts";
import { kennisbankCategories } from "@/data/kennisbankCategories";
import { Nav } from "@/components/nav/Nav";
import type { NavLink } from "@/components/nav/navData";

// Server component: builds the Kennisbank dropdown (hub + only the categories
// that actually have posts - never article links) and hands it to the client
// Nav. Pillars/regio/sectoren are pure data the client Nav imports itself.
export async function Header() {
  const locale = await getLocale();
  const hasLocalizedPosts = isBlogLocale(locale) && getAllPosts({ locale }).length > 0;
  const kennisbankItems: NavLink[] = hasLocalizedPosts
    ? [
        { name: "Alle artikels", href: "/kennisbank" },
        ...kennisbankCategories
          .filter((category) => getPostsByCategory(category.slug, locale).length > 0)
          .map((category) => ({ name: category.name, href: `/kennisbank/${category.slug}` })),
      ]
    : [];

  return <Nav kennisbankItems={kennisbankItems} />;
}

export default Header;
