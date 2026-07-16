import {
  Monitor,
  Search,
  Camera,
  Video,
  UserRound,
  HeartHandshake,
  LayoutGrid,
  MessagesSquare,
  Radio,
  Boxes,
  Mic,
  GraduationCap,
} from "lucide-react";
import { ReactNode } from "react";

export interface Feature {
  id: string;
  icon: ReactNode;
  title: string;
  /** Small badge label above the headline. */
  eyebrow: string;
  /** Strong, human subtitle for the active panel. */
  headline: string;
  description: string;
  /** 3-4 kernbullets. */
  benefits: string[];
  /** "Onze aanpak" mini block. */
  approach: string;
  /** "Menselijke aanpak" mini block. */
  human: string;
  /** Floating info-card key benefit on the image. */
  highlight: string;
  /** Overlay badge label on the image. */
  imageBadge: string;
  /** Detail route for the "Bekijk dienst" CTA. */
  href: string;
  image: string;
}

/** Small trust badges shown once, under the active tab content. */
export interface TrustItem {
  icon: ReactNode;
  label: string;
}

/** Supporting services shown as chips, not as extra tabs. */
export interface ExtraService {
  icon: ReactNode;
  label: string;
  href: string;
}

export const featuresConfig = {
  title: "Webdesign, fotografie en videografie voor bedrijven",
  subtitle:
    "Van webdesign in Limburg tot professionele foto, video en digitale toepassingen: één aanspreekpunt en één vast team voor je volledige uitstraling.",

  features: [
    {
      id: "webdesign",
      icon: <Monitor className="h-5 w-5" />,
      title: "Webdesign",
      eyebrow: "Webdesign voor bedrijven",
      headline: "Websites en webshops die klanten opleveren",
      description:
        "We bouwen snelle, gebruiksvriendelijke websites en webshops met SEO als fundament. WordPress of maatwerk, van strategie tot oplevering.",
      benefits: [
        "Website & webshop die converteert",
        "Snelheid en SEO als basisprincipe",
        "Gebruiksvriendelijk op elk scherm",
        "WordPress of maatwerk",
      ],
      approach:
        "We luisteren eerst naar jouw verhaal en doelen, en bouwen daar de structuur, techniek en uitstraling omheen.",
      human:
        "Eén partner voor techniek, inhoud en uitstraling. Persoonlijk contact van briefing tot lancering, geen doorschuiven naar een helpdesk.",
      highlight: "Van strategie tot oplevering",
      imageBadge: "Snel & vindbaar",
      href: "/diensten/webdesign",
      image: "/api/home-feature-image/Webdesign.webp",
    },
    {
      id: "seo",
      icon: <Search className="h-5 w-5" />,
      title: "SEO",
      eyebrow: "SEO & vindbaarheid",
      headline: "Beter gevonden in Google en AI-zoekresultaten",
      description:
        "Lokale vindbaarheid, technische SEO en een sterke contentstructuur. Klaar voor Google én voor AI SEO (AEO en GEO).",
      benefits: [
        "Lokale vindbaarheid in Limburg",
        "Technische SEO die scoort",
        "Sterke contentstructuur",
        "AI SEO / AEO / GEO",
      ],
      approach:
        "We denken mee met je doelen en vertalen data naar keuzes die echt klanten opleveren, niet naar cijfers zonder betekenis.",
      human:
        "Geen droge vakjargon-aanpak. We leggen alles in duidelijke taal uit en volgen persoonlijk op met advies dat bij jou past.",
      highlight: "Google én AI-zoekresultaten",
      imageBadge: "Lokaal sterk",
      href: "/diensten/seo",
      image: "/api/home-feature-image/SEO.webp",
    },
    {
      id: "fotografie",
      icon: <Camera className="h-5 w-5" />,
      title: "Fotografie",
      eyebrow: "Fotografie voor bedrijven",
      headline: "Beelden die je merk geloofwaardig maken",
      description:
        "Bedrijfs-, product-, portret- en eventfotografie die vertrouwen wekt en je onderneming professioneel in beeld brengt.",
      benefits: [
        "Bedrijfs- en productfotografie",
        "Zakelijke portretten",
        "Eventfotografie",
        "Geloofwaardige merkbeelden",
      ],
      approach:
        "We werken met een duidelijke shotlist, maar houden ruimte voor het spontane moment dat een beeld écht maakt.",
      human:
        "We stellen mensen op hun gemak en begeleiden je tijdens de shoot. Natuurlijke, professionele beelden zonder geposeerde stijfheid.",
      highlight: "Persoonlijke aanpak op locatie",
      imageBadge: "Op locatie",
      href: "/diensten/fotografie",
      image: "/api/home-feature-image/Fotografie.webp",
    },
    {
      id: "videografie",
      icon: <Video className="h-5 w-5" />,
      title: "Videografie",
      eyebrow: "Videografie voor bedrijven",
      headline: "Video die je verhaal vertelt",
      description:
        "Bedrijfsvideo's, promovideo's, social content en event-aftermovies die je onderneming zichtbaar en herkenbaar maken.",
      benefits: [
        "Bedrijfs- en promovideo",
        "Social media content",
        "Event-aftermovies",
        "Video die je verhaal vertelt",
      ],
      approach:
        "Eerst scherpstellen wat je wil vertellen, dan pas de camera. Zo wordt elke opname doelgericht in plaats van vrijblijvend.",
      human:
        "We begeleiden je voor en tijdens de opnames en zorgen dat iedereen zich goed voelt voor de camera. Toegankelijk, niet stijf.",
      highlight: "Begeleiding voor en tijdens opnames",
      imageBadge: "Verhaal eerst",
      href: "/diensten/videografie",
      image: "/api/home-feature-image/Videografie.webp",
    },
  ] as Feature[],

  trustItems: [
    { icon: <UserRound className="h-4 w-4" />, label: "Eén aanspreekpunt" },
    { icon: <HeartHandshake className="h-4 w-4" />, label: "Persoonlijke begeleiding" },
    { icon: <LayoutGrid className="h-4 w-4" />, label: "Alles onder één dak" },
    { icon: <MessagesSquare className="h-4 w-4" />, label: "Duidelijke communicatie" },
  ] as TrustItem[],

  extraServices: [
    { icon: <Radio className="h-4 w-4" />, label: "Drone & FPV", href: "/diensten/drone-fpv" },
    { icon: <Boxes className="h-4 w-4" />, label: "3D, VR & AR", href: "/diensten/3d-vr-ar" },
    { icon: <Mic className="h-4 w-4" />, label: "Podcasting", href: "/diensten/podcasting" },
    { icon: <GraduationCap className="h-4 w-4" />, label: "Masterclasses", href: "/diensten/masterclasses" },
  ] as ExtraService[],
};
