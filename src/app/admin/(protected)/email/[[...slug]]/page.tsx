import { EmailClientApp } from "@/components/admin/email/EmailClientApp";

export const dynamic = "force-dynamic";

export default async function AdminEmailPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return <EmailClientApp initialSlug={slug ?? []} />;
}
