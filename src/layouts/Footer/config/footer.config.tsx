import { services } from "@/data/services";
import { businessConfig } from "@/config/business.config";

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterPartner {
  /** Key into PARTNER_LOGOS (inlined SVG). */
  logo: string;
  alt: string;
  href?: string;
}

export const footerConfig = {
  description: businessConfig.description,

  linkGroups: [
    {
      title: "Diensten",
      links: services.map((service) => ({
        label: service.title,
        href: `/diensten/${service.slug}`,
      })),
    },
    {
      title: "Bedrijf",
      links: [
        { label: "Over ons", href: "/over-ons" },
        { label: "Realisaties", href: "/realisaties" },
        { label: "Kennisbank", href: "/kennisbank" },
        { label: "Sectoren", href: "/sectoren" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ] as FooterLinkGroup[],

  legalLinks: [
    { label: "Privacybeleid", href: "/privacy" },
    { label: "Cookiebeleid", href: "/cookies" },
    { label: "Sitemap", href: "/sitemap" },
  ],

  partners: {
    title: "Officieel partner & gecertificeerd",
    subtitle: "Erkend door de platformen waarop we jouw merk laten groeien.",
    items: [
      { logo: "google", alt: "Google Partner" },
      { logo: "meta", alt: "Meta Business Partner" },
      { logo: "leadinfo", alt: "Leadinfo Certified Partner" },
    ] as FooterPartner[],
  },
};
