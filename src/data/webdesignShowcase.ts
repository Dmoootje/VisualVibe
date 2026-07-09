// Real client web projects shown in the Webdesign service showcase (verbatim
// copy from the design handoff). This is static content; the *images* per
// project are admin-managed separately (see lib/firestore/webdesignImages.ts).

export interface WebdesignProject {
  id: string;
  name: string;
  client: string;
  url: string;
  tags: string[];
  teaser: string;
  text: string;
  /** "Wat we leverden" checklist. */
  features: string[];
  /** SEO focus term chips. */
  terms: string[];
}

export const webdesignProjects: WebdesignProject[] = [
  {
    id: "gordijnenmyriam",
    name: "Gordijnen Myriam",
    client: "GORDIJNEN MYRIAM · GORDIJNEN & MEER",
    url: "https://gordijnenmyriam.be/",
    tags: ["Huisstijl", "Fotografie", "SEO + GEO"],
    teaser: "Eigen huisstijl & webdesign met prachtige realisatiepagina's.",
    text: "Website met eigen creatie van huisstijl & webdesign inclusief prachtige foto's voor Gordijnen Myriam. Geoptimaliseerd voor zoekmachines (SEO) én de AI-zoekmachines (GEO), met op maat gemaakte pagina's en realisatiepagina's.",
    features: ["Eigen huisstijl & webdesign", "Professionele fotografie", "SEO-optimalisatie", "GEO / AI-zoekmachines", "Realisatiepagina's op maat"],
    terms: ["SEO", "GEO / AI"],
  },
  {
    id: "hetmagazijn",
    name: "Het Magazijn",
    client: "HET MAGAZIJN · RESTAURANT · BILZEN",
    url: "https://www.hetmagazijn.be",
    tags: ["Horeca", "Reservatie", "SEO"],
    teaser: "Restaurantsite met tafelreserveersysteem & feestzaalpagina's.",
    text: "Website met eigen creatie van huisstijl & webdesign, met integratie van een tafelreserveersysteem en professionele foto's. Geoptimaliseerd voor lokale zoekmachines met op maat gemaakte restaurant- en feestzaalpagina's.",
    features: ["Eigen huisstijl & webdesign", "Tafelreserveersysteem", "Professionele fotografie", "Restaurant- & feestzaalpagina's", "Lokale SEO"],
    terms: ["Het Magazijn", "Restaurant Bilzen", "Uiteten Bilzen"],
  },
  {
    id: "aussems",
    name: "Schrijnwerkerij Aussems",
    client: "AUSSEMS · SCHRIJNWERKER",
    url: "https://schrijnwerkerijaussems.be/",
    tags: ["Bedrijfssite", "Contactformulier", "SEO"],
    teaser: "Bedrijfssite met specifiek contactformulier & referentiepagina's.",
    text: "Website met eigen creatie van huisstijl & webdesign, met integratie van een specifiek contactformulier voor Schrijnwerkerij Aussems. Geoptimaliseerd voor zoekmachines, met op maat gemaakte diensten- en referentiepagina's.",
    features: ["Eigen huisstijl & webdesign", "Specifiek contactformulier", "Diensten- & referentiepagina's", "SEO-optimalisatie"],
    terms: ["Schrijnwerkerij", "Gevelbekleding", "Houtconstructies"],
  },
  {
    id: "gprenting",
    name: "GPRenting",
    client: "GPRENTING · PAARDENCAMIONETTE VERHUUR",
    url: "https://gprenting.be/",
    tags: ["Verhuur", "Reservatiesysteem", "SEO"],
    teaser: "Verhuursite met offerteformulieren & online reservatiesysteem.",
    text: "Website met webdesign in de huisstijl van GPRenting. Geoptimaliseerd voor zoekmachines, met op maat gemaakte offerteformulieren en een eigen online reservatiesysteem.",
    features: ["Webdesign in huisstijl", "Offerteformulieren op maat", "Online reservatiesysteem", "SEO-optimalisatie"],
    terms: ["paardencamionette verhuur", "paardencamionette huren"],
  },
  {
    id: "intramarket",
    name: "Intramarket",
    client: "INTRAMARKET · TRANSPORT",
    url: "https://intramarket.be/",
    tags: ["Transport", "Offerte-systeem", "SEO"],
    teaser: "Transportsite met offerte-aanvraag & galerijpagina's.",
    text: "Website met eigen creatie van huisstijl & webdesign, met integratie van een offerte-aanvraagsysteem voor Intramarket. Geoptimaliseerd voor zoekmachines, met op maat gemaakte diensten- en galerijpagina's.",
    features: ["Eigen huisstijl & webdesign", "Offerte-aanvraagsysteem", "Diensten- & galerijpagina's", "SEO-optimalisatie"],
    terms: ["Transport met vrachtwagen", "Transport van planten"],
  },
  {
    id: "eluk",
    name: "Eluk",
    client: "ELUK · ELEKTRICITEITSWERKEN & DAKREINIGING",
    url: "https://eluk.be/",
    tags: ["Bedrijfssite", "SEO"],
    teaser: "Bedrijfssite in huisstijl met diensten- & referentiepagina's.",
    text: "Website met webdesign in de huisstijl van Eluk. Geoptimaliseerd voor zoekmachines, met op maat gemaakte diensten- en referentiepagina's.",
    features: ["Webdesign in huisstijl", "Diensten- & referentiepagina's", "SEO-optimalisatie"],
    terms: ["Elektriciteitswerken", "Zonnepanelen"],
  },
  {
    id: "nelissen",
    name: "Dr. Laurine Nelissen",
    client: "DR. LAURINE NELISSEN · ESTHETISCHE GENEESKUNDE",
    url: "https://drlaurinenelissen.be/",
    tags: ["Zorg", "Online boeking", "SEO"],
    teaser: "Zorgsite met behandelingenoverzicht, prijzen & online boeking.",
    text: "Website met webdesign in de huisstijl van Dr. Laurine Nelissen. Geoptimaliseerd voor zoekmachines, met een op maat gemaakt overzicht van alle behandelingen, prijsoverzicht en online boekingsmogelijkheid.",
    features: ["Webdesign in huisstijl", "Behandelingenoverzicht op maat", "Prijsoverzicht", "Online boeking", "SEO-optimalisatie"],
    terms: ["Esthetische Geneeskunde"],
  },
  {
    id: "studentenkot",
    name: "Studentenkot Hasselt",
    client: "STUDENTENKOT HASSELT · KAMERS & STUDIO'S",
    url: "https://studentenkothasselt.be",
    tags: ["Verhuur", "SEO"],
    teaser: "Verhuursite met plattegrond & reserveringsinformatie.",
    text: "Website in een herkenbare huisstijl, SEO-gericht op “studentenkot” en “Hasselt”. Inclusief gemeubelde kamers & studio's, plattegrond én reserveringsinformatie.",
    features: ["Herkenbare huisstijl", "Overzicht kamers & studio's", "Plattegrond", "Reserveringsinformatie", "SEO-optimalisatie"],
    terms: ["studentenkot", "Hasselt"],
  },
  {
    id: "nozeco",
    name: "Nozeco",
    client: "NOZECO · ELEKTRISCHE OPLOSSINGEN",
    url: "https://nozeco.be",
    tags: ["Bedrijfssite", "Offerte", "SEO"],
    teaser: "Professionele dienstensite met offerte- & contactflow.",
    text: "Website in een professionele stijl voor Nozeco, SEO-gericht op “zonnepanelen” en “EV laadstations”. Inclusief een gedetailleerd dienstenaanbod en de mogelijkheid tot offerte/contact.",
    features: ["Professionele stijl", "Gedetailleerd dienstenaanbod", "Offerte- & contactflow", "SEO-optimalisatie"],
    terms: ["zonnepanelen", "EV laadstations"],
  },
  {
    id: "horsespa",
    name: "HorseSpa",
    client: "HORSESPA · MOBIELE SPA & BEHANDELINGEN",
    url: "https://horsespa.eu",
    tags: ["Dienstensite", "Galerij", "SEO"],
    teaser: "Dienstensite met foto-galerij & contactfunctie.",
    text: "Website volgens de huisstijl van HorseSpa, SEO-gericht op “mobile spa voor paarden” en “behandelingen staldieren”. Met dienstenoverzicht, foto-galerij en contactfunctie.",
    features: ["Webdesign in huisstijl", "Dienstenoverzicht", "Foto-galerij", "Contactfunctie", "SEO-optimalisatie"],
    terms: ["mobile spa voor paarden", "behandelingen staldieren"],
  },
  {
    id: "snellinx",
    name: "Renovaties Snellinx",
    client: "RENOVATIES SNELLINX · BADKAMER & ZOLDER",
    url: "https://renovatiesnellinx.be",
    tags: ["Renovatie", "SEO"],
    teaser: "Renovatiesite met voorbeelden & contactmogelijkheid.",
    text: "Website met webdesign in de huisstijl van Renovaties Snellinx. Geoptimaliseerd voor zoekmachines op “badkamerrenovaties” en “zolderverbouwing”, met overzicht van diensten, voorbeelden en contactmogelijkheid.",
    features: ["Webdesign in huisstijl", "Diensten & voorbeelden", "Contactmogelijkheid", "SEO-optimalisatie"],
    terms: ["badkamerrenovaties", "zolderverbouwing"],
  },
  {
    id: "weddingvibe",
    name: "WeddingVibe",
    client: "WEDDINGVIBE · TROUWFOTOGRAFIE LIMBURG",
    url: "https://weddingvibe.be",
    tags: ["Portfolio", "Fotografie", "SEO"],
    teaser: "Fotografie-portfolio met prijsinfo & contact.",
    text: "Website met webdesign in de huisstijl van WeddingVibe. Geoptimaliseerd voor zoekmachines op “huwelijksfotografie Limburg” en “trouwfotograaf”, met portfolio, prijsinfo en contactmogelijkheid.",
    features: ["Webdesign in huisstijl", "Portfolio", "Prijsinfo", "Contactmogelijkheid", "SEO-optimalisatie"],
    terms: ["huwelijksfotografie Limburg", "trouwfotograaf"],
  },
];

/** The five image slots per project + the hero preview. */
export type WebdesignImageSlot = "thumb" | "1" | "2" | "3" | "4";
export const WEBDESIGN_IMAGE_SLOTS: { slot: WebdesignImageSlot; label: string }[] = [
  { slot: "thumb", label: "Thumbnail" },
  { slot: "1", label: "Hoofdscreenshot" },
  { slot: "2", label: "Desktop" },
  { slot: "3", label: "Tablet" },
  { slot: "4", label: "Mobiel" },
];

/** Firestore key for a project image slot, e.g. "gordijnenmyriam-1". */
export const imageKey = (projectId: string, slot: WebdesignImageSlot) => `${projectId}-${slot}`;
