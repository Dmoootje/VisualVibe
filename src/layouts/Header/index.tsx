import { getAllPosts, getPostsByCategory, isBlogLocale } from "@/lib/kennisbank/posts";
import { kennisbankCategories } from "@/data/kennisbankCategories";
import { Nav } from "@/components/nav/Nav";
import {
  getNavPillars,
  getNavRegions,
  getRealisatieCards,
  getSectorCards,
  getToolsCards,
  kennisbankCard,
  type NavCard,
} from "@/components/nav/navData";
import { GOOGLE_MAPS_PROFILE_URL, getGoogleRatingSummary } from "@/lib/reviews/google";

// Server component: builds the Kennisbank dropdown (only the categories that
// actually have posts - never article links, with an icon + description per
// card) and hands it to the client Nav. Apps & software is a Dutch curated topic
// hub: its articles keep their existing canonical URLs while the hub groups them.
export async function Header({ locale }: { locale: string }) {
  const publicLocale = locale === "en" ? "en" : "nl";
  const blogLocale = isBlogLocale(locale) ? locale : null;
  const localizedPosts = blogLocale ? getAllPosts({ locale: blogLocale }) : [];
  const kennisbankItems: NavCard[] = blogLocale
    ? kennisbankCategories
        .filter((category) =>
          category.slug === "software-op-maat"
            ? blogLocale === "nl"
            : getPostsByCategory(category.slug, blogLocale).length > 0
        )
        .map((category) => kennisbankCard(category, publicLocale))
    : [];

  const ratingSummary = await getGoogleRatingSummary();
  const googleRating = ratingSummary ? { ...ratingSummary, url: GOOGLE_MAPS_PROFILE_URL } : null;

  return (
    <Nav
      locale={publicLocale}
      pillars={getNavPillars(publicLocale)}
      regions={getNavRegions(publicLocale)}
      sectorCards={getSectorCards(publicLocale)}
      realisatieCards={getRealisatieCards(publicLocale)}
      toolsCards={getToolsCards(publicLocale)}
      kennisbankItems={kennisbankItems}
      kennisbankPostCount={localizedPosts.length}
      googleRating={googleRating}
    />
  );
}

export default Header;
