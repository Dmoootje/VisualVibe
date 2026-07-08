"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link
        href={`/kennisbank/${post.slug}`}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden h-full flex flex-col hover:border-white/20 transition-all"
      >
        <BlogCardImage image={post.ogImage} title={post.title} category={post.category} />
        <BlogCardContent post={post} />
      </Link>
    </motion.div>
  );
}

function BlogCardImage({
  image,
  title,
  category,
}: {
  image?: string;
  title: string;
  category: string;
}) {
  return (
    <div className="relative h-44 sm:h-48 overflow-hidden">
      {image ? (
        <Image
          src={image}
          alt={`Uitgelichte afbeelding voor artikel: ${title}`}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-red-500/20 to-amber-500/20" aria-hidden="true" />
      )}
      <div
        className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full"
        aria-label={`Categorie: ${category}`}
      >
        {category}
      </div>
    </div>
  );
}

function BlogCardContent({ post }: { post: BlogPost }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-4 sm:p-5 flex-1 flex flex-col">
      <div className="flex items-center gap-3 text-white/60 text-xs sm:text-sm mb-2 sm:mb-3 flex-wrap">
        <div className="flex items-center gap-1" aria-label={`Gepubliceerd op: ${formattedDate}`}>
          <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
          <span>{formattedDate}</span>
        </div>
        {post.readingTime && (
          <div className="flex items-center gap-1" aria-label={`Leestijd: ${post.readingTime}`}>
            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
            <span>{post.readingTime}</span>
          </div>
        )}
      </div>

      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 line-clamp-2">{post.title}</h3>
      <p className="text-white/70 text-sm sm:text-base mb-4 flex-1 line-clamp-3">{post.excerpt}</p>

      <span className="inline-flex items-center text-amber-400 group-hover:text-amber-300 text-sm sm:text-base">
        Lees meer
        <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
      </span>
    </div>
  );
}
