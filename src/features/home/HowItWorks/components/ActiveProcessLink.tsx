"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PROCESS_TRACK_EVENT } from "../process-events";
import { processTracks } from "../config/process.config";

export function ActiveProcessLink({ locale = "nl" }: { locale?: string }) {
  const [href, setHref] = useState(processTracks[0].href);

  useEffect(() => {
    function updateLink(event: Event) {
      const customEvent = event as CustomEvent<{ href?: string }>;
      if (customEvent.detail?.href) setHref(customEvent.detail.href);
    }

    window.addEventListener(PROCESS_TRACK_EVENT, updateLink);
    return () => window.removeEventListener(PROCESS_TRACK_EVENT, updateLink);
  }, []);

  return (
    <Button
      asChild
      variant="outline"
      className="gap-2 border-white/15 bg-white/[0.03] text-white hover:border-amber-500/40 hover:bg-amber-500/[0.06] hover:text-white"
    >
      <Link href={href}>{locale === "en" ? "View this service" : "Bekijk deze dienst"}</Link>
    </Button>
  );
}
