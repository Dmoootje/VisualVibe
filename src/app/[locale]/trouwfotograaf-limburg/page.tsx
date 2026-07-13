import { WeddingVibeOnePager, weddingVibeConfig } from "@/features/weddingvibe";
import { getWeddingVibeContent } from "@/lib/firestore/weddingvibe";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { businessConfig } from "@/config/business.config";
import { localizedPath } from "@/lib/kennisbank/urls";
import { BreadcrumbJsonLd, FaqPageJsonLd, ServiceJsonLd } from "@/components/seo";

// Deze route staat bewust NAAST de (site)-groep: de WeddingVibe one-pager is
// een zusterlabel met eigen (witte) huisstijl, eigen nav en eigen footer.

// Beelden en prijzen zijn admin-beheerd (Firestore): periodiek revalideren
// zodat wijzigingen zonder rebuild doorstromen.
export const revalidate = 60;

export const metadata = pageMetadata({
  title: weddingVibeConfig.seo.title,
  description: weddingVibeConfig.seo.description,
  keywords: [...weddingVibeConfig.seo.keywords],
  path: `${weddingVibeConfig.path}/`,
  ogImage: weddingVibeConfig.seo.ogImage,
});

export default async function TrouwfotograafLimburgPage() {
  const pageUrl = `${businessConfig.url}${localizedPath("nl", `${weddingVibeConfig.path}/`)}`;
  const content = await getWeddingVibeContent();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Trouwfotograaf Limburg", path: weddingVibeConfig.path },
        ]}
      />
      {/* Zelfde array als de zichtbare FAQ, dus schema == pagina. */}
      <FaqPageJsonLd items={[...weddingVibeConfig.faq.items]} />
      <ServiceJsonLd
        service={{
          name: "Trouwfotografie en huwelijksvideo (WeddingVibe)",
          description: weddingVibeConfig.seo.description,
          url: pageUrl,
          areaServed: ["Limburg", "Vlaanderen", "België"],
        }}
      />
      <WeddingVibeOnePager content={content} />
    </>
  );
}
