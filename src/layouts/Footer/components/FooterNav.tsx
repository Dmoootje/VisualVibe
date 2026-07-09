import { Link } from "@/i18n/navigation";
import { FooterLinkGroup } from "../config/footer.config";

interface FooterNavProps {
  linkGroups: FooterLinkGroup[];
}

/** The link columns (Diensten / Bedrijf / Regio). Rendered as grid children;
 * each link uses the .vv-flink hover treatment (slide + amber tick). */
export function FooterNav({ linkGroups }: FooterNavProps) {
  return (
    <>
      {linkGroups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-5 text-[15px] font-semibold text-white">{group.title}</h3>
          <ul className="flex flex-col gap-[13px]">
            {group.links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="vv-flink text-[14.5px]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
