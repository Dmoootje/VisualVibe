import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { businessConfig } from "@/config/business.config";
import { LeadForm } from "@/components/forms/LeadForm";
import { BreadcrumbJsonLd } from "@/components/seo";

export const metadata: Metadata = {
  title: { absolute: `Contact | ${businessConfig.displayName}` },
  description: `Neem contact op met ${businessConfig.displayName} in ${businessConfig.address.addressLocality}, Limburg. Vraag vrijblijvend een offerte aan.`,
};

export default function ContactPage() {
  const mapsQuery = encodeURIComponent(
    `${businessConfig.address.streetAddress}, ${businessConfig.address.postalCode} ${businessConfig.address.addressLocality}`
  );

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />

      <div className="container mx-auto max-w-5xl grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Contact</h1>
          <p className="text-lg text-white/70 mb-8">
            Vraag of project? Laat het ons weten — we antwoorden binnen de 2 werkdagen.
          </p>

          <div className="flex flex-col gap-4 text-white/80">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-amber-400 shrink-0" />
              <span>
                {businessConfig.address.streetAddress}, {businessConfig.address.postalCode}{" "}
                {businessConfig.address.addressLocality}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-amber-400 shrink-0" />
              <a href={`tel:${businessConfig.telephone}`} className="hover:text-white">
                {businessConfig.telephone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-amber-400 shrink-0" />
              <a href={`mailto:${businessConfig.email}`} className="hover:text-white">
                {businessConfig.email}
              </a>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm text-amber-400 hover:underline"
          >
            Route plannen op Google Maps
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <LeadForm variant="contact" />
        </div>
      </div>
    </div>
  );
}
