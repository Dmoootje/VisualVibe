"use client";

import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { usePathname } from "next/navigation";
import {
  ShareGlyph,
  WhatsAppIcon,
  FacebookIcon,
  XIcon,
  LinkedInIcon,
  MailIcon,
  CopyIcon,
  CheckIcon,
  type IconProps,
} from "./share-icons";
import "./share-button.css";

type Loc = "nl" | "en";

type ShareTarget = {
  id: string;
  name: Record<Loc, string>;
  color: string;
  Icon: (props: IconProps) => ReactElement;
  href: (url: string, title: string) => string;
};

const TARGETS: readonly ShareTarget[] = [
  {
    id: "whatsapp",
    name: { nl: "WhatsApp", en: "WhatsApp" },
    color: "#25D366",
    Icon: WhatsAppIcon,
    href: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    id: "facebook",
    name: { nl: "Facebook", en: "Facebook" },
    color: "#1877F2",
    Icon: FacebookIcon,
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "x",
    name: { nl: "X", en: "X" },
    color: "#E7E7EA",
    Icon: XIcon,
    href: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: "linkedin",
    name: { nl: "LinkedIn", en: "LinkedIn" },
    color: "#0A66C2",
    Icon: LinkedInIcon,
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: "email",
    name: { nl: "E-mail", en: "Email" },
    color: "#FF9A45",
    Icon: MailIcon,
    href: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n${url}`)}`,
  },
];

const UI = {
  nl: { trigger: "Deel deze pagina", heading: "Delen", copy: "Kopieer link", copied: "Gekopieerd!" },
  en: { trigger: "Share this page", heading: "Share", copy: "Copy link", copied: "Copied!" },
} as const;

export function ShareButton({ locale }: { locale: string }) {
  const current: Loc = locale === "en" ? "en" : "nl";
  const ui = UI[current];
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [share, setShare] = useState({ url: "", title: "" });
  const rootRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setShare({ url: window.location.href, title: document.title });
  }, [pathname]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) close();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  async function copyLink() {
    const url = share.url || window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked; leave state unchanged */
    }
  }

  return (
    <div ref={rootRef} className={`vvshare${open ? " is-open" : ""}`}>
      {open && (
        <div className="vvshare-pop" role="menu" aria-label={ui.trigger}>
          <p className="vvshare-label">{ui.heading}</p>
          {TARGETS.map((target) => {
            const Icon = target.Icon;
            return (
              <a
                key={target.id}
                href={target.href(share.url, share.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="vvshare-opt"
                role="menuitem"
                onClick={close}
              >
                <span className="vvshare-chip" style={{ color: target.color }}>
                  <Icon />
                </span>
                <span className="vvshare-name">{target.name[current]}</span>
              </a>
            );
          })}
          <div className="vvshare-divider" />
          <button type="button" className="vvshare-opt" role="menuitem" onClick={copyLink}>
            <span className="vvshare-chip" style={{ color: copied ? "#34D399" : "#FF9A45" }}>
              {copied ? <CheckIcon /> : <CopyIcon />}
            </span>
            <span className="vvshare-name">{copied ? ui.copied : ui.copy}</span>
          </button>
        </div>
      )}

      <button
        type="button"
        className="vvshare-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ui.trigger}
        onClick={() => setOpen((value) => !value)}
      >
        <ShareGlyph />
      </button>
    </div>
  );
}
