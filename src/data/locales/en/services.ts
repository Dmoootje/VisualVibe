import type { Service, SubserviceEditorial } from "@/types";
import { englishDroneEditorial } from "./subservice-content/drone";
import { englishFotografieEditorial } from "./subservice-content/fotografie";
import { englishVideographyEditorial } from "./subservice-content/videografie";
import { englishXrEditorial } from "./subservice-content/xr";
import { englishWebdesignEditorial } from "./subservice-content/webdesign";
import { englishPodcastingEditorial } from "./subservice-content/podcasting";
import { englishMasterclassesEditorial } from "./subservice-content/masterclasses";
import { englishSeoEditorial } from "./subservice-content/seo";

export type EnglishServiceLocaleRecord = {
  displaySlug: string;
  title: string;
  summary: string;
  body: string;
  benefits: string[];
  process: Service["process"];
  faqs: Service["faqs"];
  cta: { title: string; description: string; label: string; href: string };
  seo: Service["seo"];
  imageAlt: string;
  internalLinks: { href: string; label: string }[];
  editorial?: SubserviceEditorial;
};

const quotationCta = (service: string) => ({
  title: `Interested in ${service}?`,
  description:
    "Tell us about your project. We will review your goals, requirements and context, then propose a clearly defined next step.",
  label: "Request a quotation",
  href: "/en/request-a-quotation/",
});

export const englishServiceEditorial: Record<
  string,
  EnglishServiceLocaleRecord
