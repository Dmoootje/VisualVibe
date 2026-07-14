import { getAllPosts, getPostsByCategory, isBlogLocale } from "@/lib/kennisbank/posts";
import { kennisbankCategories } from "@/data/kennisbankCategories";
import { regions } from "@/data/regions";
import { Nav } from "@/components/nav/Nav";
import {
  kennisbankCard,
  pillars,
  realisatieCards,
  sectorCards,
  type NavCard,
} from "@/components/nav/navData";

// Server component: builds the Kennisbank dropdown (only the categories that
// actually have posts - never article links, with an icon + description per
// card) and hands it to the client Nav. Apps & software is a curated topic hub:
// its articles keep their existing canonical URLs while the hub groups them.
export function Header({ locale }: { locale: string }) {
  const blogLocale = isBlogLocale(locale) ? locale : null;
  const localizedPosts = blogLocale ? getAllPosts({ locale: blogLocale }) : [];
  const kennisbankItems: NavCard[] = blogLocale
    ? kennisbankCategories
        .filter(
          (category) =>
            category.slug === "software-op-maat" ||
            getPostsByCategory(category.slug, blogLocale).length > 0
        )
        .map(kennisbankCard)
    : [];

  const navRegions = regions.map(({ slug, title, type }) => ({ slug, title, type }));

  return (
    <Nav
      pillars={pillars}
      regions={navRegions}
      sectorCards={sectorCards}
      realisatieCards={realisatieCards}
      kennisbankItems={kennisbankItems}
      kennisbankPostCount={localizedPosts.length}
    />
  );
}

export default Header;
