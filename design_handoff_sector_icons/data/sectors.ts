export type Sector = {
  /** slug — also the sprite symbol id (#sector-<id>) */
  id: string;
  name: string;
  /** short label / eyebrow */
  tag: string;
  /** one-line description used on the overview cards */
  desc: string;
};

export const SECTORS: Sector[] = [
  { id: "kmo",          name: "KMO",                          tag: "Ondernemerschap & lokaal", desc: "Websites en branding die lokale ondernemers doen opvallen." },
  { id: "bouw",         name: "Bouw & Renovatie",             tag: "Constructie & vakwerk",    desc: "Digitale uitstraling voor aannemers en renovatiespecialisten." },
  { id: "horeca",       name: "Horeca",                       tag: "Gastvrijheid & beleving",  desc: "Menu\u2019s, reservaties en beeld dat honger opwekt." },
  { id: "vastgoed",     name: "Vastgoed & Immo",              tag: "Panden & makelaardij",     desc: "Panden presenteren met sfeervolle sites en visuals." },
  { id: "retail",       name: "Retail & Webshops",            tag: "Online & offline verkoop", desc: "Webshops en campagnes die verkopen, online \u00e9n in de winkel." },
  { id: "events",       name: "Events",                       tag: "Sfeer & organisatie",      desc: "Strakke event-branding, van teaser tot aftermovie." },
  { id: "sport",        name: "Sportclubs",                   tag: "Beweging & teamgevoel",    desc: "Clubidentiteit en platforms die supporters verbinden." },
  { id: "opleidingen",  name: "Opleidingen & Masterclasses",  tag: "Kennis & groei",           desc: "Cursussen en masterclasses professioneel in de markt gezet." },
  { id: "wellness",     name: "Wellness & Beauty",            tag: "Rust & verzorging",        desc: "Rustige, verfijnde beeldtaal voor salons en spa\u2019s." },
  { id: "industrie",    name: "Industrie",                    tag: "Techniek & productie",     desc: "Technische bedrijven helder en modern gepositioneerd." },
];

export const sectorById = (id: string) => SECTORS.find((s) => s.id === id);
