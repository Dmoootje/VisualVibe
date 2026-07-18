import type { RealisatieCategory } from "../../realisatieCategories";

export type EnglishRealisatieCategory = Omit<RealisatieCategory, "slug"> & {
  displaySlug: string;
};

export const englishRealisatieCategories: Record<string, EnglishRealisatieCategory> = {
  webdesign: {
    displaySlug: "web-design",
    name: "Web design",
    description: "Websites and online shops we have built for SMEs in Limburg, Belgium, from brand identity to visibility in Google and AI search.",
    seoTitle: "Web design case studies | VisualVibe",
    seoDescription: "Explore fast websites and online shops built by VisualVibe for SMEs in Limburg, Belgium, and across Flanders, with Google and AI search visibility in mind.",
    stats: [{ value: "40+", label: "websites and shops\nlaunched" }, { value: "98", label: "average mobile\nPageSpeed score", accent: true }],
  },
  applicaties: {
    displaySlug: "applications",
    name: "Applications",
    description: "Web applications, SaaS platforms and digital business tools that combine intuitive interfaces with robust backend logic.",
    seoTitle: "Custom applications and software case studies | VisualVibe",
    seoDescription: "Explore VisualVibe software platforms, including SaaS, booking systems, multisite commerce, admin environments, automation and server-side rendering.",
    stats: [{ value: "4", label: "in-depth\nplatform cases" }, { value: "SSR", label: "indexable\ntechnical foundation", accent: true }],
  },
  fotografie: { displaySlug: "photography", name: "Photography", description: "Business, product, event and property photography from our portfolio.", seoTitle: "Photography case studies | VisualVibe", seoDescription: "Explore VisualVibe business, product, event and property photography in Limburg, Belgium, and see how we bring brands into focus." },
  videografie: { displaySlug: "videography", name: "Videography", description: "Corporate films, promotional videos, event highlight films and social videos we have produced.", seoTitle: "Videography case studies | VisualVibe", seoDescription: "Explore corporate films, promotional videos and event highlight films shot and edited in 4K by VisualVibe for businesses in Limburg, Belgium.", stats: [{ value: "50+", label: "productions\ncompleted" }, { value: "4K", label: "filming and\nediting", accent: true }] },
  drone: { displaySlug: "drone-fpv", name: "Drone and FPV", description: "Aerial imagery and FPV video for businesses, real estate, construction and events.", seoTitle: "Drone and FPV case studies | VisualVibe", seoDescription: "Explore VisualVibe drone and FPV work for real estate, construction projects and events across Limburg, Belgium, and Flanders." },
  "3d-vr": { displaySlug: "3d-vr-ar", name: "3D, VR and AR", description: "Step inside our projects through live, navigable 3D scans and explore each space in 360 degrees.", seoTitle: "3D, VR and AR case studies | VisualVibe", seoDescription: "Explore navigable Matterport tours created by VisualVibe for real estate, showrooms and hospitality venues in Limburg, Belgium.", },
  podcasting: { displaySlug: "podcasting", name: "Podcasting", description: "Business podcasts and video podcasts we have recorded and produced.", seoTitle: "Podcasting case studies | VisualVibe", seoDescription: "Explore business and video podcasts by VisualVibe for experts and companies in Limburg, Belgium, from recording and editing to publication-ready delivery.", indexWhenEmpty: true },
  bedrijven: { displaySlug: "businesses", name: "Businesses", description: "Integrated projects for businesses, combining websites, photography and video.", seoTitle: "Business case studies | VisualVibe", seoDescription: "Explore integrated VisualVibe projects combining web design, photography and video for SMEs in Limburg, Belgium.", indexWhenEmpty: true },
  projecten: { displaySlug: "construction-interiors", name: "Construction and interiors", description: "Construction, renovation and interior projects captured through photography and drone imagery.", seoTitle: "Construction and interior case studies | VisualVibe", seoDescription: "Explore construction, renovation and interior projects documented by VisualVibe with photography and drone imagery for contractors in Limburg, Belgium." , indexWhenEmpty: true },
  events: { displaySlug: "events", name: "Events", description: "Photo coverage and event highlight films from corporate events and openings.", seoTitle: "Event case studies | VisualVibe", seoDescription: "Explore event photography and highlight films from corporate events and openings in Limburg, Belgium, with imagery that helps promote the next edition.", indexWhenEmpty: true },
  sport: { displaySlug: "sport", name: "Sport", description: "Case studies for sports clubs and sporting events.", seoTitle: "Sports case studies | VisualVibe", seoDescription: "Explore VisualVibe web design, photography and video for sports clubs and events in Limburg, Belgium, created to connect with members, supporters and sponsors.", indexWhenEmpty: true },
  buitenland: { displaySlug: "case-studies-abroad", name: "Projects abroad", description: "Selected projects completed beyond Belgium's borders.", seoTitle: "International case studies | VisualVibe", seoDescription: "Explore VisualVibe web, photography and video projects abroad, from drone shoots in the Alps to client work in the Netherlands.", indexWhenEmpty: true },
};
