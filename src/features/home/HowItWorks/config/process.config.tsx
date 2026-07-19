import {
  MessagesSquare,
  Route,
  PenTool,
  Rocket,
  Search,
  ListChecks,
  FileText,
  LineChart,
  Camera,
  CalendarClock,
  Images,
  Lightbulb,
  Clapperboard,
  Video,
  Film,
  Monitor,
} from "lucide-react";
import type { ReactNode } from "react";

export const processConfig = {
  title: "Zo werken we",
  subtitle: "Van eerste gesprek tot oplevering - afgestemd op jouw project.",
  projectCtaLabel: "Bespreek je project",
  projectCtaHref: "/contact",
};

/** English mirror of {@link processConfig}. */
export const processConfigEn = {
  title: "How we work",
  subtitle: "From first conversation to delivery, tailored to your project.",
  projectCtaLabel: "Discuss your project",
  projectCtaHref: "/contact",
};

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export interface ProcessTrack {
  id: string;
  label: string;
  icon: ReactNode;
  /** Detail route for the "Bekijk deze dienst" CTA. */
  href: string;
  serviceLabel: string;
  steps: ProcessStep[];
}

export const processTracks: ProcessTrack[] = [
  {
    id: "webdesign",
    label: "Webdesign",
    icon: <Monitor className="h-4 w-4" />,
    href: "/diensten/webdesign",
    serviceLabel: "Bekijk webdesign",
    steps: [
      {
        number: "01",
        title: "Kennismaking & briefing",
        description:
          "We bespreken je doelen, doelgroep, aanbod en gewenste uitstraling. We luisteren eerst naar je verhaal, zodat de website klopt met je bedrijf.",
        icon: <MessagesSquare className="h-5 w-5" />,
      },
      {
        number: "02",
        title: "Structuur & SEO-plan",
        description:
          "We bepalen de sitemap, dienstenpagina's, regio's, CTA's en SEO/GEO-structuur. Zo bouwen we niet zomaar een mooie site, maar een platform dat gevonden wordt.",
        icon: <Route className="h-5 w-5" />,
      },
      {
        number: "03",
        title: "Design & ontwikkeling",
        description:
          "We werken het webdesign uit in je huisstijl, bouwen de pagina's en voorzien waar nodig foto's, video, copywriting, formulieren of reservatiesystemen.",
        icon: <PenTool className="h-5 w-5" />,
      },
      {
        number: "04",
        title: "Lancering & groei",
        description:
          "Na testing zetten we de website live. Daarna kun je verder groeien met SEO, content, cases, kennisbank, tracking en leadopvolging.",
        icon: <Rocket className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    icon: <Search className="h-4 w-4" />,
    href: "/diensten/seo",
    serviceLabel: "Bekijk SEO",
    steps: [
      {
        number: "01",
        title: "Analyse & doelen",
        description:
          "We bekijken je huidige website, zoekwoorden, regio's, concurrenten en technische basis. We bepalen waar de grootste kansen liggen.",
        icon: <Search className="h-5 w-5" />,
      },
      {
        number: "02",
        title: "Structuur & optimalisatieplan",
        description:
          "We maken een concreet SEO/GEO-plan met dienstenpagina's, lokale pagina's, contentclusters, metadata en technische verbeterpunten.",
        icon: <ListChecks className="h-5 w-5" />,
      },
      {
        number: "03",
        title: "Uitvoering & content",
        description:
          "We optimaliseren pagina's, schrijven of verbeteren content, versterken interne links en zorgen dat je website duidelijker wordt voor Google en AI-systemen.",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        number: "04",
        title: "Monitoring & bijsturing",
        description:
          "We volgen zichtbaarheid, verkeer en leads op. Waar nodig sturen we bij met extra content, technische verbeteringen of lokale SEO-acties.",
        icon: <LineChart className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "fotografie",
    label: "Fotografie",
    icon: <Camera className="h-4 w-4" />,
    href: "/diensten/fotografie",
    serviceLabel: "Bekijk fotografie",
    steps: [
      {
        number: "01",
        title: "Briefing & beeldrichting",
        description:
          "We bespreken waarvoor de beelden gebruikt worden: website, social media, producten, team, event of realisaties. We bepalen sfeer, stijl en planning.",
        icon: <MessagesSquare className="h-5 w-5" />,
      },
      {
        number: "02",
        title: "Voorbereiding & shootplanning",
        description:
          "We leggen locatie, timing, shotlist, personen, producten en praktische details vast. Zo verloopt de shoot rustig en efficiënt.",
        icon: <CalendarClock className="h-5 w-5" />,
      },
      {
        number: "03",
        title: "Fotoshoot",
        description:
          "Tijdens de shoot zorgen we voor begeleiding en een ontspannen sfeer. Mensen worden op hun gemak gesteld, zodat de beelden natuurlijk en professioneel aanvoelen.",
        icon: <Camera className="h-5 w-5" />,
      },
      {
        number: "04",
        title: "Selectie & oplevering",
        description:
          "We selecteren en bewerken de beelden voor web, social media of drukwerk. Je krijgt sterke foto's die je merk geloofwaardig tonen.",
        icon: <Images className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "videografie",
    label: "Videografie",
    icon: <Video className="h-4 w-4" />,
    href: "/diensten/videografie",
    serviceLabel: "Bekijk videografie",
    steps: [
      {
        number: "01",
        title: "Verhaal & doel bepalen",
        description:
          "We bepalen wat de video moet doen: je bedrijf voorstellen, een product tonen, sfeer brengen, klanten overtuigen of personeel aantrekken.",
        icon: <Lightbulb className="h-5 w-5" />,
      },
      {
        number: "02",
        title: "Script & opnameplanning",
        description:
          "We werken een shotlist, planning en aanpak uit. We bereiden interviews, locaties, beelden en praktische zaken voor.",
        icon: <Clapperboard className="h-5 w-5" />,
      },
      {
        number: "03",
        title: "Opnames & begeleiding",
        description:
          "Tijdens de opname begeleiden we mensen voor de camera. We houden het toegankelijk, duidelijk en menselijk, zodat niemand zich ongemakkelijk voelt.",
        icon: <Video className="h-5 w-5" />,
      },
      {
        number: "04",
        title: "Montage & publicatie",
        description:
          "We monteren de video, voegen muziek, titels of ondertitels toe en leveren versies op voor website, social media of campagnes.",
        icon: <Film className="h-5 w-5" />,
      },
    ],
  },
];

/** English mirror of {@link processTracks}. Same track ids, icons and hrefs;
 * only the copy differs. */
export const processTracksEn: ProcessTrack[] = [
  {
    id: "webdesign",
    label: "Web design",
    icon: <Monitor className="h-4 w-4" />,
    href: "/services/web-design",
    serviceLabel: "View web design",
    steps: [
      {
        number: "01",
        title: "Introduction & briefing",
        description:
          "We discuss your goals, target audience, offering and desired look and feel. We listen to your story first, so the website truly fits your business.",
        icon: <MessagesSquare className="h-5 w-5" />,
      },
      {
        number: "02",
        title: "Structure & SEO plan",
        description:
          "We define the sitemap, service pages, regions, CTAs and SEO/GEO structure. This way we don't just build a good-looking site, but a platform that gets found.",
        icon: <Route className="h-5 w-5" />,
      },
      {
        number: "03",
        title: "Design & development",
        description:
          "We work out the design in your house style, build the pages, and add photography, video, copywriting, forms or booking systems where needed.",
        icon: <PenTool className="h-5 w-5" />,
      },
      {
        number: "04",
        title: "Launch & growth",
        description:
          "After testing, we launch the website. From there you can keep growing with SEO, content, case studies, a knowledge base, tracking and lead follow-up.",
        icon: <Rocket className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    icon: <Search className="h-4 w-4" />,
    href: "/services/seo",
    serviceLabel: "View SEO",
    steps: [
      {
        number: "01",
        title: "Analysis & goals",
        description:
          "We review your current website, keywords, regions, competitors and technical foundation, and identify where the biggest opportunities lie.",
        icon: <Search className="h-5 w-5" />,
      },
      {
        number: "02",
        title: "Structure & optimisation plan",
        description:
          "We build a concrete SEO/GEO plan with service pages, local pages, content clusters, metadata and technical improvements.",
        icon: <ListChecks className="h-5 w-5" />,
      },
      {
        number: "03",
        title: "Execution & content",
        description:
          "We optimise pages, write or improve content, strengthen internal linking and make your website clearer for Google and AI systems.",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        number: "04",
        title: "Monitoring & adjustment",
        description:
          "We track visibility, traffic and leads, and adjust where needed with extra content, technical improvements or local SEO actions.",
        icon: <LineChart className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "fotografie",
    label: "Photography",
    icon: <Camera className="h-4 w-4" />,
    href: "/services/photography",
    serviceLabel: "View photography",
    steps: [
      {
        number: "01",
        title: "Briefing & creative direction",
        description:
          "We discuss what the images are for: website, social media, products, team, an event or case studies, and set the mood, style and planning.",
        icon: <MessagesSquare className="h-5 w-5" />,
      },
      {
        number: "02",
        title: "Preparation & shoot planning",
        description:
          "We lock in location, timing, shot list, people, products and practical details, so the shoot runs smoothly and efficiently.",
        icon: <CalendarClock className="h-5 w-5" />,
      },
      {
        number: "03",
        title: "Photo shoot",
        description:
          "During the shoot we guide you and keep the atmosphere relaxed. People are put at ease, so the images feel natural and professional.",
        icon: <Camera className="h-5 w-5" />,
      },
      {
        number: "04",
        title: "Selection & delivery",
        description:
          "We select and edit the images for web, social media or print. You receive strong photos that present your brand credibly.",
        icon: <Images className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "videografie",
    label: "Video production",
    icon: <Video className="h-4 w-4" />,
    href: "/services/videography",
    serviceLabel: "View video production",
    steps: [
      {
        number: "01",
        title: "Story & goal",
        description:
          "We determine what the video needs to do: introduce your business, showcase a product, set a mood, convince customers or attract staff.",
        icon: <Lightbulb className="h-5 w-5" />,
      },
      {
        number: "02",
        title: "Script & shoot planning",
        description:
          "We work out a shot list, planning and approach, and prepare interviews, locations, footage and practical details.",
        icon: <Clapperboard className="h-5 w-5" />,
      },
      {
        number: "03",
        title: "Filming & guidance",
        description:
          "During filming we guide people in front of the camera, keeping it approachable, clear and human, so no one feels uncomfortable.",
        icon: <Video className="h-5 w-5" />,
      },
      {
        number: "04",
        title: "Editing & publication",
        description:
          "We edit the video, add music, titles or subtitles, and deliver versions for your website, social media or campaigns.",
        icon: <Film className="h-5 w-5" />,
      },
    ],
  },
];
