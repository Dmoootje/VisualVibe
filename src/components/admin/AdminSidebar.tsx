"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "./LogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/settings", label: "Instellingen", icon: Settings },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-full sm:w-60 shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 bg-black flex sm:flex-col">
      <div className="p-4 sm:p-6 flex items-center sm:items-start sm:flex-col gap-4 w-full">
        <Image src="/logo.svg" alt="VisualVibe" width={250} height={48} className="h-6 w-auto" />

        <nav className="flex sm:flex-col gap-1 flex-1 sm:w-full sm:mt-4">
          {navItems.map((item) => {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden sm:flex flex-col gap-2 mt-auto pt-4 border-t border-white/10 w-full">
          <span className="text-xs text-white/40 truncate">{email}</span>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
