import type { SubserviceEditorial } from "@/types";
import type { EnglishServiceLocaleRecord } from "../services";

type VideografieSlug =
  | "bedrijfsvideo"
  | "promovideo"
  | "social-media-video"
  | "event-aftermovie"
  | "wervingsvideo"
  | "testimonial-video"
  | "podcast-video"
  | "nieuwsreportage";

const localizedEditorial = {
  bedrijfsvideo: {
    intro:
      "A corporate video uses picture and sound to show who you are, which problems you solve and how you work. We shape a clear story around your audience and central message, plan interviews and working situations carefully, and edit a coherent film with suitable versions for your website, presentations and social media.",
    excerpt:
      "A well-thought-out corporate film from storyline to editing, with real people, relevant work situations and channel-oriented versions.",
    process: [
      {
        title: "Determine audience and core story",
        description:
          "We discuss what the viewer should understand, feel or do after the video. From this we choose one central message, relevant supporting footage and a narrative format that suits your organization.",
      },
      {
        title: "Develop script, questions and shot list",
        description:
          "We turn the storyline into spoken copy, interview questions or scenes. A production schedule connects each section with the right people, locations, actions, sound requirements and practical preparation.",
      },
      {
        title: "Filming people and operations on location",
        description:
          "During the recording, we quietly guide speakers and carefully build up relevant work situations. We collect overview, action, detail and ambient sound for a credible final edit.",
      },
      {
        title: "Editing story, sound and images",
        description:
          "We select statements and scenes based on content, rhythm and coherence. We then refine the colour, sound balance, titles and agreed subtitles and export the chosen versions.",
      },
    ],
    faqs: [
      {
        question: "Do we already need a script for a corporate video?",
        answer:
          "No. A briefing about the audience, offer and desired action is sufficient. We structure the message as a script, interview format or visual line and submit it for review before filming.",
      },
      {
        question:
          "Does the manager have to appear in front of the camera himself?",
        answer:
          "Not necessarily. Employees, customers, a voice-over, on-screen text or filmed actions can carry the story. We choose a format that suits the message and is practical for your organisation.",
      },
      {
        question: "Can employees appear natural without memorizing text?",
        answer:
          "Yes. During interviews we work with targeted questions and short answer blocks. We divide scripted passages and guide them in tempo and wording, so that no one has to memorize a long text.",
      },
      {
        question: "Which versions of the corporate video can we have made?",
        answer:
          "In addition to a main version, we can plan short, vertical or silent variants. By choosing this in advance, we immediately include suitable frames and space for on-screen text in the shot list.",
      },
      {
        question:
          "Can existing photos or video images be included in the montage?",
        answer:
          "This is possible when the quality, file format and usage options match. Provide material early so that we can assess whether it works technically and substantively in the assembly.",
      },
    ],
    relatedServices: [
      "bedrijfsfotografie",
      "promovideo",
      "testimonial-video",
      "dronevideo",
      "webdesign",
    ],
    seo: {
      title: "Corporate video production for SMEss | VisualVibe Limburg",
      description:
        "Corporate video production with a strong core story, real work situations and careful editing, prepared for your website, presentations and social media.",
      keywords: [
        "corporate video",
        "corporate video production",
        "corporate film Limburg",
        "professional corporate video",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "corporate video",
        supportingKeywords: [
          "corporate video production",
          "corporate film",
          "video production for SMEs",
          "corporate video Limburg",
        ],
        type: "commercial",
      },
      overview: {
        title: "A corporate video that quickly gets to the heart of the matter",
        paragraphs: [
          "A corporate video does not have to tell everything about your company. Above all, she must provide the right information in the right order. Who do you help, what problem do you tackle and what makes your way of working recognizable? By choosing one core story, interviews, atmospheric images and details have a clear function instead of forming an arbitrary list.",
          "In pre-production we translate that story into a script or interview structure and a concrete shot list. We take into account locations, sound, employees, customers and the formats in which the video will later appear. During editing we eliminate repetition and connect words with images that demonstrate the content. This way the film remains understandable for someone who is not yet familiar with your company.",
        ],
        highlights: [
          "Core story from your audience",
          "Customized script or interview format",
          "Real work situations as evidence",
          "Editing and exports per channel",
        ],
      },
      outcomes: {
        title: "What a targeted corporate film produces",
        intro:
          "The video gives viewers a concise introduction to your people, voice and way of working.",
        items: [
          {
            title: "A clear business story",
            description:
              "The most important message is given a logical structure without jargon or side paths.",
          },
          {
            title: "Visible expertise",
            description:
              "People, processes and details support what is said in the interview or voice-over.",
          },
          {
            title: "Content for multiple contact moments",
            description:
              "A planned main video and short variations can feed website, sales and social channels.",
          },
        ],
      },
      idealFor: {
        title: "For organizations that want to show their operations",
        intro:
          "A corporate video is suitable when customers or candidates understand your offer better as soon as they see people and practices.",
        items: [
          {
            title: "SMEs with a complex offering",
            description:
              "Make a service, process or technical solution accessible with images and explanations.",
          },
          {
            title: "Family businesses",
            description:
              "Connect history, involvement and contemporary operations in one personal story.",
          },
          {
            title: "Professional service providers",
            description:
              "Give abstract expertise a face through interviews, consultations and concrete situations.",
          },
        ],
      },
      deliverables: {
        title: "From main video to practical channel versions",
        intro:
          "The delivery is linked in advance to the places where you will actually publish the story.",
        items: [
          {
            title: "Edited main video",
            description:
              "A substantively completed film with color correction, sound mix and titles.",
          },
          {
            title: "Subtitled version",
            description:
              "Burned-in or separately supplied subtitles when they are part of the assignment.",
          },
          {
            title: "Short fragments",
            description:
              "Predetermined content cuts for social media, sales or internal introduction.",
          },
          {
            title: "Channel-oriented exports",
            description:
              "Files in agreed ratio, resolution and compression for the chosen publication locations.",
          },
        ],
      },
      pricing: {
        title: "Which choices determine the price of a corporate video?",
        paragraphs: [
          "A corporate video is budgeted for the entire production, not just the recording. The chosen narrative form determines how much concept, script, interview preparation, locations and shooting situations are required. A compact film around one speaker is different from a story about different teams and processes.",
          "Editing, graphics, subtitles, sound treatment and the number of versions also play a role. We first map out the main story and necessary images and distinguish them from additional wishes. The quotation clearly describes what preparation, production and delivery are provided.",
        ],
        factors: [
          "Concept and narrative form",
          "Script or interview preparation",
          "Number of speakers and scenes",
          "Number of locations",
          "Sound and voice-over recording",
          "Light and production logistics",
          "Assembly complexity",
          "Titles, graphics and subtitles",
          "Number of lengths and aspect ratios",
        ],
      },
      whyVisualVibe: {
        title: "Why make a corporate video with VisualVibe",
        intro:
          "We connect strategy, shooting and editing so that every scene helps tell the core story.",
        items: [
          {
            title: "Content before equipment",
            description:
              "Audience and message drive the script, questions and images we plan.",
          },
          {
            title: "Guidance for real people",
            description:
              "Speakers receive concrete preparation and calm instructions during filming.",
          },
          {
            title: "Assembled for use",
            description:
              "Rhythm, subtitles and proportions are tailored to your actual publishing channels.",
          },
        ],
      },
      regional: {
        title: "Corporate videos for Limburg and the surrounding area",
        description:
          "We produce corporate videos for independent businesses and SMEs in Limburg, Flanders, Antwerp and the Dutch province of Limburg, with recordings in the area where your story actually takes place.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Reduce your company story to one strong line",
        description:
          "Tell us who you want to reach, what they need to understand and where the video will appear. We translate this into a suitable production proposal.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },

  promovideo: {
    intro:
      "A promotional video puts one product, service, promotion or launch in a targeted spotlight. We build the concept around attention, benefit, proof and call-to-action, film only what reinforces that message and create versions that fit the campaign page, advertisement, sales presentation and relevant social channels.",
    excerpt:
      "A compact campaign video with a clear proposition, targeted images and versions for the channels you promote on.",
    process: [
      {
        title: "Tighten the offer and campaign objective",
        description:
          "We determine which offer is central, for whom it is relevant and which action the video supports. The core promise is formulated in concrete terms without burdening the film with too many arguments.",
      },
      {
        title: "Develop creative hook and script",
        description:
          "We develop a visual concept, opening moment, text structure and call-to-action. Storyboard or shot list shows which product details, situations, people and graphic elements are needed.",
      },
      {
        title: "Produce campaign images efficiently",
        description:
          "On set we monitor pace, continuity, product presentation and space for text. We include variants when different opening images or aspect ratios are pre-planned.",
      },
      {
        title: "Mount on impact and channel",
        description:
          "We edit with a clear tension, provide sound, color and titles and make the agreed lengths. Each format maintains an understandable message and visible call-to-action.",
      },
    ],
    faqs: [
      {
        question: "How long should a promo video be?",
        answer:
          "This follows from channel, message and viewing context. A short advertisement requires a different rhythm than a video on a campaign page. We first determine what is necessary and, if necessary, make multiple targeted edits from the same production.",
      },
      {
        question: "Can one promo video work both horizontally and vertically?",
        answer:
          "Yes, if both ratios are provided for in concept and recording. We safely frame important actions, create separate takes where necessary, and repost graphics by format. Only cropping afterwards often limits the composition.",
      },
      {
        question: "Can you film our product in use?",
        answer:
          "Certainly. We discuss the user, location, actions, props and sequence in advance. For technical or regulated products, your team provides substantive instructions so that the demonstration is recorded correctly, safely and appropriately with your communication.",
      },
      {
        question: "Is music included in a promotional video?",
        answer:
          "We tailor the musical direction to brand and editing and use an appropriate source according to the agreed production. Platforms, advertisements and external campaigns can set their own conditions, so the intended use must be known before the choice.",
      },
      {
        question: "Can we have different calls to action installed?",
        answer:
          "That's possible. Consider one variant for a landing page and another for social ads. Deliver final formulations, destinations and any campaign conditions in a timely manner, so that the image, timing and final map match correctly.",
      },
    ],
    relatedServices: [
      "social-media-video",
      "productfotografie",
      "bedrijfsvideo",
      "webdesign",
      "seo-copywriting",
    ],
    seo: {
      title: "Have a promotional video made for campaigns | VisualVibe Limburg",
      description:
        "Have a promotional video made with a sharp concept, convincing product or service images and suitable versions for advertisements, landing pages and social media.",
      keywords: [
        "promo video",
        "have a promotional video made",
        "promotional video company",
        "campaign video Limburg",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "promo video",
        supportingKeywords: [
          "have a promotional video made",
          "promotional video",
          "campaign video",
          "product video",
        ],
        type: "commercial",
      },
      overview: {
        title: "A promotional video with one sharp campaign message",
        paragraphs: [
          "A promotional video works best when the viewer immediately understands why the offer is relevant. That is why we do not start with a list of product features, but with the problem, desire or moment of use that your audience recognizes. We then choose which images make a benefit tangible and which text is really necessary to lead to the next step.",
          "The channel determines the creative choices. On social media, the opening image must have meaning even without sound, while a landing page can offer more space for explanation. We plan different proportions, text zones and calls to action before the shoot. This does not create a long film that is accidentally shortened, but a set of montages, each with a clear function.",
        ],
        highlights: [
          "Proposition and call-to-action central",
          "Visual concept per campaign",
          "Recording prepared for multiple formats",
        ],
      },
      outcomes: {
        title: "Campaign content that specifically supports one offer",
        intro:
          "The production brings message, product and next step together without unnecessary explanation.",
        items: [
          {
            title: "Fast recognition",
            description:
              "The opening image and the first text immediately make it clear who the offer is intended for.",
          },
          {
            title: "Specific product benefit",
            description:
              "Usage, detail, and context reveal what a general claim would otherwise tell on its own.",
          },
          {
            title: "Coherent campaign versions",
            description:
              "Different lengths and frames maintain the same visual line and core message.",
          },
        ],
      },
      idealFor: {
        title: "For an offer that temporarily receives extra attention",
        intro:
          "A promotional video is suitable when the subject, audience and desired next step are clearly defined.",
        items: [
          {
            title: "Product launches",
            description:
              "Introduce form, application and distinctive details within one campaign concept.",
          },
          {
            title: "New services",
            description:
              "Make a non-tangible offer understandable through situations, explanations and a targeted action.",
          },
          {
            title: "Seasonal campaigns",
            description:
              "Build atmosphere and urgency around a specific moment without repeating your entire brand story.",
          },
        ],
      },
      deliverables: {
        title: "Promotional videos ready for your campaign channels",
        intro:
          "We agree on the editing options in advance, so that the shoot collects exactly the right material.",
        items: [
          {
            title: "Main assembly",
            description:
              "The complete campaign message with finished images, sound, titles and call-to-action.",
          },
          {
            title: "Short ad versions",
            description:
              "Agreed cut-outs with their own opening and understandable core for short placements.",
          },
          {
            title: "Vertical and horizontal frames",
            description:
              "Exports accrued separately when both ratios are in the production plan.",
          },
          {
            title: "Subtitles and on-screen text",
            description:
              "Readable core text for situations where the viewer does not use sound.",
          },
          {
            title: "Alternative ending cards",
            description:
              "Different calls to action or destinations if provided in advance.",
          },
        ],
      },
      pricing: {
        title: "What determines the price of a promotional video?",
        paragraphs: [
          "Concept and implementation together determine the size. A product demonstration in one controlled setting is different from a campaign with actors, multiple locations, styling and different scenarios. The number of variants required during recording also has an influence.",
          "In post-production, the editing rhythm, graphics, sound design, subtitles and number of lengths or formats count. We first compare the necessary campaign assets and build a targeted production around them, so that the content of the quotation remains verifiable.",
        ],
        factors: [
          "Creative concept and script",
          "Product or location styling",
          "Number of scenes and locations",
          "People in front of the camera",
          "Props and product variants",
          "Recording of voice-over or sound",
          "Graph and text animation",
          "Number of mounting versions",
          "Aspect ratios and subtitles",
        ],
      },
      whyVisualVibe: {
        title: "Why develop your promo video with VisualVibe",
        intro:
          "We think from the campaign decision and translate it into a film that remains visually compact.",
        items: [
          {
            title: "A defined proposition",
            description:
              "We help separate the main message and supporting arguments from side issues.",
          },
          {
            title: "Concept that is filmable",
            description:
              "Shotlist and storyboard connect the creative idea with location, product and feasible shot.",
          },
          {
            title: "Versions from the beginning",
            description:
              "Short mounts and vertical frames are provided in production, not just cut out afterwards.",
          },
        ],
      },
      regional: {
        title: "Promotional videos for campaigns in Limburg and beyond",
        description:
          "We produce promotional videos for companies in Limburg, Flanders, Antwerp and the Dutch province of Limburg, at a chosen business, store or campaign location that supports the offer.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Give your campaign one clear visual message",
        description:
          "Share your offer, audience, channels and desired action. We turn it into a concrete video concept with suitable editing variants.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },

  "social-media-video": {
    intro:
      "Social media video requires a clear idea in the right format, with an opening that provides context without any detours. We develop repeatable formats for Instagram, LinkedIn, TikTok or other chosen channels and efficiently produce images, interviews and short explanations in one focused content session.",
    excerpt:
      "Channel-oriented short videos with a strong opening, readable subtitles and a format that supports your content planning.",
    process: [
      {
        title: "Choose channels and content pillars",
        description:
          "We look at the audience, publication rhythm and the role of each platform. We then choose a limited number of themes and formats that match your expertise, brand voice and available people.",
      },
      {
        title: "Prepare hooks and turning blocks",
        description:
          "We work out the opening, core and closing for each video. We group scripts, questions, locations, products and additional images into logical blocks for feasible batch recording.",
      },
      {
        title: "Vertical and modular recording",
        description:
          "During the content session we guide the pace and presentation and film additional details or actions. Frames take into account interface elements, subtitles, and text safe zones.",
      },
      {
        title: "Edit short episodes in a recognizable way",
        description:
          "We remove lead-up, tighten the rhythm and add agreed titles and subtitles. Each episode has an independent message within the same visual format line.",
      },
    ],
    faqs: [
      {
        question:
          "Which social media channel should we create video for first?",
        answer:
          "Choose the channel where your audience is actually active and where your team can publish consistently. LinkedIn, Instagram and TikTok have different viewing contexts. We tailor format, subject and tone to one clear channel role.",
      },
      {
        question: "Can we make multiple short videos in one shooting day?",
        answer:
          "Yes, a batch works well when scripts, clothing, locations and props are grouped in advance. We ensure sufficient attention is paid to each subject. The goal is a usable sequence, not as many takes as possible without editorial coherence.",
      },
      {
        question: "Should all social videos be shot vertically?",
        answer:
          "Not always. Vertical video fits many mobile feeds, while LinkedIn, YouTube or a website also use other frameworks. We choose per distribution plan and can record multiple compositions if this is stated in advance in the shot list.",
      },
      {
        question: "Do you also write hooks and short scripts?",
        answer:
          "We can structure your content into a strong opening, compact core and appropriate next step. Professional accuracy remains with your organization. You provide expertise and examples, we help you formulate them in an understandable and filmable manner.",
      },
      {
        question: "Are subtitles important for social media video?",
        answer:
          "Many videos are viewed in situations where sound is not a given. Subtitles and text on screen can make the message readable independently. We keep sentences compact and monitor contrast and placement within the chosen frame.",
      },
    ],
    relatedServices: [
      "promovideo",
      "brandingfotografie",
      "podcast-video",
      "seo-copywriting",
      "bedrijfsvideo",
    ],
    seo: {
      title: "Social media video for SMEs in Limburg | VisualVibe",
      description:
        "Social media video for Instagram, LinkedIn and TikTok: repeatable formats, strong hooks, batch recordings and subtitled montages in the right frame.",
      keywords: [
        "social media video",
        "social video production",
        "vertical video",
        "social video content for SMEs",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "social media video",
        supportingKeywords: [
          "social video production",
          "vertical video",
          "Reels for companies",
          "video content LinkedIn",
        ],
        type: "commercial",
      },
      overview: {
        title: "Social media video with a recognizable content format",
        paragraphs: [
          "Social media video becomes stronger when not every publication starts from scratch. A recognizable format provides guidance: an expert answers one question each time, a maker shows one step or a team member explains one practical example. The viewer quickly understands what to expect and your organization can prepare topics in a more targeted manner.",
          "We link formats to content pillars and channels and write a concise structure per episode. The recording is arranged as a batch with sufficient visual variety. In the editing, each video is given a direct opening, readable subtitles and a fitting ending. We avoid long logo intros or general company explanations when they delay the concrete content.",
        ],
        highlights: [
          "Formats per channel and audience",
          "Batch content production",
          "Direct hooks and compact scripts",
          "Subtitles within safe zones",
        ],
      },
      outcomes: {
        title: "A video series that makes publishing easier",
        intro:
          "You will receive separate episodes that are related in content but can each be viewed independently.",
        items: [
          {
            title: "More substantive focus",
            description:
              "Each video addresses one question, insight, application or next step.",
          },
          {
            title: "A recognizable series",
            description:
              "Fixed visual elements and presentation format connect episodes on different themes.",
          },
          {
            title: "More efficient reuse",
            description:
              "A prepared recording can combine main videos, short clips, and supporting footage.",
          },
        ],
      },
      idealFor: {
        title: "For teams with expertise and stories to share",
        intro:
          "Short videos especially work when you can regularly link relevant topics to real people or situations.",
        items: [
          {
            title: "Independent experts",
            description:
              "Explain frequently asked questions and clear positions in a personal format.",
          },
          {
            title: "SME marketing teams",
            description:
              "Build a planned stock around services, culture, cases and practical tips.",
          },
          {
            title: "Product brands",
            description:
              "Show usage, comparison, maintenance and details in short visual episodes.",
          },
        ],
      },
      deliverables: {
        title: "A publishable series of short video modules",
        intro:
          "Number, length and platform versions are recorded as concrete episodes before the filming day.",
        items: [
          {
            title: "Separate social videos",
            description:
              "Edited episodes, each with its own topic, hook and ending.",
          },
          {
            title: "Burned-in subtitles",
            description:
              "Readable text tailored to the speaking pace and safe space in the image.",
          },
          {
            title: "Recognizable titles",
            description:
              "Agreed name card, section title or graphic element within your brand style.",
          },
          {
            title: "Vertical exports",
            description:
              "Files for mobile feeds and short video formats according to the distribution plan.",
          },
          {
            title: "Additional channel versions",
            description:
              "Square or horizontal variants when recording and mounting are provided.",
          },
          {
            title: "Ordered episode set",
            description:
              "Clear file names per theme, order or intended publication.",
          },
        ],
      },
      pricing: {
        title: "How is a social media video series budgeted?",
        paragraphs: [
          "The price is based on the number of unique formats and episodes, not just the total recording time. Ten answers in one fixed setting require different preparation and editing than product scenes, interviews and multiple locations mixed together.",
          "Scripts, presentation support, styling, graphics, subtitles and platform variants also count. We create an episode overview in advance and group production blocks. This makes it visible which content is recorded and how many individual edits are completed.",
        ],
        factors: [
          "Number of content pillars and formats",
          "Number of episodes",
          "Script and hook development",
          "Number of speakers or products",
          "Locations and set changes",
          "Graphic format components",
          "Subtitles",
          "Assembly per episode",
          "Number of aspect ratios",
        ],
      },
      whyVisualVibe: {
        title: "Why make social video with VisualVibe",
        intro:
          "We combine editorial structure with a production design that balances repetition and variation.",
        items: [
          {
            title: "Format thinking",
            description:
              "We build a recurring form that doesn't start new topics over and over again.",
          },
          {
            title: "Prepared in batches",
            description:
              "Scripts, looks and scenes are grouped without neglecting the content per episode.",
          },
          {
            title: "Made for the feed",
            description:
              "Hook, text placement, pace and proportion follow the chosen viewing context.",
          },
        ],
      },
      regional: {
        title: "Social media video in Limburg and surrounding regions",
        description:
          "We organize content sessions for independent businesses and SMEs in Limburg, Flanders, Antwerp and the Dutch province of Limburg, at the office or a location that suits the chosen format.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Build your loose ideas into a video series",
        description:
          "Share your channels, audience and recurring topics. We help you choose, structure and plan for targeted content production.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },

  "event-aftermovie": {
    intro:
      "An event aftermovie brings the content, atmosphere and energy of your event together in a short film. We work from the running order, plan the essential moments and interviews, follow the programme and guests closely, and edit a retrospective that reconnects participants with the day while providing context for the next edition.",
    excerpt:
      "A rhythmic retrospective with program highlights, audience reactions, atmosphere and brand details from your business event.",
    process: [
      {
        title: "Finding the event story in the script",
        description:
          "We discuss the purpose, audience, program and desired follow-up communication. From this we select the moments, people and changes in atmosphere that together form the story of this edition.",
      },
      {
        title: "Scheduling coverage, interviews and positions",
        description:
          "We coordinate stage access, lighting, sound, location zones and any interviews. A recording plan prevents conflicts between parallel components and clearly indicates priorities.",
      },
      {
        title: "Collect highlights and moments in between",
        description:
          "During the event we film reception, performances, speakers, reactions, conversations, branding and details. We move discreetly and only provide targeted direction during planned interviews or group moments.",
      },
      {
        title: "Building the atmosphere as a compact film",
        description:
          "We select a clear arc, edit the image and sound to rhythm and process titles or statements. Then we create agreed main and social versions.",
      },
    ],
    faqs: [
      {
        question: "What makes an aftermovie more than a montage of highlights?",
        answer:
          "A strong retrospective has a beginning, development and conclusion. Context images, reactions and short statements connect the big moments. As a result, a viewer not only sees what happened on stage, but also understands the atmosphere and intention.",
      },
      {
        question: "Can visitors be briefly interviewed during the event?",
        answer:
          "Yes. We plan a quiet place and compact questions that tie in with the story. The organizer helps find suitable participants and arranges the necessary communication or permission. Spontaneous interviews without preparation are not suitable for every event.",
      },
      {
        question: "How is the sound of speeches used in an aftermovie?",
        answer:
          "We discuss in advance whether a technical audio source from the hall or stage is available and record additional sound where appropriate. In editing we select short substantive fragments. The quality depends on location and event technology.",
      },
      {
        question: "Can event photography and aftermovie be planned together?",
        answer:
          "Yes. Both teams can work with one priority list and script. We coordinate positions, group moments and interviews so that photography and video do not interfere with each other and together form a consistent visual retrospective.",
      },
      {
        question: "What information must be finalized before event recording?",
        answer:
          "At a minimum, we need location agreements, current program, important names, stage rules and contact persons. Corporate identity, desired titles, calls-to-action and agreements about guests also help to properly organize editing and publication in advance.",
      },
    ],
    relatedServices: [
      "eventfotografie",
      "event-dronebeelden",
      "social-media-video",
      "podcast-video",
      "brandingfotografie",
    ],
    seo: {
      title: "Have an event aftermovie made in Limburg | VisualVibe",
      description:
        "Have an event aftermovie made with strong program fragments, guests, atmosphere and brand details, edited as a retrospective for participants and subsequent editions.",
      keywords: [
        "event aftermovie",
        "have an aftermovie made",
        "event video Limburg",
        "filming a corporate event",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "event aftermovie",
        supportingKeywords: [
          "have an aftermovie made",
          "event video",
          "filming a corporate event",
          "aftermovie Limburg",
        ],
        type: "commercial",
      },
      overview: {
        title: "An event aftermovie that makes you feel the day again",
        paragraphs: [
          "An event aftermovie combines emotion with context. It should show who came together, what happened and how the programme unfolded. A sequence of quick atmosphere shots often lacks meaning, while a full event recording loses the concise impact of an aftermovie. We balance programme, people, setting and brand.",
          "That is why we read the script in advance as a story. We highlight opening images, key moments, reactions, possible statements and a suitable ending. On the day itself we also collect transitions and details that give the editing breath. Music, ambient sound and short interview or stage fragments are then brought together in one rhythmic line.",
        ],
        highlights: [
          "Storyline from the event program",
          "Atmosphere, content and reactions in balance",
          "Prepared interview and audio moments",
          "Main version and short follow-up content",
        ],
      },
      outcomes: {
        title: "A retrospective that does more than archive",
        intro:
          "The film gives participants recognition and new viewers sufficient context for your event communication.",
        items: [
          {
            title: "Revivable atmosphere",
            description:
              "Reactions, movement, light and sound bring the energy of the moment closer again.",
          },
          {
            title: "Visible event value",
            description:
              "Speakers, meetings and program components make concrete what visitors received.",
          },
          {
            title: "Material for a next edition",
            description:
              "Short versions and strong scenes support announcement, partner acquisition and social review.",
          },
        ],
      },
      idealFor: {
        title: "For business events with their own identity",
        intro:
          "We adapt the tone and rhythm to the content, from a modest knowledge day to an energetic launch.",
        items: [
          {
            title: "Conferences and study days",
            description:
              "Combine content fragments with audience, networking and location details.",
          },
          {
            title: "Openings and product launches",
            description:
              "Build towards unveiling and responses with the brand visible in context.",
          },
          {
            title: "Company parties and anniversaries",
            description:
              "Capture appreciation, encounters and festive moments vividly but carefully.",
          },
        ],
      },
      deliverables: {
        title: "A complete event film for review and follow-up",
        intro:
          "We agree in advance on the required lengths, frameworks and substantive emphasis.",
        items: [
          {
            title: "Edited aftermovie",
            description:
              "The main retrospective with finished image, sound mix, music and titles.",
          },
          {
            title: "Short social version",
            description:
              "A compact installation with an independent opening and clear event context.",
          },
          {
            title: "Vertical cut",
            description:
              "A separately constructed mobile framework if this is provided for in the recording plan.",
          },
          {
            title: "Name and brand titles",
            description:
              "Agreed event name, date, partners or call-to-action in an appropriate design.",
          },
          {
            title: "Subtitled variant",
            description:
              "Readable representation of interviews or podium statements when agreed.",
          },
        ],
      },
      pricing: {
        title: "What factors determine the price of an aftermovie?",
        paragraphs: [
          "Duration and complexity of the program determine how much coverage is needed. One room with a fixed order differs from a festival setup with parallel stages, backstage areas and multiple important guests. The recording plan makes it clear which moments have priority.",
          "Interviews, technical audio, multiple camera or team positions, graphics and different editing versions also influence the production. We look at the script and location together and describe both event coverage and post-production specifically in the quotation.",
        ],
        factors: [
          "Scope and duration of the program",
          "Number of rooms or zones",
          "Parallel activities",
          "Number of planned interviews",
          "Stage and audio technology",
          "Lighting conditions",
          "Access and movements",
          "Editing rhythm and graphics",
          "Number of lengths and aspect ratios",
        ],
      },
      whyVisualVibe: {
        title: "Why make your aftermovie with VisualVibe",
        intro:
          "We treat the script as a storyline and at the same time remain alert for unexpected human moments.",
        items: [
          {
            title: "Priorities before the doors open",
            description:
              "Program, people, partners and publishing goals drive our inclusion choices.",
          },
          {
            title: "Content and energy",
            description:
              "Atmospheric images are given context through statements, reactions and recognizable program components.",
          },
          {
            title: "Assembly with follow-up purpose",
            description:
              "The film is constructed for retrospection and the agreed communication regarding next steps.",
          },
        ],
      },
      regional: {
        title: "Event aftermovies in Limburg and surrounding regions",
        description:
          "We film business events in Limburg, Flanders, Antwerp and the Dutch province of Limburg, with a production plan that suits the location, the program and the desired retrospective.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Give your event a cinematic sequel",
        description:
          "Send date, location, script and communication goal. Together we determine which moments, sounds and versions your aftermovie needs.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },

  wervingsvideo: {
    intro:
      "A recruitment video shows candidates what a position, team and workplace mean in practice. We start from the questions of the right candidate, choose credible employees and situations and build an honest employer story that supports vacancies, career pages and social recruitment campaigns.",
    excerpt:
      "A human employer story with real colleagues, concrete work situations and targeted versions for your vacancy channels.",
    process: [
      {
        title: "Investigate candidate questions and job context",
        description:
          "We discuss audience, role, working environment and expectations that candidates often have. Together we choose which cultural characteristics and daily situations are demonstrably relevant to the story.",
      },
      {
        title: "Prepare employees and storyline",
        description:
          "We select appropriate conversation partners, create interview questions and build a shot list around real tasks and collaboration. Participants know in advance what is practically expected of them.",
      },
      {
        title: "Film work and colleagues authentically",
        description:
          "We supervise interviews on location and record recognizable actions, consultations and surroundings. We direct the image where necessary without creating a fictional working day.",
      },
      {
        title: "Assemble the employer story per vacancy",
        description:
          "We select concrete statements, connect them to relevant evidence and provide titles and subtitles. Agreed short variants each have a clear function or candidate question.",
      },
    ],
    faqs: [
      {
        question: "Who speaks best in a recruitment video?",
        answer:
          "Choose employees who can explain the position, collaboration or development from their own experience. A manager can provide context, but colleagues from the daily team often make expectations more concrete. Not everyone needs to speak in the same video.",
      },
      {
        question: "Should we only show the positive aspects of the job?",
        answer:
          "A credible story identifies what makes the work attractive and provides realistic context about the environment, tasks or collaboration. We formulate carefully and avoid promises that are not supported in practice. Your HR team checks the substantive accuracy.",
      },
      {
        question: "Can one employer video serve multiple vacancies?",
        answer:
          "An overarching culture video can be broadly useful. Additional modules are often clearer for roles with different responsibilities or audiences. We can prepare a main story and feature-oriented short versions within one production.",
      },
      {
        question: "How do you help employees who have no camera experience?",
        answer:
          "We share themes and practical tips in advance, but do not ask for rehearsed testimony. During the interview we ask one question at a time, give time to rephrase and look for concrete examples in plain language.",
      },
      {
        question: "Where can a recruitment video be published?",
        answer:
          "Common places are a career page, vacancy detail, LinkedIn, other social channels, job fair or internal referral. We tailor length, ratio, subtitles and call-to-action to the chosen candidate route.",
      },
    ],
    relatedServices: [
      "bedrijfsvideo",
      "zakelijke-portretten",
      "social-media-video",
      "bedrijfsfotografie",
      "webdesign",
    ],
    seo: {
      title: "Recruitment video production for SMEs | VisualVibe Limburg",
      description:
        "Recruitment video production with real employees, concrete positions and a credible employer story for vacancies, careers page and social media.",
      keywords: [
        "recruitment video",
        "have a recruitment video made",
        "recruitment video",
        "employer branding video",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "recruitment video",
        supportingKeywords: [
          "have a recruitment video made",
          "recruitment video",
          "employer branding video",
          "job video",
        ],
        type: "commercial",
      },
      overview: {
        title: "A recruitment video that gives candidates real context",
        paragraphs: [
          "A recruitment video is not a general company presentation with a job title underneath. Candidates want to know who they are working with, what they actually do and what environment or expectations come with the role. We therefore start from their questions and uncertainties and choose employees and scenes that can provide a concrete answer.",
          "The preparation is done together with HR and people from the team. We sharpen language, but do not prescribe enthusiastic testimonials that do not feel like our own words. During the recording we combine interviews with real work actions and relevant spaces. In the editing, the story remains specific enough to recognize itself or to consciously not apply.",
        ],
        highlights: [
          "Candidate perspective as a starting point",
          "Real employees and work situations",
          "Interview questions without rehearsed slogans",
          "Vacancy and social recruitment versions",
        ],
      },
      outcomes: {
        title: "A more realistic first image of the employer",
        intro:
          "The video helps candidates assess the position and culture before entering into an interview.",
        items: [
          {
            title: "Human acquaintance",
            description:
              "Future colleagues and managers give the team a recognizable face.",
          },
          {
            title: "More concrete job context",
            description:
              "Tasks, tools, spaces and collaboration make general vacancy language visible.",
          },
          {
            title: "Reusable employer material",
            description:
              "Main story and short modules support multiple steps in the candidate route.",
          },
        ],
      },
      idealFor: {
        title: "For employers who want to show more than one job list",
        intro:
          "Video is valuable when people, work context or culture are difficult to fully capture in text.",
        items: [
          {
            title: "Technical and practical functions",
            description:
              "Show the workplace, materials, safety and collaboration in concrete terms.",
          },
          {
            title: "SMEs with a close-knit team",
            description:
              "Give candidates an honest impression of direct lines and daily interaction.",
          },
          {
            title: "Growing organizations",
            description:
              "Build an employer story that can substantively support various vacancies.",
          },
          {
            title: "Difficult to explain roles",
            description:
              "Combine employee language with relevant images of tasks and impact.",
          },
        ],
      },
      deliverables: {
        title: "Recruitment content for the entire candidate route",
        intro:
          "The precise videos are linked to functions, channels and questions you want to answer.",
        items: [
          {
            title: "Chief Recruitment Video",
            description:
              "A completed employer or job story with interviews and work images.",
          },
          {
            title: "Function-oriented fragments",
            description:
              "Short montages around a role, colleague, task or frequently asked candidate question.",
          },
          {
            title: "Subtitled version",
            description:
              "Readable interviews for mobile and silent viewing contexts.",
          },
          {
            title: "Vacancy-oriented final card",
            description:
              "Agreed position, next step or reference to the application page.",
          },
          {
            title: "Channel exports",
            description:
              "Appropriate horizontal, square or vertical files when planned in advance.",
          },
        ],
      },
      pricing: {
        title: "What determines the price of a recruitment video?",
        paragraphs: [
          "The size depends on the number of functions, employees, locations and stories. One video around a specific team differs from a broad employer branding production with multiple locations and job profiles. Internal preparation and availability also play a role.",
          "In addition, interview preparation, work images, subtitles, graphics and short vacancy versions require separate attention. We first discuss which candidate questions the video should answer and build a targeted production and transparent delivery around this.",
        ],
        factors: [
          "Number of functions or audiences",
          "Number of employees in view",
          "Interview preparation",
          "Number of workplaces or locations",
          "Complexity of work situations",
          "Safety and planning agreements",
          "Installation of role-specific versions",
          "Titles and subtitles",
          "Number of channel formats",
        ],
      },
      whyVisualVibe: {
        title: "Why create your recruitment video with VisualVibe",
        intro:
          "We bring together HR goals, candidate questions and real team stories without making work practice more beautiful than it is.",
        items: [
          {
            title: "Candidate-oriented editing",
            description:
              "Interview and shot list answer specific questions about role, team and environment.",
          },
          {
            title: "Calm employee guidance",
            description:
              "Colleagues speak from their own experience and receive clear support in front of the camera.",
          },
          {
            title: "Can be used modularly",
            description:
              "We plan a main story and relevant cuts around features or channels.",
          },
        ],
      },
      regional: {
        title: "Recruitment videos for employers in Limburg and beyond",
        description:
          "We film employers and teams in Limburg, Flanders, Antwerp and the Dutch province of Limburg, in the workplace where candidates can experience the position and culture most concretely.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Introduce candidates before the first interview",
        description:
          "Share your vacancies, candidate questions and workplaces. We develop an honest video concept around the people who really know the job.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },

  "testimonial-video": {
    intro:
      "A testimonial video lets a customer talk in their own words about the reason, collaboration and experience. We prepare the content of the conversation without prescribing answers, film the testimony in an appropriate environment and support statements with relevant images of the person, product, project or working method.",
    excerpt:
      "A credible customer story with a careful interview, concrete context and supporting images for website and sales.",
    process: [
      {
        title: "Defining a relevant customer case",
        description:
          "We discuss why this customer and experience fit the questions of your audience. Subject, participants, context and use are clearly recorded, including consent and substantive sensitivities.",
      },
      {
        title: "Prepare preliminary interview and questionnaire",
        description:
          "A short substantive conversation maps out the reason, selection process, collaboration and concrete experience. We ask open questions and determine which locations or additional images can support the story.",
      },
      {
        title: "Take testimony and context calmly",
        description:
          "We create a comfortable interview situation, ask questions off-screen and leave room for your own formulations. We then film relevant actions, surroundings and details without replaying the case.",
      },
      {
        title: "Editing an honest and compact story",
        description:
          "We organize statements while retaining meaning, remove repetition and add supporting images, titles and subtitles. The agreed substantive check takes place before final export.",
      },
    ],
    faqs: [
      {
        question: "Does the client receive the interview questions in advance?",
        answer:
          "We usually share themes and practical expectations so that the customer knows what the conversation is about. Fully written answers are not necessary. A preliminary discussion helps retrieve concrete examples while the formulation remains natural during filming.",
      },
      {
        question: "What if the customer is nervous in front of the camera?",
        answer:
          "We build up slowly with simple questions and have an answer reformulated when necessary. The speaker usually looks at the interviewer rather than directly into the lens. A familiar location can provide extra comfort.",
      },
      {
        question:
          "Are we allowed to substantively adjust a customer's statement?",
        answer:
          "Editing can shorten repetition and organize answers logically, but it should not change the intended meaning. We identify ambiguities and follow the agreed review. The customer must be able to recognize themselves in the final testimonial.",
      },
      {
        question: "Which additional images suit a testimonial?",
        answer:
          "This could be product use, a completed project, relevant spaces, consultation or details that clarify the statement. We only choose images that really belong to the case and avoid generic scenes that suggest more than the customer tells.",
      },
      {
        question: "Can one customer interview produce multiple short videos?",
        answer:
          "Yes, when the conversation contains multiple independent themes and those sections are planned in advance. For example, we can create a main story and short answers around choice, approach or experience, each with sufficient context.",
      },
    ],
    relatedServices: [
      "bedrijfsvideo",
      "realisatiefotografie",
      "social-media-video",
      "promovideo",
      "webdesign",
    ],
    seo: {
      title: "Have a testimonial video made in Limburg | VisualVibe",
      description:
        "Have a testimonial video made with a natural customer interview, relevant context and careful editing for your website, sales and social media.",
      keywords: [
        "testimonial video",
        "have a testimonial video made",
        "customer video",
        "customer testimonial video",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "testimonial video",
        supportingKeywords: [
          "have a testimonial video made",
          "customer video",
          "film customer testimonial",
          "case video",
        ],
        type: "commercial",
      },
      overview: {
        title: "A testimonial video in the words of your customer",
        paragraphs: [
          "A testimonial video is credible when the story remains specific. Why did the customer seek help, what consideration was involved and how was the collaboration experienced? General superlatives mean little without context. That is why we use open questions and look for concrete moments or examples that the customer finds relevant.",
          "We don't prescribe a eulogy. The preliminary discussion helps organize the content and ensures that the location and additional images really fit the case. During editing we create a clear line without taking statements out of context. Titles can provide necessary context, while images of use, project or environment show what the speaker is talking about.",
        ],
        highlights: [
          "Open questions without prescribed answers",
          "Supporting image from the real case",
          "Substantive review while retaining meaning",
        ],
      },
      outcomes: {
        title: "A customer story that makes questions recognizable",
        intro:
          "The testimonial gives prospects context from the perspective of someone who has experienced the collaboration.",
        items: [
          {
            title: "A human reference point",
            description:
              "A true speaker brings together doubts, choice and experience in plain language.",
          },
          {
            title: "More concrete case context",
            description:
              "Project images and details make visible what the testimony relates to.",
          },
          {
            title: "Deployable evidence content",
            description:
              "Main video and thematic clips support case pages, presentations, and social posts.",
          },
        ],
      },
      idealFor: {
        title: "For organizations with relevant customer stories",
        intro:
          "A testimonial is appropriate when the experience substantively matches questions from future customers.",
        items: [
          {
            title: "Service-based SMEs",
            description:
              "Have a customer explain the process and collaboration when the offer is not tangible.",
          },
          {
            title: "Construction and project companies",
            description:
              "Connect the client's experience with images of the realized context.",
          },
          {
            title: "B2B solutions",
            description:
              "Make consideration, implementation and daily use understandable through the person involved.",
          },
        ],
      },
      deliverables: {
        title: "A complete customer story and targeted fragments",
        intro:
          "The editing setup follows from the subject, available context images and agreed channels.",
        items: [
          {
            title: "Edited testimonial",
            description:
              "A completed interview story with color, sound, titles and supporting images.",
          },
          {
            title: "Subtitled version",
            description:
              "Readable display of the spoken testimony for web and mobile channels.",
          },
          {
            title: "Thematic fragments",
            description:
              "Short answers around pre-selected questions when sufficient independent context is present.",
          },
          {
            title: "Channel-oriented exports",
            description:
              "Files in the ratios and resolutions provided for in production.",
          },
        ],
      },
      pricing: {
        title: "What choices determine the price of a testimonial video?",
        paragraphs: [
          "Production depends on the number of customer stories, locations and content components. One conversation with available project images differs from a case for which we record the interview, product use, working environment and multiple stakeholders separately.",
          "Preliminary discussion, travel and planning with the customer, sound and lighting setup, editing, subtitling and fragments count. We determine responsibilities for contact, permission and content review in advance, so that the quotation is also organizationally clear.",
        ],
        factors: [
          "Number of customers or speakers",
          "Preliminary discussion and substantive preparation",
          "Number of locations",
          "Available or new context images",
          "Inclusion of product or project",
          "Interview and audio setup",
          "Assembly and content review",
          "Subtitles",
          "Number of short fragments and formats",
        ],
      },
      whyVisualVibe: {
        title: "Why testimonial video with VisualVibe",
        intro:
          "We monitor both the calmness of the conversation and the substantive honesty of the final editing.",
        items: [
          {
            title: "Prepared without saying",
            description:
              "Themes and questions provide direction while answers remain the customer's own.",
          },
          {
            title: "Context that's right",
            description:
              "Additional images come from the real case and clarify what is being said.",
          },
          {
            title: "Careful meaning",
            description:
              "We assemble compactly but do not change a statement to suggest a stronger claim.",
          },
        ],
      },
      regional: {
        title: "Customer videos in Limburg and surrounding regions",
        description:
          "We record testimonials with customers and companies in Limburg, Flanders, Antwerp and the Dutch province of Limburg, in a quiet location that suits the content of the experience.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Give a relevant customer story the right space",
        description:
          "Tell us which case and customer questions are central. We help prepare interviews, context images and review carefully and credibly.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },

  "podcast-video": {
    intro:
      "Podcast video makes a conversation visible to YouTube, your website, and short social clips. We coordinate set, lighting, camera angles, microphones and episode structure, record the conversation with multiple frames and edit a quiet main episode plus pre-selected clips.",
    excerpt:
      "A polished multi-camera recording of your podcast, with synchronous audio, full episode and shareable video fragments.",
    process: [
      {
        title: "Determine format and visual set",
        description:
          "We discuss guests, form of conversation, publication channels and desired appearance. We then choose background, seating positions, brand details and camera frames that can be recognizable across episodes.",
      },
      {
        title: "Preparing rundown and technique",
        description:
          "A practical rundown organizes the intro, topics, possible sections and conclusion. We plan cameras, microphones, lighting, monitoring and space for host, guest and production.",
      },
      {
        title: "Record the conversation synchronously",
        description:
          "During the recording we monitor image, audio and continuity without constantly interrupting the conversation. We note strong moments and record agreed intros or additions separately.",
      },
      {
        title: "Install delivery and clips carefully",
        description:
          "We synchronize cameras and audio sources, choose well-timed camera cuts and refine the colour, sound and titles. We then create the agreed short snippets and exports.",
      },
    ],
    faqs: [
      {
        question: "How many cameras are needed for a podcast video?",
        answer:
          "That depends on the number of participants, the space and the desired mounting style. An overview and separate frames provide flexibility, but each additional position requires space, light, monitoring and assembly. We advise based on format.",
      },
      {
        question: "Can we record podcast audio and video at the same time?",
        answer:
          "Yes. We build one coordinated registration where the audio can also be used independently. The precise audio mix, file format and any separate audio version are determined in advance based on your publication flow.",
      },
      {
        question: "Should a video podcast be recorded in a studio?",
        answer:
          "Not necessary. An office, showroom or other location may be a stronger fit, as long as noise, space, flow, background and interruptions are manageable. We assess those factors before the lineup is finalized.",
      },
      {
        question: "How are short podcast clips chosen?",
        answer:
          "We can determine categories or candidate moments in advance and record time codes during recording. In montage we look for fragments with an independent question, a clear core and sufficient context, not just a separate striking sentence.",
      },
      {
        question: "Can titles, intro and sponsor mention be added?",
        answer:
          "Yes, when content, design and placement have been agreed in advance. Provide final names, logos and texts on time. We keep the intro functional and ensure that entries fit within the main episode and any short versions.",
      },
    ],
    relatedServices: [
      "videopodcast",
      "podcast-opname",
      "bedrijfspodcast",
      "social-media-video",
      "brandingfotografie",
    ],
    seo: {
      title: "Have a podcast video recorded in Limburg | VisualVibe",
      description:
        "Have podcast video recorded with multiple cameras, polished audio and recognizable set, including an edited episode and pre-selected social clips.",
      keywords: [
        "podcast video",
        "record podcast video",
        "have a video podcast made",
        "multi-camera podcast",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "podcast video",
        supportingKeywords: [
          "record podcast video",
          "video podcast",
          "multi-camera podcast",
          "have podcast clips made",
        ],
        type: "commercial",
      },
      overview: {
        title: "Podcast video that visually supports the conversation",
        paragraphs: [
          "Podcast video requires a different approach than simply placing a camera next to a microphone. The viewer wants to be able to follow reactions, turns and non-verbal moments, while the participants have a natural conversation. Camera angles, viewing directions and light must therefore be designed together and should not make the space unnecessarily uncomfortable.",
          "We build a recognizable set around your format and test audio and image as one system. During registration, we monitor continuity and mark fragments with potential for shorter content. In the editing, camera changes remain functional and the conversation takes priority over effect. Titles, subtitles and clips are tailored to YouTube, website or social distribution.",
        ],
        highlights: [
          "Fine-tuned multi-camera and audio recording",
          "Recognizable set for recurring episodes",
          "Calm editing around the conversation",
          "Independent clips with sufficient context",
        ],
      },
      outcomes: {
        title: "One conversation with multiple publication options",
        intro:
          "The video registration makes your long episode visible and provides targeted inputs for short content.",
        items: [
          {
            title: "More human nuance",
            description:
              "Gaze, reaction and body language add meaning to what listeners only hear.",
          },
          {
            title: "A recognizable program",
            description:
              "Fixed set, framing and titles build visual continuity between episodes.",
          },
          {
            title: "Targeted short snippets",
            description:
              "Independent passages lead viewers from social channels to the full conversation.",
          },
        ],
      },
      idealFor: {
        title: "For conversations that can also be viewed",
        intro:
          "Podcast video fits formats in which personality, demonstration or interaction adds visual value.",
        items: [
          {
            title: "Expert and knowledge discussions",
            description:
              "Give host and guest a face and share compact content fragments.",
          },
          {
            title: "Business podcasts",
            description:
              "Build a recognizable series around sector, culture, customers or internal expertise.",
          },
          {
            title: "Panel and round table formats",
            description:
              "Make reactions and turn changes clear with planned camera angles.",
          },
          {
            title: "Product or demo calls",
            description:
              "Add relevant actions or objects when audio alone is not enough.",
          },
        ],
      },
      deliverables: {
        title: "A full video episode with derivative content",
        intro:
          "The delivery is organized around your publication platform and recurring format.",
        items: [
          {
            title: "Edited main episode",
            description:
              "Synchronized camera changes, finished sound, color and agreed content corrections.",
          },
          {
            title: "Program titles",
            description:
              "Intro, name cards, subject and end card in a recognizable graphic line.",
          },
          {
            title: "Social video clips",
            description:
              "Pre-arranged fragments with an independent opening and context.",
          },
          {
            title: "Subtitled clip versions",
            description:
              "Burned-in subtitles for short mobile publications where provided.",
          },
          {
            title: "Platform exports",
            description:
              "Files in agreed resolution and ratio for video and social channels.",
          },
          {
            title: "Audio file",
            description:
              "An agreed audio export when it is part of the combined workflow.",
          },
        ],
      },
      pricing: {
        title: "What factors determine the price of podcast video?",
        paragraphs: [
          "The number of participants and cameras helps determine how large the set, lighting and audio plan will be. A fixed two-person setup differs from changing panels, demonstrations or recordings at a different location each time. The extent to which a set is designed also plays a role.",
          "In post-production, length, number of camera changes, audio editing, graphics, subtitles and number of clips all play a role. For a recurring series, we can establish a fixed technical and visual working method, while topics and guests continue to differ per episode.",
        ],
        factors: [
          "Number of participants",
          "Number of camera and audio sources",
          "Location or set construction",
          "Light and sound conditions",
          "Length of recording",
          "Installation of camera changes",
          "Audio mix and corrections",
          "Graphic design",
          "Number of clips and subtitles",
        ],
      },
      whyVisualVibe: {
        title: "Why record podcast video with VisualVibe",
        intro:
          "We design image and sound as one registration and keep the natural conversation dynamics central.",
        items: [
          {
            title: "Technology surrounding the format",
            description:
              "Cameras, microphones, set and lights follow participants and publication plan.",
          },
          {
            title: "Attention to conversation",
            description:
              "Functional camera changes support responses without disturbing the content.",
          },
          {
            title: "Long and short content connected",
            description:
              "Clips are chosen as comprehensible entry points to the full episode.",
          },
        ],
      },
      regional: {
        title: "Record podcast video in Limburg and nearby regions",
        description:
          "We build podcast sets for organizations in Limburg, Flanders, Antwerp and the Dutch province of Limburg, in a suitable business space or at a chosen filming location.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Give your podcast a recognizable visual format",
        description:
          "Share your conversation format, number of participants, location and channels. We develop a suitable set, registration and delivery for episodes and clips.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },

  nieuwsreportage: {
    intro:
      "At VisualVibe, a news-style corporate video is a recognisable communication piece commissioned by your organisation, not independent journalism. We structure your business update around facts, interviews and relevant contextual footage, while making the source and purpose clear in the finished video.",
    excerpt:
      "A clearly edited branded corporate report about your own news, with transparent sender, interviews and factual context.",
    process: [
      {
        title: "Make news value and sender explicit",
        description:
          "We determine which business news you want to explain, for which audience and via which owned or paid channel. We also record how the client and commercial context are clearly disclosed.",
      },
      {
        title: "Collect facts, sources and reporting format",
        description:
          "Your organization provides verifiable facts, names, spokespersons and background. We build an editorial structure with interview questions, scene order, text frames and a concrete shot list.",
      },
      {
        title: "Record interviews and business context",
        description:
          "We film spokespersons, people involved, location, actions and relevant details. The shooting style may appear reportage, but we do not stage events as if they were spontaneous news.",
      },
      {
        title: "Branded and actually transparent installation",
        description:
          "We organize statements and context, provide titles, sound, color and subtitles and provide space for fact checking. Branding and clientship remain clearly visible in the image or surrounding publication.",
      },
    ],
    faqs: [
      {
        question:
          "Is corporate branded video report the same as independent journalism?",
        answer:
          "No. VisualVibe works on behalf of your organization and the video serves corporate communication. We do use clear reporting formats such as interviews and contextual images, but do not claim independent editorial staff or journalistic neutrality.",
      },
      {
        question: "How do we make it clear that the report is branded content?",
        answer:
          "We can visibly include sender, brand, client or formulations such as corporate report in the title, intro, end card and publication context. We tailor the precise mention to the channel and campaign, without hiding the origin.",
      },
      {
        question:
          "Which topics are suitable for a branded branded video report?",
        answer:
          "Think of an opening, project milestone, innovation, collaboration, investment or initiative about which your organization can provide factual context. The topic must be relevant to your audience and provide sufficient images and involved voices.",
      },
      {
        question: "Do you check all the facts in the corporate report?",
        answer:
          "Your organization remains responsible for the facts, names, figures and claims provided. We identify editorial ambiguities and organize a review, but do not function as an independent fact-checking editor. Substantiate sensitive claims before recording.",
      },
      {
        question: "Can the video be sent to newsrooms?",
        answer:
          "You can share material according to your own press approach, but an editor decides whether and how to use it. We do not present the video as editorial reporting from an external medium and do not promise publication or press attention.",
      },
    ],
    relatedServices: [
      "bedrijfsvideo",
      "eventfotografie",
      "testimonial-video",
      "social-media-video",
      "bedrijfsfotografie",
    ],
    seo: {
      title: "Branded video reporting for companies in Limburg | VisualVibe",
      description:
        "Branded video reporting as transparent branded business reporting, with interviews, factual context and recognizable sender for your own communication channels.",
      keywords: [
        "branded video report",
        "branded corporate reporting",
        "business news video",
        "video reporting company",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "branded video report",
        supportingKeywords: [
          "branded corporate reporting",
          "business news video",
          "video report",
          "have a report made",
        ],
        type: "mixed",
      },
      overview: {
        title: "A branded video report as transparent business communication",
        paragraphs: [
          "A branded video report can make business news accessible by combining a clear reason, involved voices and images of the context. At VisualVibe it is emphatically a branded business report. The client determines the communication goal and is given a review moment. Therefore, the video should not be presented as independent reporting by a journalistic editorial team.",
          "Transparency does not have to stand in the way of strong reporting. We build the story around verifiable information, ask open and targeted interview questions and film the place, project or action being discussed. Titles correctly name people and positions. During editing, we separate facts, quotes and promotional messages as clearly as possible and the sender remains recognizable.",
        ],
        highlights: [
          "Clearly as a branded corporate report",
          "Structure around facts and involved voices",
          "No claim to journalistic independence",
          "Recognizable sender and review process",
        ],
      },
      outcomes: {
        title: "Company news with images, voice and clear context",
        intro:
          "The video helps your own audience understand what is happening and who is providing the information.",
        items: [
          {
            title: "An accessible explanation",
            description:
              "Cause, event and meaning are brought together in a compact order.",
          },
          {
            title: "People involved in the picture",
            description:
              "Spokespeople and project stakeholders clearly explain their role and perspective.",
          },
          {
            title: "Transparent branded content",
            description:
              "The design and publication context make it clear that the report is business communication.",
          },
        ],
      },
      idealFor: {
        title: "For business news that deserves more context",
        intro:
          "The form fits specific events or developments that your organization wants to explain.",
        items: [
          {
            title: "Openings and milestones",
            description:
              "Bring the reason, stakeholders and location together in a clear company message.",
          },
          {
            title: "Projects and collaborations",
            description:
              "Let different parties explain their own roles within a shared context.",
          },
          {
            title: "Innovation and investments",
            description:
              "Make a technical subject understandable with explanations, demonstrations and relevant images.",
          },
          {
            title: "Initiatives with local context",
            description:
              "Show what your organization organizes and for which audience, with a clear sender.",
          },
        ],
      },
      deliverables: {
        title: "A recognizable branded reporting package",
        intro:
          "Content, branding and publishing channels are explicitly captured before script and recording.",
        items: [
          {
            title: "Edited corporate report",
            description:
              "A full video with interviews, context images, color and sound finishing.",
          },
          {
            title: "Transparent title cards",
            description:
              "Subject, persons, functions and sender according to verified information.",
          },
          {
            title: "Subtitled version",
            description:
              "A readable montage for your own web and social channels when provided.",
          },
          {
            title: "Short news clip",
            description:
              "A compact version with sufficient context and a recognizable client.",
          },
          {
            title: "Channel-oriented exports",
            description:
              "Agreed aspect ratios and resolutions without concealing branded origin.",
          },
        ],
      },
      pricing: {
        title: "What determines the price of a branded video report?",
        paragraphs: [
          "The size follows from the number of interviews, locations, events and required background images. A conversation about a finished project requires a different production than an opening with a program, different partners and a technical demonstration.",
          "Editorial preparation, script or voice-over, name and fact titles, subtitles, review rounds and short versions also play a role. We record in advance who provides and approves information and which transparent branding appears in each export.",
        ],
        factors: [
          "Topic and editorial structure",
          "Number of spokespersons",
          "Number of locations or event moments",
          "Required context and detail images",
          "Script or voice-over",
          "Titles and factual information",
          "Subtitles",
          "Review and corrections",
          "Number of lengths and sizes",
        ],
      },
      whyVisualVibe: {
        title: "Why a branded report with VisualVibe",
        intro:
          "We use a clear reporting language while the client structure, source of facts and communication objective remain transparent.",
        items: [
          {
            title: "Clear positioning",
            description:
              "We call the product a branded corporate report and do not suggest an independent newsroom.",
          },
          {
            title: "Factual structure",
            description:
              "Interview questions, shot list and titles are built around information that your organization provides and checks.",
          },
          {
            title: "Strong context images",
            description:
              "Location, process and people involved make the explanation visually concrete without staging events as news.",
          },
        ],
      },
      regional: {
        title: "Branded corporate reports in Limburg and the surrounding area",
        description:
          "We produce corporate reports in Limburg, Flanders, Antwerp and the Dutch province of Limburg, at the location where the news takes place and always with a clearly identified commercial source.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Give your business news clear, transparent context",
        description:
          "Share topic, facts, people involved and publication channels. We develop a branded report design in which the sender and intention remain recognizable.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
} satisfies Record<VideografieSlug, SubserviceEditorial>;

export const englishVideographyEditorial: Record<
  string,
  EnglishServiceLocaleRecord
> = {
  bedrijfsvideo: {
    displaySlug: "corporate-video",
    title: "Corporate video",
    summary: localizedEditorial["bedrijfsvideo"].excerpt,
    body: localizedEditorial["bedrijfsvideo"].intro,
    benefits: localizedEditorial["bedrijfsvideo"].content.overview.highlights,
    process: localizedEditorial["bedrijfsvideo"].process,
    faqs: localizedEditorial["bedrijfsvideo"].faqs,
    cta: localizedEditorial["bedrijfsvideo"].content.cta,
    seo: localizedEditorial["bedrijfsvideo"].seo,
    imageAlt: "Corporate video production by VisualVibe in Limburg",
    internalLinks: localizedEditorial["bedrijfsvideo"].relatedServices.map(
      (href) => ({
        href: `/en/services/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["bedrijfsvideo"],
  },
  promovideo: {
    displaySlug: "promotional-video",
    title: "Promotional video",
    summary: localizedEditorial["promovideo"].excerpt,
    body: localizedEditorial["promovideo"].intro,
    benefits: localizedEditorial["promovideo"].content.overview.highlights,
    process: localizedEditorial["promovideo"].process,
    faqs: localizedEditorial["promovideo"].faqs,
    cta: localizedEditorial["promovideo"].content.cta,
    seo: localizedEditorial["promovideo"].seo,
    imageAlt: "Promotional video production by VisualVibe in Limburg",
    internalLinks: localizedEditorial["promovideo"].relatedServices.map(
      (href) => ({
        href: `/en/services/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["promovideo"],
  },
  "social-media-video": {
    displaySlug: "social-media-video",
    title: "Social media video",
    summary: localizedEditorial["social-media-video"].excerpt,
    body: localizedEditorial["social-media-video"].intro,
    benefits:
      localizedEditorial["social-media-video"].content.overview.highlights,
    process: localizedEditorial["social-media-video"].process,
    faqs: localizedEditorial["social-media-video"].faqs,
    cta: localizedEditorial["social-media-video"].content.cta,
    seo: localizedEditorial["social-media-video"].seo,
    imageAlt: "Social media video production by VisualVibe in Limburg",
    internalLinks: localizedEditorial["social-media-video"].relatedServices.map(
      (href) => ({
        href: `/en/services/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["social-media-video"],
  },
  "event-aftermovie": {
    displaySlug: "event-aftermovie",
    title: "Event aftermovie",
    summary: localizedEditorial["event-aftermovie"].excerpt,
    body: localizedEditorial["event-aftermovie"].intro,
    benefits:
      localizedEditorial["event-aftermovie"].content.overview.highlights,
    process: localizedEditorial["event-aftermovie"].process,
    faqs: localizedEditorial["event-aftermovie"].faqs,
    cta: localizedEditorial["event-aftermovie"].content.cta,
    seo: localizedEditorial["event-aftermovie"].seo,
    imageAlt: "Event aftermovie production by VisualVibe in Limburg",
    internalLinks: localizedEditorial["event-aftermovie"].relatedServices.map(
      (href) => ({
        href: `/en/services/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["event-aftermovie"],
  },
  wervingsvideo: {
    displaySlug: "recruitment-video",
    title: "Recruitment video",
    summary: localizedEditorial["wervingsvideo"].excerpt,
    body: localizedEditorial["wervingsvideo"].intro,
    benefits: localizedEditorial["wervingsvideo"].content.overview.highlights,
    process: localizedEditorial["wervingsvideo"].process,
    faqs: localizedEditorial["wervingsvideo"].faqs,
    cta: localizedEditorial["wervingsvideo"].content.cta,
    seo: localizedEditorial["wervingsvideo"].seo,
    imageAlt: "Recruitment video production by VisualVibe in Limburg",
    internalLinks: localizedEditorial["wervingsvideo"].relatedServices.map(
      (href) => ({
        href: `/en/services/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["wervingsvideo"],
  },
  "testimonial-video": {
    displaySlug: "testimonial-video",
    title: "Customer testimonial video",
    summary: localizedEditorial["testimonial-video"].excerpt,
    body: localizedEditorial["testimonial-video"].intro,
    benefits:
      localizedEditorial["testimonial-video"].content.overview.highlights,
    process: localizedEditorial["testimonial-video"].process,
    faqs: localizedEditorial["testimonial-video"].faqs,
    cta: localizedEditorial["testimonial-video"].content.cta,
    seo: localizedEditorial["testimonial-video"].seo,
    imageAlt: "Customer testimonial video by VisualVibe in Limburg",
    internalLinks: localizedEditorial["testimonial-video"].relatedServices.map(
      (href) => ({
        href: `/en/services/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["testimonial-video"],
  },
  "podcast-video": {
    displaySlug: "podcast-video",
    title: "Video podcast",
    summary: localizedEditorial["podcast-video"].excerpt,
    body: localizedEditorial["podcast-video"].intro,
    benefits: localizedEditorial["podcast-video"].content.overview.highlights,
    process: localizedEditorial["podcast-video"].process,
    faqs: localizedEditorial["podcast-video"].faqs,
    cta: localizedEditorial["podcast-video"].content.cta,
    seo: localizedEditorial["podcast-video"].seo,
    imageAlt: "Video podcast production by VisualVibe in Limburg",
    internalLinks: localizedEditorial["podcast-video"].relatedServices.map(
      (href) => ({
        href: `/en/services/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["podcast-video"],
  },
  nieuwsreportage: {
    displaySlug: "video-news-report",
    title: "Branded video report",
    summary: localizedEditorial["nieuwsreportage"].excerpt,
    body: localizedEditorial["nieuwsreportage"].intro,
    benefits: localizedEditorial["nieuwsreportage"].content.overview.highlights,
    process: localizedEditorial["nieuwsreportage"].process,
    faqs: localizedEditorial["nieuwsreportage"].faqs,
    cta: localizedEditorial["nieuwsreportage"].content.cta,
    seo: localizedEditorial["nieuwsreportage"].seo,
    imageAlt: "Branded corporate video report by VisualVibe in Limburg",
    internalLinks: localizedEditorial["nieuwsreportage"].relatedServices.map(
      (href) => ({
        href: `/en/services/${href}/`,
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["nieuwsreportage"],
  },
};
