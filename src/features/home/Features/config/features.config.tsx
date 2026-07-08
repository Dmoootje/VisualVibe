import { Monitor, Search, Camera, Video } from "lucide-react";
import { ReactNode } from "react";

export interface Feature {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  benefits: string[];
  image: string;
}

export const featuresConfig = {
  title: "Alles onder één dak",
  subtitle: "Van website tot beeldmateriaal: één aanspreekpunt voor je volledige online uitstraling",

  features: [
    {
      id: "webdesign",
      icon: <Monitor className="h-5 w-5" />,
      title: "Webdesign",
      description:
        "Snelle, gebruiksvriendelijke websites en webshops die gebouwd zijn om klanten op te leveren, niet enkel goed te ogen.",
      benefits: [
        "Website & webshop laten maken",
        "Snelheid en SEO als basisprincipe",
        "WordPress of maatwerk",
        "Doorlopend onderhoud mogelijk",
      ],
      image:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: "seo",
      icon: <Search className="h-5 w-5" />,
      title: "SEO",
      description:
        "Lokale vindbaarheid in Google en in AI-zoekresultaten zoals ChatGPT en Google AI Overviews.",
      benefits: [
        "Lokale SEO voor Limburg",
        "Technische SEO-audits",
        "AI SEO / AEO / GEO",
        "Google Business Profiel-optimalisatie",
      ],
      image:
        "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: "fotografie",
      icon: <Camera className="h-5 w-5" />,
      title: "Fotografie",
      description:
        "Bedrijfsfotografie, productfotografie en eventfotografie die je merk professioneel in beeld brengt.",
      benefits: [
        "Bedrijfs- en productfotografie",
        "Zakelijke portretten",
        "Eventfotografie",
        "Vastgoed- en realisatiefotografie",
      ],
      image:
        "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: "videografie",
      icon: <Video className="h-5 w-5" />,
      title: "Videografie",
      description:
        "Bedrijfsvideo's, promovideo's en social content die je verhaal vertellen en opvallen.",
      benefits: [
        "Bedrijfsvideo & promovideo",
        "Social media video",
        "Event-aftermovies",
        "Wervings- en testimonial-video",
      ],
      image:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop",
    },
  ] as Feature[],
};
