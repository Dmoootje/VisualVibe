import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import NextLink from "next/link";
import { blogConfig } from "../config/articles.config";

export function BlogHeader({ locale = "nl" }: { locale?: "nl" | "en" }) {
  const en = locale === "en";
  return (
    <div className="home-reveal-up flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
      <div>
        <h2
          id="blog-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3"
        >
          {en ? "From our knowledge base" : blogConfig.title}
        </h2>
        <p className="text-base sm:text-lg text-white/70 max-w-2xl">
          {en ? "Practical articles on web design, online visibility and visual content." : blogConfig.subtitle}
        </p>
      </div>
      <div className="mt-6 md:mt-0">
        <Button
          asChild
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 text-sm sm:text-base focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
        >
          {en ? <NextLink href="/en/kennisbank/" aria-label="View all knowledge-base articles">
            View all articles
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </NextLink> : <Link href="/kennisbank" aria-label="Bekijk alle kennisbank-artikelen">
            {blogConfig.viewAllText}<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>}
        </Button>
      </div>
    </div>
  );
}
