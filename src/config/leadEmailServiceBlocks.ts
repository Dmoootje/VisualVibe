import type { EmailLocale } from "@/types/email";

export const LEAD_EMAIL_SERVICE_IDS = [
  "webdesign",
  "seo",
  "fotografie",
  "videografie",
  "drone-fpv",
  "3d-vr-ar",
  "podcasting",
  "masterclasses",
] as const;

export type LeadEmailServiceId = (typeof LEAD_EMAIL_SERVICE_IDS)[number];

type LocalizedValue<T> = Record<EmailLocale, T>;

export type LeadEmailServiceBlock = {
  id: LeadEmailServiceId;
  label: LocalizedValue<string>;
  preparationPoints: LocalizedValue<readonly string[]>;
  aliases: readonly string[];
};

export type ResolvedLeadEmailServiceBlock = {
  id: LeadEmailServiceId;
  label: string;
  preparationPoints: readonly string[];
};

/**
 * Approved, deterministic service context for customer confirmations and AI
 * prompts. User-provided text is never copied into this configuration.
 */
export const leadEmailServiceBlocks: Readonly<Record<LeadEmailServiceId, LeadEmailServiceBlock>> = {
  webdesign: {
    id: "webdesign",
    label: { nl: "Webdesign", fr: "Création de site web", en: "Web design" },
    preparationPoints: {
      nl: [
        "Je bestaande website of domeinnaam, als die er al is",
        "De gewenste pagina's en belangrijkste doelgroep",
        "Functies die je nodig hebt, zoals formulieren, reservaties of een webshop",
        "Bestaande huisstijl, logo, teksten en beelden",
        "De gewenste timing of een belangrijke lanceringsdatum",
      ],
      fr: [
        "Votre site ou nom de domaine actuel, s'il existe",
        "Les pages souhaitées et votre public principal",
        "Les fonctions nécessaires, comme des formulaires, réservations ou une boutique",
        "Votre identité visuelle, logo, textes et images disponibles",
        "Le calendrier souhaité ou une date de lancement importante",
      ],
      en: [
        "Your current website or domain name, if available",
        "The pages you need and your main audience",
        "Required features such as forms, bookings or an online shop",
        "Existing branding, logo, copy and images",
        "Your preferred timing or an important launch date",
      ],
    },
    aliases: ["website", "websites", "webshop", "website of webshop", "website/webshop", "web"],
  },
  seo: {
    id: "seo",
    label: { nl: "SEO", fr: "SEO", en: "SEO" },
    preparationPoints: {
      nl: [
        "De website die je beter vindbaar wilt maken",
        "Je belangrijkste diensten, producten en doelgroepen",
        "De regio's waarin je klanten wilt bereiken",
        "Wat je vandaag al weet over je vindbaarheid",
        "Belangrijke concurrenten en concrete doelstellingen",
      ],
      fr: [
        "Le site dont vous souhaitez améliorer la visibilité",
        "Vos principaux services, produits et publics",
        "Les régions dans lesquelles vous souhaitez attirer des clients",
        "Ce que vous savez déjà de votre visibilité actuelle",
        "Vos principaux concurrents et objectifs concrets",
      ],
      en: [
        "The website whose visibility you want to improve",
        "Your main services, products and audiences",
        "The regions in which you want to reach customers",
        "What you already know about your current visibility",
        "Key competitors and concrete objectives",
      ],
    },
    aliases: ["marketing", "seo marketing", "seo & marketing", "seo en marketing", "zoekmachineoptimalisatie"],
  },
  fotografie: {
    id: "fotografie",
    label: { nl: "Fotografie", fr: "Photographie", en: "Photography" },
    preparationPoints: {
      nl: [
        "Het soort fotografie dat je nodig hebt",
        "De locatie en het aantal personen, producten of ruimtes",
        "Waar je de beelden wilt gebruiken",
        "De gewenste opnamedatum",
        "De gewenste selectie, formaten en oplevering",
      ],
      fr: [
        "Le type de photographie dont vous avez besoin",
        "Le lieu et le nombre de personnes, produits ou espaces",
        "Les supports sur lesquels les images seront utilisées",
        "La date de prise de vue souhaitée",
        "La sélection, les formats et la livraison souhaités",
      ],
      en: [
        "The type of photography you need",
        "The location and number of people, products or spaces",
        "Where the images will be used",
        "Your preferred shoot date",
        "The selection, formats and delivery you need",
      ],
    },
    aliases: ["foto", "photo", "photography", "bedrijfsfotografie", "productfotografie"],
  },
  videografie: {
    id: "videografie",
    label: { nl: "Videografie", fr: "Vidéo", en: "Video production" },
    preparationPoints: {
      nl: [
        "Het type video en het doel ervan",
        "De kanalen waarop je de video wilt publiceren",
        "De opnameplaats en gewenste timing",
        "Een richtduur of de belangrijkste inhoud",
        "Of er al een script, interviewopzet of woordvoerder is",
      ],
      fr: [
        "Le type de vidéo et son objectif",
        "Les canaux sur lesquels elle sera publiée",
        "Le lieu de tournage et le calendrier souhaité",
        "La durée indicative ou le contenu principal",
        "L'existence d'un script, d'une trame d'interview ou d'un porte-parole",
      ],
      en: [
        "The type of video and its objective",
        "The channels on which it will be published",
        "The filming location and preferred timing",
        "An indicative duration or the main content",
        "Whether a script, interview outline or spokesperson already exists",
      ],
    },
    aliases: ["video", "bedrijfsvideo", "videoproductie", "film"],
  },
  "drone-fpv": {
    id: "drone-fpv",
    label: { nl: "Drone & FPV", fr: "Drone & FPV", en: "Drone & FPV" },
    preparationPoints: {
      nl: [
        "De exacte opnamelocatie",
        "Of de beelden binnen, buiten of beide worden gemaakt",
        "Het gewenste type drone- of FPV-beelden",
        "De gewenste datum en een mogelijk alternatief bij slecht weer",
        "Bekende locatiebeperkingen, veiligheidsregels of toestemmingen",
      ],
      fr: [
        "Le lieu exact du tournage",
        "Si les images seront réalisées à l'intérieur, à l'extérieur ou les deux",
        "Le type d'images drone ou FPV souhaité",
        "La date souhaitée et une alternative éventuelle en cas de mauvais temps",
        "Les restrictions, règles de sécurité ou autorisations déjà connues",
      ],
      en: [
        "The exact filming location",
        "Whether footage is needed indoors, outdoors or both",
        "The type of drone or FPV footage you want",
        "Your preferred date and a possible weather alternative",
        "Known site restrictions, safety rules or permissions",
      ],
    },
    aliases: ["drone", "fpv", "drone & fpv", "drone en fpv", "dronefpv", "dronebeelden"],
  },
  "3d-vr-ar": {
    id: "3d-vr-ar",
    label: { nl: "3D, VR & AR", fr: "3D, VR & AR", en: "3D, VR & AR" },
    preparationPoints: {
      nl: [
        "Het type locatie, ruimte of product",
        "Beschikbare plannen, afmetingen of referentiemateriaal",
        "De gewenste output, zoals een 3D-tour, model of interactieve ervaring",
        "De apparaten, website of kanalen waarop het resultaat wordt gebruikt",
        "De gewenste deadline",
      ],
      fr: [
        "Le type de lieu, d'espace ou de produit",
        "Les plans, dimensions ou références disponibles",
        "Le résultat souhaité, comme une visite 3D, un modèle ou une expérience interactive",
        "Les appareils, le site ou les canaux sur lesquels le résultat sera utilisé",
        "L'échéance souhaitée",
      ],
      en: [
        "The type of location, space or product",
        "Available plans, dimensions or reference material",
        "The desired output, such as a 3D tour, model or interactive experience",
        "The devices, website or channels on which it will be used",
        "Your preferred deadline",
      ],
    },
    aliases: ["3d", "vr", "ar", "xr", "3d vr ar", "3d, vr & ar", "3d en vr en ar", "virtuele tour"],
  },
  podcasting: {
    id: "podcasting",
    label: { nl: "Podcasting", fr: "Podcast", en: "Podcasting" },
    preparationPoints: {
      nl: [
        "Het type podcast en het beoogde publiek",
        "Het aantal deelnemers per aflevering",
        "De gewenste locatie of studio-opstelling",
        "Of je audio, video of beide nodig hebt",
        "De distributiekanalen en globale planning",
      ],
      fr: [
        "Le type de podcast et le public visé",
        "Le nombre de participants par épisode",
        "Le lieu ou la configuration de studio souhaitée",
        "Si vous avez besoin d'audio, de vidéo ou des deux",
        "Les canaux de diffusion et le calendrier général",
      ],
      en: [
        "The type of podcast and its intended audience",
        "The number of participants per episode",
        "The preferred location or studio setup",
        "Whether you need audio, video or both",
        "Distribution channels and the overall schedule",
      ],
    },
    aliases: ["podcast", "bedrijfspodcast", "videopodcast", "podcast opname"],
  },
  masterclasses: {
    id: "masterclasses",
    label: { nl: "Masterclasses", fr: "Masterclasses", en: "Masterclasses" },
    preparationPoints: {
      nl: [
        "Het onderwerp en leerdoel van de sessie",
        "De doelgroep en het verwachte aantal deelnemers",
        "De locatie of gewenste online opstelling",
        "De gewenste vorm, duur en interactie",
        "De voorkeursdatum en beschikbare materialen",
      ],
      fr: [
        "Le sujet et l'objectif pédagogique de la session",
        "Le public et le nombre prévu de participants",
        "Le lieu ou la configuration en ligne souhaitée",
        "Le format, la durée et le niveau d'interaction souhaités",
        "La date souhaitée et le matériel disponible",
      ],
      en: [
        "The session topic and learning objective",
        "The audience and expected number of participants",
        "The location or preferred online setup",
        "The desired format, duration and interaction",
        "The preferred date and available materials",
      ],
    },
    aliases: ["masterclass", "opleiding", "opleidingen", "training", "workshop"],
  },
};

