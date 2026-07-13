import type { Metadata } from "next";
import { Inter, Sora, Manrope, JetBrains_Mono, Cormorant_Garamond, Great_Vibes, Lora } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CookieConsent, CONSENT_STORAGE_KEY } from "@/components/consent";
import "../globals.css";
import { ThemeProvider } from "@/providers";
import { SiteBackground } from "@/components/ui";
import { routing } from "@/i18n/routing";
import { LocalBusinessJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo";
import { SectorIconSprite } from "@/components/sectors";
import { businessConfig } from "@/config/business.config";

const inter = Inter({ subsets: ["latin"] });
// Handoff typography for the Subdiensten cards: Sora (titles) + Manrope (body),
// exposed as CSS variables so scoped components can opt in without changing the
// site-wide Inter default.
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });
// Elegant serif: WeddingVibe cross-promo card (Over ons) + de WeddingVibe one-pager.
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
// WeddingVibe one-pager (/trouwfotograaf-limburg): script-accenten + body-serif.
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-great-vibes", display: "swap" });
const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-lora", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const homeTitle = "Webdesign, foto, video & SEO in Limburg | VisualVibe";

export const metadata: Metadata = {
  metadataBase: new URL(businessConfig.url),
  title: {
    default: homeTitle,
    template: `%s | ${businessConfig.displayName}`,
  },
  description: businessConfig.description,
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
    images: [
      {
        url: "/image.jpg",
        width: 1200,
        height: 630,
        alt: businessConfig.displayName,
      },
    ],
    type: "website",
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

  // GA4 loads only on the public site (admin has its own layout tree) and only
  // when the id is set - so local dev without it never sends hits. The
  // @next/third-parties tag defers gtag and fires page_views on client-side
  // route changes, which the raw gtag snippet does not.
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Google Consent Mode v2: deny every signal by default, before gtag.js loads,
  // so no analytics cookies are set until the visitor accepts in the banner. A
  // previously stored "granted" is re-applied here so the choice sticks across
  // page loads. Runs as a plain inline <head> script (parsed before the
  // afterInteractive GA tag), which is the earliest and most reliable point.
  const consentDefaultScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});try{if(localStorage.getItem('${CONSENT_STORAGE_KEY}')==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {gaId && (
          // eslint-disable-next-line react/no-danger
          <script dangerouslySetInnerHTML={{ __html: consentDefaultScript }} />
        )}
      </head>
      <body className={`${inter.className} ${sora.variable} ${manrope.variable} ${jetbrainsMono.variable} ${cormorant.variable} ${greatVibes.variable} ${lora.variable} bg-[#0a0a0a] text-white`}>
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
        {/* GA is just script tags - no intl dependency - so it stays outside. */}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
