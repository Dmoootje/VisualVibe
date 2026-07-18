import { Header, Footer } from "@/layouts";
import { QuoteModalController } from "@/components/quote";
import { setRequestLocale } from "next-intl/server";

/**
 * Chrome for the reguliere VisualVibe site: nav, footer en de offerte-modal.
 * Standalone brandpagina's (bv. /trouwfotograaf-limburg, WeddingVibe) leven
 * als sibling van deze groep en renderen hun eigen nav/footer.
 */
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header locale={locale} />
      <main>{children}</main>
      <Footer />
      <QuoteModalController />
    </>
  );
}
