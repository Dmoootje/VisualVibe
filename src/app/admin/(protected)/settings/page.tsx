import { redirect } from "next/navigation";

// The contact/CRM settings live on /admin/settings/contact. This is the only
// settings surface for now, so send /admin/settings straight there.
export default function AdminSettingsPage() {
  redirect("/admin/settings/contact");
}
