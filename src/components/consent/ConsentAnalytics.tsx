"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_STORAGE_KEY,
  type ConsentChoice,
} from "./consent";

type Gtag = (...args: unknown[]) => void;

type AnalyticsWindow = Window &
  typeof globalThis & {
    dataLayer?: unknown[];
    gtag?: Gtag;
    __vvGaConfigured?: Set<string>;
    __vvGaLastPagePath?: Record<string, string>;
  };

function storedConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function setAnalyticsDisabled(analyticsWindow: AnalyticsWindow, gaId: string, disabled: boolean) {
  const flags = analyticsWindow as unknown as Record<string, unknown>;
  flags[`ga-disable-${gaId}`] = disabled;
}

function ensureGtag(analyticsWindow: AnalyticsWindow): Gtag {
  analyticsWindow.dataLayer ??= [];
  analyticsWindow.gtag ??= (...args: unknown[]) => {
    analyticsWindow.dataLayer?.push(args);
  };
  return analyticsWindow.gtag;
}

/**
 * Loads GA4 only after explicit analytics consent and owns page-view tracking.
 * The config call suppresses Google's implicit first hit so each client route is
 * reported exactly once by the pathname effect below.
 */
export function ConsentAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(storedConsent());

    const handleConsent = (event: Event) => {
      const choice = (event as CustomEvent<ConsentChoice>).detail;
      if (choice === "granted" || choice === "denied") setConsent(choice);
    };

    window.addEventListener(CONSENT_CHANGE_EVENT, handleConsent);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handleConsent);
  }, []);

  useEffect(() => {
    const analyticsWindow = window as AnalyticsWindow;

    if (consent !== "granted") {
      setReady(false);
      setAnalyticsDisabled(analyticsWindow, gaId, true);
      analyticsWindow.gtag?.("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      return;
    }

    setAnalyticsDisabled(analyticsWindow, gaId, false);
    const gtag = ensureGtag(analyticsWindow);
    analyticsWindow.__vvGaConfigured ??= new Set<string>();
    if (!analyticsWindow.__vvGaConfigured.has(gaId)) {
      gtag("consent", "default", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      gtag("js", new Date());
      gtag("config", gaId, { send_page_view: false });
      analyticsWindow.__vvGaConfigured.add(gaId);
    } else {
      gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }

    const scriptId = `vv-ga-${gaId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (script?.dataset.loaded === "true") {
      setReady(true);
      return;
    }

    const handleLoad = () => {
      if (script) script.dataset.loaded = "true";
      setReady(true);
    };
    const handleError = () => {
      script?.remove();
      setReady(false);
    };

    const shouldAppend = !script;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    }

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    if (shouldAppend) document.head.appendChild(script);

    return () => {
      script?.removeEventListener("load", handleLoad);
      script?.removeEventListener("error", handleError);
    };
  }, [consent, gaId]);

  useEffect(() => {
    if (consent !== "granted" || !ready || !pathname) return;

    const analyticsWindow = window as AnalyticsWindow;
    const pagePath = `${pathname}${window.location.search}`;
    analyticsWindow.__vvGaLastPagePath ??= {};

    if (analyticsWindow.__vvGaLastPagePath[gaId] === pagePath) return;

    analyticsWindow.gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_path: pagePath,
      page_title: document.title,
    });
    analyticsWindow.__vvGaLastPagePath[gaId] = pagePath;
  }, [consent, gaId, pathname, ready]);

  return null;
}
