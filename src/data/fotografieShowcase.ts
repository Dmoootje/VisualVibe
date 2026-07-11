// Content for the bespoke Fotografie service page (design_handoff_fotografie_
// service). Images are Firebase-hosted portfolio webp's, referenced by URL.

/** Hero viewfinder default photo. */
export const FG_HERO_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FDrone%20Nacht%20fotografie.webp?alt=media&token=a607907f-b11e-42d8-b576-d64cbde39c8f";

/** Portfolio images reused across the galleries + lightbox. */
export const FG_IMG: Record<string, string> = {
  portrait:
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FFotografie%20-%20Jens%20Hardy%20fotograaf%20Limburg.webp?alt=media&token=1ecd395c-f1aa-4458-a4db-bb3ad7e62fa3",
  night: FG_HERO_IMAGE,
  alpen:
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FAlpen-drone-fotos-scaled.webp?alt=media&token=fe09068a-ff73-4ec8-8a70-382681272bd5",
  bedrijf1:
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FBedrijfssfotos-drone.webp?alt=media&token=105ae204-ca42-48e3-9d5f-ec9ed86c8c43",
  bedrijf2:
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FBedrijfssfotos-met-drone.webp?alt=media&token=c0d95d8b-b352-41b3-8f9d-330a77549cb1",
  woon:
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FDrone%20woonplaats%20luchtfoto.webp?alt=media&token=6c6e1b31-b0a0-48e2-bac0-42bfaab5c35b",
  zon:
    "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2FDrone-zonnepanelen.webp?alt=media&token=419485d3-1c72-49b0-8ef0-020b58afce51",
};

export type FgGallery = {
  /** fi-icon id. */
  icon: string;
  badge: string;
  title: string;
  desc: string;
  /** Keys into FG_IMG for the gallery's photos. */
  keys: string[];
};

// The 7 galleries. The first 3 render as the featured bento; all open a lightbox.
export const FG_GALLERIES: FgGallery[] = [
  { icon: "foto", badge: "Bedrijf", title: "Bedrijfsfotografie", desc: "Professionele beelden van je bedrijf, team en werkplek.", keys: ["bedrijf1", "bedrijf2", "woon", "zon", "night"] },
  { icon: "user", badge: "Portret", title: "Zakelijke portretten", desc: "Professionele portretfoto's voor je website, LinkedIn en visitekaartje.", keys: ["portrait", "bedrijf1", "bedrijf2"] },
  { icon: "box", badge: "Product", title: "Productfotografie", desc: "Scherpe productfoto's die je webshop of catalogus versterken.", keys: ["zon", "bedrijf2", "bedrijf1"] },
  { icon: "cal", badge: "Event", title: "Eventfotografie", desc: "Beeldverslag van je bedrijfsevent, opening of netwerkmoment.", keys: ["night", "alpen", "woon", "bedrijf1"] },
  { icon: "home", badge: "Vastgoed", title: "Vastgoedfotografie", desc: "Panden die er op foto net zo aantrekkelijk uitzien als in het echt.", keys: ["woon", "alpen", "night", "bedrijf2"] },
  { icon: "layers", badge: "Realisatie", title: "Realisatiefotografie", desc: "Afgewerkte projecten in beeld, van bouw tot interieur.", keys: ["zon", "bedrijf1", "bedrijf2", "woon"] },
  { icon: "spark", badge: "Branding", title: "Brandingfotografie", desc: "Een consistente beeldtaal die je merk herkenbaar maakt.", keys: ["portrait", "night", "alpen", "bedrijf1"] },
];

export type FgSlide = { id: string; title: string; message: string; image: string };

// The 8 shutter-reveal category photos (468x589). galleryUrl is not wired yet.
export const FG_SLIDES: FgSlide[] = [
  { id: "bedrijfsfotografie", title: "Bedrijfsfotografie", message: "Niet op kantoor vandaag? Probeer opnieuw.", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F01-bedrijfsfotografie.webp?alt=media&token=464345b0-7db4-4e24-bac9-c96fce9a263d" },
  { id: "zakelijke-portretten", title: "Zakelijke portretten", message: "Geen nieuwe profielfoto nodig? Klik opnieuw.", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F02-zakelijke-portretten.webp?alt=media&token=d2dcf975-9655-4481-a54d-34d8c7fd1dd1" },
  { id: "productfotografie", title: "Productfotografie", message: "Geen product in de spotlight? Probeer opnieuw.", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F03-productfotografie.webp?alt=media&token=8cf89e53-5318-47ef-8502-afd01941fa0a" },
  { id: "eventfotografie", title: "Eventfotografie", message: "Geen feestje vandaag? Klik nog eens.", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F04-eventfotografie.webp?alt=media&token=4083399d-781e-43bf-bd0e-acf5a85a6816" },
  { id: "vastgoedfotografie", title: "Vastgoedfotografie", message: "Niet aan het verkopen? Probeer opnieuw.", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F05-vastgoedfotografie.webp?alt=media&token=15bb4033-07c4-48c0-88a4-fe965768242e" },
  { id: "realisatiefotografie", title: "Realisatiefotografie", message: "Nog niets afgewerkt? Klik opnieuw.", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F06-realisatiefotografie.webp?alt=media&token=5dfed050-7cc3-40c3-a75d-f90852b120b1" },
  { id: "brandingfotografie", title: "Brandingfotografie", message: "Nog niet helemaal jouw merk? Nog een keer.", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F07-brandingfotografie.webp?alt=media&token=fa6ac811-bc45-41df-809e-07fd41017c58" },
  { id: "huwelijksfotografie", title: "Huwelijksfotografie", message: "Niet getrouwd vandaag? Probeer opnieuw.", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023.firebasestorage.app/o/media%2Ffotografieslide%2F08-huwelijksfotografie.webp?alt=media&token=b2319bd5-a1b5-4653-9176-83f2936f3a37" },
];

// Category id -> fi-icon for the shutter badge + button.
export const FG_CAT_ICON: Record<string, string> = {
  bedrijfsfotografie: "biz",
  "zakelijke-portretten": "user",
  productfotografie: "box",
  eventfotografie: "party",
  vastgoedfotografie: "home",
  realisatiefotografie: "layers",
  brandingfotografie: "spark",
  huwelijksfotografie: "heart",
};
