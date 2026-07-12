import type { RealisatieStat } from "@/data/realisatieCategories";

// Content for the Realisaties > Drone & FPV page (design_handoff_realisaties_
// drone_fotografie). A filterable mix of drone photos and YouTube videos.
// Demo media below are real VisualVibe portfolio assets; replace/extend them
// here (or move to an admin later, mirroring the fotografie galleries).

export type DroneMediaKind = "video" | "foto";

export type DroneMedia = {
  kind: DroneMediaKind;
  /** Must match a droneCategories name. */
  category: string;
  title: string;
  /** YouTube video id (kind "video"). Thumbnail derives from img.youtube.com. */
  youtubeId?: string;
  /** Image URL (kind "foto"). */
  src?: string;
};

export type DroneCategory = {
  name: string;
  /** Shown above the grid and in the empty state when this filter is active. */
  description: string;
};

export const droneCategories: DroneCategory[] = [
  { name: "Dronefotografie", description: "Luchtfoto's die een uniek perspectief geven op je bedrijf of project." },
  { name: "Dronevideo", description: "Vloeiende luchtbeelden voor bedrijfsvideo's en promomateriaal." },
  { name: "FPV-video", description: "Dynamische, snelle FPV-beelden die door en rond je project vliegen." },
  { name: "Vastgoed-dronebeelden", description: "Luchtbeelden die een pand en zijn omgeving optimaal tonen." },
  { name: "Realisatie-dronebeelden", description: "De voortgang en omvang van bouw- of renovatieprojecten van bovenaf." },
  { name: "Event-dronebeelden", description: "Luchtbeelden die de schaal en drukte van je event tonen." },
];

const PHOTO = {
  dronefotografie:
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2Fdronefotografie.webp?alt=media&token=8e2e74e6-6c7a-4df2-9e24-2fc254497999",
  droneFotografie:
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2Fdrone%20fotografie.webp?alt=media&token=1c3d3587-42bb-4e1d-9e3a-e94bbc499a2f",
  belgieNederland:
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2Fdrone%20fotografie%20Belgi%C3%AB%20en%20Nederland.webp?alt=media&token=69384058-2f29-4213-8d71-bc32ed528931",
};

/** The featured item is media[0]. */
export const droneMedia: DroneMedia[] = [
  { kind: "video", category: "Dronevideo", title: "Drone-reel - luchtbeelden", youtubeId: "ZXJNLr5W8eA" },
  { kind: "foto", category: "Dronefotografie", title: "Dronefotografie", src: PHOTO.dronefotografie },
  { kind: "foto", category: "Dronefotografie", title: "Drone fotografie", src: PHOTO.droneFotografie },
  { kind: "foto", category: "Vastgoed-dronebeelden", title: "België & Nederland", src: PHOTO.belgieNederland },
  { kind: "video", category: "FPV-video", title: "FPV-video - door het project", youtubeId: "FdzjPybGWSo" },
];

export const droneStats: RealisatieStat[] = [
  { value: "4K", label: "luchtbeelden\n· HDR" },
  { value: "EASA", label: "gecertificeerd\n& verzekerd", accent: true },
];
