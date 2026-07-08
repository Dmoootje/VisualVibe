import { services } from "@/data/services";
import { regions } from "@/data/regions";
import { businessConfig } from "./business.config";

// Site configuration
export const siteConfig = {
    name: businessConfig.displayName,
    description: businessConfig.description,
    url: businessConfig.url,

    // Flat top-level navigation links (Diensten and Regio render as dropdowns, see below)
    navLinks: [
        { label: "Realisaties", href: "/realisaties" },
        { label: "Sectoren", href: "/sectoren" },
        { label: "Kennisbank", href: "/kennisbank" },
        { label: "Over ons", href: "/over-ons" },
        { label: "Contact", href: "/contact" },
    ],

    // "Diensten" dropdown — hoofddiensten, sourced from the services data
    dienstenNav: services.map((service) => ({
        label: service.title,
        href: `/diensten/${service.slug}`,
    })),

    // "Regio" dropdown — hoofdregio's, sourced from the regions data
    regioNav: regions.map((region) => ({
        label: region.title,
        href: `/regio/${region.slug}`,
    })),

    ctaLabel: "Offerte aanvragen",
    ctaHref: "/offerte-aanvragen",
}

// Note: footer link groups and social links live in
// src/layouts/Footer/config/footer.config.tsx — that's what the Footer
// component actually reads (this file's equivalents were unused dead code).

export type SiteConfig = typeof siteConfig
