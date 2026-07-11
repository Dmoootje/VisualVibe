import type { Service } from "@/types";
import { serviceHref } from "@/data/services";
import { SubdienstenGrid, type Subdienst } from "@/components/subdiensten";

/**
 * Dienstenkaarten voor de regio-pagina. Hergebruikt de "ghost-glyph watermark"
 * kaarten van de webdesign-pagina (lijn-icoon + grote vage watermark + oranje
 * spinning border op hover), zodat elke dienst een herkenbaar icoon krijgt en
 * de regio-pagina's visueel aansluiten bij de rest van de site.
 */
export function RegionServicesGrid({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  const items: Subdienst[] = services.map((service) => ({
    // De categorie is de icon-id (webdesign, seo, fotografie, ...).
    id: service.category,
    name: service.title,
    desc: service.excerpt,
    href: serviceHref(service),
  }));

  return <SubdienstenGrid services={items} />;
}
