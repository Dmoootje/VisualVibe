// Media for the Drone & FPV service page realisaties split. Photos are
// Firebase-hosted webp (referenced by URL, never committed to the repo); videos
// embed YouTube. Scale up by appending here (or later from a CMS / the YouTube
// Data API) - the split, lightbox and thumbnails all iterate these arrays.

export type DronePhoto = {
  /** Firebase Storage webp URL. */
  src: string;
  title: string;
  /** Short mono caption shown on the frame + as the lightbox tag. */
  label: string;
};

export type DroneVideo = {
  /** YouTube video id. */
  yt: string;
  title: string;
  /** Category tag shown on the card + as the lightbox tag. */
  tag: string;
};

export const dronePhotos: DronePhoto[] = [
  {
    src: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2Fdronefotografie.webp?alt=media&token=8e2e74e6-6c7a-4df2-9e24-2fc254497999",
    title: "Dronefotografie",
    label: "Luchtfoto",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2Fdrone%20fotografie.webp?alt=media&token=1c3d3587-42bb-4e1d-9e3a-e94bbc499a2f",
    title: "Drone fotografie",
    label: "Vanuit de lucht",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2Fdrone%20fotografie%20Belgi%C3%AB%20en%20Nederland.webp?alt=media&token=69384058-2f29-4213-8d71-bc32ed528931",
    title: "Drone fotografie in België en Nederland",
    label: "Grensregio",
  },
];

export const droneVideos: DroneVideo[] = [
  { yt: "ZXJNLr5W8eA", title: "Drone-reel: luchtbeelden", tag: "Dronevideo" },
  { yt: "FdzjPybGWSo", title: "FPV-video: dynamisch door het project", tag: "FPV" },
];
