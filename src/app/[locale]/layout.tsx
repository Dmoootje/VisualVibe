import type { Metadata } from "next";
import { Inter, Sora, Manrope, JetBrains_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { ThemeProvider } from "@/providers";
import { Header, Footer } from "@/layouts";
import { routing } from "@/i18n/routing";
import { LocalBusinessJsonLd, OrganizationJsonLd } from "@/components/seo";
import { SectorIconSprite } from "@/components/sectors";
import { businessConfig } from "@/config/business.config";

const inter = Inter({ subsets: ["latin"] });
// Handoff typography for the Subdiensten cards: Sora (titles) + Manrope (body),
// exposed as CSS variables so scoped components can opt in without changing the
// site-wide Inter default.
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const homeTitle = "Creatief mediabureau voor webdesign, foto, video en SEO in Limburg | VisualVibe";

export const metadata: Metadata = {
  metadataBase: new URL(businessConfig.url),
  title: {
    default: homeTitle,
    template: `%s | ${businessConfig.displayName}`,
  },
  description: businessConfig.description,
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: homeTitle,
    description: businessConfig.description,
    images: [
      {
        url: "/image.png",
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Add any other head tags if needed, metadata object handles common ones */}
      </head>
      <body className={`${inter.className} ${sora.variable} ${manrope.variable} ${jetbrainsMono.variable} bg-black text-white`}>
        <SectorIconSprite />
        <OrganizationJsonLd />
        <LocalBusinessJsonLd />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
