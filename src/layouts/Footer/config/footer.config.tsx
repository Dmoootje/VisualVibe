import { Facebook, Instagram, Linkedin } from "lucide-react";
import { ReactNode } from "react";
import { services } from "@/data/services";
import { regions } from "@/data/regions";
import { businessConfig } from "@/config/business.config";

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: ReactNode;
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
    {
      title: "Regio",
      links: regions.map((region) => ({
        label: region.title,
        href: `/regio/${region.slug}`,
      })),
    },
  ] as FooterLinkGroup[],

  legalLinks: [
    { label: "Privacybeleid", href: "#" },
    { label: "Algemene voorwaarden", href: "#" },
    { label: "Cookiebeleid", href: "#" },
  ],
};

export const socialLinks: SocialLink[] = [
  { name: "Facebook", href: "#", icon: <Facebook className="h-5 w-5" /> },
  { name: "Instagram", href: "#", icon: <Instagram className="h-5 w-5" /> },
  { name: "LinkedIn", href: "#", icon: <Linkedin className="h-5 w-5" /> },
];
