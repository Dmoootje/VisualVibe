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

/** English mirror of {@link featuresConfig}. Same feature ids, icons and
 * detail-page hrefs (the routes are shared between locales); only the copy
 * differs. */
export const featuresConfigEn = {
  title: "Web design, photography and video production for businesses",
  subtitle:
    "From web design in Limburg to professional photography, video and digital applications: one point of contact and one dedicated team for your entire online presence.",

  features: [
    {
      id: "webdesign",
      icon: <Monitor className="h-5 w-5" />,
      title: "Web design",
      eyebrow: "Web design for businesses",
      headline: "Websites and online shops that deliver customers",
      description:
        "We build fast, user-friendly websites and online shops with SEO as the foundation. WordPress or custom-built, from strategy through to launch.",
      benefits: [
        "A website or shop that converts",
        "Speed and SEO as a core principle",
        "User-friendly on every screen",
        "WordPress or fully custom",
      ],
      approach:
        "We start by listening to your story and goals, then build the structure, technology and look around them.",
      human:
        "One partner for technology, content and presentation. Personal contact from briefing to launch, never passed off to a helpdesk.",
      highlight: "From strategy to launch",
      imageBadge: "Fast & findable",
      href: "/services/web-design",
      image: "/api/home-feature-image/Webdesign.webp",
    },
    {
      id: "seo",
      icon: <Search className="h-5 w-5" />,
      title: "SEO",
      eyebrow: "SEO & online visibility",
      headline: "Better rankings in Google and AI search results",
      description:
        "Local visibility, technical SEO and a strong content structure. Ready for Google and for AI SEO (AEO and GEO).",
      benefits: [
        "Local visibility in Limburg",
        "Technical SEO that performs",
        "A strong content structure",
        "AI SEO / AEO / GEO",
      ],
      approach:
        "We think along with your goals and translate data into choices that actually bring in customers, not numbers without meaning.",
      human:
        "No dry, jargon-heavy approach. We explain everything in plain language and follow up personally with advice that fits your business.",
      highlight: "Google and AI search results",
      imageBadge: "Locally strong",
      href: "/services/seo",
      image: "/api/home-feature-image/SEO.webp",
    },
    {
      id: "fotografie",
      icon: <Camera className="h-5 w-5" />,
      title: "Photography",
      eyebrow: "Photography for businesses",
      headline: "Images that make your brand credible",
      description:
        "Business, product, portrait and event photography that builds trust and presents your company professionally.",
      benefits: [
        "Business and product photography",
        "Professional headshots",
        "Event photography",
        "Credible brand imagery",
      ],
      approach:
        "We work from a clear shot list, but leave room for the spontaneous moment that really makes an image.",
      human:
        "We put people at ease and guide you through the shoot. Natural, professional images without stiff posing.",
      highlight: "A personal approach on location",
      imageBadge: "On location",
      href: "/services/photography",
      image: "/api/home-feature-image/Fotografie.webp",
    },
    {
      id: "videografie",
      icon: <Video className="h-5 w-5" />,
      title: "Video production",
      eyebrow: "Video production for businesses",
      headline: "Video that tells your story",
      description:
        "Company films, promotional videos, social content and event aftermovies that make your business visible and recognisable.",
      benefits: [
        "Company and promotional video",
        "Social media content",
        "Event aftermovies",
        "Video that tells your story",
      ],
      approach:
        "We first sharpen what you want to say, then pick up the camera. That way every shot is purposeful instead of arbitrary.",
      human:
        "We guide you before and during filming and make sure everyone feels comfortable on camera. Approachable, never stiff.",
      highlight: "Guidance before and during filming",
      imageBadge: "Story first",
      href: "/services/videography",
      image: "/api/home-feature-image/Videografie.webp",
    },
  ] as Feature[],

  trustItems: [
    { icon: <UserRound className="h-4 w-4" />, label: "One point of contact" },
    { icon: <HeartHandshake className="h-4 w-4" />, label: "Personal guidance" },
    { icon: <LayoutGrid className="h-4 w-4" />, label: "Everything under one roof" },
    { icon: <MessagesSquare className="h-4 w-4" />, label: "Clear communication" },
  ] as TrustItem[],

  extraServices: [
    { icon: <Radio className="h-4 w-4" />, label: "Drone & FPV", href: "/services/drone-fpv" },
    { icon: <Boxes className="h-4 w-4" />, label: "3D, VR & AR", href: "/services/3d-vr-ar" },
    { icon: <Mic className="h-4 w-4" />, label: "Podcasting", href: "/services/podcasting" },
    { icon: <GraduationCap className="h-4 w-4" />, label: "Masterclasses", href: "/services/masterclasses" },
  ] as ExtraService[],
};
