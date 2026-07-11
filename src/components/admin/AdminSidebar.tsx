"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, Palette, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "./LogoutButton";

type NavChild = { href: string; label: string };
type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; children?: NavChild[] };

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  {
    href: "/admin/settings",
    label: "Instellingen",
    icon: Settings,
    children: [
      { href: "/admin/settings/contact", label: "Contact" },
      { href: "/admin/settings/webdesign", label: "Webdesign realisaties" },
      { href: "/admin/settings/realisaties/fotografie", label: "Fotografie galerijen" },
    ],
  },
  { href: "/internal/blog-styleguide", label: "Branding", icon: Palette },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-white/10 bg-black sm:sticky sm:top-0 sm:h-screen sm:w-60 sm:self-start sm:overflow-y-auto sm:border-b-0 sm:border-r">
      <div className="flex h-full w-full items-center gap-4 p-4 sm:flex-col sm:items-stretch sm:p-6">
        {/* Back to site: a visible button, above the logo on desktop. */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-300 transition-colors hover:bg-amber-500/20 hover:text-amber-200 sm:w-full"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar site
        </Link>

        <Image
          src="/logo.svg"
          alt="VisualVibe"
          width={250}
          height={48}
          className="h-6 w-auto sm:mt-1"
        />

        <nav className="flex flex-1 gap-1 sm:mt-4 sm:w-full sm:flex-col">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <div key={item.href} className="sm:w-full">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>

                {item.children && (
                  <div className="ml-4 mt-0.5 hidden flex-col gap-0.5 border-l border-white/10 pl-3 sm:flex">
                    {item.children.map((child) => {
                      const childActive = pathname.startsWith(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "rounded-md px-3 py-1.5 text-sm transition-colors",
                            childActive
                              ? "bg-white/10 text-white"
                              : "text-white/50 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Account block, pinned to the bottom on desktop. */}
        <div className="mt-auto hidden w-full flex-col gap-2 border-t border-white/10 pt-4 sm:flex">
          <LogoutButton />
          <span className="truncate text-xs text-white/40">{email}</span>
        </div>
      </div>
    </aside>
  );
}
