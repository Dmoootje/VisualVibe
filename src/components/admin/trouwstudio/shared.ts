import type { WeddingAlbum, WeddingPhoto, WeddingPhotoStatus, WeddingProject } from "@/features/trouwstudio/types";

// Gedeeld contract voor de Trouwstudio-tabs: ProjectDetail houdt de
// fotolijst/albumstate vast en geeft die met setters door aan de tabs.

export type ProjectTabProps = {
  project: WeddingProject;
  photos: WeddingPhoto[];
  setPhotos: React.Dispatch<React.SetStateAction<WeddingPhoto[]>>;
  album: WeddingAlbum | null;
  setAlbum: React.Dispatch<React.SetStateAction<WeddingAlbum | null>>;
  /** "claude" of "mock" (mock = Demonstratiemodus-banner tonen). */
  aiProviderId: string;
  /** Navigeer naar een andere tab (bv. foto openen in de editor). */
  openTab: (tab: string, photoId?: string) => void;
  /** Foto die in de editor geopend moet worden. */
  editorPhotoId: string | null;
};

export const inputClasses =
  "w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-amber-500/70 disabled:cursor-not-allowed disabled:opacity-50";

export const PHOTO_STATUS_BADGE: Record<WeddingPhotoStatus, string> = {
  geupload: "bg-white/10 text-white/60",
  wacht_op_analyse: "bg-sky-500/15 text-sky-300",
  wordt_geanalyseerd: "bg-sky-500/25 text-sky-200",
  voorstel_beschikbaar: "bg-amber-500/20 text-amber-300",
  goedgekeurd: "bg-emerald-500/15 text-emerald-300",
  handmatig_aangepast: "bg-violet-500/15 text-violet-300",
  afgekeurd: "bg-red-500/15 text-red-300",
  afgewerkt: "bg-emerald-500/25 text-emerald-200",
  export_klaar: "bg-emerald-500/25 text-emerald-200",
  fout: "bg-red-500/25 text-red-200",
};

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}