> = {
  webdesign: {
    displaySlug: "web-design",
    title: "Web design",
    summary:
      "Fast websites and online shops designed to win customers, not simply to look good.",
    body: "VisualVibe designs and builds fast, user-friendly websites and online shops for SMEs in Limburg, Belgium. Whether you need a focused one-page site or a complete e-commerce platform, we shape the structure around speed, search visibility and a clear route to contact.",
    benefits: [
      "Business websites",
      "Online shops",
      "One-page websites",
      "Website redesigns",
      "Website maintenance",
      "WordPress websites",
      "SEO-ready websites",
    ],
    process: [
      {
        title: "Introduction and briefing",
        description:
          "We discuss your goals, audience and preferred visual direction.",
      },
      {
        title: "Concept and structure",
        description:
          "We develop the sitemap, wireframes and a clear design proposal.",
      },
      {
        title: "Development and content",
        description: "We build the site with close attention to speed and SEO.",
      },
      {
        title: "Launch and maintenance",
        description:
          "We launch the site, provide training and can handle ongoing maintenance.",
      },
    ],
    faqs: [
      {
        question: "How much does a website from VisualVibe cost?",
        answer:
          "The price depends on the scale and functionality. A one-page site costs less than an online shop. Request a no-obligation quotation for a price tailored to your project.",
      },
      {
        question: "How long does it take to build a website?",
        answer:
          "A one-page site or compact SME website usually takes three to five weeks from briefing to launch. Online shops and bespoke projects take longer, and the delivery of copy and images also affects the schedule.",
      },
      {
        question: "Do you use WordPress or build bespoke websites?",
        answer:
          "Both. We recommend WordPress to SMEs that want to manage their own content, and bespoke technology such as Next.js when speed and scalability are the priority.",
      },
      {
        question: "Do you also handle SEO?",
        answer:
          "Yes. Every website is built on sound technical SEO foundations, including fast loading, a clear structure, mobile usability and suitable metadata. Active optimisation can be added through our SEO services.",
      },
      {
        question: "Will the website work well on mobile devices?",
        answer:
          "Yes. We use responsive design so the website adapts to phones, tablets and desktop screens. Mobile usability is considered throughout the design and development process.",
      },
      {
        question: "Can I update the website myself after delivery?",
        answer:
          "With a WordPress website, you can manage agreed copy, images and pages yourself, supported by a short handover session. If you prefer ongoing assistance, website maintenance can be included separately.",
      },
    ],
    cta: quotationCta("a new website"),
    seo: {
      title: "Web Design Limburg | Websites for SMEs | VisualVibe",
      description:
        "Need a website in Limburg, Belgium? VisualVibe builds fast, professional websites with strong visuals, sound SEO and a conversion-focused structure.",
      keywords: [
        "web design Limburg",
        "website for SMEs",
        "web design agency Limburg",
        "professional business website",
      ],
    },
    imageAlt: "Responsive business website designed by VisualVibe",
    internalLinks: [
      { href: "/en/services/seo/", label: "SEO services" },
      { href: "/en/request-a-quotation/", label: "request a quotation" },
    ],
  },
  seo: {
    displaySlug: "seo",
    title: "SEO",
    summary:
      "Local search visibility and a stronger presence in AI-generated answers.",
    body: "VisualVibe helps SMEs improve their visibility in Google and make their information clearer for AI-assisted search experiences such as ChatGPT, Perplexity and Google AI Overviews. Our work combines technical SEO, local optimisation and useful content that answers customers' questions directly, without guaranteeing rankings or citations.",
    benefits: [
      "Local SEO",
      "Technical SEO",
      "SEO copywriting",
      "Google Business Profile optimisation",
      "AI SEO, AEO and GEO",
    ],
    process: [
      {
        title: "SEO audit",
        description:
          "We analyse the technical and editorial quality of your current website.",
      },
      {
        title: "Strategy and keywords",
        description:
          "We set priorities based on relevant demand and competition.",
      },
      {
        title: "Implementation",
        description:
          "We improve the technology, content and internal link structure.",
      },
      {
        title: "Follow-up",
        description: "We report on progress and adjust the work where needed.",
      },
    ],
    faqs: [
      {
        question: "What do SEO services include?",
        answer:
          "Our SEO services cover local SEO, technical SEO, SEO copywriting, Google Business Profile optimisation and AI search optimisation through AEO and GEO.",
      },
      {
        question: "How quickly does SEO produce results?",
        answer:
          "Local improvements can become noticeable within a few weeks. Competitive national search terms often take three to six months. Results build over time while the website and its content are maintained.",
      },
      {
        question: "What is the difference between SEO and AEO or GEO?",
        answer:
          "SEO improves visibility in conventional search results. AEO and GEO make information clearer for answer engines and generative search experiences such as ChatGPT, Perplexity and Google AI Overviews.",
      },
      {
        question: "Do you provide local SEO for my region?",
        answer:
          "Yes. Local SEO can include Google Business Profile optimisation, relevant regional searches and consistent official business details. The approach follows your genuine premises or service area rather than promising a particular local position.",
      },
      {
        question: "Do your SEO services require a contract?",
        answer:
          "Not necessarily. We provide both one-off work, such as an SEO audit or an optimised website, and ongoing projects with agreed reporting. The quotation defines the scope and duration.",
      },
      {
        question: "Does my website need to be rebuilt before SEO work begins?",
        answer:
          "Not always. We begin by assessing the current website. If its technical foundation is sound, the existing site can be improved. If it is slow or structurally outdated, a rebuild may be more efficient than repeated corrective work.",
      },
    ],
    cta: quotationCta("SEO support"),
    seo: {
      title: "SEO Services Limburg | Visibility in Google and AI",
      description:
        "SEO services for SMEs in Limburg, Belgium: local SEO, technical SEO, copywriting and AI search optimisation through AEO and GEO.",
      keywords: [
        "SEO services Limburg",
        "SEO agency Limburg",
        "local SEO",
        "technical SEO",
        "AI SEO",
        "AEO",
        "GEO",
      ],
    },
    imageAlt: "SEO and web design project presented by VisualVibe",
    internalLinks: [
      { href: "/en/services/web-design/", label: "web design" },
      { href: "/en/request-a-quotation/", label: "request an SEO quotation" },
    ],
  },
  fotografie: {
    displaySlug: "photography",
    title: "Photography",
    summary:
      "Professional photography that presents your business and brand at their best.",
    body: "Strong photography helps a website earn trust. VisualVibe photographs businesses, products, events and property throughout Limburg, Belgium, creating a consistent image library for web, print and social media.",
    benefits: [
      "Corporate photography",
      "Business portraits",
      "Product photography",
      "Event photography",
      "Property photography",
      "Project photography",
      "Brand photography",
    ],
    process: [
      {
        title: "Preparation",
        description:
          "We agree a shot list and schedule that fit your brand and purpose.",
      },
      {
        title: "Photo shoot",
        description: "We photograph on location or in a studio setting.",
      },
      {
        title: "Selection and retouching",
        description:
          "We select the strongest images and edit them professionally.",
      },
      {
        title: "Delivery",
        description: "You receive suitable formats for web and print.",
      },
    ],
    faqs: [
      {
        question: "Do you photograph outside Limburg?",
        answer:
          "Yes. Limburg is our home base, but we work across Flanders, Antwerp and Dutch Limburg, and travel farther by arrangement.",
      },
      {
        question: "How quickly will I receive the photographs?",
        answer:
          "You will usually receive an initial selection within a few working days. Timing for the complete edited set depends on the scale of the shoot.",
      },
      {
        question: "Can photography and video be combined?",
        answer:
          "Yes. We often combine photography, video and drone work in one production day so that all assets share the same visual style.",
      },
      {
        question: "Can we use the photographs across all our own channels?",
        answer:
          "Yes. The agreed delivery includes web and print files with usage rights for your own commercial channels. Any different licensing conditions are stated in the quotation.",
      },
      {
        question: "What determines the cost of a professional photo shoot?",
        answer:
          "The price depends on the type and duration of the shoot, the locations and the number of finished photographs. After the briefing, you receive a quotation tailored to the agreed production.",
      },
      {
        question: "Which types of photography do you provide?",
        answer:
          "We provide corporate, portrait, product, event, property and project photography, brand photography and drone photography. The scope can range from one focused shoot to a broader image library.",
      },
      {
        question: "Do you photograph on location or in a studio?",
        answer:
          "Both. We can work at your business, property or event, or use a studio setup when a neutral background and controlled lighting are needed, for example for products or portraits.",
      },
    ],
    cta: quotationCta("professional photography"),
    seo: {
      title: "Corporate Photography Limburg for SMEs | VisualVibe",
      description:
        "Corporate photography in Limburg, Belgium, including business portraits, product photography, events, property and brand imagery.",
      keywords: [
        "corporate photographer Limburg",
        "business photography Limburg",
        "product photography",
        "event photography",
        "brand photography",
      ],
    },
    imageAlt: "Corporate photography session by VisualVibe in Limburg",
    internalLinks: [
      { href: "/en/services/videography/", label: "videography" },
      {
        href: "/en/request-a-quotation/",
        label: "request a photography quotation",
      },
    ],
  },
  videografie: {
    displaySlug: "videography",
    title: "Videography",
    summary:
      "Corporate films, promotional videos and social content that hold attention.",
    body: "Video gives your organisation a clear and recognisable voice. VisualVibe produces corporate films, promotional videos, event aftermovies and recruitment videos for businesses in Limburg and beyond.",
    benefits: [
      "Corporate films",
      "Promotional videos",
      "Social media video",
      "Event aftermovies",
      "Recruitment videos",
      "Customer testimonials",
      "Video podcasts",
      "News-style reports",
    ],
    process: [
      {
        title: "Script and concept",
        description: "We develop the narrative and central message.",
      },
      {
        title: "Production",
        description: "We film professionally on location.",
      },
      {
        title: "Editing",
        description: "We edit the footage, colour and sound.",
      },
      {
        title: "Delivery",
        description:
          "You receive versions prepared for web and social channels.",
      },
    ],
    faqs: [
      {
        question: "How long does a corporate video take?",
        answer:
          "Allow roughly three to six weeks from briefing to delivery, depending on the scope, filming days and edit. A short social clip can be completed faster.",
      },
      {
        question: "What determines the cost of a corporate video?",
        answer:
          "The price depends on the length, filming days, locations, crew and post-production. We provide a tailored quotation once the intended film and required versions are clear.",
      },
      {
        question:
          "What is the difference between a corporate film and a promotional video?",
        answer:
          "A corporate film explains who you are and how you work, building trust over time. A promotional video is usually shorter and focuses on one product, service or campaign with a more immediate action.",
      },
      {
        question: "Do you supply vertical video for social media?",
        answer:
          "Yes. We prepare the right format for each channel, including 16:9 for websites and YouTube and square or vertical 9:16 versions for Reels, TikTok and Shorts.",
      },
      {
        question: "Do you film outside Limburg?",
        answer:
          "Yes. Limburg, Belgium, is our base, but we work across Flanders, Antwerp and the Dutch province of Limburg, and travel farther by arrangement.",
      },
    ],
    cta: quotationCta("professional video"),
    seo: {
      title: "Videographer Limburg | Corporate Video Production",
      description:
        "Professional videography in Limburg, Belgium, for corporate films, promotional video, recruitment, events and social media content.",
      keywords: [
        "videographer Limburg",
        "corporate video production",
        "promotional video",
        "social media video",
      ],
    },
    imageAlt: "Corporate video production by VisualVibe",
    internalLinks: [
      { href: "/en/services/photography/", label: "photography" },
      { href: "/en/request-a-quotation/", label: "request a video quotation" },
    ],
  },
  "drone-fpv": {
    displaySlug: "drone-fpv",
    title: "Drone and FPV",
    summary:
      "Drone and FPV footage for businesses, property, construction projects and events.",
    body: "Aerial footage reveals the setting and scale of a project in a way ground-level images cannot. VisualVibe provides professional drone and FPV photography and video for businesses throughout Limburg, Belgium.",
    benefits: [
      "Drone photography",
      "Drone video",
      "FPV video",
      "Property aerials",
      "Construction project aerials",
      "Event drone footage",
    ],
    process: [
      {
        title: "Permissions and planning",
        description:
          "We plan the flight and arrange permissions where required.",
      },
      {
        title: "Flight and filming",
        description:
          "A certified pilot captures drone or FPV footage on location.",
      },
      {
        title: "Post-production",
        description: "We edit the material into a finished video or image set.",
      },
    ],
    faqs: [
      {
        question: "Is your drone pilot certified?",
        answer:
          "Yes. We work with a certified pilot and suitable insurance, and arrange the permissions required for the location in line with applicable European drone rules.",
      },
      {
        question:
          "What is the difference between conventional drone and FPV video?",
        answer:
          "Conventional drone video uses smooth aerial movements and wider viewpoints. FPV, or first-person view, can follow a closer, more dynamic route through and around a location.",
      },
      {
        question: "Can you fly a drone anywhere?",
        answer:
          "No. Airspace, crowds, buildings, obstacles and local conditions can restrict a flight. We review the location and any permissions required before confirming what can be captured, and reassess conditions on the day.",
      },
      {
        question: "Which projects benefit from drone footage?",
        answer:
          "Drone footage can add useful scale and context to property, construction and renovation projects, business sites, events and visitor locations. The right approach depends on the communication goal and location.",
      },
      {
        question: "Do you fly outside Limburg?",
        answer:
          "Yes. We plan work across Flanders, Antwerp and the Dutch province of Limburg, and can travel farther by arrangement. Every exact location remains subject to a feasibility check.",
      },
    ],
    cta: quotationCta("drone or FPV production"),
    seo: {
      title: "Drone and FPV Video Limburg | VisualVibe",
      description:
        "Professional drone and FPV video in Limburg, Belgium, for businesses, property, construction and events, filmed by a certified pilot.",
      keywords: [
        "drone video Limburg",
        "FPV video Belgium",
        "drone photography",
        "aerial video",
      ],
    },
    imageAlt: "Certified drone filming a business project in Limburg",
    internalLinks: [
      { href: "/en/services/videography/", label: "videography" },
      { href: "/en/request-a-quotation/", label: "request a drone quotation" },
    ],
  },
  "3d-vr-ar": {
    displaySlug: "3d-vr-ar",
    title: "3D, VR and AR",
    summary:
      "Interactive tours and immersive media that let people explore a place online.",
    body: "VisualVibe creates 3D tours and virtual walk-throughs for property, hospitality venues, showrooms and business locations in Limburg, Belgium. Visitors can explore the space online before arranging a visit.",
    benefits: [
      "Interactive 3D tours",
      "Virtual walk-throughs",
      "Property tours",
      "Showroom tours",
      "Hospitality tours",
    ],
    process: [
      {
        title: "Capture",
        description:
          "We record the complete agreed space using 360-degree imagery.",
      },
      {
        title: "Processing",
        description: "We build and test the navigable 3D tour.",
      },
      {
        title: "Integration",
        description:
          "We embed the tour on your website or connect it with the relevant Google Business Profile where supported.",
      },
    ],
    faqs: [
      {
        question: "What is a 3D tour?",
        answer:
          "A 3D tour is an interactive digital representation of a space. Visitors can move from viewpoint to viewpoint on a website using a phone, tablet or computer.",
      },
      {
        question: "Can the tour be embedded on our website?",
        answer:
          "Yes. We can provide or implement an embed so the tour becomes part of the relevant property, showroom or location page.",
      },
    ],
    cta: quotationCta("a 3D or immersive experience"),
    seo: {
      title: "3D Tours, VR and AR in Limburg | VisualVibe",
      description:
        "Interactive 3D tours and immersive media for property, hospitality, showrooms and businesses in Limburg, Belgium.",
      keywords: [
        "3D tour Limburg",
        "virtual tour Belgium",
        "VR production",
        "AR experience",
      ],
    },
    imageAlt: "Interactive 3D tour of a business location",
    internalLinks: [
      { href: "/en/services/photography/", label: "professional photography" },
      {
        href: "/en/request-a-quotation/",
        label: "request a 3D tour quotation",
      },
    ],
  },
  podcasting: {
    displaySlug: "podcasting",
    title: "Podcasting",
    summary:
      "Professional business podcasts, from format and recording to editing and publication.",
    body: "A business podcast turns specialist knowledge and conversations into a reusable content format. VisualVibe helps with the concept, professional audio or video recording and editing, from a one-off episode to a defined series. Publication support is included only when agreed.",
    benefits: [
      "Business podcasts",
      "Video podcasts",
      "One-off recording",
      "Complete podcast programmes",
      "Podcasts for experts",
    ],
    process: [
      {
        title: "Format and planning",
        description:
          "We define the audience, format, guests and episode structure.",
      },
      {
        title: "Recording",
        description:
          "We record professional audio or video in a studio setting or on location.",
      },
      {
        title: "Editing and publication preparation",
        description:
          "We edit the episode, balance the sound and prepare the agreed publication files.",
      },
    ],
    faqs: [
      {
        question: "Can you record a video podcast as well as audio?",
        answer:
          "Yes. A multi-camera video podcast can be delivered as a full episode for YouTube, an audio edition for podcast platforms and shorter clips for social media.",
      },
      {
        question: "Can you develop the podcast format with us?",
        answer:
          "Yes. We can help shape the concept, episode structure, guest planning and production workflow before recording starts.",
      },
    ],
    cta: quotationCta("a business podcast"),
    seo: {
      title: "Business Podcast Production Limburg | VisualVibe",
      description:
        "Business podcast production in Limburg, Belgium: format development, professional audio and video recording, editing and publication.",
      keywords: [
        "business podcast production",
        "podcast studio Limburg",
        "video podcast",
        "corporate podcast",
      ],
    },
    imageAlt: "Professional business podcast recording setup",
    internalLinks: [
      { href: "/en/services/videography/", label: "video production" },
      {
        href: "/en/request-a-quotation/",
        label: "request a podcast quotation",
      },
    ],
  },
  masterclasses: {
    displaySlug: "masterclasses",
    title: "Masterclasses",
    summary:
      "Professionally recorded courses, workshops and masterclasses ready for reuse.",
    body: "VisualVibe records training sessions, workshops and masterclasses as polished video content. The result can support an online course, internal training or on-demand viewing for participants.",
    benefits: [
      "Training course recording",
      "Online course video",
      "Workshop filming",
    ],
    process: [
      {
        title: "Planning",
        description:
          "We agree the location, schedule and intended final deliverables.",
      },
      {
        title: "Recording",
        description:
          "We capture the session with a multi-camera setup where required.",
      },
      {
        title: "Editing",
        description:
          "We edit the material into finished modules or an aftermovie, according to the agreed purpose.",
      },
    ],
    faqs: [
      {
        question: "Can you divide a course into separate modules?",
        answer:
          "Yes. We can structure the recording and edit around chapters so each lesson can be watched and managed separately.",
      },
      {
        question: "Can slides be included in the video?",
        answer:
          "Yes. We can combine the presenter and slides in a consistent layout so diagrams and key points remain easy to follow.",
      },
    ],
    cta: quotationCta("a recorded course or masterclass"),
    seo: {
      title: "Course and Masterclass Video Production | VisualVibe",
      description:
        "Professional filming for courses, workshops and masterclasses in Limburg, Belgium, including multi-camera recording and modular editing.",
      keywords: [
        "record an online course",
        "masterclass video production",
        "film a workshop",
        "training video Limburg",
      ],
    },
    imageAlt: "Masterclass recorded with professional cameras and sound",
    internalLinks: [
      { href: "/en/services/videography/", label: "videography" },
      {
        href: "/en/request-a-quotation/",
        label: "request a training video quotation",
      },
    ],
  },
};

// Domain files are merged here as they complete. A strict test compares this
// map with every Dutch stable ID, so an incomplete locale can never be marked ready.
export const englishSubserviceEditorial: Record<
  string,
  EnglishServiceLocaleRecord
> = {
  ...englishFotografieEditorial,
  ...englishVideographyEditorial,
  ...englishDroneEditorial,
  ...englishXrEditorial,
  ...englishWebdesignEditorial,
  ...englishPodcastingEditorial,
  ...englishMasterclassesEditorial,
  ...englishSeoEditorial,
};
