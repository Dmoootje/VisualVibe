import { Link } from "@/i18n/navigation";
import { Mail, Phone } from "lucide-react";
import { FooterLogo, SocialLinks, FooterNav } from "./components";
import { footerConfig } from "./config/footer.config";
import { businessConfig } from "@/config/business.config";
import { getSiteSettings } from "@/lib/firestore/siteSettings";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-black border-t border-white/10 py-8 sm:py-16 px-3 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12">
          <div>
            <FooterLogo />
            <p className="text-white/70 mb-6">{footerConfig.description}</p>

            <div className="mb-6 flex flex-col gap-1.5 text-sm text-white/60">
              {settings.mainEmail && (
                <a
                  href={`mailto:${settings.mainEmail}`}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 text-amber-400" />
                  {settings.mainEmail}
                </a>
              )}
              {settings.phone && (
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 text-amber-400" />
                  {settings.phone}
                </a>
              )}
            </div>

            <SocialLinks settings={settings} />
          </div>

          <FooterNav linkGroups={footerConfig.linkGroups} />
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} {businessConfig.displayName}. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-6">
            {footerConfig.legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/50 hover:text-white text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
