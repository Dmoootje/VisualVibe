"use client";

import { MessagesSquare, ListChecks, PenTool, Rocket, LineChart, Sparkles } from "lucide-react";
import { ProcessCard } from "@/features/home/HowItWorks/components/ProcessCard";
import type { ProcessStep } from "@/features/home/HowItWorks/config/process.config";
import type { ServiceProcessStep } from "@/types/service";

// Neutral icon set cycled by step position so the cards match the homepage
// "Zo werken we" blocks visually, even though service process steps only carry
// a title + description (no per-step icon of their own).
const stepIcons = [
  <MessagesSquare className="h-5 w-5" key="i0" />,
  <ListChecks className="h-5 w-5" key="i1" />,
  <PenTool className="h-5 w-5" key="i2" />,
  <Rocket className="h-5 w-5" key="i3" />,
  <LineChart className="h-5 w-5" key="i4" />,
  <Sparkles className="h-5 w-5" key="i5" />,
];

/**
 * The homepage "Zo werken we" card design, without the track tabs: renders one
 * service's own process steps as identical neon step-cards. Used on the service
 * detail pages so their "Hoe we werken" section matches the home section.
 */
export function ProcessSteps({ steps }: { steps: ServiceProcessStep[] }) {
  const items: ProcessStep[] = steps.map((step, index) => ({
    number: String(index + 1).padStart(2, "0"),
    title: step.title,
    description: step.description,
    icon: stepIcons[index % stepIcons.length],
  }));

  return (
    <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((step, index) => (
        <li key={step.number}>
          <ProcessCard step={step} index={index} />
        </li>
      ))}
    </ol>
  );
}
