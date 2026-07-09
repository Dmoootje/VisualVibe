import Link from "next/link";
import { Facebook, Instagram, Linkedin, Music2, Youtube } from "lucide-react";
import type { SiteSettings } from "@/types";

type Social = { name: string; href: string; icon: React.ReactNode };

/** Builds the visible social links from settings, skipping the ones left empty. */
export function SocialLinks({ settings }: { settings: SiteSettings }) {
  const links: Social[] = [];
  const add = (name: string, href: string | undefined, icon: React.ReactNode) => {
    if (href) links.push({ name, href, icon });
  };

  add("Facebook", settings.facebookUrl, <Facebook className="h-5 w-5" />);
  add("Instagram", settings.instagramUrl, <Instagram className="h-5 w-5" />);
  add("LinkedIn", settings.linkedinUrl, <Linkedin className="h-5 w-5" />);
  add("YouTube", settings.youtubeUrl, <Youtube className="h-5 w-5" />);
  add("TikTok", settings.tiktokUrl, <Music2 className="h-5 w-5" />);

  if (links.length === 0) return null;

  return (
    <div className="flex space-x-4">
      {links.map((social) => (
        <Link
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-white transition-colors"
        >
          {social.icon}
          <span className="sr-only">{social.name}</span>
        </Link>
      ))}
    </div>
  );
}