export function normalizeLeadEmailService(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " en ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildAliases(): Readonly<Record<string, LeadEmailServiceId>> {
  const aliases: Record<string, LeadEmailServiceId> = {};
  for (const block of Object.values(leadEmailServiceBlocks)) {
    const values = [block.id, ...Object.values(block.label), ...block.aliases];
    for (const value of values) aliases[normalizeLeadEmailService(value)] = block.id;
  }
  return Object.freeze(aliases);
}

export const leadEmailServiceAliases = buildAliases();

export function resolveLeadEmailServiceId(value: string): LeadEmailServiceId | null {
  return leadEmailServiceAliases[normalizeLeadEmailService(value)] ?? null;
}

/** Resolves, localises and deduplicates only the services explicitly selected. */
export function resolveLeadEmailServiceBlocks(
  selectedServices: readonly string[],
  locale: EmailLocale = "nl",
): ResolvedLeadEmailServiceBlock[] {
  const seen = new Set<LeadEmailServiceId>();
  const resolved: ResolvedLeadEmailServiceBlock[] = [];

  for (const selected of selectedServices) {
    const id = resolveLeadEmailServiceId(selected);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const block = leadEmailServiceBlocks[id];
    resolved.push({
      id,
      label: block.label[locale] ?? block.label.nl,
      preparationPoints: block.preparationPoints[locale] ?? block.preparationPoints.nl,
    });
  }

  return resolved;
}
