import type { SubserviceEditorial } from "@/types";
import type { EnglishServiceLocaleRecord } from "../services";

type XrEditorialSlug =
  | "3d-tour"
  | "virtuele-rondleiding"
  | "showroom-3d-tour"
  | "vastgoed-3d-tour"
  | "horeca-virtuele-tour";

const localizedEditorial = {
  "3d-tour": {
    intro:
      "Having a professional 3D tour created gives visitors a real space to explore online. We plan the route, linked viewpoints and a tour for your website. We discuss preparation, visible information, publication and hosting in advance. This way you know how recording, management and subsequent updating proceed.",
    excerpt:
      "A navigable 3D tour of your location, carefully scanned, constructed, published and embedded for a clear online space experience.",
    process: [
      {
        title: "Develop purpose and visitor route",
        description:
          "We choose relevant spaces, starting point and order. Website placement and possible information points are also discussed.",
      },
      {
        title: "Prepare the room for recording",
        description:
          "You will receive a checklist for styling, lighting, mirrors, screens and sensitive data. A visual round follows before the scan.",
      },
      {
        title: "Scan and connect points of view",
        description:
          "We record consecutive positions, keep passageways clear and restrict movement for clear navigation.",
      },
      {
        title: "Finish and publish tour",
        description:
          "We check route, starting image and visible zones, add labels and provide link or embed code. Hosting and updates are clarified.",
      },
    ],
    faqs: [
      {
        question:
          "What is the difference between a 3D tour and a regular video?",
        answer:
          "A video follows a montage that is determined for the viewer. In a 3D tour, the visitor chooses the direction and pace between linked points of view. Video is stronger for a driven story; a tour is suitable for exploring a real space independently.",
      },
      {
        question: "How should the room be prepared?",
        answer:
          "Clear away personal and temporary items, hide visible cables, adjust lighting and check mirrors, windows and screens. It is best that the device remains unchanged during scanning. We will send you a checklist in advance that suits your type of location.",
      },
      {
        question: "Can people be present during the scanning?",
        answer:
          "Movement between successive viewpoints can produce disruptive or partial persons. That is why we prefer to work in empty or controlled zones and the supervisor present moves according to instructions. For lively atmospheric images, separate photography may be more suitable.",
      },
      {
        question: "How does the 3D tour get to our website?",
        answer:
          "Usually the published tour is placed in a web page via a link or embed code. We provide the agreed data and can help with the implementation when we have access and technical context. Operation remains partly dependent on website, browser and hosting platform.",
      },
      {
        question:
          "Is hosting included and will the tour remain online indefinitely?",
        answer:
          "Hosting is a recurring component that we clearly describe in the proposal, including the period and chosen management method. We do not promise unlimited availability of external platforms. We agree on practical conditions for extension, transfer or termination.",
      },
    ],
    relatedServices: [
      "virtuele-rondleiding",
      "showroom-3d-tour",
      "vastgoed-3d-tour",
      "bedrijfsfotografie",
      "website-laten-maken",
    ],
    seo: {
      title: "Have a professional 3D tour made in Limburg | VisualVibe",
      description:
        "Would you like to have a 3D tour made in Limburg? We scan your space, build the route and take care of publication, hosting agreements and embedding for your website online.",
      keywords: [
        "Have a 3D tour made",
        "3D tour Limburg",
        "virtual 3D tour",
        "digitally scan space",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "Have a 3D tour made",
        supportingKeywords: [
          "3D tour Limburg",
          "virtual 3D tour",
          "interactive tour",
          "digitally scan space",
        ],
        type: "mixed",
      },
      overview: {
        title: "Have a 3D tour created that navigates logically",
        paragraphs: [
          "A 3D tour connects visual points of view into a spatial tour. Visitors move themselves, look around and choose where they stand still. This makes the layout and atmosphere more understandable than one overview image.",
          "We determine visible zones and prepare the space. After processing, we check the route and starting point and add agreed labels. The tour will be published via link or embed. Hosting, management and a possible rescan in case of changes are explained in advance.",
        ],
        highlights: [
          "Scan plan based on a logical visitor route",
          "Preparation checklist for space and visible details",
          "Control of starting point, navigation and excluded zones",
        ],
      },
      outcomes: {
        title: "Which results in a clear digital tour",
        intro:
          "The tour gives visitors more autonomy and offers your organization a fixed, shareable presentation of the space at the time of recording.",
        items: [
          {
            title: "Explore independently",
            description:
              "The visitor chooses his own route and can view relevant zones at the desired pace without following a linear video.",
          },
          {
            title: "Better spatial expectation",
            description:
              "The layout, connections and atmosphere become more understandable than with just separate photos of individual rooms.",
          },
          {
            title: "Easily shareable presentation",
            description:
              "A publication link can be shared according to the agreed settings or placed in your website via an embed.",
          },
        ],
      },
      idealFor: {
        title: "Spaces for which a 3D tour adds value",
        intro:
          "The form works well when visitors want to understand in advance what a location looks like, is laid out or how it is walked through.",
        items: [
          {
            title: "Public locations",
            description:
              "Give visitors an idea in advance of the reception, route and different zones in a business, center or meeting place.",
          },
          {
            title: "Showrooms and shops",
            description:
              "Show categories and arrangements in their spatial context and add targeted information points where appropriate.",
          },
          {
            title: "Real estate and accommodation",
            description:
              "Make layout and connection between rooms understandable to complement photography and practical description.",
          },
        ],
      },
      deliverables: {
        title: "What you can receive with a 3D tour",
        intro:
          "The concrete delivery results from the platform, the desired publication and any guidance with website integration.",
        items: [
          {
            title: "Finished navigable tour",
            description:
              "A digitally constructed tour through the agreed areas, with a controlled starting point and logical connections.",
          },
          {
            title: "Publication link",
            description:
              "A shareable URL according to the chosen publication settings and within the agreed hosting period.",
          },
          {
            title: "Embed data",
            description:
              "The necessary code or instruction to display the tour in a suitable web page, possibly with implementation as a separate task.",
          },
          {
            title: "Information labels",
            description:
              "Agreed titles, short explanations or links in relevant places, within the possibilities of the chosen environment.",
          },
        ],
      },
      pricing: {
        title: "How is the price of a 3D tour determined?",
        paragraphs: [
          "Surface area, floors and route complexity determine the size. Small rooms, stairs and closed areas require more than one open space. Labels and website help also count.",
          "Production, publication period and hosting are stated separately. If there are regular changes, we will discuss updating or rescanning. External platform operation and future features are not guaranteed.",
        ],
        factors: [
          "Total area and number of floors",
          "Number of rooms, passageways and stairs",
          "Preparation and desired location guidance",
          "Number of information points and content provided",
          "Desired hosting period and management method",
        ],
      },
      whyVisualVibe: {
        title: "Why have your 3D tour built by VisualVibe",
        intro:
          "We look beyond the scan and connect space preparation, navigation, publication and web use into one practical process.",
        items: [
          {
            title: "Route from a visitor's perspective",
            description:
              "Starting point and connections are chosen based on what a new visitor logically wants to discover.",
          },
          {
            title: "Clear preparation",
            description:
              "You will receive concrete instructions for styling, privacy, lighting and access, so that surprises on the shooting day are limited.",
          },
          {
            title: "Publication with context",
            description:
              "We clarify embed, hosting and management rather than just handing over a loose tour link.",
          },
        ],
      },
      regional: {
        title: "Have a 3D tour made in Limburg and the surrounding area",
        description:
          "VisualVibe scans locations in Belgian Limburg, Flanders, Antwerp and the Dutch province of Limburg. We practically coordinate accessibility, space preparation, scan route, publication, hosting and possible website embedding for each assignment.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Make your space discoverable online",
        description:
          "Tell us which zones you want to show, who uses the tour and where you want to publish it. We develop a tailor-made scanning and publication proposal.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  "virtuele-rondleiding": {
    intro:
      "A virtual tour gives future visitors a realistic first impression of your business, practice, workplace or public location. We translate the physical route into a digital experience with clear navigation, well-maintained sightlines and information in relevant places. The process includes preparation, scanning, checking, publication and agreements about hosting and website embedding. If your design changes significantly later, we will look together at which zones need to be re-incorporated.",
    excerpt:
      "A well-organized virtual tour that guides new visitors through your location, with clear publishing, hosting and embedding agreements.",
    process: [
      {
        title: "Collect visitor questions",
        description:
          "We determine what someone wants to know before a visit: entrance, accessibility, atmosphere, waiting area, offer or routing. These questions guide the digital tour.",
      },
      {
        title: "Prepare location carefully",
        description:
          "Together we check visible data, temporary materials, personal items, lighting, doors and styling. Non-public zones are clearly demarcated.",
      },
      {
        title: "Scan tours in quiet areas",
        description:
          "We capture successive views when the location is as empty and stable as possible. This limits visual disturbance and supports natural navigation.",
      },
      {
        title: "Publish and send visitors",
        description:
          "After checking, we set the starting image and agreed information points. We then deliver or place the embed and document hosting and future management.",
      },
    ],
    faqs: [
      {
        question: "For which organizations is a virtual tour useful?",
        answer:
          "Especially for locations where atmosphere, layout or the route play a role in the decision to visit. Think of practices, shops, meeting locations, offices and recreational spaces. We examine whether interactive navigation really has added value compared to photos or video.",
      },
      {
        question: "Can we exclude certain rooms from the tour?",
        answer:
          "Yes. We agree in advance which zones are public, restricted or completely excluded. The scan route is set up accordingly. Doors, sight lines and reflections deserve attention, because excluded spaces should not accidentally appear recognizable.",
      },
      {
        question: "Can the tour show accessibility?",
        answer:
          "The tour can visually show entrances, corridors, elevators or adapted facilities and explain them via labels. It does not replace a formal accessibility audit. Information about sizes or facilities must be provided correctly by the client and kept up to date.",
      },
      {
        question: "Does a virtual tour work on mobile?",
        answer:
          "The chosen publishing solution is typically intended for modern desktop and mobile browsers, but we do not promise identical performance on every device or in every future software version. We test the placement in the relevant website context before delivery where this is in scope.",
      },
      {
        question: "How long does the recording take?",
        answer:
          "That depends on the surface area, number of rooms, stairs, sight lines and how ready the location is for recording. After a map, photos or a short intake, we provide a practical time estimate and prefer to plan outside busy visitor hours.",
      },
    ],
    relatedServices: [
      "3d-tour",
      "bedrijfsfotografie",
      "bedrijfsvideo",
      "google-business-profiel-optimalisatie",
      "website-laten-maken",
    ],
    seo: {
      title: "Virtual Tour for your Business in Limburg | VisualVibe",
      description:
        "Would you like to have a virtual tour in Limburg? Show atmosphere, layout and route online with professional scanning, hosting agreements and customized website embedding.",
      keywords: [
        "virtual tour",
        "arrange a virtual tour",
        "virtual tour Limburg",
        "online tour company",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "virtual tour",
        supportingKeywords: [
          "arrange a virtual tour",
          "virtual tour Limburg",
          "online tour company",
          "interactive company tour",
        ],
        type: "mixed",
      },
      overview: {
        title: "Virtual tour for a familiar first impression",
        paragraphs: [
          "New visitors want to know where they enter, what the space feels like and what zones there are. A virtual tour makes this visual and allows people to watch independently, without fixed video editing.",
          "We build around the real visitor route and determine what is visible. The location is prepared and checked for sensitive details. Then we set starting point, navigation and labels. Publication, hosting, embedding and any rescan in case of changes are explained in advance.",
        ],
        highlights: [
          "Tour based on questions from new visitors",
          "Non-public and privacy-sensitive zones predetermined",
          "Information points for practical context",
        ],
      },
      outcomes: {
        title: "A visit that already starts online",
        intro:
          "The digital tour reduces uncertainty and gives your team a consistent way to show the location remotely.",
        items: [
          {
            title: "Clarify expectations",
            description:
              "Visitors see the atmosphere and route in advance and can better assess whether the location suits their needs.",
          },
          {
            title: "Answer questions visually",
            description:
              "Entrance, reception, zones and facilities are shown in context rather than just described textually.",
          },
          {
            title: "Always the same tour",
            description:
              "Sales, reception and communication can share one well-prepared tour as an up-to-date digital presentation of the scanned situation.",
          },
        ],
      },
      idealFor: {
        title: "Locations that visitors want to take with them in advance",
        intro:
          "A tour works when the physical experience influences an important threshold, question or choice in the customer journey.",
        items: [
          {
            title: "Practices and welfare locations",
            description:
              "Make the reception and environment recognizable for people who appreciate peace and predictability before their first appointment.",
          },
          {
            title: "Offices and training rooms",
            description:
              "Show candidate employees, participants or partners where they will end up and how different zones are connected.",
          },
          {
            title: "Retail and services",
            description:
              "Showcase store layout, advisory areas or facilities to complement product and company photography.",
          },
        ],
      },
      deliverables: {
        title: "Parts of your virtual tour",
        intro:
          "We not only provide the scan, but also agree on how the tour will be online and who will follow up on the publication later.",
        items: [
          {
            title: "Navigable location tour",
            description:
              "A connected digital route through the agreed public zones, checked for starting point and logical passageways.",
          },
          {
            title: "Targeted information points",
            description:
              "Short texts or links for facilities, services or practical explanations, insofar as provided for in the chosen platform and scope.",
          },
          {
            title: "Shareable publication link",
            description:
              "A URL that can be used to open the tour within the agreed publishing settings and hosting period.",
          },
          {
            title: "Website embed",
            description:
              "Code or technical placement for a suitable page, tailored to available space, privacy choices and loading time.",
          },
        ],
      },
      pricing: {
        title: "What influences the price of a virtual tour?",
        paragraphs: [
          "Surface area, rooms, floors, stairs and passages determine the number of points of view. Information points, excluded zones and website support also count.",
          "Production and hosting period are stated separately. At a frequently changing location, we discuss maintenance, without suggesting that every adjustment fits seamlessly into the existing tour.",
        ],
        factors: [
          "Area and number of public zones",
          "Floors, stairs and complex connections",
          "Degree to which the location is ready for recording",
          "Number of agreed information points",
          "Exclusion of sensitive or private areas",
        ],
      },
      whyVisualVibe: {
        title: "Why VisualVibe for your digital tour",
        intro:
          "We view the tour as part of your visitor communication and guide the route from initial preparation to online placement.",
        items: [
          {
            title: "Attention to the customer journey",
            description:
              "We choose start, order and information based on what a new visitor really wants to understand.",
          },
          {
            title: "Privacy-conscious preparation",
            description:
              "Visible data, screens, people and non-public areas are discussed specifically before the scan.",
          },
          {
            title: "Website knowledge in-house",
            description:
              "We can approach the embed within the broader page structure, content and technical context of your website.",
          },
        ],
      },
      regional: {
        title: "Virtual tour in Limburg and surrounding regions",
        description:
          "VisualVibe creates virtual tours for locations in Belgian Limburg, Flanders, Antwerp and the Dutch province of Limburg. We coordinate scan planning, room preparation, hosting, website embedding and later updating per organization.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Invite visitors digitally",
        description:
          "Share the type of location, the rooms you want to show and your website context. We propose a tour that can be practically scanned and clearly published.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  "showroom-3d-tour": {
    intro:
      "A showroom 3D tour allows customers to explore your collection and presentation areas online before planning a visit. We bring together routing, categories and inspiring setups in a navigable environment and add information points where appropriate. We carefully prepare products, price communication, lighting and visible data for the scan. Hosting, website embedding and the impact of seasonal or collection changes are also discussed in advance.",
    excerpt:
      "A navigable showroom 3D tour with logical zones, neat product presentation and clear agreements about publication and updates.",
    process: [
      {
        title: "Structuring range and zones",
        description:
          "We determine which collections, inspiration corners and advice points get priority. The start and route are in line with how customers physically discover the showroom.",
      },
      {
        title: "Prepare presentation to be scan-proof",
        description:
          "Displays are finished, temporary boxes disappear and price or product screens are checked. We record which information is timeless enough to remain visible.",
      },
      {
        title: "Scanning without store movement",
        description:
          "We record consecutive views outside busy hours. The layout remains the same during recording, so that connections between product zones are built up as quietly as possible.",
      },
      {
        title: "Enrich and activate tour",
        description:
          "After route checking, we place agreed labels or links, set the initial scene and provide the publish link or embed within the established hosting context.",
      },
    ],
    faqs: [
      {
        question: "Can products in the tour be made clickable?",
        answer:
          "Information points with short text or a link can be added at relevant positions, depending on the chosen publication environment. We select them specifically to avoid visual crowds. Product data and destination links are correctly provided and maintained by you.",
      },
      {
        question: "What do we do with prices that change often?",
        answer:
          "Where possible, avoid temporary price tags in the scanned image and prefer to link to a current web page. What is physically visible in the scan does not automatically change. For commercial information, we therefore make a conscious choice between timeless images and manageable labels.",
      },
      {
        question: "Does the showroom have to close for the recording?",
        answer:
          "We prefer to scan before opening, after closing or in a fully defined period. Moving visitors and employees can disrupt the connection and visual peace. For large showrooms, planning per closed zone can be discussed.",
      },
      {
        question: "How often should a showroom tour be renewed?",
        answer:
          "That depends on how much the layout and collection change. A timeless basic setup remains usable longer than a seasonal presentation. In the event of major route or interior changes, we assess whether the zones involved can be additionally scanned or whether a new tour is better.",
      },
      {
        question: "Can the 3D tour replace our webshop?",
        answer:
          "No. A tour helps customers orient and gain inspiration, but does not automatically provide inventory, prices, filters, payment or order management. He can direct visitors to relevant webshop categories or appointment pages via targeted links.",
      },
    ],
    relatedServices: [
      "3d-tour",
      "virtuele-rondleiding",
      "productfotografie",
      "website-laten-maken",
      "webshop-laten-maken",
    ],
    seo: {
      title: "Showroom 3D tour for More Online Experience | VisualVibe",
      description:
        "Would you like to have a showroom 3D tour in Limburg? Let customers explore zones and collections with professional scanning, information links and website embedding.",
      keywords: [
        "showroom 3D tour",
        "3D tour showroom",
        "virtual showroom",
        "view showroom online",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "showroom 3D tour",
        supportingKeywords: [
          "3D tour showroom",
          "virtual showroom",
          "view showroom online",
          "interactive showroom tour",
        ],
        type: "commercial",
      },
      overview: {
        title: "Showroom 3D tour that connects collection and space",
        paragraphs: [
          "Arrangements, combinations, walking routes and advice zones give products context. A 3D tour allows visitors to move between categories themselves and supports orientation before a visit or from a campaign.",
          "We choose a representative, timeless arrangement and remove temporary information. After the scan, we build navigation and link agreed labels to current pages. Link, embed and hosting are recorded. With a new collection we assess whether updating is necessary.",
        ],
        highlights: [
          "Digital route according to the physical showroom logic",
          "Product zones and inspiration setups in coherence",
          "Targeted links to current category or appointment pages",
        ],
      },
      outcomes: {
        title: "From online inspiration to targeted showroom visits",
        intro:
          "The tour helps customers explore and prepare, while your team can share a solid visual introduction to the showroom.",
        items: [
          {
            title: "Collections in context",
            description:
              "Customers see how product groups and styles are presented together, instead of just viewing individual pack shots.",
          },
          {
            title: "Self-chosen discovery",
            description:
              "The visitor moves to the zones that feel relevant and can then read more via a link or schedule an appointment.",
          },
          {
            title: "Sales support",
            description:
              "Employees can refer to a recognizable zone during a conversation and share the digital tour in a targeted manner.",
          },
        ],
      },
      idealFor: {
        title: "Showrooms where spatial inspiration is central",
        intro:
          "The tour fits with an offering that becomes stronger when customers can experience setups, scale and combination options.",
        items: [
          {
            title: "Interior and living",
            description:
              "Present rooms, materials and styles as coherent inspiration zones that can be explored independently online.",
          },
          {
            title: "Kitchens and bathrooms",
            description:
              "Show different layouts and finishing directions and refer to advice or a relevant collection page.",
          },
          {
            title: "Mobility and technology",
            description:
              "Provide an overview of models, demonstration zones and advice points without suggesting current stock status.",
          },
        ],
      },
      deliverables: {
        title: "What your showroom tour can include",
        intro:
          "We tailor the route, enrichment and publication to the way your marketing and sales team will actually use the tour.",
        items: [
          {
            title: "Fully navigable showroom",
            description:
              "The agreed zones are linked to a clear route with a representative starting image and logical transitions.",
          },
          {
            title: "Zone and product labels",
            description:
              "A limited number of targeted information points with supplied text or link, fitting within the chosen platform.",
          },
          {
            title: "Shareable link and embed code",
            description:
              "Publication data for website, campaign or personal sales contact within the agreed hosting settings.",
          },
          {
            title: "Website placement as an option",
            description:
              "Technical integration into a suitable page when access, platform and scope are agreed in advance.",
          },
        ],
      },
      pricing: {
        title: "Price structure of a showroom 3D tour",
        paragraphs: [
          "The size of the showroom and the density of setups determine how many scanning positions are needed. Multiple floors, narrow passageways and separate presentation rooms require extra planning. The desired information points and assistance with web integration also influence the production scope.",
          "We discuss hosting duration and how often the showroom changes. Hosting is not tacitly unlimited. With changes or renovations, we assess whether addition or a new recording is more consistent.",
        ],
        factors: [
          "Total showroom area and floors",
          "Density of setups and passageways",
          "Number of collection zones and information points",
          "Recording schedule outside opening hours",
          "Preparation of temporary price and product information",
        ],
      },
      whyVisualVibe: {
        title: "Why VisualVibe for your showroom tour",
        intro:
          "We combine a well-organized scan with commercial structure, web use and realistic management when your presentation changes.",
        items: [
          {
            title: "Selective information",
            description:
              "We do not place labels everywhere, but direct visitors to current and relevant follow-up information at logical points.",
          },
          {
            title: "An eye for presentation",
            description:
              "Routing, sight lines, lighting and temporary elements are previewed from the final online experience.",
          },
          {
            title: "Link with your website",
            description:
              "The tour is accessed as part of the showroom page and customer journey, not as an isolated external link.",
          },
        ],
      },
      regional: {
        title: "Showroom 3D tour in Limburg and surrounding regions",
        description:
          "VisualVibe scans showrooms in Belgian Limburg, Flanders, Antwerp and the Dutch province of Limburg. We plan recording, space preparation, information links, hosting, embedding and future updating around your showroom operations.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Also open your showroom to online visitors",
        description:
          "Provide us with the surface area, layout, most important zones and website context. We make a proposal for scanning, enrichment, publication and management.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  "vastgoed-3d-tour": {
    intro:
      "A property 3D tour lets prospective buyers or tenants explore the layout of a house, flat or commercial property online at their own pace. We scan the spaces in a logical order and coordinate the tour with the photography, publication plan and viewing process. The property is prepared carefully and the visible and excluded areas are agreed in advance. Hosting, website embedding, privacy and what happens when the property changes or leaves the market are also defined explicitly.",
    excerpt:
      "A navigable property 3D tour that clarifies the layout and sense of space, with carefully planned preparation, publication and management.",
    process: [
      {
        title: "Determine publication and scope",
        description:
          "We discuss audience, type of building, spaces, channels and desired timing. Storage, technical areas, personal rooms and outdoor areas are deliberately included or excluded.",
      },
      {
        title: "Prepare property for sale",
        description:
          "The owner receives a checklist for tidying, styling, lighting, doors, mirrors, documents and personal details. The setup remains unchanged during the scan.",
      },
      {
        title: "Scan floor by floor",
        description:
          "We record connected points of view with attention to passages and orientation. Attendees stay out of the active zones to avoid visual disturbance as much as possible.",
      },
      {
        title: "Check and publish tour",
        description:
          "We check starting point, navigation and agreed visibility, provide the publication link or embed and record how hosting, unpublishing and any corrections are managed.",
      },
    ],
    faqs: [
      {
        question: "What does a real estate 3D tour add besides photos?",
        answer:
          "Photography selects strong points of view and atmosphere. A 3D tour mainly makes the connection between rooms and floors understandable. Candidates choose where they look and therefore receive a different kind of spatial context. Both media complement each other.",
      },
      {
        question: "Does the building have to be completely empty?",
        answer:
          "No. An occupied or furnished building can be scanned if it is quiet and well-kept. Personal photos, documents, medication, screens and valuable details are best removed. Items are no longer allowed to change position during recording.",
      },
      {
        question: "Can a map from the scan be used for official measurements?",
        answer:
          "Any visual layout or dimensional representation is intended as a presentation aid and is not a substitute for a professional measurement, official plan or legal document. The client must use reliable source data for formal surfaces and dimensions.",
      },
      {
        question: "How do we protect the privacy of residents?",
        answer:
          "Before the scan, residents remove identifiable and sensitive information. We determine which rooms are not recorded and check sight lines, mirrors and screens. Because a tour can be viewed broadly, good preparation is more important than hiding a lot afterwards.",
      },
      {
        question: "How long does the tour remain online after sale or rental?",
        answer:
          "We record this in the hosting and publication agreements. The estate agent or client reports when the status changes and the tour needs to be removed or shielded. External availability is not guaranteed indefinitely.",
      },
    ],
    relatedServices: [
      "vastgoedfotografie",
      "vastgoed-dronebeelden",
      "3d-tour",
      "website-laten-maken",
      "promovideo",
    ],
    seo: {
      title: "Real Estate 3D tour for Real Estate and Sales | VisualVibe",
      description:
        "Would you like to have a 3D real estate tour in Limburg? Show layout and sense of space with professional scanning, publication, hosting agreements and website embedding.",
      keywords: [
        "real estate 3D tour",
        "3D real estate tour",
        "virtual viewing",
        "3D tour estate agent",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "real estate 3D tour",
        supportingKeywords: [
          "3D real estate tour",
          "virtual viewing",
          "3D tour estate agent",
          "view the house virtually",
        ],
        type: "commercial",
      },
      overview: {
        title: "Real estate 3D tour for layout and sense of space",
        paragraphs: [
          "Photos show how attractive a property is; an interactive tour clarifies how spaces are connected. The visitor moves digitally from entrance to living space and floor and can return themselves.",
          "The scan is in line with the real estate presentation. We prepare the property, remove sensitive information and establish excluded zones. We then check route and publication. Hosting, unpublishing and updating in the event of a changed design are explicitly managed.",
        ],
        highlights: [
          "Navigation that makes the real layout understandable",
          "Preparation checklist for occupied or vacant real estate",
          "Privacy-sensitive and excluded areas discussed in advance",
        ],
      },
      outcomes: {
        title: "A more complete digital viewing",
        intro:
          "The tour helps candidates explore the property substantively and gives the real estate agent a consistent presentation to share in a targeted manner.",
        items: [
          {
            title: "Understandable room connections",
            description:
              "Viewers see how entrance, living spaces, floors and outdoor relations are connected at the time of recording.",
          },
          {
            title: "Review independently",
            description:
              "An interested party can revisit relevant zones without having to scroll through a fixed photo sequence or video.",
          },
          {
            title: "Coherent media presentation",
            description:
              "The tour supports photos, description and aerial images with additional spatial context on the property page.",
          },
        ],
      },
      idealFor: {
        title: "Real estate that needs online spatial explanation",
        intro:
          "An interactive viewing is especially useful when the layout, scale or connection between different zones is difficult to fit into individual images.",
        items: [
          {
            title: "Multi-level homes",
            description:
              "Make the relationship between floors, stairs and functional zones understandable for candidates who orientate themselves in advance.",
          },
          {
            title: "Apartments and new construction",
            description:
              "Show a finished apartment or model unit as a navigable addition to plans, photography and project information.",
          },
          {
            title: "Commercial properties",
            description:
              "Visualize shop, office or practice spaces digitally and make different functions or access zones recognisable.",
          },
        ],
      },
      deliverables: {
        title: "What you receive with a real estate 3D tour",
        intro:
          "The delivery is tailored to your publication process and contains clear agreements about access, online duration and management.",
        items: [
          {
            title: "Navigable property tour",
            description:
              "A connected tour through the agreed spaces, with a logical starting point and controlled transitions.",
          },
          {
            title: "Shareable publication link",
            description:
              "A URL for use within the agreed channels and hosting period, according to the set visibility.",
          },
          {
            title: "Embed for own page",
            description:
              "Technical data to place the tour on a suitable real estate or project page, possibly with support.",
          },
          {
            title: "Control of visible areas",
            description:
              "A final check of start, route and agreed exclusions before the tour is shared publicly.",
          },
        ],
      },
      pricing: {
        title: "Price factors of a real estate 3D tour",
        paragraphs: [
          "The quotation is determined, among other things, by surface area, floors, number of rooms and complexity of passageways. Preparation and travel time also play a role. When photography, drone footage and scanning are combined at one convenient time, we coordinate planning efficiently without treating each part as an identical production.",
          "Publication and hosting are mentioned separately. We discuss version management when selling a project or a changing model home. A tour does not automatically reflect every renovation, styling or platform change.",
        ],
        factors: [
          "Area and number of rooms",
          "Number of floors and connections",
          "Empty, furnished or occupied property",
          "Preparation of privacy-sensitive areas",
          "Combination with real estate photography or drone footage",
        ],
      },
      whyVisualVibe: {
        title: "Why VisualVibe for real estate scanning",
        intro:
          "We combine spatial experience, well-organised property media and practical publication in one clearly managed presentation process.",
        items: [
          {
            title: "Layout over gimmick",
            description:
              "The route is constructed to make the building understandable, not just to add a striking interactive function.",
          },
          {
            title: "Media coordinated",
            description:
              "Tour, photography, video and aerial images can together form one logical online viewing.",
          },
          {
            title: "Privacy as a preparation task",
            description:
              "We discuss visible data and excluded zones in advance, when adjustments can still be made in a controlled manner.",
          },
        ],
      },
      regional: {
        title: "Real estate 3D tour in Limburg and surrounding regions",
        description:
          "VisualVibe makes real estate tours in Belgian Limburg, Flanders, Antwerp and the Dutch province of Limburg. We tailor scan, preparation, privacy, publication, hosting, embed and unpublishing to the estate agent, owner and property.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Make the layout understandable online",
        description:
          "Send us the type of property, surface area, floor plan and desired publication. We propose a suitable scanning moment and a clearly managed real estate tour.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  "horeca-virtuele-tour": {
    intro:
      "With a hospitality virtual tour you allow guests to explore the atmosphere, layout and possibilities of your restaurant, banquet hall, hotel or event location online. We build the tour around reception, seating areas and relevant facilities, without disturbing guests or temporary mess in the picture. We prepare the case in advance and choose a representative setup. After scanning, publication, hosting and website embedding follow, with clear agreements for seasonal decoration or later renovations.",
    excerpt:
      "An attractive hospitality virtual tour that guides guests through the room, restaurant or accommodation, with a careful scan and clear online publication.",
    process: [
      {
        title: "Guest questions and choosing rooms",
        description:
          "We determine whether the focus is on table arrangements, room capacity, rooms, terrace, reception or event options. Only relevant public zones are included in the route.",
      },
      {
        title: "Prepare the case in a representative manner",
        description:
          "Tables, textiles, lighting and decor are finished; menus, screens and temporary communications are checked. We choose a quiet period without guests.",
      },
      {
        title: "Scan atmosphere and route",
        description:
          "We capture connected points of view with attention to entrance, sight lines and transitions. Personnel remain outside the active zone and the positioning does not change during filming.",
      },
      {
        title: "Publish and link tour",
        description:
          "After route checking, we set the opening image and agreed labels. We provide or place the link or embed and record hosting, renewal and updating.",
      },
    ],
    faqs: [
      {
        question: "Should guests be featured in the virtual tour?",
        answer:
          "Preferably not during the scan. People can move between positions and therefore appear disruptive or incomplete. For an atmosphere with real service and guests, a separate photo or video session is more controllable. Those images can be used in addition to the tour.",
      },
      {
        question: "Can we show different room layouts?",
        answer:
          "One scan shows one physical setup per zone. For important variants, separate tours, additional photography or a clear information page may be more suitable. We recommend a representative basic arrangement that makes the room easy to read.",
      },
      {
        question: "Can a guest make a reservation immediately after the tour?",
        answer:
          "We can link to your existing reservation or contact page in an appropriate place, depending on the chosen publishing environment. The tour itself does not automatically manage availability or bookings and the operation of external booking software is not guaranteed.",
      },
      {
        question: "Can kitchen and staff areas be excluded?",
        answer:
          "Yes. We determine in advance which public zones are part of the route and keep non-public areas closed and out of sight lines. If an open kitchen must be deliberately shown, we plan this separately with attention to cleanliness, activity and recognizable data.",
      },
      {
        question: "How do we deal with a terrace and changing weather?",
        answer:
          "A terrace is planned when the arrangement and conditions are representative. Outdoor images can become dated more quickly due to season, light and weather. We discuss whether the terrace fits into the same tour, a separate visual sequence or a later update.",
      },
    ],
    relatedServices: [
      "virtuele-rondleiding",
      "3d-tour",
      "bedrijfsfotografie",
      "promovideo",
      "google-business-profiel-optimalisatie",
    ],
    seo: {
      title: "Hospitality Virtual Tour for More Online Atmosphere | VisualVibe",
      description:
        "Want to make a virtual hospitality tour in Limburg? Show room, atmosphere and layout with professional scanning, reservation link and website embed for your business.",
      keywords: [
        "hospitality virtual tour",
        "virtual tour restaurant",
        "3D tour banquet hall",
        "hospitality tour",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "hospitality virtual tour",
        supportingKeywords: [
          "virtual tour restaurant",
          "3D tour banquet hall",
          "hotel virtual tour",
          "hospitality tour",
        ],
        type: "commercial",
      },
      overview: {
        title: "Hospitality virtual tour for atmosphere and room layout",
        paragraphs: [
          "In addition to menu and location, style, space and room layout also determine the choice. An interactive tour allows guests to move from the entrance to the restaurant, bar or other public area themselves.",
          "We scan a representative setup outside opening hours and check decoration, lighting, temporary information and privacy. This is followed by route control, current links, embed and hosting agreements. In the event of a major change, we will assess additions or a new tour.",
        ],
        highlights: [
          "Digital guest journey from entrance to relevant zones",
          "Representative table and room setup",
          "Targeted link to reservation or event request",
        ],
      },
      outcomes: {
        title: "A choice of location with more visual context",
        intro:
          "The tour helps future guests or organizers understand the space in advance, without replacing the personal welcome.",
        items: [
          {
            title: "Atmosphere before the reservation",
            description:
              "Visitors get a realistic impression of the design and spatial style at the time of the scan.",
          },
          {
            title: "Room options clarified",
            description:
              "Organizers can see how reception, main room and secondary areas are connected and can ask more targeted practical questions.",
          },
          {
            title: "Website with more experience",
            description:
              "A well-placed embed complements photos, menu, packages and contact information with standalone navigation.",
          },
        ],
      },
      idealFor: {
        title: "Catering locations where space determines the choice",
        intro:
          "The interactive form is especially valuable when guests want to assess the atmosphere, routing or the structure of different zones in advance.",
        items: [
          {
            title: "Restaurants and brasseries",
            description:
              "Show entrance, table areas, bar and possibly terrace to complement culinary and atmospheric photography.",
          },
          {
            title: "Party and event rooms",
            description:
              "Make reception, hall, stage zone and relevant facilities transparent for organizers and companies.",
          },
          {
            title: "Hotels and accommodations",
            description:
              "Connect lobby, common areas and selected room types without implying that each room is identical.",
          },
        ],
      },
      deliverables: {
        title: "What your hospitality virtual tour can include",
        intro:
          "We put together the tour and online delivery around your own website, reservation process and any event communication.",
        items: [
          {
            title: "Navigable hospitality tour",
            description:
              "A connected route through the chosen public areas with a welcoming starting image and clear orientation.",
          },
          {
            title: "Information and reservation links",
            description:
              "Agreed labels that can refer to current menu, package, contact or reservation pages.",
          },
          {
            title: "Publish link and embed",
            description:
              "Data for sharing and integration on your website within the agreed visibility and hosting period.",
          },
          {
            title: "Control of non-public areas",
            description:
              "A final check to ensure that excluded kitchen, storage or staff areas do not inadvertently end up in the route.",
          },
        ],
      },
      pricing: {
        title: "What determines the price of a hospitality virtual tour?",
        paragraphs: [
          "Public areas, floors, passageways and outdoor areas determine the scan plan. Recording outside opening hours and preparation of the chosen setup also count.",
          "Information links, website placement and hosting are discussed separately. An update plan can help with seasonal decoration or renovations, but not every change fits without a broader rescan.",
        ],
        factors: [
          "Number of halls, rooms and public zones",
          "Floors, stairs and separate entrances",
          "Indoor areas and possible terrace inclusion",
          "Recording time outside service hours",
          "Preparation of table and room setup",
        ],
      },
      whyVisualVibe: {
        title: "Why VisualVibe for your hospitality tour",
        intro:
          "We approach space, atmosphere and online customer journey as a whole and make clear choices in advance about what should be current and visible.",
        items: [
          {
            title: "Guest-centric routing",
            description:
              "The tour starts and moves as a new guest would logically discover the location.",
          },
          {
            title: "An eye for hospitality details",
            description:
              "Table settings, lighting, temporary communications and service areas are checked before the scan begins.",
          },
          {
            title: "Combination with atmospheric content",
            description:
              "The empty space tour can be supplemented with photography or video that focuses on staff, dishes and real activity.",
          },
        ],
      },
      regional: {
        title: "Hospitality virtual tour in Limburg and surrounding regions",
        description:
          "VisualVibe scans hospitality venues in Belgian Limburg, Flanders, Antwerp and the Dutch province of Limburg. We coordinate the setup, scanning time, links, hosting, embed and later updating around your opening hours and operation.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Let guests experience your location in advance",
        description:
          "Send us your rooms, desired setup, website and reservation route. We will work out a scanning moment and publication format that suits your hospitality business.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
} satisfies Record<XrEditorialSlug, SubserviceEditorial>;

export const englishXrEditorial: Record<string, EnglishServiceLocaleRecord> = {
  "3d-tour": {
    displaySlug: "3d-tour",
    title: "3D Tour",
    summary: localizedEditorial["3d-tour"].excerpt,
    body: localizedEditorial["3d-tour"].intro,
    benefits: localizedEditorial["3d-tour"].content.overview.highlights,
    process: localizedEditorial["3d-tour"].process,
    faqs: localizedEditorial["3d-tour"].faqs,
    cta: localizedEditorial["3d-tour"].content.cta,
    seo: localizedEditorial["3d-tour"].seo,
    imageAlt: "3D Tour by VisualVibe in Limburg",
    internalLinks: localizedEditorial["3d-tour"].relatedServices.map(
      (href) => ({
        href: `/en/diensten/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["3d-tour"],
  },
  "virtuele-rondleiding": {
    displaySlug: "virtual-tour",
    title: "Virtual tour",
    summary: localizedEditorial["virtuele-rondleiding"].excerpt,
    body: localizedEditorial["virtuele-rondleiding"].intro,
    benefits:
      localizedEditorial["virtuele-rondleiding"].content.overview.highlights,
    process: localizedEditorial["virtuele-rondleiding"].process,
    faqs: localizedEditorial["virtuele-rondleiding"].faqs,
    cta: localizedEditorial["virtuele-rondleiding"].content.cta,
    seo: localizedEditorial["virtuele-rondleiding"].seo,
    imageAlt: "Virtual tour created by VisualVibe in Limburg",
    internalLinks: localizedEditorial[
      "virtuele-rondleiding"
    ].relatedServices.map((href) => ({
      href: `/en/diensten/${href}/`,
      label: href
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
    })),
    editorial: localizedEditorial["virtuele-rondleiding"],
  },
  "showroom-3d-tour": {
    displaySlug: "showroom-3d-tour",
    title: "Showroom 3D Tour",
    summary: localizedEditorial["showroom-3d-tour"].excerpt,
    body: localizedEditorial["showroom-3d-tour"].intro,
    benefits:
      localizedEditorial["showroom-3d-tour"].content.overview.highlights,
    process: localizedEditorial["showroom-3d-tour"].process,
    faqs: localizedEditorial["showroom-3d-tour"].faqs,
    cta: localizedEditorial["showroom-3d-tour"].content.cta,
    seo: localizedEditorial["showroom-3d-tour"].seo,
    imageAlt: "Showroom 3D Tour by VisualVibe in Limburg",
    internalLinks: localizedEditorial["showroom-3d-tour"].relatedServices.map(
      (href) => ({
        href: `/en/diensten/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["showroom-3d-tour"],
  },
  "vastgoed-3d-tour": {
    displaySlug: "real-estate-3d-tour",
    title: "Vastgoed 3D Tour",
    summary: localizedEditorial["vastgoed-3d-tour"].excerpt,
    body: localizedEditorial["vastgoed-3d-tour"].intro,
    benefits:
      localizedEditorial["vastgoed-3d-tour"].content.overview.highlights,
    process: localizedEditorial["vastgoed-3d-tour"].process,
    faqs: localizedEditorial["vastgoed-3d-tour"].faqs,
    cta: localizedEditorial["vastgoed-3d-tour"].content.cta,
    seo: localizedEditorial["vastgoed-3d-tour"].seo,
    imageAlt: "Vastgoed 3D Tour by VisualVibe in Limburg",
    internalLinks: localizedEditorial["vastgoed-3d-tour"].relatedServices.map(
      (href) => ({
        href: `/en/diensten/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["vastgoed-3d-tour"],
  },
  "horeca-virtuele-tour": {
    displaySlug: "hospitality-virtual-tour",
    title: "Hospitality virtual tour",
    summary: localizedEditorial["horeca-virtuele-tour"].excerpt,
    body: localizedEditorial["horeca-virtuele-tour"].intro,
    benefits:
      localizedEditorial["horeca-virtuele-tour"].content.overview.highlights,
    process: localizedEditorial["horeca-virtuele-tour"].process,
    faqs: localizedEditorial["horeca-virtuele-tour"].faqs,
    cta: localizedEditorial["horeca-virtuele-tour"].content.cta,
    seo: localizedEditorial["horeca-virtuele-tour"].seo,
    imageAlt: "Hospitality virtual tour by VisualVibe in Limburg",
    internalLinks: localizedEditorial[
      "horeca-virtuele-tour"
    ].relatedServices.map((href) => ({
      href: `/en/diensten/${href}/`,
      label: href
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
    })),
    editorial: localizedEditorial["horeca-virtuele-tour"],
  },
};
