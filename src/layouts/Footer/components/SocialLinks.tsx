import { Facebook, Instagram, Linkedin, Music2, Youtube } from "lucide-react";
import type { SiteSettings } from "@/types";

type Social = { name: string; href: string; icon: React.ReactNode };

/** Social chips built from settings, skipping the ones left empty. */
export function SocialLinks({ settings }: { settings: SiteSettings }) {
  const links: Social[] = [];
  const add = (name: string, href: string | undefined, icon: React.ReactNode) => {
    if (href) links.push({ name, href, icon });
  };

  add("Facebook", settings.facebookUrl, <Facebook className="h-[17px] w-[17px]" />);
  add("Instagram", settings.instagramUrl, <Instagram className="h-[17px] w-[17px]" />);
  add("LinkedIn", settings.linkedinUrl, <Linkedin className="h-[17px] w-[17px]" />);
  add("YouTube", settings.youtubeUrl, <Youtube className="h-[17px] w-[17px]" />);
  add("TikTok", settings.tiktokUrl, <Music2 className="h-[17px] w-[17px]" />);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2.5">
      {links.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className="vv-soc flex h-10 w-10 items-center justify-center rounded-[11px] border border-white/[0.12] text-white/60"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}
