import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { getSiteSettings } from "@/lib/firestore/siteSettings";
import { LeadForm } from "@/components/forms/LeadForm";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ContactInfoCard, ContactMap, ContactCTAGroup } from "@/components/contact";

// next-intl pins the [locale] subtree to static rendering, so force-dynamic is
// ignored here. ISR instead: re-render at most once a minute so admin edits to
// the contact settings show up on the live site within ~60s (no rebuild needed).
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const place = settings.city ? ` in ${settings.city}` : "";
  return {
    title: { absolute: `Contact | ${settings.companyName}` },
    description: `Neem contact op met ${settings.companyName}${place}. Vraag vrijblijvend een offerte aan of stel je vraag.`,
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const streetLine = [settings.street, settings.houseNumber].filter(Boolean).join(" ");
  const cityLine = [settings.postalCode, settings.city].filter(Boolean).join(" ");
  const addressLines = [streetLine, cityLine].filter(Boolean);
  if (addressLines.length === 0 && settings.fullAddress) addressLines.push(settings.fullAddress);

  const routeUrl = settings.routeUrl || settings.googleMapsUrl;

  return (
    <div className="min-h-screen bg-black px-4 pb-16 pt-24 text-white">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />

      <div className="container mx-auto max-w-6xl">
        {/* Hero */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">Contact</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/70">
            Heb je een vraag, een idee of wil je samen bouwen aan groei? We denken graag met je mee.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: contact info cards */}
          <div className="flex flex-col gap-4">
            <ContactInfoCard icon={MapPin} title="Adres">
              {addressLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              {settings.country && <p>{settings.country}</p>}
            </ContactInfoCard>

            {(settings.phone || settings.mobilePhone) && (
              <ContactInfoCard icon={Phone} title="Telefoon">
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

            <ContactInfoCard icon={Mail} title="E-mail">
              <a href={`mailto:${settings.mainEmail}`}>{settings.mainEmail}</a>
            </ContactInfoCard>

            {settings.responseTimeText && (
              <ContactInfoCard icon={Clock} title="Reactietijd">
                {settings.responseTimeText}
              </ContactInfoCard>
            )}

            <ContactInfoCard icon={Sparkles} title="Laten we iets moois maken">
              Vertel ons over je project en we nemen zo snel mogelijk contact met je op.
            </ContactInfoCard>
          </div>

          {/* Right: lead form */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
            <h2 className="mb-6 text-xl font-bold">Stuur ons een bericht</h2>
            <LeadForm variant="contact" />
          </div>
        </div>

        {/* Map section */}
        <div className="mt-12">
          <ContactMap
            embedUrl={settings.googleMapsEmbedUrl}
            latitude={settings.latitude}
            longitude={settings.longitude}
            markerTitle={settings.mapMarkerTitle || settings.companyName}
            addressLines={addressLines}
            routeUrl={routeUrl}
          />
        </div>

        {/* Office hours + CTA cards */}
        <div className="mt-8">
          <ContactCTAGroup
            openingHours={settings.openingHours}
            appointment={{
              title: settings.appointmentTitle ?? "Plan een gesprek",
              text: settings.appointmentText ?? "",
              buttonLabel: settings.appointmentButtonLabel ?? "Plan een afspraak",
              buttonUrl: settings.appointmentButtonUrl ?? "/offerte-aanvragen",
            }}
            urgent={{
              title: settings.urgentContactTitle ?? "Snel contact",
              text: settings.urgentContactText ?? "",
              buttonLabel: settings.urgentContactButtonLabel ?? "Bel ons",
              buttonUrl:
                settings.urgentContactButtonUrl ||
                (settings.phone ? `tel:${settings.phone.replace(/\s+/g, "")}` : ""),
            }}
          />
        </div>
      </div>
    </div>
  );
}
