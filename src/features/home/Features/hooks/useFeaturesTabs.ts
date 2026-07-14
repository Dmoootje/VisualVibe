import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function useFeaturesTabs() {
    const [activeTab, setActiveTab] = useState("webdesign");
    const isMobile = useIsMobile();

    const handleTabChange = (value: string) => {
        setActiveTab(value);

        if (isMobile) {
            window.requestAnimationFrame(() => {
                const element = document.querySelector(
                    `[data-feature-content="${value}"]`
                );
                if (element) {
                    const yOffset = -80;
                    const y =
                        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
                }
            });
        }
    };

    return {
        activeTab,
        handleTabChange,
    };
}
