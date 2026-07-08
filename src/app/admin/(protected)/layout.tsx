import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <AdminSidebar email={admin.email} />
      <main className="flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
