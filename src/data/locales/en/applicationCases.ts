import type {
  ApplicationCase,
  ApplicationCaseImageSlot,
} from "../../applicationCases";

export type EnglishApplicationCaseLocaleRecord = Omit<
  ApplicationCase,
  "id" | "slug" | "websiteUrl" | "status" | "published" | "featured"
> & {
  displaySlug: string;
  imageAlts: Record<ApplicationCaseImageSlot, string>;
};

const imageAlts = (name: string): Record<ApplicationCaseImageSlot, string> => ({
  cover: `${name} application platform shown on a desktop screen`,
  "mobile-cover": `${name} application platform shown on a mobile screen`,
  "home-desktop": `${name} homepage on desktop`,
  "home-mobile": `${name} homepage on mobile`,
  "core-flow": `${name} main user journey`,
  dashboard: `${name} management dashboard`,
  "backend-1": `${name} administration interface, screen 1`,
  "backend-2": `${name} administration interface, screen 2`,
  "backend-3": `${name} administration interface, screen 3`,
  "backend-4": `${name} administration interface, screen 4`,
  "backend-5": `${name} administration interface, screen 5`,
  "backend-6": `${name} administration interface, screen 6`,
});

export const englishApplicationCaseEditorial: Record<
  string,
  EnglishApplicationCaseLocaleRecord
