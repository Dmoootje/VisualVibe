import { getWebdesignImages } from "@/lib/firestore/webdesignImages";
import { webdesignProjects, WEBDESIGN_IMAGE_SLOTS, imageKey } from "@/data/webdesignShowcase";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";

const aspectForSlot: Record<string, string> = {
  thumb: "aspect-video",
  "1": "aspect-video",
  "2": "aspect-video",
  "3": "aspect-[3/4]",
  "4": "aspect-[1/2]",
};

export default async function AdminWebdesignSettingsPage() {
  const images = await getWebdesignImages();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Webdesign realisaties</h1>
        <p className="mt-1 text-sm text-white/60">
          Beheer de afbeeldingen van de webdesign-dienstpagina: de hero-preview en per project de
          thumbnail, hoofdscreenshot en drie device-screenshots (desktop, tablet, mobiel).
        </p>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 border-b border-white/10 pb-2 text-lg font-semibold">Hero-preview</h2>
        <div className="max-w-xs">
          <ImageUploadField imageKey="hero" label="Browser-preview" initialUrl={images.hero} />
        </div>
      </section>

      <div className="flex flex-col gap-10">
        {webdesignProjects.map((p, i) => (
          <section key={p.id}>
            <h2 className="mb-3 border-b border-white/10 pb-2 text-lg font-semibold">
              {String(i + 1).padStart(2, "0")}. {p.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {WEBDESIGN_IMAGE_SLOTS.map(({ slot, label }) => (
                <ImageUploadField
                  key={slot}
                  imageKey={imageKey(p.id, slot)}
                  label={label}
                  initialUrl={images[imageKey(p.id, slot)]}
                  aspect={aspectForSlot[slot]}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
