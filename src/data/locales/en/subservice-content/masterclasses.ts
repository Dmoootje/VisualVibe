import type { SubserviceEditorial } from "@/types";
import type { EnglishServiceLocaleRecord } from "../services";
import { getEnglishServicePublicHref } from "../servicePublicRoutes";

type MasterclassesEditorialSlug =
  "opleiding-opnemen" | "online-cursus-video" | "workshop-filmen";

const localizedEditorial = {
  "opleiding-opnemen": {
    intro:
      "Filming a training course makes an existing training reusable for participants, colleagues or internal knowledge transfer. VisualVibe records trainer, presentation and agreed interaction with professional video and sound. We determine whether you need a complete recording, chapters or additional course materials. A recording is not automatically a designed e-learning module.",
    excerpt:
      "A professional video recording of your training, with intelligible explanations, readable presentation and an editing format that suits the intended reuse.",
    process: [
      {
        title: "Determine learning objective and usage situation",
        description:
          "We discuss audience, duration, location, presentation format and how participants view the video later. That determines recording and chapter division.",
      },
      {
        title: "Prepare trainer, slides and space",
        description:
          "We check script, presentations, demos, audio, lighting, camera sight lines and permission of attendees before the training day.",
      },
      {
        title: "Technical training recording",
        description:
          "Cameras and microphones follow the trainer and agreed learning materials, while the session can of course continue for the participants present.",
      },
      {
        title: "Editing, review and delivery",
        description:
          "We combine cameras, sound and presentation, remove agreed interruptions and deliver the complete recording or chapter-based videos after feedback.",
      },
    ],
    faqs: [
      {
        question:
          "What is the difference between filming a training course and creating an online course?",
        answer:
          "A training recording usually records an existing session and its natural progression. An online course is designed from the start as short independent modules, often without a live audience. A recording can be divided later, but this does not automatically turn it into an effective e-learning course.",
      },
      {
        question: "Can slides be integrated clearly into the video?",
        answer:
          "Yes, if we receive the original presentation in good time. We can combine slides directly with trainer images instead of just filming a projection screen. Animations, fonts and embedded media are pre-tested to limit unexpected differences.",
      },
      {
        question: "Are questions from participants included?",
        answer:
          "Only when it supports the content and has been technically and legally prepared. Participants must know what is being recorded and questions must be recorded intelligibly. We can also have the trainer repeat the question or leave audience parts out of the final edit.",
      },
      {
        question: "Can an entire training day be done in one video?",
        answer:
          "Technically that is possible, but long files are not always easy to revisit. Chapters per topic make targeted revision easier. We determine in advance which breaks, exercises and discussion periods will be retained and where natural chapter breaks lie.",
      },
      {
        question: "Will you post the videos in our learning platform?",
        answer:
          "That is not included by default. We deliver exports according to agreed technical requirements. Upload, platform design, access management, testing and hosting can only be included after checking the chosen system, the available access and responsibilities.",
      },
    ],
    relatedServices: [
      "online-cursus-video",
      "workshop-filmen",
      "bedrijfsvideo",
      "social-media-video",
      "brandingfotografie",
    ],
    seo: {
      title: "Professional training video production | VisualVibe",
      description:
        "Record a training for later reuse? VisualVibe films the trainer, presentation and agreed interaction and delivers clear, edited videos.",
      keywords: [
        "training video production",
        "have the training filmed",
        "produce a training video",
        "training video",
        "training video Limburg",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "training video production",
        supportingKeywords: [
          "have the training filmed",
          "produce a training video",
          "training video",
          "training video Limburg",
        ],
        type: "commercial",
      },
      overview: {
        title: "Training video production for targeted reuse",
        paragraphs: [
          "We start from the later use. An internal reference video may preserve the natural flow of the lesson, while paid participants often want to jump to a specific chapter more quickly. That difference influences camera choice, script and editing. We also determine whether exercises, breaks and questions add value or are mainly distracting when the session is not viewed live.",
          "During preparation, slides and demonstrations receive as much attention as the trainer. Small text or a poorly visible screen cannot always be repaired afterwards. That's why we request source files and test media in advance. The final videos will be delivered in agreed chapters and formats. Learning platform, hosting and participant management remain separate choices.",
        ],
        highlights: [
          "Recording format tailored to later learning use",
          "Lecturer, slides and demonstrations combined in a readable manner",
          "Clear agreements about participant interaction",
          "Exports prepared for a chosen follow-up platform",
        ],
      },
      outcomes: {
        title: "What a professional training recording delivers",
        intro:
          "Your existing session becomes a navigable video source without losing sight of the learning context.",
        items: [
          {
            title: "Understandable knowledge transfer",
            description:
              "Microphones follow the trainer and agreed interaction, so that explanations are not dependent on camera sound.",
          },
          {
            title: "Looking back in a more focused manner",
            description:
              "Logical chapters and titles help users find a topic without going through the entire day.",
          },
          {
            title: "Consistent training files",
            description:
              "Image, slides, sound and design are delivered according to the same technical agreements.",
          },
        ],
      },
      idealFor: {
        title: "When is a training recording suitable?",
        intro:
          "Registration is appropriate when an existing training course works substantively and you want to save it for a defined audience.",
        items: [
          {
            title: "Internal company training",
            description:
              "Recurring explanations can remain available for onboarding, reference or colleagues who were not present.",
          },
          {
            title: "Technical training courses",
            description:
              "Trainer, presentation and demonstration must be visible together to keep actions understandable.",
          },
          {
            title: "Trainers with a live program",
            description:
              "A proven session gets a video version without immediately designing a completely new online curriculum.",
          },
        ],
      },
      deliverables: {
        title: "What can be included in a training course?",
        intro:
          "We specify which lesson components, presentation media and video versions are part of the registration.",
        items: [
          {
            title: "Technical script",
            description:
              "Lesson flow, cameras, audio, slides, demos, breaks and permission are agreed in advance.",
          },
          {
            title: "Multi-camera and sound recording",
            description:
              "Trainer and relevant learning materials are recorded with the agreed positions and microphones.",
          },
          {
            title: "Assembly with presentation material",
            description:
              "Slides, screen images and titles are, where provided, combined in a legible manner with the trainer image.",
          },
          {
            title: "Chapters and video exports",
            description:
              "After revision, we deliver the agreed complete or modular files for your own follow-up process.",
          },
        ],
      },
      pricing: {
        title: "What determines the price of including a training course?",
        paragraphs: [
          "Duration, location, number of cameras and complexity of presentation material determine the registration. A demonstration with different sight lines requires more preparation than a trainer with fixed slides.",
          "The editing depends on chapters, audience questions, screen recordings and corrections. After inspecting the program and space you will receive a quotation. Platform hosting, licensing and upload work are only included when explicitly added.",
        ],
        factors: [
          "Duration and number of training sessions",
          "Number of cameras and microphones",
          "Location, light and acoustics",
          "Slides, screen recordings and demonstrations",
          "Audience Interaction and Permissions",
          "Number of chapters and mounting depth",
          "Subtitling and revision rounds",
          "Exports or support for a learning platform",
        ],
      },
      whyVisualVibe: {
        title: "Why have your training recorded by VisualVibe?",
        intro:
          "We review lesson content, live practice and video production together, so that the recording remains usable after the session.",
        items: [
          {
            title: "Learning objective determines the image",
            description:
              "Camera angles follow what participants need to see, not just what looks cinematically appealing.",
          },
          {
            title: "Presentation material as a real source",
            description:
              "We process original slides and screen images where possible for better readability.",
          },
          {
            title: "Registration fairly demarcated",
            description:
              "We make it clear when you get a recording and when additional didactic design or platform work is needed.",
          },
        ],
      },
      regional: {
        title: "Training video production on location from Limburg",
        description:
          "VisualVibe records training courses in Limburg, Flanders, Antwerp and the Dutch province of Limburg, after coordinating the classroom, program, technology and attendees.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Make your training usable again on video",
        description:
          "Provide program, location, presentation material and desired reuse. We advise on registration, chapters and technical delivery.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  "online-cursus-video": {
    intro:
      "An online course video is designed for independent learning, with one clear goal per module and a consistent presentation. VisualVibe helps you break down long lesson content, prepare scripts and visual assets, and professionally record and edit the videos. We deliver files according to agreed platform requirements, but learning platform hosting and course management are not automatically included.",
    excerpt:
      "Modular e-learning videos with a clear lesson structure, professional presentation and technical exports for the chosen course platform.",
    process: [
      {
        title: "Discuss curriculum and platform context",
        description:
          "We look at the audience, learning objectives, modules, video types and technical requirements of the platform on which you want to offer the course.",
      },
      {
        title: "Make modules and scripts production-proof",
        description:
          "Long lesson material is divided into recordable units with key points, examples, slides, demos and a logical sequence.",
      },
      {
        title: "Record course videos in blocks",
        description:
          "We register trainer, voice, presentation or screen according to a fixed set and monitor continuity between modules.",
      },
      {
        title: "Assembly, overhaul and export",
        description:
          "Each module will have agreed titles, media and finishing. After bundled feedback, we deliver numbered files according to the chosen specifications.",
      },
    ],
    faqs: [
      {
        question: "How long should an online course video be?",
        answer:
          "There is no universal ideal height. One video should cover one clear learning task without unnecessary repetition. A complex example may take more time than a definition. We share content at natural decision and practice moments rather than at a fixed minute limit.",
      },
      {
        question: "Do I have to write out every word of my course?",
        answer:
          "That depends on your presentation style and technical accuracy. A full script helps with precise phrasing and autocue, but can sound stiff. A speaking schedule with key points often works more naturally for experienced trainers. We test the approach before a long shooting day.",
      },
      {
        question: "Can screen recordings and slides be added?",
        answer:
          "Yes. We determine whether a live screen demonstration, prepared screen recording, animation or slide best supports the learning objective. Source files must be available in good time. Complex animation and interaction are separate production tasks and are budgeted in advance.",
      },
      {
        question: "Which platform do I need for my online course?",
        answer:
          "That depends on sales, user management, testing, reporting, integrations and privacy needs. We can help compare technical video requirements, but don't choose without knowing your business process. Accounts, subscriptions, setup and support are agreed separately.",
      },
      {
        question: "Do you also provide tests and course downloads?",
        answer:
          "Only if didactic development and design are part of the scope. Videos alone do not necessarily constitute a complete course. Your subject expert remains responsible for correct content; we can help make assignments, worksheets or accompanying assets production-ready.",
      },
    ],
    relatedServices: [
      "opleiding-opnemen",
      "workshop-filmen",
      "bedrijfsvideo",
      "social-media-video",
      "seo-copywriting",
    ],
    seo: {
      title: "Professional online course video production | VisualVibe",
      description:
        "Planning an online course video? VisualVibe helps with modular structure, scripts, recording, editing and exports for your chosen learning platform in Belgium.",
      keywords: [
        "online course video",
        "have an online course video made",
        "elearning video",
        "record course video",
        "produce video course",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "online course video",
        supportingKeywords: [
          "have an online course video made",
          "elearning video",
          "record course video",
          "produce video course",
        ],
        type: "commercial",
      },
      overview: {
        title: "Building an online video course into independent modules",
        paragraphs: [
          "Online participants cannot always ask a follow-up question immediately. Each module must therefore provide sufficient context, use concepts consistently and clearly indicate what the viewer can then apply. We translate your curriculum into a video plan with one topic per unit. Examples, slides, screenshots and downloads are only given a place if they support the learning objective.",
          "A fixed set, framing and design ensure continuity between shooting days. We plan modules in efficient recording blocks, but take clothing, props and software versions into account. During editing, files are given fixed names and order. The chosen platform determines, among other things, resolution and maximum file size; upload and user management are outside production unless otherwise agreed.",
        ],
        highlights: [
          "One learning objective per demarcated video module",
          "Scripts, slides and demos checked before recording",
          "Consistent set and design throughout the series",
          "Exports tailored to known platform requirements",
        ],
      },
      outcomes: {
        title: "What modular course videos deliver",
        intro:
          "Participants receive a predictable video structure in which explanation and application per topic come together.",
        items: [
          {
            title: "Targeted learning steps",
            description:
              "Each module addresses a recognizable question or action and logically refers to the next step.",
          },
          {
            title: "Easier to update",
            description:
              "A demarcated module can later be re-produced separately when content changes.",
          },
          {
            title: "Consistent learning experience",
            description:
              "Voice, image, titles and file structure follow the same agreements throughout the course.",
          },
        ],
      },
      idealFor: {
        title: "Who are online course videos suitable for?",
        intro:
          "The formula suits experts with a detailed curriculum and a clear audience for independent learning.",
        items: [
          {
            title: "Trainers with proven teaching materials",
            description:
              "Your program works live and can be purposefully redesigned for modules without an audience.",
          },
          {
            title: "SMEs with recurring onboarding",
            description:
              "Fixed explanations can be made available as part of a broader internal learning path.",
          },
          {
            title: "Software and process experts",
            description:
              "Screen recordings, demonstrations and trainer video can explain complex steps in a fixed order.",
          },
        ],
      },
      deliverables: {
        title: "What can an online video production course include?",
        intro:
          "We define video production, didactic editing and platform tasks separately.",
        items: [
          {
            title: "Module and video plan",
            description:
              "Learning objectives, sequence, video types, required media and desired length are described per section.",
          },
          {
            title: "Production-ready scripts and assets",
            description:
              "Speech text or key points, slides, screens and examples are checked before recording.",
          },
          {
            title: "Scheduled video recordings",
            description:
              "Trainer, audio and additional images are recorded in a consistent technical and visual arrangement.",
          },
          {
            title: "Edited course modules",
            description:
              "You will receive revised, numbered videos in the agreed technical formats.",
          },
        ],
      },
      pricing: {
        title: "What determines the price of online course video?",
        paragraphs: [
          "Number of modules, script status and presentation format determine the preparation. A trainer in a fixed set requires a different production than software demos, multiple locations or extensive graphic animation.",
          "Editing, subtitling, revision and platform exports are scoped per series. We prepare a quotation after inspecting the curriculum and sample module. Hosting, platform subscriptions and sales functionality are not a standard part of video production.",
        ],
        factors: [
          "Number of modules and total recording time",
          "Didactic editing and script supervision",
          "Trainer video, slides or screen demonstration",
          "Studio, location and number of recording sessions",
          "Graphic design and animation",
          "The level of editing and revision rounds",
          "Subtitles and additional assets",
          "Platform exports or upload support",
        ],
      },
      whyVisualVibe: {
        title: "Why online course video with VisualVibe?",
        intro:
          "We connect content division with recording and editing, so that modules become production-practical and understandable.",
        items: [
          {
            title: "First an example module",
            description:
              "Style and workflow can be tested early before shooting a full sequence.",
          },
          {
            title: "Continuity between shooting days",
            description:
              "Set, assets, file names and presentation agreements are monitored throughout production.",
          },
          {
            title: "Clear platform border",
            description:
              "We deliver technically appropriate videos and clearly state who manages hosting, users and course publication.",
          },
        ],
      },
      regional: {
        title: "Online video production course from Limburg",
        description:
          "VisualVibe produces modular course videos for trainers and SMEs in Limburg, Flanders, Antwerp and the Dutch province of Limburg, with preparation largely digital.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Test your curriculum against a video structure",
        description:
          "Share learning objectives, modules, sample materials and platform choice. We work out a concrete scope for preparation, recording and editing.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
  "workshop-filmen": {
    intro:
      "Filming a workshop can preserve the teaching content or summarise its atmosphere and key moments. VisualVibe identifies the important speakers, exercises and interactions, then records them with close attention to sound, sight lines and participants. A full recording, a content-led edit and an aftermovie are distinct deliverables.",
    excerpt:
      "A professional workshop video that captures content, demonstrations and agreed interactions as a full recording, summary or aftermovie.",
    process: [
      {
        title: "Select the target and desired film form",
        description:
          "We determine whether the video is for participants, internal knowledge, promotion or report and which full and short versions are appropriate.",
      },
      {
        title: "Prepare program and location",
        description:
          "Speakers, exercises, room layout, lighting, audio, presentations, audience zones and permission are incorporated into a technical script.",
      },
      {
        title: "Film the workshop discreetly",
        description:
          "We film the presenter, demonstrations and agreed interaction without unnecessarily hindering participants or working methods.",
      },
      {
        title: "Selecting, assembling and delivering",
        description:
          "Image and sound are edited according to the chosen film form. After revision, we deliver the agreed complete recording, summary or short version.",
      },
    ],
    faqs: [
      {
        question:
          "What is the difference between a workshop recording and an aftermovie?",
        answer:
          "A full recording preserves the content and covers important sections at sufficient length. An aftermovie is a short, atmosphere-led summary and cannot replace the complete lesson. We can produce both when the filming plan and editing budget allow for them.",
      },
      {
        question: "Do participants have to give permission to be filmed?",
        answer:
          "The organizer must inform participants in good time and arrange appropriate consent or other legal basis. We discuss public-free zones, camera frames and how to deal with questions. VisualVibe provides production advice, but the organizer remains responsible for participant communication and legal assessment.",
      },
      {
        question:
          "Can questions and group conversations be recorded intelligibly?",
        answer:
          "This requires additional audio facilities and clear working agreements. A hall microphone does not automatically record every participant properly. We can provide a question microphone, ask the speaker to repeat questions or specifically record specific groups when planned in advance.",
      },
      {
        question: "Can the workshop continue as usual?",
        answer:
          "Usually yes, but cameras require sight lines and short setup time. Very active exercises or small groups require extra coordination. We choose positions and moments that disrupt the session as little as possible and inform the supervisor about practical limitations.",
      },
      {
        question: "Do you provide videos for social media and our platform?",
        answer:
          "We can provide different exports or short fragments if quantities, length and aspect ratio have been agreed. Upload, hosting and platform management are not included as standard. The organizer also determines whether participant consent covers the intended publication use.",
      },
    ],
    relatedServices: [
      "opleiding-opnemen",
      "online-cursus-video",
      "event-aftermovie",
      "eventfotografie",
      "social-media-video",
    ],
    seo: {
      title: "Workshop video production for reuse and reporting | VisualVibe",
      description:
        "Filming a workshop for reporting or reuse? VisualVibe plans cameras, sound, shots involving participants and editing for a complete recording or summary.",
      keywords: [
        "workshop video production",
        "have the workshop filmed",
        "recording masterclass",
        "workshop video recording",
        "aftermovie workshop",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "workshop video production",
        supportingKeywords: [
          "have the workshop filmed",
          "recording masterclass",
          "workshop video recording",
          "aftermovie workshop",
        ],
        type: "commercial",
      },
      overview: {
        title:
          "Workshop video production as substantive report or short summary",
        paragraphs: [
          "The editing determines what we record. Explanations, demonstrations and understandable questions are important for reviewing. An aftermovie also requires reactions and details that show atmosphere. One camera rarely serves both purposes, so we establish priorities, audience frames and final lengths.",
          "Workshops are more active than classic presentations. Participants work in groups, the accompanist walks around and important moments do not always occur on stage. The script marks exercises and feedback moments, while the crew leaves room for the real progress. After recording, only the agreed versions are edited; platform uploads and broader distribution require separate access and permission.",
        ],
        highlights: [
          "Registration and aftermovie as different products",
          "Audio solution for trainer and planned questions",
          "Camera frames tailored to participant consent",
          "Mounting method and publication use determined in advance",
        ],
      },
      outcomes: {
        title: "What a targeted workshop video produces",
        intro:
          "You receive images that suit the chosen purpose, instead of one long shot without usable structure.",
        items: [
          {
            title: "Saved core content",
            description:
              "Important explanations, demonstrations and conclusions remain available in the chosen full or abbreviated form.",
          },
          {
            title: "Recognizable workshop dynamics",
            description:
              "Targeted atmospheric images show interaction and working methods without distorting content or participant context.",
          },
          {
            title: "Versions by purpose",
            description:
              "A recording, summary and social clip are each given an appropriate length and editing when provided.",
          },
        ],
      },
      idealFor: {
        title: "When is a workshop video production useful?",
        intro:
          "Film is appropriate when the content or atmosphere has a concrete and permitted follow-up use after the live meeting.",
        items: [
          {
            title: "Masterclasses with unique explanations",
            description:
              "A specialist deals with a defined topic that participants want to reconsider later.",
          },
          {
            title: "Internal workshops and knowledge days",
            description:
              "Key insights should be shared within the organization with colleagues who were not present.",
          },
          {
            title: "Public events with follow-up communication",
            description:
              "A short summary shows the purpose and atmosphere, provided permission and publication purpose are clear in advance.",
          },
        ],
      },
      deliverables: {
        title: "What can be included in a workshop video production?",
        intro:
          "The selected output determines the camera, audio and editing plan and is concretely recorded before the workshop.",
        items: [
          {
            title: "Workshop script",
            description:
              "Program, speakers, exercises, audience frameworks and expected key moments guide the registration.",
          },
          {
            title: "Image and sound recording",
            description:
              "Presenter, demonstrations, atmosphere and agreed questions are recorded with appropriate equipment.",
          },
          {
            title: "Content registration",
            description:
              "The complete or shortened session is edited with relevant slides, titles and sound finishing.",
          },
          {
            title: "Summary or aftermovie",
            description:
              "Where provided, we will create a separate short version with key statements and workshop footage.",
          },
        ],
      },
      pricing: {
        title: "What determines the price of a workshop video production?",
        paragraphs: [
          "Duration, program, location and number of simultaneous activities determine how much camera and audio coverage is needed. Multiple rooms or group exercises require more preparation than one speaker in a fixed location.",
          "The number of final versions also plays a role. A complete recording, content-led summary and aftermovie each have their own selection and editing. After inspecting the program and location, we prepare a specific quotation without promising publication range.",
        ],
        factors: [
          "Duration and structure of the workshop",
          "Number of rooms, speakers and working methods",
          "Cameras, microphones and lighting needs",
          "Audience questions and participant registration",
          "Slides, demonstrations and screenshots",
          "Complete registration or substantive reduction",
          "Extra aftermovie, clips and subtitles",
          "Revisions, exports and publishing support",
        ],
      },
      whyVisualVibe: {
        title: "Why have your workshop filmed by VisualVibe?",
        intro:
          "We combine event registration with knowledge of training videos and make editing choices based on the intended use.",
        items: [
          {
            title: "Content and atmosphere planned separately",
            description:
              "We determine which camera images are necessary for full understanding and which moments carry a short summary.",
          },
          {
            title: "Attention to participants",
            description:
              "Setup, audience zones and interaction are coordinated in advance with the organizer.",
          },
          {
            title: "Fair delivery choices",
            description:
              "You specifically choose between registration, summary and clips and do not unknowingly pay for all possible variants.",
          },
        ],
      },
      regional: {
        title: "Workshop video production on location from Limburg",
        description:
          "VisualVibe films workshops and masterclasses in Limburg, Flanders, Antwerp and the Dutch province of Limburg, after checking the programme, space and participant agreements.",
        regionSlugs: [
          "limburg",
          "vlaanderen",
          "antwerpen",
          "nederlands-limburg",
        ],
      },
      cta: {
        title: "Choose which workshop moments should live on",
        description:
          "Deliver program, location, participant context and desired video formats. We make a clear plan for registration and installation.",
        label: "Request a quotation",
        href: "/en/request-a-quotation/",
      },
    },
  },
} satisfies Record<MasterclassesEditorialSlug, SubserviceEditorial>;

export const englishMasterclassesEditorial: Record<
  string,
  EnglishServiceLocaleRecord
> = {
  "opleiding-opnemen": {
    displaySlug: "training-video-production",
    title: "Training video production",
    summary: localizedEditorial["opleiding-opnemen"].excerpt,
    body: localizedEditorial["opleiding-opnemen"].intro,
    benefits:
      localizedEditorial["opleiding-opnemen"].content.overview.highlights,
    process: localizedEditorial["opleiding-opnemen"].process,
    faqs: localizedEditorial["opleiding-opnemen"].faqs,
    cta: localizedEditorial["opleiding-opnemen"].content.cta,
    seo: localizedEditorial["opleiding-opnemen"].seo,
    imageAlt: "Training video production produced by VisualVibe in Limburg",
    internalLinks: localizedEditorial["opleiding-opnemen"].relatedServices.map(
      (href) => ({
        href: getEnglishServicePublicHref(href),
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["opleiding-opnemen"],
  },
  "online-cursus-video": {
    displaySlug: "online-course-video",
    title: "Online course video",
    summary: localizedEditorial["online-cursus-video"].excerpt,
    body: localizedEditorial["online-cursus-video"].intro,
    benefits:
      localizedEditorial["online-cursus-video"].content.overview.highlights,
    process: localizedEditorial["online-cursus-video"].process,
    faqs: localizedEditorial["online-cursus-video"].faqs,
    cta: localizedEditorial["online-cursus-video"].content.cta,
    seo: localizedEditorial["online-cursus-video"].seo,
    imageAlt: "Online course video produced by VisualVibe in Limburg",
    internalLinks: localizedEditorial[
      "online-cursus-video"
    ].relatedServices.map((href) => ({
      href: getEnglishServicePublicHref(href),
      label: href
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
    })),
    editorial: localizedEditorial["online-cursus-video"],
  },
  "workshop-filmen": {
    displaySlug: "workshop-video-production",
    title: "Workshop video production",
    summary: localizedEditorial["workshop-filmen"].excerpt,
    body: localizedEditorial["workshop-filmen"].intro,
    benefits: localizedEditorial["workshop-filmen"].content.overview.highlights,
    process: localizedEditorial["workshop-filmen"].process,
    faqs: localizedEditorial["workshop-filmen"].faqs,
    cta: localizedEditorial["workshop-filmen"].content.cta,
    seo: localizedEditorial["workshop-filmen"].seo,
    imageAlt: "Workshop video production produced by VisualVibe in Limburg",
    internalLinks: localizedEditorial["workshop-filmen"].relatedServices.map(
      (href) => ({
        href: getEnglishServicePublicHref(href),
        label: href
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    ),
    editorial: localizedEditorial["workshop-filmen"],
  },
};
