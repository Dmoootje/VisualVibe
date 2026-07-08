import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { ThemeProvider } from "@/providers";
import { Header, Footer } from "@/layouts";
import { routing } from "@/i18n/routing";
import { LocalBusinessJsonLd, OrganizationJsonLd } from "@/components/seo";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Nova - Elevate Your Digital Experience",
  description:
    "Transform how you work with our AI-powered platform. Automate workflows, gain insights, and boost productivity.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  generator: "Mohamed Djoudir",
  openGraph: {
    title: "Nova - Elevate Your Digital Experience",
    description:
      "Transform how you work with our AI-powered platform. Automate workflows, gain insights, and boost productivity.",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "Nova - AI-powered platform",
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
      <body className={`${inter.className} bg-black text-white`}>
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
