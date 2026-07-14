"use client";

import { useEffect, useRef } from "react";

/**
 * Externe SEO-analyse widget (testfase). Het script scant de DOM bij uitvoering
 * naar [data-seo-analysis-widget]; we voegen het daarom bij elke mount opnieuw
 * toe, zodat de widget ook initialiseert na client-side navigatie (een
 * <script async> in de HTML zou maar één keer draaien). Script-URL en public key
 * komen uit de admin-config (/admin/settings/analyse).
 */
export function WebsiteAnalyseWidget({
  scriptSrc,
  siteKey,
}: {
  scriptSrc: string;
  siteKey: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
      if (container) container.innerHTML = "";
    };
  }, [scriptSrc]);

  return <div ref={ref} data-seo-analysis-widget="" data-site-key={siteKey} data-locale="nl" />;
}