> = {
  "bm-jumpfun": {
    displaySlug: "bm-jumpfun-rental-platform",
    title: "BM Jumpfun",
    client: "BM JUMPFUN · BOUNCY CASTLE RENTAL PLATFORM",
    tags: ["Rental platform", "Bookings", "React SSR"],
    tagline: "A multilingual rental platform bringing the website, planning and administration together.",
    excerpt:
      "BM Jumpfun combines a fast public rental website with live availability, bookings, route calculations, calendar integration, invoicing and a comprehensive management environment.",
    challenge:
      "Running a rental business involves far more than maintaining a product catalogue. Availability, product combinations, delivery distances, time slots, customer details, schedules, pricing and communication all need to work together without errors. Separate forms and calendars make double bookings and repetitive manual work almost inevitable.",
    solution:
      "We built one central platform where visitors can browse and book products and packages in several languages. Behind the scenes, the same information powers scheduling, price calculations, the calendar, customer follow-up and documents. Before saving a booking, the server independently validates both availability and pricing.",
    capabilities: [
      "Multilingual product catalogue and detail pages",
      "Booking journey with packages, options and additional services",
      "Availability and conflict checks for each bouncy castle",
      "Google Calendar synchronisation and webhook processing",
      "Google Maps route and delivery calculations",
      "Customer, booking and product management",
      "PDF invoices, discount codes and email templates",
      "Analytics, branding and tenant-specific settings",
    ],
    technology: [
      "React 19",
      "Express",
      "Firebase Auth, Firestore and Admin SDK",
      "Google Calendar and Google Maps API",
      "Nodemailer and PDFKit",
      "Sharp",
      "Cloud Run",
    ],
    results: [
      "Public rentals and daily administration connected in one data flow",
      "Lower risk of double bookings through server-side conflict checks",
      "Planning and bookings automatically connected to Google Calendar",
      "Indexable, shareable product pages with their own metadata",
    ],
    ssr: {
      title: "React SSR with a semantic SEO fallback",
      description:
        "The server renders each React route with product and company data before the browser hydrates it. If React rendering fails, crawlers still receive a semantic HTML version instead of an empty application shell.",
      points: [
        "Server-rendered React output with preloaded Firestore data",
        "Dynamic canonical URLs, hreflang and Open Graph data for each language and product",
        "Product, breadcrumb and business data provided as JSON-LD",
        "Dynamic sitemap for Dutch, French and English",
      ],
    },
    seoTitle: "BM Jumpfun bouncy castle rental and booking platform | VisualVibe",
    seoDescription:
      "See how VisualVibe built BM Jumpfun's multilingual bouncy castle rental platform with bookings, availability checks, Google Calendar, route calculations and invoicing.",
    imageAlts: imageAlts("BM Jumpfun"),
  },
  "seo-websites": {
    displaySlug: "seo-websites-ai-seo-geo-saas-platform",
    title: "SEO Websites",
    client: "SEO WEBSITES · AI SEO AND GEO SAAS",
    tags: ["SaaS", "AI, SEO and GEO", "Prerendering"],
    tagline: "A modular SaaS platform for audits, content, products and visibility in AI search.",
    excerpt:
      "SEO Websites brings website audits, AI-assisted content, product copy, SERP tools, workspaces, payments and CMS integrations together in one multilingual platform.",
    challenge:
      "SEO work often depends on dozens of disconnected tools, spreadsheets and recurring checks. Users need more than a text generator. They also need projects, credits, analysis, publishing channels, quality controls and a clear management workflow.",
    solution:
      "We developed a SaaS environment in which every tool is part of a wider project and account model. Analysis, AI generation, payments, plugins and administration share the same user, tenant and quality logic. Public landing pages are prerendered, so the marketing site does not depend on client-side JavaScript.",
    capabilities: [
      "AI article and product copy generators",
      "Website and page audits with clear recommendations",
      "SERP, sitemap, brand and product feed tools",
      "Projects and site workspaces with shared data",
      "Credit wallet, Stripe payments and subscription logic",
      "WordPress and Drupal integrations",
      "Partner, ambassador and affiliate features",
      "Multilingual knowledge base, administration and route audits",
    ],
    technology: [
      "React 19 and Vite",
      "Express and PostgreSQL",
      "Gemini, OpenAI and Anthropic",
      "Stripe",
      "Firecrawl and Cheerio",
      "WordPress and Drupal plugins",
      "Cloud Storage",
    ],
    results: [
      "One account environment for analysis, generation and publishing",
      "Modular tools sharing the same projects and quality controls",
      "Public marketing routes in four languages",
      "An extensible foundation for partners, agencies and integrations",
    ],
    ssr: {
      title: "Streaming prerendering for every public SEO route",
      description:
        "During the build, public routes are written to complete HTML using React's streaming server renderer. The resulting pages already contain real headings, content, metadata and structured data before the application starts in the browser.",
      points: [
        "renderToPipeableStream waits for lazy routes and Suspense content",
        "Canonical URLs and hreflang for Dutch, English, French and German",
        "Automatic JSON-LD and FAQ schema generated from rendered content",
        "Build validation stops when required SEO routes remain empty",
      ],
    },
    seoTitle: "SEO Websites AI SEO and GEO SaaS platform | VisualVibe",
    seoDescription:
      "Explore the SEO Websites SaaS platform for AI content, product copy, website audits, workspaces, payments, CMS plugins and server-side prerendering.",
    imageAlts: imageAlts("SEO Websites"),
  },
  visualvibe: {
    displaySlug: "visualvibe-website-content-platform",
    title: "VisualVibe",
    client: "VISUALVIBE · WEBSITE, KNOWLEDGE BASE AND PORTFOLIO PLATFORM",
    tags: ["Next.js", "Content platform", "SSR and ISR"],
    tagline: "A fast marketing website with its own content, portfolio and communication backend.",
    excerpt:
      "VisualVibe combines an extensive service architecture, topic-based knowledge base, case studies, sector pages, lead handling, email and administration in one server-rendered Next.js application.",
    challenge:
      "A creative agency publishes many kinds of content: services, specialist services, regions, sectors, articles, photography, video, case studies and enquiries. These elements need to support each other for SEO while keeping management, performance and navigation clear.",
    solution:
      "We built a data-driven Next.js platform where routes, canonical URLs, the sitemap, navigation and internal links are generated from the same sources. Firestore manages dynamic portfolio and administration content, while MDX and typed datasets reliably publish the detailed knowledge and service architecture.",
    capabilities: [
      "Service, sector, region and case study architecture",
      "Validated pillar and cluster knowledge base",
      "Administration for portfolio, photography and content images",
      "Lead handling, newsletters and a complete IMAP/SMTP mailbox",
      "Multilingual routing and canonical URL management",
      "Dynamic XML sitemap and human-readable sitemap",
      "Structured data for services, articles and collections",
      "Firebase Storage and Firestore with server-side fallbacks",
    ],
    technology: [
      "Next.js App Router",
      "React 19 Server Components",
      "Firebase Auth, Firestore and Storage",
      "MDX",
      "next-intl",
      "IMAPFlow and Nodemailer",
      "Sharp",
    ],
    results: [
      "One maintainable source for the menu, sitemap and canonical routes",
      "Server-rendered marketing and knowledge pages",
      "Portfolio updates through the admin area without new code",
      "A scalable structure for new services and topic clusters",
    ],
    ssr: {
      title: "Next.js Server Components with ISR for managed content",
      description:
        "Public pages are assembled on the server. Firestore-managed case studies use short revalidation intervals, so newly managed content appears without making every visitor load an empty client application first.",
      points: [
        "Server Components produce indexable HTML",
        "ISR for Firestore-managed portfolio content",
        "Self-referencing canonical URLs and locale routing",
        "Server-side metadata, Open Graph data and structured data",
      ],
    },
    seoTitle: "VisualVibe website and server-rendered content platform",
    seoDescription:
      "See how VisualVibe built its Next.js platform with SSR, ISR, a topic-based knowledge base, case studies, Firestore management, lead handling, email and technical SEO.",
    imageAlts: imageAlts("VisualVibe"),
  },
  pelletkachelzorg: {
    displaySlug: "pelletkachelzorg-multisite-commerce-platform",
    title: "Pelletkachelzorg",
    client: "PELLETKACHELZORG · MULTISITE CMS AND ECOMMERCE",
    tags: ["In development", "Multisite", "Ecommerce and CMS"],
    tagline: "A multisite business platform for sales, service, content and communication.",
    excerpt:
      "Pelletkachelzorg is evolving into a multi-website CMS and ecommerce platform with a catalogue, stock, orders, payments, visual builders, communication tools and settings for each site.",
    challenge:
      "Several websites, brands and languages need to share products, content, customers and communication where useful, yet remain strictly separated wherever companies, prices, orders or configurations differ. The backend must also stay practical for employees using it every day.",
    solution:
      "We are developing a Next.js platform where each website has its own configuration, domain, visual identity, content, shop settings and communication environment. The server remains the source of truth for prices, options, stock, delivery, VAT and payments. A CMS and visual builders allow teams to manage the public websites without code.",
    capabilities: [
      "Multisite and multibrand management from one environment",
      "Products, variations, related products and stock",
      "Server-authoritative checkout, delivery, VAT and B2B VIES checks",
      "Mollie payments, orders, statuses and email journeys",
      "Page, blog, service and menu management",
      "Visual header, footer and sidebar builders",
      "Communication centre with IMAP, SMTP and quotation requests",
      "Site-specific API, email, permalink and maintenance settings",
    ],
    technology: [
      "Next.js 16 App Router",
      "React 19",
      "Firebase Auth, Firestore and Storage",
      "Mollie",
      "IMAPFlow and Nodemailer",
      "TipTap",
      "Puppeteer and Sharp",
    ],
    results: [
      "One technical foundation for several independent websites",
      "Clear separation between shared core data and site-specific presentation",
      "Prices, stock and orders validated again on the server",
      "In development, with a phased rollout of ecommerce, CMS and communication features",
    ],
    ssr: {
      title: "Next.js SSR with server-authoritative ecommerce",
      description:
        "Public pages and dynamic CMS routes are assembled on the server through the App Router. Critical ecommerce decisions also remain server-side, preventing client data from manipulating prices, options or stock.",
      points: [
        "Server Components and dynamic catch-all routes",
        "Canonical redirects and a site-specific sitemap",
        "Server-side recalculation of catalogue, delivery and VAT",
        "Site resolution by domain through Host and X-Forwarded-Host headers",
      ],
    },
    seoTitle: "Pelletkachelzorg multisite CMS and ecommerce platform",
    seoDescription:
      "Explore the Pelletkachelzorg platform in development, including multisite CMS, catalogue, stock, Mollie payments, server-side checkout, visual builders and a communication centre.",
    imageAlts: imageAlts("Pelletkachelzorg"),
  },
};
