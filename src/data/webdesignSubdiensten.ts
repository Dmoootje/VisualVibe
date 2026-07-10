import type { Subdienst } from "@/components/subdiensten";

// Exact content from the Subdiensten-kaarten handoff. `id` maps to the card's
// line-icon; `href` links each card to its service page.
export const webdesignSubdiensten: Subdienst[] = [
  {
    id: "website",
    name: "Website laten maken",
    desc: "Een nieuwe website, snel en gebruiksvriendelijk opgebouwd rond je doelgroep.",
    href: "/diensten/website-laten-maken",
  },
  {
    id: "webshop",
    name: "Webshop laten maken",
    desc: "Een webshop die makkelijk te beheren is en klaar is om te verkopen.",
    href: "/diensten/webshop-laten-maken",
  },
  {
    id: "onepager",
    name: "Onepager laten maken",
    desc: "Een strakke onepager voor wie snel online wil staan met een beperkt budget.",
    href: "/diensten/onepager-laten-maken",
  },
  {
    id: "vernieuwen",
    name: "Website vernieuwen",
    desc: "Een verouderde website omgezet naar een snelle, actuele versie.",
    href: "/diensten/website-vernieuwen",
  },
  {
    id: "onderhoud",
    name: "Website-onderhoud",
    desc: "Doorlopend onderhoud zodat je website veilig, snel en up-to-date blijft.",
    href: "/diensten/website-onderhoud",
  },
  {
    id: "wordpress",
    name: "WordPress website laten maken",
    desc: "Een WordPress-website die je zelf makkelijk kan bijwerken.",
    href: "/diensten/wordpress-website-laten-maken",
  },
  {
    id: "seo",
    name: "SEO-website laten maken",
    desc: "Een website die vanaf de eerste lijn code gebouwd is om te ranken.",
    href: "/diensten/seo-website-laten-maken",
  },
];
