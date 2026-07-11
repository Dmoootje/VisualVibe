// Gemeentes per hoofdregio, gebruikt voor de GEO-sectie (opsomming + pil-runner)
// op de regio-detailpagina's. Bewust een ruime, herkenbare lijst per regio: goed
// voor lokale SEO en voor AI-antwoordmachines die "in welke gemeentes werkt X"
// willen beantwoorden. Keyed op region.slug.
export const regionMunicipalities: Record<string, string[]> = {
  limburg: [
    "Hasselt", "Genk", "Bilzen", "Hoeselt", "Tongeren", "Borgloon", "Sint-Truiden",
    "Maasmechelen", "Lanaken", "Diepenbeek", "Beringen", "Houthalen-Helchteren",
    "Lommel", "Pelt", "Bree", "Maaseik", "Peer", "Bocholt", "Herk-de-Stad", "Halen",
    "Zonhoven", "Heusden-Zolder", "Riemst", "Dilsen-Stokkem",
  ],
  vlaanderen: [
    "Antwerpen", "Gent", "Brugge", "Leuven", "Hasselt", "Mechelen", "Aalst", "Kortrijk",
    "Roeselare", "Sint-Niklaas", "Genk", "Oostende", "Turnhout", "Dendermonde",
    "Waregem", "Lokeren", "Beveren", "Geel", "Vilvoorde", "Tienen", "Halle", "Deinze",
  ],
  antwerpen: [
    "Antwerpen", "Mechelen", "Turnhout", "Lier", "Mol", "Geel", "Herentals", "Mortsel",
    "Brasschaat", "Schoten", "Boom", "Heist-op-den-Berg", "Kontich", "Wijnegem",
    "Duffel", "Westerlo", "Hoogstraten", "Kapellen", "Willebroek", "Aartselaar",
  ],
  "nederlands-limburg": [
    "Maastricht", "Sittard-Geleen", "Heerlen", "Roermond", "Venlo", "Weert", "Kerkrade",
    "Landgraaf", "Brunssum", "Venray", "Valkenburg", "Beek", "Stein", "Meerssen",
    "Echt-Susteren", "Gennep", "Horst aan de Maas", "Peel en Maas", "Beesel", "Nederweert",
  ],
};
