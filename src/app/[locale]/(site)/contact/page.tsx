import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { getSiteSettings } from "@/lib/firestore/siteSettings";
import { LeadForm } from "@/components/forms/LeadForm";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ContactInfoCard, ContactMap, ContactCTAGroup } from "@/components/contact";
import type { SupportedLocale } from "@/i18n/locales";
import { getCommercialCopy } from "../commercialCopy";

// next-intl pins the [locale] subtree to static rendering, so force-dynamic is
// ignored here. ISR instead: re-render at most once a minute so admin edits to
// the contact settings show up on the live site within ~60s (no rebuild needed).
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: SupportedLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getCommercialCopy(locale).contact;
  const settings = await getSiteSettings(locale);
  const place = settings.city ? ` in ${settings.city}` : "";
  return pageMetadata({
    locale,
    title: `${copy.title} | ${settings.companyName}`,
    description: locale === "en" ? copy.description : `Neem contact op met ${settings.companyName}${place}. Vraag vrijblijvend een offerte aan of stel je vraag.`,
    path: "/contact/",
    languagePaths: { nl: "/contact/", en: "/contact/" },
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: SupportedLocale }> }) {
  const { locale } = await params;
  const copy = getCommercialCopy(locale).contact;
  const settings = await getSiteSettings(locale);

  const streetLine = [settings.street, settings.houseNumber].filter(Boolean).join(" ");
  const cityLine = [settings.postalCode, settings.city].filter(Boolean).join(" ");
  const englishCountry = locale === "en" ? "Belgium" : settings.country;
  const addressLines = [streetLine, cityLine].filter(Boolean);
  if (locale === "en") {
    if (englishCountry) addressLines.push(englishCountry);
  } else if (addressLines.length === 0 && settings.fullAddress) {
    addressLines.push(settings.fullAddress);
  }

  // Max 2-line address for the card: street, then "postcode stad, land".
  const cityCountryLine = [cityLine, englishCountry].filter(Boolean).join(", ");
  const cardAddressLines = (
    streetLine ? [streetLine, cityCountryLine] : locale === "en" ? [cityCountryLine] : [settings.fullAddress]
  ).filter((line): line is string => Boolean(line));

  const routeUrl = settings.routeUrl || settings.googleMapsUrl;

  return (
    <div className="min-h-screen pb-16 pt-24 text-white">
      <BreadcrumbJsonLd locale={locale === "en" ? "en" : "nl"} items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />

      <div className="container mx-auto px-2.5 sm:px-4">
        {/* Hero */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">{copy.h1}</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/70">
            {copy.intro}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.35fr]">
          {/* Left: contact info cards */}
          <div className="flex flex-col gap-3.5">
            <ContactInfoCard icon={MapPin} title={copy.address}>
              {cardAddressLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </ContactInfoCard>

            {(settings.phone || settings.mobilePhone) && (
              <ContactInfoCard icon={Phone} title={copy.phone}>
                {settings.phone && (
                  <p>
                    <a href={`tel:${settings.phone.replace(/\s+/g, "")}`}>{settings.phone}</a>
                  </p>
                )}
                {settings.mobilePhone && (
                  <p>
                    <a href={`tel:${settings.mobilePhone.replace(/\s+/g, "")}`}>{settings.mobilePhone}</a>
                  </p>
                )}
              </ContactInfoCard>
            )}

            <ContactInfoCard icon={Mail} title={copy.email}>
              <a href={`mailto:${settings.mainEmail}`}>{settings.mainEmail}</a>
            </ContactInfoCard>

            {locale !== "en" && settings.responseTimeText && (
              <ContactInfoCard icon={Clock} title={copy.responseTime}>
                {settings.responseTimeText}
              </ContactInfoCard>
            )}

            <ContactInfoCard icon={Sparkles} title={copy.invitationTitle}>
              {copy.invitation}
            </ContactInfoCard>
          </div>

          {/* Right: lead form with orange glow */}
          <div
            className="rounded-[18px] border border-[rgba(255,117,0,0.35)] p-6 shadow-[0_0_50px_rgba(255,117,0,0.14),inset_0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-sm sm:p-8"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(255,117,0,0.10), transparent 35%), rgba(12,12,12,0.88)",
            }}
          >
            <h2 className="mb-6 text-xl font-bold">{copy.formTitle}</h2>
            <LeadForm variant="contact" locale={locale} />
          </div>
        </div>

        {/* Map section */}
        <div className="mt-10">
          <ContactMap
            embedUrl={settings.googleMapsEmbedUrl}
            latitude={settings.latitude}
            longitude={settings.longitude}
            markerTitle={locale === "en" ? `${settings.companyName}, Tongeren-Borgloon, Belgium` : settings.mapMarkerTitle || settings.companyName}
            addressLines={addressLines}
            routeUrl={routeUrl}
          />
        </div>

        {/* Office hours + CTA cards */}
        {locale !== "en" && (
        <div className="mt-6">
          <ContactCTAGroup
            openingHours={settings.openingHours}
            appointment={{
              title: settings.appointmentTitle ?? copy.appointmentTitle,
              text: settings.appointmentText ?? "",
              buttonLabel: settings.appointmentButtonLabel ?? copy.appointmentButton,
              buttonUrl: settings.appointmentButtonUrl ?? "/offerte-aanvragen",
            }}
            urgent={{
              title: settings.urgentContactTitle ?? copy.urgentTitle,
              text: settings.urgentContactText ?? "",
              buttonLabel: settings.urgentContactButtonLabel ?? copy.urgentButton,
              buttonUrl:
                settings.urgentContactButtonUrl ||
                (settings.phone ? `tel:${settings.phone.replace(/\s+/g, "")}` : ""),
            }}
          />
        </div>
        )}
      </div>
    </div>
  );
}
