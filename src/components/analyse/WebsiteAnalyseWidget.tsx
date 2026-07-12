"use client";

import { useEffect, useRef } from "react";

const SCRIPT_SRC =
  "https://ea419e43-59c9-4427-a03b-b1c41c8dde97-00-36ujlt5w28br5.worf.replit.dev/widgets/website-analyse.v1.js";
const SITE_KEY = "pk_live_45d448a7ef76b67d1e8d82d4_8fxi7Cmi5Lf2lxwO_a_sBQ0Rs3SeaYLB";

/**
 * Externe SEO-analyse widget (testfase, nog onstyled). Het script scant de DOM
 * bij uitvoering naar [data-seo-analysis-widget]; we voegen het daarom bij
 * elke mount opnieuw toe, zodat de widget ook initialiseert na client-side
 * navigatie (een <script async> in de HTML zou maar één keer draaien).
 */
export function WebsiteAnalyseWidget() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
      if (container) container.innerHTML = "";
    };
  }, []);

  return <div ref={ref} data-seo-analysis-widget="" data-site-key={SITE_KEY} data-locale="nl" />;
}
