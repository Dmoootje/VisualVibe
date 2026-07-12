import { revalidatePath } from "next/cache";

// Invalidate the public Webdesign showcase after an admin image/text change so
// the new screenshots and copy appear without waiting for the ISR timer. The
// showcase lives at /[locale]/diensten/webdesign; the locale prefix (e.g. /be)
// means a literal "/diensten/webdesign" no longer matches, so we revalidate the
// dynamic route pattern, which covers every locale and slug at once.
export function revalidateWebdesign(): void {
  revalidatePath("/[locale]/diensten/[slug]", "page");
  // Sector pages surface admin-tagged webdesign projects (sectors field).
  revalidatePath("/[locale]/sectoren/[slug]", "page");
  revalidatePath("/admin/settings/webdesign");
}
