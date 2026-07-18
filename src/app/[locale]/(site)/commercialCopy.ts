import { getLocalizedRequired, type Localized } from "@/i18n/content";
import type { SupportedLocale } from "@/i18n/locales";

type CommercialCopy = {
  contact: {
    title: string; description: string; h1: string; intro: string; address: string;
    phone: string; email: string; responseTime: string; invitationTitle: string;
    invitation: string; formTitle: string; appointmentTitle: string;
    appointmentButton: string; urgentTitle: string; urgentButton: string;
  };
  quotation: { title: string; description: string; h1: string; intro: string };
};

const copy: Localized<CommercialCopy> = {
  nl: {
    contact: { title: "Contact", description: "Neem contact op met VisualVibe. Vraag vrijblijvend een offerte aan of stel je vraag.", h1: "Contact", intro: "Heb je een vraag, een idee of wil je samen bouwen aan groei? We denken graag met je mee.", address: "Adres", phone: "Telefoon", email: "E-mail", responseTime: "Reactietijd", invitationTitle: "Laten we iets moois maken", invitation: "Vertel ons over je project en we nemen zo snel mogelijk contact met je op.", formTitle: "Stuur ons een bericht", appointmentTitle: "Plan een gesprek", appointmentButton: "Plan een afspraak", urgentTitle: "Snel contact", urgentButton: "Bel ons" },
    quotation: { title: "Offerte aanvragen", description: "Vraag een vrijblijvende offerte aan bij VisualVibe voor webdesign, SEO, fotografie, videografie, drone of 3D/VR/AR.", h1: "Offerte aanvragen", intro: "Vertel ons kort over je project en we bezorgen je een vrijblijvend voorstel op maat - binnen de 2 werkdagen." },
  },
  en: {
    contact: { title: "Contact VisualVibe", description: "Contact VisualVibe in Tongeren-Borgloon, Limburg. Ask a question, discuss your project or request a no-obligation quotation.", h1: "Contact", intro: "Have a question or an idea for a project? Tell us what you want to achieve and we will be happy to think it through with you.", address: "Address", phone: "Phone", email: "Email", responseTime: "Response time", invitationTitle: "Let's create something memorable", invitation: "Tell us about your project and we will get back to you as soon as possible.", formTitle: "Send us a message", appointmentTitle: "Schedule a conversation", appointmentButton: "Book an appointment", urgentTitle: "Need a quick answer?", urgentButton: "Call us" },
    quotation: { title: "Request a quotation", description: "Request a no-obligation quotation from VisualVibe for web design, SEO, photography, video, drone or immersive media services.", h1: "Request a quotation", intro: "Tell us briefly about your project. We will send you a tailored, no-obligation proposal within two working days." },
  },
};

export function getCommercialCopy(locale: SupportedLocale): CommercialCopy {
  return getLocalizedRequired(copy, locale, "commercial pages");
}
