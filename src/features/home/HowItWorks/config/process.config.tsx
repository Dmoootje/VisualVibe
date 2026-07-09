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
