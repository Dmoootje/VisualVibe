import { getCurrentAdmin } from "@/lib/auth/session";
import { getProfile } from "@/lib/firestore/profiles";
import { businessConfig } from "@/config/business.config";
import { SettingsProfileForm } from "@/components/admin/SettingsProfileForm";

export const dynamic = "force-dynamic";

export default async function AdminProfielPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    // De (protected) layout redirect al; dit is enkel een type-guard.
    return null;
  }
  const profile = await getProfile(admin.uid);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Profiel</h1>
      <p className="mb-6 max-w-xl text-sm text-white/60">
        Je naam en profielfoto. De foto wordt als auteursfoto getoond bij kennisbankartikels en op
        de blogcards, in plaats van het standaard icoon.
      </p>
      <SettingsProfileForm
        defaultName={profile?.name ?? businessConfig.founder}
        initialPhotoUrl={profile?.photoUrl}
        email={admin.email}
      />
    </div>
  );
}
