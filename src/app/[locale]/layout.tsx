import type { Metadata } from "next";
import { Inter, Sora, Manrope, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ConsentAnalytics, CookieConsent } from "@/components/consent";
import "../globals.css";
import { ThemeProvider } from "@/providers";
import { SiteBackground } from "@/components/ui";
import { routing } from "@/i18n/routing";
import { LocalBusinessJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo";
import { SectorIconSprite } from "@/components/sectors";
import { businessConfig } from "@/config/business.config";

const inter = Inter({ subsets: ["latin"], display: "swap" });
// Handoff typography for the Subdiensten cards: Sora (titles) + Manrope (body),
// exposed as CSS variables so scoped components can opt in without changing the
// site-wide Inter default. Only Inter is globally preloaded. The optional
// families still load on demand when a component actually uses their variable.
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap", preload: false });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", preload: false });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap", preload: false });
// Elegant serif: WeddingVibe cross-promo card (Over ons) + de WeddingVibe one-pager.
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap", preload: false });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const homeTitle = "Webdesign, foto, video & SEO in Limburg | VisualVibe";
const defaultOgImage = "/api/og";
const dutchHomeUrl = `${businessConfig.url}/be/`;

export const metadata: Metadata = {
  metadataBase: new URL(businessConfig.url),
  applicationName: businessConfig.displayName,
  title: {
    default: homeTitle,
    template: `%s | ${businessConfig.displayName}`,
  },
  description: businessConfig.description,
  authors: [{ name: businessConfig.founder, url: businessConfig.url }],
  creator: businessConfig.founder,
  publisher: businessConfig.displayName,
  category: "business",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: homeTitle,
    description: businessConfig.description,
    url: dutchHomeUrl,
    siteName: businessConfig.displayName,
    locale: "nl_BE",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${businessConfig.displayName}, creatief mediabureau in Limburg`,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: businessConfig.description,
    images: [defaultOgImage],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  // The client consent controller never requests gtag.js before an explicit
  // analytics choice is stored. Without an id, local development stays inert.
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} ${sora.variable} ${manrope.variable} ${jetbrainsMono.variable} ${cormorant.variable} bg-[#0a0a0a] text-white`}>
        {/* Ahrefs Web Analytics (cookieloos, geen persoonsgegevens; staat daarom
            niet achter de consent-banner). Als plain async script gerenderd:
            React 19 hoist plaatst hem server-side in de <head>, zichtbaar voor
            de Ahrefs-verificatie, zonder render-blocking. */}
        <script
          async
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="JFU/1WVq2PehJ+OTBgN9kg"
        />
        <SiteBackground />
        <SectorIconSprite />
        <OrganizationJsonLd />
        <LocalBusinessJsonLd />
        <WebSiteJsonLd />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          {/* Inside the intl provider: the banner uses next-intl <Link>, which
              needs the locale context (it opens client-side, after hydration). */}
          {gaId && <CookieConsent />}
        </NextIntlClientProvider>
        {gaId && <ConsentAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
