import type { SubserviceEditorial } from "@/types";
import type { EnglishServiceLocaleRecord } from "../services";
import { getEnglishServicePublicHref } from "../servicePublicRoutes";

type PodcastingEditorialSlug =
  | "bedrijfspodcast"
  | "videopodcast"
  | "podcast-opname"
  | "podcast-traject"
  | "podcast-voor-experts";

const localizedEditorial = {
  bedrijfspodcast: {
    intro:
      "A business podcast gives your SME a format to share knowledge and conversations with employees or guests. VisualVibe helps define the business podcast and handles agreed recording and editing. We determine who the series is for and what gives listeners a reason to return.",
    excerpt:
      "A distinctive audio series for your company, with a workable format, professional recording and editing that supports content and brand voice.",
    process: [
      {
        title: "Audience and editorial line",
        description:
          "We determine listener, goal, themes and available internal knowledge. This creates a repeatable format your team can prepare for future episodes.",
      },
      {
        title: "Preparing the episode and guests",
        description:
          "We create a script with subject, questions, timing, roles and practical agreements, without fixing the conversation word for word.",
      },
      {
        title: "Professional audio recording",
        description:
          "On location or in a suitable setup, we monitor microphone placement, levels and a quiet conversation environment, so that speakers focus on content.",
      },
      {
        title: "Editing, review and delivery",
        description:
          "We clean up audio, structure the conversation and process the agreed intro or music. After the anticipated feedback, we deliver files in agreed formats.",
      },
    ],
    faqs: [
      {
        question: "What makes a podcast a business podcast?",
        answer:
          "The organisation is the clear source, and the topics and goals relate to its work. This could be an interview series with subject experts, an internal conversation about developments or a series for customers. The format must remain independently interesting and not feel like a long commercial.",
      },
      {
        question: "Should a corporate podcast consist of multiple episodes?",
        answer:
          "Not necessarily, but the name podcast often suggests a repeatable format. A limited series around one theme can be equally useful. We test in advance whether you have enough relevant topics, guests and internal time to sustain the chosen frequency.",
      },
      {
        question: "Do you record the podcast on location?",
        answer:
          "This is possible if the room is acoustically and practically suitable. We assess background noise, reverberation, power, setup and accessibility. A quiet studio-like environment offers more control; a business location can offer a useful atmosphere and convenience.",
      },
      {
        question: "Can we also film our business podcast?",
        answer:
          "Yes, it will be a video podcast production with extra attention to light, decor, camera angles and visual editing. That scope differs from an audio podcast. We determine in advance whether full video or just some supporting clips will really help your channels.",
      },
      {
        question: "Does VisualVibe publish the episodes on podcast platforms?",
        answer:
          "Publishing and hosting are not automatically included. We can deliver files ready for publication or include distribution when access, accounts, hosting choice and responsibilities are included in the quotation. External costs remain visible.",
      },
    ],
    relatedServices: [
      "podcast-traject",
      "podcast-opname",
      "videopodcast",
      "podcast-voor-experts",
      "brandingfotografie",
    ],
    seo: {
      title: "Business podcast production in Limburg | VisualVibe",
      description:
        "Planning a business podcast for your SME? VisualVibe helps with format, preparation, professional audio recording, editing and clear delivery.",
      keywords: [
        "business podcast",
        "business podcast production",
        "podcast for companies",
        "business podcast",
        "business podcast Limburg",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "business podcast",
        supportingKeywords: [
          "business podcast production",
          "podcast for companies",
          "business podcast",
          "business podcast Limburg",
        ],
        type: "commercial",
      },
      overview: {
        title: "A business podcast with a sustainable content format",
        paragraphs: [
          "A good series starts with a promise to listen. We collect questions from customers, employees or partners and determine who speaks credibly about them. We then choose a guided interview, conversation with fixed voices or thematic series. Length and frequency follow from content and available preparation.",
          "Audio requires clarity in voice, structure and sound quality. We prepare openings and closures and remove during installation what hinders the conversation. The delivery is delivered according to scope; hosting, channel management and publishing are agreed separately.",
        ],
        highlights: [
          "Format based on audience and available expertise",
          "Script that provides direction without reading aloud",
          "Clear speech and substantive audio editing",
          "Publication files and channel choices clearly defined",
        ],
      },
      outcomes: {
        title: "What makes for a well-thought-out business podcast",
        intro:
          "You get a repeatable way to share complex knowledge in human conversation.",
        items: [
          {
            title: "Recognizable editorial line",
            description:
              "Episodes cover different topics within one clear framework for the same intended listener.",
          },
          {
            title: "Usable long form",
            description:
              "Experts are given room for explanation and nuance that would be difficult to fit into a short advertisement or social post.",
          },
          {
            title: "More efficient recording preparation",
            description:
              "A fixed format, roles and script template make subsequent conversations more predictable for your internal team.",
          },
        ],
      },
      idealFor: {
        title: "For which organizations is a business podcast suitable?",
        intro:
          "The medium works when real knowledge, stories or conversation partners are available and your audience likes to listen.",
        items: [
          {
            title: "Knowledge-driven SMEs",
            description:
              "Your employees can explain customer questions, professional developments and choices without sharing confidential information.",
          },
          {
            title: "Employers with internal stories",
            description:
              "Teams, roles and company culture can be given a nuanced voice for relevant audiences through conversations.",
          },
          {
            title: "Organizations with a partner network",
            description:
              "Guests bring additional perspectives and make the series more than a one-sided business presentation.",
          },
        ],
      },
      deliverables: {
        title: "What can a corporate podcast production include?",
        intro:
          "The quotation specifies which editorial, technical and publication components are provided for each episode or series.",
        items: [
          {
            title: "Format and delivery framework",
            description:
              "Audience, themes, roles, length and repeatable structure are practically recorded.",
          },
          {
            title: "Script and recording schedule",
            description:
              "Questions, timing, guests, location and technical requirements come together in one preparation.",
          },
          {
            title: "Multi-track audio recording",
            description:
              "Speakers are recorded individually where setup allows, with levels and environment controlled.",
          },
          {
            title: "Editing and audio files",
            description:
              "The agreed edit, revision and exports are delivered in formats that match the chosen follow-up.",
          },
        ],
      },
      pricing: {
        title: "What determines the investment in a business podcast?",
        paragraphs: [
          "The scope depends on episodes, length, voices and editorial guidance. A series with guest planning and extensive editing requires more preparation than one conversation with a fixed format.",
          "Location, music, additional video and publishing support also influence the work. After the intake you will receive a quotation with clear delivery components. Hosting, paid music licenses and external platform costs are only included when explicitly agreed.",
        ],
        factors: [
          "Number and intended length of episodes",
          "Format development and editorial preparation",
          "Number of speakers and guest planning",
          "Studio setup or location recording",
          "The level of editing and number of revision rounds",
          "Intro, music and additional audio design",
          "Video, clips or photography as an extension",
          "Publishing support and platform choice",
        ],
      },
      whyVisualVibe: {
        title: "Why a business podcast with VisualVibe?",
        intro:
          "We connect editorial choices with production, so that technology supports the conversation instead of dominates it.",
        items: [
          {
            title: "Format before equipment",
            description:
              "We first determine who wants to listen and why, before choosing microphones and recording location.",
          },
          {
            title: "Audio and video under one roof",
            description:
              "When visuals make sense, the same preparation can be translated into a full-fledged video podcast scope.",
          },
          {
            title: "Clear delivery limit",
            description:
              "Files, revision, hosting and publishing tasks are identified in advance, so that responsibilities remain clear after installation.",
          },
        ],
      },
      regional: {
        title: "Record a business podcast from Limburg",
        description:
          "VisualVibe produces business podcasts for SMEs in Limburg, Flanders, Antwerp and the Dutch province of Limburg, in a suitable setup or at a pre-assessed location.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Test your idea for a business podcast",
        description:
          "Share your audience, themes and desired series. We advise on format, recording format and delivery and prepare a specific quotation.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  videopodcast: {
    intro:
      "A video podcast adds a camera image to a substantive podcast conversation. VisualVibe coordinates decor, lighting, microphones and camera angles so that the video podcast can be used as a full episode and as an audio version. Short fragments can be edited as a separate extension, but the production first starts from a good conversation, not from random social clips.",
    excerpt:
      "A professionally recorded video podcast with intelligible sound, consistent camera images and exports for the agreed viewing and listening channels.",
    process: [
      {
        title: "Determine format and image setup",
        description:
          "We discuss the conversation, number of participants, location, decor and desired end formats and translate this into a feasible camera and lighting plan.",
      },
      {
        title: "Prepare conversation and set",
        description:
          "Script, seating, microphones, branding and practical timing are coordinated with host and guests before the recording session.",
      },
      {
        title: "Audio and multi-camera recording",
        description:
          "We record voices and camera angles synchronously and monitor technology, continuity and a natural presentation during the conversation.",
      },
      {
        title: "Edit video and deliver versions",
        description:
          "We select camera changes, provide sound and image and process agreed design. After revision, we deliver the recorded full and short versions.",
      },
    ],
    faqs: [
      {
        question:
          "What is the difference between a video podcast and podcast video?",
        answer:
          "A video podcast is typically a recurring conversation produced for viewing and listening at the same time. Podcast video can more broadly refer to a separate video recording of a podcast. In both cases, we determine in advance whether audio should also remain independently comprehensible.",
      },
      {
        question: "How many cameras are needed for a video podcast?",
        answer:
          "That depends on participants, space and desired installation. An overall image and individual points of view provide more editing options, but require additional technology and data processing. We only choose camera angles that make the conversation clearer and visually calmer.",
      },
      {
        question: "Can a video podcast be recorded in our office?",
        answer:
          "Yes, when space, sound, light and power supply are suitable. We assess reverberation, background noise, space for cameras and what may be visible. Sometimes small adjustments are enough; sometimes a controlled location offers a better result.",
      },
      {
        question: "Are short clips for social media included?",
        answer:
          "Only when number, length, aspect ratio and subtitles are in the scope. Clips require substantive selection and your own editing. We also agree on who will take care of texts, publication and channel management; uploading is not automatically part of the recording.",
      },
      {
        question: "Will I also receive a separate audio version?",
        answer:
          "That can be foreseen. We then check whether visual references remain understandable to listeners and create an appropriate audio mix and export. Podcast hosting, feed management and distribution to platforms are only carried out when agreed separately.",
      },
    ],
    relatedServices: [
      "podcast-video",
      "podcast-opname",
      "bedrijfspodcast",
      "social-media-video",
      "brandingfotografie",
    ],
    seo: {
      title: "Have a video podcast recorded in Limburg | VisualVibe",
      description:
        "Want to record a video podcast? VisualVibe provides preparation, multi-camera, clear sound, editing and agreed versions for your business channels.",
      keywords: [
        "video podcast",
        "have a video podcast recorded",
        "podcast with video",
        "multi-camera podcast",
        "video podcast Limburg",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "video podcast",
        supportingKeywords: [
          "have a video podcast recorded",
          "podcast with video",
          "multi-camera podcast",
          "video podcast Limburg",
        ],
        type: "commercial",
      },
      overview: {
        title: "A video podcast that continues to work even without images",
        paragraphs: [
          "In a video podcast, facial expression, setting and interaction carry extra meaning. However, the content of the conversation must be strong enough to follow as audio. We therefore first prepare the subject and roles and then design the set. Camera angles, lighting and branding remain calm, so that viewers pay attention to the speakers.",
          "During editing we switch images based on who is speaking and what the conversation needs. Sound is given the same priority as video. The complete episode can be supplemented with agreed horizontal or vertical fragments. Which platform exports, subtitles, thumbnails or uploads are required is chosen in advance and not taken for granted.",
        ],
        highlights: [
          "Conversation format before the visual set",
          "Synchronous audio and multi-camera recording",
          "Editing for full episode and chosen clips",
          "Channel formats and publishing tasks predefined",
        ],
      },
      outcomes: {
        title: "What a professional video podcast delivers",
        intro:
          "One conversation can be viewed, listened to and reused in agreed versions.",
        items: [
          {
            title: "More non-verbal context",
            description:
              "Gaze, attitude and interaction make an interview more personal without replacing the content.",
          },
          {
            title: "Consistent series appearance",
            description:
              "Recurring framing, color and design make episodes recognizable as the same program.",
          },
          {
            title: "Targeted reuse",
            description:
              "Pre-selected clip types pick out key moments from the conversation without randomly cutting up the entire episode.",
          },
        ],
      },
      idealFor: {
        title: "When is a video podcast appropriate?",
        intro:
          "Video makes sense when faces, demonstrations or brand experiences add value and your team can handle the extra production.",
        items: [
          {
            title: "Conversations with recognizable experts",
            description:
              "Host and guests may be visible and build a recognizable presentation through a recurring conversation.",
          },
          {
            title: "SMEs with video as an important channel",
            description:
              "Your publishing plan really has room for longer episodes and select short video clips.",
          },
          {
            title: "Topics with visual explanations",
            description:
              "Product, diagram or demonstration helps the viewer, while the core is also explained verbally.",
          },
        ],
      },
      deliverables: {
        title: "What can be included in a video podcast?",
        intro:
          "We specify per production which full episode, audio export and additional clips you will receive.",
        items: [
          {
            title: "Visual and technical shooting plan",
            description:
              "Location, decor, branding, cameras, light, sound and final formats are coordinated.",
          },
          {
            title: "Multi-camera and audio recording",
            description:
              "The agreed positions and individual microphones are recorded synchronously.",
          },
          {
            title: "Full video montage",
            description:
              "Camera selection, sound, color and basic design form one finished episode with revision.",
          },
          {
            title: "Agreed exports and clips",
            description:
              "Files are provided in predetermined aspect ratios, lengths and technical sizes.",
          },
        ],
      },
      pricing: {
        title: "What determines the investment in a video podcast?",
        paragraphs: [
          "The number of cameras, participants and episodes determines a large part of recording and editing. Location, set construction, lighting, graphic design and desired audio version also influence the technical preparation.",
          "Short clips, subtitles and various channel exports are separate production tasks. After the briefing you will receive a quotation with quantities and revision agreements. Hosting, paid platform services and publishing are only budgeted if they are part of the demand.",
        ],
        factors: [
          "Number of episodes, speakers and cameras",
          "Shooting location, set and lighting setup",
          "Length and depth of the complete assembly",
          "Graphic intro, titles and brand assets",
          "Separate audio mix and podcast export",
          "Number of clips and aspect ratios",
          "Subtitling and revision rounds",
          "Publishing or channel support",
        ],
      },
      whyVisualVibe: {
        title: "Why a video podcast with VisualVibe?",
        intro:
          "Video, audio and content choices are brought together in one production plan.",
        items: [
          {
            title: "Sound remains full-fledged",
            description:
              "Microphones and audio editing are given priority, even when the episode is visually extensively recorded.",
          },
          {
            title: "Image with a function",
            description:
              "Cameras and decor support speakers and brand, without adding unnecessary angles or movement.",
          },
          {
            title: "Reuse planned in advance",
            description:
              "Clips and formats are chosen before recording so that presentation and framing match the end channels.",
          },
        ],
      },
      regional: {
        title: "Record video podcast from Limburg",
        description:
          "VisualVibe makes video podcasts for companies in Limburg, Flanders, Antwerp and the Dutch province of Limburg, at a suitable production location or a pre-checked company site.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Plan your video podcast as one production",
        description:
          "Tell us about format, participants, location and desired episode or clip formats. We create a concrete recording and editing scope.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  "podcast-opname": {
    intro:
      "A podcast recording is suitable when the format, host and subject have already been determined, but you need professional technology and technical guidance. VisualVibe handles the agreed audio setup, recording and editing for one episode or recording session. You monitor the editorial content; We ensure that voices are intelligible and files are recorded correctly.",
    excerpt:
      "A demarcated podcast recording for a prepared conversation, with professional microphones, technical guidance and agreed audio editing.",
    process: [
      {
        title: "Technical intake",
        description:
          "We check the number of speakers, duration, location, existing format and desired files and indicate which editorial preparation is your responsibility.",
      },
      {
        title: "Setup and sound check",
        description:
          "Microphones, headphones and recording channels are set up. Before starting we test voices, background noise and practical seating position.",
      },
      {
        title: "Register conversation",
        description:
          "During the recording we monitor levels and technique and mark any repetitions while host and guest conduct the conversation.",
      },
      {
        title: "Audio finishing and delivery",
        description:
          "We carry out the agreed basic or content-led editing, process feedback and deliver the agreed master and publication files.",
      },
    ],
    faqs: [
      {
        question: "What should I prepare for a podcast recording?",
        answer:
          "Provide a clear topic, host, guest information and a workable question plan. Participate names, pronunciation, desired duration and any fixed intro in good time. With a separate recording, we expect that content and guest planning are largely complete, unless editorial assistance has been agreed separately.",
      },
      {
        question: "Can the recording take place at my company?",
        answer:
          "This is possible after a practical assessment. A quiet room with little reverberation, sufficient space and limited interruptions is important. Air conditioning, traffic and hard surfaces are often audible. We advise whether adjustments are sufficient or whether another location is more sensible.",
      },
      {
        question: "Do I get the raw audio files?",
        answer:
          "We agree on this in advance. Raw traces require knowledge and software to process properly and are not the same as a usable episode. The standard delivery follows the quotation, for example an edited master, publication export or additional archive material.",
      },
      {
        question: "What does basic editing of a podcast entail?",
        answer:
          "Basic editing usually includes technical clean-up, level balancing and the removal of clearly agreed breaks. A strong substantive shortening, story editing, music selection or many rounds of correction requires more editing work and is therefore described separately.",
      },
      {
        question: "Can you publish the episode immediately?",
        answer:
          "Publication is not a standard part of a single recording. We can provide correct audio and metadata clues. Upload, hosting account, feed settings and distribution can be added when access and responsibility are clearly defined in advance.",
      },
    ],
    relatedServices: [
      "bedrijfspodcast",
      "videopodcast",
      "podcast-traject",
      "podcast-video",
    ],
    seo: {
      title: "Podcast recording for companies in Limburg | VisualVibe",
      description:
        "Need a podcast recording with professional sound? VisualVibe provides sound check, technical registration, agreed editing and correct audio files.",
      keywords: [
        "podcast recording",
        "record podcast Limburg",
        "professional podcast recording",
        "record podcast audio",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "podcast recording",
        supportingKeywords: [
          "record podcast Limburg",
          "professional podcast recording",
          "record podcast audio",
          "podcast recording on location",
        ],
        type: "commercial",
      },
      overview: {
        title:
          "A podcast recording for a conversation that has already been prepared",
        paragraphs: [
          "With this service the emphasis is on the recording session and technical post-production. We don't need to develop a full series identity or publishing plan first. We do ask in good time how many people are speaking, how the delivery is going and which final file you need. This way we provide the right microphones, tracks and time for a soundcheck and retakes.",
          "Good registration starts with space. We limit distracting sources and position speakers so that they can speak naturally without constantly monitoring microphone technology. Afterwards, the assembly that is stated in the scope follows. We do not automatically provide all possible versions or automatically publish them on external platforms.",
        ],
        highlights: [
          "Clear boundary between content and technical production",
          "Sound check and separate recording channels where appropriate",
          "Basic or content-led editing pre-selected",
          "File formats and publication tasks explicitly agreed",
        ],
      },
      outcomes: {
        title: "What a guided podcast recording delivers",
        intro:
          "You can concentrate on the conversation while recording quality and technical continuity are monitored.",
        items: [
          {
            title: "Intelligible individual voices",
            description:
              "Microphone choice and placement are adapted to speakers, room and conversation situation.",
          },
          {
            title: "Less technical distractions",
            description:
              "An operator monitors levels and recording so that the host does not have to operate equipment at the same time.",
          },
          {
            title: "Predictable delivery",
            description:
              "Mounting depth, revision and file formats are recorded before recording.",
          },
        ],
      },
      idealFor: {
        title: "When do you opt for a separate podcast recording?",
        intro:
          "The service is suitable when the editorial formula already works and you are mainly looking for professional production capacity.",
        items: [
          {
            title: "Existing podcast hosts",
            description:
              "You know the format and workflow, but want better recording or technical support for an episode.",
          },
          {
            title: "One-off expert discussions",
            description:
              "One substantive interview should be carefully recorded without setting up a complete series.",
          },
          {
            title: "Teams with their own publication management",
            description:
              "Your organization manages hosting and channels itself and mainly needs finished audio files.",
          },
        ],
      },
      deliverables: {
        title: "What can be included in the podcast recording?",
        intro:
          "The technical and assembly parts are chosen according to your existing workflow and desired final file.",
        items: [
          {
            title: "Admission checklist",
            description:
              "Speakers, location, duration, roles, equipment and assets to be delivered are confirmed in advance.",
          },
          {
            title: "Technical audio setup",
            description:
              "We provide agreed microphones, monitoring and registration for the planned conversation situation.",
          },
          {
            title: "Guided registration",
            description:
              "Levels and technical continuity are actively monitored during the session.",
          },
          {
            title: "Assembly and exports",
            description:
              "You will receive the provided edit and audio files after the agreed feedback round.",
          },
        ],
      },
      pricing: {
        title: "What determines the price of a podcast recording?",
        paragraphs: [
          "Duration, number of speakers and location determine the recording setup. Additional preparation is required for many guests, multiple rooms, remote participants or a location with difficult acoustics.",
          "The level of editing and delivery also count. A basic technical finish is different from a heavily shortened episode with music and multiple versions. The quotation mentions recording duration, editing, revision and files without hidden publishing tasks.",
        ],
        factors: [
          "Recording duration and number of episodes",
          "Number of speakers and recording channels",
          "Location and acoustic conditions",
          "Basic technical or content-led editing",
          "Intro, outro, music and supplied assets",
          "Number of revision rounds",
          "Desired masters and export formats",
          "Possible video or publication extension",
        ],
      },
      whyVisualVibe: {
        title: "Why schedule your podcast recording with VisualVibe?",
        intro:
          "We keep the separate production service practical and make it clear what preparatory work is expected of you.",
        items: [
          {
            title: "Focus on the conversation",
            description:
              "Host and guests do not need to monitor levels or recording equipment during the session.",
          },
          {
            title: "Assembly as required",
            description:
              "You choose in advance between technical cleaning and a deeper content-led edit.",
          },
          {
            title: "No unclear distribution promise",
            description:
              "Audio files, hosting and publication are separate responsibilities that are visible in the scope.",
          },
        ],
      },
      regional: {
        title: "Podcast recording on location from Limburg",
        description:
          "VisualVibe provides podcast recordings for companies in Limburg, Flanders, Antwerp and the Dutch province of Limburg, depending on location, acoustics and technical feasibility.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Reserve technology for your prepared conversation",
        description:
          "Provide date, location, number of speakers, duration and desired edit. We make a clear scope for recording, editing and files.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  "podcast-traject": {
    intro:
      "A podcast process guides your organization from an initial idea to a workable series of episodes. VisualVibe helps with positioning, format, editorial planning, recording and editing. Publication, hosting and promotional content are only added when they are defined in the process. This way your team knows which decisions, guests and input are needed per phase.",
    excerpt:
      "A guided podcast process in which concept, delivery planning, production, revision and chosen distribution tasks connect.",
    process: [
      {
        title: "Concept and feasibility",
        description:
          "We determine the audience, purpose, themes, host, format and internal capacity and test whether a series can carry sufficiently relevant content.",
      },
      {
        title: "Editing and production planning",
        description:
          "Episodes, guests, scripts, recording sessions and approvals are planned in a schedule that suits the availability of your team.",
      },
      {
        title: "Recording and editing",
        description:
          "We provide technical guidance to speakers, record audio or agreed video and edit each episode according to the fixed series style.",
      },
      {
        title: "Revision, delivery and evaluation",
        description:
          "After substantive feedback, we deliver the selected files and evaluate workflow and subsequent themes. Publication steps only follow from the agreed scope.",
      },
    ],
    faqs: [
      {
        question: "What is included in a podcast trajectory?",
        answer:
          "A process can include format development, editorial planning, scripts, recording, editing and delivery. The exact combination depends on what your team does itself. Guest acquisition, video clips, hosting and publishing are only included when explicitly mentioned.",
      },
      {
        question: "How many episodes should a first trajectory have?",
        answer:
          "There is no mandatory number. We look at available themes, guests, budget and internal time. A defined initial series can help evaluate the format and workflow before committing to a longer publishing schedule.",
      },
      {
        question: "Do you help prepare a host and guests?",
        answer:
          "Yes, within the editorial scope. We create a conversation overview, discuss role division and provide practical recording instructions. Your organization remains responsible for substantive accuracy, permission, accessibility and agreements with guests unless otherwise agreed.",
      },
      {
        question: "Can a podcast program combine audio and video?",
        answer:
          "That is possible, but video increases production with cameras, lighting, set, image editing and extra exports. We choose at the beginning whether video is a structural part of the series. Adding them later may have consequences for location, planning and design.",
      },
      {
        question: "Do you also manage hosting and publishing?",
        answer:
          "Not standard. We can advise on platform choice, provide publication files or carry out management if accounts, access and responsibilities are included in the quotation. Your company remains the owner of the chosen accounts and keeps track of external conditions and costs.",
      },
    ],
    relatedServices: [
      "bedrijfspodcast",
      "podcast-opname",
      "videopodcast",
      "podcast-voor-experts",
      "seo-copywriting",
    ],
    seo: {
      title: "Podcast process from concept to editing | VisualVibe",
      description:
        "Want to start a podcast journey? VisualVibe guides format, editing, planning, recording, editing and agreed delivery for a workable business series.",
      keywords: [
        "podcast journey",
        "podcast trajectory company",
        "set up a podcast",
        "podcast guidance",
        "business podcast production",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "podcast journey",
        supportingKeywords: [
          "podcast trajectory company",
          "set up a podcast",
          "podcast guidance",
          "business podcast production",
        ],
        type: "commercial",
      },
      overview: {
        title: "A podcast process with editing and production in one rhythm",
        paragraphs: [
          "A series requires more than a good first shot. Topics should suit the same listener, guests should be prepared in good time, and your team should be able to provide feedback without reinventing each episode. We are therefore developing a format document and editorial calendar that record choices, but leave sufficient room for natural conversations.",
          "Production is then organized around that planning. Episodes can be recorded individually or efficiently in blocks when speakers and content permit. Editing, revision and file names follow a fixed workflow. Before publication, we determine who manages metadata, artwork, hosting, uploads and promotion, so that a finished episode is not left between responsibilities.",
        ],
        highlights: [
          "Feasible format based on internal capacity",
          "Editorial calendar and guest preparation",
          "Fixed recording, editing and feedback workflow",
          "Hosting and publishing as explicit choices",
        ],
      },
      outcomes: {
        title: "Which provides full podcast guidance",
        intro:
          "The trajectory makes roles and recurring steps predictable for everyone who participates in the series.",
        items: [
          {
            title: "A format that is repeatable",
            description:
              "Fixed components and selection criteria help test new topics without episodes becoming identical.",
          },
          {
            title: "Fewer individual production decisions",
            description:
              "Planning, recording, editing and feedback follow the same agreements throughout the chosen series.",
          },
          {
            title: "Clear internal ownership",
            description:
              "Your team knows who approves content, coordinates guests, and manages publishing accounts.",
          },
        ],
      },
      idealFor: {
        title: "Who is a guided podcast program suitable for?",
        intro:
          "The process is intended for organizations with substantive ambition, but without a complete internal podcast workflow.",
        items: [
          {
            title: "SMEs starting a series",
            description:
              "You have expertise and possible guests, but want to set up format and production professionally.",
          },
          {
            title: "Teams with multiple content owners",
            description:
              "Marketing, management and subject matter experts need clear roles for briefing, recording and approval.",
          },
          {
            title: "Existing podcasts without workflow",
            description:
              "Episodes are produced irregularly and require a more stable editorial and technical approach.",
          },
        ],
      },
      deliverables: {
        title: "What can the podcast process yield?",
        intro:
          "We record per phase which documents, productions and management actions are delivered by VisualVibe.",
        items: [
          {
            title: "Format document",
            description:
              "Audience, listening promise, sections, tone, length and roles form a practical frame of reference.",
          },
          {
            title: "Editorial delivery scheduling",
            description:
              "Themes, guests, people responsible and recording moments are put in a feasible order.",
          },
          {
            title: "Production of agreed episodes",
            description:
              "Preparation, recording, editing and revision follow the fixed audio or video scope.",
          },
          {
            title: "Delivery and publication workflow",
            description:
              "Files, metadata, artwork, accounts and upload responsibilities are specifically assigned.",
          },
        ],
      },
      pricing: {
        title: "What determines the price of a podcast project?",
        paragraphs: [
          "The number of episodes and the desired guidance determine the basis. Concept development, preparing interviews and coordinating guests require more editorial time than a series that is completely delivered internally.",
          "Audio production also differs from a multi-camera formula with clips. We budget format, recording, editing, revision and any publication tasks separately. External hosting, music or platform services are not impliedly included.",
        ],
        factors: [
          "Depth of concept and format development",
          "Number of episodes and production rhythm",
          "Editorial research and guest guidance",
          "Audio versus multi-camera video",
          "Studio or different recording locations",
          "Assembly, design and revision rounds",
          "Clips, subtitles and additional formats",
          "Hosting and publishing support",
        ],
      },
      whyVisualVibe: {
        title: "Why a podcast process with VisualVibe?",
        intro:
          "One team monitors the connection between format, speakers, technology and final files.",
        items: [
          {
            title: "Realistic editorial planning",
            description:
              "We tailor the number of episodes to topics and time that your organization actually has available.",
          },
          {
            title: "Audio and video as a conscious choice",
            description:
              "We advise which production variant is needed for each purpose and identify the additional workflow of video.",
          },
          {
            title: "Transfer without platform dependency",
            description:
              "Accounts and external services remain transparent, with clear agreements about ownership and management.",
          },
        ],
      },
      regional: {
        title: "Guiding a podcast process from Limburg",
        description:
          "VisualVibe guides podcast series for SMEs in Limburg, Flanders, Antwerp and the Dutch province of Limburg, with digital editing and recordings at a suitable location.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Convert your podcast idea into a workable process",
        description:
          "Share your goal, possible themes, team and desired channels. We clearly define the concept, deliveries and production responsibilities.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  "podcast-voor-experts": {
    intro:
      "A podcast for experts gives consultants, coaches and specialists space for explanations that do not fit in a short post. VisualVibe helps define expertise, choose topics and record conversations professionally, without promising authority, reach or assignments.",
    excerpt:
      "A substantive podcast formula for experts who want to clearly share their vision and working methods through prepared conversations or solo episodes.",
    process: [
      {
        title: "Defining expertise and audience",
        description:
          "We determine which audience you help, which questions you can credibly answer and which confidential or regulated boundaries apply.",
      },
      {
        title: "Choose content pillars and form",
        description:
          "We translate knowledge into recurring themes and choose between solo explanations, interviews, case discussions or a suitable combination.",
      },
      {
        title: "Prepare and record speaker",
        description:
          "Script and exercise provide guidance without an unnatural reading text. During recording we monitor pace, technique and comprehensibility.",
      },
      {
        title: "Assemble and make contents reusable",
        description:
          "We finish audio or video and deliver the agreed versions. Any fragments or transcript input are determined in advance as a separate output.",
      },
    ],
    faqs: [
      {
        question: "For which experts is their own podcast suitable?",
        answer:
          "For experts with a clearly defined audience, demonstrable professional knowledge and sufficient topics to work on regularly. Consultants, coaches and technical specialists can all fit, as long as the content addresses specific questions and doesn't just repeat personal promotion.",
      },
      {
        question: "Do I work better with solo episodes or guests?",
        answer:
          "Solo episodes provide control and are suitable for focused explanations. Guests bring different experiences and natural conversation. A combination can work when each form supports the same substantive promise and the additional planning of guests remains feasible.",
      },
      {
        question: "Do I need to be able to present smoothly?",
        answer:
          "You don't have to have a radio voice. A clear topic, familiar language and practice are more important. We help with structure, microphone use and pace. Strong content can be edited, but a completely unnatural text does not automatically become a spontaneous conversation.",
      },
      {
        question: "Can customer cases be discussed in the podcast?",
        answer:
          "Only with appropriate consent and respect for confidentiality. We can anonymize situations or work with general patterns. You remain responsible for professional, legal and sector-related restrictions and approve sensitive passages before publication.",
      },
      {
        question:
          "Do you also create articles or social posts from the podcast?",
        answer:
          "This can be done as an additional content scope. We agree on which fragments, transcript editing or articles are needed and who will publish. Automatic transcription is a working document and requires editing before being used as readable and correct expert content.",
      },
    ],
    relatedServices: [
      "podcast-traject",
      "bedrijfspodcast",
      "videopodcast",
      "brandingfotografie",
      "seo-copywriting",
    ],
    seo: {
      title: "Podcast for experts and consultants in Belgium | VisualVibe",
      description:
        "Want to start a podcast for experts? VisualVibe helps consultants with positioning, content pillars, preparation, recording, editing and clear versions.",
      keywords: [
        "podcast for experts",
        "podcast for consultants",
        "expert podcast",
        "podcast as an expert",
        "share knowledge via podcast",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "podcast for experts",
        supportingKeywords: [
          "podcast for consultants",
          "expert podcast",
          "podcast as an expert",
          "share knowledge via podcast",
        ],
        type: "commercial",
      },
      overview: {
        title: "A podcast for experts with a clear knowledge position",
        paragraphs: [
          "Expertise becomes credible when you explain considerations and advice limits. We collect questions from conversations, training and projects and group them into content pillars for multiple relevant episodes.",
          "The format should suit your speaking style. Solo explanations can be prepared compactly; an interview allows spontaneous nuance. Scripts contain key points, not sales scripts. Distribution, clips and derived text only follow when output and channels are pre-selected.",
        ],
        highlights: [
          "Content pillars based on real expertise and questions",
          "Format tailored to your natural speaking style",
          "Preparation without stiff reading text",
          "Derived content as a conscious additional scope",
        ],
      },
      outcomes: {
        title: "What an expert podcast delivers in terms of content",
        intro:
          "You build an organized library of explanations and conversations that represents your vision in a recognizable way.",
        items: [
          {
            title: "More room for nuance",
            description:
              "Complex questions are given context, conditions and examples that are often missing in short content.",
          },
          {
            title: "A recognizable own voice",
            description:
              "Recurring themes and language make it clear how you think about your profession without inflated claims.",
          },
          {
            title: "Source material for in-depth reading",
            description:
              "Depending on the scope, episodes can provide input for edited articles, clips or internal knowledge sharing.",
          },
        ],
      },
      idealFor: {
        title: "When does a podcast suit your expertise?",
        intro:
          "The format works best if you can add something substantive and want to reserve time for preparation and recording.",
        items: [
          {
            title: "Consultants with their own methodology",
            description:
              "You can explain processes and decisions without reducing your approach to general tips.",
          },
          {
            title: "Coaches and trainers",
            description:
              "Recurring questions from sessions or training form relevant themes, within professional boundaries.",
          },
          {
            title: "Technical specialists",
            description:
              "You want to make complex topics accessible to decision makers, colleagues or future employees.",
          },
        ],
      },
      deliverables: {
        title: "What can an expert podcast include?",
        intro:
          "We only combine the editorial and technical components that you do not want or cannot manage yourself.",
        items: [
          {
            title: "Positioning and content framework",
            description:
              "Audience, questions, boundaries of expertise, tone and recurring themes are recorded.",
          },
          {
            title: "Episode briefings",
            description:
              "Each recording is given key points, examples, questions and a clear conclusion.",
          },
          {
            title: "Audio or video recording",
            description:
              "The chosen formula is technically supervised in a suitable set or location.",
          },
          {
            title: "Editing and chosen content versions",
            description:
              "You will receive finished episodes and only the additional formats included in the scope.",
          },
        ],
      },
      pricing: {
        title: "What determines the price of an expert podcast?",
        paragraphs: [
          "The investment depends on the editorial guidance and chosen production. Interviews, source control and a lot of guest coordination require more preparation than an expert who provides a clear solo script.",
          "Video, clips and edited articles add separate recording and editing tasks. We prepare a quotation per series or defined production. Publication reach, leads, or expert status are not guaranteed as results.",
        ],
        factors: [
          "Positioning and format development",
          "Number of themes and episodes",
          "Research, interviews and content-led editing",
          "Solo recording or guest interviews",
          "Audio versus multi-camera video",
          "Location and recording frequency",
          "Assembly, revision and design",
          "Clips, transcript editing or articles",
        ],
      },
      whyVisualVibe: {
        title: "Why create your expert podcast with VisualVibe?",
        intro:
          "We treat your expertise as source material and build the production around understandable content.",
        items: [
          {
            title: "Content without empty claims of authority",
            description:
              "Your expertise becomes visible through concrete explanations, considerations and examples, not through unproven superlatives.",
          },
          {
            title: "Presentation that suits you",
            description:
              "We choose a solo or conversation form in which you speak naturally and still maintain sufficient structure.",
          },
          {
            title: "Coherent content production",
            description:
              "Audio, video, photography and SEO copy can be planned as defined components from the same themes.",
          },
        ],
      },
      regional: {
        title: "Record podcast for experts from Limburg",
        description:
          "VisualVibe produces expert podcasts for consultants and specialists in Limburg, Flanders, Antwerp and the Dutch province of Limburg, with preparation digitally or on location.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Translate your expertise into a listenable format",
        description:
          "Share your audience, subject areas and preference for audio or video. We develop a concrete editorial and technical scope.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
} satisfies Record<PodcastingEditorialSlug, SubserviceEditorial>;

export const englishPodcastingEditorial: Record<
  string,
  EnglishServiceLocaleRecord
> = {
  bedrijfspodcast: {
    displaySlug: "business-podcast",
    title: "Business podcast",
    summary: localizedEditorial["bedrijfspodcast"].excerpt,
    body: localizedEditorial["bedrijfspodcast"].intro,
    benefits: localizedEditorial["bedrijfspodcast"].content.overview.highlights,
    process: localizedEditorial["bedrijfspodcast"].process,
    faqs: localizedEditorial["bedrijfspodcast"].faqs,
    cta: localizedEditorial["bedrijfspodcast"].content.cta,
    seo: localizedEditorial["bedrijfspodcast"].seo,
    imageAlt: "Business podcast produced by VisualVibe in Limburg",
    internalLinks: localizedEditorial["bedrijfspodcast"].relatedServices.map(
      (href) => ({
        href: getEnglishServicePublicHref(href),
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["bedrijfspodcast"],
  },
  videopodcast: {
    displaySlug: "video-podcast",
    title: "Video podcast",
    summary: localizedEditorial["videopodcast"].excerpt,
    body: localizedEditorial["videopodcast"].intro,
    benefits: localizedEditorial["videopodcast"].content.overview.highlights,
    process: localizedEditorial["videopodcast"].process,
    faqs: localizedEditorial["videopodcast"].faqs,
    cta: localizedEditorial["videopodcast"].content.cta,
    seo: localizedEditorial["videopodcast"].seo,
    imageAlt: "Video podcast produced by VisualVibe in Limburg",
    internalLinks: localizedEditorial["videopodcast"].relatedServices.map(
      (href) => ({
        href: getEnglishServicePublicHref(href),
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["videopodcast"],
  },
  "podcast-opname": {
    displaySlug: "podcast-recording",
    title: "Podcast recording",
    summary: localizedEditorial["podcast-opname"].excerpt,
    body: localizedEditorial["podcast-opname"].intro,
    benefits: localizedEditorial["podcast-opname"].content.overview.highlights,
    process: localizedEditorial["podcast-opname"].process,
    faqs: localizedEditorial["podcast-opname"].faqs,
    cta: localizedEditorial["podcast-opname"].content.cta,
    seo: localizedEditorial["podcast-opname"].seo,
    imageAlt: "Podcast recording produced by VisualVibe in Limburg",
    internalLinks: localizedEditorial["podcast-opname"].relatedServices.map(
      (href) => ({
        href: getEnglishServicePublicHref(href),
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["podcast-opname"],
  },
  "podcast-traject": {
    displaySlug: "podcast-production-programme",
    title: "Podcast production programme",
    summary: localizedEditorial["podcast-traject"].excerpt,
    body: localizedEditorial["podcast-traject"].intro,
    benefits: localizedEditorial["podcast-traject"].content.overview.highlights,
    process: localizedEditorial["podcast-traject"].process,
    faqs: localizedEditorial["podcast-traject"].faqs,
    cta: localizedEditorial["podcast-traject"].content.cta,
    seo: localizedEditorial["podcast-traject"].seo,
    imageAlt: "Podcast production programme produced by VisualVibe in Limburg",
    internalLinks: localizedEditorial["podcast-traject"].relatedServices.map(
      (href) => ({
        href: getEnglishServicePublicHref(href),
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["podcast-traject"],
  },
  "podcast-voor-experts": {
    displaySlug: "podcast-for-experts",
    title: "Podcast for experts",
    summary: localizedEditorial["podcast-voor-experts"].excerpt,
    body: localizedEditorial["podcast-voor-experts"].intro,
    benefits:
      localizedEditorial["podcast-voor-experts"].content.overview.highlights,
    process: localizedEditorial["podcast-voor-experts"].process,
    faqs: localizedEditorial["podcast-voor-experts"].faqs,
    cta: localizedEditorial["podcast-voor-experts"].content.cta,
    seo: localizedEditorial["podcast-voor-experts"].seo,
    imageAlt: "Podcast for experts produced by VisualVibe in Limburg",
    internalLinks: localizedEditorial[
      "podcast-voor-experts"
    ].relatedServices.map((href) => ({
      href: getEnglishServicePublicHref(href),
      label: href
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
    })),
    editorial: localizedEditorial["podcast-voor-experts"],
  },
};
