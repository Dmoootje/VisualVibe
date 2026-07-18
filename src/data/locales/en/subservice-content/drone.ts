import type { SubserviceEditorial } from "@/types";
import type { EnglishServiceLocaleRecord } from "../services";

type DroneEditorialSlug =
  | "dronefotografie"
  | "dronevideo"
  | "fpv-video"
  | "vastgoed-dronebeelden"
  | "realisatie-dronebeelden"
  | "event-dronebeelden";

const localizedEditorial = {
  dronefotografie: {
    intro:
      "Professional drone photography shows a building, site or business environment from viewpoints that are unavailable at ground level. Before scheduling a flight, we check the location, airspace, weather forecast, surroundings and any permissions required. This allows us to plan a feasible shoot around your communication goal, with close attention to safety, composition and a consistent finish.",
    excerpt:
      "Professional aerial photographs of buildings, sites and projects, prepared on location and finished for web, print and communication.",
    process: [
      {
        title: "Define the goal and shot list",
        description:
          "We discuss what the photographs need to show, where they will be used and which aspect ratios are required. We then prepare a concise shot list covering establishing views, context and relevant details.",
      },
      {
        title: "Check flight environment",
        description:
          "We look at the exact location, airspace, obstacles, bystanders, privacy-sensitive zones and permission where it may be necessary. Only after this check do we determine a realistic approach.",
      },
      {
        title: "Photographing at the right time",
        description:
          "On the shooting day we reassess the weather, light and safety. We vary in a controlled manner in height, viewing direction and distance to capture both overview and architectural coherence.",
      },
      {
        title: "Selection and image finishing",
        description:
          "We select the strongest shots and carefully fine-tune color, contrast, cropping and perspective. You will receive files that match the agreed channels and applications.",
      },
    ],
    faqs: [
      {
        question: "Can drone photography be done at any location?",
        answer:
          "No. Feasibility depends on the airspace, distances from people and buildings, local conditions, obstacles and any permissions required. We check the location before confirming which shots can be captured responsibly. This is a practical production assessment, not legal advice.",
      },
      {
        question: "What happens when it rains or there is too much wind?",
        answer:
          "Precipitation, wind, visibility and light influence both safety and image quality. If the circumstances are insufficient, we will agree on a new moment or an adapted land-based alternative. The final assessment also takes place on location.",
      },
      {
        question: "Which photographs are normally included in the shot list?",
        answer:
          "There is no fixed standard set. For a business site, location, access, buildings and terrain logic are often important; for architecture, lines, facades and material context play a greater role. We create the list based on your purpose of use.",
      },
      {
        question:
          "Can aerial photos be combined with regular business photography?",
        answer:
          "Yes. A combined session produces a coherent story of the outdoor environment, buildings, teams and activity. We coordinate light, color style and planning so that the images feel like one series.",
      },
      {
        question: "In what formats are the images delivered?",
        answer:
          "We agree in advance whether you need photos for websites, social media, presentations or printing. Based on this, we supply suitable resolutions and crops, without unnecessary variants that clutter your image bank.",
      },
    ],
    relatedServices: [
      "dronevideo",
      "bedrijfsfotografie",
      "vastgoedfotografie",
      "realisatiefotografie",
    ],
    seo: {
      title: "Professional Drone Photography Limburg | VisualVibe",
      description:
        "Drone photography in Limburg for buildings, sites and projects. Safely prepared, thoughtfully photographed and finished for your communication.",
      keywords: [
        "drone photography",
        "drone photography Limburg",
        "professional aerial photos",
        "aerial photography company",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "drone photography",
        supportingKeywords: [
          "drone photography Limburg",
          "professional aerial photos",
          "aerial view building",
          "drone photo company",
        ],
        type: "commercial",
      },
      overview: {
        title: "Drone photography for a clear image of your location",
        paragraphs: [
          "Drone photography provides context for location, scale and layout. Buildings, grounds and surroundings come together in a single view, making aerial photographs useful for websites, project communications, property listings and an up-to-date image library.",
          "We first determine whether recognizability, architecture, context or activity is central. We then adjust the altitude, direction and time. Location, airspace, weather, security, access and permissions are checked where necessary before confirming which images are feasible.",
        ],
        highlights: [
          "Compositions tailored to website, campaign or printing",
          "Preliminary check of location and flight environment",
          "Consistent color finish within your existing image style",
        ],
      },
      outcomes: {
        title: "What good aerial photos do for your communication",
        intro:
          "The added value is not only in height, but in images that quickly provide relevant context and visually connect with your brand.",
        items: [
          {
            title: "Spatial overview",
            description:
              "Visitors understand at a glance how buildings, terrain and surroundings relate to each other.",
          },
          {
            title: "Strong opening images",
            description:
              "A wide aerial photo can serve as a visual eye-catcher on a website, brochure or project page without overwhelming the content.",
          },
          {
            title: "Coherent image bank",
            description:
              "Overview, half-total and detail are photographed and finished as one series, so that you can make specific choices per channel.",
          },
        ],
      },
      idealFor: {
        title: "When drone photography is a good fit",
        intro:
          "Aerial photography is especially useful when location, scale or environment is an essential part of your story.",
        items: [
          {
            title: "Industrial areas",
            description:
              "For companies that want to clearly present their site, accessibility, infrastructure or various activity zones.",
          },
          {
            title: "Architecture and real estate",
            description:
              "For buildings where volume, plot, outdoor space and relationship with the neighborhood are not visible from a single ground point of view.",
          },
          {
            title: "Projects and achievements",
            description:
              "For designers, contractors and organizations that want to add a finished result with sufficient context to their portfolio.",
          },
        ],
      },
      deliverables: {
        title: "What you will receive after the photo session",
        intro:
          "We pre-determine the delivery based on the number of applications, so that each file has a clear role.",
        items: [
          {
            title: "Selected photo series",
            description:
              "A careful selection without near-duplicate images, built around the agreed shot list.",
          },
          {
            title: "Professional post-processing",
            description:
              "Adjust color, brightness, contrast, horizon and crop for a natural, consistent look.",
          },
          {
            title: "Digital channel files",
            description:
              "Practical formats for website, social media or presentations, tailored to the agreed commitment.",
          },
          {
            title: "High resolution",
            description:
              "Suitable master files for selected printing applications when that is part of the briefing.",
          },
        ],
      },
      pricing: {
        title: "What determines the price of drone photography?",
        paragraphs: [
          "The price includes more than flight time. Preparation, location control, image variation and post-processing determine the production work. One compact series of buildings requires a different approach than multiple sites with different purposes.",
          "After the briefing, we make a well-defined proposal. We will discuss the consequences of checking location, airspace, weather or safety before the recording. In this way, preparation and delivery are clear without assuming feasibility in every place.",
        ],
        factors: [
          "Number of locations and distance between locations",
          "Complexity of the flight environment",
          "Desired amount of viewpoints and crops",
          "Combination with photography or video from the ground",
          "Timing and dependence on specific light",
          "Level of selection and post-processing",
        ],
      },
      whyVisualVibe: {
        title: "Why VisualVibe for aerial photography",
        intro:
          "We approach a drone as an image tool within your communication, with as much attention to preparation as to the final photo.",
        items: [
          {
            title: "Purposeful composition",
            description:
              "We do not seek height for height's sake, but points of view that organize information and support your story.",
          },
          {
            title: "Sober feasibility check",
            description:
              "Location, airspace, weather, safety and permission are practically assessed in advance and reconsidered on the day of admission.",
          },
          {
            title: "One visual line",
            description:
              "Drone footage can match your company photos, real estate series or website design in terms of content and finish.",
          },
        ],
      },
      regional: {
        title: "Drone photography in Limburg and surrounding regions",
        description:
          "VisualVibe plans drone photography from Limburg for assignments in Belgian Limburg, Flanders, Antwerp and the Dutch province of Limburg. We examine for each exact location which approach is feasible after checking airspace, environment, weather and practical permission.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Tell us which overview you need",
        description:
          "Share the location, desired applications and timing. We look at the imaging options and develop a suitable proposal after an initial feasibility check.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  dronevideo: {
    intro:
      "With drone video we add aerial images to a corporate video, campaign, location presentation or separate video concept. A good drone movement makes scale and environment tangible without it becoming a separate effect. We coordinate routes and editing functions in advance and check the location, airspace, weather, safety and possible permissions before we finalize the shooting day.",
    excerpt:
      "Smooth drone video with a clear role in your story, from location intro to cinematic transition and independent aerial view.",
    process: [
      {
        title: "Capture story function",
        description:
          "We determine where aerial images add value in the video: as an introduction, spatial explanation, transition, atmospheric image or conclusion. This results in shot duration, direction and size.",
      },
      {
        title: "Explore routes and risks",
        description:
          "Based on location data, we examine airspace, buildings, public, obstacles, take-off and landing zone and permission where necessary. We only design routes that remain realistic after inspection.",
      },
      {
        title: "Record movements in a controlled manner",
        description:
          "Before departure, we reassess the current conditions. We film several usable takes with gentle acceleration, appropriate height and sufficient editing space.",
      },
      {
        title: "Assemble and visually tune",
        description:
          "We select shots based on content and movement, correct color and process them in the agreed editing or deliver a curated selection for your production.",
      },
    ],
    faqs: [
      {
        question: "How long does a drone video last?",
        answer:
          "That depends on the application. In a corporate video, a few targeted aerial shots can be more powerful than a long sequence. For an independent location video we build in more rhythm and variation. We recommend a length based on channel and story.",
      },
      {
        question: "Can drone footage be edited into an existing video?",
        answer:
          "Yes, if the picture style, resolution, frame rate and color are sufficient. We ask in advance about the technical specifications and existing editing, so that the new shots are recorded in a targeted manner and do not feel like an extraneous element.",
      },
      {
        question: "Is filming above people possible?",
        answer:
          "That cannot be taken for granted. Audience density, distance, flying environment and operational conditions play a role. We assess the plan in advance and, where necessary, look for a different route, different time or ground-based position. The audit is practical and does not constitute legal advice.",
      },
      {
        question: "What if the weather changes during the planned recording?",
        answer:
          "Wind, rain, visibility and light are assessed just before and at the turning moment. If safe or high-quality filming is not justified, we will adjust the schedule or replan the aerial portion in consultation.",
      },
      {
        question: "Do you also provide vertical drone video for social media?",
        answer:
          "Yes. Vertical crops do require different framing and flight lines than widescreen. That is why we determine in advance which channels are given priority and we film with sufficient space for the intended formats.",
      },
    ],
    relatedServices: [
      "bedrijfsvideo",
      "promovideo",
      "dronefotografie",
      "social-media-video",
      "fpv-video",
    ],
    seo: {
      title: "Cinematic Drone Video for Businesses | VisualVibe",
      description:
        "Drone video for companies, real estate and locations in Limburg. Smooth aerial images, carefully planned and edited for web, campaign and social media.",
      keywords: [
        "drone video",
        "drone video Limburg",
        "drone footage company",
        "cinematic aerial footage",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "drone video",
        supportingKeywords: [
          "drone video Limburg",
          "drone footage company",
          "have aerial images taken",
          "drone video production",
        ],
        type: "commercial",
      },
      overview: {
        title: "Drone video that gives meaning to movement and surroundings",
        paragraphs: [
          "Drone video can orient a viewer in seconds. A gentle approach introduces a location, a sideways sweep shows the length of a building and an ascending shot reveals the wider environment. The chosen movement must say something. That's why we start from script, message and editing, not from a list of spectacular maneuvers.",
          "We can produce aerial footage as a separate recording or integrate it into a wider video production. We map out the desired path, the take-off and landing area, relevant obstacles and people present in advance. This is followed by checks on location, airspace, weather forecast, safety and permission where necessary. What is actually flown remains dependent on the current assessment at the time of admission.",
        ],
        highlights: [
          "Flight movements designed from script and editing",
          "Horizontal and vertical applications included in advance",
          "Coordination with camera recordings from the ground",
        ],
      },
      outcomes: {
        title: "The result of purposeful air movement",
        intro:
          "A successful drone video gives the viewer an overview and a natural sense of movement within the story.",
        items: [
          {
            title: "Direct location",
            description:
              "An opening shot immediately makes it clear where the story takes place and what scale the location has.",
          },
          {
            title: "More visual rhythm",
            description:
              "Aerial footage creates breathing space and logical transitions between interviews, details and action on the ground.",
          },
          {
            title: "Widely applicable mounting",
            description:
              "Planning framing and take length in advance creates usable fragments for the main film and selected short versions.",
          },
        ],
      },
      idealFor: {
        title: "For which stories drone video works",
        intro:
          "The aerial perspective deserves a place when space, route or scale gives meaning to your message.",
        items: [
          {
            title: "Corporate videos",
            description:
              "Introduce a site, production environment or field activity as part of a broader business story.",
          },
          {
            title: "Location promotion",
            description:
              "Let visitors understand the structure, accessibility and environment of a site, accommodation or recreational place.",
          },
          {
            title: "Real estate and architecture",
            description:
              "Connect facade, volume, outdoor space and neighborhood in flowing images that complement photography in terms of content.",
          },
        ],
      },
      deliverables: {
        title: "Possible delivery of your drone video",
        intro:
          "The exact set follows from your production: edited video, additional aerial shots or a combination with other recordings.",
        items: [
          {
            title: "Edited main video",
            description:
              "A finished storyline with carefully chosen aerial images, color correction and agreed audio elements.",
          },
          {
            title: "Selection of mounted aerial shots",
            description:
              "Loose, usable fragments with a clear start and end for processing in a broader production.",
          },
          {
            title: "Channel-oriented version",
            description:
              "An agreed cut or short cut for a specific digital channel, when provided for in the scope.",
          },
          {
            title: "Color matching",
            description:
              "A natural image finish that matches the ground cameras, corporate identity and the desired atmosphere of the project.",
          },
        ],
      },
      pricing: {
        title: "How is a drone video production budgeted?",
        paragraphs: [
          "A quote for drone video includes preparation, production time and installation. A location intro within a shooting day differs from an independent film with multiple routes or versions. The environment also influences the preparation.",
          "We first map out the goal and the technical delivery. We then look at the exact location and the anticipated conditions. The final implementation remains dependent on the control of airspace, weather, safety and permission where relevant. We include possible alternatives or planning conditions transparently in the proposal.",
        ],
        factors: [
          "Number of locations and planned flight routes",
          "Role of the shots within script and editing",
          "Complexity of airspace and immediate environment",
          "Combination with interviews or ground cameras",
          "Desired video length and number of versions",
          "Horizontal, square or vertical formats",
        ],
      },
      whyVisualVibe: {
        title: "Why drone video at VisualVibe",
        intro:
          "We link technical flight preparation to video direction, so that every aerial shot has a clear place in the end result.",
        items: [
          {
            title: "Editing-oriented filming",
            description:
              "Movement, duration and viewing direction are chosen with the final storyline and channels in mind.",
          },
          {
            title: "Full production context",
            description:
              "We can match aerial footage with interviews, handheld footage, photography and graphic elements within one production.",
          },
          {
            title: "Preparation without empty promises",
            description:
              "We discuss opportunities and limitations after concrete checks of location, airspace, weather, safety and possible permission.",
          },
        ],
      },
      regional: {
        title: "Drone video in Limburg, Flanders and the border region",
        description:
          "From Limburg, VisualVibe plans drone video in Belgian Limburg, Flanders, Antwerp and the Dutch province of Limburg. Each assignment receives a location-based assessment of airspace, environment, weather conditions, safety and necessary practical coordination.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Also give your video concept an aerial perspective",
        description:
          "Send us your location, story, channels and desired timing. We look at which flight movements are substantively appropriate and appear feasible after inspection.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  "fpv-video": {
    intro:
      "Having an FPV video made takes the viewer in one energetic movement through, along or around a location. The compact drone and direct flying style enable routes that feel different from classic aerial images, but require extra preparation. We design the route around story, space and rhythm and assess location, airspace, obstacles, people, weather, safety and permission in advance where necessary. Only after inspection do we determine which route can be responsibly included.",
    excerpt:
      "Dynamic FPV video that guides the viewer through your location, with a pre-designed route and editing tailored to brand and channel.",
    process: [
      {
        title: "Design route story",
        description:
          "We translate your core message into a logical viewer journey. Every passage, bend and revelation is given a function, from first recognition to the final image.",
      },
      {
        title: "Technical walkthrough",
        description:
          "We investigate width, height, obstacles, reflections, air flows, occupants and safe zones. Airspace and necessary practical permissions are also checked for the intended setting.",
      },
      {
        title: "Choreography and takes",
        description:
          "People, machines, doors and actions are attuned to recognizable cues. We rehearse where useful and record multiple controlled passages without sacrificing safety to one take.",
      },
      {
        title: "Rhythm and finish",
        description:
          "The best passages are selected, smoothly edited and colored. Music, sound and any titles enhance the route without losing orientation.",
      },
    ],
    faqs: [
      {
        question:
          "What is the difference between FPV video and classic drone video?",
        answer:
          "Classic drone video often captures calm, steady movements at a distance. FPV feels more direct and moves closer through a route. Which approach is suitable depends on the location, atmosphere and safety space. Both styles can also be used together in one assembly.",
      },
      {
        question: "Can an FPV drone fly indoors?",
        answer:
          "This is possible in some rooms, but not automatically. Dimensions, obstacles, air flows, vulnerable objects, people and safe take-off and landing zones must first be assessed. We adjust the route and planning to what is feasible after the walkthrough.",
      },
      {
        question: "Should an FPV video consist of one continuous take?",
        answer:
          "No. A true continuous take may be appropriate, but subtle editing sometimes offers greater control over timing, safety and narrative. We choose the form that best serves the concept and are clear about this in advance.",
      },
      {
        question: "Can employees or visitors participate in the route?",
        answer:
          "Yes, when their position and movement are organized in a manageable way in advance. We work with clear cues and defined zones. In case of crowds or unpredictable movements, we look for a different timing or a route with more distance.",
      },
      {
        question: "How do we prepare the location?",
        answer:
          "We usually ask to clear the flight path, remove loose objects, secure doors and test relevant lighting. Anyone who comes into the picture will receive instructions in advance. The precise checklist follows from the walkthrough.",
      },
    ],
    relatedServices: [
      "dronevideo",
      "bedrijfsvideo",
      "promovideo",
      "social-media-video",
      "event-aftermovie",
    ],
    seo: {
      title: "Have a dynamic FPV video made in Limburg | VisualVibe",
      description:
        "Have an FPV video made in Limburg: a dynamic route through your company, location or event, prepared for story, space, safety and editing for web.",
      keywords: [
        "FPV video",
        "Have an FPV video made",
        "FPV drone Limburg",
        "one take drone video",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "Have an FPV video made",
        supportingKeywords: [
          "FPV video",
          "FPV drone Limburg",
          "indoor drone video",
          "one take corporate video",
        ],
        type: "mixed",
      },
      overview: {
        title: "Have FPV video created as a fluid viewer journey",
        paragraphs: [
          "With FPV, the pilot controls a three-dimensional route from a live camera image. For the viewer it feels as if they are moving through a company, showroom, production hall or event moment.",
          "The power is in choreography. Entrance, meeting, action and revelation form recognizable chapters. We analyze passages, obstacles, people, light switches and escape zones. For outdoor areas we also check airspace, weather and permission where necessary. The route will only follow after that concrete assessment.",
        ],
        highlights: [
          "Route concept with a clear starting and ending idea",
          "Prepared interactions with people or activity",
          "Choice between continuous take and invisible editing",
        ],
      },
      outcomes: {
        title: "Which results in a well-thought-out FPV route",
        intro:
          "The viewer not only receives energy, but also an understandable tour with natural points of interest.",
        items: [
          {
            title: "Strong viewer engagement",
            description:
              "The continuous forward movement invites you to keep looking at what appears behind the next passage.",
          },
          {
            title: "Space with personality",
            description:
              "Architecture, people and activity are connected into one experience instead of separate atmospheric images.",
          },
          {
            title: "Recognizable brand rhythm",
            description:
              "Speed, soundtrack, actions and color are tailored to the appearance of your organization and audience.",
          },
        ],
      },
      idealFor: {
        title: "Where FPV really comes into its own",
        intro:
          "FPV suits locations with a legible route, sufficient control over the environment and a story that becomes stronger through movement.",
        items: [
          {
            title: "Production and logistics",
            description:
              "Follow a recognizable process through different zones, with planned activity that makes scale and collaboration visible.",
          },
          {
            title: "Showrooms and experience",
            description:
              "Move past presentations, demonstrations and people to convey the visiting feeling in a compact and energetic way.",
          },
          {
            title: "Sports and entertainment",
            description:
              "Connect action and environment in a fast route, as far as distance, control and safety conditions allow.",
          },
        ],
      },
      deliverables: {
        title: "Parts of an FPV production",
        intro:
          "The delivery is linked to your campaign and can include carefully chosen derivative content in addition to the main video.",
        items: [
          {
            title: "Route and recording plan",
            description:
              "A practical overview of the process, actions, points of interest and sequence for everyone involved on the shooting day.",
          },
          {
            title: "Finished main video",
            description:
              "The chosen take or montage with color correction, appropriate rhythm and agreed music or sound elements.",
          },
          {
            title: "Graphic finish",
            description:
              "Titles, logo or call-to-action can be subtly incorporated if this is part of the agreed concept.",
          },
          {
            title: "Social version",
            description:
              "A selected short or vertical variant when the route has been designed and framed for this in advance.",
          },
        ],
      },
      pricing: {
        title: "What elements determine the price of FPV video?",
        paragraphs: [
          "An FPV route is substantively designed, technically explored and coordinated with actions. The video length therefore says little about the work: a short route through complex zones can require a lot of preparation.",
          "After discussion, we estimate walkthrough, rehearsal, recording and post-production. Alternative routes take changes into account. Airspace, weather, safety, attendees and practical permission remain decisive for the implementation.",
        ],
        factors: [
          "Length and technical complexity of the route",
          "Number of indoor and outdoor zones",
          "Choreography with employees, vehicles or actions",
          "Need for location exploration and rehearsal",
          "Light changes and desired production finish",
        ],
      },
      whyVisualVibe: {
        title: "Why an FPV production with VisualVibe",
        intro:
          "We combine route design, direction and post-production into one whole, with clear boundaries around the feasibility of each movement.",
        items: [
          {
            title: "Story before flying trick",
            description:
              "Every bend and transition helps the viewer discover something about your location, offering or people.",
          },
          {
            title: "Direction for the entire space",
            description:
              "We prepare actions, timing, lighting and background so that the route remains lively but readable.",
          },
          {
            title: "Specific safety consideration",
            description:
              "We check the environment, airspace, obstacles, weather, people and permission and adjust the concept when necessary.",
          },
        ],
      },
      regional: {
        title: "FPV video in Limburg and beyond",
        description:
          "VisualVibe develops FPV video from Limburg for locations in Belgian Limburg, Flanders, Antwerp and the Dutch province of Limburg. Each indoor or outdoor route is explored separately and assessed for space, airspace, weather, safety and practical permission.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Draw the route with us",
        description:
          "Provide us with a map, video or short description of your location and idea. We translate that input into a narrative FPV concept and a feasible next step.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  "vastgoed-dronebeelden": {
    intro:
      "With real estate drone footage you not only show a home or commercial property, but also the plot, the outdoor space and the relationship with the environment. We take aerial photos and, if desired, short video movements that supplement a real estate presentation. We check in advance the exact location, airspace, weather conditions, safety, privacy-sensitive positions and permission where necessary. This way we determine which images are feasible and relevant for the publication after checking.",
    excerpt:
      "Aerial photographs and video images that clearly situate the building, plot and surroundings for real estate presentations and real estate agent communications.",
    process: [
      {
        title: "Defining the sales story",
        description:
          "We discuss the features that really gain added value from the air, such as plot shape, garden, outbuildings, access or landscape location, and avoid images without information value.",
      },
      {
        title: "Test the building and surroundings",
        description:
          "We look at airspace, buildings, trees, cables, neighbors, traffic, people present and possible permission. Privacy and a safe take-off and landing spot are also practically included.",
      },
      {
        title: "Photograph according to the publication",
        description:
          "We choose controlled positions based on weather and light. We create an overview, diagonal building images and relevant environmental frameworks with room for the formats of real estate platform and social media.",
      },
      {
        title: "Select and connect",
        description:
          "We naturally complete the aerial images and coordinate color and sequence with the real estate photography, so that the entire series forms one clear tour.",
      },
    ],
    faqs: [
      {
        question:
          "What added value do drone footage have for a real estate advertisement?",
        answer:
          "They provide context that interior and facade images cannot show: the relationship between house and plot, the outdoor zones, access road and broader setting. This is especially relevant when location or terrain is an important part of the offer.",
      },
      {
        question: "Can plot boundaries be indicated on the aerial photograph?",
        answer:
          "A graphic indication can be added as agreed post-processing based on reliable information that you provide. Such a visualization is illustrative and does not replace a measurement, plan or legal document. We also formulate this clearly when using it.",
      },
      {
        question: "Are aerial images suitable for every type of home?",
        answer:
          "Not necessary. In compact terraced houses or locations with many obstacles, the aerial perspective can add little or be practically limited. We examine the purpose, location, airspace, safety, privacy and environment in advance and provide honest advice about the added value.",
      },
      {
        question:
          "Can real estate photography and drone footage be included in the same appointment?",
        answer:
          "Yes, when schedule, weather and location permit. By organizing both recordings together, light, image style and sequence can fit in well. The air portion remains dependent on the current feasibility check.",
      },
      {
        question:
          "Does the owner need to prepare anything for the aerial photographs?",
        answer:
          "A tidy driveway and garden, closed waste containers and moved loose objects make the image calmer. We also discuss parked vehicles, attendees and access to a suitable starting area. You will receive targeted points of attention in advance.",
      },
    ],
    relatedServices: [
      "vastgoedfotografie",
      "vastgoed-3d-tour",
      "dronefotografie",
      "dronevideo",
      "website-laten-maken",
    ],
    seo: {
      title:
        "Strong Real Estate Drone Images for Real Estate Agents | VisualVibe",
      description:
        "Real estate drone footage in Limburg that clearly show the property, plot and surroundings. For real estate agents, project promotion and complete real estate presentations online.",
      keywords: [
        "real estate drone footage",
        "drone footage real estate",
        "drone photography home",
        "drone estate agent Limburg",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "real estate drone footage",
        supportingKeywords: [
          "drone footage real estate",
          "drone photography home",
          "aerial real estate",
          "drone estate agent Limburg",
        ],
        type: "commercial",
      },
      overview: {
        title: "Real estate drone footage for property, plot and location",
        paragraphs: [
          "Every property photograph should answer a specific question. Carefully chosen aerial images show the plot, garden, outbuildings and access in context, without filling the presentation with images that add little value.",
          "The series ties in with real estate photography and a possible 3D tour. For confirmation we check location, airspace, obstacles, weather, security, privacy and permission where necessary. During the appointment, the current situation also determines which images can be responsibly taken.",
        ],
        highlights: [
          "Clear location of the house and outdoor space",
          "Image selection aimed at real estate publication",
          "Visual connection to interior and exterior photos",
        ],
      },
      outcomes: {
        title: "A more complete picture before the site visit",
        intro:
          "Good property drone footage provides missing context and helps prospective buyers or tenants understand the property more realistically.",
        items: [
          {
            title: "Readable plot",
            description:
              "The house, garden, driveway and outbuildings are shown in their mutual relationship from a suitable sloping point of view.",
          },
          {
            title: "Recognizable location",
            description:
              "A broader view can clarify the landscape or urban context without emphasizing unnecessary private details.",
          },
          {
            title: "Logical photo series",
            description:
              "Aerial, facade and interior images form a coherent presentation that guides the viewer step by step through the offer.",
          },
        ],
      },
      idealFor: {
        title: "Real estate where aerial images add information",
        intro:
          "Not the sales category, but the importance of location, terrain and exterior architecture determines whether drone footage are useful.",
        items: [
          {
            title: "Detached houses",
            description:
              "Show the coherence between home, garden, terraces, driveway and surrounding green structure from clear angles.",
          },
          {
            title: "Project development",
            description:
              "Situate a building or new development within the existing neighborhood and collect images for project communication.",
          },
          {
            title: "Commercial real estate",
            description:
              "Compactly combine access, parking, loading or outdoor space and building volume for business prospective tenants or buyers.",
          },
        ],
      },
      deliverables: {
        title: "What a real estate package can contain",
        intro:
          "We put together the package according to the publication plan and the features that are relevant to this specific property.",
        items: [
          {
            title: "Oblique building overviews",
            description:
              "Images in which facade, roof volume and outdoor zones come together recognisably, without destroying the spatial proportions.",
          },
          {
            title: "Situation photos",
            description:
              "Broader frameworks that clarify the location when the environment is a relevant sales argument.",
          },
          {
            title: "Naturally finished files",
            description:
              "Color, contrast, horizon and crop are matched to the rest of the real estate report.",
          },
          {
            title: "Web and publishing formats",
            description:
              "Files in the agreed resolutions for real estate website, platform or social post.",
          },
        ],
      },
      pricing: {
        title: "Pricing factors for real estate drone imagery",
        paragraphs: [
          "The production cost is determined by location, desired set and combination with other real estate media. A limited aerial photo series during an existing photo session differs from a separate appointment with photography, video and multiple publication versions. The environment may also require additional preparation or a different recording time.",
          "After receiving the address and the briefing, we do a first practical check. We describe in the proposal which images and finishing are included. Implementation remains dependent on current circumstances and the assessment of airspace, weather, safety, privacy and permission where necessary. If there are limitations, we will discuss a feasible alternative.",
        ],
        factors: [
          "Location and complexity of the immediate environment",
          "Size and structure of building and plot",
          "Number of desired photo and video angles",
          "Combination with interior and exterior photography",
          "Combination with a real estate 3D tour",
        ],
      },
      whyVisualVibe: {
        title: "Why VisualVibe for real estate from the air",
        intro:
          "We treat aerial images as part of an honest, well-organized real estate presentation and not as a separate visual trick.",
        items: [
          {
            title: "Real estate-oriented image choice",
            description:
              "We prioritize positions that make the plot, outdoor space and location understandable to prospective buyers or tenants.",
          },
          {
            title: "Coherence between media",
            description:
              "Photography, video and 3D tour can be coordinated in terms of planning, sequence and visual finishing.",
          },
          {
            title: "Careful site assessment",
            description:
              "Airspace, obstacles, weather, safety, privacy and practical clearance are checked before we confirm options.",
          },
        ],
      },
      regional: {
        title: "Real estate drone footage in Limburg and the border region",
        description:
          "VisualVibe supports real estate agents and real estate owners in Belgian Limburg, Flanders, Antwerp and the Dutch province of Limburg. We assess each address separately for image value, airspace, environment, weather, safety and any practical permission.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Show what is important around the property",
        description:
          "Provide us with the address, the type of real estate and your publication schedule. We look at which aerial images really add something and make a targeted proposal.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  "realisatie-dronebeelden": {
    intro:
      "We use construction project drone footage to record the scale, progress and spatial coherence of a construction, renovation or infrastructure project. A one-time report shows the finished result; a recurring sequence makes different project phases visually comparable. Before each visit we check the site situation, location, airspace, weather, obstacles, safety and permission where necessary. The site planning and current activity help determine which positions are responsibly feasible after inspection.",
    excerpt:
      "Comparable aerial photos and video images of construction phases and completed projects, planned around site, communication and safety.",
    process: [
      {
        title: "Planning milestones and perspectives",
        description:
          "Together we choose which phases, zones and construction parts are relevant. For follow-up series, we establish reference points and a realistic visit frequency.",
      },
      {
        title: "Coordinate site context in advance",
        description:
          "We discuss site access, work zones, cranes, machines, deliveries and contact persons. We also check location, airspace, surroundings and possible permissions before the planned time.",
      },
      {
        title: "Secure and comparable registration",
        description:
          "On location we coordinate with the designated site manager and reassess the weather and activity. We repeat frames of reference and add relevant details or overview movements.",
      },
      {
        title: "Organize by phase and application",
        description:
          "After selection and natural post-processing, we structure the files by date, zone or milestone. This way, images remain useful for reporting, portfolio and communication.",
      },
    ],
    faqs: [
      {
        question:
          "How often do you have a construction site photographed from the air?",
        answer:
          "That depends on the communication goal and the construction pace. Logical moments are visible milestones, such as earthworks, shell construction, outer shell, site construction and delivery. We avoid visits where hardly any relevant visual difference can be expected.",
      },
      {
        question: "Can images be repeated from exactly the same point of view?",
        answer:
          "We can document and repeat reference direction, elevation and framing as consistently as possible. Current site layout, obstacles, airspace, weather and safety distance may require adjustment. That's why we promise comparability, not a technically identical position in all circumstances.",
      },
      {
        question: "Is it allowed to fly while the shipyard is active?",
        answer:
          "This is considered on a case-by-case basis. Machines, cranes, deliveries and people influence routes and safe zones. We coordinate with the designated contact person and can propose a quieter time window or adjusted route. Our assessment is production-oriented and not legal advice.",
      },
      {
        question:
          "Are construction project drone footage useful as a technical inspection?",
        answer:
          "This service is intended for visual project registration and communication. The images do not replace a certified inspection, survey or formal site inspection. If you need a specialist analysis, scope and expertise must be determined separately.",
      },
      {
        question: "Can the date or project phase be mentioned on the images?",
        answer:
          "Yes, we can systematically name files and incorporate agreed graphic titles into a video or selection. The content and writing are coordinated in advance, so that the series remains consistent internally and externally.",
      },
    ],
    relatedServices: [
      "realisatiefotografie",
      "dronefotografie",
      "dronevideo",
      "bedrijfsvideo",
      "website-laten-maken",
    ],
    seo: {
      title:
        "Realization of drone footage for construction project | VisualVibe",
      description:
        "Construction project drone footage in Limburg for construction, renovation and infrastructure. Capture progress, scale and delivery in a consistent image sequence.",
      keywords: [
        "construction project drone footage",
        "drone footage construction project",
        "construction site drone photography",
        "construction progress photos",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "construction project drone footage",
        supportingKeywords: [
          "drone footage construction project",
          "construction site drone photography",
          "record construction progress",
          "drone footage renovation",
        ],
        type: "commercial",
      },
      overview: {
        title: "Construction project drone footage for progress and end result",
        paragraphs: [
          "A construction project is constantly changing. From the ground, its scale, site logistics and the relationship between different zones are not always easy to capture. Aerial footage provides a clear visual snapshot for project updates, internal presentations, stakeholder communication and later portfolio use. By agreeing reference viewpoints in advance, a series can show the development consistently across different phases.",
          "Project registration requires a different approach than a one-off promotional shoot. The planning follows meaningful milestones and is aligned with the current site calendar. Before each visit we assess location, airspace, weather, cranes and other obstacles, people present, safe zones and permission where necessary. We coordinate practically with the designated contact person, but do not take over the role of site coordinator, surveyor or inspector.",
        ],
        highlights: [
          "Reference frameworks for recognizable progression sequences",
          "Planning around visible construction milestones",
          "File structure by date, phase or project zone",
        ],
      },
      outcomes: {
        title: "Visual material that grows with the project",
        intro:
          "A consistent registration series makes the path to the end result understandable for both internal and external audiences.",
        items: [
          {
            title: "Visible project development",
            description:
              "Successive overviews show how volumes, terrain and outdoor construction change between agreed milestones.",
          },
          {
            title: "Clear scale",
            description:
              "Aerial views place construction and environment in proportion, which makes project communication easier to read.",
          },
          {
            title: "Portfolio with context",
            description:
              "The finished project is shown not only as an object, but also in relation to the terrain and surrounding infrastructure.",
          },
        ],
      },
      idealFor: {
        title: "Projects that benefit from air registration",
        intro:
          "Aerial imagery is relevant when progress, size or location is not fully visible from public or safe ground positions.",
        items: [
          {
            title: "New construction and renovation",
            description:
              "Follow visible milestones or present the finished architecture and landscaping as a coherent whole.",
          },
          {
            title: "Commercial and industrial construction",
            description:
              "Provide a clear overview of large volumes, logistics zones and outdoor infrastructure for project and brand communication.",
          },
          {
            title: "Infrastructure and site construction",
            description:
              "Show trajectory, phasing and spatial relationship of works that extend over a wider location.",
          },
        ],
      },
      deliverables: {
        title: "Delivery for a project or progress series",
        intro:
          "We choose a fixed structure that remains usable during subsequent visits and logically adds new images to the archive.",
        items: [
          {
            title: "Aerial overviews per visit",
            description:
              "A selected set with fixed reference directions and additional current positions where the situation allows.",
          },
          {
            title: "Finished project photos",
            description:
              "Natural correction of color, contrast, horizon and crop, adjusted between different recording moments.",
          },
          {
            title: "Chronological order",
            description:
              "Files organized by date, phase or agreed zone to make follow-up and internal use easier.",
          },
          {
            title: "Selection for communication",
            description:
              "A compact set that visually summarizes the milestone for publication, alongside the wider project delivery if agreed.",
          },
        ],
      },
      pricing: {
        title: "How is realization drone work quoted?",
        paragraphs: [
          "In a delivery report, the location, desired image series and post-processing determine the scope. Visits, frames of reference and file organization also count for progress registration. Each visit is practically coordinated.",
          "The site changes between planning and recording. That is why we check the weather, airspace, obstacles, activity and safe zones before every visit. When circumstances rule out a route or time, we will discuss an alternative. The quotation describes the communicative image production and does not include technical inspection or formal project control.",
        ],
        factors: [
          "One-off report or recurring series",
          "Number of planned project milestones",
          "Size and complexity of the site location",
          "Access, reception and coordination on site",
          "Number of reference directions and project zones",
          "Photo, video or combination with ground recordings",
        ],
      },
      whyVisualVibe: {
        title: "Why VisualVibe for project registration",
        intro:
          "We build a visually useful archive around real project milestones and keep the practical site context in mind during every visit.",
        items: [
          {
            title: "Continuity in focus",
            description:
              "Reference frames, color finishing and file structure ensure coherence between different project phases.",
          },
          {
            title: "Communication-oriented selection",
            description:
              "We distinguish documentary overviews from images that are suitable for portfolio, update or final presentation.",
          },
          {
            title: "Practical site coordination",
            description:
              "We plan around access and activity, in consultation with the designated contact person and after checking current circumstances.",
          },
        ],
      },
      regional: {
        title:
          "Construction project drone footage in Limburg and surrounding regions",
        description:
          "VisualVibe registers projects in Belgian Limburg, Flanders, Antwerp and the Dutch province of Limburg. For each site and visit we look at location, airspace, weather, changing obstacles, safety and practical permission before filming goes ahead.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Map out your next project milestone",
        description:
          "Share the site location, planning and desired times of use. We propose a one-off report or a clear progress series.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  "event-dronebeelden": {
    intro:
      "With event drone footage we make scale, location and audience experience visible from a complementary perspective. Consider an overview of the structure, a quiet unveiling of the terrain or a targeted movement above a free zone. An event is dynamic and therefore requires a careful plan. We check location, airspace, weather, safety zones, public flows and permission where necessary, in coordination with the organization. Only then do we determine which aerial images are responsibly feasible at the chosen time.",
    excerpt:
      "Targeted aerial photos and video images for events, prepared around program, audience flows, location and safe recording moments.",
    process: [
      {
        title: "Choose program and video moments",
        description:
          "We link the desired shots to concrete moments, such as empty construction, influx, a joint activity or atmospheric evening light. This way the air part remains compact and meaningful.",
      },
      {
        title: "Assess event site and flows",
        description:
          "With the site plan and organization we look at airspace, stages, cables, tents, trees, emergency routes, audience zones, starting location and practical permission for the intended recordings.",
      },
      {
        title: "Continue to coordinate on location",
        description:
          "We report to the agreed contact person and re-test the weather, activity and zones. Only planned routes that fit within the current safety context are executed.",
      },
      {
        title: "Bringing atmosphere into the montage",
        description:
          "We select overview and movement based on rhythm and information value, match color to the ground cameras and process images in the aftermovie or agreed separate delivery.",
      },
    ],
    faqs: [
      {
        question: "Can a drone fly during any event?",
        answer:
          "No. Location, airspace, audience density, safe distance, obstacles, program, weather and permission can limit or exclude recordings. We assess the plan in advance and again on location. That is a practical production assessment, not legal advice or general admission.",
      },
      {
        question: "Do you fly above the audience?",
        answer:
          "We never automatically assume that. We design images around controllable zones, suitable distances and moments with less or no audience where possible. If a desired position is not responsibly feasible, we will choose a different route or use a camera from the ground.",
      },
      {
        question: "Which event moments are interesting from the air?",
        answer:
          "This varies per program. Construction shows site logic, inflow shows scale and a planned group moment can summarize the energy. We only choose moments that add something visually and can be organized in a practically manageable way.",
      },
      {
        question:
          "Can event drone footage be incorporated into the aftermovie?",
        answer:
          "Yes. We match flight speed, frame rate, color and desired transitions to the rest of the registration. When VisualVibe creates the entire aftermovie, aerial and ground footage is recorded from one editing plan.",
      },
      {
        question: "What must the event organization provide in advance?",
        answer:
          "A site plan, timetable, expected public movements, contact person and relevant location agreements help with the preparation. Changes to the setup or program must also be shared in a timely manner, because they can affect routes and safe zones.",
      },
    ],
    relatedServices: [
      "eventfotografie",
      "event-aftermovie",
      "dronevideo",
      "social-media-video",
      "promovideo",
    ],
    seo: {
      title: "Event Drone footage and Aerial video in Limburg | VisualVibe",
      description:
        "Event drone footage in Limburg for overview, atmosphere and aftermovies. Carefully planned around the site, programme, public flows and safety on location.",
      keywords: [
        "event drone footage",
        "drone footage event",
        "drone event Limburg",
        "aerial video event",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "event drone footage",
        supportingKeywords: [
          "drone footage event",
          "drone event Limburg",
          "aerial video event",
          "drone footage after movie",
        ],
        type: "commercial",
      },
      overview: {
        title: "Event drone footage for overview, atmosphere and context",
        paragraphs: [
          "An appropriate aerial viewpoint shows how terrain, stages, routing and activity come together. This supplements details from the ground up in an aftermovie, retrospective or promotion. The goal remains a recognizable atmosphere, not as much height as possible.",
          "We use site plan and timing to determine relevant moments, safe zones and alternatives. Location, airspace, weather, obstacles, public flows and permission are checked where necessary. Line-up, crowds or circumstances may still change the route on the event day.",
        ],
        highlights: [
          "Visual moments linked to the event program",
          "Practical coordination with one organizational contact",
          "Aerial and ground cameras from the same mounting plan",
        ],
      },
      outcomes: {
        title: "Add some aerial footage to an event registration",
        intro:
          "The best shots provide information about size, location and energy in a short time and thus strengthen the rest of the story.",
        items: [
          {
            title: "Scale in one image",
            description:
              "A carefully chosen overview connects terrain layout and activity without losing the viewer in loose details.",
          },
          {
            title: "Strong transitions",
            description:
              "An air movement can of course connect program parts, half-days or zones in the aftermovie.",
          },
          {
            title: "Reusable promotional content",
            description:
              "Photos and selected fragments can be used for retrospective and future communication in accordance with the agreed formats.",
          },
        ],
      },
      idealFor: {
        title: "Events where the aerial perspective tells something",
        intro:
          "Drone footage are particularly suitable for events with a spatial structure and sufficient options to plan recording zones in a manageable manner.",
        items: [
          {
            title: "Corporate events",
            description:
              "Show location, reception and a planned shared moment as part of a well-organized internal or external review.",
          },
          {
            title: "Public outdoor activities",
            description:
              "Bring the terrain and program into coherence, as far as public flows, airspace and safe routes allow.",
          },
          {
            title: "Sporting events",
            description:
              "Situate the course, starting zone or clear action points within a pre-coordinated and controllable recording plan.",
          },
        ],
      },
      deliverables: {
        title: "Possible delivery for event drone footage",
        intro:
          "We tailor output to your communication timing, from a full aftermovie to a curated aerial selection for another production team.",
        items: [
          {
            title: "Finished aerial photographs",
            description:
              "A relevant selection of terrain, atmosphere and planned event moments with natural color and contrast finishes.",
          },
          {
            title: "Selected video clips",
            description:
              "Stable shots with sufficient editing space, technically tailored to the agreed event production.",
          },
          {
            title: "Integrated aftermovie",
            description:
              "Aerial footage edited between details, reactions and action from the ground when the full film is part of the assignment.",
          },
          {
            title: "Short channel version",
            description:
              "An agreed teaser or cut-out for social communication, built up from previously suitable frameworks.",
          },
        ],
      },
      pricing: {
        title: "What determines the price of event drone footage?",
        paragraphs: [
          "The scope depends on program, duration, terrain and output. Some aerial moments within an event registration differ from a separate team for photo, video and social content. Crowds influence the preparation.",
          "We make a proposal after the site plan, timing and purpose are clear. The planning states which images are given priority and which fallback is possible. Final implementation remains dependent on checks regarding location, airspace, weather, safety, public flows and permission where necessary. This keeps the quote specific without suggesting a flight under all circumstances.",
        ],
        factors: [
          "Size and layout of the event site",
          "Number of selected program and flight times",
          "Expected public flows and manageable zones",
          "Coordination with organization, location and other production teams",
          "Photo, individual video footage or complete aftermovie",
          "Duration of the event registration",
        ],
      },
      whyVisualVibe: {
        title: "Why event drone footage via VisualVibe",
        intro:
          "We connect event management, visual storytelling and location-based flight preparation in one clear production plan.",
        items: [
          {
            title: "Selective visual moments",
            description:
              "We plan around moments with real story value rather than constantly collecting aerial footage.",
          },
          {
            title: "Coherent registration",
            description:
              "Drone, ground camera and photography complement each other in rhythm, color and content, with less duplication of work on location.",
          },
          {
            title: "Coordination with the organization",
            description:
              "A clear contact line and up-to-date terrain information help adjust routes and timing when the event context changes.",
          },
        ],
      },
      regional: {
        title: "Event drone footage in Limburg and surrounding regions",
        description:
          "VisualVibe plans event drone footage in Belgian Limburg, Flanders, Antwerp and the Dutch province of Limburg. We coordinate the terrain, programme, airspace, weather, public flows, safety and practical permission separately for each event site.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Plan the air moments of your event",
        description:
          "Share your site plan, program, audience estimate and desired output. We select relevant footage and develop a feasible production proposal.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
} satisfies Record<DroneEditorialSlug, SubserviceEditorial>;

export const englishDroneEditorial: Record<string, EnglishServiceLocaleRecord> =
  {
    dronefotografie: {
      displaySlug: "drone-photography",
      title: "Drone photography",
      summary: localizedEditorial["dronefotografie"].excerpt,
      body: localizedEditorial["dronefotografie"].intro,
      benefits:
        localizedEditorial["dronefotografie"].content.overview.highlights,
      process: localizedEditorial["dronefotografie"].process,
      faqs: localizedEditorial["dronefotografie"].faqs,
      cta: localizedEditorial["dronefotografie"].content.cta,
      seo: localizedEditorial["dronefotografie"].seo,
      imageAlt: "Drone photography by VisualVibe in Limburg",
      internalLinks: localizedEditorial["dronefotografie"].relatedServices.map(
        (href) => ({
          href: `/en/services/${href}/`,
          label: href
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" "),
        }),
      ),
      editorial: localizedEditorial["dronefotografie"],
    },
    dronevideo: {
      displaySlug: "drone-video",
      title: "Drone video",
      summary: localizedEditorial["dronevideo"].excerpt,
      body: localizedEditorial["dronevideo"].intro,
      benefits: localizedEditorial["dronevideo"].content.overview.highlights,
      process: localizedEditorial["dronevideo"].process,
      faqs: localizedEditorial["dronevideo"].faqs,
      cta: localizedEditorial["dronevideo"].content.cta,
      seo: localizedEditorial["dronevideo"].seo,
      imageAlt: "Drone video production by VisualVibe in Limburg",
      internalLinks: localizedEditorial["dronevideo"].relatedServices.map(
        (href) => ({
          href: `/en/services/${href}/`,
          label: href
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" "),
        }),
      ),
      editorial: localizedEditorial["dronevideo"],
    },
    "fpv-video": {
      displaySlug: "fpv-video",
      title: "FPV Video",
      summary: localizedEditorial["fpv-video"].excerpt,
      body: localizedEditorial["fpv-video"].intro,
      benefits: localizedEditorial["fpv-video"].content.overview.highlights,
      process: localizedEditorial["fpv-video"].process,
      faqs: localizedEditorial["fpv-video"].faqs,
      cta: localizedEditorial["fpv-video"].content.cta,
      seo: localizedEditorial["fpv-video"].seo,
      imageAlt: "FPV Video by VisualVibe in Limburg",
      internalLinks: localizedEditorial["fpv-video"].relatedServices.map(
        (href) => ({
          href: `/en/services/${href}/`,
          label: href
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" "),
        }),
      ),
      editorial: localizedEditorial["fpv-video"],
    },
    "vastgoed-dronebeelden": {
      displaySlug: "real-estate-drone-footage",
      title: "Real estate drone footage",
      summary: localizedEditorial["vastgoed-dronebeelden"].excerpt,
      body: localizedEditorial["vastgoed-dronebeelden"].intro,
      benefits:
        localizedEditorial["vastgoed-dronebeelden"].content.overview.highlights,
      process: localizedEditorial["vastgoed-dronebeelden"].process,
      faqs: localizedEditorial["vastgoed-dronebeelden"].faqs,
      cta: localizedEditorial["vastgoed-dronebeelden"].content.cta,
      seo: localizedEditorial["vastgoed-dronebeelden"].seo,
      imageAlt: "Real estate drone footage by VisualVibe in Limburg",
      internalLinks: localizedEditorial[
        "vastgoed-dronebeelden"
      ].relatedServices.map((href) => ({
        href: `/en/services/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      })),
      editorial: localizedEditorial["vastgoed-dronebeelden"],
    },
    "realisatie-dronebeelden": {
      displaySlug: "construction-project-drone-footage",
      title: "Construction project drone footage",
      summary: localizedEditorial["realisatie-dronebeelden"].excerpt,
      body: localizedEditorial["realisatie-dronebeelden"].intro,
      benefits:
        localizedEditorial["realisatie-dronebeelden"].content.overview
          .highlights,
      process: localizedEditorial["realisatie-dronebeelden"].process,
      faqs: localizedEditorial["realisatie-dronebeelden"].faqs,
      cta: localizedEditorial["realisatie-dronebeelden"].content.cta,
      seo: localizedEditorial["realisatie-dronebeelden"].seo,
      imageAlt: "Construction project drone footage by VisualVibe in Limburg",
      internalLinks: localizedEditorial[
        "realisatie-dronebeelden"
      ].relatedServices.map((href) => ({
        href: `/en/services/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      })),
      editorial: localizedEditorial["realisatie-dronebeelden"],
    },
    "event-dronebeelden": {
      displaySlug: "event-drone-footage",
      title: "Event drone footage",
      summary: localizedEditorial["event-dronebeelden"].excerpt,
      body: localizedEditorial["event-dronebeelden"].intro,
      benefits:
        localizedEditorial["event-dronebeelden"].content.overview.highlights,
      process: localizedEditorial["event-dronebeelden"].process,
      faqs: localizedEditorial["event-dronebeelden"].faqs,
      cta: localizedEditorial["event-dronebeelden"].content.cta,
      seo: localizedEditorial["event-dronebeelden"].seo,
      imageAlt: "Event drone footage by VisualVibe in Limburg",
      internalLinks: localizedEditorial[
        "event-dronebeelden"
      ].relatedServices.map((href) => ({
        href: `/en/services/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      })),
      editorial: localizedEditorial["event-dronebeelden"],
    },
  };
