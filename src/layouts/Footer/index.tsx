import { Link } from "@/i18n/navigation";
import { Mail, Phone, MapPin } from "lucide-react";
import { SocialLinks, FooterNav, FooterPartners } from "./components";
import { footerConfig } from "./config/footer.config";
import { businessConfig } from "@/config/business.config";
import { getSiteSettings } from "@/lib/firestore/siteSettings";

export async function Footer() {
  const settings = await getSiteSettings();

  const streetLine = [settings.street, settings.houseNumber].filter(Boolean).join(" ");
  const cityLine = [settings.postalCode, settings.city].filter(Boolean).join(" ");
  const addressLine =
    [streetLine, cityLine, settings.country].filter(Boolean).join(", ") || settings.fullAddress || "";

  return (
    <footer className="vv-anim relative overflow-hidden bg-black text-white">
      {/* Flowing amber top line */}
      <div className="vv-topline h-0.5 w-full" />
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-[12%] h-[360px] w-[620px] max-w-full bg-[radial-gradient(ellipse_at_center,rgba(255,117,0,0.10),transparent_70%)]"
      />

      <div className="container relative mx-auto px-2.5 sm:px-4 pt-16 sm:pt-[76px]">
        {/* Top grid: brand + columns */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-[clamp(28px,4vw,56px)]">
          {/* Brand + contact + socials */}
          <div>
            <Link href="/" className="text-[26px] font-extrabold tracking-tight sm:text-[28px]">
              Visual<span className="text-[#ff7500]">Vibe</span>
            </Link>
            <p className="mt-[18px] max-w-[340px] text-[15px] leading-relaxed text-white/55">
              {footerConfig.description}
            </p>

            <div className="mt-[26px] flex flex-col gap-[11px] text-[14.5px]">
              {settings.mainEmail && (
                <a
                  href={`mailto:${settings.mainEmail}`}
                  className="vv-contact inline-flex w-fit items-center gap-[11px] text-white/75"
                >
                  <Mail className="h-[17px] w-[17px] shrink-0 text-[#ff7500]" />
                  {settings.mainEmail}
                </a>
              )}
              {settings.phone && (
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                  className="vv-contact inline-flex w-fit items-center gap-[11px] text-white/75"
                >
                  <Phone className="h-[17px] w-[17px] shrink-0 text-[#ff7500]" />
                  {settings.phone}
                </a>
              )}
              {addressLine && (
                <span className="vv-contact inline-flex w-fit items-center gap-[11px] text-white/75">
                  <MapPin className="h-[17px] w-[17px] shrink-0 text-[#ff7500]" />
                  {addressLine}
                </span>
              )}
            </div>

            <div className="mt-[26px]">
              <SocialLinks settings={settings} />
            </div>
          </div>

          {/* Link columns */}
          <FooterNav linkGroups={footerConfig.linkGroups} />
        </div>

        {/* Partners / certifications */}
        <FooterPartners
          title={footerConfig.partners.title}
          subtitle={footerConfig.partners.subtitle}
          partners={footerConfig.partners.items}
        />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-7 sm:flex-row">
          <span className="text-[13.5px] text-white/45">
            © {new Date().getFullYear()} {businessConfig.displayName}. Alle rechten voorbehouden.
          </span>
          <div className="flex flex-wrap gap-6">
            {footerConfig.legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="vv-legal text-[13.5px]">
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
