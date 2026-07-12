import Link from "next/link";
import { Mail, LayoutTemplate, CircleUserRound } from "lucide-react";

const cards = [
  {
    href: "/admin/settings/profiel",
    title: "Profiel",
    desc: "Je naam en profielfoto. De foto toont als auteursfoto bij kennisbankartikels en blogcards.",
    icon: CircleUserRound,
  },
  {
    href: "/admin/settings/contact",
    title: "Contactgegevens",
    desc: "Adres, contact, socials, openingsuren en CTA's. Gebruikt op de contactpagina, footer en schema.",
    icon: Mail,
  },
  {
    href: "/admin/settings/webdesign",
    title: "Webdesign realisaties",
    desc: "Beheer de afbeeldingen van de webdesign-dienstpagina: hero-preview en per project de screenshots.",
    icon: LayoutTemplate,
  },
];

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Instellingen</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10"
            >
              <Icon className="h-5 w-5 text-amber-400" />
              <div className="mt-3 font-semibold text-white">{c.title}</div>
              <div className="mt-1 text-sm text-white/60">{c.desc}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
