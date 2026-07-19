import {
  getLocalizedServiceById,
  serviceHref,
  services,
} from "@/data/services";
import { businessConfig } from "@/config/business.config";
import {
  getChromeRoutes,
  type PublicChromeLocale,
} from "@/components/nav/chromeRoutes";

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

export function getFooterLinkGroups(
  locale: PublicChromeLocale,
): FooterLinkGroup[] {
  const routes = getChromeRoutes(locale);
  return [
    {
      title: "Diensten",
      links: services.map((sourceService) => {
        const localizedService = getLocalizedServiceById(
          sourceService.slug,
          locale,
        ).service;
        return {
          label: localizedService.title,
          href: serviceHref(localizedService, locale),
        };
      }),
    },
    {
      title: "Bedrijf",
      links: [
        { label: "Over ons", href: routes.about },
        { label: "Realisaties", href: "/realisaties" },
        { label: "Kennisbank", href: "/kennisbank" },
        { label: "Sectoren", href: "/sectoren" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];
}

export const footerConfig = {
  description: businessConfig.description,

  linkGroups: getFooterLinkGroups("nl"),

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
