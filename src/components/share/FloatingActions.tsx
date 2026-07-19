import { LanguagePicker } from "@/components/language";
import { ShareButton } from "./ShareButton";
import "./floating-actions.css";

/**
 * Bottom-right floating dock: the share button stacked above the language
 * picker. One fixed container, right-aligned, so both widgets hug the same
 * edge and their popovers open upward into free space.
 */
export function FloatingActions({ locale }: { locale: string }) {
  return (
    <div className="vv-dock">
      <ShareButton locale={locale} />
      <LanguagePicker locale={locale} />
    </div>
  );
}
