import { Great_Vibes, Lora } from "next/font/google";

// These families belong only to the WeddingVibe one-pager. Keeping them in its
// route layout prevents unrelated VisualVibe pages from preloading them.
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});
const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export default function WeddingVibeLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${greatVibes.variable} ${lora.variable}`}>{children}</div>;
}
