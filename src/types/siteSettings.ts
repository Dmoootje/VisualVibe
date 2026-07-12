export type OpeningHoursDay = {
  /** Machine key, e.g. "monday". */
  day: string;
  /** Display label, e.g. "Maandag". */
  label: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  pauseStart: string;
  pauseEnd: string;
  note: string;
};

export type SiteSettings = {
  id: string;

  // 1. Bedrijfsgegevens
  companyName: string;
  /** Public contact e-mail (contact_email). */
  mainEmail: string;
  /** Where new-lead notifications are sent (lead_notification_email). */
  leadNotificationEmail: string;
  phone?: string;
  mobilePhone?: string;
  whatsapp?: string;
  vatNumber?: string;
  contactPerson?: string;
  responseTimeText?: string;

  // 2. Adresgegevens
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  province?: string;
  country?: string;
  fullAddress?: string;

  // 3. Kaart / locatie
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  googleMapsEmbedUrl?: string;
  routeUrl?: string;
  mapMarkerTitle?: string;
  mapDescription?: string;

  // 4. Social links
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;

  // 5. Openingsuren
  openingHours: OpeningHoursDay[];

  // 6. Extra contact CTA's
  appointmentTitle?: string;
  appointmentText?: string;
  appointmentButtonLabel?: string;
  appointmentButtonUrl?: string;
  urgentContactTitle?: string;
  urgentContactText?: string;
  urgentContactButtonLabel?: string;
  urgentContactButtonUrl?: string;

  createdAt: string;
  updatedAt: string;
};

/** The 7 days in order, with sensible defaults (Mon-Fri open, weekend closed). */
export const DEFAULT_OPENING_HOURS: OpeningHoursDay[] = [
  { day: "monday", label: "Maandag", isOpen: true, openTime: "09:00", closeTime: "18:00", pauseStart: "", pauseEnd: "", note: "" },
  { day: "tuesday", label: "Dinsdag", isOpen: true, openTime: "09:00", closeTime: "18:00", pauseStart: "", pauseEnd: "", note: "" },
  { day: "wednesday", label: "Woensdag", isOpen: true, openTime: "09:00", closeTime: "18:00", pauseStart: "", pauseEnd: "", note: "" },
  { day: "thursday", label: "Donderdag", isOpen: true, openTime: "09:00", closeTime: "18:00", pauseStart: "", pauseEnd: "", note: "" },
  { day: "friday", label: "Vrijdag", isOpen: true, openTime: "09:00", closeTime: "18:00", pauseStart: "", pauseEnd: "", note: "" },
  { day: "saturday", label: "Zaterdag", isOpen: false, openTime: "", closeTime: "", pauseStart: "", pauseEnd: "", note: "Gesloten" },
  { day: "sunday", label: "Zondag", isOpen: false, openTime: "", closeTime: "", pauseStart: "", pauseEnd: "", note: "Gesloten" },
];

/**
 * Defaults used when the site_settings doc doesn't exist yet or can't be read
 * (e.g. no Firestore credentials at build time). Mirrors business.config so the
 * site never renders empty contact details.
 */
export const DEFAULT_SITE_SETTINGS: Omit<SiteSettings, "id" | "createdAt" | "updatedAt"> = {
  companyName: "VisualVibe",
  mainEmail: "hello@visualvibe.be",
  leadNotificationEmail: "hello@visualvibe.be",
  phone: "+32 472 96 45 99",
  mobilePhone: "+32 472 96 45 99",
  whatsapp: "",
  vatNumber: "BE1014.755.897",
  contactPerson: "Jens Hardy",
  responseTimeText: "Binnen 2 werkdagen",
  street: "Ziegelsmeer",
  houseNumber: "14",
  postalCode: "3700",
  city: "Tongeren-Borgloon",
  province: "Limburg",
  country: "België",
  fullAddress: "Ziegelsmeer 14, 3700 Tongeren-Borgloon",
  // Town-level coordinates for Tongeren; refine to the exact address if needed.
  latitude: 50.7803,
  longitude: 5.4637,
  googleMapsUrl: "",
  googleMapsEmbedUrl: "",
  routeUrl: "",
  mapMarkerTitle: "VisualVibe",
  mapDescription: "Creatief mediabureau in Limburg",
  facebookUrl: "https://www.facebook.com/visualvibee",
  instagramUrl: "https://www.instagram.com/visualvibe.be/",
  linkedinUrl: "https://www.linkedin.com/company/visualvibee",
  youtubeUrl: "https://www.youtube.com/@visualvibe.",
  tiktokUrl: "https://www.tiktok.com/@visualvibe_",
  openingHours: DEFAULT_OPENING_HOURS,
  appointmentTitle: "Plan een gesprek",
  appointmentText: "Liever direct sparren? Boek een afspraak op een moment dat jou uitkomt.",
  appointmentButtonLabel: "Plan een afspraak",
  appointmentButtonUrl: "/offerte-aanvragen",
  urgentContactTitle: "Snel contact",
  urgentContactText: "Heb je een dringende vraag? Bel ons direct tijdens kantooruren.",
  urgentContactButtonLabel: "Bel ons",
  urgentContactButtonUrl: "",
};
