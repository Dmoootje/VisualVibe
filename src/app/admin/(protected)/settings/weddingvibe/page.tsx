import { getWeddingVibeContent } from "@/lib/firestore/weddingvibe";
import { WeddingVibeManager } from "@/components/admin/WeddingVibeManager";

export const dynamic = "force-dynamic";

export default async function AdminWeddingVibePage() {
  const content = await getWeddingVibeContent();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">WeddingVibe</h1>
      <p className="mb-8 max-w-2xl text-sm text-white/55">
        Beheer de prijzen van de investeringstabel en alle beelden van de WeddingVibe-pagina
        (/trouwfotograaf-limburg). Wijzigingen staan binnen een minuut live.
      </p>
      <WeddingVibeManager initialContent={content} />
    </div>
  );
}
