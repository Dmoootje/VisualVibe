import { Header, Footer } from "@/layouts";
import { QuoteModalProvider } from "@/components/quote";

/**
 * Chrome for the reguliere VisualVibe site: nav, footer en de offerte-modal.
 * Standalone brandpagina's (bv. /trouwfotograaf-limburg, WeddingVibe) leven
 * als sibling van deze groep en renderen hun eigen nav/footer.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <QuoteModalProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </QuoteModalProvider>
  );
}
