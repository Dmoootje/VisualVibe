"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

type QuoteModalMode = "offerte" | "kennis";

const QuoteModalContent = dynamic(() => import("./QuoteModal").then((module) => module.QuoteModalContent), {
  ssr: false,
  loading: () => null,
});

export function QuoteModalController() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<QuoteModalMode>("offerte");

  const openModal = useCallback((nextMode: QuoteModalMode) => {
    setMode(nextMode);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const modalTrigger = target?.closest<HTMLElement>("[data-quote-modal]");
      if (modalTrigger) {
        event.preventDefault();
        openModal(modalTrigger.dataset.quoteModal === "kennis" ? "kennis" : "offerte");
        return;
      }

      const anchor = target?.closest?.("a");
      if (!anchor || (anchor.target && anchor.target !== "_self")) return;

      const href = anchor.getAttribute("href") ?? "";
      if (
        /^(https?:)?\/\//i.test(href) ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      ) {
        return;
      }

      // The quote page no longer exists: any internal link to the old Dutch
      // or English quotation URL opens the slide-up sheet instead. (No-JS
      // visitors hit the permanent redirect to /contact in next.config.js.)
      const path = anchor.pathname.replace(/\/+$/, "");
      if (path.endsWith("/offerte-aanvragen") || path.endsWith("/request-a-quotation")) {
        event.preventDefault();
        openModal("offerte");
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [openModal]);

  return open && <QuoteModalContent mode={mode} onClose={close} />;
}
