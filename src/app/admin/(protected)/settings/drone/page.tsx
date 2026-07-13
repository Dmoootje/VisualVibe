import { getDroneShowcase } from "@/lib/firestore/droneShowcase";
import { DroneShowcaseManager } from "@/components/admin/DroneShowcaseManager";

export const dynamic = "force-dynamic";

export default async function AdminDroneSettingsPage() {
  const { photos, videos } = await getDroneShowcase();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Drone &amp; FPV media</h1>
        <p className="mt-1 text-sm text-white/60">
          Beheer de foto&apos;s (dronefotografie) en video&apos;s (dronevideografie) in de realisaties-band
          op de Drone &amp; FPV-dienstpagina. Upload foto&apos;s, plak YouTube-links, sleep de volgorde met de
          pijltjes en sla op. Wijzigingen zijn meteen live.
        </p>
      </div>

      <DroneShowcaseManager initialPhotos={photos} initialVideos={videos} />
    </div>
  );
}
